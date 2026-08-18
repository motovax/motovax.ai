/**
 * Data solusi dealer mobil. Klaim capability bersumber dari motovax-app
 * (route, sidebar, feature flag, backend service/tool, dan docs produk).
 */
(function exposeMotovaxDealerData() {
  const modules = {
    omnichannel: {
      title: "AI Omnichannel & Call Center",
      desc: "Satukan percakapan WhatsApp, Facebook, dan Instagram; AI, operator, dan sales bekerja dalam satu alur handoff.",
      href: "../fitur/aplikasi-omnichannel.html",
      code: "OM",
    },
    agentic: {
      title: "Agentic AI",
      desc: "Agen AI 24/7 dengan tool stok, foto unit, simulasi kredit, follow-up, dan handoff ke tim dealer.",
      href: "../fitur/agentic-ai.html",
      code: "AI",
    },
    crm: {
      title: "Autopilot CRM",
      desc: "Kelola customer, pipeline, assignment sales, program follow-up, guideline, dan performa tim dealer.",
      href: "../fitur/aplikasi-crm.html",
      code: "CR",
    },
    social: {
      title: "Social Media & Ads Automation",
      desc: "Ubah data stok menjadi creative dan caption, jadwalkan posting, kelola campaign, serta hubungkan lead dari Meta.",
      href: "../modul.html#m5-social",
      code: "SM",
    },
    dashboard: {
      title: "One Dashboard & Analytics",
      desc: "Pantau funnel, channel, performa sales, stok, margin, dan cabang sesuai role dalam satu dashboard.",
      href: "../modul.html#m6-dashboard",
      code: "DB",
    },
    inventory: {
      title: "Inventory Management System",
      desc: "Falcon mencari unit, mengirim foto, dan merekomendasikan stok live. Listing, import, dan cabang menjaga datanya akurat.",
      href: "../fitur/inventory-falcon-ai.html",
      code: "IM",
    },
    finance: {
      title: "Finance Tools",
      desc: "Simulasi kredit, TNS/GP, analisis finansial internal, trade-in, dan MRP untuk alur dealer.",
      href: "../modul.html#m9-finance",
      code: "FN",
    },
  };

  const industries = {
    otomotif: {
      slug: "otomotif",
      name: "Dealer Mobil",
      status: "live",
      statusLabel: "Khusus dealer mobil · modul operasional live",
      heroTitle: "Satukan stok, AI, omnichannel, CRM, dan analytics dealer",
      heroDesc: "Motovax menyatukan inventory unit multi-cabang, lead omnichannel, AI, CRM, follow-up sales, konten, campaign, dan insight untuk operasional dealer mobil.",
      audience: "dealer mobil",
      visualTitle: "Dealer sales journey",
      journey: ["Lead masuk", "AI cek stok & kredit", "Handoff sales", "Test drive & closing"],
      challenges: [
        { title: "Stok dan sales tidak sinkron", desc: "Sales membutuhkan unit ready, detail, foto, cabang, harga, dan status yang selalu konsisten." },
        { title: "Lead hilang di antara channel", desc: "Chat dari WhatsApp dan Meta tidak otomatis menjadi pipeline serta ownership sales." },
        { title: "Manajemen melihat data terlambat", desc: "Revenue, GP, HPP, conversion, dan performa cabang sulit dibaca jika sumbernya terpisah." },
      ],
      transformations: [
        { title: "Inventory sebagai sumber data", before: "Stocklist, foto, dan status tersebar di file serta grup chat.", after: "IMS mengelola unit, cabang, foto, import, aging, dan query stok dari satu sumber." },
        { title: "AI ke closing", before: "Pelanggan menunggu cek stok, simulasi kredit, dan sales yang tersedia.", after: "Jasmine dan Falcon memakai tool stok, foto, kredit, follow-up, serta handoff ke sales." },
        { title: "One dashboard", before: "Sales dan management merekap angka dengan definisi berbeda.", after: "Dashboard role-based menyatukan tren sales, revenue, GP, HPP, funnel, dan channel." },
      ],
      moduleRefs: [
        ["inventory", "live", "Daftar, detail, edit unit, cabang, import, foto, stok sales, dan AI inventory tersedia."],
        ["agentic", "live", "Tool stok, media, finance, CRM, handoff, konten, trade-in, dan MRP tersedia."],
        ["omnichannel", "live", "WA, FB, IG, realtime SSE, takeover, handoff sales, quick action, dan performa tersedia."],
        ["crm", "live", "Customer, pipeline, program, guideline, salespeople, agent, percakapan, dan dashboard tersedia melalui feature flag."],
        ["social", "live", "Generator creative, posting terjadwal, ads campaign, dan Meta publish tersedia melalui feature flag."],
        ["dashboard", "live", "Sales trend, revenue, GP, HPP, margin, performa cabang, sales insight, dan channel metrics tersedia."],
        ["finance", "partial", "Simulasi kredit dan analisis dealer tersedia; belum mencakup full accounting ERP."],
      ],
      scopeNote: "Motovax berfokus pada dealer mobil. CRM Autopilot dan Social Media Automation aktif berdasarkan feature flag tenant; finance mencakup tool dealer dan belum merupakan sistem accounting penuh.",
      ctaTitle: "Siap menyatukan operasional dealer Anda?",
      ctaDesc: "Lihat bagaimana stok, AI, channel, sales, dan management bekerja dari satu data dealer.",
    },
  };

  window.MOTOVAX_INDUSTRY_MODULES = modules;
  window.MOTOVAX_INDUSTRIES = industries;
})();
