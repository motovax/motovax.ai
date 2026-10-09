import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { after, before, test } from "node:test";
import { homedir } from "node:os";
import path from "path";

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

const expectedPhrases = "One Stock.|More Sales.|Faster Response.|Unlimited Growth.";
const registerHref = "https://onboard.motovax.com/onboarding.html?fresh=1";

async function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
}

for (const viewport of viewports) {
  test(`tab platform dapat dioperasikan dengan keyboard pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, route => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    const tabs=page.getByRole('tab');
    assert.equal(await tabs.count(),4);
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
    assert.equal(await page.locator('[role=tabpanel]:visible').count(),1);
    await page.keyboard.press('End');
    assert.equal(await tabs.nth(3).getAttribute('aria-selected'),'true');
    await page.locator('[role=tabpanel]:visible img').scrollIntoViewIfNeeded();
    await page.locator('[role=tabpanel]:visible img').evaluate(i=>i.decode());
    await page.locator('[data-platform-full]:visible').click();
    assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog').open&&document.body.style.overflow==='');
    assert.equal(await page.locator('[data-platform-full]:visible').evaluate(e=>e===document.activeElement),true);
    assert.equal(await noOverflow(page),true);
    await context.close();
  });
}

test("index-alt.html mengarah ke beranda omnichannel", async () => {
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto(`${baseUrl}/index-alt.html`,{waitUntil:'load'});
 assert.equal(new URL(page.url()).pathname,'/');
 assert.match(await page.title(),/AI Dashboard Omnichannel/);
 assert.equal(await page.getByRole('tab').count(),4);
 await context.close();
});
