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
  { name: "small-mobile", width: 320, height: 700 },
];

const readyState = {
  step: 4,
  completed: true,
  onboardingMode: "self",
  account: { fullName: "Owner Test", email: "owner@example.com" },
  business: { businessName: "Dealer Test", workspaceSlug: "dealer-test", region: "Jakarta" },
  modules: ["ims", "omni", "crm"],
  workspace: { id: "tenant-1", domain: "dealer-test.motovax.com", ready: true },
};

async function openAtStep5(page, modules) {
  await page.evaluate((mods) => {
    const onboarding = window.motovaxOnboarding;
    onboarding.state = Object.assign(onboarding.state, {
      completed: true,
      onboardingMode: "self",
      business: Object.assign(onboarding.state.business, {
        businessName: "Dealer Test",
        workspaceSlug: "dealer-test",
        region: "Jakarta",
      }),
      modules: mods,
      workspace: { id: "tenant-1", domain: "dealer-test.motovax.com", ready: true },
      meeting: null,
    });
    onboarding.goTo(5);
  }, modules);
}

for (const viewport of viewports) {
  test(`walkthrough setup WA Falcon & Jasmine responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript((state) => {
      localStorage.setItem("motovax_onboarding_v1", JSON.stringify(state));
    }, readyState);
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/me", (route) => route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: false }),
    }));
    const sessionResponse = page.waitForResponse((resp) => resp.url().endsWith("/api/auth/me"));
    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await sessionResponse;
    await page.waitForSelector('[data-step="1"].is-active');
    await openAtStep5(page, ["ims", "omni", "crm"]);
    await page.waitForSelector('[data-wa-walkthrough]:not([hidden]) [data-wa-panel]:not([hidden])');
    await page.waitForTimeout(200);

    const falcon = await page.evaluate(() => {
      const rect = (el) => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      };
      const frame = document.querySelector(".onboarding-wa-phone-frame");
      const chat = document.querySelector(".onboarding-wa-chat");
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        tabs: Array.from(document.querySelectorAll("[data-wa-tab]")).map((t) => t.textContent.trim()),
        activeTab: document.querySelector("[data-wa-tab].is-active")?.getAttribute("data-wa-tab"),
        name: document.querySelector("[data-wa-name]")?.textContent.trim(),
        steps: document.querySelectorAll("[data-wa-steps] li").length,
        counter: document.querySelector("[data-wa-counter]")?.textContent.trim(),
        chatMsgs: document.querySelectorAll("[data-wa-chat] .onboarding-wa-msg").length,
        frameRatio: rect(frame).w / rect(frame).h,
        chatCrop: chat.scrollHeight > chat.clientHeight + 1,
        screenFitsFrame: rect(document.querySelector(".onboarding-wa-phone-screen")).h <= rect(frame).h,
      };
    });
    assert.equal(falcon.overflow, false);
    assert.ok(
      falcon.tabs.length === 2
        && falcon.tabs.some((t) => /Falcon/i.test(t))
        && falcon.tabs.some((t) => /Jasmine/i.test(t)),
      JSON.stringify(falcon.tabs),
    );
    assert.equal(falcon.activeTab, "falcon", JSON.stringify(falcon));
    assert.match(falcon.name, /Falcon/i);
    assert.equal(falcon.steps, 6, JSON.stringify(falcon));
    assert.equal(falcon.counter, "Agent 1 dari 2", JSON.stringify(falcon));
    assert.ok(falcon.chatMsgs >= 4, JSON.stringify(falcon));
    assert.ok(Math.abs(falcon.frameRatio - 9 / 19) < 0.05, JSON.stringify(falcon));
    assert.equal(falcon.chatCrop, false, JSON.stringify(falcon));
    assert.equal(falcon.screenFitsFrame, true, JSON.stringify(falcon));

    await page.click('[data-wa-tab="jasmine"]');
    await page.waitForSelector('[data-wa-tab="jasmine"].is-active');
    await page.waitForTimeout(100);
    const jasmine = await page.evaluate(() => {
      const chat = document.querySelector("[data-wa-chat]");
      return {
        name: document.querySelector("[data-wa-name]")?.textContent.trim(),
        steps: document.querySelectorAll("[data-wa-steps] li").length,
        chatMsgs: chat.querySelectorAll(".onboarding-wa-msg").length,
        chatCrop: chat.scrollHeight > chat.clientHeight + 1,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        counter: document.querySelector("[data-wa-counter]")?.textContent.trim(),
      };
    });
    assert.match(jasmine.name, /Jasmine/i, JSON.stringify(jasmine));
    assert.equal(jasmine.steps, 6, JSON.stringify(jasmine));
    assert.ok(jasmine.steps > 0 && jasmine.chatMsgs > 0, JSON.stringify(jasmine));
    assert.equal(jasmine.counter, "Agent 2 dari 2", JSON.stringify(jasmine));
    assert.equal(jasmine.chatCrop, false, JSON.stringify(jasmine));
    assert.equal(jasmine.overflow, false, JSON.stringify(jasmine));
    await context.close();
  });
}

test(`walkthrough setup WA hilang bila modul tidak aktif`, async () => {
  const context = await browser.newContext({ viewport: { width: 834, height: 1112 } });
  await context.addInitScript((state) => {
    localStorage.setItem("motovax_onboarding_v1", JSON.stringify(state));
  }, readyState);
  const page = await context.newPage();
  await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.route("**/api/auth/me", (route) => route.fulfill({
    status: 401,
    contentType: "application/json",
    body: JSON.stringify({ authenticated: false }),
  }));
  const sessionResponse = page.waitForResponse((resp) => resp.url().endsWith("/api/auth/me"));
  await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
  await sessionResponse;
  await page.waitForSelector('[data-step="1"].is-active');
  await openAtStep5(page, ["social", "insight"]);
  await page.waitForTimeout(150);
  const hidden = await page.evaluate(() => document.querySelector("[data-wa-walkthrough]").hidden);
  assert.equal(hidden, true);
  await context.close();
});
