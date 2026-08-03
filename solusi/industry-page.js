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
          <h1>Solusi industri tidak ditemukan</h1>
          <p>Halaman yang Anda cari belum tersedia.</p>
          <a class="btn btn-primary" href="../index.html">Kembali ke beranda</a>
        </div>
      </section>`;
    return;
  }

  const statusMap = {
    live: { label: "Live di produksi", className: "live" },
    foundation: { label: "Fondasi live", className: "foundation" },
    adapt: { label: "Perlu adaptasi vertical", className: "adapt" },
    partial: { label: "Partial", className: "partial" },
    roadmap: { label: "Roadmap", className: "roadmap" },
  };

  const modules = industry.moduleRefs.map(([id, status, note]) => ({
    ...moduleCatalog[id],
    status,
    note,
  }));

  const related = Object.values(window.MOTOVAX_INDUSTRIES || {})
    .filter((item) => item.slug !== industry.slug)
    .sort((a, b) => {
      if (industry.slug !== "otomotif" && a.slug === "otomotif") return -1;
      if (industry.slug !== "property" && b.slug === "property") return -1;
      return a.name.localeCompare(b.name, "id");
    })
    .slice(0, 3);

  const faqs = [
    {
      question: `Apa itu solusi Motovax untuk ${industry.name}?`,
      answer: `Solusi ini memetakan fondasi produk Motovax—AI omnichannel, CRM, automasi, dashboard, dan platform—ke kebutuhan ${industry.audience}. Status setiap modul ditampilkan agar terlihat mana yang sudah live, menjadi fondasi, atau masih membutuhkan adaptasi vertical.`,
    },
    {
      question: "Fitur mana yang benar-benar tersedia saat ini?",
      answer: industry.status === "live"
        ? "Otomotif adalah vertical utama Motovax. IMS, Agentic AI, AI Omnichannel & Call Center, CRM Autopilot, Social Media & Ads Automation, serta dashboard tersedia di codebase produksi; beberapa modul aktif berdasarkan feature flag tenant dan finance masih partial."
        : "Fondasi AI Omnichannel & Call Center, Agentic AI, Autopilot CRM, Social Media & Ads Automation, dashboard, multi-tenant, RBAC, integrasi, dan Developer API ada di codebase. Terminologi, entity, pipeline, tool AI, dan KPI khusus industri tetap perlu discovery serta konfigurasi/adaptasi.",
    },
    {
      question: `Apakah Motovax menggantikan seluruh sistem inti ${industry.name}?`,
      answer: industry.scopeNote,
    },
    {
      question: "Bagaimana proses implementasinya?",
      answer: "Implementasi dimulai dengan pemetaan channel, customer journey, role, sumber data, dan KPI. Setelah itu tim menentukan modul fondasi yang bisa langsung dikonfigurasi, integrasi yang dibutuhkan, serta scope adaptasi/new build sebelum go-live.",
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
              <div class="industry-kicker-row">
                <span class="industry-kicker">${escapeHtml(industry.name)}</span>
                <span class="industry-readiness ${escapeHtml(industry.status)}"><i></i>${escapeHtml(industry.statusLabel)}</span>
              </div>
              <h1>${escapeHtml(industry.heroTitle)}</h1>
              <p>${escapeHtml(industry.heroDesc)}</p>
              <div class="industry-hero-actions">
                <a class="btn btn-primary" href="../index.html#kontak">Jadwalkan Demo <span>→</span></a>
                <a class="btn btn-secondary" href="#kapabilitas">Lihat Kapabilitas</a>
              </div>
              <div class="industry-honesty-note">
                <span aria-hidden="true">i</span>
                <p><strong>Status transparan.</strong> “Fondasi live” berarti modul ada di motovax-app saat ini; pack dan workflow khusus industri tetap memerlukan konfigurasi.</p>
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
                    <p>Ilustrasi alur konfigurasi</p>
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
            <span>TANTANGAN INDUSTRI</span>
            <h2>Apa yang menghambat ${escapeHtml(industry.audience)}?</h2>
            <p>Masalah customer journey yang dapat ditangani oleh fondasi solusi Motovax, dengan konfigurasi sesuai proses bisnis.</p>
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
            <span>TRANSFORMASI OPERASIONAL</span>
            <h2>Dari proses terpisah menjadi satu journey</h2>
            <p>Struktur halaman mengikuti pola problem–solution, sementara isi diselaraskan dengan capability dan batas produk Motovax.</p>
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
                    <small>DENGAN FONDASI MOTOVAX</small>
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
            <span>EKOSISTEM KAPABILITAS</span>
            <h2>Modul Motovax untuk ${escapeHtml(industry.name)}</h2>
            <p>Status di bawah merujuk kondisi codebase motovax-app saat ini, bukan sekadar daftar aspirasi.</p>
          </div>
          <div class="industry-status-legend" aria-label="Legenda status modul">
            <span class="live"><i></i>Live di produksi</span>
            <span class="foundation"><i></i>Fondasi live</span>
            <span class="adapt"><i></i>Perlu adaptasi vertical</span>
            <span class="partial"><i></i>Partial</span>
          </div>
          <div class="industry-module-grid">
            ${modules.map((module) => {
              const status = statusMap[module.status] || statusMap.adapt;
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
            <span>FREQUENTLY ASKED QUESTIONS</span>
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

      <section class="industry-related">
        <div class="container">
          <div class="industry-related-head">
            <div>
              <span>SOLUSI LAINNYA</span>
              <h2>Jelajahi industri lain</h2>
            </div>
            <a href="../index.html#solusi">Lihat menu solusi <span>→</span></a>
          </div>
          <div class="industry-related-grid">
            ${related.map((item) => `
              <a href="./${escapeHtml(item.slug)}.html">
                <span>${escapeHtml(item.name.slice(0, 2).toUpperCase())}</span>
                <div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.heroTitle)}</p></div>
                <b>→</b>
              </a>`).join("")}
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
            <a class="btn btn-light" href="../index.html#kontak">Jadwalkan Demo <span>→</span></a>
            <a class="industry-wa-link" href="#" data-wa>WhatsApp kami</a>
          </div>
        </div>
      </section>
    </div>`;

  document.title = `Solusi ${industry.name} — MOTOVAX`;
})();
