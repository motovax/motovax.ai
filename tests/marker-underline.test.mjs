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
  test(`spidol merah "Konversi justru menurun?" pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html?v=marker-underline-20260815`, { waitUntil: "load" });

    const heading = page.locator("#keunggulan h2");
    await heading.scrollIntoViewIfNeeded();

    const mark = page.locator("[data-marker-underline]");
    await mark.waitFor({ state: "visible" });
    await page.waitForFunction(() => {
      const el = document.querySelector("[data-marker-underline]");
      return Boolean(el && el.classList.contains("is-drawn"));
    });
    await page.waitForTimeout(1100);

    const metrics = await page.evaluate(() => {
      const heading = document.querySelector("#keunggulan h2");
      const mark = document.querySelector("[data-marker-underline]");
      const text = mark?.querySelector(".marker-underline-text");
      const svg = mark?.querySelector(".marker-underline-svg");
      const strokes = [...(mark?.querySelectorAll(".marker-stroke") || [])];
      const markRect = mark?.getBoundingClientRect();
      const textRect = text?.getBoundingClientRect();
      const svgRect = svg?.getBoundingClientRect();
      return {
        headingText: heading?.textContent.replace(/\s+/g, " ").trim() || "",
        phrase: text?.textContent.trim() || "",
        hasMengapa: (heading?.textContent || "").includes("Mengapa"),
        isDrawn: mark?.classList.contains("is-drawn") || false,
        isAnimatable: mark?.classList.contains("is-animatable") || false,
        strokeCount: strokes.length,
        strokeColors: strokes.map((path) => getComputedStyle(path).stroke),
        svgWidth: svgRect?.width || 0,
        svgHeight: svgRect?.height || 0,
        markWidth: markRect?.width || 0,
        markHeight: markRect?.height || 0,
        textWidth: textRect?.width || 0,
        textHeight: textRect?.height || 0,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    assert.equal(metrics.headingText, "Iklan makin banyak. Pameran makin sering. Konversi justru menurun?");
    assert.equal(metrics.phrase, "Konversi justru menurun?");
    assert.equal(metrics.hasMengapa, false);
    assert.equal(metrics.isDrawn, true);
    assert.equal(metrics.isAnimatable, true);
    assert.equal(metrics.strokeCount, 2);
    assert.ok(metrics.strokeColors.some((color) => /rgb\(239,\s*35,\s*60\)|rgb\(193,\s*18,\s*31\)/.test(color)), JSON.stringify(metrics.strokeColors));
    assert.ok(metrics.svgWidth > 80, JSON.stringify(metrics));
    assert.ok(metrics.svgHeight > 6, JSON.stringify(metrics));
    assert.ok(metrics.markWidth >= metrics.textWidth - 1, JSON.stringify(metrics));
    assert.ok(metrics.textHeight < 90, `frasa harus satu baris: ${JSON.stringify(metrics)}`);
    assert.ok(metrics.svgWidth >= metrics.textWidth * 0.92, JSON.stringify(metrics));
    assert.equal(metrics.overflow, false, JSON.stringify(metrics));

    const section = page.locator("#keunggulan");
    await section.screenshot({
      path: `/tmp/motovax-marker-underline-${viewport.name}.png`,
    });

    await mark.click();
    await page.waitForFunction(() => {
      const el = document.querySelector("[data-marker-underline]");
      return Boolean(el && el.classList.contains("is-animatable") && el.classList.contains("is-drawn"));
    });

    await context.close();
  });
}
