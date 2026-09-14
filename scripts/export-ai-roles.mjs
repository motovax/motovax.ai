import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../assets/ai-roles/', import.meta.url));
const evidence = process.env.AI_ROLES_EVIDENCE || '/tmp/motovax-ai-roles';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.goto(process.env.AI_ROLES_URL || new URL('../ai-roles.html', import.meta.url).href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.decode()));
  });
  const checks = [];
  for (const [width, height] of [[1440,1000],[834,1112],[390,844]]) {
    await page.setViewportSize({width,height});
    const result = await page.evaluate(() => ({
      viewport: [innerWidth, innerHeight],
      noHorizontalOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      slides: [...document.querySelectorAll('.slide')].map(s => ({
        title: s.querySelector('h1,h2').innerText,
        contentFits: s.querySelector('main').getBoundingClientRect().bottom <= s.querySelector('footer').getBoundingClientRect().top,
        noOverflow: s.scrollWidth <= s.clientWidth && s.scrollHeight <= s.clientHeight,
      })),
      images: [...document.images].map(i => ({src:i.currentSrc,natural:[i.naturalWidth,i.naturalHeight],render:[i.getBoundingClientRect().width,i.getBoundingClientRect().height],objectFit:getComputedStyle(i).objectFit})),
    }));
    if (!result.noHorizontalOverflow || result.slides.length !== 4 || result.slides.some(s => !s.contentFits || !s.noOverflow)) throw Error(JSON.stringify(result));
    checks.push(result);
    for (let i=0;i<4;i++) {
      const slide=page.locator('.slide').nth(i);
      await slide.scrollIntoViewIfNeeded();
      await slide.screenshot({path:`${evidence}/${width}-${i+1}.png`});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({media:'print'});
  const print=await page.evaluate(() => [...document.querySelectorAll('.slide')].map(s => ({
    width:s.getBoundingClientRect().width,height:s.getBoundingClientRect().height,
    fits:s.scrollHeight<=s.clientHeight && s.querySelector('main').getBoundingClientRect().bottom<=s.querySelector('footer').getBoundingClientRect().top,
  })));
  if(print.some(s=>s.width!==1280 || s.height!==800 || !s.fits)) throw Error(JSON.stringify(print));
  if(!process.env.AI_ROLES_URL) await page.pdf({path:`${output}motovax-ai-tiga-peran.pdf`,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  await writeFile(`${evidence}/verification.json`,JSON.stringify({checks,print},null,2));
  console.log(JSON.stringify({pdf:`${output}motovax-ai-tiga-peran.pdf`,pages:print.length,viewports:checks.map(c=>c.viewport),passed:true}));
} finally { await browser.close(); }
