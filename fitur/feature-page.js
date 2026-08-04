/**
 * Halaman detail fitur Motovax.
 * Struktur marketing mengikuti pola halaman fitur SaaS: hero, outcome, use case,
 * showcase produk, cara kerja, fitur terkait, FAQ, dan CTA.
 */
(function () {
  const params = new URLSearchParams(location.search);
  const pathSlug = (location.pathname.split("/").pop() || "").replace(/\.html$/i, "");
  const slug =
    window.__FEATURE_SLUG__ ||
    params.get("slug") ||
    (pathSlug && pathSlug !== "index" && pathSlug !== "feature-page" ? pathSlug : "") ||
    "aplikasi-omnichannel";

  const catalog = window.MOTOVAX_FEATURES || {};
  const data = catalog[slug] || null;
  const root = document.querySelector("[data-feature-root]");
  if (!root) return;

  if (!data) {
    root.innerHTML = `
      <section class="feature-page-hero">
        <div class="container">
          <p class="feature-breadcrumb"><a href="../modul.html">Produk</a> / Fitur</p>
          <h1>Fitur tidak ditemukan</h1>
          <p class="feature-hero-desc">Halaman yang Anda cari belum tersedia. Kembali ke <a href="../modul.html">daftar produk</a>.</p>
        </div>
      </section>`;
    return;
  }

  const profile = profileFor(data);
  const availability = availabilityFor(data.status);
  const capabilities = data.capabilities || [];
  const benefits = data.benefits || [];
  const workflow = data.howItWorks || [];
  const relatedItems = uniqueBySlug((data.related || []).map((id) => catalog[id]).filter(Boolean));
  const faqs = buildFaqs(data, profile, availability, capabilities, workflow, relatedItems);

  const crumbs = (data.breadcrumbs || ["Produk", "Kapabilitas", data.title])
    .map((item, index, items) => {
      if (index === items.length - 1) return `<span>${escapeHtml(item)}</span>`;
      if (item === "Produk") return `<a href="../modul.html">${escapeHtml(item)}</a>`;
      return `<span>${escapeHtml(item)}</span>`;
    })
    .join(' <span class="crumb-sep">/</span> ');

  // Satu demo dipakai bersama oleh beberapa halaman detail dalam kelompok yang
  // sama. Nilai eksplisit di katalog tetap menang (mis. Goal -> Dashboard),
  // sedangkan fallback memastikan setiap halaman detail punya CTA simulasi.
  const demoByCategory = {
    "Aplikasi Omnichannel": "omni",
    "Aplikasi CRM": "crm",
    "WhatsApp API": "whatsapp",
    "Customer Support & Ticketing": "omni",
    "AI & Chatbot": "falcon",
    "Automasi Operasional & Workflow": "automation",
    "Manajemen Campaign": "social",
    "Call Center": "omni",
    "Suite Motovax": "dashboard",
  };
  const demoHashes = {
    inventory: "inventoryDemo",
    omni: "omniDemo",
    crm: "crmDemo",
    social: "socialDemo",
    dashboard: "dashboardDemo",
    insight: "insightDemo",
    falcon: "falconDemo",
    whatsapp: "capabilityDemo",
    automation: "capabilityDemo",
  };
  const sharedDemo = data.demo || demoByCategory[data.category] || "dashboard";
  const sharedDemoHash = data.demoHash || demoHashes[sharedDemo] || "solusi";
  const demoParams = new URLSearchParams({ demo: sharedDemo, from: data.slug || slug });
  const demoHref = `../index.html?${demoParams.toString()}#${sharedDemoHash}`;
  const isRelatedSimulation = /partial|roadmap/i.test(data.status || "");
  const demoLabel = isRelatedSimulation ? "Lihat Simulasi Terkait" : "Coba Demo Interaktif";
  const demoCta = `<a class="btn btn-secondary feature-hero-demo" href="${escapeHtml(demoHref)}">${demoLabel} <span>-></span></a>`;

  function isFanelingCapability(capability) {
    return slug === "aplikasi-omnichannel" && /fanel/i.test(String(capability?.title || ""));
  }

  function renderShowcaseAction(capability) {
    if (isFanelingCapability(capability)) return "";
    return `<a href="https://motovax.ai/hubungi-kami.html">Konsultasikan kebutuhan <span>-></span></a>`;
  }

  const heroBenefits = benefits
    .slice(0, 4)
    .map((benefit) => `<li><span aria-hidden="true">✓</span>${escapeHtml(benefit)}</li>`)
    .join("");

  const outcomeCards = benefits
    .slice(0, 4)
    .map(
      (benefit, index) => `
        <article class="feature-outcome-card">
          <span class="feature-outcome-icon" aria-hidden="true">${outcomeIcon(index)}</span>
          <strong>${escapeHtml(benefit)}</strong>
        </article>`,
    )
    .join("");

  const useCases = profile.roles
    .map((role, index) => {
      const primary = capabilities[index % Math.max(capabilities.length, 1)];
      const secondary = capabilities[(index + profile.roles.length) % Math.max(capabilities.length, 1)];
      const points = [primary, secondary]
        .filter(Boolean)
        .filter((item, itemIndex, items) => items.findIndex((entry) => entry.title === item.title) === itemIndex)
        .map((item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.desc)}</span></li>`)
        .join("");
      return `
        <article class="feature-use-case-card">
          <div class="feature-use-case-topline">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <em>${escapeHtml(role)}</em>
          </div>
          <h3>${escapeHtml(data.title)} untuk ${escapeHtml(role.toLowerCase())}</h3>
          <ul>${points}</ul>
        </article>`;
    })
    .join("");

  const showcase = capabilities
    .map((capability, index) => {
      const step = workflow[index % Math.max(workflow.length, 1)];
      const benefit = benefits[index % Math.max(benefits.length, 1)];
      return `
        <article class="feature-showcase-row${index % 2 ? " reverse" : ""}">
          <div class="feature-showcase-copy">
            <span class="feature-showcase-number">FITUR ${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(capability.title)}</h3>
            <p>${escapeHtml(capability.desc)}</p>
            <ul>
              ${step ? `<li>${escapeHtml(step.title)} — ${escapeHtml(step.desc)}</li>` : ""}
              ${benefit ? `<li>${escapeHtml(benefit)}</li>` : ""}
            </ul>
            ${renderShowcaseAction(capability)}
          </div>
          ${renderShowcaseVisual(data, profile, capability, index)}
        </article>`;
    })
    .join("");

  const steps = workflow
    .map(
      (step, index) => `
        <li class="feature-step">
          <span class="feature-step-num">${index + 1}</span>
          <div>
            <strong>${escapeHtml(step.title)}</strong>
            <p>${escapeHtml(step.desc)}</p>
          </div>
        </li>`,
    )
    .join("");

  const related = relatedItems
    .map(
      (item) => `
        <a class="feature-related-card" href="./${escapeHtml(item.slug)}.html">
          <span class="feature-related-arrow" aria-hidden="true">↗</span>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.heroTitle)}</span>
        </a>`,
    )
    .join("");

  const faqMarkup = faqs
    .map(
      (faq, index) => `
        <details class="feature-faq-item"${index === 0 ? " open" : ""}>
          <summary>${escapeHtml(faq.question)}<span aria-hidden="true">+</span></summary>
          <p>${escapeHtml(faq.answer)}</p>
        </details>`,
    )
    .join("");

  document.title = `${data.title} — MOTOVAX`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", data.heroDesc.slice(0, 160));
  injectFaqSchema(faqs, data);

  root.innerHTML = `
    <section class="feature-page-hero">
      <div class="container">
        <p class="feature-breadcrumb">${crumbs}</p>
        <div class="feature-hero-grid">
          <div class="feature-hero-copy">
            <div class="feature-hero-badges">
              <span class="feature-badge">${escapeHtml(profile.eyebrow)}</span>
              <span class="feature-badge ${availability.tone}">${escapeHtml(availability.label)}</span>
            </div>
            <h1>${escapeHtml(data.heroTitle)}</h1>
            <p class="feature-hero-desc">${escapeHtml(data.heroDesc)}</p>
            ${heroBenefits ? `<ul class="feature-hero-list">${heroBenefits}</ul>` : ""}
            <div class="feature-hero-actions">
              <a class="btn btn-primary" href="../index.html#kontak">Jadwalkan Demo <span>-></span></a>
              ${demoCta}
            </div>
          </div>
          ${renderProductVisual(data, profile, capabilities, workflow)}
        </div>
      </div>
    </section>

    <section class="feature-proof-strip" aria-label="Manfaat utama">
      <div class="container feature-outcome-grid">${outcomeCards}</div>
    </section>

    <section class="feature-page-section feature-intro-section">
      <div class="container">
        <div class="feature-section-heading centered">
          <span>${escapeHtml(profile.sectionLabel)}</span>
          <h2>${escapeHtml(data.title)} untuk operasional yang lebih cepat dan terhubung</h2>
          <p>${escapeHtml(profile.intro)}</p>
        </div>
        <div class="feature-use-case-grid">${useCases}</div>
      </div>
    </section>

    <section class="feature-page-section feature-showcase-section" id="kemampuan">
      <div class="container">
        <div class="feature-section-heading centered">
          <span>FITUR UNGGULAN</span>
          <h2>Kemampuan yang dapat dipakai tim Anda</h2>
          <p>Setiap bagian di bawah menggambarkan capability Motovax dan alur kerja yang didukungnya.</p>
        </div>
        <div class="feature-showcase-list">${showcase}</div>
      </div>
    </section>

    <section class="feature-page-section feature-foundation-section">
      <div class="container">
        <div class="feature-section-heading centered light">
          <span>MENGAPA MOTOVAX</span>
          <h2>Satu platform untuk data, tim, dan agen AI</h2>
          <p>Fondasi yang sama dipakai lintas modul agar aktivitas pelanggan dan operasional tidak terpecah.</p>
        </div>
        <div class="feature-foundation-grid">
          ${foundationCard("Satu data operasional", "Percakapan, lead, unit, campaign, dan insight saling terhubung sesuai modul yang aktif.", "01")}
          ${foundationCard("Akses berbasis peran", "Workspace dan aksi mengikuti role serta permission pengguna untuk menjaga kendali operasional.", "02")}
          ${foundationCard("Multi-tenant & multi-cabang", "Konfigurasi, data, dan integrasi dipisahkan per organisasi sekaligus mendukung operasi lintas cabang.", "03")}
          ${foundationCard("AI dengan business tools", "Agen AI dapat menjalankan tool bisnis seperti stok, kredit, follow-up, handoff, dan konten.", "04")}
        </div>
      </div>
    </section>

    <section class="feature-page-section feature-process-section">
      <div class="container feature-process-grid">
        <div class="feature-section-heading">
          <span>CARA KERJA</span>
          <h2>Dari aktivitas masuk hingga tindak lanjut</h2>
          <p>${escapeHtml(availability.detail)}</p>
          <a class="btn btn-primary" href="https://motovax.ai/hubungi-kami.html">Diskusikan kebutuhan Anda</a>
        </div>
        <ol class="feature-steps">${steps}</ol>
      </div>
    </section>

    ${
      related
        ? `<section class="feature-page-section feature-related-section">
      <div class="container">
        <div class="feature-section-heading">
          <span>TERHUBUNG</span>
          <h2>Fitur dan solusi terkait</h2>
          <p>Bangun alur kerja end-to-end dengan capability Motovax lainnya.</p>
        </div>
        <div class="feature-related-grid">${related}</div>
      </div>
    </section>`
        : ""
    }

    <section class="feature-page-section feature-faq-section">
      <div class="container feature-faq-layout">
        <div class="feature-section-heading">
          <span>FAQ</span>
          <h2>Pertanyaan tentang ${escapeHtml(data.title)}</h2>
          <p>Informasi singkat untuk membantu Anda memahami fungsi, ketersediaan, dan keterhubungan fiturnya.</p>
        </div>
        <div class="feature-faq-list">${faqMarkup}</div>
      </div>
    </section>

    <section class="feature-page-cta">
      <div class="container feature-page-cta-inner">
        <div>
          <span>POWER YOUR OPERATION</span>
          <h2>Siap melihat ${escapeHtml(data.title)} untuk bisnis Anda?</h2>
          <p>Jadwalkan sesi bersama tim Motovax untuk melihat alur yang paling relevan.</p>
        </div>
        <div class="feature-hero-actions">
          <a class="btn btn-light" href="#" data-wa>WhatsApp Sales <span>-></span></a>
          <a class="btn btn-secondary" href="../index.html#kontak">Jadwalkan Demo</a>
        </div>
      </div>
    </section>

    <div class="feature-image-modal" data-feature-image-modal hidden role="dialog" aria-modal="true" aria-labelledby="featureImageModalTitle">
      <div class="feature-image-modal-panel">
        <header>
          <div>
            <span>SCREENSHOT PRODUK</span>
            <strong id="featureImageModalTitle" data-feature-image-modal-title>Pratinjau fitur Motovax</strong>
          </div>
          <button type="button" data-feature-image-close aria-label="Tutup screenshot">×</button>
        </header>
        <div class="feature-image-modal-scroll">
          <img data-feature-image-modal-img src="" alt="">
        </div>
      </div>
    </div>`;

  const whatsappUrl =
    "https://wa.me/6281999197186?text=Halo%20MOTOVAX%2C%20saya%20ingin%20jadwalkan%20demo.";
  for (const link of root.querySelectorAll("[data-wa]")) {
    if (link instanceof HTMLAnchorElement) {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  }

  const imageModal = root.querySelector("[data-feature-image-modal]");
  const imageModalImg = root.querySelector("[data-feature-image-modal-img]");
  const imageModalTitle = root.querySelector("[data-feature-image-modal-title]");
  let imageModalTrigger = null;
  const closeImageModal = () => {
    if (!imageModal || imageModal.hidden) return;
    imageModal.hidden = true;
    document.body.classList.remove("feature-image-open");
    imageModalImg?.removeAttribute("src");
    imageModalTrigger?.focus();
  };
  for (const button of root.querySelectorAll("[data-feature-image-open]")) {
    button.addEventListener("click", () => {
      if (!imageModal || !imageModalImg) return;
      imageModalTrigger = button;
      imageModalImg.src = button.dataset.imageSrc || "";
      imageModalImg.alt = button.dataset.imageAlt || "Screenshot fitur Motovax ukuran penuh";
      if (imageModalTitle) imageModalTitle.textContent = button.dataset.imageTitle || "Pratinjau fitur Motovax";
      imageModal.hidden = false;
      document.body.classList.add("feature-image-open");
      imageModal.querySelector("[data-feature-image-close]")?.focus();
    });
  }
  imageModal?.addEventListener("click", (event) => {
    if (event.target === imageModal || event.target.closest("[data-feature-image-close]")) closeImageModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageModal && !imageModal.hidden) closeImageModal();
  });

  function profileFor(feature) {
    const id = feature.slug || "";
    const category = String(feature.category || "");
    const suite = /motovax-(360|sales-suite|service-suite)/.test(id);
    const campaign = /broadcast|blast|bulk|ctwa/.test(id);
    const analytics = /goal|report|scorecard/.test(id) || ["dashboard", "insight"].includes(feature.demo);
    const workflowFamily = /workflow|knowledge|flows/.test(id);
    const crm = feature.demo === "crm" || /CRM/.test(category) || /deal|kontak|pipeline|sales-gps/.test(id);
    const social = feature.demo === "social";

    if (suite) {
      return {
        family: "suite",
        eyebrow: "SOLUSI BISNIS MOTOVAX",
        sectionLabel: "SATU EKOSISTEM",
        intro: "Satukan modul yang relevan dalam satu journey agar tim bergerak dengan konteks data yang sama.",
        roles: ["Manajemen", "Tim Sales", "Customer Service"],
        facts: ["Multi-modul", "Satu data", "Role-based"],
      };
    }
    if (campaign || social) {
      return {
        family: "campaign",
        eyebrow: "MARKETING & CAMPAIGN",
        sectionLabel: "AKTIVASI PELANGGAN",
        intro: "Rancang, jalankan, dan pantau komunikasi pelanggan tanpa memutus konteks dari CRM dan operasional.",
        roles: ["Marketing", "Tim Sales", "Manajemen"],
        facts: ["Tersegmentasi", "Terjadwal", "Terukur"],
      };
    }
    if (analytics) {
      return {
        family: "analytics",
        eyebrow: "ANALYTICS MOTOVAX",
        sectionLabel: "INSIGHT OPERASIONAL",
        intro: "Ubah aktivitas harian menjadi visibilitas yang membantu tim memprioritaskan tindakan berikutnya.",
        roles: ["Manajemen", "Supervisor", "Tim Sales"],
        facts: ["Ringkas", "Terfilter", "Actionable"],
      };
    }
    if (workflowFamily) {
      return {
        family: "workflow",
        eyebrow: "AUTOMATION & AI",
        sectionLabel: "ALUR KERJA TERHUBUNG",
        intro: "Hubungkan pemicu, pengetahuan, dan tindakan agar pekerjaan berulang dapat ditangani secara konsisten.",
        roles: ["Operasional", "Customer Service", "Admin"],
        facts: ["Trigger", "Knowledge", "Action"],
      };
    }
    if (crm) {
      return {
        family: "crm",
        eyebrow: "AUTOPILOT CRM",
        sectionLabel: "CUSTOMER JOURNEY",
        intro: "Kelola customer, pipeline, follow-up, dan performa sales dari satu workspace yang terhubung.",
        roles: ["Tim Sales", "Marketing", "Manajemen"],
        facts: ["Customer 360°", "Pipeline", "Follow-up"],
      };
    }
    return {
      family: "omni",
      eyebrow: "AI OMNICHANNEL",
      sectionLabel: "INTERAKSI PELANGGAN",
      intro: "Satukan percakapan, konteks customer, dan aksi operasional agar respons lebih cepat dan tindak lanjut lebih rapi.",
      roles: ["Customer Service", "Tim Sales", "Marketing"],
      facts: ["Realtime", "AI + Agent", "Terhubung"],
    };
  }

  function availabilityFor(statusValue) {
    const status = String(statusValue || "Live").toLowerCase();
    if (status.includes("roadmap")) {
      return {
        label: "Dalam pengembangan",
        tone: "roadmap",
        detail: "Capability ini berada dalam arah pengembangan Motovax. Cakupan implementasi disesuaikan dengan kebutuhan dan kesiapan integrasi.",
      };
    }
    if (status.includes("partial")) {
      return {
        label: "Tersedia terbatas",
        tone: "partial",
        detail: "Sebagian capability sudah tersedia. Cakupan aktivasi dapat berbeda menurut modul, konfigurasi tenant, dan integrasi yang digunakan.",
      };
    }
    if (status.includes("suite")) {
      return {
        label: "Solusi terintegrasi",
        tone: "live",
        detail: "Solusi ini menyatukan beberapa modul Motovax. Aktivasi dan alurnya dapat disesuaikan dengan kebutuhan organisasi.",
      };
    }
    return {
      label: "Tersedia di Motovax",
      tone: "live",
      detail: "Capability utama tersedia dan dapat dikonfigurasi mengikuti role, cabang, channel, serta modul yang digunakan organisasi.",
    };
  }

  function renderProductVisual(feature, productProfile, caps, flow) {
    const preview = previewFor(feature);
    if (preview) {
      return `
        <figure class="feature-product-visual feature-product-preview family-${productProfile.family}" aria-label="Pratinjau antarmuka ${escapeHtml(feature.title)}">
          <div class="feature-preview-window">
            <div class="feature-preview-topbar" aria-hidden="true">
              <span class="feature-preview-dots"><i></i><i></i><i></i></span>
              <strong>${escapeHtml(preview.label)}</strong>
              <span class="feature-preview-status"><i></i> Data demo</span>
            </div>
            <div class="feature-preview-image-shell">
              <img
                src="../assets/feature-previews/${escapeHtml(preview.file)}"
                width="1440"
                height="900"
                alt="${escapeHtml(preview.alt)}"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              >
            </div>
            <figcaption>Tampilan aplikasi Motovax dengan data yang telah dianonimkan.</figcaption>
          </div>
          <span class="feature-visual-orbit one"></span>
          <span class="feature-visual-orbit two"></span>
        </figure>`;
    }

    const rows = caps.slice(0, 3);
    const activities = flow.slice(0, 3);
    return `
      <div class="feature-product-visual family-${productProfile.family}" aria-label="Pratinjau antarmuka ${escapeHtml(feature.title)}">
        <div class="feature-ui-window">
          <div class="feature-ui-topbar">
            <span class="feature-ui-dots"><i></i><i></i><i></i></span>
            <strong>MOTOVAX</strong>
            <span class="feature-ui-live"><i></i> Live workspace</span>
          </div>
          <div class="feature-ui-shell">
            <aside class="feature-ui-sidebar" aria-hidden="true">
              <b>MV</b>
              <i class="active"></i><i></i><i></i><i></i><i></i>
            </aside>
            <div class="feature-ui-main">
              <div class="feature-ui-heading">
                <div><small>${escapeHtml(productProfile.eyebrow)}</small><strong>${escapeHtml(feature.title)}</strong></div>
                <button type="button" tabindex="-1">+ Aksi baru</button>
              </div>
              <div class="feature-ui-metrics">
                ${productProfile.facts.map((fact, index) => `<div><span>${escapeHtml(fact)}</span><strong>${index === 0 ? "Aktif" : index === 1 ? "Realtime" : "Siap"}</strong></div>`).join("")}
              </div>
              <div class="feature-ui-content">
                <div class="feature-ui-list">
                  ${rows.map((row, index) => `<div class="feature-ui-row"><span class="feature-ui-avatar">${escapeHtml(row.title.slice(0, 1))}</span><div><strong>${escapeHtml(row.title)}</strong><small>${escapeHtml(shorten(row.desc, 54))}</small></div><em>${index === 0 ? "Baru" : "Aktif"}</em></div>`).join("")}
                </div>
                <div class="feature-ui-activity">
                  <strong>Alur kerja</strong>
                  ${activities.map((item, index) => `<div><i>${index + 1}</i><span>${escapeHtml(item.title)}</span></div>`).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <span class="feature-visual-orbit one"></span>
        <span class="feature-visual-orbit two"></span>
      </div>`;
  }

  function previewFor(feature) {
    const id = String(feature.slug || "");
    const title = String(feature.title || "fitur Motovax");
    const preview = (file, label) => ({
      file,
      label,
      alt: `Tampilan aplikasi Motovax untuk ${title} dengan data demo`,
    });

    return previewSetFor(id, preview)[0];
  }

  function previewSetFor(id, previewFactory) {
    const previews = {
      omni: previewFactory("omnichannel-inbox.webp", "Omnichannel Inbox"),
      service: previewFactory("service-performance.webp", "Service Performance"),
      integrations: previewFactory("channel-integrations.webp", "Integrasi Channel"),
      agents: previewFactory("ai-agents.webp", "CRM & AI Agent"),
      social: previewFactory("social-generator.webp", "Social Media Generator"),
      analytics: previewFactory("sales-analytics.webp", "Analytics & Performance"),
    };

    if (/broadcast|blast|bulk|ctwa/.test(id)) {
      return [previews.social, previews.omni, previews.analytics];
    }
    if (/instagram-api|whatsapp-business-api|centang-biru|whatsapp-business-calling|whatsapp-flows|ticket-creation-integration/.test(id)) {
      return [previews.integrations, previews.omni, previews.social];
    }
    if (/goal|report|scorecard|motovax-360/.test(id)) {
      return [previews.analytics, previews.agents, previews.service];
    }
    if (/aplikasi-crm|manajemen-deal|manajemen-kontak|sales-gps|agentic-ai|chatbot|integrasi-airene|knowledge-base|automasi-workflow|motovax-sales-suite/.test(id)) {
      return [previews.agents, previews.analytics, previews.omni];
    }
    if (/aplikasi-call-center|manajemen-sla|sistem-manajemen-tiket|motovax-service-suite/.test(id)) {
      return [previews.service, previews.omni, previews.agents];
    }
    return [previews.omni, previews.integrations, previews.service];
  }

  function renderShowcaseVisual(feature, productProfile, capability, index) {
    const title = String(feature.title || "fitur Motovax");
    const capabilityTitle = String(capability.title || "");
    const slug = String(feature.slug || "");
    const captured = (file, label, caption, dimensions = [1440, 900]) => ({
      file,
      label,
      caption,
      alt: `Tampilan ${label} untuk ${capabilityTitle} pada ${title} dengan data demo`,
      width: dimensions[0],
      height: dimensions[1],
      fullLink: true,
    });
    const matches = (pattern) => pattern.test(`${slug} ${capabilityTitle}`);
    let preview;

    // Tiap capability diarahkan ke state produk yang relevan. Urutannya sengaja
    // semantik dan tidak bergantung pada nomor kartu/rotasi screenshot umum.
    if (matches(/fanel/i)) {
      preview = captured("omnichannel-faneling-public.png", "Call Center · AI → Agent → MR", "Jejak AI dan takeover Agent tetap terlihat setelah lead masuk bucket MR.");
    } else if (matches(/handoff|takeover|eskalasi/i)) {
      preview = captured("omnichannel-handoff-public.png", "Call Center · Handoff ke MR", "Agent memilih MR, alasan, dan catatan sebelum menyerahkan lead.");
    } else if (matches(/aksi cepat|inventori|stok akurat|konteks stok|unit ready/i)) {
      preview = captured("omnichannel-inventory-public.png", "Call Center · Cek Inventori", "Unit ready dapat dicari, dihitung kreditnya, lalu dibagikan ke conversation.", [1851, 849]);
    } else if (matches(/performa omnichannel|manajemen-sla|metrik channel|respons realtime|realtime sse/i)) {
      preview = /realtime sse/i.test(capabilityTitle)
        ? captured("omnichannel-realtime-public.png", "Call Center · SSE realtime aktif", "Status koneksi realtime dan perubahan conversation terlihat dalam satu workspace.")
        : captured("omnichannel-performance-public.png", "Analytics · Performa Call Center", "Ringkasan inbox, AI, MR, dan eskalasi membantu pemantauan layanan.");
    } else if (matches(/aplikasi-omnichannel|instagram-api|embedded-live-chat|ticket-creation|customer-service|sistem-manajemen-tiket|aplikasi-call-center|motovax-service-suite|integrasi-airene|omnichannel inbox|multi-channel|multi-channel|dm di inbox|status percakapan|riwayat channel|channel bisnis|call center workspace|satu model inbox|multi-channel/i)) {
      preview = captured("omnichannel-multichannel-public.png", "Inbox · WhatsApp / Facebook / Instagram", "Percakapan dan filter channel tersedia dalam satu workspace Call Center.");
    } else if (matches(/broadcast|blast|bulk|ctwa|ads campaign|promo unit|outbound scale|segment|template ai|campaign insight/i)) {
      if (matches(/insight|atribusi|performa/i)) {
        preview = captured("product-social-insight.png", "Campaign Insight", "Hasil campaign dan respons pelanggan dipantau dalam satu tampilan.");
      } else if (matches(/kalender|posting/i)) {
        preview = captured("product-social-calendar.png", "Kalender Posting", "Jadwal konten dan campaign tersusun dalam kalender tim.");
      } else if (matches(/konten dari stok|konten stok/i)) {
        preview = captured("product-social-studio.png", "Content Studio", "Konten campaign disusun dari data unit dan inventori.");
      } else {
        preview = captured("product-social-broadcast.png", "WhatsApp Broadcast Terukur", "Audiens, pesan personal, jadwal, dan ringkasan pengiriman tampil jelas.");
      }
    } else if (matches(/goal|report|scorecard|dashboard|kpi|cabang|lokasi|analytics|motovax-360/i)) {
      if (matches(/channel|omnichannel/i)) {
        preview = captured("product-dashboard-channels.png", "Dashboard · Omnichannel", "Performa channel dan sumber percakapan dapat dibandingkan.");
      } else if (matches(/cabang|lokasi/i)) {
        preview = captured("product-dashboard-locations.png", "Dashboard · Performa Cabang", "Kinerja antar-cabang tampil dalam satu command center.");
      } else if (matches(/sales|scorecard|konversi/i)) {
        preview = captured("product-dashboard-sales.png", "Dashboard · Sales Performance", "KPI pipeline, konversi, dan performa sales terlihat bersama.");
      } else {
        preview = captured("product-dashboard-overview.png", "Dashboard · Executive Overview", "KPI utama dan forecast bisnis tersedia dalam ringkasan eksekutif.");
      }
    } else if (matches(/crm|deal|kontak|gps|sales suite|customer database|pipeline|follow|guideline|salespeople/i)) {
      if (matches(/follow/i)) {
        preview = captured("product-crm-auto-follow.png", "CRM · Auto Follow Customer", "Daftar tindak lanjut membantu sales memprioritaskan customer.");
      } else if (matches(/guideline|panduan/i)) {
        preview = captured("product-crm-panduan.png", "CRM · Guideline", "Panduan kerja dapat diakses langsung dari workspace CRM.");
      } else if (matches(/customer|kontak|gps|salespeople/i)) {
        preview = captured("product-crm-customer.png", "CRM · Customer Database", "Profil customer, cabang, PIC, dan aktivitas tersusun dalam satu daftar.");
      } else {
        preview = captured("product-crm-pipeline.png", "CRM · Pipeline Sales", "Lead terkelompok berdasarkan tahap agar tindak lanjut terlihat jelas.");
      }
    } else if (matches(/agentic-ai|chatbot|falcon|ai sales|tool-rich agent|native tools|multi-peran|permission aware|knowledge|web/i)) {
      preview = matches(/management|laporan|aging|gp|permission|knowledge|web/i)
        ? captured("product-falcon-management.png", "Falcon · Management Agent", "Management Agent menyediakan tool laporan, aging, margin, dan analytics.")
        : captured("product-falcon-sales.png", "Falcon · Sales Agent", "Sales Agent menjawab stok, foto, kredit, dan kebutuhan lead.");
    } else if (matches(/whatsapp|session|flows|tool schema|governance|brand trust/i)) {
      preview = captured("product-capability-whatsapp.png", "WhatsApp Business API", "Konfigurasi channel dan capability WhatsApp terlihat dalam workspace produk.");
    } else if (matches(/automasi|workflow|workers|tool chains/i)) {
      preview = captured("product-capability-automation.png", "Automation Workflow", "Trigger dan aksi otomasi tersusun sebagai alur kerja yang dapat dipantau.");
    } else {
      preview = captured("product-dashboard-overview.png", "Motovax · Executive Overview", "Ringkasan operasional produk tersedia dalam satu dashboard.");
    }
    return `
      <figure class="feature-showcase-visual feature-showcase-preview family-${productProfile.family}">
        <div class="feature-showcase-preview-window">
          <div class="feature-showcase-preview-topbar">
            <span><i></i> Screenshot produk</span>
            <strong>${escapeHtml(preview.label)}</strong>
            <em>Data demo</em>
          </div>
          <div class="feature-showcase-preview-image${preview.wide ? " is-wide" : ""}">
            <img
              src="../assets/feature-previews/${escapeHtml(preview.file)}"
              width="${preview.width || 1440}"
              height="${preview.height || 900}"
              alt="${escapeHtml(preview.alt)}"
              loading="eager"
              decoding="async"
            >
          </div>
          <figcaption>
            <span>${escapeHtml(preview.caption || `${capability.title} dalam workspace Motovax`)}</span>
            ${preview.fullLink ? `<button type="button" data-feature-image-open data-image-src="../assets/feature-previews/${escapeHtml(preview.file)}" data-image-alt="${escapeHtml(preview.alt)}" data-image-title="${escapeHtml(preview.label)}">Buka ukuran penuh ↗</button>` : ""}
          </figcaption>
        </div>
      </figure>`;
  }

  function buildFaqs(feature, productProfile, available, caps, flow, relatedFeatures) {
    const capNames = caps.map((item) => item.title).join(", ");
    const flowNames = flow.map((item) => item.title).join(" → ");
    const relatedNames = relatedFeatures.map((item) => item.title).join(", ");
    return [
      { question: `Apa itu ${feature.title}?`, answer: feature.heroDesc },
      {
        question: `Apa kemampuan utama ${feature.title}?`,
        answer: capNames
          ? `${feature.title} mencakup ${capNames}. Detail aktivasi mengikuti kebutuhan dan konfigurasi organisasi.`
          : `${feature.title} membantu menyederhanakan proses operasional dalam platform Motovax.`,
      },
      {
        question: `Bagaimana alur kerja ${feature.title}?`,
        answer: flowNames
          ? `Alur utamanya adalah ${flowNames}. Tim dapat menyesuaikan penerapannya dengan proses bisnis yang berjalan.`
          : "Alur kerja disusun dari aktivitas masuk, pemrosesan, hingga tindak lanjut di workspace Motovax.",
      },
      { question: `Siapa yang cocok menggunakan ${feature.title}?`, answer: `${feature.title} relevan untuk ${productProfile.roles.join(", ")} sesuai pembagian role dan tanggung jawab di organisasi.` },
      { question: `Apakah ${feature.title} sudah tersedia?`, answer: `${available.label}. ${available.detail}` },
      {
        question: `Fitur apa yang terhubung dengan ${feature.title}?`,
        answer: relatedNames
          ? `${feature.title} dapat membentuk alur yang lebih lengkap bersama ${relatedNames}.`
          : `${feature.title} menggunakan fondasi data, akses berbasis peran, dan integrasi Motovax.`,
      },
    ];
  }

  function injectFaqSchema(faqItems, feature) {
    const oldSchema = document.querySelector("[data-feature-faq-schema]");
    if (oldSchema) oldSchema.remove();
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.featureFaqSchema = "";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      name: feature.title,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
    document.head.appendChild(schema);
  }

  function foundationCard(title, description, number) {
    return `<article><span>${number}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></article>`;
  }

  function uniqueBySlug(items) {
    const seen = new Set();
    return items.filter((item) => {
      if (!item?.slug || seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
  }

  function outcomeIcon(index) {
    return ["↗", "◎", "✓", "⚡"][index % 4];
  }

  function shorten(value, max) {
    const text = String(value || "");
    return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
