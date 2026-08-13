import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const baseURL = process.env.DECK_URL || 'http://127.0.0.1:5179/presentasi/vax-family.html';
const shellPath = chromium.executablePath();
const browserPath = shellPath
  .replace('chromium_headless_shell-', 'chromium-')
  .replace('/chrome-headless-shell-linux64/chrome-headless-shell', '/chrome-linux64/chrome');
const alpineBrowser = `${process.env.HOME}/apkroot/usr/lib/chromium/chromium`;
const executablePath = [alpineBrowser, shellPath, browserPath].find(existsSync);
if (executablePath === alpineBrowser) {
  process.env.LD_LIBRARY_PATH = [
    `${process.env.HOME}/apkroot/usr/lib`,
    `${process.env.HOME}/apkroot/usr/lib/pulseaudio`,
    `${process.env.HOME}/apkroot/lib`,
    process.env.LD_LIBRARY_PATH
  ].filter(Boolean).join(':');
  process.env.FONTCONFIG_PATH = `${process.env.HOME}/apkroot/etc/fonts`;
  process.env.FONTCONFIG_FILE = `${process.env.HOME}/apkroot/etc/fonts/fonts.conf`;
  process.env.FONTCONFIG_SYSROOT = `${process.env.HOME}/apkroot`;
}
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(baseURL, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((image) => image.decode()));
});
await mkdir('presentasi/preview', { recursive: true });

const checks = [];
for (const [name, width, height] of [['desktop', 1440, 1000], ['tablet', 834, 1112], ['mobile', 390, 844]]) {
  await page.setViewportSize({ width, height });
  for (const slide of [1, 5, 7, 8, 11, 12]) {
    await page.evaluate((number) => location.hash = String(number), slide);
    await page.waitForTimeout(80);
    if (name === 'desktop') await page.screenshot({ path: `presentasi/preview/slide-${String(slide).padStart(2, '0')}.png` });
  }
  checks.push(await page.evaluate(({ name, width, height }) => {
    const deck = document.querySelector('.deck').getBoundingClientRect();
    const active = document.querySelector('.slide.active').getBoundingClientRect();
    return {
      viewport: name,
      width,
      height,
      deck: { width: deck.width, height: deck.height },
      active: { width: active.width, height: active.height },
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      verticalOverflow: document.documentElement.scrollHeight > document.documentElement.clientHeight
    };
  }, { name, width, height }));
}

await page.setViewportSize({ width: 1440, height: 1000 });
await page.pdf({
  path: 'presentasi/vax-family-pitch-deck.pdf',
  width: '13.333in',
  height: '7.5in',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' }
});
console.log(JSON.stringify(checks, null, 2));
await browser.close();
