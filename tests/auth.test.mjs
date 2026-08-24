import assert from "node:assert/strict";
import crypto from "node:crypto";
import { after, before, test } from "node:test";
import bcrypt from "bcryptjs";

import { buildBillingPackages, createApp, verifyRecaptchaToken } from "../server.mjs";

const oauthStates = new Map();
const sessions = new Map();
const googleUsers = new Map();
const passwordUsers = new Map();
const actionTokens = new Map();
const sentEmails = [];
let server;
let baseUrl;
let authenticatedCookie = "";
let accountState = { profile: null, workspaces: [] };
const recaptchaTokens = [];
const portalSessions = new Map();
const domainEnsureCalls = [];
let domainEnsureHandler = async () => {};
let portalPasswordHash = "";
let otherPortalPasswordHash = "";

const config = {
  nodeEnv: "test",
  port: 0,
  publicDir: process.cwd(),
  publicBaseUrl: "http://127.0.0.1",
  oauthSuccessUrl: "http://127.0.0.1/onboarding.html",
  googleClientId: "test-client.apps.googleusercontent.com",
  googleClientSecret: "test-client-secret",
  googleRedirectUri: "http://127.0.0.1/api/auth/google/callback",
  sessionSecret: "test-session-secret-with-at-least-32-characters",
  databaseUrl: "postgres://test",
  tenantDomainSuffix: "motovax.com",
  workspaceEntryBaseUrl: "https://workspace.motovax.com",
  recaptchaProjectId: "motovax-test",
  recaptchaSiteKey: "test-site-key",
  recaptchaApiKey: "test-api-key",
  recaptchaAction: "complete_onboarding",
  recaptchaScoreThreshold: 0.5,
  recaptchaExpectedHostname: "127.0.0.1",
  authEmailFrom: "onboarding@motovax.ai",
  trustProxy: false,
};

