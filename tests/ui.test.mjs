import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { after, before, test } from "node:test";
import { homedir } from "node:os";
import path from "node:path";

import { chromium } from "playwright";

import { createApp } from "../server.mjs";

let browser;
let server;
let baseUrl;

function libraryDirectories(root) {
  if (!existsSync(root)) return [];
  const directories = [root];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) directories.push(...libraryDirectories(path.join(root, entry.name)));
  }
  return directories;
}

before(async () => {
  const app = createApp({
    config: {
      nodeEnv: "test",
      port: 0,
      publicDir: process.cwd(),
      publicBaseUrl: "http://127.0.0.1",
      portalLandingUrl: "https://motovax.ai/",
      oauthSuccessUrl: "http://127.0.0.1/onboarding.html",
      googleClientId: "",
      googleClientSecret: "",
      googleRedirectUri: "http://127.0.0.1/api/auth/google/callback",
      sessionSecret: "",
      databaseUrl: "",
      tenantDomainSuffix: "motovax.com",
      trustProxy: false,
    },
  });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const chromiumRoot = path.join(homedir(), ".local/chromium-root");
  const chromiumPath = path.join(chromiumRoot, "usr/lib/chromium/chromium");
  const useAlpineChromium = existsSync(chromiumPath);
  const libraryPath = [
    ...libraryDirectories(path.join(chromiumRoot, "lib")),
    ...libraryDirectories(path.join(chromiumRoot, "usr/lib")),
  ].join(":");
  browser = await chromium.launch({
    headless: true,
    executablePath: useAlpineChromium ? chromiumPath : undefined,
    args: useAlpineChromium ? ["--disable-gpu", "--disable-gpu-compositing"] : [],
    env: useAlpineChromium ? {
      ...process.env,
      LD_LIBRARY_PATH: libraryPath,
      FONTCONFIG_PATH: path.join(chromiumRoot, "etc/fonts"),
      FONTCONFIG_FILE: path.join(chromiumRoot, "etc/fonts/fonts.conf"),
      FONTCONFIG_SYSROOT: chromiumRoot,
      XDG_DATA_DIRS: path.join(chromiumRoot, "usr/share"),
    } : process.env,
  });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
});

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

function fitsViewport(page) {
  return page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight);
}

