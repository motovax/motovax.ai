/**
 * Render halaman detail fitur (layout terinspirasi qontak.com/fitur/*)
 * Data: features-data.js (sumber produk motovax-app)
 */
(function () {
  const params = new URLSearchParams(location.search);
  const pathSlug = (location.pathname.split("/").pop() || "").replace(/\.html$/i, "");
  const slug =
    window.__FEATURE_SLUG__ ||
    params.get("slug") ||
    (pathSlug && pathSlug !== "index" && pathSlug !== "feature-page" ? pathSlug : "") ||
    "aplikasi-omnichannel";

  const data = (window.MOTOVAX_FEATURES && window.MOTOVAX_FEATURES[slug]) || null;
  const root = document.querySelector("[data-feature-root]");
  if (!root) return;

  if (!data) {
    root.innerHTML = `
      <section class="feature-page-hero">
        <div class="container">
          <p class="feature-breadcrumb"><a href="../modul.html">Produk</a> / Fitur</p>
          <h1>Fitur tidak ditemukan</h1>
          <p class="feature-hero-desc">Slug <code>${escapeHtml(slug)}</code> belum ada di katalog. Lihat <a href="../modul.html">semua produk</a>.</p>
        </div>
      </section>`;
    return;
  }

  const demoHref = data.demoHash ? `../index.html#${data.demoHash}` : "../index.html#solusi";
  const demoAttr = data.demo
    ? {
        omni: "data-open-omni-demo",
        crm: "data-open-crm-demo",
        social: "data-open-social-demo",
        dashboard: "data-open-dashboard-demo",
        insight: "data-open-insight-demo",
        inventory: "data-open-inventory-demo",
      }[data.demo]
    : "";

  // Demo open only works on index; on feature pages link to index with hash / open via navigation
  const demoCta = data.demo
    ? `<a class="btn btn-secondary" href="../index.html#${data.demoHash || "solusi"}">Coba demo terkait <span>-></span></a>`
    : `<a class="btn btn-secondary" href="../modul.html">Lihat semua modul <span>-></span></a>`;

  const related = (data.related || [])
    .map((id) => window.MOTOVAX_FEATURES[id])
    .filter(Boolean)
    .map(
      (f) => `
      <a class="feature-related-card" href="./${f.slug}.html">
        <strong>${escapeHtml(f.title)}</strong>
        <span>${escapeHtml(f.heroTitle)}</span>
      </a>`
    )
    .join("");

  const caps = (data.capabilities || [])
    .map(
      (c) => `
      <article class="feature-cap-card">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.desc)}</p>
      </article>`
    )
    .join("");

  const steps = (data.howItWorks || [])
    .map(
      (s, i) => `
      <li class="feature-step">
        <span class="feature-step-num">${i + 1}</span>
        <div>
          <strong>${escapeHtml(s.title)}</strong>
          <p>${escapeHtml(s.desc)}</p>
        </div>
      </li>`
    )
    .join("");

  const benefits = (data.benefits || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("");

  const crumbs = (data.breadcrumbs || ["Produk", "Fitur", data.title])
    .map((c, i, arr) => {
      if (i === arr.length - 1) return `<span>${escapeHtml(c)}</span>`;
      if (c === "Produk") return `<a href="../modul.html">${escapeHtml(c)}</a>`;
      return `<span>${escapeHtml(c)}</span>`;
    })
    .join(' <span class="crumb-sep">/</span> ');

  document.title = `${data.title} — MOTOVAX`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", data.heroDesc.slice(0, 160));

  root.innerHTML = `
    <section class="feature-page-hero">
      <div class="container">
        <p class="feature-breadcrumb">${crumbs}</p>
        <div class="feature-hero-badges">
          <span class="feature-badge">${escapeHtml(data.status || "Live")}</span>
          <span class="feature-badge muted">${escapeHtml(data.module || "")}</span>
          ${data.flag ? `<span class="feature-badge muted">Flag: ${escapeHtml(data.flag)}</span>` : ""}
          ${data.badge ? `<span class="feature-badge new">${escapeHtml(data.badge)}</span>` : ""}
        </div>
        <h1>${escapeHtml(data.heroTitle)}</h1>
        <p class="feature-hero-desc">${escapeHtml(data.heroDesc)}</p>
        <div class="feature-hero-actions">
          <a class="btn btn-primary" href="../index.html#kontak">Jadwalkan Demo <span>-></span></a>
          ${demoCta}
        </div>
      </div>
    </section>

    <section class="feature-page-section">
      <div class="container">
        <div class="section-head feature-section-head">
          <span>KEMAMPUAN</span>
          <h2>Apa yang Anda dapatkan</h2>
          <p>Detail kemampuan yang tercermin di aplikasi Motovax.</p>
        </div>
        <div class="feature-cap-grid">${caps}</div>
      </div>
    </section>

    <section class="feature-page-section alt">
      <div class="container feature-two-col">
        <div>
          <div class="section-head feature-section-head">
            <span>CARA KERJA</span>
            <h2>Alur di Motovax</h2>
          </div>
          <ol class="feature-steps">${steps}</ol>
        </div>
        <div class="feature-benefits-panel">
          <h3>Manfaat utama</h3>
          <ul class="feature-benefits">${benefits}</ul>
          <a class="btn btn-primary" href="../index.html#kontak" style="margin-top:18px">Hubungi tim Motovax</a>
        </div>
      </div>
    </section>

    ${
      related
        ? `<section class="feature-page-section">
      <div class="container">
        <div class="section-head feature-section-head">
          <span>TERKAIT</span>
          <h2>Fitur & solusi terkait</h2>
        </div>
        <div class="feature-related-grid">${related}</div>
      </div>
    </section>`
        : ""
    }

    <section class="feature-page-cta">
      <div class="container feature-page-cta-inner">
        <div>
          <h2>Siap coba ${escapeHtml(data.title)} di bisnis Anda?</h2>
          <p>Jadwalkan demo atau jelajahi modul lengkap Motovax.</p>
        </div>
        <div class="feature-hero-actions">
          <a class="btn btn-light" href="#" data-wa>WhatsApp Sales <span>-></span></a>
          <a class="btn btn-secondary" href="../modul.html" style="background:#fff;color:var(--blue)">Semua produk</a>
        </div>
      </div>
    </section>
  `;

  // re-bind data-wa if script already ran
  const whatsappUrl =
    "https://wa.me/6281999197186?text=Halo%20MOTOVAX%2C%20saya%20ingin%20jadwalkan%20demo.";
  for (const link of root.querySelectorAll("[data-wa]")) {
    if (link instanceof HTMLAnchorElement) {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
