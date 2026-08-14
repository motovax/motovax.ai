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

for (const viewport of viewports) {
  test(`CTA daftar membuka formulir registrasi awal kosong pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      localStorage.setItem("motovax_onboarding_v1", JSON.stringify({
        step: 4,
        account: { fullName: "Owner Demo", email: "owner@demo.test" },
        business: { businessName: "Tenant Demo", workspaceSlug: "tenant-demo", industry: "automotive" },
        completed: true,
        workspace: { id: "tenant-demo", name: "Tenant Demo", domain: "tenant-demo.motovax.com", ready: true },
      }));
    });
    const page = await context.newPage();
    let logoutCount = 0;
    let meCount = 0;
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: true, siteKey: "test", action: "complete_onboarding" } }) }));
    await page.route("**/api/auth/logout", (route) => {
      logoutCount += 1;
      return route.fulfill({ status: 204 });
    });
    await page.route("**/api/auth/me", (route) => {
      meCount += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
        authenticated: true,
        user: { id: "owner-demo", email: "owner@demo.test", fullName: "Owner Demo", provider: "password" },
        profile: { business_name: "Tenant Demo", workspace_slug: "tenant-demo" },
        workspaces: [{ id: "tenant-demo", name: "Tenant Demo", domain: "tenant-demo.motovax.com", ready: true }],
      }) });
    });

    await page.goto(`${baseUrl}/onboarding.html?fresh=1`, { waitUntil: "load" });
    await page.waitForFunction(() => !new URL(window.location.href).searchParams.has("fresh"));
    await page.waitForSelector('[data-step="1"].is-active');

    assert.equal(logoutCount, 1);
    assert.equal(meCount, 0);
    assert.equal(await page.inputValue('[data-auth-form="signup"] input[name="fullName"]'), "");
    assert.equal(await page.inputValue('[data-auth-form="signup"] input[name="email"]'), "");
    assert.equal(await page.locator('[data-step="4"]').isHidden(), true);
    assert.equal(await page.getByText("Jadwalkan demo live", { exact: false }).count(), 0);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("motovax_onboarding_v1")).workspace), null);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-fresh-registration-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}

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
    let signupCount = 0;
    let profilePayload;
    await page.route("**/api/auth/signup", (route) => {
      signupCount += 1;
      const accountPayload = route.request().postDataJSON();
      const savedProfile = profilePayload ? {
        business_name: profilePayload.businessName,
        workspace_slug: profilePayload.workspaceSlug,
        branch_count: profilePayload.branchCount,
        region: profilePayload.region,
        description: profilePayload.description,
        modules: profilePayload.modules,
        goal: profilePayload.goal,
      } : null;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          authenticated: true,
          accountUpdated: signupCount > 1,
          user: { id: "owner-1", email: accountPayload.email, fullName: accountPayload.fullName, provider: "password" },
          profile: savedProfile,
          workspaces: [],
        }),
      });
    });
    await page.route("**/api/onboarding/slug?**", (route) => {
      const slug = new URL(route.request().url()).searchParams.get("slug");
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ slug, available: true, domain: `${slug}.motovax.com` }) });
    });
    await page.route("**/api/onboarding/profile", (route) => {
      profilePayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ profile: profilePayload, domain: `${profilePayload.workspaceSlug}.motovax.com` }) });
    });
    const workspaceReady = viewport.name === "desktop";
    await page.route("**/api/onboarding/complete", (route) => route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        workspace: { id: "tenant-1", name: "Dealer Maju Jaya", domain: "dealer-maju-jaya.motovax.com", ready: workspaceReady },
        portalSession: { token: `portal-onboarding-${viewport.name}`, returnUrl: "https://motovax.ai/" },
      }),
    }));
    await page.route("https://motovax.ai/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Landing</title>" }));

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

    await page.click('[data-step="3"] [data-step-back]');
    await page.waitForSelector('[data-step="2"].is-active');
    await page.click('[data-step="2"] [data-step-back]');
    await page.waitForSelector('[data-step="1"].is-active');
    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Dealer Diperbarui");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia456");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia456");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-step="2"].is-active');
    assert.equal(signupCount, 2);
    assert.equal(await page.locator('[data-auth-form="signup"] [data-form-error]').isHidden(), true);
    assert.equal(await page.inputValue('[data-business-form] input[name="businessName"]'), "Dealer Maju Jaya");
    await page.click('[data-business-form] button[type="submit"]');
    await page.waitForSelector('[data-step="3"].is-active');

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
    await page.waitForURL("https://motovax.ai/**");
    const onboardingFragment = new URLSearchParams(new URL(page.url()).hash.replace(/^#/, ""));
    assert.equal(onboardingFragment.get("portal_session"), `portal-onboarding-${viewport.name}`);
    assert.equal(onboardingFragment.has("portal_action"), false);
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
    assert.equal(await page.getAttribute('.portal-register-prompt a', "href"), "https://onboard.motovax.com/onboarding.html?fresh=1");
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
    assert.equal(loginFragment.has("portal_action"), false);
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
    assert.equal(await page.getAttribute('[data-portal-menu] a[href="./profile.html"]', "href"), "./profile.html");
    assert.equal(await page.locator("[data-portal-billing]").isVisible(), true);
    assert.equal(await page.getAttribute('[data-portal-menu] a[href="./billing.html"]', "href"), "./billing.html");
    assert.equal(await page.locator("[data-portal-workspace]").isVisible(), true);
    assert.equal(await page.locator("[data-portal-logout]").isVisible(), true);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-account-${viewport.name}.png`, fullPage: false });
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-portal-menu]").isHidden(), true);

    await page.route("https://onboard.motovax.com/api/portal/billing", (route) => {
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
        body: JSON.stringify({
          tenant_id: "tenant-1",
          tenant_name: "Dealer Test",
          period_start: "2026-08-01T00:00:00.000Z",
          period_end: "2026-09-01T00:00:00.000Z",
          member_count: 2,
          max_users: 25,
          max_listings: 500,
          enabled_features: ["inventory_management", "crm_autopilot", "billing_menu"],
          members: [
            { id: "owner-1", display_name: "Owner Dealer", username: "owner", roles: "Admin" },
            { id: "sales-1", display_name: "Sales Dealer", username: "sales", roles: "Sales" },
          ],
          billing_configured: false,
          invoice_status: "not_configured",
        }),
      });
    });

    await page.goto(`${baseUrl}/profile.html`, { waitUntil: "load" });
    await page.waitForSelector("[data-account-shell]:not([hidden])");
    assert.equal(await page.locator('[data-account-page="profile"] [data-account-email]').first().textContent(), "owner@dealer.test");
    assert.equal(await page.locator('[data-account-page="profile"] [data-account-domain]').textContent(), "dealer-test.motovax.com");
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-profile-${viewport.name}.png`, fullPage: false });

    await page.goto(`${baseUrl}/billing.html`, { waitUntil: "load" });
    await page.waitForSelector("[data-account-shell]:not([hidden])");
    assert.equal(await page.locator("[data-billing-members]").textContent(), "2");
    assert.equal(await page.locator("[data-billing-module-count]").textContent(), "2");
    assert.equal(await page.locator("[data-billing-member-list] .account-member").count(), 2);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-billing-${viewport.name}.png`, fullPage: false });
    await context.close();
  });

  test(`positioning dealer mobil konsisten pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());

    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    assert.equal(
      await page.locator("[data-typewriter]").getAttribute("data-phrases"),
      "More Test Drives.|More Unit Sales.",
    );
    assert.equal(await noOverflow(page), true);

    await page.goto(`${baseUrl}/solusi/otomotif.html`, { waitUntil: "load" });
    await page.waitForSelector("[data-industry-root] h1");
    const bodyText = await page.locator("body").innerText();
    assert.match(bodyText, /dealer mobil/i);
    assert.doesNotMatch(bodyText, /Pendidikan|Keuangan|Kesehatan|Tour & Travel|Perhotelan|Logistik|FMCG|Ritel|Outsourcing|Property/i);

    if (viewport.width > 900) {
      await page.click("[data-solusi-trigger]");
      assert.equal(
        await page.locator('[data-solusi-panel]:not([hidden]) .solusi-mega-item', { hasText: "Solusi Dealer Mobil" }).isVisible(),
        true,
      );
    } else {
      await page.click("[data-mobile-nav-trigger]");
      assert.equal(
        await page.locator('[data-mobile-nav-panel]:not([hidden]) a', { hasText: "Solusi Dealer Mobil" }).isVisible(),
        true,
      );
    }

    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-dealer-positioning-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}

test("session portal dari login berhenti di motovax.ai tanpa handoff otomatis", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const token = "portal-token-test-abcdefghijklmnopqrstuvwxyz123456";
  let enterRequestCount = 0;
  await page.route("https://onboard.motovax.com/api/portal/workspace/enter", (route) => {
    enterRequestCount += 1;
    return route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
  });
  await page.route("https://onboard.motovax.com/api/portal/me", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: true, user: { username: "owner", displayName: "Owner Dealer", email: "owner@dealer.test", role: "Admin", canViewBilling: true, tenant: { id: "tenant-1", name: "Dealer Test", domain: "dealer-test.motovax.com" } } }),
  }));

  await page.goto(`${baseUrl}/index.html#portal_session=${token}&portal_action=enter_workspace`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-portal-account]:not([hidden])");
  assert.equal(new URL(page.url()).origin, baseUrl);
  assert.equal(new URL(page.url()).hash, "");
  assert.equal(enterRequestCount, 0);
  const storage = await context.storageState();
  const landingStorage = storage.origins.find((item) => item.origin === baseUrl)?.localStorage || [];
  assert.equal(landingStorage.find((item) => item.name === "motovax_portal_session")?.value, token);
  await context.close();
});
