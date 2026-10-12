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

  const chromiumRoot = path.join(homedir(), ".local/chromium-root");
  const alpineChromiumPath = path.join(chromiumRoot, "usr/lib/chromium/chromium");
  const chromiumPath = [
    alpineChromiumPath,
    "/usr/lib/chromium/chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].find((candidate) => existsSync(candidate));
  const useAlpineChromium = chromiumPath === alpineChromiumPath;
  const libraryPath = [
    ...libraryDirectories(path.join(chromiumRoot, "lib")),
    ...libraryDirectories(path.join(chromiumRoot, "usr/lib")),
  ].join(":");
  browser = await chromium.launch({
    headless: true,
    executablePath: chromiumPath,
    args: chromiumPath ? ["--disable-gpu", "--disable-gpu-compositing", "--no-sandbox"] : [],
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
  test(`hero #top menampilkan AI Omnichannel Workspace dan Bento Grid pada ${viewport.name}`, async () => {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index-callcenter.html?v=omni-20261011`, { waitUntil: "load" });

    const hero = page.locator("main#top .home-hero");
    await hero.scrollIntoViewIfNeeded();

    const metrics = await page.evaluate(() => {
      const heroEl = document.querySelector("main#top .home-hero");
      const title = document.querySelector(".hero-sell-headline")?.innerText || "";
      const kicker = document.querySelector(".alt-hero-kicker")?.innerText || "";
      const assurance = [...document.querySelectorAll(".home-assurance span")].map((b) => b.textContent.trim());
      const previewImg = document.querySelector(".hero-workspace-omnichannel img");
      const ctaRegister = document.querySelector(".home-hero-actions .btn-primary");
      const ctaDemo = document.querySelector(".home-hero-actions .btn-secondary");
      const bentoSection = document.querySelector(".omni-bento-section");
      const bentoCards = [...document.querySelectorAll(".omni-bento-grid article")].map((c) => c.querySelector("h3")?.innerText || "");
      return {
        hasHero: Boolean(heroEl),
        title,
        kicker,
        assurance,
        previewSrc: previewImg?.getAttribute("src") || "",
        previewNaturalWidth: previewImg?.naturalWidth || 0,
        ctaRegisterHref: ctaRegister instanceof HTMLAnchorElement ? ctaRegister.getAttribute("href") : "",
        ctaDemoHref: ctaDemo instanceof HTMLAnchorElement ? ctaDemo.getAttribute("href") : "",
        hasBento: Boolean(bentoSection),
        bentoCardCount: bentoCards.length,
        bentoCards,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    assert.equal(metrics.hasHero, true, JSON.stringify(metrics));
    assert.match(metrics.title, /Semua Channel.*Satu Dashboard/i);
    assert.match(metrics.kicker, /AI OMNICHANNEL/i);
    assert.ok(metrics.assurance.some((a) => a.includes("Multi-channel")));
    assert.ok(metrics.assurance.some((a) => a.includes("Human Takeover")));
    assert.match(metrics.previewSrc, /omnichannel-workspace-mobix-real/);
    assert.ok(metrics.previewNaturalWidth > 0, "preview gambar belum terdecode");
    assert.equal(metrics.ctaRegisterHref, "https://onboard.motovax.com/onboarding.html?fresh=1");
    assert.equal(metrics.ctaDemoHref, "./hubungi-kami.html");
    assert.equal(metrics.hasBento, true);
    assert.equal(metrics.bentoCardCount, 5);
    assert.equal(metrics.overflow, false, `Overflow detected on ${viewport.name}: scrollWidth > clientWidth`);

    if (viewport.name === "mobile") {
      const openBtn = page.locator(".omni-preview-frame [data-hero-image-open]");
      await openBtn.click();
      const modal = page.locator("[data-hero-image-modal]");
      assert.equal(await modal.isHidden(), false);
      assert.equal(await page.locator("body").evaluate((b) => getComputedStyle(b).overflow), "hidden");
      await page.keyboard.press("Escape");
      assert.equal(await modal.isHidden(), true);
    }

    await page.screenshot({
      path: `/tmp/motovax-hero-omni-${viewport.name}.png`,
      fullPage: false,
    });

    await context.close();
  });
}
