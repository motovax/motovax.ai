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
  test(`hero omnichannel menampilkan AI, handoff, dan lifecycle pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, route => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    const product=page.locator('.mv-product');
    await product.scrollIntoViewIfNeeded();
    assert.match(await product.innerText(), /Jasmine AI/);
    assert.match(await product.innerText(), /Agent mengambil alih/);
    assert.match(await product.innerText(), /Konteks dan kebutuhan diteruskan/);
    const lifecycle=page.getByRole('combobox', {name:'Lifecycle lead demo'});
    assert.deepEqual(await lifecycle.locator('option').allTextContents(), ['Lead Baru','Hot Lead','Prospect','Deal','Cold']);
    await lifecycle.selectOption('Deal');
    assert.equal(await lifecycle.inputValue(), 'Deal');
    assert.match(await page.locator('.mv-hero-copy').innerText(), /dealer mobil/i);
    assert.equal(await page.locator('.mv-hero .btn-primary').getAttribute('href'),'https://onboard.motovax.com/onboarding.html?fresh=1');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await context.close();
  });
}
