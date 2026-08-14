(function renderIndustrySolutionPage() {
  const root = document.querySelector("[data-industry-root]");
  if (!root) return;

  const slug = String(window.__INDUSTRY_SLUG__ || "").trim();
  const industry = window.MOTOVAX_INDUSTRIES?.[slug];
  const moduleCatalog = window.MOTOVAX_INDUSTRY_MODULES || {};

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  if (!industry) {
    root.innerHTML = `
      <section class="industry-missing">
        <div class="container">
          <span>404</span>
          <h1>Solusi dealer tidak ditemukan</h1>
          <p>Halaman yang Anda cari tidak tersedia.</p>
          <a class="btn btn-primary" href="../index.html">Kembali ke beranda</a>
        </div>
      </section>`;
    return;
  }

  const statusMap = {
    live: { label: "Live di produksi", className: "live" },
    partial: { label: "Partial", className: "partial" },
  };

  const modules = industry.moduleRefs.map(([id, status, note]) => ({
    ...moduleCatalog[id],
    status,
    note,
  }));

  const faqs = [
    {
      question: `Apa itu solusi Motovax untuk ${industry.name}?`,
      answer: `Solusi Motovax menyatukan inventory unit, AI omnichannel, CRM, automasi konten, dan dashboard untuk kebutuhan ${industry.audience}. Status setiap modul menunjukkan capability yang tersedia saat ini.`,
    },
    {
      question: "Fitur mana yang benar-benar tersedia saat ini?",
      answer: "IMS, Agentic AI, AI Omnichannel & Call Center, CRM Autopilot, Social Media & Ads Automation, serta dashboard tersedia di produk; beberapa modul aktif berdasarkan feature flag tenant dan finance masih partial.",
    },
    {
      question: `Apakah Motovax menggantikan seluruh sistem inti ${industry.name}?`,
      answer: industry.scopeNote,
    },
    {
      question: "Bagaimana proses implementasinya?",
      answer: "Implementasi dimulai dengan pemetaan cabang, channel lead, customer journey, role tim dealer, format stocklist, dan KPI. Tim lalu menentukan modul aktif, integrasi, serta tahapan migrasi sebelum go-live.",
    },
  ];

  root.innerHTML = `
    <div class="industry-page">
      <section class="industry-hero">
        <div class="industry-orb industry-orb-one" aria-hidden="true"></div>
        <div class="industry-orb industry-orb-two" aria-hidden="true"></div>
        <div class="container">
          <nav class="industry-breadcrumb" aria-label="Breadcrumb">
            <a href="../index.html">Home</a>
            <span aria-hidden="true">/</span>
            <a href="../index.html#solusi">Solusi</a>
            <span aria-hidden="true">/</span>
            <strong aria-current="page">${escapeHtml(industry.name)}</strong>
          </nav>

          <div class="industry-hero-grid">
            <div class="industry-hero-copy">
              <p class="industry-readiness-text ${escapeHtml(industry.status)}">${escapeHtml(industry.statusLabel)}</p>
              <h1>${escapeHtml(industry.heroTitle)}</h1>
              <p>${escapeHtml(industry.heroDesc)}</p>
              <div class="industry-hero-actions">
                <a class="btn btn-secondary" href="#kapabilitas">Lihat Kapabilitas</a>
              </div>
              <div class="industry-honesty-note">
                <span aria-hidden="true">i</span>
                <p><strong>Status transparan.</strong> Modul bertanda live tersedia di produk; aktivasi tetap mengikuti feature flag dan konfigurasi dealer.</p>
              </div>
            </div>

            <div class="industry-hero-visual" aria-label="Ilustrasi ${escapeHtml(industry.visualTitle)}">
              <div class="industry-visual-window">
                <header>
                  <div class="industry-window-dots"><i></i><i></i><i></i></div>
                  <span>ONE CUSTOMER JOURNEY</span>
                  <b>Live flow</b>
                </header>
                <div class="industry-visual-body">
                  <div class="industry-visual-title">
                    <span>${escapeHtml(industry.name)}</span>
                    <h2>${escapeHtml(industry.visualTitle)}</h2>
                    <p>Ilustrasi alur penjualan dealer</p>
                  </div>
                  <div class="industry-journey">
                    ${industry.journey.map((step, index) => `
                      <div class="industry-journey-step">
                        <span>${String(index + 1).padStart(2, "0")}</span>
                        <b>${escapeHtml(step)}</b>
                        ${index < industry.journey.length - 1 ? '<i aria-hidden="true">→</i>' : ""}
                      </div>`).join("")}
                  </div>
                  <div class="industry-visual-modules">
                    ${modules.slice(0, 4).map((module) => `<span><i>${escapeHtml(module.code)}</i>${escapeHtml(module.title)}</span>`).join("")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="industry-foundation" aria-label="Fondasi produk Motovax">
        <div class="container">
          <div>
            <b>AI Omnichannel</b>
            <b>Agentic AI</b>
            <b>Autopilot CRM</b>
            <b>Social & Ads</b>
            <b>Dashboard & Analytics</b>
            <b>Platform & API</b>
          </div>
        </div>
      </section>

      <section class="industry-section industry-challenges">
        <div class="container">
          <div class="industry-section-head">
            <h2>Apa yang menghambat ${escapeHtml(industry.audience)}?</h2>
            <p>Masalah customer journey dealer yang ditangani Motovax dari data stok hingga tindak lanjut sales.</p>
          </div>
          <div class="industry-challenge-grid">
            ${industry.challenges.map((challenge, index) => `
              <article class="industry-challenge-card">
                <span>0${index + 1}</span>
                <div class="industry-challenge-icon" aria-hidden="true">${["↗", "◎", "⌁"][index]}</div>
                <h3>${escapeHtml(challenge.title)}</h3>
                <p>${escapeHtml(challenge.desc)}</p>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="industry-section industry-transform">
        <div class="container">
          <div class="industry-section-head is-light">
            <h2>Dari proses terpisah menjadi satu journey</h2>
            <p>Contoh berikut menunjukkan perubahan alur kerja yang dapat diterapkan dengan kapabilitas Motovax.</p>
          </div>
          <div class="industry-transform-list">
            ${industry.transformations.map((item, index) => `
              <article class="industry-transform-card">
                <header>
                  <span>0${index + 1}</span>
                  <h3>${escapeHtml(item.title)}</h3>
                </header>
                <div class="industry-compare">
                  <div class="industry-before">
                    <small>SEBELUM</small>
                    <p>${escapeHtml(item.before)}</p>
                  </div>
                  <div class="industry-compare-arrow" aria-hidden="true">→</div>
                  <div class="industry-after">
                    <small>DENGAN MOTOVAX</small>
                    <p>${escapeHtml(item.after)}</p>
                  </div>
                </div>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="industry-section industry-capabilities" id="kapabilitas">
        <div class="container">
          <div class="industry-section-head">
            <h2>Modul Motovax untuk ${escapeHtml(industry.name)}</h2>
            <p>Status di bawah merujuk kondisi produk Motovax saat ini.</p>
          </div>
          <div class="industry-status-legend" aria-label="Legenda status modul">
            <span class="live"><i></i>Live di produksi</span>
            <span class="partial"><i></i>Partial</span>
          </div>
          <div class="industry-module-grid">
            ${modules.map((module) => {
              const status = statusMap[module.status] || statusMap.partial;
              return `
                <a class="industry-module-card" href="${escapeHtml(module.href)}">
                  <header>
                    <span>${escapeHtml(module.code)}</span>
                    <em class="${escapeHtml(status.className)}"><i></i>${escapeHtml(status.label)}</em>
                  </header>
                  <h3>${escapeHtml(module.title)}</h3>
                  <p>${escapeHtml(module.desc)}</p>
                  <small>${escapeHtml(module.note)}</small>
                  <b>Pelajari modul <span>→</span></b>
                </a>`;
            }).join("")}
          </div>
          <div class="industry-scope-note">
            <span>BATAS SCOPE SAAT INI</span>
            <p>${escapeHtml(industry.scopeNote)}</p>
          </div>
        </div>
      </section>

      <section class="industry-section industry-faq">
        <div class="container industry-faq-grid">
          <div class="industry-section-head">
            <h2>Pertanyaan tentang solusi ${escapeHtml(industry.name)}</h2>
            <p>Jawaban ringkas mengenai capability, status, batas scope, dan implementasi.</p>
          </div>
          <div class="industry-faq-list">
            ${faqs.map((faq, index) => `
              <details${index === 0 ? " open" : ""}>
                <summary>${escapeHtml(faq.question)}<span aria-hidden="true">+</span></summary>
                <p>${escapeHtml(faq.answer)}</p>
              </details>`).join("")}
          </div>
        </div>
      </section>

      <section class="industry-cta">
        <div class="container">
          <div>
            <span>${escapeHtml(industry.name)}</span>
            <h2>${escapeHtml(industry.ctaTitle)}</h2>
            <p>${escapeHtml(industry.ctaDesc)}</p>
          </div>
          <div class="industry-cta-actions">
            <a class="industry-wa-link" href="#" data-wa>WhatsApp kami</a>
          </div>
        </div>
      </section>
    </div>`;

  document.title = `Solusi ${industry.name} — MOTOVAX`;
})();
