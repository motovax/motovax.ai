import fs from 'node:fs';
import path from 'node:path';
import { header, footer } from '../shared/chrome.mjs';
const root = path.resolve(import.meta.dirname, '..');
const files = ['index.html','harga.html','hubungi-kami.html','modul.html','kebijakan-privasi.html','syarat-ketentuan.html', ...['fitur','solusi'].flatMap(dir => fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.html')).map(f=>`${dir}/${f}`))];
for (const file of files) {
const base = file.includes('/') ? '../' : './';
let html = fs.readFileSync(path.join(root,file),'utf8');
html = html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/, header(base));
html = html.replace(/<footer class="(?:footer|legal-footer|mv-footer)[^"]*"[^>]*>[\s\S]*?<\/footer>/, footer(base)).replace('<footer></footer>', footer(base));
html = html.replace(/\s*<link[^>]*href="[^"\n]*shared\/design.css[^>]*>/g,'').replace(/\s*<script[^>]*src="[^"\n]*shared\/public.js[^>]*><\/script>/g,'');
if (!html.includes('class="mv-footer"')) html = html.replace('</body>', footer(base) + '\n</body>');
html = html.replace(/\s*<\/head>/, `    <link rel="stylesheet" href="${base}shared/design.css?v=omni-20261009" />\n  </head>`).replace(/\s*<\/body>/, `\n    <script src="${base}shared/public.js?v=omni-20261009" defer></script>\n  </body>`);
fs.writeFileSync(path.join(root,file),html);
}
console.log(`Desain shared diterapkan ke ${files.length} halaman.`);