const store = {
  async healthcheck() {},
  async saveOAuthState(record) {
    oauthStates.set(record.stateDigest, record);
  },
  async takeOAuthState(stateDigest) {
    const record = oauthStates.get(stateDigest);
    oauthStates.delete(stateDigest);
    if (!record) return null;
    return {
      code_verifier: record.codeVerifier,
      nonce: record.nonce,
      auth_mode: record.authMode,
    };
  },
  async upsertGoogleUser(profile) {
    const user = {
      id: "40aa7e34-66fd-42d9-b586-93e65607b670",
      email: profile.email,
      email_verified: true,
      full_name: profile.name,
      avatar_url: profile.picture,
      provider: "google",
    };
    googleUsers.set(user.id, user);
    return user;
  },
  async createPasswordUser({ email, fullName, passwordHash, authenticatedUserId = "" }) {
    const existing = passwordUsers.get(email);
    if (existing?.email_verified && existing.id !== authenticatedUserId) {
      const error = new Error("Akun dengan email tersebut sudah terdaftar.");
      error.code = "account_exists";
      throw error;
    }
    const user = existing || { id: crypto.randomUUID(), email, avatar_url: "", email_verified: false };
    user.full_name = fullName;
    user.password_hash = passwordHash;
    passwordUsers.set(email, user);
    return user;
  },
  async findPasswordUser(email) {
    return passwordUsers.get(email) || null;
  },
  async findPasswordUserById(userId) {
    return [...passwordUsers.values()].find((user) => user.id === userId) || null;
  },
  async saveActionToken(record) {
    for (const token of actionTokens.values()) {
      if (token.userId === record.userId && token.actionType === record.actionType && !token.usedAt) {
        token.usedAt = Date.now();
      }
    }
    actionTokens.set(`${record.actionType}:${record.digest}`, {
      ...record,
      createdAt: Date.now(),
      usedAt: null,
    });
  },
  async findActionToken({ digest, actionType }) {
    const token = actionTokens.get(`${actionType}:${digest}`);
    if (!token || token.usedAt || new Date(token.expiresAt).getTime() <= Date.now()) return null;
    return token.userId;
  },
  async getActionTokenStatus({ digest, actionType }) {
    const token = actionTokens.get(`${actionType}:${digest}`);
    if (!token) return "invalid";
    if (token.usedAt) return "used";
    if (new Date(token.expiresAt).getTime() <= Date.now()) return "expired";
    return "active";
  },
  async getActionTokenResendDelay({ userId, actionType, cooldownSeconds }) {
    const latest = [...actionTokens.values()]
      .filter((token) => token.userId === userId && token.actionType === actionType)
      .reduce((max, token) => Math.max(max, token.createdAt), 0);
    return Math.max(0, Math.ceil((latest + cooldownSeconds * 1000 - Date.now()) / 1000));
  },
  async takeActionToken({ digest, actionType }) {
    const key = `${actionType}:${digest}`;
    const token = actionTokens.get(key);
    if (!token || token.usedAt || new Date(token.expiresAt).getTime() <= Date.now()) return null;
    token.usedAt = Date.now();
    const userId = token.userId;
    if (userId && actionType === "verify_email") {
      for (const user of passwordUsers.values()) {
        if (user.id === userId) user.email_verified = true;
      }
      for (const pendingToken of actionTokens.values()) {
        if (pendingToken.userId === userId && pendingToken.actionType === "pending_signup" && !pendingToken.usedAt) {
          pendingToken.usedAt = Date.now();
        }
      }
    }
    return userId || null;
  },
  async deletePendingPasswordUser(userId) {
    const entry = [...passwordUsers.entries()].find(([, user]) => user.id === userId);
    if (!entry || entry[1].email_verified) return false;
    passwordUsers.delete(entry[0]);
    for (const [key, token] of actionTokens.entries()) {
      if (token.userId === userId) actionTokens.delete(key);
    }
    return true;
  },
  async updatePassword(userId, passwordHash) {
    for (const user of passwordUsers.values()) {
      if (user.id === userId) user.password_hash = passwordHash;
    }
  },
  async createSession(record) {
    const passwordUser = [...passwordUsers.values()].find((user) => user.id === record.userId);
    const googleUser = googleUsers.get(record.userId);
    sessions.set(record.sessionDigest, {
      id: record.userId,
      email: passwordUser?.email || googleUser?.email || "user@example.com",
      email_verified: passwordUser?.email_verified ?? googleUser?.email_verified ?? true,
      full_name: passwordUser?.full_name || googleUser?.full_name || "User Test",
      avatar_url: passwordUser?.avatar_url || googleUser?.avatar_url || "https://example.com/avatar.png",
      password_hash: passwordUser?.password_hash || "",
      provider: passwordUser ? "password" : googleUser?.provider || "google",
    });
  },
  async findSession(digest) {
    return sessions.get(digest) || null;
  },
  async getAccountState() {
    return accountState;
  },
  async provisionWorkspace() {
    return {
      workspace: {
        id: "tenant-1",
        name: "Dealer Test",
        domain: "dealer-test.motovax.com",
        app_user_id: "app-user-1",
      },
      handoffToken: "onboarding-handoff-token",
    };
  },
  async findPortalUsers({ identifier }) {
    const owner = {
      id: "app-user-1",
      username: "owner",
      display_name: "Owner Dealer",
      email: "owner@dealer.test",
      password_hash: portalPasswordHash,
      onboarding_password_hash: "",
      tenant_id: "tenant-1",
      tenant_name: "Dealer Test",
      tenant_config: { features: { billing_menu: true } },
      domain: "dealer-test.motovax.com",
      role: "Admin",
      permissions: ["billing:read", "tenant:read"],
    };
    if (identifier === "owner" || identifier === "owner@dealer.test") return [owner];
    const other = {
      ...owner,
      id: "app-user-2",
      username: "shared",
      email: "other@dealer.test",
      password_hash: otherPortalPasswordHash,
      tenant_id: "tenant-2",
      tenant_name: "Dealer Lain",
      domain: "dealer-lain.motovax.com",
    };
    if (identifier === "shared") return [{ ...owner, username: "shared" }, other];
    if (identifier === "ambiguous") return [
      { ...owner, username: "ambiguous" },
      { ...other, username: "ambiguous", password_hash: portalPasswordHash },
    ];
    return [];
  },
  async findPortalPasswordResetCandidates({ email, domain = "" }) {
    if (email !== "owner@dealer.test") return [];
    if (domain && domain !== "dealer-test.motovax.com") return [];
    return [{
      id: "app-user-1",
      tenant_id: "tenant-1",
      username: "owner",
      display_name: "Owner Dealer",
      email: "owner@dealer.test",
      password_hash: portalPasswordHash,
      onboarding_password_hash: "",
      tenant_name: "Dealer Test",
      domain: "dealer-test.motovax.com",
    }];
  },
  async findPortalPasswordResetUser({ userId, tenantId }) {
    if (userId !== "app-user-1" || tenantId !== "tenant-1") return null;
    return {
      id: "app-user-1",
      tenant_id: "tenant-1",
      username: "owner",
      display_name: "Owner Dealer",
      email: "owner@dealer.test",
      password_hash: portalPasswordHash,
      onboarding_password_hash: "",
      tenant_name: "Dealer Test",
      domain: "dealer-test.motovax.com",
    };
  },
  async updatePortalUserPassword({ userId, tenantId, passwordHash }) {
    if (userId !== "app-user-1" || tenantId !== "tenant-1") return false;
    portalPasswordHash = passwordHash;
    return true;
  },
  async createPortalSession(record) {
    portalSessions.set(record.sessionDigest, {
      id: record.appUserId,
      username: "owner",
      display_name: "Owner Dealer",
      email: "owner@dealer.test",
      tenant_id: record.tenantId,
      tenant_name: "Dealer Test",
      tenant_config: { features: { billing_menu: true } },
      domain: "dealer-test.motovax.com",
      role: "Admin",
      permissions: ["billing:read", "tenant:read"],
    });
  },
  async findPortalSession(sessionDigest) {
    return portalSessions.get(sessionDigest) || null;
  },
  async getPortalBilling(tenantId) {
    const packages = buildBillingPackages(
      { inventory_management: true, crm_autopilot: true },
      [{ package_id: "inventory_falcon", used_credits: 125 }],
    );
    return {
      tenant_id: tenantId,
      tenant_name: "Dealer Test",
      period_start: "2026-08-01T00:00:00.000Z",
      period_end: "2026-09-01T00:00:00.000Z",
      member_count: 1,
      max_users: 25,
      max_listings: 500,
      enabled_features: ["inventory_management", "crm_autopilot", "billing_menu"],
      members: [{ id: "app-user-1", display_name: "Owner Dealer", username: "owner", roles: "Admin" }],
      packages,
      total_monthly_price: 4_500_000,
      included_credits: 500,
      used_credits: 125,
      remaining_credits: 375,
      billing_configured: false,
      invoice_status: "not_configured",
    };
  },
  async revokePortalSession(sessionDigest) {
    portalSessions.delete(sessionDigest);
  },
  async createPortalHandoff(appUserId, tenantId) {
    if (appUserId !== "app-user-1" || tenantId !== "tenant-1") return null;
    return {
      workspace: { domain: "dealer-test.motovax.com" },
      handoffToken: "handoff-token-1",
    };
  },
  async createWorkspaceHandoff(_userId, tenantId) {
    if (tenantId !== "tenant-1") return null;
    return {
      workspace: { domain: "dealer-test.motovax.com" },
      handoffToken: "workspace-entry-token",
    };
  },
  async isSlugAvailable(slug) {
    return slug !== "workspace-terpakai";
  },
  async revokeSession(digest) {
    sessions.delete(digest);
  },
};

