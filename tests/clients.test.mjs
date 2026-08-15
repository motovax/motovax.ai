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

const expectedLogos = [
  { file: "dss-motor", alt: "DSS Motor" },
  { file: "mobix", alt: "Mobix" },
  { file: "dsf", alt: "DSF" },
];

for (const viewport of viewports) {
  test(`section Our Clients tampil di ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });

    const section = page.locator("#our-clients");
    await section.scrollIntoViewIfNeeded();

    const state = await page.evaluate(() => {
      const usecase = document.querySelector(".usecase-section");
      const clients = document.querySelector("#our-clients");
      const started = document.querySelector(".getting-started");
      const logos = [...document.querySelectorAll(".clients-logos img")];
      const more = document.querySelector(".clients-more span");
      const heading = document.querySelector("#clients-heading");
      const label = document.querySelector(".clients-heading .section-label");
      return {
        afterUsecase: usecase?.nextElementSibling === clients,
        beforeStart: clients?.nextElementSibling === started,
        label: label?.textContent?.trim() || "",
        heading: heading?.textContent?.trim() || "",
        more: more?.textContent?.trim() || "",
        logos: logos.map((img) => ({
          src: img.currentSrc || img.getAttribute("src") || "",
          alt: img.getAttribute("alt") || "",
          naturalWidth: img.naturalWidth,
          width: img.getBoundingClientRect().width,
          height: img.getBoundingClientRect().height,
        })),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        sectionHeight: clients?.getBoundingClientRect().height || 0,
      };
    });

    assert.equal(state.afterUsecase, true, "Our Clients harus langsung di bawah contoh alur nyata");
    assert.equal(state.beforeStart, true, "Our Clients harus sebelum setup mandiri");
    assert.equal(state.label, "Our Clients");
    assert.match(state.heading, /Dealer yang sudah memakai Motovax/);
    assert.equal(state.more, "and many more");
    assert.equal(state.logos.length, 3);
    assert.equal(state.overflow, false, "tidak boleh overflow horizontal");
    assert.ok(state.sectionHeight > 80, "section klien tidak boleh kosong");

    for (const [index, expected] of expectedLogos.entries()) {
      const logo = state.logos[index];
      assert.match(logo.src, new RegExp(expected.file));
      assert.match(logo.alt, new RegExp(expected.alt, "i"));
      assert.ok(logo.naturalWidth > 0, `logo ${expected.file} belum ter-decode`);
      assert.ok(logo.width > 40 && logo.height > 24, `logo ${expected.file} terlalu kecil`);
    }

    await page.screenshot({ path: `/tmp/motovax-clients-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}
