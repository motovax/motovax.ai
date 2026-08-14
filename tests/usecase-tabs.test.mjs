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
  { id: "sales", heading: "ALUR PENJUALAN UNIT", body: "Falcon mencari stok terkini" },
  { id: "service", heading: "ALUR LAYANAN PELANGGAN", body: "Jasmine AI merespons pertanyaan rutin" },
  { id: "crm", heading: "ALUR FOLLOW-UP CRM", body: "Program follow-up berjalan sesuai tahap" },
];

for (const viewport of viewports) {
  test(`tab contoh alur nyata berubah pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    await page.locator(".usecase-section").scrollIntoViewIfNeeded();

    for (const item of cases) {
      await page.click(`[data-usecase="${item.id}"]`);
      const state = await page.evaluate((id) => {
        const tab = document.querySelector(`[data-usecase="${id}"]`);
        const panel = document.querySelector(`[data-usecase-panel="${id}"]`);
        const visiblePanels = [...document.querySelectorAll("[data-usecase-panel]")]
          .filter((el) => !el.hidden && el.getBoundingClientRect().height > 0)
          .map((el) => el.getAttribute("data-usecase-panel"));
        const tabRect = tab.getBoundingClientRect();
        return {
          selected: tab?.getAttribute("aria-selected"),
          active: tab?.classList.contains("active"),
          hidden: Boolean(panel?.hidden),
          heading: panel?.querySelector(".journey-head span")?.textContent,
          body: panel?.textContent,
          visiblePanels,
          tabHeight: tabRect.height,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      }, item.id);

      assert.equal(state.selected, "true");
      assert.equal(state.active, true);
      assert.equal(state.hidden, false);
      assert.equal(state.heading, item.heading);
      assert.match(state.body, new RegExp(item.body));
      assert.deepEqual(state.visiblePanels, [item.id]);
      assert.ok(state.tabHeight >= 44, `target sentuh tab ${item.id} terlalu kecil`);
      assert.equal(state.overflow, false);
    }

    await page.screenshot({ path: `/tmp/motovax-usecase-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}
