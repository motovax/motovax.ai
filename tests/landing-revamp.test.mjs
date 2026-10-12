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

for (const vp of viewports) {
  test(`landing revamp sesuai ilustrasi pada ${vp.name}`, async () => {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });

    // 1. No horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.equal(overflow, false, `Overflow detected on ${vp.name}`);

    // 2. Hero Headline & Subhead
    const h1 = await page.locator("h1").innerText();
    assert.match(h1, /AI dashboard omnichannel untuk bisnis Indonesia yang tumbuh lewat chat/i);

    // 3. Hero Illustrated Dashboard Image
    const heroImg = page.locator('section#top img[src*="hero-omnichannel-dashboard"]');
    assert.equal(await heroImg.count(), 1);
    assert.equal(await heroImg.evaluate((img) => img.naturalWidth > 0), true);

    // 4. Fondasi Cards
    const fondasiCards = page.locator("#produk h3");
    assert.deepEqual(await fondasiCards.allInnerTexts(), [
      "Omnichannel team inbox",
      "AI Agents",
      "Otomasi & integrasi",
    ]);

    // 5. Tim AI Agent Cards
    const agentCards = page.locator("#agent-grid .agent-card");
    assert.equal(await agentCards.count(), 5);

    // Test agent selection
    const falcon = page.locator('#agent-grid .agent-card[data-agent-idx="1"]');
    await falcon.click();
    await page.waitForTimeout(200);
    assert.equal(await falcon.evaluate((el) => el.classList.contains("is-active")), true);
    assert.equal(await falcon.locator(".agent-chat-box").isVisible(), true);

    // 6. Satu Data Tabs
    const tabBtns = page.locator("#product-tabs .tab-btn");
    assert.equal(await tabBtns.count(), 4);

    const crmTab = page.locator('#product-tabs .tab-btn[data-tab-idx="1"]');
    await crmTab.click();
    await page.waitForTimeout(200);
    assert.equal(await crmTab.evaluate((el) => el.classList.contains("is-active")), true);
    assert.match(await page.locator("#tab-title").innerText(), /Jangan biarkan lead terlewat/i);

    // 7. Studi Kasus Mobix
    const studiHeading = await page.locator("#studi h2").innerText();
    assert.match(studiHeading, /Mobix: mengelola ribuan chat WhatsApp tanpa lead tercecer/i);

    // 8. Client Logos
    const clientLogos = page.locator('#studi img[src*="client-"]');
    assert.equal(await clientLogos.count(), 4); // 1 in Mobix card, 3 in DIPERCAYA OLEH
    const allDecoded = await clientLogos.evaluateAll((imgs) => imgs.every((img) => img.naturalWidth > 0));
    assert.equal(allDecoded, true);

    // 9. All Images on page decoded
    const allImgsDecoded = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.every((img) => img.naturalWidth > 0);
    });
    assert.equal(allImgsDecoded, true);

    await context.close();
  });
}
