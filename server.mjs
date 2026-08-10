import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import { OAuth2Client } from "google-auth-library";
import pg from "pg";

const { Pool } = pg;
const MODULE_PATH = fileURLToPath(import.meta.url);
const MODULE_DIR = path.dirname(MODULE_PATH);

function readConfig(env = process.env) {
  const publicBaseUrl = env.PUBLIC_BASE_URL || "https://onboard.motovax.com";
  const redirectUri =
    env.GOOGLE_OAUTH_REDIRECT_URI ||
    `${publicBaseUrl}/api/auth/google/callback`;

  return {
    nodeEnv: env.NODE_ENV || "development",
    port: Number(env.PORT || 3000),
    publicDir: path.resolve(env.PUBLIC_DIR || MODULE_DIR),
    publicBaseUrl,
    oauthSuccessUrl:
      env.OAUTH_SUCCESS_URL || `${publicBaseUrl}/onboarding.html`,
    googleClientId: env.GOOGLE_OAUTH_CLIENT_ID || "",
    googleClientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    googleRedirectUri: redirectUri,
    sessionSecret: env.SESSION_SECRET || "",
    databaseUrl: env.EXTERNAL_DATABASE_URL || env.DATABASE_URL || "",
    trustProxy: env.TRUST_PROXY !== "false",
  };
}

function validateConfig(config) {
  const publicUrl = new URL(config.publicBaseUrl);
  const redirectUrl = new URL(config.googleRedirectUri);
  const successUrl = new URL(config.oauthSuccessUrl);

  if (redirectUrl.origin !== publicUrl.origin) {
    throw new Error("GOOGLE_OAUTH_REDIRECT_URI harus memakai origin PUBLIC_BASE_URL.");
  }
  if (successUrl.origin !== publicUrl.origin) {
    throw new Error("OAUTH_SUCCESS_URL harus memakai origin PUBLIC_BASE_URL.");
  }
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("base64url");
}

function tokenDigest(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function parseCookies(header = "") {
  return header.split(";").reduce((cookies, entry) => {
    const separator = entry.indexOf("=");
    if (separator < 1) return cookies;
    const key = entry.slice(0, separator).trim();
    const value = entry.slice(separator + 1).trim();
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
    return cookies;
  }, {});
}

function authCookieNames(config) {
  const secure = config.nodeEnv === "production";
  return {
    secure,
    session: secure ? "__Host-motovax_session" : "motovax_session",
    state: secure ? "__Host-motovax_oauth_state" : "motovax_oauth_state",
  };
}

function oauthResultUrl(config, status, reason = "") {
  const target = new URL(config.oauthSuccessUrl);
  target.searchParams.set("oauth", status);
  if (reason) target.searchParams.set("reason", reason);
  return target.toString();
}

function missingOAuthConfig(config, store) {
  const missing = [];
  if (!config.googleClientId) missing.push("GOOGLE_OAUTH_CLIENT_ID");
  if (!config.googleClientSecret) missing.push("GOOGLE_OAUTH_CLIENT_SECRET");
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    missing.push("SESSION_SECRET (minimal 32 karakter)");
  }
  if (!config.databaseUrl || !store) missing.push("EXTERNAL_DATABASE_URL");
  return missing;
}

