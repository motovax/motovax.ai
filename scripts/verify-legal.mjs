import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { createApp } from '../server.mjs';

const root = path.join(homedir(), '.local/chromium-root');
const directories = p => existsSync(p) ? [p, ...readdirSync(p, {withFileTypes:true}).filter(d=>d.isDirectory()).flatMap(d=>directories(path.join(p,d.name)))] : [];
const alpine = path.join(root, 'usr/lib/chromium/chromium');
const useAlpine = existsSync(alpine);
const output = path.join(homedir(), 'reports/motovax-legal');
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true, executablePath:useAlpine?alpine:undefined, args:['--no-sandbox','--disable-gpu'], env:useAlpine?{...process.env,LD_LIBRARY_PATH:[...directories(path.join(root,'lib')),...directories(path.join(root,'usr/lib'))].join(':'),FONTCONFIG_PATH:path.join(root,'etc/fonts'),FONTCONFIG_FILE:path.join(root,'etc/fonts/fonts.conf'),FONTCONFIG_SYSROOT:root,XDG_DATA_DIRS:path.join(root,'usr/share')}:process.env});
let server;
let base = process.env.LEGAL_VERIFY_URL;
if (!base) {
  server = createApp({config:{nodeEnv:'test',publicDir:process.cwd(),publicBaseUrl:'http://127.0.0.1',portalLandingUrl:'https://motovax.ai/',oauthSuccessUrl:'http://127.0.0.1/onboarding.html',googleRedirectUri:'http://127.0.0.1/api/auth/google/callback',googleClientId:'',googleClientSecret:'',sessionSecret:'',databaseUrl:'',tenantDomainSuffix:'motovax.com',trustProxy:false}}).listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  base = `http://127.0.0.1:${server.address().port}`;
}
const results=[];
const phase=process.env.LEGAL_VERIFY_PHASE||'local';
try {
  const page=await browser.newPage();
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  for (const file of ['kebijakan-privasi.html','syarat-ketentuan.html']) {
    for (const [width,height] of [[1440,1000],[834,1112],[390,844]]) {
      await page.setViewportSize({width,height});
      const response=await page.goto(`${base}/${file}?verify=legal-20261028`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const result=await page.evaluate(()=>({title:document.title,noOverflow:document.documentElement.scrollWidth<=document.documentElement.clientWidth,sections:document.querySelectorAll('.legal-section').length,anchorsValid:[...document.querySelectorAll('.legal-nav a')].every(a=>document.getElementById(a.hash.slice(1))),css:[...document.styleSheets].map(s=>s.href).filter(Boolean),smallTocTargets:[...document.querySelectorAll('.legal-nav a')].filter(a=>a.getBoundingClientRect().height<44).length,mainWidth:document.querySelector('article').getBoundingClientRect().width}));
      result.file=file; result.width=width; result.height=height; result.status=response.status();
      if(result.status!==200||!result.noOverflow||!result.anchorsValid||result.smallTocTargets)throw Error(JSON.stringify(result));
      if (width < 901) {
        await page.getByRole('button',{name:'Buka menu navigasi',exact:true}).click();
        if (!await page.locator('body').evaluate(el=>el.classList.contains('mobile-menu-open'))) throw Error('Mobile navigation did not open');
        await page.keyboard.press('Escape');
        if (await page.locator('body').evaluate(el=>el.classList.contains('mobile-menu-open'))) throw Error('Mobile navigation did not close');
      }
      await page.screenshot({path:path.join(output,`${phase}-${file}-${width}.png`)});
      await page.locator(file.startsWith('kebijakan')?'#penghapusan':'#pihak-ketiga').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
      await page.screenshot({path:path.join(output,`${phase}-${file}-${width}-detail.png`)});
      results.push(result);
    }
    const links=await page.locator('article a[href^="mailto:"]').count();
    if(!links)throw Error('Missing contact email');
  }
  const home=await page.goto(base,{waitUntil:'domcontentloaded'});
  if(home.status()!==200||!await page.locator('a[href$="/kebijakan-privasi.html"], a[href="./kebijakan-privasi.html"]').count()||!await page.locator('a[href$="/syarat-ketentuan.html"], a[href="./syarat-ketentuan.html"]').count())throw Error('Home legal links missing');
  await writeFile(path.join(output,`${phase}-results.json`),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results));
} finally {await browser.close();if(server)await new Promise(r=>server.close(r));}
