import assert from "node:assert/strict";
import crypto from "node:crypto";
import { after, before, test } from "node:test";
import bcrypt from "bcryptjs";

import { createApp, verifyRecaptchaToken } from "../server.mjs";

const oauthStates = new Map();
const sessions = new Map();
const passwordUsers = new Map();
const actionTokens = new Map();
const sentEmails = [];
let server;
let baseUrl;
let authenticatedCookie = "";
let accountState = { profile: null, workspaces: [] };
const recaptchaTokens = [];
const portalSessions = new Map();
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
    return {
      id: "40aa7e34-66fd-42d9-b586-93e65607b670",
      email: profile.email,
      full_name: profile.name,
      avatar_url: profile.picture,
    };
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
  async saveActionToken(record) {
    actionTokens.set(`${record.actionType}:${record.digest}`, record.userId);
  },
  async takeActionToken({ digest, actionType }) {
    const key = `${actionType}:${digest}`;
    const userId = actionTokens.get(key);
    actionTokens.delete(key);
    if (userId && actionType === "verify_email") {
      for (const user of passwordUsers.values()) {
        if (user.id === userId) user.email_verified = true;
      }
    }
    return userId || null;
  },
  async updatePassword(userId, passwordHash) {
    for (const user of passwordUsers.values()) {
      if (user.id === userId) user.password_hash = passwordHash;
    }
  },
  async createSession(record) {
    const passwordUser = [...passwordUsers.values()].find((user) => user.id === record.userId);
    sessions.set(record.sessionDigest, {
      id: record.userId,
      email: passwordUser?.email || "user@example.com",
      full_name: passwordUser?.full_name || "User Test",
      avatar_url: passwordUser?.avatar_url || "https://example.com/avatar.png",
      password_hash: passwordUser?.password_hash || "",
      provider: passwordUser ? "password" : "google",
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
    productDomainEnsurer: async () => {},
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
  assert.equal(sentEmails.length, 1);
  assert.equal(sentEmails[0].from, "MOTOVAX <onboarding@motovax.ai>");

  const verificationUrl = sentEmails[0].text.match(/http:\/\/127\.0\.0\.1\/api\/auth\/verify-email\?token=[^\s]+/)[0];
  const verificationTarget = new URL(verificationUrl);
  const verification = await fetch(`${baseUrl}${verificationTarget.pathname}${verificationTarget.search}`, { redirect: "manual" });
  assert.equal(verification.status, 302);
  assert.match(verification.headers.get("location"), /email=verified/);

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
      fullName: "User Test",
      avatarUrl: "https://example.com/avatar.png",
      provider: "google",
    },
    profile: null,
    workspaces: [],
  });
});

test("callback Google mode portal membuat sesi tenant dan mengarah ke landing", async () => {
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
    assert.equal(location.origin, "https://motovax.ai");
    const sessionToken = new URLSearchParams(location.hash.replace(/^#/, "")).get("portal_session");
    assert.ok(sessionToken.length >= 48);
    assert.ok(portalSessions.has(digest(sessionToken)));
  } finally {
    googleProfileEmail = "user@example.com";
  }
});

test("callback Google mode portal menolak email yang belum menjadi user tenant", async () => {
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

test("portal login tenant membawa profil, billing, logout, dan handoff workspace", async () => {
  const login = await fetch(`${baseUrl}/api/portal/login`, {
    method: "POST",
    headers: { origin: "http://127.0.0.1", "content-type": "application/json" },
    body: JSON.stringify({ identifier: "owner", password: "rahasia123" }),
  });
  assert.equal(login.status, 200);
  const loginPayload = await login.json();
  assert.equal(loginPayload.authenticated, true);
  assert.equal(loginPayload.user.displayName, "Owner Dealer");
  assert.equal(loginPayload.user.tenant.domain, "dealer-test.motovax.com");
  assert.equal(loginPayload.user.canViewBilling, true);
  assert.ok(loginPayload.token.length >= 32);

  const authorization = `Bearer ${loginPayload.token}`;
  const me = await fetch(`${baseUrl}/api/portal/me`, {
    headers: { authorization, origin: "https://motovax.ai" },
  });
  assert.equal(me.status, 200);
  assert.equal(me.headers.get("access-control-allow-origin"), "https://motovax.ai");
  assert.equal((await me.json()).user.role, "Admin");

  const billing = await fetch(`${baseUrl}/api/portal/billing`, {
    headers: { authorization, origin: "https://motovax.ai" },
  });
  assert.equal(billing.status, 200);
  const billingPayload = await billing.json();
  assert.equal(billingPayload.tenant_name, "Dealer Test");
  assert.equal(billingPayload.member_count, 1);
  assert.deepEqual(billingPayload.enabled_features, ["inventory_management", "crm_autopilot", "billing_menu"]);

  const enter = await fetch(`${baseUrl}/api/portal/workspace/enter`, {
    method: "POST",
    headers: { authorization, origin: "https://motovax.ai", "content-type": "application/json" },
    body: JSON.stringify({ destination: "/billing" }),
  });
  assert.equal(enter.status, 200);
  const enterUrl = new URL((await enter.json()).redirectUrl);
  assert.equal(enterUrl.origin, "https://dealer-test.motovax.com");
  assert.equal(enterUrl.pathname, "/magic-login");
  assert.equal(enterUrl.searchParams.get("token"), "handoff-token-1");
  assert.equal(enterUrl.searchParams.get("redirect"), "/billing");

  const logout = await fetch(`${baseUrl}/api/portal/logout`, {
    method: "POST",
    headers: { authorization, origin: "https://motovax.ai" },
  });
  assert.equal(logout.status, 204);
  const expired = await fetch(`${baseUrl}/api/portal/me`, {
    headers: { authorization, origin: "https://motovax.ai" },
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
  assert.equal(payload.user.tenant.domain, "dealer-test.motovax.com");
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

test("penyelesaian onboarding membuat sesi portal untuk redirect login otomatis", async () => {
  accountState = { profile: { modules: ["ims"] }, workspaces: [] };
  const response = await fetch(`${baseUrl}/api/onboarding/complete`, {
    method: "POST",
    headers: {
      cookie: authenticatedCookie,
      origin: "http://127.0.0.1",
      "content-type": "application/json",
    },
    body: JSON.stringify({ recaptchaToken: "valid-recaptcha-token" }),
  });
  assert.equal(response.status, 202);
  const payload = await response.json();
  assert.equal(payload.workspace.ready, false);
  assert.equal(payload.portalSession.returnUrl, "https://motovax.ai/");
  assert.ok(payload.portalSession.token.length >= 48);

  const me = await fetch(`${baseUrl}/api/portal/me`, {
    headers: {
      authorization: `Bearer ${payload.portalSession.token}`,
      origin: "https://motovax.ai",
    },
  });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).authenticated, true);
});
