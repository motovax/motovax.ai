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
  { name: "reported-1068", width: 1068, height: 693 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 700 },
];

for (const viewport of viewports) {
  test(`onboarding OAuth responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      localStorage.setItem("motovax_onboarding_v1", JSON.stringify({
        step: 4,
        completed: true,
        account: { fullName: "Cache Lama", email: "cache@example.com" },
        business: { businessName: "Tenant Cache", workspaceSlug: "tenant-cache" },
        workspace: { id: "stale", domain: "tenant-cache.motovax.com", ready: true },
      }));
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/me", (route) => route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: false }),
    }));
    const sessionResponse = page.waitForResponse((response) => response.url().endsWith("/api/auth/me"));
    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await sessionResponse;
    await page.waitForSelector('[data-step="1"].is-active');
    await page.waitForFunction(() => {
      const state = JSON.parse(localStorage.getItem("motovax_onboarding_v1"));
      return state.completed === false && state.workspace === null;
    });

    const result = await page.evaluate(() => {
      const googleButton = document.querySelector("[data-google-login]");
      const rect = googleButton.getBoundingClientRect();
      const panelRect = document.querySelector(".onboarding-panel").getBoundingClientRect();
      const railRect = document.querySelector(".onboarding-rail").getBoundingClientRect();
      const firstInput = document.querySelector('[data-auth-form="signup"] input');
      const headerBack = document.querySelector(".onboarding-link-muted");
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
        panelTop: panelRect.top,
        railHeight: railRect.height,
        inputFontSize: Number.parseFloat(getComputedStyle(firstInput).fontSize),
        inputHeight: firstInput.getBoundingClientRect().height,
        headerBackHeight: headerBack.getBoundingClientRect().height,
        cachedState: JSON.parse(localStorage.getItem("motovax_onboarding_v1")),
        recaptchaLinks: Array.from(document.querySelectorAll('.onboarding-recaptcha-disclosure a'))
          .map((link) => link.href),
        contentLinks: Array.from(document.querySelectorAll('a[href]'))
          .filter((link) => !link.matches('[data-google-login]')
            && !link.closest('[data-reset-form]')
            && !link.closest('.onboarding-recaptcha-disclosure'))
          .map((link) => link.href),
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
    if (viewport.width <= 980) {
      assert.ok(result.panelTop < viewport.height * 0.5, JSON.stringify(result));
      assert.ok(result.railHeight <= 80, JSON.stringify(result));
    }
    if (viewport.width <= 720) {
      assert.equal(result.inputFontSize, 16, JSON.stringify(result));
      assert.ok(result.inputHeight >= 48, JSON.stringify(result));
      assert.ok(result.googleHeight >= 48, JSON.stringify(result));
      assert.ok(result.headerBackHeight >= 44, JSON.stringify(result));
    }
    assert.equal(result.cachedState.completed, false, JSON.stringify(result.cachedState));
    assert.equal(result.cachedState.workspace, null);
    assert.ok(
      result.recaptchaLinks.some((href) => href.startsWith("https://policies.google.com/privacy")),
      JSON.stringify(result.recaptchaLinks),
    );
    assert.ok(
      result.recaptchaLinks.some((href) => href.startsWith("https://policies.google.com/terms")),
      JSON.stringify(result.recaptchaLinks),
    );
    assert.ok(result.contentLinks.length > 0);
    assert.ok(
      result.contentLinks.every((href) => href.startsWith("https://motovax.ai/")),
      `Tautan nonregistrasi harus menuju motovax.ai: ${result.contentLinks.join(", ")}`,
    );

    await page.screenshot({
      path: `/tmp/motovax-oauth-${viewport.name}.png`,
      fullPage: true,
    });
    await context.close();
  });

  test(`flow onboarding tenant responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      window.grecaptcha = {
        enterprise: {
          ready(callback) { callback(); },
          execute() { return Promise.resolve("test-recaptcha-token"); },
        },
      };
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/me", (route) => route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: false }),
    }));
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
    await page.route("**/api/config", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        recaptcha: {
          enabled: true,
          siteKey: "test-site-key",
          action: "complete_onboarding",
        },
      }),
    }));
    await page.route("**/api/onboarding/slug?**", (route) => {
      const slug = new URL(route.request().url()).searchParams.get("slug");
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          slug,
          available: slug !== "workspace-terpakai",
          domain: `${slug}.motovax.com`,
        }),
      });
    });
    await page.route("**/api/onboarding/complete", (route) => {
      assert.equal(route.request().postDataJSON().recaptchaToken, "test-recaptcha-token");
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          workspace: {
            id: "tenant-1",
            name: "Dealer Test",
            domain: "dealer-test.motovax.com",
            ready: false,
            redirectUrl: "https://dealer-test.motovax.com/magic-login?token=test",
          },
        }),
      });
    });

    const sessionResponse = page.waitForResponse((response) => response.url().endsWith("/api/auth/me"));
    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await sessionResponse;
    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Test");
    await page.fill('[data-auth-form="signup"] input[name="email"]', "owner@example.com");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia123");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia123");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-step="2"].is-active');
    const pathChoice = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      choices: document.querySelectorAll("[data-onboarding-choice]").length,
      backVisible: Boolean(document.querySelector("[data-path-back-account]")?.getBoundingClientRect().height),
    }));
    assert.deepEqual(pathChoice, { overflow: false, choices: 2, backVisible: true });
    await page.screenshot({ path: `/tmp/motovax-onboarding-path-${viewport.name}.png`, fullPage: false });
    await page.click("[data-path-back-account]");
    await page.waitForSelector('[data-step="1"].is-active');
    await page.evaluate(() => window.motovaxOnboarding.goTo(2));
    await page.click('[data-onboarding-choice="self"]');
    await page.waitForSelector('[data-step="3"].is-active');
    await page.fill('[data-business-form] input[name="businessName"]', "Dealer Test");
    assert.equal(await page.inputValue('[data-business-form] input[name="workspaceSlug"]'), "");
    await page.fill('[data-business-form] input[name="workspaceSlug"]', "workspace-terpakai");
    await page.fill('[data-business-form] input[name="region"]', "Jakarta");
    await page.locator('[data-business-form] input[name="workspaceSlug"]').blur();
    await page.waitForSelector('[data-slug-status][data-state="unavailable"]');
    await page.screenshot({ path: `/tmp/motovax-workspace-${viewport.name}.png`, fullPage: false });
    await page.click('[data-business-form] button[type="submit"]');
    await page.waitForSelector('[data-step="3"].is-active');
    await page.fill('[data-business-form] input[name="workspaceSlug"]', "dealer-test");
    await page.locator('[data-business-form] input[name="workspaceSlug"]').blur();
    await page.waitForSelector('[data-slug-status][data-state="available"]');
    await page.click('[data-business-form] button[type="submit"]');
    await page.waitForSelector('[data-step="4"].is-active');
    const recaptchaStep = await page.evaluate(() => {
      const hint = document.querySelector(".onboarding-complete-action .onboarding-hint");
      const button = document.querySelector('[data-modules-form] button[type="submit"]');
      const back = document.querySelector(".onboarding-module-back");
      const buttonRect = button?.getBoundingClientRect();
      const backRect = back?.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        hintVisible: Boolean(hint?.getBoundingClientRect().height),
        buttonVisible: Boolean(button?.getBoundingClientRect().height),
        heightDelta: Math.abs((buttonRect?.height || 0) - (backRect?.height || 0)),
        bottomDelta: Math.abs((buttonRect?.bottom || 0) - (backRect?.bottom || 0)),
        horizontalGap: (buttonRect?.left || 0) - (backRect?.right || 0),
        borderRadius: getComputedStyle(button).borderRadius,
        arrowSize: document.querySelector(".onboarding-finish-button i")?.getBoundingClientRect().width,
      };
    });
    assert.equal(recaptchaStep.overflow, false);
    assert.equal(recaptchaStep.hintVisible, true);
    assert.equal(recaptchaStep.buttonVisible, true);
    assert.ok(recaptchaStep.heightDelta <= 0.1, JSON.stringify(recaptchaStep));
    if (viewport.width > 720) {
      assert.ok(recaptchaStep.bottomDelta <= 0.1, JSON.stringify(recaptchaStep));
      assert.ok(recaptchaStep.horizontalGap >= 64, JSON.stringify(recaptchaStep));
    }
    assert.equal(recaptchaStep.borderRadius, "12px");
    assert.equal(recaptchaStep.arrowSize, 30);
    await page.screenshot({ path: `/tmp/motovax-recaptcha-${viewport.name}.png`, fullPage: false });
    await page.click('[data-modules-form] button[type="submit"]');
    await page.waitForSelector('[data-step="5"].is-active');

    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      domain: document.querySelector("[data-summary-domain]")?.textContent,
      enterVisible: Boolean(document.querySelector("[data-open-workspace]")?.getBoundingClientRect().height),
      enterDisabled: document.querySelector("[data-open-workspace]")?.disabled,
      enterCursor: getComputedStyle(document.querySelector("[data-open-workspace]")).cursor,
      enterBackground: getComputedStyle(document.querySelector("[data-open-workspace]")).backgroundColor,
      enterShadow: getComputedStyle(document.querySelector("[data-open-workspace]")).boxShadow,
    }));
    assert.equal(result.overflow, false);
    assert.equal(result.domain, "dealer-test.motovax.com");
    assert.equal(result.enterVisible, true);
    assert.equal(result.enterDisabled, true);
    assert.equal(result.enterCursor, "not-allowed");
    assert.equal(result.enterBackground, "rgb(226, 232, 240)");
    assert.equal(result.enterShadow, "none");
    await page.screenshot({ path: `/tmp/motovax-tenant-${viewport.name}.png`, fullPage: false });

    const readyResult = await page.evaluate(() => {
      window.motovaxOnboarding.state.workspace.ready = true;
      window.motovaxOnboarding.renderSummary();
      const button = document.querySelector("[data-open-workspace]");
      return {
        disabled: button.disabled,
        label: button.textContent.trim(),
        backgroundImage: getComputedStyle(button).backgroundImage,
      };
    });
    assert.equal(readyResult.disabled, false);
    assert.match(readyResult.label, /Masuk ke workspace/);
    assert.match(readyResult.backgroundImage, /linear-gradient/);
    await context.close();
  });

  test(`flow onboarding bersama tim responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      window.grecaptcha = {
        enterprise: {
          ready(callback) { callback(); },
          execute() { return Promise.resolve("team-recaptcha-token"); },
        },
      };
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/me", (route) => route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: false }),
    }));
    await page.route("**/api/auth/signup", (route) => route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        authenticated: true,
        user: { id: "account-team", email: "team-owner@example.com", fullName: "Team Owner", provider: "password" },
      }),
    }));
    await page.route("**/api/config", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        recaptcha: { enabled: true, siteKey: "test-site-key", action: "complete_onboarding" },
      }),
    }));
    await page.route("**/api/onboarding/meeting", (route) => {
      const request = route.request().postDataJSON();
      assert.equal(request.recaptchaToken, "team-recaptcha-token");
      assert.equal(request.timezone, "Asia/Jakarta");
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          meeting: {
            id: "meeting-1",
            scheduledFor: `${request.date}T03:30:00.000Z`,
            timezone: "Asia/Jakarta",
            status: "requested",
          },
        }),
      });
    });

    const sessionResponse = page.waitForResponse((response) => response.url().endsWith("/api/auth/me"));
    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await sessionResponse;
    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Team Owner");
    await page.fill('[data-auth-form="signup"] input[name="email"]', "team-owner@example.com");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia123");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia123");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-step="2"].is-active');
    await page.click('[data-onboarding-choice="team"]');
    await page.waitForSelector('[data-meeting-form]:not([hidden])');
    assert.equal(await page.locator(".onboarding-path-grid").evaluate((element) => element.getBoundingClientRect().height), 0);
    assert.equal(await page.locator("[data-meeting-back-account]").isVisible(), true);
    await page.click("[data-meeting-back-account]");
    await page.waitForSelector('[data-step="1"].is-active');
    await page.evaluate(() => window.motovaxOnboarding.goTo(2));
    await page.click('[data-onboarding-choice="team"]');
    await page.waitForSelector('[data-meeting-form]:not([hidden])');
    const meetingDate = await page.evaluate(() => {
      const value = new Date();
      value.setDate(value.getDate() + 3);
      while ([0, 6].includes(value.getDay())) value.setDate(value.getDate() + 1);
      return value.toISOString().slice(0, 10);
    });
    await page.fill('[data-meeting-form] input[name="date"]', meetingDate);
    await page.selectOption('[data-meeting-form] select[name="time"]', "10:30");
    await page.screenshot({ path: `/tmp/motovax-team-schedule-${viewport.name}.png`, fullPage: false });
    await page.click('[data-meeting-form] button[type="submit"]');
    await page.waitForSelector('[data-step="5"].is-active [data-meeting-summary]:not([hidden])');
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      workspaceHidden: document.querySelector("[data-workspace-summary]")?.hidden,
      workspaceHeight: document.querySelector("[data-workspace-summary]")?.getBoundingClientRect().height,
      meetingVisible: Boolean(document.querySelector("[data-meeting-summary]")?.getBoundingClientRect().height),
      title: document.querySelector("[data-ready-title]")?.textContent,
    }));
    assert.deepEqual(result, {
      overflow: false,
      workspaceHidden: true,
      workspaceHeight: 0,
      meetingVisible: true,
      title: "Jadwal onboarding telah diajukan",
    });
    await page.screenshot({ path: `/tmp/motovax-team-confirmation-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}