for (const viewport of viewports) {
  test(`onboarding dealer mandiri responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      window.grecaptcha = { enterprise: { ready(callback) { callback(); }, execute() { return Promise.resolve("recaptcha-token"); } } };
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/me", (route) => route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ authenticated: false }) }));
    await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: true, siteKey: "test", action: "complete_onboarding" } }) }));
    await page.route("**/api/auth/signup", (route) => route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ authenticated: true, user: { id: "owner-1", email: "owner@dealer.test", fullName: "Owner Dealer", provider: "password" } }) }));
    await page.route("**/api/onboarding/slug?**", (route) => {
      const slug = new URL(route.request().url()).searchParams.get("slug");
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ slug, available: true, domain: `${slug}.motovax.com` }) });
    });
    let profilePayload;
    await page.route("**/api/onboarding/profile", (route) => {
      profilePayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ profile: profilePayload, domain: `${profilePayload.workspaceSlug}.motovax.com` }) });
    });
    await page.route("**/api/onboarding/complete", (route) => route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ workspace: { id: "tenant-1", name: "Dealer Maju Jaya", domain: "dealer-maju-jaya.motovax.com", ready: false } }) }));

    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await page.waitForSelector('[data-step="1"].is-active');
    assert.equal(await page.locator("[data-rail-step]").count(), 4);
    assert.equal(await page.locator("[data-onboarding-choice]").count(), 0);
    assert.equal(await page.locator("[data-industry]").count(), 0);

    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Dealer");
    await page.fill('[data-auth-form="signup"] input[name="email"]', "owner@dealer.test");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia123");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia123");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-step="2"].is-active');

    await page.fill('[data-business-form] input[name="businessName"]', "Dealer Maju Jaya");
    assert.equal(await page.inputValue('[data-business-form] input[name="workspaceSlug"]'), "dealer-maju-jaya");
    assert.equal(await page.getAttribute('[data-business-form] select[name="branchCount"]', "required"), null);
    assert.equal(await page.getAttribute('[data-business-form] input[name="region"]', "required"), null);
    await page.locator('[data-business-form] input[name="workspaceSlug"]').blur();
    await page.waitForSelector('[data-slug-status][data-state="available"]');
    await page.click('[data-business-form] button[type="submit"]');
    await page.waitForSelector('[data-step="3"].is-active');
    assert.equal(profilePayload.industry, "automotive");
    assert.equal(profilePayload.branchCount, "");
    assert.equal(profilePayload.region, "");

    await page.click('[data-modules-form] button[type="submit"]');
    await page.waitForSelector('[data-step="4"].is-active');
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      industry: document.querySelector("[data-summary-industry]")?.textContent.trim(),
      branches: document.querySelector("[data-summary-branches]")?.textContent.trim(),
      railActive: document.querySelector("[data-rail-step].is-active")?.getAttribute("data-rail-step"),
    }));
    assert.deepEqual(result, { overflow: false, industry: "Dealer mobil", branches: "Belum ditentukan", railActive: "4" });
    await page.screenshot({ path: `/tmp/motovax-onboarding-${viewport.name}.png`, fullPage: false });
    await context.close();
  });

  test(`halaman login tenant responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    let loginPayload;
    await page.route("**/api/portal/login", (route) => {
      loginPayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ token: "portal-token-test-abcdefghijklmnopqrstuvwxyz123456", returnUrl: "https://motovax.ai/" }) });
    });
    await page.route("https://motovax.ai/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Landing</title>" }));
    await page.goto(`${baseUrl}/login.html`, { waitUntil: "load" });
    assert.equal(await page.getAttribute('.portal-register-prompt a', "href"), "https://onboard.motovax.com/");
    assert.equal(await page.locator('input[name="workspace"]').count(), 0);
    await page.fill('input[name="identifier"]', "owner");
    await page.click('[data-portal-login-form] button[type="submit"]');
    assert.equal(await page.locator('[data-login-error]').isVisible(), true);
    assert.equal(await fitsViewport(page), true);
    await page.fill('#portalPassword', "rahasia123");
    await page.click('[data-password-toggle]');
    assert.equal(await page.getAttribute('#portalPassword', "type"), "text");
    await page.click('[data-password-toggle]');
    assert.equal(await noOverflow(page), true);
    assert.equal(await fitsViewport(page), true);
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    await page.screenshot({ path: `/tmp/motovax-login-${viewport.name}.png`, fullPage: false });
    const response = page.waitForResponse((item) => item.url().endsWith("/api/portal/login"));
    await page.click('[data-portal-login-form] button[type="submit"]');
    await response;
    await page.waitForURL("https://motovax.ai/**");
    assert.deepEqual(loginPayload, { identifier: "owner", password: "rahasia123" });
    const loginFragment = new URLSearchParams(new URL(page.url()).hash.replace(/^#/, ""));
    assert.equal(loginFragment.get("portal_session"), "portal-token-test-abcdefghijklmnopqrstuvwxyz123456");
    assert.equal(loginFragment.get("portal_action"), "enter_workspace");
    await context.close();
  });

  test(`menu akun beranda responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => localStorage.setItem("motovax_portal_session", "portal-token-test-abcdefghijklmnopqrstuvwxyz123456"));
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("https://onboard.motovax.com/api/portal/me", (route) => {
      const corsHeaders = {
        "access-control-allow-origin": baseUrl,
        "access-control-allow-headers": "Authorization, Content-Type",
        "access-control-allow-methods": "GET, POST, OPTIONS",
      };
      if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: corsHeaders });
      return route.fulfill({
        status: 200,
        headers: corsHeaders,
        contentType: "application/json",
        body: JSON.stringify({ authenticated: true, user: { username: "owner", displayName: "Owner Dealer", email: "owner@dealer.test", role: "Admin", canViewBilling: true, tenant: { id: "tenant-1", name: "Dealer Test", domain: "dealer-test.motovax.com" } } }),
      });
    });
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    await page.waitForSelector("[data-portal-account]:not([hidden])");
    assert.equal(await page.locator("[data-portal-guest]").isHidden(), true);
    await page.click("[data-portal-trigger]");
    assert.equal(await page.locator("[data-portal-menu]").isVisible(), true);
    assert.equal(await page.locator('[data-portal-destination="/settings/account"]').isVisible(), true);
    assert.equal(await page.locator("[data-portal-billing]").isVisible(), true);
    assert.equal(await page.locator('[data-portal-destination="/"]').isVisible(), true);
    assert.equal(await page.locator("[data-portal-logout]").isVisible(), true);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-account-${viewport.name}.png`, fullPage: false });
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-portal-menu]").isHidden(), true);
    await context.close();
  });
}

test("session portal dari login langsung melakukan handoff ke workspace tenant", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const token = "portal-token-test-abcdefghijklmnopqrstuvwxyz123456";
  let enterPayload;
  let authorization;
  await page.route("https://onboard.motovax.com/api/portal/workspace/enter", (route) => {
    const corsHeaders = {
      "access-control-allow-origin": baseUrl,
      "access-control-allow-headers": "Authorization, Content-Type",
      "access-control-allow-methods": "GET, POST, OPTIONS",
    };
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: corsHeaders });
    enterPayload = route.request().postDataJSON();
    authorization = route.request().headers().authorization;
    return route.fulfill({
      status: 200,
      headers: corsHeaders,
      contentType: "application/json",
      body: JSON.stringify({ redirectUrl: "https://dealer-test.motovax.com/magic-login?token=handoff-token" }),
    });
  });
  await page.route("https://dealer-test.motovax.com/**", (route) => route.fulfill({
    status: 200,
    contentType: "text/html",
    body: "<title>Workspace Dealer Test</title>",
  }));

  await page.goto(`${baseUrl}/index.html#portal_session=${token}&portal_action=enter_workspace`, { waitUntil: "domcontentloaded" });
  await page.waitForURL("https://dealer-test.motovax.com/**");
  assert.deepEqual(enterPayload, { destination: "/" });
  assert.equal(authorization, `Bearer ${token}`);
  const storage = await context.storageState();
  const landingStorage = storage.origins.find((item) => item.origin === baseUrl)?.localStorage || [];
  assert.equal(landingStorage.find((item) => item.name === "motovax_portal_session")?.value, token);
  await context.close();
});