let currentNonce = "";
let googleProfileEmail = "user@example.com";
const oauthClient = {
  generateAuthUrl(options) {
    currentNonce = options.nonce;
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    Object.entries(options).forEach(([key, value]) => {
      url.searchParams.set(key, Array.isArray(value) ? value.join(" ") : String(value));
    });
    return url.toString();
  },
  async getToken({ code, codeVerifier }) {
    assert.equal(code, "valid-code");
    assert.ok(codeVerifier.length > 40);
    return { tokens: { id_token: "signed-test-id-token" } };
  },
  async verifyIdToken() {
    return {
      getPayload() {
        return {
          sub: "google-user-123",
          email: googleProfileEmail,
          email_verified: true,
          name: "User Test",
          picture: "https://example.com/avatar.png",
          nonce: currentNonce,
        };
      },
    };
  },
};

function cookieValue(setCookie, name) {
  const match = setCookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function digest(value) {
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(value)
    .digest("hex");
}

before(async () => {
  portalPasswordHash = await bcrypt.hash("rahasia123", 4);
  otherPortalPasswordHash = await bcrypt.hash("password-lain", 4);
  const app = createApp({
    config,
    store,
    oauthClient,
    mailer: { async sendMail(message) { sentEmails.push(message); } },
    recaptchaVerifier: async (_config, token) => {
      recaptchaTokens.push(token);
      if (token !== "valid-recaptcha-token") {
        const error = new Error("Verifikasi keamanan tidak valid.");
        error.code = "recaptcha_invalid";
        throw error;
      }
      return { score: 0.9 };
    },
    productDomainEnsurer: (...args) => {
      domainEnsureCalls.push(args[1]);
      return domainEnsureHandler(...args);
    },
  });
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("health menyatakan OAuth siap", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    oauthReady: true,
    recaptchaReady: true,
    missing: [],
  });
});

test("config publik hanya mengekspos site key dan action reCAPTCHA", async () => {
  const response = await fetch(`${baseUrl}/api/config`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload, {
    recaptcha: {
      enabled: true,
      siteKey: "test-site-key",
      action: "complete_onboarding",
    },
  });
  assert.equal(JSON.stringify(payload).includes(config.recaptchaApiKey), false);
});

