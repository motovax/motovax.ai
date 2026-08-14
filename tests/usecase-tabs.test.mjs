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

const cases = [
  {
    id: "falcon",
    heading: "Falcon IMS",
    body: "Implementasi Falcon",
    image: "falcon-ims-dss-motor",
    useCase: "DSS Motor",
  },
  {
    id: "social",
    heading: "Automated Social Media from Inventory",
    body: "AI Background generator",
    image: "social-media-mobix-dssm",
    useCase: "Mobix by DSSM",
  },
  {
    id: "omni",
    heading: "Omnichannel call center AI",
    body: "AI Jasmine sales agent",
    image: "omnichannel-dsf",
    useCase: "DSF",
  },
];

async function slideState(page, id) {
  return page.evaluate((slideId) => {
    const tab = document.querySelector(`[data-usecase="${slideId}"]`);
    const panel = document.querySelector(`[data-usecase-panel="${slideId}"]`);
    const img = panel?.querySelector("[data-usecase-visual]");
    const copy = panel?.querySelector(".usecase-copy");
    const photo = panel?.querySelector(".usecase-photo");
    const visiblePanels = [...document.querySelectorAll("[data-usecase-panel]")]
      .filter((el) => !el.hidden && el.getBoundingClientRect().height > 0)
      .map((el) => el.getAttribute("data-usecase-panel"));
    const tabRect = tab.getBoundingClientRect();
    const copyRect = copy?.getBoundingClientRect();
    const photoRect = photo?.getBoundingClientRect();
    return {
      selected: tab?.getAttribute("aria-selected"),
      active: tab?.classList.contains("active"),
      hidden: Boolean(panel?.hidden),
      heading: panel?.querySelector("h3")?.textContent,
      kicker: panel?.querySelector(".usecase-kicker")?.textContent,
      body: panel?.textContent,
      currentSrc: img instanceof HTMLImageElement ? img.currentSrc : "",
      naturalWidth: img instanceof HTMLImageElement ? img.naturalWidth : 0,
      copyLeft: copyRect?.left ?? 0,
      photoLeft: photoRect?.left ?? 0,
      copyTop: copyRect?.top ?? 0,
      photoTop: photoRect?.top ?? 0,
      visiblePanels,
      tabHeight: tabRect.height,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  }, id);
}

for (const viewport of viewports) {
  test(`slider contoh alur nyata berubah pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    await page.locator(".usecase-section").scrollIntoViewIfNeeded();

    const title = await page.locator(".usecase-heading h2").textContent();
    assert.equal(title?.trim(), "CONTOH ALUR NYATA");

    for (const item of cases) {
      await page.click(`[data-usecase="${item.id}"]`);
      const img = page.locator(`[data-usecase-panel="${item.id}"] [data-usecase-visual]`);
      await img.evaluate((el) => el instanceof HTMLImageElement ? el.decode() : null).catch(() => {});
      const state = await slideState(page, item.id);

      assert.equal(state.selected, "true");
      assert.equal(state.active, true);
      assert.equal(state.hidden, false);
      assert.equal(state.heading, item.heading);
      assert.match(state.kicker || "", new RegExp(item.useCase));
      assert.match(state.body, new RegExp(item.body));
      assert.match(state.currentSrc, new RegExp(item.image));
      assert.ok(state.naturalWidth > 0, `gambar ${item.id} belum ter-decode`);
      assert.deepEqual(state.visiblePanels, [item.id]);
      assert.ok(state.tabHeight >= 44, `target sentuh tab ${item.id} terlalu kecil`);
      assert.equal(state.overflow, false);

      if (viewport.name === "mobile") {
        assert.ok(state.photoTop >= state.copyTop, "di mobile foto harus di bawah teks");
      } else {
        assert.ok(state.copyLeft < state.photoLeft, "teks harus di kiri, foto di kanan");
      }
    }

    await page.click("[data-usecase-next]");
    const afterNext = await page.evaluate(() =>
      document.querySelector("[data-usecase-panel]:not([hidden])")?.getAttribute("data-usecase-panel"),
    );
    assert.equal(afterNext, "falcon");

    await page.click("[data-usecase-prev]");
    const afterPrev = await page.evaluate(() =>
      document.querySelector("[data-usecase-panel]:not([hidden])")?.getAttribute("data-usecase-panel"),
    );
    assert.equal(afterPrev, "omni");

    if (viewport.name === "mobile") {
      await page.click(`[data-usecase-panel="omni"] [data-hero-image-open]`);
      const modal = page.locator("[data-hero-image-modal]");
      await modal.waitFor({ state: "visible" });
      assert.equal(await page.locator("body").evaluate((body) => body.classList.contains("feature-image-open")), true);
      await page.keyboard.press("Escape");
      assert.equal(await modal.isHidden(), true);
      assert.equal(await page.locator("body").evaluate((body) => body.classList.contains("feature-image-open")), false);
    }

    await page.screenshot({ path: `/tmp/motovax-usecase-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}
