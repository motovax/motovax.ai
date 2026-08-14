import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promisify } from "node:util";

import express from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import pg from "pg";

const { Pool } = pg;
const MODULE_PATH = fileURLToPath(import.meta.url);
const MODULE_DIR = path.dirname(MODULE_PATH);
const scryptAsync = promisify(crypto.scrypt);
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PORTAL_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const HANDOFF_TTL_MS = 60 * 1000;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS = 60;
const DOMAIN_PROVISIONING_TIMEOUT_MS = 3_000;
const DOMAIN_PROVISIONING_RETRY_DELAYS_MS = [3_000, 10_000];
const ALLOWED_MODULES = new Set(["ims", "omni", "social", "crm", "dashboard", "insight"]);
const ALLOWED_GOALS = new Set(["conversion", "response", "inventory", "scale"]);
const RESERVED_SLUGS = new Set([
  "api", "app", "assets", "auth", "dss", "internal", "motovax-ai", "onboard", "status", "support", "www",
]);
const MOBIX_TENANT_ID = "4c8bdcb3-c535-4ad6-b2fb-53f5361c8489";
const BILLING_PACKAGE_DEFINITIONS = [
  { id: "core", name: "Core — Platform Integrasi Agentic AI", priceAmount: 1_500_000, includedCredits: 0, enabled: () => true },
  { id: "crm", name: "CRM", priceAmount: 1_500_000, includedCredits: 0, enabled: (features) => features.crm_autopilot === true },
  { id: "omni_jasmine", name: "Omni + Jasmine AI", priceAmount: 2_000_000, includedCredits: 500, enabled: (features) => features.whatsapp_ai === true },
  { id: "inventory_falcon", name: "Inventory + Falcon AI", priceAmount: 1_500_000, includedCredits: 500, enabled: (features) => features.inventory_management === true },
  { id: "ana_analytics", name: "Ana AI — Advanced Analytics", priceAmount: 1_000_000, includedCredits: 0, enabled: (features) => features.data_insight === true || features.one_dashboard === true },
  { id: "social_sora", name: "Social Media + Sora AI", priceAmount: 1_500_000, includedCredits: 500, enabled: (features) => features.social_media_automation === true },
];

export function buildBillingPackages(features = {}, usageRows = []) {
  const usageByPackage = new Map(usageRows.map((row) => [String(row.package_id || ""), Math.max(0, Number(row.used_credits || 0))]));
  return BILLING_PACKAGE_DEFINITIONS
    .filter((definition) => definition.enabled(features))
    .map((definition) => {
      const usedCredits = usageByPackage.get(definition.id) || 0;
      return {
        id: definition.id,
        name: definition.name,
        price_amount: definition.priceAmount,
        billing_cycle: "monthly",
        included_credits: definition.includedCredits,
        used_credits: usedCredits,
        remaining_credits: Math.max(0, definition.includedCredits - usedCredits),
      };
    });
}

function summarizeBillingPackages(packages) {
  return packages.reduce((summary, pkg) => ({
    totalMonthlyPrice: summary.totalMonthlyPrice + pkg.price_amount,
    includedCredits: summary.includedCredits + pkg.included_credits,
    usedCredits: summary.usedCredits + pkg.used_credits,
    remainingCredits: summary.remainingCredits + pkg.remaining_credits,
  }), { totalMonthlyPrice: 0, includedCredits: 0, usedCredits: 0, remainingCredits: 0 });
}

const FULL_TENANT_PERMISSIONS = [
  "tenant:read", "tenant:update", "user:create", "user:read", "user:update", "user:delete",
  "role:create", "role:read", "role:update", "role:delete", "whatsapp:configure",
  "whatsapp:media_upload", "whatsapp:excel_import", "whatsapp:unit_query", "whatsapp:unit_edit",
  "whatsapp:finance_simulation", "whatsapp:photo_send", "whatsapp:document_upload",
  "whatsapp:document_review", "whatsapp:image_generation", "whatsapp:analytics_query",
  "whatsapp:handoff", "whatsapp:lead_own", "analytics:sales_trend",
  "analytics:sales_performance", "analytics:management",
];
const TENANT_ROLE_TEMPLATES = [
  ["Admin", FULL_TENANT_PERMISSIONS],
  ["Salesperson", ["whatsapp:unit_query", "whatsapp:finance_simulation", "whatsapp:image_generation", "whatsapp:photo_send", "whatsapp:lead_own", "whatsapp:handoff", "analytics:sales_performance"]],
  ["Marketing Representative", ["whatsapp:unit_query", "whatsapp:finance_simulation", "whatsapp:image_generation", "whatsapp:photo_send", "whatsapp:lead_own", "whatsapp:handoff", "analytics:sales_performance"]],
  ["Management", FULL_TENANT_PERMISSIONS],
  ["President Director", FULL_TENANT_PERMISSIONS],
  ["PIC Agent Officer", FULL_TENANT_PERMISSIONS],
];
const CALL_CENTER_PERMISSIONS = [
  "whatsapp:unit_query",
  "whatsapp:finance_simulation",
  "whatsapp:image_generation",
  "whatsapp:photo_send",
  "whatsapp:lead_own",
  "whatsapp:handoff",
  "analytics:sales_performance",
];

export function shouldProvisionCallCenterRole({ tenantId, modules }) {
  return String(tenantId || "").trim().toLowerCase() !== MOBIX_TENANT_ID
    && Array.isArray(modules)
    && modules.includes("omni");
}

export function tenantRoleTemplatesForProvisioning({ tenantId, modules }) {
  const billingRoles = new Set(["Admin", "Management", "President Director"]);
  const templates = TENANT_ROLE_TEMPLATES.map(([name, permissions]) => [
    name,
    billingRoles.has(name) ? [...permissions, "billing:read"] : [...permissions],
  ]);
  if (shouldProvisionCallCenterRole({ tenantId, modules })) {
    templates.push(["Call Center", [...CALL_CENTER_PERMISSIONS]]);
  }
  return templates;
}

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
    portalLandingUrl: env.PORTAL_LANDING_URL || "https://motovax.ai/",
    oauthSuccessUrl:
      env.OAUTH_SUCCESS_URL || `${publicBaseUrl}/onboarding.html`,
    googleClientId: env.GOOGLE_OAUTH_CLIENT_ID || "",
    googleClientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    googleRedirectUri: redirectUri,
    sessionSecret: env.SESSION_SECRET || "",
    databaseUrl: env.EXTERNAL_DATABASE_URL || env.DATABASE_URL || "",
    tenantDomainSuffix: (env.TENANT_DOMAIN_SUFFIX || "motovax.com").toLowerCase(),
    coolifyBaseUrl: String(env.COOLIFY_BASE_URL || "").replace(/\/$/, ""),
    coolifyToken: env.COOLIFY_DEPLOY_TOKEN || "",
    coolifyProductAppUuid: env.COOLIFY_PRODUCT_APP_UUID || "",
    smtpHost: env.PLUNK_SMTP_HOST || env.SMTP_HOST || "",
    smtpPort: Number(env.PLUNK_SMTP_PORT || env.SMTP_PORT || 2587),
    smtpUser: env.PLUNK_SMTP_USER || env.SMTP_USER || "",
    smtpPassword: env.PLUNK_SMTP_PASSWORD || env.SMTP_PASSWORD || "",
    authEmailFrom: env.AUTH_EMAIL_FROM || "onboarding@motovax.ai",
    recaptchaProjectId: env.RECAPTCHA_PROJECT_ID || "",
    recaptchaSiteKey: env.RECAPTCHA_SITE_KEY || "",
    recaptchaApiKey: env.RECAPTCHA_API_KEY || "",
    recaptchaAction: env.RECAPTCHA_ACTION || "complete_onboarding",
    recaptchaScoreThreshold: Number(env.RECAPTCHA_SCORE_THRESHOLD || 0.5),
    recaptchaExpectedHostname:
      env.RECAPTCHA_EXPECTED_HOSTNAME || new URL(publicBaseUrl).hostname,
    trustProxy: env.TRUST_PROXY !== "false",
  };
}