test("assessment reCAPTCHA memvalidasi action, hostname, dan skor", async () => {
  const validFetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.event.token, "browser-token");
    assert.equal(body.event.expectedAction, "complete_onboarding");
    return new Response(JSON.stringify({
      tokenProperties: {
        valid: true,
        action: "complete_onboarding",
        hostname: "127.0.0.1",
      },
      riskAnalysis: { score: 0.9 },
    }), { status: 200, headers: { "content-type": "application/json" } });
  };
  assert.deepEqual(await verifyRecaptchaToken(config, "browser-token", validFetch), { score: 0.9 });

  await assert.rejects(
    verifyRecaptchaToken(config, "browser-token", async () => new Response(JSON.stringify({
      tokenProperties: { valid: true, action: "other_action", hostname: "127.0.0.1" },
      riskAnalysis: { score: 0.9 },
    }), { status: 200 })),
    { code: "recaptcha_invalid" },
  );

  await assert.rejects(
    verifyRecaptchaToken(config, "browser-token", async () => new Response(JSON.stringify({
      tokenProperties: { valid: true, action: "complete_onboarding", hostname: "127.0.0.1" },
      riskAnalysis: { score: 0.2 },
    }), { status: 200 })),
    { code: "recaptcha_low_score" },
  );
});

test("start membuat state, nonce, PKCE, dan cookie HttpOnly", async () => {
  const response = await fetch(`${baseUrl}/api/auth/google/start?mode=signup`, {
    redirect: "manual",
  });
  assert.equal(response.status, 302);
  const location = new URL(response.headers.get("location"));
  assert.equal(location.origin, "https://accounts.google.com");
  assert.equal(location.searchParams.get("response_type"), "code");
  assert.equal(location.searchParams.get("code_challenge_method"), "S256");
  assert.ok(location.searchParams.get("state"));
  assert.ok(location.searchParams.get("nonce"));
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(response.headers.get("set-cookie"), /SameSite=Lax/i);
});

test("daftar dan login email/password memakai kredensial nyata", async () => {
  const signup = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1" },
    body: JSON.stringify({
      fullName: "Password User",
      email: "password@example.com",
      password: "rahasia123",
    }),
  });
  assert.equal(signup.status, 202);
  const signupBody = await signup.json();
  assert.equal(signupBody.email, "password@example.com");
  assert.equal(signupBody.verificationRequired, true);
  assert.equal(signupBody.resendAfterSeconds, 60);
  assert.equal(sentEmails.length, 1);
  assert.equal(sentEmails[0].from, "MOTOVAX <onboarding@motovax.ai>");
  assert.match(sentEmails[0].text, /Verifikasi Email:/);
  assert.match(sentEmails[0].text, /berlaku selama 24 jam/);
  assert.match(sentEmails[0].html, /^<!doctype html>/);
  assert.match(sentEmails[0].html, /role="presentation"/);
  assert.match(sentEmails[0].html, /Platform Dealer Mobil/);
  assert.match(sentEmails[0].html, />Verifikasi Email<\/a>/);
  assert.match(sentEmails[0].html, /berlaku selama <strong>24 jam<\/strong>/);
  assert.match(sentEmails[0].html, /logo-motovax\.png\?v=email-20260814/);
  assert.doesNotMatch(sentEmails[0].html, /<script/i);

  const pendingSignup = cookieValue(signup.headers.get("set-cookie"), "motovax_pending_signup");
  assert.ok(pendingSignup);
  const pending = await fetch(`${baseUrl}/api/auth/pending-signup`, {
    headers: { cookie: `motovax_pending_signup=${encodeURIComponent(pendingSignup)}` },
  });
  assert.equal(pending.status, 200);
  assert.equal((await pending.json()).email, "password@example.com");

  const unverifiedSession = "unverified-session-token-for-regression-test-123456";
  await store.createSession({
    userId: passwordUsers.get("password@example.com").id,
    sessionDigest: digest(unverifiedSession),
  });
  const unverifiedMe = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: `motovax_session=${encodeURIComponent(unverifiedSession)}` },
  });
  assert.equal(unverifiedMe.status, 401);
  assert.deepEqual(await unverifiedMe.json(), { authenticated: false });

  const resendDuringCooldown = await fetch(`${baseUrl}/api/auth/resend-verification`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://127.0.0.1",
      cookie: `motovax_pending_signup=${encodeURIComponent(pendingSignup)}`,
    },
    body: "{}",
  });
  assert.equal(resendDuringCooldown.status, 429);
  assert.ok((await resendDuringCooldown.json()).retryAfterSeconds > 0);

  const verificationUrl = sentEmails[0].text.match(/http:\/\/127\.0\.0\.1\/api\/auth\/verify-email\?token=[^\s]+/)[0];
  const verificationTarget = new URL(verificationUrl);
  const firstTokenDigest = digest(verificationTarget.searchParams.get("token"));
  actionTokens.get(`verify_email:${firstTokenDigest}`).createdAt = Date.now() - 61_000;

  const resent = await fetch(`${baseUrl}/api/auth/resend-verification`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://127.0.0.1",
      cookie: `motovax_pending_signup=${encodeURIComponent(pendingSignup)}`,
    },
    body: "{}",
  });
  assert.equal(resent.status, 202);
  assert.equal(sentEmails.length, 2);

  const superseded = await fetch(`${baseUrl}${verificationTarget.pathname}${verificationTarget.search}`, { redirect: "manual" });
  assert.equal(superseded.status, 302);
  assert.match(superseded.headers.get("location"), /email=used/);

  const resentVerificationUrl = sentEmails[1].text.match(/http:\/\/127\.0\.0\.1\/api\/auth\/verify-email\?token=[^\s]+/)[0];
  const resentVerificationTarget = new URL(resentVerificationUrl);
  const verification = await fetch(`${baseUrl}${resentVerificationTarget.pathname}${resentVerificationTarget.search}`, { redirect: "manual" });
  assert.equal(verification.status, 302);
  assert.match(verification.headers.get("location"), /email=verified/);
  assert.match(verification.headers.get("set-cookie"), /motovax_pending_signup=;/);

  const invalid = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1" },
    body: JSON.stringify({ email: "password@example.com", password: "salah123" }),
  });
  assert.equal(invalid.status, 401);

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1" },
    body: JSON.stringify({ email: "password@example.com", password: "rahasia123" }),
  });
  assert.equal(login.status, 200);
  assert.equal((await login.json()).authenticated, true);

  const loginSession = cookieValue(login.headers.get("set-cookie"), "motovax_session");
  const sentEmailCount = sentEmails.length;
  const updateFromStepOne = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://127.0.0.1",
      cookie: `motovax_session=${encodeURIComponent(loginSession)}`,
    },
    body: JSON.stringify({
      fullName: "Password User Diperbarui",
      email: "password@example.com",
      password: "rahasia456",
    }),
  });
  assert.equal(updateFromStepOne.status, 200);
  const updatePayload = await updateFromStepOne.json();
  assert.equal(updatePayload.authenticated, true);
  assert.equal(updatePayload.accountUpdated, true);
  assert.equal(updatePayload.user.fullName, "Password User Diperbarui");
  assert.equal(sentEmails.length, sentEmailCount);

  const duplicateWithoutOwnerSession = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1" },
    body: JSON.stringify({
      fullName: "Bukan Pemilik",
      email: "password@example.com",
      password: "rahasia789",
    }),
  });
  assert.equal(duplicateWithoutOwnerSession.status, 409);

  const loginWithUpdatedPassword = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1" },
    body: JSON.stringify({ email: "password@example.com", password: "rahasia456" }),
  });
  assert.equal(loginWithUpdatedPassword.status, 200);
});

