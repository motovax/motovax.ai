import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
const root=path.resolve(import.meta.dirname,'..');
const server=http.createServer((req,res)=>{const f=path.join(root,decodeURIComponent(req.url.split('?')[0] === '/'?'/index.html':req.url.split('?')[0]));if(!f.startsWith(root+'/')||!fs.existsSync(f)){res.writeHead(404);res.end();return;}const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=process.env.VERIFY_URL||`http://127.0.0.1:${server.address().port}`;
function dirs(root){if(!fs.existsSync(root))return [];return [root,...fs.readdirSync(root,{withFileTypes:true}).filter(x=>x.isDirectory()).flatMap(x=>dirs(path.join(root,x.name)))];}
const cr=path.join(os.homedir(),'.local/chromium-root');
const custom=fs.existsSync(path.join(cr,'usr/lib/chromium/chromium'));
const browser=await chromium.launch({headless:true,...(custom?{executablePath:path.join(cr,'usr/lib/chromium/chromium'),args:['--disable-gpu'],env:{...process.env,LD_LIBRARY_PATH:[...dirs(path.join(cr,'lib')),...dirs(path.join(cr,'usr/lib'))].join(':'),FONTCONFIG_PATH:path.join(cr,'etc/fonts'),FONTCONFIG_FILE:path.join(cr,'etc/fonts/fonts.conf'),FONTCONFIG_SYSROOT:cr,XDG_DATA_DIRS:path.join(cr,'usr/share')}}:{})});
const report=[];const failures=[];
try {
for(const [name,width,height] of [['desktop',1440,1000],['tablet',834,1112],['mobile',390,844]]) {
 const page=await browser.newPage({viewport:{width,height}});const cdp=await page.context().newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 const allFiles=['index.html','harga.html','hubungi-kami.html','modul.html','kebijakan-privasi.html','syarat-ketentuan.html',...fs.readdirSync(path.join(root,'fitur')).filter(f=>f.endsWith('.html')).map(f=>'fitur/'+f),'solusi/otomotif.html'];
 const files=process.env.VERIFY_FILES?process.env.VERIFY_FILES.split(','):allFiles;
 for(const file of files){await page.goto(`${base}/${file}?verify=omni-20261009`,{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.complete).map(i=>i.decode().catch(()=>{})));});
 const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,headers:document.querySelectorAll('.mv-header').length,footers:document.querySelectorAll('.mv-footer').length,font:getComputedStyle(document.body).fontFamily,background:getComputedStyle(document.body).backgroundColor,badImages:[...document.images].filter(i=>i.getAttribute('src')&&i.complete&&!i.naturalWidth).map(i=>i.src),wide:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(e=>e.className)}));
 report.push({viewport:name,file,...layout});if(layout.overflow||layout.headers!==1||layout.footers!==1||layout.badImages.length)failures.push({viewport:name,file,...layout});
 await page.evaluate(async()=>{for(const i of document.images){if(i.getAttribute('src')){i.loading='eager';await i.decode().catch(()=>{});}}});
 if(['index.html','harga.html','hubungi-kami.html','modul.html','kebijakan-privasi.html','fitur/omni-jasmine-ai.html'].includes(file))await page.screenshot({path:path.join(root,`docs/verification/${process.env.VERIFY_URL?'production-':''}${name}-${file.replaceAll('/','-').replace('.html','')}.png`),fullPage:true});
 if(file==='fitur/omni-jasmine-ai.html') {
 let baseline;
 for(const row of await page.locator('.feature-showcase-row').all()) {
  const img=row.locator('.feature-showcase-preview-image img');
  if(!await img.count())continue;
  await row.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());
  const m=await img.evaluate(i=>{const c=i.parentElement;const rect=e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height}};return {feature:i.closest('.feature-showcase-row').querySelector('h3').textContent,reverse:i.closest('.feature-showcase-row').classList.contains('reverse'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,image:rect(i),container:rect(c),aspectRatio:getComputedStyle(c).aspectRatio,objectFit:getComputedStyle(i).objectFit,currentSrc:i.currentSrc};});
  if(!baseline)baseline=m.container;
  if(Math.abs(m.container.width-baseline.width)>.1||Math.abs(m.container.height-baseline.height)>.1)failures.push({file,viewport:name,feature:m.feature,sizeMismatch:true});
  report.push({viewport:name,...m});
  await row.screenshot({path:path.join(root,`docs/verification/${process.env.VERIFY_URL?'production-':''}${name}-omni-${report.filter(r=>r.feature&&r.viewport===name).length}.png`)});
 }
 }
 if(file==='index.html'){
 for(const tab of await page.locator('[data-platform-tab]').all()){await tab.click();const panel=page.locator('[role=tabpanel]:visible');await panel.scrollIntoViewIfNeeded();await panel.locator('img').evaluate(i=>i.decode());const measurement=await panel.evaluate(p=>{const i=p.querySelector('img'),c=p.querySelector('.mv-platform-preview');const rect=e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height}};return {panel:p.id,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,image:rect(i),container:rect(c),aspectRatio:getComputedStyle(c).aspectRatio,objectFit:getComputedStyle(i).objectFit,currentSrc:i.currentSrc}});report.push({viewport:name,...measurement});await panel.screenshot({path:path.join(root,`docs/verification/${process.env.VERIFY_URL?'production-':''}${name}-${measurement.panel}.png`)});}
 if(name==='mobile') {await page.locator('[data-platform-full]:visible').click();const lock=await page.evaluate(()=>document.body.style.overflow==='hidden'&&document.querySelector('dialog').open);if(!lock)failures.push({modal:'scroll lock'});await page.screenshot({path:path.join(root,'docs/verification/mobile-modal.png')});await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open&&document.body.style.overflow==='');if(await page.evaluate(()=>document.body.style.overflow!==''||document.querySelector('dialog').open))failures.push({modal:'Escape'});await page.locator('[data-platform-full]:visible').click();await page.locator('.mv-viewer-toolbar button').click();await page.locator('[data-platform-full]:visible').click();await page.mouse.click(2,2);if(await page.locator('dialog').evaluate(d=>d.open))failures.push({modal:'backdrop'});await page.locator('.mv-menu-toggle').click();if(await page.locator('#mv-navigation').evaluate(n=>getComputedStyle(n).display==='none'))failures.push({menu:'mobile'});await page.keyboard.press('Escape');}
 }
 }
 await page.close();
}
} finally {await browser.close();server.close();}
fs.writeFileSync(path.join(root,`docs/verification/${process.env.VERIFY_URL?'production-':''}measurements.json`),JSON.stringify({base,report,failures},null,2));console.log(JSON.stringify({pages:report.filter(r=>r.file).length,failures:failures.map(f=>({file:f.file,viewport:f.viewport,overflow:f.overflow,modal:f.modal,menu:f.menu,badImages:f.badImages}))},null,2));process.exitCode=failures.length?1:0;
