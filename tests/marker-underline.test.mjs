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
  test(`image tantangan dealer menggantikan teks pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html?v=tantangan-img-20260815`, { waitUntil: "load" });

    const section = page.locator("#keunggulan");
    const image = page.locator("[data-problem-visual]");
    await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const img = document.querySelector("[data-problem-visual]");
      return Boolean(img && img.complete && img.naturalWidth > 0 && img.currentSrc.includes("tantangan-dealer-hari-ini"));
    });
    await image.evaluate((img) => img.decode?.() || Promise.resolve());

    const metrics = await page.evaluate(() => {
      const section = document.querySelector("#keunggulan");
      const label = section?.querySelector(".section-label");
      const heading = section?.querySelector("h2");
      const img = section?.querySelector("[data-problem-visual]");
      const opener = section?.querySelector("[data-hero-image-open]");
      const oldCopy = section?.textContent || "";
      const imgRect = img?.getBoundingClientRect();
      const wrapRect = section?.querySelector(".problem-visual")?.getBoundingClientRect();
      return {
        label: label?.textContent.trim() || "",
        heading: heading?.textContent.replace(/\s+/g, " ").trim() || "",
        headingHidden: heading ? getComputedStyle(heading).position === "absolute" : false,
        hasOldHeadline: /Iklan makin banyak|Konversi justru menurun|Database leads dealer/i.test(oldCopy),
        hasMarker: Boolean(section?.querySelector("[data-marker-underline]")),
        naturalWidth: img?.naturalWidth || 0,
        naturalHeight: img?.naturalHeight || 0,
        currentSrc: img?.currentSrc || "",
        renderWidth: imgRect?.width || 0,
        renderHeight: imgRect?.height || 0,
        wrapWidth: wrapRect?.width || 0,
        wrapHeight: wrapRect?.height || 0,
        objectFit: img ? getComputedStyle(img).objectFit : "",
        aspectRatio: img ? getComputedStyle(img).aspectRatio : "",
        openerLabel: opener?.textContent.replace(/\s+/g, " ").trim() || "",
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    assert.equal(metrics.label, "TANTANGAN DEALER HARI INI");
    assert.match(metrics.heading, /follow-up|lead|insight/i);
    assert.equal(metrics.headingHidden, true);
    assert.equal(metrics.hasOldHeadline, false, "teks lama di bawah label harus sudah dihapus");
    assert.equal(metrics.hasMarker, false);
    assert.ok(metrics.naturalWidth > 300, JSON.stringify(metrics));
    assert.ok(metrics.naturalHeight > 200, JSON.stringify(metrics));
    assert.match(metrics.currentSrc, /tantangan-dealer-hari-ini/);
    assert.ok(metrics.renderWidth > 280, JSON.stringify(metrics));
    assert.ok(Math.abs(metrics.renderWidth - metrics.wrapWidth) < 1, JSON.stringify(metrics));
    assert.equal(metrics.objectFit, "contain");
    assert.equal(metrics.openerLabel, "Buka ukuran penuh ↗");
    assert.equal(metrics.overflow, false, JSON.stringify(metrics));

    await section.screenshot({
      path: `/tmp/motovax-tantangan-dealer-${viewport.name}.png`,
    });

    await page.locator("#keunggulan [data-hero-image-open]").click();
    const modal = page.locator("[data-hero-image-modal]");
    await modal.waitFor({ state: "visible" });
    await page.waitForFunction(() => {
      const img = document.querySelector("[data-hero-image-modal-img]");
      const src = img?.currentSrc || img?.getAttribute("src") || "";
      return src.includes("tantangan-dealer-hari-ini");
    });
    const modalState = await page.evaluate(() => {
      const img = document.querySelector("[data-hero-image-modal-img]");
      return {
        hidden: document.querySelector("[data-hero-image-modal]")?.hidden ?? true,
        bodyLocked: document.body.classList.contains("feature-image-open"),
        src: img?.currentSrc || img?.getAttribute("src") || "",
        title: document.querySelector("[data-hero-image-modal-title]")?.textContent.trim() || "",
      };
    });
    assert.equal(modalState.hidden, false);
    assert.equal(modalState.bodyLocked, true);
    assert.match(modalState.src, /tantangan-dealer-hari-ini/);
    assert.equal(modalState.title, "Tantangan dealer hari ini");

    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.querySelector("[data-hero-image-modal]")?.hidden === true);
    const unlocked = await page.evaluate(() => document.body.classList.contains("feature-image-open"));
    assert.equal(unlocked, false);

    await context.close();
  });
}