test("pendaftaran manual dapat dibatalkan untuk mengganti email", async () => {
  const signup = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1" },
    body: JSON.stringify({
      fullName: "Email Lama",
      email: "ganti-email@example.com",
      password: "rahasia123",
    }),
  });
  assert.equal(signup.status, 202);
  const pendingSignup = cookieValue(signup.headers.get("set-cookie"), "motovax_pending_signup");
  const verificationUrl = sentEmails.at(-1).text.match(/http:\/\/127\.0\.0\.1\/api\/auth\/verify-email\?token=[^\s]+/)[0];
  const verificationTarget = new URL(verificationUrl);
  actionTokens.get(`verify_email:${digest(verificationTarget.searchParams.get("token"))}`).expiresAt = new Date(Date.now() - 1_000);
  const expired = await fetch(`${baseUrl}${verificationTarget.pathname}${verificationTarget.search}`, { redirect: "manual" });
  assert.equal(expired.status, 302);
  assert.match(expired.headers.get("location"), /email=expired/);

  const cancel = await fetch(`${baseUrl}/api/auth/pending-signup`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      origin: "http://127.0.0.1",
      cookie: `motovax_pending_signup=${encodeURIComponent(pendingSignup)}`,
    },
    body: "{}",
  });
  assert.equal(cancel.status, 204);
  assert.equal(passwordUsers.has("ganti-email@example.com"), false);
  assert.match(cancel.headers.get("set-cookie"), /motovax_pending_signup=;/);
});

test("callback menolak state yang tidak cocok", async () => {
  const response = await fetch(
    `${baseUrl}/api/auth/google/callback?code=valid-code&state=invalid`,
    { redirect: "manual", headers: { cookie: "motovax_oauth_state=different" } },
  );
  assert.equal(response.status, 302);
  assert.match(response.headers.get("location"), /oauth=failed/);
  assert.match(response.headers.get("location"), /reason=state/);
});

