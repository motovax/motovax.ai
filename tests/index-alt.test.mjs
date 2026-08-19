import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { after, before, test } from "node:test";
import { homedir } from "node:os";
import path from "path";

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

const expectedPhrases = "One Stock.|More Sales.|Faster Response.|Unlimited Growth.";
const expectedPillars = [
  { label: "Core Platform", href: "./fitur/core-platform-agentic-ai.html" },
  { label: "CRM", href: "./fitur/aplikasi-crm.html" },
  { label: "AI Jasmine + Omni", href: "./fitur/omni-jasmine-ai.html" },
  { label: "AI Falcon + Inventory", href: "./fitur/inventory-falcon-ai.html" },
  { label: "Ana AI Analytics", href: "./fitur/ana-ai-analytics.html" },
  { label: "AI Sora + Social Media", href: "./fitur/social-media-sora-ai.html" },
];

async function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
}

for (const viewport of viewports) {
  test(`index-alt product overview scanable pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index-alt.html`, { waitUntil: "load" });

    assert.equal(await page.locator("[data-typewriter]").getAttribute("data-phrases"), expectedPhrases);
    assert.equal(await page.locator(".alt-pillar").count(), 6);
    assert.equal(await page.locator(".alt-story, .alt-howto, .channel-strip").count(), 0);
    assert.equal(await page.locator(".alt-pillars img").count(), 0);

    const pillars = await page.locator(".alt-pillar").evaluateAll((cards) =>
      cards.map((card) => ({
        label: card.querySelector(".alt-pillar-label")?.textContent.trim(),
        href: card.querySelector("a.btn")?.getAttribute("href"),
        cta: card.querySelector("a.btn")?.textContent.replace(/\s+/g, " ").trim(),
      })),
    );
    assert.deepEqual(
      pillars.map((item) => ({ label: item.label, href: item.href })),
      expectedPillars,
    );
    assert.ok(pillars.every((item) => item.cta.startsWith("Selengkapnya")));

    const grid = page.locator(".alt-pillars-grid");
    await grid.scrollIntoViewIfNeeded();
    const columns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
    if (viewport.name === "desktop") assert.equal(columns, 3);
    if (viewport.name === "tablet") assert.equal(columns, 2);
    if (viewport.name === "mobile") assert.equal(columns, 1);

    assert.equal(await noOverflow(page), true);

    if (viewport.name === "mobile") {
      await page.locator("[data-hero-image-open]").click();
      const modal = page.locator("[data-hero-image-modal]");
      assert.equal(await modal.isHidden(), false);
      assert.equal(await page.locator("body").evaluate((body) => getComputedStyle(body).overflow), "hidden");
      await page.keyboard.press("Escape");
      assert.equal(await modal.isHidden(), true);
    }

    await page.screenshot({ path: `/tmp/motovax-index-alt-${viewport.name}.png`, fullPage: true });
    await context.close();
  });
}
