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
  test(`hero #top memakai mockup chat WhatsApp 3 AI pada ${viewport.name}`, async () => {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html?v=hero-chat-gap-20260910`, { waitUntil: "load" });

    const stage = page.locator("[data-hero-chat]");
    await stage.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("#waThread")?.children.length > 0);

    const metrics = await page.evaluate(() => {
      const stageEl = document.querySelector("[data-hero-chat]");
      const thread = document.querySelector("#waThread");
      const name = document.querySelector("#waName")?.textContent || "";
      const copy = document.querySelector(".home-hero-copy")?.innerText || "";
      const team = document.querySelector(".hero-ai-team")?.innerText || "";
      const modes = [...document.querySelectorAll(".wa-rail [data-mode]")].map((btn) => btn.getAttribute("data-mode"));
      const composer = document.querySelector(".wa-input");
      const demo = document.querySelector(".home-hero-actions .btn-primary");
      return {
        hasStage: Boolean(stageEl),
        threadCount: thread?.children.length || 0,
        name,
        copy,
        team,
        modes,
        demoHref: demo instanceof HTMLAnchorElement ? demo.getAttribute("href") : "",
        composerWa: composer instanceof HTMLAnchorElement ? composer.href : "",
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    assert.equal(metrics.hasStage, true, JSON.stringify(metrics));
    assert.ok(metrics.threadCount >= 3, JSON.stringify(metrics));
    assert.equal(metrics.name, "Mobix Bintaro", JSON.stringify(metrics));
    assert.match(metrics.copy, /Ubah lebih banyak/i);
    assert.match(metrics.copy, /chat jadi penjualan/i);
    assert.match(metrics.copy, /Lead tidak tercecer/i);
    assert.match(metrics.copy, /bisnis otomotif/i);
    assert.match(metrics.team, /Falcon/);
    assert.match(metrics.team, /Fino/);
    assert.match(metrics.team, /Jasmine/);
    assert.equal(metrics.demoHref, "./hubungi-kami.html");
    assert.deepEqual(metrics.modes, ["lead", "cs", "internal"], JSON.stringify(metrics));
    assert.match(metrics.composerWa, /wa\.me\/6281999197186/);
    assert.equal(metrics.overflow, false, JSON.stringify(metrics));

    await page.locator('.wa-rail [data-mode="cs"]').click();
    await page.waitForFunction(() => document.querySelector("#waName")?.textContent === "Mobix Care");
    assert.match(await page.locator("#waThread").innerText(), /Stargazer|balik nama|pajak/i);

    await page.locator('.hero-ai-card[data-mode="internal"]').click();
    await page.waitForFunction(() => document.querySelector("#waName")?.textContent === "Falcon · Internal");
    assert.match(await page.locator("#waThread").innerText(), /Rekap Stok|Falcon/i);

    await page.screenshot({
      path: `/tmp/motovax-hero-wa-${viewport.name}.png`,
      fullPage: false,
    });

    await context.close();
  });
}
