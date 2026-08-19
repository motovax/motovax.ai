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
const registerHref = "https://onboard.motovax.com/onboarding.html?fresh=1";

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
    assert.equal(await page.locator(".alt-node[data-pillar]").count(), 6);

    const headingFont = await page.locator("#core-heading").evaluate((el) => getComputedStyle(el).fontFamily);
    assert.equal(/caveat/i.test(headingFont), false, `judul memakai font hirarki Inter, bukan Caveat: ${headingFont}`);
    assert.match(headingFont, /inter|system-ui|sans-serif/i);

    const featureHeadingFont = await page.locator("#jasmine-heading").evaluate((el) => getComputedStyle(el).fontFamily);
    assert.equal(/caveat/i.test(featureHeadingFont), false);

    assert.equal(await page.locator(".alt-orbit-lines path[id^='orbit-']").count(), 5);
    const dots = page.locator(".alt-orbit-dots circle");
    assert.ok(await dots.count() >= 5, "diagram punya titik animasi di jalur");
    if (viewport.name !== "mobile") {
      assert.notEqual(await page.locator(".alt-orbit-lines").evaluate((el) => getComputedStyle(el).display), "none");
      assert.ok(
        await page.locator("animateMotion").count() >= 5,
        "titik diagram bergerak mengikuti jalur",
      );
    } else {
      assert.equal(await page.locator(".alt-orbit-lines").evaluate((el) => getComputedStyle(el).display), "none");
    }
    assert.equal(await page.locator(".alt-story, .alt-howto, .channel-strip, .alt-pillar").count(), 0);
    assert.equal(await page.locator("section.alt-feature").count(), 5);

    const nodes = await page.locator(".alt-node[data-pillar]").evaluateAll((cards) =>
      cards.map((card) => ({
        pillar: card.getAttribute("data-pillar"),
        label: (card.querySelector(".alt-pillar-label") || card.querySelector("small"))?.textContent.trim(),
        href: card.getAttribute("href"),
      })),
    );
    const byPillar = Object.fromEntries(nodes.map((item) => [item.pillar, item]));
    assert.equal(byPillar.core.href, expectedPillars[0].href);
    assert.match(byPillar.core.label, /CORE PLATFORM/i);
    assert.equal(byPillar.crm.label, expectedPillars[1].label);
    assert.equal(byPillar.crm.href, expectedPillars[1].href);
    assert.equal(byPillar.jasmine.label, expectedPillars[2].label);
    assert.equal(byPillar.jasmine.href, expectedPillars[2].href);
    assert.equal(byPillar.falcon.label, expectedPillars[3].label);
    assert.equal(byPillar.falcon.href, expectedPillars[3].href);
    assert.equal(byPillar.ana.label, expectedPillars[4].label);
    assert.equal(byPillar.ana.href, expectedPillars[4].href);
    assert.equal(byPillar.sora.label, expectedPillars[5].label);
    assert.equal(byPillar.sora.href, expectedPillars[5].href);

    const crmImage = page.locator(".alt-crm-visual img");
    await crmImage.scrollIntoViewIfNeeded();
    assert.match(await crmImage.getAttribute("src"), /alt-crm-workspace\.png/);
    assert.equal(await crmImage.evaluate((img) => img.naturalWidth > 0), true);

    const featureImages = page.locator(".alt-feature img");
    const count = await featureImages.count();
    assert.ok(count >= 6);
    for (let index = 0; index < count; index += 1) {
      const image = featureImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      const box = await image.boundingBox();
      assert.ok(box && box.width > 80 && box.height > 80, `feature image ${index} terlalu kecil: ${JSON.stringify(box)}`);
    }

    const cta = page.locator(".home-cta a.btn");
    assert.equal(await cta.getAttribute("href"), registerHref);
    assert.match((await cta.textContent()).replace(/\s+/g, " "), /Daftar|Mulai Coba/i);

    assert.equal(await noOverflow(page), true);

    if (viewport.name === "mobile") {
      await page.locator("[data-hero-image-open]").first().click();
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