test("callback membuat session dan endpoint me mengembalikan user", async () => {
  const start = await fetch(`${baseUrl}/api/auth/google/start`, {
    redirect: "manual",
  });
  const stateCookie = cookieValue(
    start.headers.get("set-cookie"),
    "motovax_oauth_state",
  );
  const state = new URL(start.headers.get("location")).searchParams.get("state");
  assert.equal(stateCookie, state);

  const callback = await fetch(
    `${baseUrl}/api/auth/google/callback?code=valid-code&state=${encodeURIComponent(state)}`,
    {
      redirect: "manual",
      headers: { cookie: `motovax_oauth_state=${encodeURIComponent(stateCookie)}` },
    },
  );
  assert.equal(callback.status, 302);
  assert.match(callback.headers.get("location"), /oauth=success/);
  const sessionToken = cookieValue(
    callback.headers.get("set-cookie"),
    "motovax_session",
  );
  assert.ok(sessionToken);
  authenticatedCookie = `motovax_session=${encodeURIComponent(sessionToken)}`;
  assert.ok(sessions.has(digest(sessionToken)));

  const me = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: `motovax_session=${encodeURIComponent(sessionToken)}` },
  });
  assert.equal(me.status, 200);
  assert.deepEqual(await me.json(), {
    authenticated: true,
    user: {
      id: "40aa7e34-66fd-42d9-b586-93e65607b670",
      email: "user@example.com",
      emailVerified: true,
      fullName: "User Test",
      avatarUrl: "https://example.com/avatar.png",
      provider: "google",
    },
    profile: null,
    workspaces: [],
  });
});

test("callback Google mode portal membuat sesi tenant dan langsung ke workspace", async () => {
  googleProfileEmail = "owner@dealer.test";
  try {
    const start = await fetch(`${baseUrl}/api/auth/google/start?mode=portal`, {
      redirect: "manual",
    });
    const stateCookie = cookieValue(start.headers.get("set-cookie"), "motovax_oauth_state");
    const state = new URL(start.headers.get("location")).searchParams.get("state");
    assert.match(state, /^portal\./);
    assert.equal(stateCookie, state);

    const callback = await fetch(
      `${baseUrl}/api/auth/google/callback?code=valid-code&state=${encodeURIComponent(state)}`,
      {
        redirect: "manual",
        headers: { cookie: `motovax_oauth_state=${encodeURIComponent(stateCookie)}` },
      },
    );
    assert.equal(callback.status, 302);
    const location = new URL(callback.headers.get("location"));
    assert.equal(location.origin, "https://dealer-test.motovax.com");
    assert.equal(location.pathname, "/magic-login");
    assert.equal(location.searchParams.get("token"), "handoff-token-1");
    const sessionToken = cookieValue(callback.headers.get("set-cookie"), "motovax_portal_session");
    assert.ok(sessionToken.length >= 48);
    assert.ok(portalSessions.has(digest(sessionToken)));
  } finally {
    googleProfileEmail = "user@example.com";
  }
});

test("callback Google mode portal menampilkan info pendaftaran saat tenant tidak ditemukan", async () => {
  googleProfileEmail = "belum-terdaftar@example.com";
  try {
    const start = await fetch(`${baseUrl}/api/auth/google/start?mode=portal`, {
      redirect: "manual",
    });
    const stateCookie = cookieValue(start.headers.get("set-cookie"), "motovax_oauth_state");
    const state = new URL(start.headers.get("location")).searchParams.get("state");
    const callback = await fetch(
      `${baseUrl}/api/auth/google/callback?code=valid-code&state=${encodeURIComponent(state)}`,
      {
        redirect: "manual",
        headers: { cookie: `motovax_oauth_state=${encodeURIComponent(stateCookie)}` },
      },
    );
    const location = new URL(callback.headers.get("location"));
    assert.equal(location.pathname, "/login.html");
    assert.equal(location.searchParams.get("oauth"), "failed");
    assert.equal(location.searchParams.get("reason"), "account_not_found");

    const sessionToken = cookieValue(callback.headers.get("set-cookie"), "motovax_session");
    assert.ok(sessionToken.length >= 48);
    assert.ok(sessions.has(digest(sessionToken)));
    assert.equal(cookieValue(callback.headers.get("set-cookie"), "motovax_portal_session"), "");

    const me = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { cookie: `motovax_session=${encodeURIComponent(sessionToken)}` },
    });
    assert.equal(me.status, 200);
    const payload = await me.json();
    assert.equal(payload.authenticated, true);
    assert.equal(payload.user.email, "belum-terdaftar@example.com");
    assert.equal(payload.user.provider, "google");
    assert.deepEqual(payload.workspaces, []);
  } finally {
    googleProfileEmail = "user@example.com";
  }
});

test("availability workspace menolak nama yang sudah dipakai", async () => {
  const unavailable = await fetch(`${baseUrl}/api/onboarding/slug?slug=workspace-terpakai`, {
    headers: { cookie: authenticatedCookie },
  });
  assert.equal(unavailable.status, 200);
  assert.equal((await unavailable.json()).available, false);

  const available = await fetch(`${baseUrl}/api/onboarding/slug?slug=workspace-baru`, {
    headers: { cookie: authenticatedCookie },
  });
  assert.equal(available.status, 200);
  const payload = await available.json();
  assert.equal(payload.available, true);
  assert.equal(payload.domain, "workspace-baru.motovax.com");
});

