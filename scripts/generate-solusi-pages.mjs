#!/usr/bin/env node
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(scriptDir, "..");
const outDir = path.join(root, "solusi");
const dataPath = path.join(outDir, "industry-data.js");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(dataPath, "utf8"), sandbox);
const industries = sandbox.window.MOTOVAX_INDUSTRIES;
if (!industries) throw new Error("MOTOVAX_INDUSTRIES tidak ditemukan");

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const summarize = (value, maxLength) => {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength + 1);
  return clipped.slice(0, clipped.lastIndexOf(" ")).trim();
};

const template = (industry) => {
  const metaDescription = summarize(industry.heroDesc, 155);
  const ogDescription = summarize(industry.heroDesc, 180);
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Solusi ${escapeHtml(industry.name)} — MOTOVAX</title>
    <meta name="description" content="${escapeHtml(metaDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Solusi ${escapeHtml(industry.name)} — MOTOVAX" />
    <meta property="og:description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:image" content="../icons/icon-512.png" />
    <meta name="theme-color" content="#09296c" />
    <link rel="icon" href="../favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="../icons/favicon-32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../icons/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../styles.css?v=copy-20260811" />
    <link rel="stylesheet" href="./industry.css?v=copy-20260811" />
  </head>
  <body class="industry-detail-page">
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="../index.html#top" aria-label="MOTOVAX home">
          <span>MOTO</span><strong>VAX</strong>
        </a>
        <nav class="nav" aria-label="Navigasi utama">
          <div class="nav-item nav-item-produk" data-produk-menu>
            <button type="button" class="nav-produk-trigger" aria-expanded="false" aria-haspopup="true" aria-controls="produk-mega-menu" data-produk-trigger>
              Produk
              <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="produk-mega" id="produk-mega-menu" role="region" aria-label="Menu produk Motovax" hidden data-produk-panel data-produk-mount></div>
          </div>
          <a href="../index.html#solusi">Solusi</a>
          <a href="../index.html#cara-kerja">Cara Kerja</a>
          <a href="../index.html#keunggulan">Keunggulan</a>
          <a href="../harga.html">Harga</a>
          <a href="../hubungi-kami.html">Hubungi Kami</a>
        </nav>
        <a class="btn btn-primary header-cta" href="../hubungi-kami.html">Jadwalkan Demo <span>→</span></a>
      </div>
    </header>

    <main data-industry-root></main>

    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="../index.html#top" aria-label="MOTOVAX home">
            <span>MOTO</span><strong>VAX</strong>
          </a>
          <p>Platform AI untuk stok, lead, sales, dan operasional dealer mobil.</p>
        </div>
        <div>
          <h3>Produk</h3>
          <a href="../modul.html">Semua produk</a>
          <a href="../index.html#solusi">Solusi</a>
        </div>
        <div>
          <h3>Hubungi Kami</h3>
          <p>hello@motovax.ai</p>
        </div>
      </div>
      <div class="copyright">&copy; <span data-year></span> MOTOVAX. All rights reserved.</div>
    </footer>

    <script>window.__INDUSTRY_SLUG__ = ${JSON.stringify(industry.slug)};</script>
    <script src="./industry-data.js"></script>
    <script src="./industry-page.js?v=copy-20260811"></script>
    <script src="../script.js?v=dealer-focus-20260814"></script>
  </body>
</html>
`;
};

fs.mkdirSync(outDir, { recursive: true });
for (const industry of Object.values(industries)) {
  const target = path.join(outDir, `${industry.slug}.html`);
  fs.writeFileSync(target, template(industry), "utf8");
  console.log("wrote", path.relative(root, target));
}

console.log(`done, ${Object.keys(industries).length} halaman solusi dealer mobil`);