function createMailer(config) {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) return null;
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.smtpUser, pass: config.smtpPassword },
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export function buildAccountEmail({
  displayName,
  copy,
  targetUrl,
  actionType,
  publicBaseUrl,
}) {
  const isVerification = actionType === "verify_email";
  const actionLabel = isVerification ? "Verifikasi Email" : "Atur Ulang Password";
  const heading = isVerification ? "Verifikasi alamat email Anda" : "Atur ulang password Anda";
  const preheader = isVerification
    ? "Satu langkah lagi untuk melanjutkan pembuatan workspace dealer Anda di MOTOVAX."
    : "Gunakan tautan aman ini untuk membuat password baru akun MOTOVAX Anda.";
  const expiry = isVerification ? "24 jam" : "30 menit";
  const safeName = escapeHtml(displayName || "Pengguna MOTOVAX");
  const safeCopy = escapeHtml(copy);
  const safeTargetUrl = escapeHtml(targetUrl);
  const logoUrl = escapeHtml(new URL("/icons/logo-motovax.png?v=email-20260814", publicBaseUrl).toString());

  const text = [
    `Halo ${String(displayName || "Pengguna MOTOVAX")},`,
    "",
    String(copy || ""),
    "",
    `${actionLabel}:`,
    String(targetUrl || ""),
    "",
    `Tautan ini berlaku selama ${expiry} dan hanya dapat digunakan satu kali.`,
    "Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini. Akun Anda tetap aman.",
    "",
    "Salam,",
    "Tim MOTOVAX",
  ].join("\n");

  const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${escapeHtml(heading)} · MOTOVAX</title>
    <style>
      @media only screen and (max-width: 620px) {
        .email-shell { padding: 18px 10px !important; }
        .email-content { padding: 30px 22px !important; }
        .email-header { padding: 22px !important; }
        .email-title { font-size: 27px !important; line-height: 34px !important; }
        .email-button { display: block !important; text-align: center !important; }
        .email-footer { padding: 20px 22px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f6fb; color:#17243a; font-family:Arial,Helvetica,sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; line-height:1px; mso-hide:all;">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f3f6fb" style="width:100%; border-collapse:collapse; background-color:#f3f6fb;">
      <tr>
        <td class="email-shell" align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:640px; border-collapse:separate; border-spacing:0;">
            <tr>
              <td style="height:5px; border-radius:14px 14px 0 0; background-color:#1769e0; font-size:0; line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td class="email-header" bgcolor="#ffffff" style="padding:25px 38px 22px; border-right:1px solid #dfe7f2; border-left:1px solid #dfe7f2; background-color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td valign="middle">
                      <img src="${logoUrl}" width="160" alt="MOTOVAX" style="display:block; width:160px; max-width:100%; height:auto; border:0; color:#17243a; font-size:22px; font-weight:700;">
                    </td>
                    <td align="right" valign="middle" style="padding-left:16px; color:#6b7b91; font-size:11px; font-weight:700; line-height:16px; letter-spacing:.08em; text-transform:uppercase;">Platform Dealer Mobil</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-content" bgcolor="#ffffff" style="padding:40px 38px 38px; border-right:1px solid #dfe7f2; border-left:1px solid #dfe7f2; background-color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td style="padding-bottom:18px;">
                      <span style="display:inline-block; padding:7px 11px; border-radius:999px; background-color:#eaf2ff; color:#0b57c9; font-size:11px; font-weight:700; line-height:14px; letter-spacing:.08em; text-transform:uppercase;">Keamanan Akun</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-title" style="padding-bottom:14px; color:#14213a; font-size:32px; font-weight:700; line-height:40px; letter-spacing:-.02em;">${escapeHtml(heading)}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px; color:#314158; font-size:16px; line-height:25px;">Halo <strong style="color:#17243a;">${safeName}</strong>,</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:26px; color:#52627a; font-size:15px; line-height:24px;">${safeCopy}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:28px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;">
                        <tr>
                          <td bgcolor="#1769e0" style="border-radius:9px; background-color:#1769e0; box-shadow:0 8px 18px rgba(23,105,224,.20);">
                            <a class="email-button" href="${safeTargetUrl}" target="_blank" style="display:inline-block; padding:14px 26px; border:1px solid #1769e0; border-radius:9px; color:#ffffff; font-size:15px; font-weight:700; line-height:20px; text-decoration:none;">${actionLabel}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:17px 18px; border:1px solid #dbe7f7; border-radius:10px; background-color:#f7faff; color:#41536c; font-size:13px; line-height:20px;">
                      <strong style="display:block; padding-bottom:3px; color:#1d3150; font-size:13px;">Tautan aman dengan masa berlaku terbatas</strong>
                      Tautan ini berlaku selama <strong>${expiry}</strong> dan hanya dapat digunakan satu kali. Jangan teruskan email ini kepada siapa pun.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:25px; color:#718096; font-size:12px; line-height:19px;">
                      Jika tombol tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:<br>
                      <a href="${safeTargetUrl}" target="_blank" style="color:#1769e0; text-decoration:underline; word-break:break-all; overflow-wrap:anywhere;">${safeTargetUrl}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-footer" bgcolor="#edf2f8" style="padding:22px 38px; border:1px solid #dfe7f2; border-radius:0 0 14px 14px; background-color:#edf2f8; color:#6b7b91; font-size:12px; line-height:19px;">
                <strong style="color:#3a4b63;">Tidak merasa mendaftar atau meminta perubahan?</strong><br>
                Abaikan email ini. Tidak ada tindakan lain yang perlu dilakukan.<br><br>
                Email otomatis dari <strong style="color:#3a4b63;">MOTOVAX</strong> · Platform operasional dealer mobil.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
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

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = await scryptAsync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$16384$8$1$${salt.toString("base64url")}$${Buffer.from(derived).toString("base64url")}`;
}

async function verifyPassword(password, encoded) {
  const parts = String(encoded || "").split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltText, expectedText] = parts;
  const expected = Buffer.from(expectedText, "base64url");
  const derived = await scryptAsync(password, Buffer.from(saltText, "base64url"), expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
  });
  return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
}

async function verifyTenantPassword(password, productHash, onboardingHash = "") {
  const candidate = String(password || "");
  const appHash = String(productHash || "");
  if (/^\$2[aby]\$/.test(appHash)) {
    return bcrypt.compare(candidate, appHash);
  }
  if (String(onboardingHash || "").startsWith("scrypt$")) {
    return verifyPassword(candidate, onboardingHash);
  }
  return false;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function buildIsolatedTenantConfig({ tenantId, profile, callCenterRoleId = "" }) {
  const modules = Array.isArray(profile?.modules) ? [...profile.modules] : [];
  const region = String(profile?.region || "").trim();
  const motosocialProfile = `motovax_${String(tenantId || "").replace(/[^a-zA-Z0-9_-]+/g, "_")}`;
  const features = {
    inventory_management: modules.includes("ims"),
    whatsapp_ai: modules.includes("omni"),
    social_media_automation: modules.includes("social"),
    crm_autopilot: modules.includes("crm"),
    one_dashboard: modules.includes("dashboard"),
    data_insight: modules.includes("insight"),
    billing_menu: true,
  };

  return {
    max_users: 25,
    max_listings: 1000,
    whatsapp_enabled: modules.includes("omni"),
    branches: region ? [region] : [],
    branding: { logo_url: "", primary_color: "#000000", favicon_url: "" },
    finance: { enabled: false, provider: "" },
    ai: {
      additional_prompt: "",
      eval_schedule: { auto_run_enabled: false, schedule_time: "09:00" },
    },
    social_media: { design_templates: [] },
    features,
    whatsapp: {
      sales_default_role_id: "",
      handoff_role_ids: [],
      call_center_contact_role_ids:
        shouldProvisionCallCenterRole({ tenantId, modules }) && callCenterRoleId
          ? [callCenterRoleId]
          : [],
      call_center_handoff_role_ids: [],
      auto_reply_groups: [],
      area_branch_map: {},
      // Jasmine tidak boleh melakukan assignment sebelum role dan routing tenant dikonfigurasi.
      jasmine_auto_assign_enabled: false,
      lead_source_templates: [],
    },
    email_report: { recipients: [], emails: [], logs: [] },
    // Nama profile berasal dari tenant UUID sehingga session channel tidak pernah berbagi dengan Mobix.
    messenger: { motosocial_profile: motosocialProfile },
    instagram_private: { motosocial_profile: motosocialProfile, disconnected: true },
    demo: { public_enabled: false, public_slug: "", allow_writes: false },
    motosocial_api_key: "",
    onboarding: {
      industry: "automotive",
      branch_count: profile?.branch_count || "",
      modules,
      goal: profile?.goal || "conversion",
    },
    isolation: {
      schema_version: 1,
      ai_config_scope: "tenant",
      channel_profile_scope: "tenant",
      integration_config_scope: "tenant",
    },
  };
}

function normalizeSlug(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    emailVerified: row.email_verified === true,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    provider: row.provider || (row.password_hash ? "password" : "google"),
  };
}

function publicPortalUser(row) {
  const permissions = Array.isArray(row.permissions) ? row.permissions : [];
  const features = row.tenant_config?.features || {};
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name || row.username,
    email: row.email || "",
    role: row.role || "Anggota",
    tenant: {
      id: row.tenant_id,
      name: row.tenant_name,
      domain: row.domain,
    },
    canViewBilling: permissions.includes("billing:read") && features.billing_menu !== false,
  };
}

async function ensureProductDomain(config, domain) {
  if (!config.coolifyBaseUrl || !config.coolifyToken || !config.coolifyProductAppUuid) {
    const error = new Error("Provisioning domain aplikasi belum dikonfigurasi.");
    error.code = "domain_provisioning_unavailable";
    throw error;
  }
  const endpoint = `${config.coolifyBaseUrl}/api/v1/applications/${encodeURIComponent(config.coolifyProductAppUuid)}`;
  const headers = {
    Authorization: `Bearer ${config.coolifyToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const signal = AbortSignal.timeout(DOMAIN_PROVISIONING_TIMEOUT_MS);
  let added = false;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const currentResponse = await fetch(endpoint, { headers, signal });
    if (!currentResponse.ok) throw new Error("Tidak dapat membaca konfigurasi domain aplikasi.");
    const current = await currentResponse.json();
    const domains = String(current.fqdn || current.domains || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const target = `https://${domain}`;
    if (!domains.some((item) => item.toLowerCase() === target.toLowerCase())) {
      domains.push(target);
      const updateResponse = await fetch(endpoint, {
        method: "PATCH",
        headers,
        signal,
        body: JSON.stringify({ domains: domains.join(",") }),
      });
      if (updateResponse.ok) {
        added = true;
      } else if (updateResponse.status === 409 && attempt < 2) {
        continue;
      } else {
        const error = new Error("Domain tenant belum dapat dipasang ke aplikasi.");
        error.code = "domain_provisioning_failed";
        throw error;
      }
    }
    break;
  }
  if (await tenantDomainReady(domain, signal)) return;
  const restartResponse = await fetch(`${endpoint}/restart`, { method: "POST", headers, signal });
  if (!restartResponse.ok) {
    const error = new Error(added
      ? "Konfigurasi domain tersimpan, tetapi aplikasi belum dapat memuat ulang routing."
      : "Aplikasi belum dapat memuat ulang routing domain tenant.");
    error.code = "domain_provisioning_failed";
    throw error;
  }
}

async function tenantDomainReady(domain, signal = AbortSignal.timeout(DOMAIN_PROVISIONING_TIMEOUT_MS)) {
  try {
    const response = await fetch(`https://${domain}/api/tenant/public-info`, {
      headers: { Accept: "application/json" },
      signal,
    });
    return response.ok;
  } catch {
    return false;
  }
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
    portalSession: secure ? "__Host-motovax_portal_session" : "motovax_portal_session",
    state: secure ? "__Host-motovax_oauth_state" : "motovax_oauth_state",
    pendingSignup: secure ? "__Host-motovax_pending_signup" : "motovax_pending_signup",
  };
}

function oauthResultUrl(config, status, reason = "", authMode = "signup") {
  const target = authMode === "portal"
    ? new URL("/login.html", config.publicBaseUrl)
    : new URL(config.oauthSuccessUrl);
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

function recaptchaReady(config) {
  return Boolean(
    config.recaptchaProjectId &&
    config.recaptchaSiteKey &&
    config.recaptchaApiKey &&
    config.recaptchaAction &&
    config.recaptchaExpectedHostname &&
    Number.isFinite(config.recaptchaScoreThreshold) &&
    config.recaptchaScoreThreshold >= 0 &&
    config.recaptchaScoreThreshold <= 1,
  );
}

export async function verifyRecaptchaToken(config, token, fetchImpl = fetch) {
  if (!recaptchaReady(config)) {
    const error = new Error("Proteksi reCAPTCHA belum dikonfigurasi pada server.");
    error.code = "recaptcha_unavailable";
    throw error;
  }
  if (!token || String(token).length > 4096) {
    const error = new Error("Verifikasi keamanan tidak tersedia. Muat ulang halaman dan coba lagi.");
    error.code = "recaptcha_invalid";
    throw error;
  }

  let response;
  try {
    const endpoint = new URL(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(config.recaptchaProjectId)}/assessments`,
    );
    endpoint.searchParams.set("key", config.recaptchaApiKey);
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: {
          token: String(token),
          siteKey: config.recaptchaSiteKey,
          expectedAction: config.recaptchaAction,
        },
      }),
      signal: AbortSignal.timeout(2_500),
    });
  } catch {
    const error = new Error("Layanan verifikasi keamanan sedang tidak tersedia. Coba lagi.");
    error.code = "recaptcha_unavailable";
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Layanan verifikasi keamanan sedang tidak tersedia. Coba lagi.");
    error.code = "recaptcha_unavailable";
    throw error;
  }

  const assessment = await response.json();
  const properties = assessment?.tokenProperties || {};
  const score = Number(assessment?.riskAnalysis?.score);
  if (
    properties.valid !== true ||
    properties.action !== config.recaptchaAction ||
    properties.hostname !== config.recaptchaExpectedHostname ||
    !Number.isFinite(score)
  ) {
    const error = new Error("Verifikasi keamanan tidak valid. Muat ulang halaman dan coba lagi.");
    error.code = "recaptcha_invalid";
    throw error;
  }
  if (score < config.recaptchaScoreThreshold) {
    const error = new Error("Aktivitas belum dapat diverifikasi. Tunggu sebentar lalu coba lagi.");
    error.code = "recaptcha_low_score";
    throw error;
  }
  return { score };
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
    connectionTimeoutMillis: 2_800,
    query_timeout: 2_800,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS onboarding_users (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      full_name TEXT NOT NULL DEFAULT '',
      avatar_url TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE onboarding_users
      ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';

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

    CREATE TABLE IF NOT EXISTS portal_auth_sessions (
      id UUID PRIMARY KEY,
      app_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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

    CREATE TABLE IF NOT EXISTS onboarding_action_tokens (
      token_digest CHAR(64) PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES onboarding_users(id) ON DELETE CASCADE,
      action_type TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS onboarding_profiles (
      user_id UUID PRIMARY KEY REFERENCES onboarding_users(id) ON DELETE CASCADE,
      business_name TEXT NOT NULL DEFAULT '',
      workspace_slug TEXT NOT NULL DEFAULT '',
      branch_count TEXT NOT NULL DEFAULT '1',
      region TEXT NOT NULL DEFAULT '',
      industry TEXT NOT NULL DEFAULT 'general',
      description TEXT NOT NULL DEFAULT '',
      modules JSONB NOT NULL DEFAULT '[]'::jsonb,
      goal TEXT NOT NULL DEFAULT 'conversion',
      tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS onboarding_memberships (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES onboarding_users(id) ON DELETE CASCADE,
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      app_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      membership_role TEXT NOT NULL DEFAULT 'owner',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, tenant_id),
      UNIQUE (tenant_id, app_user_id)
    );

    CREATE TABLE IF NOT EXISTS onboarding_meeting_requests (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL UNIQUE REFERENCES onboarding_users(id) ON DELETE CASCADE,
      scheduled_for TIMESTAMPTZ NOT NULL,
      timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
      status TEXT NOT NULL DEFAULT 'requested',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS onboarding_auth_sessions_user_idx
      ON onboarding_auth_sessions(user_id);
    CREATE INDEX IF NOT EXISTS onboarding_auth_sessions_expiry_idx
      ON onboarding_auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS portal_auth_sessions_expiry_idx
      ON portal_auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS portal_auth_sessions_user_idx
      ON portal_auth_sessions(app_user_id, tenant_id);
    CREATE INDEX IF NOT EXISTS onboarding_oauth_states_expiry_idx
      ON onboarding_oauth_states(expires_at);
    CREATE INDEX IF NOT EXISTS onboarding_action_tokens_user_idx
      ON onboarding_action_tokens(user_id, action_type);
    CREATE INDEX IF NOT EXISTS onboarding_memberships_user_idx
      ON onboarding_memberships(user_id);
    CREATE INDEX IF NOT EXISTS onboarding_meeting_requests_schedule_idx
      ON onboarding_meeting_requests(scheduled_for, status);
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

    async createPasswordUser({ email, fullName, passwordHash, authenticatedUserId = "" }) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const existing = await client.query(
          "SELECT * FROM onboarding_users WHERE email = $1 FOR UPDATE",
          [email],
        );
        let user = existing.rows[0];
        if (user?.email_verified && user.id !== authenticatedUserId) {
          const conflict = new Error("Akun dengan email tersebut sudah terdaftar.");
          conflict.code = "account_exists";
          throw conflict;
        }
        if (user) {
          const updated = await client.query(
            `UPDATE onboarding_users
             SET full_name = $2, password_hash = $3, updated_at = NOW()
             WHERE id = $1 RETURNING *`,
            [user.id, fullName, passwordHash],
          );
          user = updated.rows[0];
        } else {
          const inserted = await client.query(
            `INSERT INTO onboarding_users
              (id, email, email_verified, full_name, password_hash)
             VALUES ($1, $2, FALSE, $3, $4)
             RETURNING *`,
            [crypto.randomUUID(), email, fullName, passwordHash],
          );
          user = inserted.rows[0];
        }
        await client.query("COMMIT");
        return user;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async findPasswordUser(email) {
      const result = await pool.query(
        "SELECT * FROM onboarding_users WHERE email = $1 LIMIT 1",
        [email],
      );
      return result.rows[0] || null;
    },

    async findPasswordUserById(userId) {
      const result = await pool.query(
        "SELECT * FROM onboarding_users WHERE id = $1 LIMIT 1",
        [userId],
      );
      return result.rows[0] || null;
    },

    async saveActionToken({ userId, actionType, digest, expiresAt }) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          "SELECT pg_advisory_xact_lock(hashtext($1))",
          [`${userId}:${actionType}`],
        );
        await client.query(
          `UPDATE onboarding_action_tokens
           SET used_at = COALESCE(used_at, NOW())
           WHERE user_id = $1 AND action_type = $2 AND used_at IS NULL`,
          [userId, actionType],
        );
        await client.query(
          `INSERT INTO onboarding_action_tokens (token_digest, user_id, action_type, expires_at)
           VALUES ($1, $2, $3, $4)`,
          [digest, userId, actionType, expiresAt],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async findActionToken({ digest, actionType }) {
      const result = await pool.query(
        `SELECT user_id
         FROM onboarding_action_tokens
         WHERE token_digest = $1 AND action_type = $2
           AND used_at IS NULL AND expires_at > NOW()
         LIMIT 1`,
        [digest, actionType],
      );
      return result.rows[0]?.user_id || null;
    },

    async getActionTokenStatus({ digest, actionType }) {
      const result = await pool.query(
        `SELECT
           CASE
             WHEN used_at IS NOT NULL THEN 'used'
             WHEN expires_at <= NOW() THEN 'expired'
             ELSE 'active'
           END AS status
         FROM onboarding_action_tokens
         WHERE token_digest = $1 AND action_type = $2
         LIMIT 1`,
        [digest, actionType],
      );
      return result.rows[0]?.status || "invalid";
    },

    async getActionTokenResendDelay({ userId, actionType, cooldownSeconds }) {
      const result = await pool.query(
        `SELECT COALESCE(
           GREATEST(
             0,
             CEIL(EXTRACT(EPOCH FROM (
               MAX(created_at) + ($3::text || ' seconds')::interval - NOW()
             )))
           ),
           0
         )::int AS retry_after_seconds
         FROM onboarding_action_tokens
         WHERE user_id = $1 AND action_type = $2`,
        [userId, actionType, cooldownSeconds],
      );
      return Number(result.rows[0]?.retry_after_seconds || 0);
    },

    async deletePendingPasswordUser(userId) {
      const result = await pool.query(
        `DELETE FROM onboarding_users u
         WHERE u.id = $1
           AND u.email_verified = FALSE
           AND NOT EXISTS (
             SELECT 1 FROM onboarding_profiles p WHERE p.user_id = u.id
           )
           AND NOT EXISTS (
             SELECT 1 FROM onboarding_memberships m WHERE m.user_id = u.id
           )
         RETURNING id`,
        [userId],
      );
      return Boolean(result.rowCount);
    },

    async takeActionToken({ digest, actionType }) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query(
          `UPDATE onboarding_action_tokens
           SET used_at = NOW()
           WHERE token_digest = $1 AND action_type = $2
             AND used_at IS NULL AND expires_at > NOW()
           RETURNING user_id`,
          [digest, actionType],
        );
        const userId = result.rows[0]?.user_id;
        if (userId && actionType === "verify_email") {
          await client.query(
            "UPDATE onboarding_users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1",
            [userId],
          );
          await client.query(
            `UPDATE onboarding_action_tokens
             SET used_at = COALESCE(used_at, NOW())
             WHERE user_id = $1 AND action_type = 'pending_signup' AND used_at IS NULL`,
            [userId],
          );
        }
        await client.query("COMMIT");
        return userId || null;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async updatePassword(userId, passwordHash) {
      await pool.query(
        "UPDATE onboarding_users SET password_hash = $2, updated_at = NOW() WHERE id = $1",
        [userId, passwordHash],
      );
    },

    async getAccountState(userId) {
      const [profileResult, workspaceResult] = await Promise.all([
        pool.query(
          `SELECT business_name, workspace_slug, branch_count, region, industry,
                  description, modules, goal, tenant_id, completed_at
           FROM onboarding_profiles WHERE user_id = $1`,
          [userId],
        ),
        pool.query(
          `SELECT t.id, t.name, t.status, d.domain, m.membership_role
           FROM onboarding_memberships m
           JOIN tenants t ON t.id = m.tenant_id
           JOIN tenant_domains d ON d.tenant_id = t.id AND d.is_primary = TRUE
           WHERE m.user_id = $1
           ORDER BY t.name`,
          [userId],
        ),
      ]);
      return {
        profile: profileResult.rows[0] || null,
        workspaces: workspaceResult.rows.map((row) => ({
          id: row.id,
          name: row.name,
          status: row.status,
          domain: row.domain,
          role: row.membership_role,
        })),
      };
    },

    async findPortalUsers({ identifier }) {
      const result = await pool.query(
        `SELECT
           u.id,
           u.username,
           COALESCE(NULLIF(BTRIM(u.display_name), ''), u.username) AS display_name,
           COALESCE(u.email, '') AS email,
           u.password_hash,
           COALESCE(ou.password_hash, '') AS onboarding_password_hash,
           t.id AS tenant_id,
           t.name AS tenant_name,
           COALESCE(t.config, '{}'::jsonb) AS tenant_config,
           d.domain,
           COALESCE(string_agg(DISTINCT r.name, ', ' ORDER BY r.name), '') AS role,
           COALESCE(
             (SELECT jsonb_agg(permission.value) FROM (
               SELECT DISTINCT jsonb_array_elements_text(rp.permissions) AS value
               FROM user_roles urp
               JOIN roles rp ON rp.id = urp.role_id
               WHERE urp.user_id = u.id
             ) AS permission),
             '[]'::jsonb
           ) AS permissions
         FROM users u
         JOIN tenants t ON t.id = u.tenant_id AND t.status = 'active'
         JOIN tenant_domains d ON d.tenant_id = t.id AND d.is_primary = TRUE
         LEFT JOIN user_roles ur ON ur.user_id = u.id
         LEFT JOIN roles r ON r.id = ur.role_id
         LEFT JOIN onboarding_memberships om ON om.app_user_id = u.id AND om.tenant_id = t.id
         LEFT JOIN onboarding_users ou ON ou.id = om.user_id
         WHERE LOWER(u.username) = LOWER($1)
            OR LOWER(COALESCE(u.email, '')) = LOWER($1)
         GROUP BY u.id, u.username, u.display_name, u.email, u.password_hash,
                  ou.password_hash, t.id, t.name, t.config, d.domain
         ORDER BY
           CASE WHEN LOWER(COALESCE(u.email, '')) = LOWER($1) THEN 0 ELSE 1 END,
           t.name,
           u.id
         LIMIT 21`,
        [identifier],
      );
      return result.rows;
    },

    async createPortalSession({ appUserId, tenantId, sessionDigest, userAgent, ipAddress, expiresAt }) {
      await pool.query("DELETE FROM portal_auth_sessions WHERE expires_at <= NOW()");
      await pool.query(
        `INSERT INTO portal_auth_sessions
          (id, app_user_id, tenant_id, token_digest, user_agent, ip_address, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [crypto.randomUUID(), appUserId, tenantId, sessionDigest, userAgent, ipAddress, expiresAt],
      );
    },

    async findPortalSession(sessionDigest) {
      const result = await pool.query(
        `UPDATE portal_auth_sessions s
         SET last_seen_at = NOW()
         FROM users u, tenants t, tenant_domains d
         WHERE s.token_digest = $1
           AND s.expires_at > NOW()
           AND u.id = s.app_user_id
           AND t.id = s.tenant_id
           AND t.status = 'active'
           AND u.tenant_id = t.id
           AND d.tenant_id = t.id
           AND d.is_primary = TRUE
         RETURNING u.id, u.username,
           COALESCE(NULLIF(BTRIM(u.display_name), ''), u.username) AS display_name,
           COALESCE(u.email, '') AS email,
           t.id AS tenant_id, t.name AS tenant_name,
           COALESCE(t.config, '{}'::jsonb) AS tenant_config,
           d.domain,
           COALESCE((SELECT string_agg(DISTINCT r.name, ', ' ORDER BY r.name)
             FROM user_roles ur JOIN roles r ON r.id = ur.role_id
             WHERE ur.user_id = u.id), '') AS role,
           COALESCE((SELECT jsonb_agg(permission.value) FROM (
             SELECT DISTINCT jsonb_array_elements_text(rp.permissions) AS value
             FROM user_roles urp JOIN roles rp ON rp.id = urp.role_id
             WHERE urp.user_id = u.id
           ) AS permission), '[]'::jsonb) AS permissions`,
        [sessionDigest],
      );
      return result.rows[0] || null;
    },

    async getPortalBilling(tenantId) {
      const periodStart = new Date();
      periodStart.setUTCDate(1);
      periodStart.setUTCHours(0, 0, 0, 0);
      const periodEnd = new Date(periodStart);
      periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);
      const [tenantResult, membersResult, usageResult] = await Promise.all([
        pool.query(
          `SELECT id, name, COALESCE(config, '{}'::jsonb) AS config
           FROM tenants
           WHERE id = $1 AND status = 'active'`,
          [tenantId],
        ),
        pool.query(
          `SELECT u.id, COALESCE(NULLIF(BTRIM(u.display_name), ''), u.username) AS display_name,
             u.username,
             COALESCE(string_agg(DISTINCT r.name, ', ' ORDER BY r.name), '') AS roles
           FROM users u
           LEFT JOIN user_roles ur ON ur.user_id = u.id
           LEFT JOIN roles r ON r.id = ur.role_id
           WHERE u.tenant_id = $1
           GROUP BY u.id, u.display_name, u.username
           ORDER BY COALESCE(NULLIF(BTRIM(u.display_name), ''), u.username), u.username`,
          [tenantId],
        ),
        pool.query(
          `SELECT CASE ai_engine
             WHEN 'jasmine' THEN 'omni_jasmine'
             WHEN 'falcon' THEN 'inventory_falcon'
             WHEN 'sora' THEN 'social_sora'
           END AS package_id,
           COUNT(*)::int AS used_credits
           FROM ai_usage_events
           WHERE tenant_id = $1
             AND created_at >= $2
             AND created_at < $3
             AND success = TRUE
             AND COALESCE(worker, '') = ''
             AND ai_engine IN ('jasmine', 'falcon', 'sora')
           GROUP BY package_id`,
          [tenantId, periodStart, periodEnd],
        ),
      ]);
      const tenant = tenantResult.rows[0];
      if (!tenant) return null;
      const tenantConfig = tenant.config || {};
      const features = tenantConfig.features || {};
      const packages = buildBillingPackages(features, usageResult.rows);
      const packageSummary = summarizeBillingPackages(packages);
      return {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        member_count: membersResult.rowCount,
        max_users: Number(tenantConfig.max_users || 0),
        max_listings: Number(tenantConfig.max_listings || 0),
        enabled_features: Object.entries(features)
          .filter(([, enabled]) => enabled === true)
          .map(([key]) => key),
        members: membersResult.rows,
        packages,
        total_monthly_price: packageSummary.totalMonthlyPrice,
        included_credits: packageSummary.includedCredits,
        used_credits: packageSummary.usedCredits,
        remaining_credits: packageSummary.remainingCredits,
        billing_configured: false,
        invoice_status: "not_configured",
      };
    },

    async revokePortalSession(sessionDigest) {
      await pool.query("DELETE FROM portal_auth_sessions WHERE token_digest = $1", [sessionDigest]);
    },

    async createPortalHandoff(appUserId, tenantId) {
      const result = await pool.query(
        `SELECT u.id AS app_user_id, t.id, t.name, d.domain
         FROM users u
         JOIN tenants t ON t.id = u.tenant_id AND t.status = 'active'
         JOIN tenant_domains d ON d.tenant_id = t.id AND d.is_primary = TRUE
         WHERE u.id = $1 AND t.id = $2`,
        [appUserId, tenantId],
      );
      const workspace = result.rows[0];
      if (!workspace) return null;
      const handoffToken = randomToken(32);
      await pool.query(
        `INSERT INTO auth_tokens (user_id, token, expires_at, is_magic_link)
         VALUES ($1, $2, $3, TRUE)`,
        [appUserId, handoffToken, new Date(Date.now() + HANDOFF_TTL_MS)],
      );
      return { workspace, handoffToken };
    },

    async isSlugAvailable(slug, suffix) {
      const domain = `${slug}.${suffix}`;
      const result = await pool.query(
        "SELECT NOT EXISTS (SELECT 1 FROM tenant_domains WHERE LOWER(domain) = LOWER($1)) AS available",
        [domain],
      );
      return Boolean(result.rows[0]?.available);
    },

    async saveProfile(userId, profile) {
      const result = await pool.query(
        `INSERT INTO onboarding_profiles
          (user_id, business_name, workspace_slug, branch_count, region, industry, description, modules, goal)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
         ON CONFLICT (user_id) DO UPDATE SET
           business_name = EXCLUDED.business_name,
           workspace_slug = EXCLUDED.workspace_slug,
           branch_count = EXCLUDED.branch_count,
           region = EXCLUDED.region,
           industry = EXCLUDED.industry,
           description = EXCLUDED.description,
           modules = EXCLUDED.modules,
           goal = EXCLUDED.goal,
           updated_at = NOW()
         RETURNING *`,
        [
          userId, profile.businessName, profile.workspaceSlug, profile.branchCount,
          profile.region, profile.industry, profile.description,
          JSON.stringify(profile.modules || []), profile.goal,
        ],
      );
      return result.rows[0];
    },

    async provisionWorkspace({ userId, suffix }) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("SET LOCAL lock_timeout = '1200ms'");
        await client.query("SET LOCAL statement_timeout = '2800ms'");
        const profileResult = await client.query(
          `SELECT p.*, u.email, u.full_name
           FROM onboarding_profiles p
           JOIN onboarding_users u ON u.id = p.user_id
           WHERE p.user_id = $1 FOR UPDATE OF p`,
          [userId],
        );
        const profile = profileResult.rows[0];
        if (!profile) {
          const error = new Error("Profil onboarding belum lengkap.");
          error.code = "profile_required";
          throw error;
        }

        const existingMembership = profile.tenant_id
          ? await client.query(
              `SELECT t.id, t.name, d.domain, m.app_user_id
               FROM onboarding_memberships m
               JOIN tenants t ON t.id = m.tenant_id
               JOIN tenant_domains d ON d.tenant_id = t.id AND d.is_primary = TRUE
               WHERE m.user_id = $1 AND m.tenant_id = $2`,
              [userId, profile.tenant_id],
            )
          : { rows: [] };
        if (existingMembership.rows[0]) {
          const workspace = existingMembership.rows[0];
          await client.query("COMMIT");
          return { workspace };
        }

        const slug = normalizeSlug(profile.workspace_slug);
        const domain = `${slug}.${suffix}`;
        await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [domain]);
        const domainTaken = await client.query(
          "SELECT 1 FROM tenant_domains WHERE LOWER(domain) = LOWER($1)",
          [domain],
        );
        if (domainTaken.rowCount) {
          const error = new Error("Subdomain sudah digunakan.");
          error.code = "slug_unavailable";
          throw error;
        }

        const tenantId = crypto.randomUUID();
        const appUserId = crypto.randomUUID();
        const roleTemplates = tenantRoleTemplatesForProvisioning({ tenantId, modules: profile.modules });
        const callCenterRoleId = roleTemplates.some(([roleName]) => roleName === "Call Center")
          ? crypto.randomUUID()
          : "";
        const tenantConfig = buildIsolatedTenantConfig({ tenantId, profile, callCenterRoleId });
        await client.query(
          `INSERT INTO tenants
            (id, name, slug, description, status, config, default_ai_engine_key, created_by, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 'active', $5::jsonb, 'falcon', $6, NOW(), NOW())`,
          [tenantId, profile.business_name, slug, profile.description, JSON.stringify(tenantConfig), userId],
        );
        await client.query(
          `INSERT INTO tenant_domains
            (id, tenant_id, domain, is_primary, verified, created_at, updated_at)
           VALUES ($1, $2, $3, TRUE, TRUE, NOW(), NOW())`,
          [crypto.randomUUID(), tenantId, domain],
        );

        const roleRecords = roleTemplates.map(([roleName, permissions]) => ({
          id: roleName === "Call Center" ? callCenterRoleId : crypto.randomUUID(),
          name: roleName,
          permissions,
        }));
        const adminRoleId = roleRecords.find((role) => role.name === "Admin")?.id || "";
        const roleParams = [tenantId];
        const roleValues = roleRecords.map((role) => {
          const start = roleParams.length + 1;
          roleParams.push(role.id, role.name, JSON.stringify(role.permissions));
          return `($${start}, $1, $${start + 1}::varchar, $${start + 1}::text, $${start + 2}::jsonb, NOW(), NULL)`;
        });
        await client.query(
          `INSERT INTO roles
            (id, tenant_id, name, seeded_name, permissions, created_at, created_by)
           VALUES ${roleValues.join(", ")}`,
          roleParams,
        );

        let username = normalizeSlug(profile.full_name).replace(/-/g, ".") || profile.email.split("@")[0];
        username = username.slice(0, 80);
        await client.query(
          `INSERT INTO users
            (id, tenant_id, username, display_name, email, password_hash, branch, ai_engine_key, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, '', $6, 'falcon', NOW(), NOW())`,
          [appUserId, tenantId, username, profile.full_name, profile.email, profile.region],
        );
        // UUID tenant baru seharusnya belum punya allocation. DELETE defensif ini
        // memastikan trigger/seed eksternal tidak mewariskan endpoint LLM tenant lain.
        await client.query(
          "DELETE FROM tenant_llm_allocations WHERE tenant_id = $1",
          [tenantId],
        );
        await client.query(
          "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
          [appUserId, adminRoleId],
        );
        await client.query(
          `INSERT INTO onboarding_memberships
            (id, user_id, tenant_id, app_user_id, membership_role)
           VALUES ($1, $2, $3, $4, 'owner')`,
          [crypto.randomUUID(), userId, tenantId, appUserId],
        );
        await client.query(
          `UPDATE onboarding_profiles
           SET tenant_id = $2, completed_at = NOW(), updated_at = NOW()
           WHERE user_id = $1`,
          [userId, tenantId],
        );
        await client.query("COMMIT");
        return {
          workspace: { id: tenantId, name: profile.business_name, domain, app_user_id: appUserId },
        };
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // Koneksi/statement timeout tidak boleh menahan respons error onboarding.
        }
        throw error;
      } finally {
        client.release();
      }
    },

    async createWorkspaceHandoff(userId, tenantId) {
      const result = await pool.query(
        `SELECT t.id, t.name, d.domain, m.app_user_id
         FROM onboarding_memberships m
         JOIN tenants t ON t.id = m.tenant_id
         JOIN tenant_domains d ON d.tenant_id = t.id AND d.is_primary = TRUE
         WHERE m.user_id = $1 AND m.tenant_id = $2 AND t.status = 'active'`,
        [userId, tenantId],
      );
      const workspace = result.rows[0];
      if (!workspace) return null;
      const handoffToken = randomToken(32);
      await pool.query(
        `INSERT INTO auth_tokens (user_id, token, expires_at, is_magic_link)
         VALUES ($1, $2, $3, TRUE)`,
        [workspace.app_user_id, handoffToken, new Date(Date.now() + HANDOFF_TTL_MS)],
      );
      return { workspace, handoffToken };
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
         RETURNING u.id, u.email, u.email_verified, u.full_name, u.avatar_url, u.password_hash,
           CASE WHEN EXISTS (
             SELECT 1 FROM onboarding_oauth_accounts oa
             WHERE oa.user_id = u.id AND oa.provider = 'google'
           ) THEN 'google' ELSE 'password' END AS provider`,
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

export function createApp({
  config = readConfig(),
  store = null,
  oauthClient = null,
  mailer = undefined,
  recaptchaVerifier = verifyRecaptchaToken,
  productDomainEnsurer = ensureProductDomain,
} = {}) {
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
  const emailClient = mailer === undefined ? createMailer(config) : mailer;
  const activeDomainProvisioning = new Set();

  function provisionDomainInBackground(domain, attempt = 0) {
    const key = String(domain || "").trim().toLowerCase();
    if (!key || activeDomainProvisioning.has(key)) return;
    activeDomainProvisioning.add(key);

    let timeoutId;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        const error = new Error("Provisioning domain melewati batas 3 detik.");
        error.code = "domain_provisioning_timeout";
        reject(error);
      }, DOMAIN_PROVISIONING_TIMEOUT_MS);
      timeoutId.unref?.();
    });

    Promise.race([
      Promise.resolve().then(() => productDomainEnsurer(config, key)),
      timeout,
    ]).catch((error) => {
      const retryDelay = DOMAIN_PROVISIONING_RETRY_DELAYS_MS[attempt];
      if (retryDelay !== undefined) {
        const retryTimer = setTimeout(() => provisionDomainInBackground(key, attempt + 1), retryDelay);
        retryTimer.unref?.();
        return;
      }
      console.error("Provisioning domain tenant belum berhasil setelah retry.", {
        domain: key,
        code: error?.code || error?.name || "unknown_error",
      });
    }).finally(() => {
      clearTimeout(timeoutId);
      activeDomainProvisioning.delete(key);
    });
  }

  if (config.trustProxy) app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "64kb" }));

  const authAttempts = new Map();
  function checkAuthRateLimit(req, res) {
    const key = String(req.ip || req.socket.remoteAddress || "unknown");
    const now = Date.now();
    const recent = (authAttempts.get(key) || []).filter((stamp) => now - stamp < 10 * 60 * 1000);
    recent.push(now);
    authAttempts.set(key, recent);
    if (recent.length > 20) {
      res.status(429).json({ error: "rate_limited", message: "Terlalu banyak percobaan. Coba lagi beberapa menit." });
      return false;
    }
    return true;
  }

  function assertSameOrigin(req, res) {
    const origin = req.get("origin");
    if (origin && origin !== new URL(config.publicBaseUrl).origin) {
      res.status(403).json({ error: "invalid_origin" });
      return false;
    }
    return true;
  }

  async function authenticatedUser(req) {
    if (!store || !config.sessionSecret) return null;
    const requestCookies = parseCookies(req.headers.cookie);
    const sessionToken = requestCookies[cookies.session];
    if (!sessionToken) return null;
    const user = await store.findSession(tokenDigest(sessionToken, config.sessionSecret));
    return user?.email_verified === true ? user : null;
  }

  async function authenticatedPortalUser(req) {
    if (!store || !config.sessionSecret || !store.findPortalSession) return null;
    const match = String(req.get("authorization") || "").match(/^Bearer\s+([A-Za-z0-9_-]{32,})$/i);
    const requestCookies = parseCookies(req.headers.cookie);
    const sessionToken = match?.[1] || requestCookies[cookies.portalSession];
    if (!sessionToken) return null;
    return store.findPortalSession(tokenDigest(sessionToken, config.sessionSecret));
  }

  function portalCors(req, res, next) {
    const origin = String(req.get("origin") || "");
    const landingOrigin = new URL(config.portalLandingUrl || "https://motovax.ai/").origin;
    const authOrigin = new URL(config.publicBaseUrl).origin;
    const tenantLogoutOrigin = req.path === "/logout"
      && /^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.motovax\.com$/i.test(origin);
    const allowed = origin === landingOrigin
      || origin === authOrigin
      || origin === "https://www.motovax.ai"
      || tenantLogoutOrigin
      || /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin);
    if (origin && allowed) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Vary", "Origin");
      if (tenantLogoutOrigin) res.set("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
      return allowed ? res.status(204).end() : res.status(403).end();
    }
    if (origin && !allowed) return res.status(403).json({ error: "invalid_origin" });
    return next();
  }

  async function issueSession(req, res, userId) {
    const sessionToken = randomToken(48);
    await store.createSession({
      userId,
      sessionDigest: tokenDigest(sessionToken, config.sessionSecret),
      userAgent: String(req.headers["user-agent"] || "").slice(0, 500),
      ipAddress: String(req.ip || "").slice(0, 100),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    });
    res.cookie(cookies.session, sessionToken, {
      httpOnly: true,
      secure: cookies.secure,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_MS,
    });
  }

  function clearPendingSignupCookie(res) {
    res.clearCookie(cookies.pendingSignup, {
      httpOnly: true,
      secure: cookies.secure,
      sameSite: "lax",
      path: "/",
    });
  }

  async function issuePendingSignup(res, userId) {
    const pendingToken = randomToken(32);
    await store.saveActionToken({
      userId,
      actionType: "pending_signup",
      digest: tokenDigest(pendingToken, config.sessionSecret),
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
    });
    res.cookie(cookies.pendingSignup, pendingToken, {
      httpOnly: true,
      secure: cookies.secure,
      sameSite: "lax",
      path: "/",
      maxAge: EMAIL_VERIFICATION_TTL_MS,
    });
  }

  async function pendingSignupUser(req) {
    if (!store?.findActionToken || !store?.findPasswordUserById || !config.sessionSecret) return null;
    const requestCookies = parseCookies(req.headers.cookie);
    const pendingToken = requestCookies[cookies.pendingSignup];
    if (!pendingToken) return null;
    const userId = await store.findActionToken({
      digest: tokenDigest(pendingToken, config.sessionSecret),
      actionType: "pending_signup",
    });
    return userId ? store.findPasswordUserById(userId) : null;
  }

  async function verificationResendDelay(userId) {
    if (!store?.getActionTokenResendDelay) return 0;
    return store.getActionTokenResendDelay({
      userId,
      actionType: "verify_email",
      cooldownSeconds: EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS,
    });
  }

  async function issuePortalSession(req, res, user) {
    const sessionToken = randomToken(48);
    const expiresAt = new Date(Date.now() + PORTAL_SESSION_TTL_MS);
    await store.createPortalSession({
      appUserId: user.id,
      tenantId: user.tenant_id,
      sessionDigest: tokenDigest(sessionToken, config.sessionSecret),
      userAgent: String(req.headers["user-agent"] || "").slice(0, 500),
      ipAddress: String(req.ip || "").slice(0, 100),
      expiresAt,
    });
    res.cookie(cookies.portalSession, sessionToken, {
      httpOnly: true,
      secure: cookies.secure,
      sameSite: "lax",
      path: "/",
      maxAge: PORTAL_SESSION_TTL_MS,
    });
    return { sessionToken, expiresAt };
  }

  async function sendAccountEmail({ user, actionType, subject, pathName, copy }) {
    if (!emailClient) {
      const error = new Error("Layanan email belum tersedia.");
      error.code = "email_unavailable";
      throw error;
    }
    const token = randomToken(32);
    await store.saveActionToken({
      userId: user.id,
      actionType,
      digest: tokenDigest(token, config.sessionSecret),
      expiresAt: new Date(Date.now() + (actionType === "verify_email" ? EMAIL_VERIFICATION_TTL_MS : 30 * 60 * 1000)),
    });
    const target = new URL(pathName, config.publicBaseUrl);
    target.searchParams.set("token", token);
    const emailContent = buildAccountEmail({
      displayName: user.full_name || user.email,
      copy,
      targetUrl: target.toString(),
      actionType,
      publicBaseUrl: config.publicBaseUrl,
    });
    await emailClient.sendMail({
      from: `MOTOVAX <${config.authEmailFrom}>`,
      to: user.email,
      subject,
      text: emailContent.text,
      html: emailContent.html,
    });
  }

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
      if (config.databaseUrl && !store) {
        return res.status(503).json({
          status: "database_unavailable",
          oauthReady: false,
        });
      }
      if (store) await store.healthcheck();
      return res.status(200).json({
        status: missing.length ? "configuration_required" : "ok",
        oauthReady: missing.length === 0,
        recaptchaReady: recaptchaReady(config),
        missing,
      });
    } catch {
      res.status(503).json({ status: "database_unavailable", oauthReady: false });
    }
  });

  app.get("/api/config", (_req, res) => {
    res.json({
      recaptcha: {
        enabled: recaptchaReady(config),
        siteKey: recaptchaReady(config) ? config.recaptchaSiteKey : "",
        action: recaptchaReady(config) ? config.recaptchaAction : "",
      },
    });
  });

  app.use("/api/portal", portalCors);

  app.post("/api/portal/login", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      if (!store || !config.sessionSecret || !store.findPortalUsers || !store.createPortalSession) {
        return res.status(503).json({ error: "service_unavailable" });
      }
      const identifier = String(req.body?.identifier || "").trim().toLowerCase();
      const password = String(req.body?.password || "");
      if (identifier.length < 2 || password.length < 1) {
        return res.status(400).json({
          error: "invalid_login",
          message: "Lengkapi username atau email dan password Anda.",
        });
      }
      const candidates = await store.findPortalUsers({ identifier });
      const matchedUsers = [];
      for (const candidate of candidates.slice(0, 21)) {
        if (await verifyTenantPassword(password, candidate.password_hash, candidate.onboarding_password_hash)) {
          matchedUsers.push(candidate);
        }
      }
      if (matchedUsers.length === 0) {
        return res.status(401).json({
          error: "invalid_credentials",
          message: "Username/email atau password tidak sesuai.",
        });
      }
      if (matchedUsers.length > 1 || candidates.length > 20) {
        return res.status(409).json({
          error: "ambiguous_account",
          message: "Akun cocok dengan lebih dari satu workspace. Gunakan alamat email akun yang unik atau hubungi admin.",
        });
      }
      const [user] = matchedUsers;
      const { expiresAt } = await issuePortalSession(req, res, user);
      const handoff = await store.createPortalHandoff(user.id, user.tenant_id);
      if (!handoff) return res.status(404).json({ error: "workspace_not_found" });
      const redirect = new URL(`https://${handoff.workspace.domain}/magic-login`);
      redirect.searchParams.set("token", handoff.handoffToken);
      return res.json({
        authenticated: true,
        expiresAt: expiresAt.toISOString(),
        redirectUrl: redirect.toString(),
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/portal/me", async (req, res, next) => {
    try {
      const user = await authenticatedPortalUser(req);
      if (!user) return res.status(401).json({ authenticated: false });
      return res.json({ authenticated: true, user: publicPortalUser(user) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/portal/billing", async (req, res, next) => {
    try {
      const user = await authenticatedPortalUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      if (!publicPortalUser(user).canViewBilling) {
        return res.status(403).json({ error: "billing_forbidden", message: "Akun ini tidak memiliki akses billing." });
      }
      if (!store?.getPortalBilling) return res.status(503).json({ error: "service_unavailable" });
      const billing = await store.getPortalBilling(user.tenant_id);
      if (!billing) return res.status(404).json({ error: "workspace_not_found" });
      return res.json(billing);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/portal/workspace/enter", async (req, res, next) => {
    try {
      const user = await authenticatedPortalUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      const destinations = new Set(["/", "/settings/account", "/billing"]);
      const destination = destinations.has(req.body?.destination) ? req.body.destination : "/";
      if (destination === "/billing" && !publicPortalUser(user).canViewBilling) {
        return res.status(403).json({ error: "billing_forbidden", message: "Akun ini tidak memiliki akses billing." });
      }
      const result = await store.createPortalHandoff(user.id, user.tenant_id);
      if (!result) return res.status(404).json({ error: "workspace_not_found" });
      const redirect = new URL(`https://${result.workspace.domain}/magic-login`);
      redirect.searchParams.set("token", result.handoffToken);
      if (destination !== "/") redirect.searchParams.set("redirect", destination);
      return res.json({ redirectUrl: redirect.toString() });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/portal/logout", async (req, res, next) => {
    try {
      const match = String(req.get("authorization") || "").match(/^Bearer\s+([A-Za-z0-9_-]{32,})$/i);
      if (match && store?.revokePortalSession && config.sessionSecret) {
        await store.revokePortalSession(tokenDigest(match[1], config.sessionSecret));
      }
      const requestCookies = parseCookies(req.headers.cookie);
      const authSessionToken = requestCookies[cookies.session];
      if (authSessionToken && store?.revokeSession && config.sessionSecret) {
        await store.revokeSession(tokenDigest(authSessionToken, config.sessionSecret));
      }
      const cookieToken = requestCookies[cookies.portalSession];
      if (cookieToken && store?.revokePortalSession && config.sessionSecret) {
        await store.revokePortalSession(tokenDigest(cookieToken, config.sessionSecret));
      }
      res.clearCookie(cookies.session, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
      });
      res.clearCookie(cookies.portalSession, {
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

  app.post("/api/auth/signup", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      if (!store || !config.sessionSecret) {
        return res.status(503).json({ error: "service_unavailable" });
      }
      const fullName = String(req.body?.fullName || "").trim();
      const email = normalizeEmail(req.body?.email);
      const password = String(req.body?.password || "");
      if (fullName.length < 2 || fullName.length > 120) {
        return res.status(400).json({ error: "invalid_name", message: "Masukkan nama lengkap yang valid." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return res.status(400).json({ error: "invalid_email", message: "Format email tidak valid." });
      }
      if (password.length < 8 || password.length > 200 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ error: "weak_password", message: "Password minimal 8 karakter dan harus berisi huruf serta angka." });
      }
      const signedInUser = await authenticatedUser(req);
      const user = await store.createPasswordUser({
        email,
        fullName,
        passwordHash: await hashPassword(password),
        authenticatedUserId: signedInUser?.id || "",
      });
      if (user.email_verified) {
        const state = await store.getAccountState(user.id);
        return res.json({
          authenticated: true,
          accountUpdated: true,
          user: publicUser({ ...user, provider: signedInUser?.provider }),
          ...state,
        });
      }
      await sendAccountEmail({
        user,
        actionType: "verify_email",
        subject: "Verifikasi email akun MOTOVAX",
        pathName: "/api/auth/verify-email",
        copy: "Verifikasi alamat email Anda untuk melanjutkan pembuatan workspace MOTOVAX.",
      });
      await issuePendingSignup(res, user.id);
      return res.status(202).json({
        verificationRequired: true,
        email: user.email,
        expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
        resendAfterSeconds: EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS,
      });
    } catch (error) {
      if (error?.code === "account_exists") {
        return res.status(409).json({ error: error.code, message: error.message });
      }
      return next(error);
    }
  });

  app.get("/api/auth/pending-signup", async (req, res, next) => {
    try {
      const user = await pendingSignupUser(req);
      if (!user || user.email_verified) {
        clearPendingSignupCookie(res);
        return res.status(401).json({ pending: false });
      }
      return res.json({
        pending: true,
        email: user.email,
        resendAfterSeconds: await verificationResendDelay(user.id),
        expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/auth/resend-verification", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      const user = await pendingSignupUser(req);
      if (!user) return res.status(401).json({ error: "pending_signup_required", message: "Sesi pendaftaran tidak ditemukan. Silakan daftar kembali." });
      if (user.email_verified) {
        clearPendingSignupCookie(res);
        return res.status(409).json({ error: "already_verified", message: "Email sudah diverifikasi. Silakan lanjutkan onboarding." });
      }
      const retryAfterSeconds = await verificationResendDelay(user.id);
      if (retryAfterSeconds > 0) {
        res.set("Retry-After", String(retryAfterSeconds));
        return res.status(429).json({
          error: "resend_cooldown",
          message: "Tunggu sebentar sebelum mengirim ulang email verifikasi.",
          retryAfterSeconds,
        });
      }
      await sendAccountEmail({
        user,
        actionType: "verify_email",
        subject: "Verifikasi email akun MOTOVAX",
        pathName: "/api/auth/verify-email",
        copy: "Verifikasi alamat email Anda untuk melanjutkan pembuatan workspace MOTOVAX.",
      });
      return res.status(202).json({
        sent: true,
        email: user.email,
        resendAfterSeconds: EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS,
        expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
      });
    } catch (error) {
      if (error?.code === "email_unavailable") return res.status(503).json({ error: error.code, message: error.message });
      return next(error);
    }
  });

  app.delete("/api/auth/pending-signup", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      const user = await pendingSignupUser(req);
      if (!user) {
        clearPendingSignupCookie(res);
        return res.status(204).end();
      }
      if (user.email_verified) {
        clearPendingSignupCookie(res);
        return res.status(409).json({ error: "already_verified", message: "Email sudah diverifikasi dan tidak dapat diganti dari halaman ini." });
      }
      const deleted = await store.deletePendingPasswordUser?.(user.id);
      if (!deleted) {
        return res.status(409).json({ error: "pending_signup_locked", message: "Pendaftaran ini sudah memiliki data lanjutan dan tidak dapat dibatalkan." });
      }
      clearPendingSignupCookie(res);
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      if (!store || !config.sessionSecret) {
        return res.status(503).json({ error: "service_unavailable" });
      }
      const email = normalizeEmail(req.body?.email);
      const password = String(req.body?.password || "");
      const user = await store.findPasswordUser(email);
      const valid = user?.password_hash ? await verifyPassword(password, user.password_hash) : false;
      if (!valid) {
        return res.status(401).json({ error: "invalid_credentials", message: "Email atau password tidak sesuai." });
      }
      if (!user.email_verified) {
        return res.status(403).json({ error: "verification_required", message: "Email belum diverifikasi. Periksa inbox Anda." });
      }
      await issueSession(req, res, user.id);
      const state = await store.getAccountState(user.id);
      return res.json({ authenticated: true, user: publicUser({ ...user, provider: "password" }), ...state });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/auth/verify-email", async (req, res, next) => {
    try {
      const token = String(req.query.token || "");
      const digest = token ? tokenDigest(token, config.sessionSecret) : "";
      const userId = digest
        ? await store.takeActionToken({ digest, actionType: "verify_email" })
        : null;
      if (!userId) {
        const status = digest && store?.getActionTokenStatus
          ? await store.getActionTokenStatus({ digest, actionType: "verify_email" })
          : "invalid";
        const reason = new Set(["used", "expired"]).has(status) ? status : "invalid";
        return res.redirect(302, `${config.publicBaseUrl}/onboarding.html?email=${reason}`);
      }
      await issueSession(req, res, userId);
      clearPendingSignupCookie(res);
      return res.redirect(302, `${config.publicBaseUrl}/onboarding.html?email=verified`);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/auth/forgot-password", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      const user = await store.findPasswordUser(normalizeEmail(req.body?.email));
      if (user?.password_hash) {
        await sendAccountEmail({
          user,
          actionType: "reset_password",
          subject: "Reset password akun MOTOVAX",
          pathName: "/onboarding.html?reset=1",
          copy: "Gunakan tautan berikut untuk membuat password baru. Tautan berlaku selama 30 menit.",
        });
      }
      return res.status(202).json({ message: "Jika email terdaftar, tautan reset telah dikirim." });
    } catch (error) {
      if (error?.code === "email_unavailable") return res.status(503).json({ error: error.code, message: error.message });
      return next(error);
    }
  });

  app.post("/api/auth/reset-password", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res) || !checkAuthRateLimit(req, res)) return;
      const token = String(req.body?.token || "");
      const password = String(req.body?.password || "");
      if (password.length < 8 || password.length > 200 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ error: "weak_password", message: "Password minimal 8 karakter dan harus berisi huruf serta angka." });
      }
      const userId = token
        ? await store.takeActionToken({ digest: tokenDigest(token, config.sessionSecret), actionType: "reset_password" })
        : null;
      if (!userId) return res.status(400).json({ error: "invalid_token", message: "Tautan reset tidak valid atau sudah kedaluwarsa." });
      await store.updatePassword(userId, await hashPassword(password));
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/onboarding/slug", async (req, res, next) => {
    try {
      const user = await authenticatedUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      const slug = normalizeSlug(req.query.slug);
      if (slug.length < 3 || RESERVED_SLUGS.has(slug)) {
        return res.json({ slug, available: false, reason: "reserved_or_invalid" });
      }
      const available = await store.isSlugAvailable(slug, config.tenantDomainSuffix);
      return res.json({ slug, available, domain: `${slug}.${config.tenantDomainSuffix}` });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/onboarding/profile", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res)) return;
      const user = await authenticatedUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      const profile = {
        businessName: String(req.body?.businessName || "").trim(),
        workspaceSlug: normalizeSlug(req.body?.workspaceSlug || req.body?.businessName),
        branchCount: String(req.body?.branchCount || "").trim(),
        region: String(req.body?.region || "").trim(),
        industry: "automotive",
        description: String(req.body?.description || "").trim().slice(0, 240),
        modules: Array.isArray(req.body?.modules)
          ? [...new Set(req.body.modules.filter((item) => ALLOWED_MODULES.has(item)))]
          : [],
        goal: ALLOWED_GOALS.has(req.body?.goal) ? req.body.goal : "conversion",
      };
      if (
        profile.businessName.length < 2
        || profile.businessName.length > 150
        || profile.region.length === 1
        || profile.region.length > 120
      ) {
        return res.status(400).json({ error: "invalid_profile", message: "Nama bisnis wajib diisi; wilayah boleh dikosongkan." });
      }
      if (profile.workspaceSlug.length < 3 || RESERVED_SLUGS.has(profile.workspaceSlug)) {
        return res.status(400).json({ error: "invalid_slug", message: "Subdomain minimal 3 karakter dan tidak boleh memakai nama sistem." });
      }
      const available = await store.isSlugAvailable(profile.workspaceSlug, config.tenantDomainSuffix);
      const currentState = await store.getAccountState(user.id);
      const ownsSameSlug = currentState.profile?.workspace_slug === profile.workspaceSlug && currentState.profile?.tenant_id;
      if (!available && !ownsSameSlug) {
        return res.status(409).json({ error: "slug_unavailable", message: "Subdomain sudah digunakan." });
      }
      const saved = await store.saveProfile(user.id, profile);
      return res.json({ profile: saved, domain: `${profile.workspaceSlug}.${config.tenantDomainSuffix}` });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/onboarding/complete", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res)) return;
      const user = await authenticatedUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      const state = await store.getAccountState(user.id);
      if (!state.profile || !Array.isArray(state.profile.modules) || state.profile.modules.length === 0) {
        return res.status(400).json({ error: "profile_incomplete", message: "Profil dan minimal satu modul wajib disimpan." });
      }
      await recaptchaVerifier(config, String(req.body?.recaptchaToken || ""));
      const result = await store.provisionWorkspace({ userId: user.id, suffix: config.tenantDomainSuffix });
      provisionDomainInBackground(result.workspace.domain);
      return res.status(202).json({
        workspace: {
          id: result.workspace.id,
          name: result.workspace.name,
          domain: result.workspace.domain,
          ready: false,
        },
      });
    } catch (error) {
      if (["profile_required", "slug_unavailable"].includes(error?.code)) {
        return res.status(error.code === "slug_unavailable" ? 409 : 400).json({ error: error.code, message: error.message });
      }
      if (["recaptcha_invalid", "recaptcha_low_score"].includes(error?.code)) {
        return res.status(400).json({ error: error.code, message: error.message });
      }
      if (error?.code === "recaptcha_unavailable") {
        return res.status(503).json({ error: error.code, message: error.message });
      }
      if (["55P03", "57014", "ETIMEDOUT"].includes(error?.code)) {
        return res.status(503).json({
          error: "workspace_timeout",
          message: "Persiapan workspace melewati batas waktu aman. Silakan coba lagi; proses bersifat idempoten.",
        });
      }
      if (["domain_provisioning_unavailable", "domain_provisioning_failed"].includes(error?.code)) {
        return res.status(503).json({ error: error.code, message: error.message });
      }
      return next(error);
    }
  });

  app.get("/api/workspaces/:tenantId/status", async (req, res, next) => {
    try {
      const user = await authenticatedUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      const state = await store.getAccountState(user.id);
      const workspace = state.workspaces.find((item) => item.id === req.params.tenantId);
      if (!workspace) return res.status(404).json({ error: "workspace_not_found" });
      const ready = await tenantDomainReady(workspace.domain);
      return res.json({ ready, workspace: { ...workspace, ready } });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/workspaces/:tenantId/enter", async (req, res, next) => {
    try {
      if (!assertSameOrigin(req, res)) return;
      const user = await authenticatedUser(req);
      if (!user) return res.status(401).json({ error: "not_authenticated" });
      const state = await store.getAccountState(user.id);
      const selected = state.workspaces.find((item) => item.id === req.params.tenantId);
      if (!selected) return res.status(404).json({ error: "workspace_not_found" });
      if (!(await tenantDomainReady(selected.domain))) {
        return res.status(409).json({ error: "workspace_provisioning", message: "Workspace masih menyiapkan domain HTTPS." });
      }
      const result = await store.createWorkspaceHandoff(user.id, req.params.tenantId);
      if (!result) return res.status(404).json({ error: "workspace_not_found" });
      return res.json({
        redirectUrl: `https://${result.workspace.domain}/magic-login?token=${encodeURIComponent(result.handoffToken)}`,
      });
    } catch (error) {
      return next(error);
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

      const authMode = req.query.mode === "portal"
        ? "portal"
        : req.query.mode === "login" ? "login" : "signup";
      const state = `${authMode === "portal" ? "portal." : ""}${randomToken(32)}`;
      const codeVerifier = randomToken(64);
      const nonce = randomToken(32);
      const codeChallenge = sha256(codeVerifier);

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
      const requestedState = String(req.query.state || "");
      let authMode = requestedState.startsWith("portal.") ? "portal" : "signup";
      req.oauthMode = authMode;
      const missing = missingOAuthConfig(config, store);
      if (missing.length || !client) {
        return res.redirect(302, oauthResultUrl(config, "failed", "configuration", authMode));
      }

      const requestCookies = parseCookies(req.headers.cookie);
      const state = requestedState;
      const stateCookie = requestCookies[cookies.state] || "";
      if (!state || !safeEqual(state, stateCookie)) {
        return res.redirect(302, oauthResultUrl(config, "failed", "state", authMode));
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
        return res.redirect(302, oauthResultUrl(config, "failed", "expired", authMode));
      }
      authMode = transaction.auth_mode === "portal" ? "portal" : transaction.auth_mode;
      req.oauthMode = authMode;
      if (req.query.error) {
        return res.redirect(302, oauthResultUrl(config, "denied", "", authMode));
      }

      const code = String(req.query.code || "");
      if (!code) {
        return res.redirect(302, oauthResultUrl(config, "failed", "code", authMode));
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

      const googleProfile = {
        subject: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split("@")[0],
        picture: payload.picture || "",
      };

      if (authMode === "portal") {
        if (!store.findPortalUsers || !store.createPortalSession) {
          return res.redirect(302, oauthResultUrl(config, "failed", "configuration", authMode));
        }
        const candidates = await store.findPortalUsers({ identifier: googleProfile.email });
        const matchingUsers = candidates.filter(
          (candidate) => String(candidate.email || "").trim().toLowerCase() === googleProfile.email,
        );
        if (matchingUsers.length === 0) {
          return res.redirect(302, oauthResultUrl(config, "failed", "account_not_found", authMode));
        }
        if (matchingUsers.length > 1 || candidates.length > 20) {
          return res.redirect(302, oauthResultUrl(config, "failed", "ambiguous_account", authMode));
        }
        await issuePortalSession(req, res, matchingUsers[0]);
        const handoff = await store.createPortalHandoff(matchingUsers[0].id, matchingUsers[0].tenant_id);
        if (!handoff) {
          return res.redirect(302, oauthResultUrl(config, "failed", "workspace_not_found", authMode));
        }
        const redirect = new URL(`https://${handoff.workspace.domain}/magic-login`);
        redirect.searchParams.set("token", handoff.handoffToken);
        return res.redirect(302, redirect.toString());
      }

      const user = await store.upsertGoogleUser(googleProfile);
      await issueSession(req, res, user.id);
      return res.redirect(302, oauthResultUrl(config, "success", "", authMode));
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
      if (!user || user.email_verified !== true) return res.status(401).json({ authenticated: false });
      const state = await store.getAccountState(user.id);
      return res.json({
        authenticated: true,
        user: publicUser(user),
        ...state,
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
      const portalSessionToken = requestCookies[cookies.portalSession];
      if (portalSessionToken && store?.revokePortalSession && config.sessionSecret) {
        await store.revokePortalSession(tokenDigest(portalSessionToken, config.sessionSecret));
      }
      const pendingUser = await pendingSignupUser(req);
      if (pendingUser && !pendingUser.email_verified && store?.deletePendingPasswordUser) {
        await store.deletePendingPasswordUser(pendingUser.id);
      }
      res.clearCookie(cookies.session, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
      });
      res.clearCookie(cookies.portalSession, {
        httpOnly: true,
        secure: cookies.secure,
        sameSite: "lax",
        path: "/",
      });
      clearPendingSignupCookie(res);
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
  app.get("/", (req, res, next) => {
    const authHost = new URL(config.publicBaseUrl).hostname;
    if (authHost === "onboard.motovax.com" && req.hostname === authHost) {
      return res.redirect(302, "/onboarding.html");
    }
    return next();
  });
  app.get(["/profile.html", "/billing.html"], (_req, res) => {
    return res.redirect(302, new URL("/login.html", config.publicBaseUrl).toString());
  });
  app.use(
    express.static(config.publicDir, {
      dotfiles: "deny",
      extensions: ["html"],
      index: "index.html",
      maxAge: config.nodeEnv === "production" ? "1h" : 0,
    }),
  );

  app.use((error, req, res, _next) => {
    console.error("request_failed", {
      path: req.path,
      message: error instanceof Error ? error.message : "unknown_error",
    });
    if (req.path === "/api/auth/google/callback") {
      return res.redirect(302, oauthResultUrl(config, "failed", "server", req.oauthMode));
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
