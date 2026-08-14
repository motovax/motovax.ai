#!/usr/bin/env node
/**
 * Generate static fitur/*.html pages from features-data.js catalog.
 * Run: node scripts/generate-fitur-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataPath = path.join(root, "fitur", "features-data.js");
const outDir = path.join(root, "fitur");

const code = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const features = sandbox.window.MOTOVAX_FEATURES;
if (!features) {
  console.error("Failed to load MOTOVAX_FEATURES");
  process.exit(1);
}

const redirects = {
  "aplikasi-call-center": "aplikasi-omnichannel",
  "aplikasi-customer-service": "aplikasi-omnichannel",
  "ticket-creation-integration": "sistem-manajemen-tiket",
  "wa-blast": "aplikasi-broadcast-whatsapp",
  "whatsapp-bulk": "aplikasi-broadcast-whatsapp",
  chatbot: "agentic-ai",
};

const template = (slug, title, description) => `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} — MOTOVAX</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="https://motovax.ai/fitur/${escapeHtml(slug)}.html" />
    <meta name="theme-color" content="#1267f5" />
    <link rel="icon" href="../favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="../icons/favicon-32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../icons/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../styles.css?v=copy-20260811" />
  </head>
  <body class="feature-detail-page">
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
        <a class="btn btn-primary header-cta" href="../hubungi-kami.html">Jadwalkan Demo <span>-></span></a>
      </div>
    </header>

    <main data-feature-root></main>

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

    <script>window.__FEATURE_SLUG__ = ${JSON.stringify(slug)};</script>
    <script src="./features-data.js"></script>
    <script src="./feature-page.js?v=copy-20260811"></script>
    <script src="../script.js?v=mobile-nav-20260814"></script>
  </body>
</html>
`;

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const written = new Set();
for (const [key, feat] of Object.entries(features)) {
  if (!feat?.slug) continue;
  // write once per unique slug file
  if (written.has(feat.slug)) continue;
  written.add(feat.slug);
  const file = path.join(outDir, `${feat.slug}.html`);
  const desc = (feat.heroDesc || "").slice(0, 155);
  fs.writeFileSync(file, template(feat.slug, feat.title, desc), "utf8");
  console.log("wrote", path.relative(root, file));
}

// index listing
const listItems = [...written]
  .map((slug) => {
    const f = Object.values(features).find((x) => x.slug === slug);
    return f
      ? `<li><a href="./${f.slug}.html"><strong>${escapeHtml(f.title)}</strong> — ${escapeHtml(f.heroTitle)}</a></li>`
      : "";
  })
  .join("\n");

fs.writeFileSync(
  path.join(outDir, "index.html"),
  `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Semua Fitur — MOTOVAX</title>
  <meta name="description" content="Jelajahi fitur Motovax untuk inventory unit, sales dealer, customer service, CRM, omnichannel, dan automasi dealer mobil." />
  <link rel="stylesheet" href="../styles.css?v=copy-20260811" />
  <link rel="icon" href="../favicon.ico" />
</head>
<body class="feature-detail-page">
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="../index.html#top" aria-label="MOTOVAX home"><span>MOTO</span><strong>VAX</strong></a>
      <nav class="nav" aria-label="Navigasi utama">
        <div class="nav-item nav-item-produk" data-produk-menu>
          <button type="button" class="nav-produk-trigger" aria-expanded="false" aria-haspopup="true" aria-controls="produk-mega-menu" data-produk-trigger>
            Produk
            <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="produk-mega" id="produk-mega-menu" role="region" aria-label="Menu produk Motovax" hidden data-produk-panel data-produk-mount></div>
        </div>
        <a href="../index.html#solusi">Solusi</a>
        <a href="../index.html#cara-kerja">Cara Kerja</a>
        <a href="../index.html#keunggulan">Keunggulan</a>
        <a href="../harga.html">Harga</a>
        <a href="../hubungi-kami.html">Hubungi Kami</a>
      </nav>
      <a class="btn btn-primary header-cta" href="../hubungi-kami.html">Jadwalkan Demo <span>-></span></a>
    </div>
  </header>
  <main class="feature-page-section">
    <div class="container">
      <h1>Semua fitur Motovax</h1>
      <p class="feature-hero-desc">Pilih fitur untuk melihat detail kemampuan dan manfaatnya.</p>
      <ul class="feature-index-list">${listItems}</ul>
    </div>
  </main>
  <script src="../script.js?v=mobile-nav-20260814"></script>
</body>
</html>
`,
  "utf8"
);

console.log("done,", written.size, "feature pages + index");

for (const [from, to] of Object.entries(redirects)) {
  fs.writeFileSync(
    path.join(outDir, `${from}.html`),
    `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Halaman dipindahkan — MOTOVAX</title>
  <meta name="robots" content="noindex,follow" />
  <meta http-equiv="refresh" content="0; url=./${escapeHtml(to)}.html" />
  <link rel="canonical" href="https://motovax.ai/fitur/${escapeHtml(to)}.html" />
</head>
<body>
  <p>Halaman ini telah dipindahkan ke <a href="./${escapeHtml(to)}.html">halaman fitur terbaru Motovax</a>.</p>
  <script>location.replace(${JSON.stringify(`./${to}.html`)} + location.search + location.hash);</script>
</body>
</html>
`,
    "utf8",
  );
  console.log("redirect", `${from}.html`, "->", `${to}.html`);
}