test("portal login tenant membuat cookie sesi dan langsung handoff workspace", async () => {
  const login = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "owner", password: "rahasia123" }),
  });
  assert.equal(login.status, 200);
  const loginPayload = await login.json();
  assert.equal(loginPayload.authenticated, true);
  const loginUrl = new URL(loginPayload.redirectUrl);
  assert.equal(loginUrl.origin, "https://dealer-test.motovax.com");
  assert.equal(loginUrl.pathname, "/magic-login");
  assert.equal(loginUrl.searchParams.get("token"), "handoff-token-1");
  const sessionToken = cookieValue(login.headers.get("set-cookie"), "motovax_portal_session");
  assert.ok(sessionToken.length >= 48);

  const enter = await fetch(`${baseUrl}/api/portal/workspace/enter`, {
    method: "POST",
    headers: { cookie: `motovax_portal_session=${encodeURIComponent(sessionToken)}`, origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ destination: "/" }),
  });
  assert.equal(enter.status, 200);
  const enterUrl = new URL((await enter.json()).redirectUrl);
  assert.equal(enterUrl.origin, "https://dealer-test.motovax.com");
  assert.equal(enterUrl.pathname, "/magic-login");
  assert.equal(enterUrl.searchParams.get("token"), "handoff-token-1");
  assert.equal(enterUrl.searchParams.has("redirect"), false);

  const logout = await fetch(`${baseUrl}/api/portal/logout`, {
    method: "POST",
    headers: { cookie: `motovax_portal_session=${encodeURIComponent(sessionToken)}`, origin: "http://127.0.0.1" },
  });
  assert.equal(logout.status, 204);
  const expired = await fetch(`${baseUrl}/api/portal/workspace/enter`, {
    method: "POST",
    headers: { cookie: `motovax_portal_session=${encodeURIComponent(sessionToken)}`, origin: "http://127.0.0.1", "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(expired.status, 401);
});

test("pemulihan password tenant mengirim link terikat akun dan hanya dapat dipakai sekali", async () => {
  const sentBefore = sentEmails.length;
  const forgot = await fetch(`${baseUrl}/api/portal/forgot-password`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ email: "owner@dealer.test", workspace: "dealer-test.motovax.com" }),
  });
  assert.equal(forgot.status, 202);
  assert.equal(sentEmails.length, sentBefore + 1);
  const email = sentEmails.at(-1);
  assert.equal(email.to, "owner@dealer.test");
  assert.match(email.subject, /Dealer Test/);
  const resetUrlText = email.text.split("\n").find((line) => line.includes("/login.html?reset=1"));
  const resetUrl = new URL(resetUrlText);
  const token = resetUrl.searchParams.get("token");
  assert.ok(token);

  const reset = await fetch(`${baseUrl}/api/portal/reset-password`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ token, password: "passwordBaru123" }),
  });
  assert.equal(reset.status, 200);
  assert.equal(await bcrypt.compare("passwordBaru123", portalPasswordHash), true);

  const replay = await fetch(`${baseUrl}/api/portal/reset-password`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ token, password: "passwordLain123" }),
  });
  assert.equal(replay.status, 400);
  assert.equal((await replay.json()).error, "invalid_token");
  portalPasswordHash = await bcrypt.hash("rahasia123", 4);
});

test("logout workspace tenant dapat mencabut cookie portal tanpa membuka endpoint portal lain", async () => {
  const login = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "owner", password: "rahasia123" }),
  });
  assert.equal(login.status, 200);
  const sessionToken = cookieValue(login.headers.get("set-cookie"), "motovax_portal_session");
  assert.ok(sessionToken.length >= 48);
  const authSessionToken = "tenant-logout-auth-session-token-1234567890";
  await store.createSession({
    userId: "40aa7e34-66fd-42d9-b586-93e65607b670",
    sessionDigest: digest(authSessionToken),
  });

  const tenantOrigin = "https://dealer-pro.motovax.com";
  const preflight = await fetch(`${baseUrl}/api/portal/logout`, {
    method: "OPTIONS",
    headers: { origin: tenantOrigin, "access-control-request-method": "POST" },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), tenantOrigin);
  assert.equal(preflight.headers.get("access-control-allow-credentials"), "true");

  const forbiddenEnter = await fetch(`${baseUrl}/api/portal/workspace/enter`, {
    method: "POST",
    headers: {
      cookie: `motovax_portal_session=${encodeURIComponent(sessionToken)}`,
      origin: tenantOrigin,
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(forbiddenEnter.status, 403);

  const logout = await fetch(`${baseUrl}/api/portal/logout`, {
    method: "POST",
    headers: {
      cookie: `motovax_session=${encodeURIComponent(authSessionToken)}; motovax_portal_session=${encodeURIComponent(sessionToken)}`,
      origin: tenantOrigin,
    },
  });
  assert.equal(logout.status, 204);
  assert.equal(logout.headers.get("access-control-allow-origin"), tenantOrigin);
  assert.equal(logout.headers.get("access-control-allow-credentials"), "true");

  const expiredAuth = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: `motovax_session=${encodeURIComponent(authSessionToken)}` },
  });
  assert.equal(expiredAuth.status, 401);
  assert.deepEqual(await expiredAuth.json(), { authenticated: false });

  const expired = await fetch(`${baseUrl}/api/portal/workspace/enter`, {
    method: "POST",
    headers: {
      cookie: `motovax_portal_session=${encodeURIComponent(sessionToken)}`,
      origin: "http://127.0.0.1",
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(expired.status, 401);
});

test("portal login memilih tenant dari password saat username dipakai di beberapa workspace", async () => {
  const response = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "shared", password: "rahasia123" }),
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(new URL(payload.redirectUrl).origin, "https://dealer-test.motovax.com");
});

