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
    if (entry.isDirectory()) {
      directories.push(...libraryDirectories(path.join(root, entry.name)));
    }
  }
  return directories;
}

before(async () => {
  baseUrl = process.env.MOTOVAX_UI_BASE_URL || "";
  if (!baseUrl) {
    const app = createApp({
      config: {
        nodeEnv: "test",
        port: 0,
        publicDir: process.cwd(),
        publicBaseUrl: "http://127.0.0.1",
        oauthSuccessUrl: "http://127.0.0.1/onboarding.html",
        googleClientId: "",
        googleClientSecret: "",
        googleRedirectUri: "http://127.0.0.1/api/auth/google/callback",
        sessionSecret: "",
        databaseUrl: "",
        trustProxy: false,
      },
    });
    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
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
    args: useAlpineChromium
      ? ["--disable-gpu", "--disable-gpu-compositing"]
      : [],
    env: useAlpineChromium
      ? {
          ...process.env,
          LD_LIBRARY_PATH: libraryPath,
          FONTCONFIG_PATH: path.join(chromiumRoot, "etc/fonts"),
          FONTCONFIG_FILE: path.join(chromiumRoot, "etc/fonts/fonts.conf"),
          FONTCONFIG_SYSROOT: chromiumRoot,
          XDG_DATA_DIRS: path.join(chromiumRoot, "usr/share"),
        }
      : process.env,
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
  test(`onboarding OAuth responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });

    const result = await page.evaluate(() => {
      const googleButton = document.querySelector("[data-google-login]");
      const rect = googleButton.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        googleHref: googleButton.href,
        googleWidth: rect.width,
        googleHeight: rect.height,
        googleVisible: rect.width > 0 && rect.height > 0,
        hasDemoGoogleForm: document.body.textContent.includes("simulasi Google Sign-In"),
        hasLoginForm: Boolean(document.querySelector("#authFormLogin")),
        hasLoginTab: Boolean(document.querySelector('[data-auth-mode="login"]')),
        title: document.querySelector("#onboardingPanelTitle")?.textContent.trim(),
      };
    });

    assert.equal(result.overflow, false);
    assert.equal(result.googleVisible, true);
    assert.ok(result.googleWidth > 200);
    assert.ok(result.googleHeight >= 44);
    assert.equal(
      result.googleHref,
      "https://onboard.motovax.com/api/auth/google/start?mode=signup",
    );
    assert.equal(result.hasDemoGoogleForm, false);
    assert.equal(result.hasLoginForm, false);
    assert.equal(result.hasLoginTab, false);
    assert.equal(result.title, "Buat akun baru");

    await page.screenshot({
      path: `/tmp/motovax-oauth-${viewport.name}.png`,
      fullPage: true,
    });
    await context.close();
  });

  test(`flow onboarding tenant responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/signup", (route) => route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        authenticated: true,
        user: { id: "account-1", email: "owner@example.com", fullName: "Owner Test", provider: "password" },
      }),
    }));
    await page.route("**/api/onboarding/profile", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ profile: {}, domain: "dealer-test.motovax.com" }),
    }));
    await page.route("**/api/onboarding/complete", (route) => route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        workspace: {
          id: "tenant-1",
          name: "Dealer Test",
          domain: "dealer-test.motovax.com",
          redirectUrl: "https://dealer-test.motovax.com/magic-login?token=test",
        },
      }),
    }));

    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Test");
    await page.fill('[data-auth-form="signup"] input[name="email"]', "owner@example.com");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia123");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia123");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.fill('[data-business-form] input[name="businessName"]', "Dealer Test");
    await page.fill('[data-business-form] input[name="workspaceSlug"]', "dealer-test");
    await page.fill('[data-business-form] input[name="region"]', "Jakarta");
    await page.click('[data-business-form] button[type="submit"]');
    await page.click('[data-modules-form] button[type="submit"]');
    await page.waitForSelector('[data-step="4"].is-active');

    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      domain: document.querySelector("[data-summary-domain]")?.textContent,
      enterVisible: Boolean(document.querySelector("[data-open-workspace]")?.getBoundingClientRect().height),
    }));
    assert.equal(result.overflow, false);
    assert.equal(result.domain, "dealer-test.motovax.com");
    assert.equal(result.enterVisible, true);
    await page.screenshot({ path: `/tmp/motovax-tenant-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}