export async function createPostgresStore(connectionString) {
  const databaseUrl = new URL(connectionString);
  if (
    databaseUrl.searchParams.get("sslmode") === "require" &&
    !databaseUrl.searchParams.has("uselibpqcompat")
  ) {
    databaseUrl.searchParams.set("uselibpqcompat", "true");
  }
  const pool = new Pool({
    connectionString: databaseUrl.toString(),
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS onboarding_users (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      full_name TEXT NOT NULL DEFAULT '',
      avatar_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS onboarding_oauth_accounts (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES onboarding_users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      provider_subject TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (provider, provider_subject)
    );

    CREATE TABLE IF NOT EXISTS onboarding_auth_sessions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES onboarding_users(id) ON DELETE CASCADE,
      token_digest CHAR(64) NOT NULL UNIQUE,
      user_agent TEXT NOT NULL DEFAULT '',
      ip_address TEXT NOT NULL DEFAULT '',
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS onboarding_oauth_states (
      state_digest CHAR(64) PRIMARY KEY,
      code_verifier TEXT NOT NULL,
      nonce TEXT NOT NULL,
      auth_mode TEXT NOT NULL DEFAULT 'signup',
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS onboarding_auth_sessions_user_idx
      ON onboarding_auth_sessions(user_id);
    CREATE INDEX IF NOT EXISTS onboarding_auth_sessions_expiry_idx
      ON onboarding_auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS onboarding_oauth_states_expiry_idx
      ON onboarding_oauth_states(expires_at);
  `);

  return {
    async healthcheck() {
      await pool.query("SELECT 1");
    },

    async saveOAuthState({ stateDigest, codeVerifier, nonce, authMode, expiresAt }) {
      await pool.query("DELETE FROM onboarding_oauth_states WHERE expires_at <= NOW()");
      await pool.query(
        `INSERT INTO onboarding_oauth_states
          (state_digest, code_verifier, nonce, auth_mode, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [stateDigest, codeVerifier, nonce, authMode, expiresAt],
      );
    },

    async takeOAuthState(stateDigest) {
      const result = await pool.query(
        `DELETE FROM onboarding_oauth_states
         WHERE state_digest = $1 AND expires_at > NOW()
         RETURNING code_verifier, nonce, auth_mode`,
        [stateDigest],
      );
      return result.rows[0] || null;
    },

    async upsertGoogleUser(profile) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        let userResult = await client.query(
          `SELECT u.*
           FROM onboarding_oauth_accounts oa
           JOIN onboarding_users u ON u.id = oa.user_id
           WHERE oa.provider = 'google' AND oa.provider_subject = $1
           FOR UPDATE OF u`,
          [profile.subject],
        );

        let user = userResult.rows[0];
        if (!user) {
          userResult = await client.query(
            "SELECT * FROM onboarding_users WHERE email = $1 FOR UPDATE",
            [profile.email],
          );
          user = userResult.rows[0];
        }

        if (!user) {
          const userId = crypto.randomUUID();
          userResult = await client.query(
            `INSERT INTO onboarding_users
              (id, email, email_verified, full_name, avatar_url)
             VALUES ($1, $2, TRUE, $3, $4)
             RETURNING *`,
            [userId, profile.email, profile.name, profile.picture],
          );
          user = userResult.rows[0];
        } else {
          userResult = await client.query(
            `UPDATE onboarding_users
             SET email = $2,
                 email_verified = TRUE,
                 full_name = $3,
                 avatar_url = $4,
                 updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [user.id, profile.email, profile.name, profile.picture],
          );
          user = userResult.rows[0];
        }

        await client.query(
          `INSERT INTO onboarding_oauth_accounts
            (id, user_id, provider, provider_subject)
           VALUES ($1, $2, 'google', $3)
           ON CONFLICT (provider, provider_subject)
           DO UPDATE SET user_id = EXCLUDED.user_id, updated_at = NOW()`,
          [crypto.randomUUID(), user.id, profile.subject],
        );
        await client.query("COMMIT");
        return user;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async createSession({ userId, sessionDigest, userAgent, ipAddress, expiresAt }) {
      await pool.query("DELETE FROM onboarding_auth_sessions WHERE expires_at <= NOW()");
      await pool.query(
        `INSERT INTO onboarding_auth_sessions
          (id, user_id, token_digest, user_agent, ip_address, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [crypto.randomUUID(), userId, sessionDigest, userAgent, ipAddress, expiresAt],
      );
    },

    async findSession(sessionDigest) {
      const result = await pool.query(
        `UPDATE onboarding_auth_sessions s
         SET last_seen_at = NOW()
         FROM onboarding_users u
         WHERE s.user_id = u.id
           AND s.token_digest = $1
           AND s.expires_at > NOW()
         RETURNING u.id, u.email, u.full_name, u.avatar_url`,
        [sessionDigest],
      );
      return result.rows[0] || null;
    },

    async revokeSession(sessionDigest) {
      await pool.query(
        "DELETE FROM onboarding_auth_sessions WHERE token_digest = $1",
        [sessionDigest],
      );
    },

    async close() {
      await pool.end();
    },
  };
}

export function createApp({ config = readConfig(), store = null, oauthClient = null } = {}) {
  validateConfig(config);
  const app = express();
  const cookies = authCookieNames(config);
  const client =
    oauthClient ||
    (config.googleClientId && config.googleClientSecret
      ? new OAuth2Client(
          config.googleClientId,
          config.googleClientSecret,
          config.googleRedirectUri,
        )
      : null);

  if (config.trustProxy) app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
    if (req.path.startsWith("/api/")) {
      res.set("Cache-Control", "no-store");
    }
    next();
  });

  app.get("/health", async (_req, res) => {
    const missing = missingOAuthConfig(config, store);
    try {
      if (store) await store.healthcheck();
      res.status(missing.length ? 503 : 200).json({
        status: missing.length ? "configuration_required" : "ok",
        oauthReady: missing.length === 0,
        missing,
      });
    } catch {
      res.status(503).json({ status: "database_unavailable", oauthReady: false });
    }
  });

  app.get("/api/auth/google/start", async (req, res, next) => {
    try {
      const missing = missingOAuthConfig(config, store);
      if (missing.length || !client) {
        return res.status(503).json({
          error: "oauth_not_configured",
          message: "Google OAuth belum dikonfigurasi pada server.",
          missing,
        });
      }

      const state = randomToken(32);
      const codeVerifier = randomToken(64);
      const nonce = randomToken(32);
      const codeChallenge = sha256(codeVerifier);
      const authMode = req.query.mode === "login" ? "login" : "signup";

      await store.saveOAuthState({
        stateDigest: tokenDigest(state, config.sessionSecret),
        codeVerifier,
        nonce,
        authMode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      res.cookie(cookies.state, state, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
        maxAge: 10 * 60 * 1000,
      });

      const authorizationUrl = client.generateAuthUrl({
        access_type: "online",
        include_granted_scopes: true,
        prompt: "select_account",
        response_type: "code",
        scope: ["openid", "email", "profile"],
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });
      return res.redirect(302, authorizationUrl);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/auth/google/callback", async (req, res, next) => {
    try {
      const missing = missingOAuthConfig(config, store);
      if (missing.length || !client) {
        return res.redirect(302, oauthResultUrl(config, "failed", "configuration"));
      }

      const requestCookies = parseCookies(req.headers.cookie);
      const state = String(req.query.state || "");
      const stateCookie = requestCookies[cookies.state] || "";
      if (!state || !safeEqual(state, stateCookie)) {
        return res.redirect(302, oauthResultUrl(config, "failed", "state"));
      }

      const transaction = await store.takeOAuthState(
        tokenDigest(state, config.sessionSecret),
      );
      res.clearCookie(cookies.state, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
      });
      if (!transaction) {
        return res.redirect(302, oauthResultUrl(config, "failed", "expired"));
      }
      if (req.query.error) {
        return res.redirect(302, oauthResultUrl(config, "denied"));
      }

      const code = String(req.query.code || "");
      if (!code) {
        return res.redirect(302, oauthResultUrl(config, "failed", "code"));
      }

      const tokenResponse = await client.getToken({
        code,
        codeVerifier: transaction.code_verifier,
        redirect_uri: config.googleRedirectUri,
      });
      const idToken = tokenResponse.tokens.id_token;
      if (!idToken) throw new Error("Google tidak mengembalikan ID token.");

      const ticket = await client.verifyIdToken({
        idToken,
        audience: config.googleClientId,
      });
      const payload = ticket.getPayload();
      if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        payload.email_verified !== true ||
        !safeEqual(payload.nonce, transaction.nonce)
      ) {
        throw new Error("Klaim identitas Google tidak valid.");
      }

      const user = await store.upsertGoogleUser({
        subject: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split("@")[0],
        picture: payload.picture || "",
      });
      const sessionToken = randomToken(48);
      await store.createSession({
        userId: user.id,
        sessionDigest: tokenDigest(sessionToken, config.sessionSecret),
        userAgent: String(req.headers["user-agent"] || "").slice(0, 500),
        ipAddress: String(req.ip || "").slice(0, 100),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      res.cookie(cookies.session, sessionToken, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.redirect(302, oauthResultUrl(config, "success"));
    } catch (error) {
      req.oauthError = error;
      return next(error);
    }
  });

  app.get("/api/auth/me", async (req, res, next) => {
    try {
      if (!store || !config.sessionSecret) {
        return res.status(503).json({ authenticated: false });
      }
      const requestCookies = parseCookies(req.headers.cookie);
      const sessionToken = requestCookies[cookies.session];
      if (!sessionToken) return res.status(401).json({ authenticated: false });
      const user = await store.findSession(
        tokenDigest(sessionToken, config.sessionSecret),
      );
      if (!user) return res.status(401).json({ authenticated: false });
      return res.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          provider: "google",
        },
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/auth/logout", async (req, res, next) => {
    try {
      const origin = req.get("origin");
      if (origin && origin !== new URL(config.publicBaseUrl).origin) {
        return res.status(403).json({ error: "invalid_origin" });
      }
      const requestCookies = parseCookies(req.headers.cookie);
      const sessionToken = requestCookies[cookies.session];
      if (sessionToken && store && config.sessionSecret) {
        await store.revokeSession(tokenDigest(sessionToken, config.sessionSecret));
      }
      res.clearCookie(cookies.session, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
      });
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.use((req, res, next) => {
    if (
      /^\/(?:server\.mjs|package(?:-lock)?\.json|Dockerfile|tests|scripts|node_modules|\.git)(?:\/|$)/.test(
        req.path,
      )
    ) {
      return res.status(404).end();
    }
    return next();
  });
  app.use(
    express.static(config.publicDir, {
      dotfiles: "deny",
      extensions: ["html"],
      index: "onboarding.html",
      maxAge: config.nodeEnv === "production" ? "1h" : 0,
    }),
  );

  app.use((error, req, res, _next) => {
    console.error("request_failed", {
      path: req.path,
      message: error instanceof Error ? error.message : "unknown_error",
    });
    if (req.path === "/api/auth/google/callback") {
      return res.redirect(302, oauthResultUrl(config, "failed", "server"));
    }
    return res.status(500).json({ error: "internal_server_error" });
  });

  return app;
}

export async function startServer(env = process.env) {
  const config = readConfig(env);
  validateConfig(config);
  let store = null;
  if (config.databaseUrl) {
    try {
      store = await createPostgresStore(config.databaseUrl);
    } catch (error) {
      console.error("database_initialization_failed", {
        message: error instanceof Error ? error.message : "unknown_error",
      });
    }
  }
  const app = createApp({ config, store });
  const server = app.listen(config.port, "0.0.0.0", () => {
    console.log(`Motovax onboarding listening on :${config.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      if (store) await store.close();
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
  return { app, server, store, config };
}

if (process.argv[1] && path.resolve(process.argv[1]) === MODULE_PATH) {
  await startServer();
}