test("portal login membedakan email belum terdaftar dari password yang keliru", async () => {
  const unknownEmail = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "belum-terdaftar@dealer.test", password: "rahasia123" }),
  });
  assert.equal(unknownEmail.status, 404);
  assert.deepEqual(await unknownEmail.json(), {
    error: "account_not_found",
    message: "Email belum terdaftar di workspace MOTOVAX.",
  });

  const wrongPassword = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "owner@dealer.test", password: "password-salah" }),
  });
  assert.equal(wrongPassword.status, 401);
  assert.equal((await wrongPassword.json()).error, "invalid_credentials");
});

test("portal login menolak kredensial ambigu di beberapa workspace", async () => {
  const response = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "ambiguous", password: "rahasia123" }),
  });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error, "ambiguous_account");
});

test("URL profile dan billing lama dialihkan ke gerbang login", async () => {
  for (const pathName of ["/profile.html", "/billing.html"]) {
    const response = await fetch(`${baseUrl}${pathName}`, { redirect: "manual" });
    assert.equal(response.status, 302);
    assert.equal(new URL(response.headers.get("location")).pathname, "/login.html");
  }
});

test("halaman autentikasi tidak disimpan di cache browser", async () => {
  for (const pathname of ["/login.html", "/onboarding.html"]) {
    const response = await fetch(`${baseUrl}${pathname}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("penyelesaian onboarding ditolak sebelum provisioning tanpa token reCAPTCHA valid", async () => {
  accountState = { profile: { modules: ["ims"] }, workspaces: [] };
  const response = await fetch(`${baseUrl}/api/onboarding/complete`, {
    method: "POST",
    headers: {
      cookie: authenticatedCookie,
      origin: "http://127.0.0.1",
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "recaptcha_invalid");
  assert.deepEqual(recaptchaTokens, [""]);
});

test("penyelesaian onboarding langsung merespons tanpa menunggu provisioning domain", async () => {
  accountState = { profile: { modules: ["ims"] }, workspaces: [] };
  domainEnsureHandler = () => new Promise(() => {});
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/api/onboarding/complete`, {
    method: "POST",
    headers: {
      cookie: authenticatedCookie,
      origin: "http://127.0.0.1",
      "content-type": "application/json",
    },
    body: JSON.stringify({ recaptchaToken: "valid-recaptcha-token" }),
  });
  const responseTime = Date.now() - startedAt;
  domainEnsureHandler = async () => {};
  assert.equal(response.status, 202);
  assert.ok(responseTime < 1000, `respons selesai dalam ${responseTime}ms`);
  const payload = await response.json();
  assert.equal(payload.workspace.ready, true);
  const redirectUrl = new URL(payload.workspace.redirectUrl);
  assert.equal(redirectUrl.origin, "https://workspace.motovax.com");
  assert.equal(redirectUrl.pathname, "/magic-login");
  assert.equal(redirectUrl.searchParams.get("token"), "onboarding-handoff-token");
  assert.equal("portalSession" in payload, false);
  assert.ok(domainEnsureCalls.includes("dealer-test.motovax.com"));
});

test("workspace dapat dimasuki lewat host bersama tanpa menunggu HTTPS domain tenant", async () => {
  accountState = {
    profile: { modules: ["ims"] },
    workspaces: [{ id: "tenant-1", name: "Dealer Test", domain: "dealer-test.motovax.com" }],
  };
  const response = await fetch(`${baseUrl}/api/workspaces/tenant-1/enter`, {
    method: "POST",
    headers: {
      cookie: authenticatedCookie,
      origin: "http://127.0.0.1",
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(response.status, 200);
  const redirectUrl = new URL((await response.json()).redirectUrl);
  assert.equal(redirectUrl.origin, "https://workspace.motovax.com");
  assert.equal(redirectUrl.searchParams.get("token"), "workspace-entry-token");
});
