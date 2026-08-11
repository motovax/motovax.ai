import assert from "node:assert/strict";
import crypto from "node:crypto";
import { after, before, test } from "node:test";

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
  onboardingTeamEmail: "team@motovax.com",
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
  async createPasswordUser({ email, fullName, passwordHash }) {
    if (passwordUsers.has(email)) {
      const error = new Error("Akun dengan email tersebut sudah terdaftar.");
      error.code = "account_exists";
      throw error;
    }
    const user = {
      id: crypto.randomUUID(),
      email,
      full_name: fullName,
      avatar_url: "",
      password_hash: passwordHash,
      email_verified: false,
    };
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
    sessions.set(record.sessionDigest, {
      id: record.userId,
      email: "user@example.com",
      full_name: "User Test",
      avatar_url: "https://example.com/avatar.png",
    });
  },
  async findSession(digest) {
    return sessions.get(digest) || null;
  },
  async getAccountState() {
    return accountState;
  },
  async isSlugAvailable(slug) {
    return slug !== "workspace-terpakai";
  },
  async saveMeetingRequest({ scheduledFor, timezone }) {
    const meeting = {
      id: "meeting-1",
      scheduled_for: scheduledFor,
      timezone,
      status: "requested",
    };
    accountState = { profile: null, workspaces: [], meeting };
    return meeting;
  },
  async revokeSession(digest) {
    sessions.delete(digest);
  },
};

let currentNonce = "";
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
          email: "user@example.com",
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

test("jalur bersama tim menyimpan jadwal meeting dan mengirim notifikasi", async () => {
  const date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  while ([0, 6].includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate() + 1);
  const dateText = date.toISOString().slice(0, 10);
  const response = await fetch(`${baseUrl}/api/onboarding/meeting`, {
    method: "POST",
    headers: {
      cookie: authenticatedCookie,
      origin: "http://127.0.0.1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      date: dateText,
      time: "10:30",
      timezone: "Asia/Jakarta",
      recaptchaToken: "valid-recaptcha-token",
    }),
  });
  assert.equal(response.status, 201);
  const payload = await response.json();
  assert.equal(payload.meeting.id, "meeting-1");
  assert.equal(payload.meeting.timezone, "Asia/Jakarta");
  assert.equal(payload.meeting.status, "requested");
  assert.equal(recaptchaTokens.at(-1), "valid-recaptcha-token");
  assert.equal(sentEmails.at(-2).to, "team@motovax.com");
  assert.equal(sentEmails.at(-1).to, "user@example.com");
});
