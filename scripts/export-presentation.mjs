import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'assets/presentation');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.goto(process.env.PRESENTATION_URL || new URL('../presentation.html', import.meta.url).href);
  await page.evaluate(() => document.fonts.ready);
  const checks = [];
  for (const [width, height] of [[1440,1000],[834,1112],[390,844]]) {
    await page.setViewportSize({ width, height });
    const result = await page.evaluate(() => ({
      width: innerWidth, height: innerHeight,
      noHorizontalOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      slides: [...document.querySelectorAll('.slide')].map(el => ({
        title: el.querySelector('h1').innerText.replaceAll('\n', ' '),
        noOverflow: el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth,
        contentFits: el.querySelector('main').getBoundingClientRect().bottom <= el.querySelector('footer').getBoundingClientRect().top + 0.1,
      })),
    }));
    checks.push(result);
    if (!result.noHorizontalOverflow || result.slides.length !== 12 || result.slides.some(s => !s.noOverflow || !s.contentFits)) throw Error(JSON.stringify(result));
    await page.locator('.slide').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/motovax-deck-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ media: 'print' });
  const print = await page.evaluate(() => [...document.querySelectorAll('.slide')].map(el => ({
    height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width,
    fits: el.scrollHeight <= el.clientHeight && el.querySelector('main').getBoundingClientRect().bottom <= el.querySelector('footer').getBoundingClientRect().top + 0.1,
  })));
  if (print.some(s => !s.fits || s.height !== 720 || s.width !== 1280)) throw Error(JSON.stringify(print));
  if (!process.env.PRESENTATION_URL) await page.pdf({ path: path.join(out, 'motovax-presentation-2026-09.pdf'), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  await writeFile('/tmp/motovax-deck-verification.json', JSON.stringify({checks, print}, null, 2));
  await page.emulateMedia({ media: 'screen' });
  await page.addStyleTag({ content: '.toolbar{display:none}body{display:grid;grid-template-columns:repeat(3,1280px);gap:28px;width:3896px;zoom:.3}.slide{width:1280px;height:720px;margin:0}' });
  await page.setViewportSize({ width: 1180, height: 920 });
  await page.screenshot({ path: '/tmp/motovax-deck-overview.png' });
  console.log(JSON.stringify({pdf: 'assets/presentation/motovax-presentation-2026-09.pdf', slides: print.length, viewports: checks.map(c=>({width:c.width,noOverflow:c.noHorizontalOverflow})), printFits: print.every(s=>s.fits)}));
} finally { await browser.close(); }
