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
  test(`hero #top memakai screenshot Call Center pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html?v=hero-cc-20260814`, { waitUntil: "load" });

    const img = page.locator("[data-hero-shot]");
    await img.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = document.querySelector("[data-hero-shot]");
      return Boolean(image && image.complete && image.naturalWidth > 0);
    });
    await img.evaluate((el) => (el instanceof HTMLImageElement ? el.decode() : Promise.resolve()));

    const metrics = await page.evaluate(() => {
      const image = document.querySelector("[data-hero-shot]");
      const shell = document.querySelector(".hero-shot-image");
      const mockChat = document.querySelector(".conversation-card");
      const style = image ? getComputedStyle(image) : null;
      const imageRect = image?.getBoundingClientRect();
      const shellRect = shell?.getBoundingClientRect();
      return {
        hasMockChat: Boolean(mockChat),
        naturalWidth: image?.naturalWidth || 0,
        naturalHeight: image?.naturalHeight || 0,
        currentSrc: image?.currentSrc || "",
        aspectRatio: style?.aspectRatio || "",
        objectFit: style?.objectFit || "",
        imageWidth: imageRect?.width || 0,
        imageHeight: imageRect?.height || 0,
        shellWidth: shellRect?.width || 0,
        shellHeight: shellRect?.height || 0,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    assert.equal(metrics.hasMockChat, false, JSON.stringify(metrics));
    assert.ok(metrics.naturalWidth >= 300, JSON.stringify(metrics));
    assert.ok(metrics.naturalHeight >= 180, JSON.stringify(metrics));
    assert.match(metrics.currentSrc, /omnichannel-faneling-public/);
    assert.match(metrics.currentSrc, /hero-cc-20260814/);
    if (viewport.width >= 1440) {
      assert.ok(metrics.naturalWidth >= 700, JSON.stringify(metrics));
    }
    assert.equal(metrics.objectFit, "contain");
    assert.ok(Math.abs(metrics.imageWidth - metrics.shellWidth) <= 0.1, JSON.stringify(metrics));
    assert.ok(Math.abs(metrics.imageHeight - metrics.shellHeight) <= 0.1, JSON.stringify(metrics));
    assert.ok(Math.abs(metrics.shellWidth / metrics.shellHeight - 1.6) <= 0.03, JSON.stringify(metrics));
    assert.equal(metrics.overflow, false, JSON.stringify(metrics));

    await page.screenshot({
      path: `/tmp/motovax-hero-cc-${viewport.name}.png`,
      fullPage: false,
    });

    if (viewport.name === "mobile") {
      await page.click("[data-hero-image-open]");
      const modal = page.locator("[data-hero-image-modal]");
      await modal.waitFor({ state: "visible" });
      const modalState = await page.evaluate(() => {
        const dialog = document.querySelector("[data-hero-image-modal]");
        const modalImg = document.querySelector("[data-hero-image-modal-img]");
        return {
          bodyLocked: document.body.classList.contains("feature-image-open"),
          overflow: getComputedStyle(document.body).overflow,
          src: modalImg?.currentSrc || modalImg?.src || "",
          alt: modalImg?.alt || "",
        };
      });
      assert.equal(modalState.bodyLocked, true);
      assert.match(modalState.src, /omnichannel-faneling-public\.png/);
      assert.match(modalState.alt, /Call Center/i);

      await page.keyboard.press("Escape");
      await modal.waitFor({ state: "hidden" });
      assert.equal(
        await page.evaluate(() => document.body.classList.contains("feature-image-open")),
        false,
      );
    }

    await context.close();
  });
}
