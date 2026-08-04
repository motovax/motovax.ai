/**
 * Katalog fitur landing motovax.ai — referensi utama: motovax.app / motovax-app
 * (route, sidebar, call center, CRM, WhatsApp agent tools, social, dashboard).
 * Struktur & slug menu selaras pola qontak.com/fitur/* agar UX akrab.
 */
window.MOTOVAX_FEATURES = {
  "aplikasi-omnichannel": {
    slug: "aplikasi-omnichannel",
    title: "Aplikasi Omnichannel",
    heroTitle: "Satu inbox omnichannel untuk semua channel chat pelanggan",
    heroDesc:
      "Satukan WhatsApp, Instagram DM, Facebook Messenger, dan channel lain dalam Call Center Motovax. Faneling AI / agent / MR, realtime SSE, handoff, dan aksi cepat inventori serta simulasi kredit untuk mempercepat layanan pelanggan.",
    status: "Live",
    module: "M3 · AI Omnichannel & Call Center",
    flag: "whatsapp_ai",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Aplikasi Omnichannel",
    breadcrumbs: ["Produk", "Fitur", "Omnichannel"],
    capabilities: [
      {
        title: "Inbox multi-channel",
        desc: "Kelola percakapan WhatsApp, Facebook, dan Instagram dalam satu workspace Call Center — tidak perlu bolak-balik aplikasi.",
      },
      {
        title: "Faneling AI · Agent · MR",
        desc: "Chat masuk ditangani AI, dapat diambil alih Agent tanpa kehilangan konteks, lalu di-handoff ke Marketing Representative untuk follow-up dan closing.",
      },
      {
        title: "Realtime SSE",
        desc: "Update inbox lewat Server-Sent Events (bukan polling) agar agent melihat pesan baru secara live.",
      },
      {
        title: "Handoff & takeover",
        desc: "Takeover dari AI, escalate, close lead, dan handoff ke MR atau admin dengan jejak status yang jelas.",
      },
      {
        title: "Aksi cepat operasional",
        desc: "Dari inbox: cek inventori unit, simulasi kredit, dan tanya AI tanpa meninggalkan percakapan.",
      },
      {
        title: "Performa omnichannel",
        desc: "Pantau hasil channel dan performa CRM yang terhubung ke journey lead di Motovax.",
      },
    ],
    howItWorks: [
      { title: "Channel masuk", desc: "Pesan dari WhatsApp / Meta masuk ke session tenant dan muncul di inbox Call Center." },
      { title: "AI atau agent", desc: "Jasmine/Falcon atau agent manusia merespons; faneling mengatur siapa yang menangani." },
      { title: "Aksi bisnis", desc: "Cek stok, kredit, atau handoff MR — data dari inventory & CRM live tenant." },
      { title: "Tutup atau lanjut", desc: "Close lead, escalate, atau lanjutkan follow-up di pipeline CRM." },
    ],
    benefits: [
      "Satu sumber kebenaran chat untuk sales & CS dealer",
      "AI 24/7 dengan tool native stok & kredit (bukan keyword bot)",
      "Handoff manusia tanpa kehilangan konteks",
      "Selaras fitur Call Center di aplikasi produksi Motovax",
    ],
    related: ["instagram-api", "aplikasi-call-center", "agentic-ai", "aplikasi-customer-service"],
  },

  "instagram-api": {
    slug: "instagram-api",
    title: "Instagram API",
    heroTitle: "Kelola Instagram DM dalam omnichannel Motovax",
    heroDesc:
      "Integrasi channel Instagram di Motovax menyatukan DM ke Call Center bersama WhatsApp dan Messenger. Agent dan AI memakai data stok & CRM yang sama.",
    status: "Live",
    module: "M3 · Omnichannel + integrasi Meta",
    flag: "whatsapp_ai",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Aplikasi Omnichannel",
    breadcrumbs: ["Produk", "Fitur", "Instagram API"],
    capabilities: [
      { title: "DM di inbox terpusat", desc: "Percakapan Instagram masuk ke workspace Call Center multi-channel." },
      { title: "Konteks inventori", desc: "AI/agent dapat merujuk unit ready stock saat menjawab inquiry dari IG." },
      { title: "Handoff ke sales", desc: "Lead dari IG dapat di-handoff ke MR atau pipeline CRM." },
      { title: "Pairing Meta", desc: "Konfigurasi integrasi channel lewat pengaturan tenant Motovax." },
    ],
    howItWorks: [
      { title: "Pairing channel", desc: "Hubungkan akun Meta / Instagram di integrasi tenant." },
      { title: "Pesan masuk", desc: "DM muncul di omnichannel inbox bersama channel lain." },
      { title: "Respon & convert", desc: "AI atau agent balas, tawarkan unit, lanjut ke CRM." },
    ],
    benefits: [
      "Inquiry IG tidak tercecer di device personal",
      "Satu SOP respons dengan WhatsApp",
      "Atribusi lead channel lebih jelas di analytics",
    ],
    related: ["aplikasi-omnichannel", "ctwa", "aplikasi-crm"],
  },

  "embedded-live-chat": {
    slug: "embedded-live-chat",
    title: "Embedded Live Chat",
    heroTitle: "Live chat yang menyatu dengan journey sales Motovax",
    heroDesc:
      "Motovax menempatkan percakapan pelanggan di Call Center omnichannel. Live chat web/app dapat diarahkan ke pola inbox, AI, dan handoff yang sama dengan WhatsApp.",
    status: "Partial",
    module: "M3 · Call Center",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Aplikasi Omnichannel",
    breadcrumbs: ["Produk", "Fitur", "Embedded Live Chat"],
    capabilities: [
      { title: "Satu model inbox", desc: "Percakapan ditangani dengan faneling dan status lead yang konsisten." },
      { title: "AI first response", desc: "Agentic AI menjawab dulu, agent mengambil alih saat dibutuhkan." },
      { title: "Konteks stok", desc: "Rekomendasi unit dari inventory multi-cabang saat chat." },
    ],
    howItWorks: [
      { title: "Widget / entry point", desc: "Pelanggan memulai chat dari web atau mini katalog." },
      { title: "Routing", desc: "Masuk ke Call Center tenant dengan aturan faneling." },
      { title: "Konversi", desc: "Lanjut booking/visit lewat CRM & MR." },
    ],
    benefits: ["CX konsisten lintas channel", "Tidak ada transcript terpisah", "Siap diukur di dashboard"],
    related: ["aplikasi-omnichannel", "chatbot", "agentic-ai"],
  },

  "ticket-creation-integration": {
    slug: "ticket-creation-integration",
    title: "Ticket Creation Integration",
    heroTitle: "Dari chat ke tiket & status lead yang terukur",
    heroDesc:
      "Di Motovax, percakapan Call Center terhubung ke status lead, escalate, close, dan jejak handoff. Pola ini mendukung resolusi masalah pelanggan tanpa meninggalkan konteks chat.",
    status: "Live",
    module: "M3 · Call Center + CRM",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Aplikasi Omnichannel",
    breadcrumbs: ["Produk", "Fitur", "Ticket Creation"],
    capabilities: [
      { title: "Status percakapan", desc: "Open, takeover, escalate, close lead di workspace agent." },
      { title: "Jejak handoff", desc: "Riwayat AI ↔ agent ↔ MR untuk akuntabilitas." },
      { title: "Lanjut ke CRM", desc: "Lead dapat dilanjutkan di pipeline Autopilot CRM." },
    ],
    howItWorks: [
      { title: "Chat masuk", desc: "Inquiry atau komplain masuk inbox." },
      { title: "Tandai & escalate", desc: "Agent menandai, escalate, atau close dengan alasan." },
      { title: "Follow-up", desc: "Tindak lanjut di CRM atau MR workspace." },
    ],
    benefits: ["Resolusi lebih cepat", "Audit trail percakapan", "Kurangi chat hilang tanpa status"],
    related: ["sistem-manajemen-tiket", "manajemen-sla", "aplikasi-customer-service"],
  },

  "aplikasi-crm": {
    slug: "aplikasi-crm",
    title: "Aplikasi CRM",
    heroTitle: "Autopilot CRM untuk pipeline sales dealer",
    heroDesc:
      "Modul CRM Motovax mencakup Customer, Pipeline Cold→Deal, program follow-up, guideline, MR, salespeople, agents, dan dashboard sales dalam satu workspace.",
    status: "Live · flag",
    module: "M4 · Autopilot CRM",
    flag: "crm_autopilot",
    demo: "crm",
    demoHash: "crmDemo",
    category: "Aplikasi CRM",
    breadcrumbs: ["Produk", "Fitur", "Aplikasi CRM"],
    capabilities: [
      { title: "Customer database", desc: "Data pelanggan terpusat terhubung percakapan dan unit minat." },
      { title: "Pipeline sales", desc: "Stage Cold → Warm → Hot → Deal dengan board yang dapat dioperasikan tim." },
      { title: "Auto follow", desc: "Program follow-up / campaign nudge untuk lead stale." },
      { title: "MR & salespeople", desc: "Workspace Marketing Representative dan salesperson terpisah sesuai role." },
      { title: "Guideline", desc: "Panduan proses sales agar AI dan manusia sejalan." },
      { title: "Sales dashboard", desc: "Pantau performa closing dan aktivitas tim." },
    ],
    howItWorks: [
      { title: "Lead masuk", desc: "Dari omnichannel, iklan, atau input manual." },
      { title: "Pipeline", desc: "Sales memindahkan stage; AI membantu follow-up." },
      { title: "Closing", desc: "Deal terhubung unit inventory dan metrik dashboard." },
    ],
    benefits: ["Satu pipeline untuk multi-cabang", "Follow-up tidak bergantung ingatan individu", "Terhubung chat & stok live"],
    related: ["manajemen-deal", "manajemen-kontak", "manajemen-pipeline", "custom-crm-report"],
  },

  "manajemen-deal": {
    slug: "manajemen-deal",
    title: "Manajemen Deal",
    heroTitle: "Kelola deal end-to-end di pipeline Motovax",
    heroDesc:
      "Deal di Motovax hidup di Autopilot CRM: stage pipeline, tautan customer, minat unit, dan aktivitas follow-up hingga closing.",
    status: "Live · flag",
    module: "M4 · Autopilot CRM",
    flag: "crm_autopilot",
    demo: "crm",
    demoHash: "crmDemo",
    category: "Aplikasi CRM",
    breadcrumbs: ["Produk", "Fitur", "Manajemen Deal"],
    capabilities: [
      { title: "Board pipeline", desc: "Visualisasi deal per stage untuk tim sales." },
      { title: "Konteks unit", desc: "Deal dapat dikaitkan minat unit dari inventory multi-cabang." },
      { title: "Aktivitas", desc: "Catatan follow-up, reminder, dan handoff dari chat." },
    ],
    howItWorks: [
      { title: "Buat / terima lead", desc: "Lead masuk pipeline." },
      { title: "Gerakkan stage", desc: "Sales update progress Cold→Deal." },
      { title: "Menang / kalah", desc: "Closing tercermin di dashboard." },
    ],
    benefits: ["Visibilitas deal per cabang", "Kurangi deal mengambang", "Integrasi chat → deal"],
    related: ["aplikasi-crm", "manajemen-kontak", "personalisasi-report-sales"],
  },

  "manajemen-kontak": {
    slug: "manajemen-kontak",
    title: "Manajemen Kontak",
    heroTitle: "Database customer terpusat untuk tim sales",
    heroDesc:
      "Menu Customer di Motovax menyimpan kontak, riwayat, dan konteks penjualan yang terhubung Call Center serta pipeline.",
    status: "Live · flag",
    module: "M4 · Autopilot CRM",
    demo: "crm",
    demoHash: "crmDemo",
    category: "Aplikasi CRM",
    breadcrumbs: ["Produk", "Fitur", "Manajemen Kontak"],
    capabilities: [
      { title: "Profil customer", desc: "Identitas, kontak, dan jejak interaksi." },
      { title: "Riwayat channel", desc: "Kaitan dengan percakapan omnichannel." },
      { title: "Siap pipeline", desc: "Kontak dapat diangkat menjadi deal aktif." },
    ],
    howItWorks: [
      { title: "Capture", desc: "Kontak dari chat, form, atau import proses sales." },
      { title: "Enrich", desc: "Lengkapi minat unit & status." },
      { title: "Activate", desc: "Masukkan ke pipeline atau auto follow." },
    ],
    benefits: ["Tidak ada kontak di spreadsheet terpisah", "Satu ID customer lintas channel", "Siap dilanjutkan agent/MR"],
    related: ["aplikasi-crm", "manajemen-deal", "aplikasi-omnichannel"],
  },

  "manajemen-goal": {
    slug: "manajemen-goal",
    title: "Manajemen Goal",
    heroTitle: "Target sales yang terukur di dashboard Motovax",
    heroDesc:
      "Motovax menampilkan metrik unit, revenue, GP, dan performa cabang/agent. Goal operasional dipantau lewat One Dashboard & sales insight di produksi.",
    status: "Live",
    module: "M6 · One Dashboard & Analytics",
    demo: "dashboard",
    demoHash: "dashboardDemo",
    category: "Aplikasi CRM",
    breadcrumbs: ["Produk", "Fitur", "Manajemen Goal"],
    capabilities: [
      { title: "KPI unit & revenue", desc: "Pantau unit terjual, revenue, HPP, laba kotor." },
      { title: "Per cabang", desc: "Bandingkan performa multi-cabang." },
      { title: "Per role", desc: "Dashboard management vs salesperson." },
    ],
    howItWorks: [
      { title: "Data operasional", desc: "Transaksi & pipeline mengalir ke analytics." },
      { title: "Dashboard", desc: "Management membaca progress vs target." },
      { title: "Tindak lanjut", desc: "Fokus cabang/agent yang di bawah target." },
    ],
    benefits: ["Target tidak hanya di spreadsheet", "Keputusan berbasis data live", "Selaras inventory & CRM"],
    related: ["personalisasi-report-sales", "aplikasi-crm", "motovax-sales-suite"],
  },

  "sales-gps-tracking": {
    slug: "sales-gps-tracking",
    title: "Sales GPS Tracking",
    heroTitle: "Visibilitas aktivitas sales lapangan",
    heroDesc:
      "Motovax mendukung operasional multi-cabang dan role salesperson/MR. Pelacakan aktivitas lapangan diposisikan sebagai perluasan di atas fondasi CRM, pipeline, dan dashboard yang sudah ada.",
    status: "Partial · roadmap",
    module: "M4 · CRM + roadmap field ops",
    demo: "crm",
    demoHash: "crmDemo",
    category: "Aplikasi CRM",
    breadcrumbs: ["Produk", "Fitur", "Sales GPS Tracking"],
    capabilities: [
      { title: "Role lapangan", desc: "Salesperson & MR punya workspace terpisah di app." },
      { title: "Pipeline mobile-ready", desc: "Update progress deal dari proses follow-up harian." },
      { title: "Multi-cabang", desc: "Konteks cabang melekat di inventory dan reporting." },
    ],
    howItWorks: [
      { title: "Assign lead", desc: "Lead di-assign ke sales/MR." },
      { title: "Aktivitas", desc: "Follow-up tercatat di CRM." },
      { title: "Review", desc: "Management pantau hasil di dashboard." },
    ],
    benefits: ["Disiplin follow-up lapangan", "Akuntabilitas per PIC", "Siap diperkaya tracking lokasi"],
    related: ["aplikasi-crm", "manajemen-deal", "agent-scorecard"],
  },

  "personalisasi-report-sales": {
    slug: "personalisasi-report-sales",
    title: "Custom CRM Report",
    heroTitle: "Laporan sales & performa yang actionable",
    heroDesc:
      "One Dashboard, Sales Trend, channel metrics, dan insight konversi di Motovax memberi laporan operasional untuk management dan sales — termasuk email report terjadwal di platform.",
    status: "Live",
    module: "M6–M7 · Analytics & Insight",
    demo: "dashboard",
    demoHash: "dashboardDemo",
    category: "Aplikasi CRM",
    breadcrumbs: ["Produk", "Fitur", "Custom CRM Report"],
    capabilities: [
      { title: "Sales Trend", desc: "Revenue, GP, HPP, unit per periode." },
      { title: "Channel breakdown", desc: "Performa sumber lead WA/FB/IG/web." },
      { title: "Email report", desc: "Laporan terjadwal dari platform multi-tenant." },
      { title: "Insight konversi", desc: "Funnel dan next best action di modul insight." },
    ],
    howItWorks: [
      { title: "Data masuk", desc: "Inventory, CRM, omnichannel mengisi metrik." },
      { title: "Visualisasi", desc: "Dashboard per role menampilkan KPI." },
      { title: "Distribusi", desc: "Email report / ekspor untuk review rutin." },
    ],
    benefits: ["Keputusan berbasis angka live", "Kurangi rekap manual", "Satu bahasa metrik untuk cabang"],
    related: ["manajemen-goal", "aplikasi-crm", "motovax-360"],
  },

  "whatsapp-business-api": {
    slug: "whatsapp-business-api",
    title: "WhatsApp API",
    heroTitle: "WhatsApp sebagai channel utama agentic AI Motovax",
    heroDesc:
      "Motovax mengintegrasikan WhatsApp session dengan agen Falcon/Jasmine yang punya tool schema: stok, foto, kredit, handoff, konten. Bukan chatbot keyword — LLM + tools produksi.",
    status: "Live",
    module: "M2 · Agentic AI WhatsApp",
    flag: "whatsapp_ai",
    demo: "whatsapp",
    demoHash: "capabilityDemo",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp API"],
    capabilities: [
      { title: "Session WhatsApp", desc: "Pairing & pengelolaan session di settings integrasi tenant." },
      { title: "Tool-rich agent", desc: "Query unit, kirim foto, simulasi kredit, assign MR, stock alert." },
      { title: "Handoff manusia", desc: "Escalation ke Call Center / admin / MR." },
      { title: "Multi-tenant", desc: "Setiap tenant punya konfigurasi AI & channel sendiri." },
    ],
    howItWorks: [
      { title: "Pairing", desc: "Hubungkan WhatsApp di integrasi tenant." },
      { title: "Agent aktif", desc: "Jasmine/Falcon menjawab dengan tools." },
      { title: "Operasi", desc: "Stok & CRM ter-update dari percakapan." },
    ],
    benefits: ["Respons 24/7 berbasis data live", "Kurangi copy-paste stok manual", "Siap handoff ke manusia"],
    related: ["agentic-ai", "wa-blast", "aplikasi-omnichannel", "centang-biru-whatsapp"],
  },

  "centang-biru-whatsapp": {
    slug: "centang-biru-whatsapp",
    title: "WhatsApp Centang Biru",
    heroTitle: "Kredibilitas bisnis di channel WhatsApp",
    heroDesc:
      "Motovax mendukung operasional WhatsApp bisnis resmi per tenant. Verifikasi/centang biru mengikuti kebijakan Meta & partner BSP; Motovax menyediakan layer agent, inbox, dan integrasi di atas channel tersebut.",
    status: "Live · depends Meta",
    module: "M2 · WhatsApp + integrasi",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Centang Biru"],
    capabilities: [
      { title: "Channel bisnis", desc: "Operasikan WhatsApp sebagai channel resmi tenant." },
      { title: "Brand trust", desc: "Kombinasikan identitas brand di agent & template balasan." },
      { title: "Governance", desc: "Kontrol akses user/role ke fitur WhatsApp AI." },
    ],
    howItWorks: [
      { title: "Siapkan bisnis", desc: "Lengkapi legalitas & Meta Business sesuai ketentuan." },
      { title: "Hubungkan Motovax", desc: "Pairing session / integrasi di tenant." },
      { title: "Aktifkan agent", desc: "Jalankan AI + Call Center di atas channel terverifikasi." },
    ],
    benefits: ["Kepercayaan pelanggan lebih tinggi", "Kurangi spoofing nomor personal", "Fondasi broadcast & API"],
    related: ["whatsapp-business-api", "wa-blast", "aplikasi-omnichannel"],
  },

  "wa-blast": {
    slug: "wa-blast",
    title: "WhatsApp Blast",
    heroTitle: "Jangkau prospek & customer secara terukur",
    heroDesc:
      "Motovax mendukung outbound lewat konten, campaign, dan alur WhatsApp. Social Media & Ads Automation serta tool agent (caption, posting, stock alert) membantu blast yang terhubung inventory.",
    status: "Live · flag",
    module: "M5 · Social + M2 · WhatsApp tools",
    flag: "social_media_automation / whatsapp_ai",
    demo: "social",
    demoHash: "socialDemo",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Blast"],
    capabilities: [
      { title: "Konten dari stok", desc: "Generate caption & creative dari unit inventory." },
      { title: "Campaign insight", desc: "Lacak klik/lead campaign di Social Growth Studio." },
      { title: "Stock alert", desc: "Notifikasi stok relevan lewat AI WhatsApp." },
    ],
    howItWorks: [
      { title: "Pilih unit/segment", desc: "Ambil unit ready atau segmen customer." },
      { title: "Susun pesan", desc: "AI bantu caption/template." },
      { title: "Kirim & ukur", desc: "Pantau respons dan lead masuk CRM." },
    ],
    benefits: ["Blast tidak lepas dari stok aktual", "Pesan lebih relevan per unit", "Masuk ke funnel CRM"],
    related: ["whatsapp-bulk", "ctwa", "aplikasi-broadcast-whatsapp", "motovax-broadcast"],
  },

  "ctwa": {
    slug: "ctwa",
    title: "Click-to-WhatsApp Ads",
    heroTitle: "Dari iklan ke chat yang siap dikonversi",
    heroDesc:
      "Motovax menghubungkan campaign ads, lead template WhatsApp, dan CRM. Social ads automation + omnichannel memastikan klik iklan berlanjut ke percakapan ber-tool stok.",
    status: "Live · flag",
    module: "M5 · Social Media & Ads",
    flag: "social_media_automation",
    demo: "social",
    demoHash: "socialDemo",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "Click-to-WhatsApp Ads"],
    capabilities: [
      { title: "Ads campaign", desc: "Kelola campaign dan insight di modul social." },
      { title: "Lead ke chat", desc: "Alur masuk WhatsApp/Call Center untuk respon cepat." },
      { title: "Atribusi", desc: "Lacak jejak campaign ke lead CRM di demo insight." },
    ],
    howItWorks: [
      { title: "Kampanye", desc: "Tayangkan iklan dengan CTA chat." },
      { title: "Inbox", desc: "Percakapan ditangani AI/agent." },
      { title: "Deal", desc: "Masuk pipeline Autopilot CRM." },
    ],
    benefits: ["Kurangi leads menguap setelah klik", "Respon pakai data unit live", "Ukur ROI ads → deal"],
    related: ["wa-blast", "aplikasi-omnichannel", "aplikasi-crm"],
  },

  "whatsapp-business-calling": {
    slug: "whatsapp-business-calling",
    title: "WhatsApp Call",
    heroTitle: "Komunikasi suara di ekosistem layanan Motovax",
    heroDesc:
      "Call Center Motovax berfokus pada chat omnichannel + AI. Voice/call notes AI ada di roadmap P0; fondasi handoff dan ticketing sudah tersedia untuk melengkapi panggilan.",
    status: "Partial · roadmap voice",
    module: "M3 · Call Center + roadmap voice",
    demo: "omni",
    demoHash: "omniDemo",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Call"],
    capabilities: [
      { title: "Call Center workspace", desc: "Agent sudah terbiasa konteks lead & channel." },
      { title: "Handoff", desc: "Eskalasi ke manusia untuk percakapan kompleks." },
      { title: "Roadmap voice notes", desc: "Catatan panggilan AI direncanakan di perluasan produk." },
    ],
    howItWorks: [
      { title: "Chat dulu", desc: "Kualifikasi lewat WhatsApp AI." },
      { title: "Eskalasi", desc: "Agent/MR lanjut via panggilan bila perlu." },
      { title: "Catat hasil", desc: "Update pipeline & status lead." },
    ],
    benefits: ["Hybrid chat + call", "Konteks tidak hilang", "Siap voice AI"],
    related: ["aplikasi-call-center", "aplikasi-omnichannel", "whatsapp-business-api"],
  },

  "whatsapp-bulk": {
    slug: "whatsapp-bulk",
    title: "WhatsApp Bulk",
    heroTitle: "Pesan massal yang terhubung data pelanggan & stok",
    heroDesc:
      "Pengiriman massal di Motovax diselaraskan dengan konten inventory, campaign social, dan tool WhatsApp AI — agar bulk message tetap relevan dan terukur.",
    status: "Live · flag",
    module: "M5 + M2",
    demo: "social",
    demoHash: "socialDemo",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Bulk"],
    capabilities: [
      { title: "Segment + stok", desc: "Pesan menonjolkan unit ready per cabang." },
      { title: "Template AI", desc: "Caption & variasi pesan dibantu agent tools." },
      { title: "Masuk funnel", desc: "Balasan masuk omnichannel/CRM." },
    ],
    howItWorks: [
      { title: "Siapkan audiens", desc: "Ambil kontak/segmen relevan." },
      { title: "Generate pesan", desc: "AI + data unit." },
      { title: "Monitor balasan", desc: "Inbox Call Center menangani reply." },
    ],
    benefits: ["Skalabel tanpa copas manual", "Relevansi stok", "Reply tertangani AI/agent"],
    related: ["wa-blast", "aplikasi-broadcast-whatsapp", "manajemen-kontak"],
  },

  "whatsapp-flows": {
    slug: "whatsapp-flows",
    title: "WhatsApp Flows",
    heroTitle: "Alur percakapan terstruktur di atas agent tools",
    heroDesc:
      "Motovax memakai agentic AI dengan tool schema dan guideline CRM. Alur terstruktur (kualifikasi, kredit, booking) dijalankan lewat tools + faneling, bukan sekadar script kaku.",
    status: "Live",
    module: "M2 · Agentic AI + M4 guideline",
    category: "WhatsApp API",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Flows"],
    capabilities: [
      { title: "Tool schema", desc: "Langkah bisnis dieksekusi sebagai tool (stok, kredit, MR)." },
      { title: "Guideline", desc: "SOP sales/CS membimbing perilaku agent." },
      { title: "Faneling", desc: "Cabang ke manusia saat flow membutuhkan judgement." },
    ],
    howItWorks: [
      { title: "Intent", desc: "AI mengenali kebutuhan pelanggan." },
      { title: "Eksekusi tool", desc: "Ambil data / buat aksi." },
      { title: "Selesai atau handoff", desc: "Tutup flow atau serahkan agent." },
    ],
    benefits: ["Flow = proses bisnis nyata", "Lebih fleksibel dari decision tree murni", "Audit lewat tool calls"],
    related: ["agentic-ai", "chatbot", "automasi-workflow"],
  },

  "aplikasi-customer-service": {
    slug: "aplikasi-customer-service",
    title: "Aplikasi Customer Service",
    heroTitle: "Layanan pelanggan di Call Center Motovax",
    heroDesc:
      "Workspace Call Center Motovax memberi agent tools untuk takeover AI, tag lead, aksi inventori/kredit, dan eskalasi — fondasi CS omnichannel di produksi.",
    status: "Live",
    module: "M3 · Call Center",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Customer Support & Ticketing",
    breadcrumbs: ["Produk", "Fitur", "Customer Service"],
    capabilities: [
      { title: "Workspace agent", desc: "Daftar percakapan, detail room, aksi cepat." },
      { title: "AI assist", desc: "Jasmine membantu draft & data sebelum takeover." },
      { title: "Multi-channel", desc: "WA + Meta dalam satu antarmuka." },
    ],
    howItWorks: [
      { title: "Antrian", desc: "Chat masuk faneling." },
      { title: "Handle", desc: "Agent/AI merespons dengan konteks." },
      { title: "Selesai", desc: "Close/escalate + update CRM bila perlu." },
    ],
    benefits: ["CS lebih cepat", "Konteks stok saat komplain/inquiry", "Kurangi app switching"],
    related: ["sistem-manajemen-tiket", "manajemen-sla", "agent-scorecard"],
  },

  "sistem-manajemen-tiket": {
    slug: "sistem-manajemen-tiket",
    title: "Manajemen Tiket",
    heroTitle: "Status isu pelanggan yang tidak hilang di chat",
    heroDesc:
      "Motovax menandai dan menuntaskan percakapan lewat status lead, escalate, dan close di Call Center, dilanjutkan follow-up CRM bila diperlukan.",
    status: "Live",
    module: "M3 + M4",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Customer Support & Ticketing",
    breadcrumbs: ["Produk", "Fitur", "Manajemen Tiket"],
    capabilities: [
      { title: "Lifecycle percakapan", desc: "Dari open hingga close dengan jelas." },
      { title: "Eskalasi", desc: "Naikkan ke PIC/admin yang tepat." },
      { title: "Kaitan CRM", desc: "Isu berulang dapat menjadi task follow-up." },
    ],
    howItWorks: [
      { title: "Buat dari chat", desc: "Agent menandai isu." },
      { title: "Kerjakan", desc: "Update status & komunikasi." },
      { title: "Tutup", desc: "Close lead + catatan." },
    ],
    benefits: ["SLA lebih mudah dijaga", "Transparansi tim", "Riwayat untuk audit"],
    related: ["manajemen-sla", "ticket-creation-integration", "aplikasi-customer-service"],
  },

  "manajemen-sla": {
    slug: "manajemen-sla",
    title: "Manajemen SLA",
    heroTitle: "Jaga kecepatan respons & resolusi",
    heroDesc:
      "Realtime inbox SSE dan metrik omnichannel Motovax mendukung monitoring kecepatan layanan. Multi-branch SLA routing ada di roadmap P0 untuk penajaman lebih lanjut.",
    status: "Partial",
    module: "M3 · Call Center + roadmap SLA",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Customer Support & Ticketing",
    breadcrumbs: ["Produk", "Fitur", "Manajemen SLA"],
    capabilities: [
      { title: "Respons realtime", desc: "Agent melihat pesan baru tanpa delay polling." },
      { title: "AI first response", desc: "Turunkan time-to-first-reply di luar jam kerja." },
      { title: "Metrik channel", desc: "Pantau beban per channel di analytics." },
    ],
    howItWorks: [
      { title: "Ukur", desc: "Pantau antrian & channel." },
      { title: "Alokasi", desc: "Faneling ke AI/agent tersedia." },
      { title: "Perbaiki", desc: "Review performa di dashboard." },
    ],
    benefits: ["First response lebih cepat", "Beban merata", "Dasar SLA multi-cabang"],
    related: ["agent-scorecard", "aplikasi-call-center", "sistem-manajemen-tiket"],
  },

  "agent-scorecard": {
    slug: "agent-scorecard",
    title: "Agent Scorecard",
    heroTitle: "Evaluasi kualitas agent & sales",
    heroDesc:
      "Dashboard performa, hasil omnichannel/CRM, dan insight sales di Motovax memberi skor operasional untuk agent dan salesperson.",
    status: "Live",
    module: "M6 · Analytics + M3 performa",
    demo: "dashboard",
    demoHash: "dashboardDemo",
    category: "Customer Support & Ticketing",
    breadcrumbs: ["Produk", "Fitur", "Agent Scorecard"],
    capabilities: [
      { title: "Performa agent", desc: "Aktivitas dan hasil terhubung channel." },
      { title: "Sales insight", desc: "Pantau kontribusi salesperson." },
      { title: "Cabang", desc: "Bandingkan kualitas layanan antar lokasi." },
    ],
    howItWorks: [
      { title: "Kumpulkan sinyal", desc: "Chat, deal, unit terjual." },
      { title: "Tampilkan", desc: "Dashboard & laporan." },
      { title: "Coaching", desc: "Management tindak lanjuti outlier." },
    ],
    benefits: ["Coaching berbasis data", "Transparansi KPI", "Tingkatkan kualitas layanan"],
    related: ["manajemen-sla", "personalisasi-report-sales", "aplikasi-customer-service"],
  },

  "chatbot": {
    slug: "chatbot",
    title: "Chatbot & Conversational AI",
    heroTitle: "Conversational AI dengan tool bisnis nyata",
    heroDesc:
      "Motovax bukan chatbot FAQ semata. Falcon & Jasmine menjalankan tool: inventory query, foto unit, simulasi kredit, handoff, caption promo, dan lainnya.",
    status: "Live",
    module: "M2 · Agentic AI",
    flag: "whatsapp_ai",
    demo: "falcon",
    demoHash: "falconDemo",
    category: "AI & Chatbot",
    breadcrumbs: ["Produk", "Fitur", "Chatbot & Conversational AI"],
    capabilities: [
      { title: "LLM + tools", desc: "Model memanggil schema tool terkontrol." },
      { title: "Domain dealer", desc: "Stok, kredit, trade-in, MRP." },
      { title: "Preferensi reply", desc: "Kebijakan balasan per tenant." },
    ],
    howItWorks: [
      { title: "Pesan masuk", desc: "User chat di WhatsApp/channel." },
      { title: "Reason + act", desc: "AI memilih tool yang relevan." },
      { title: "Jawab / handoff", desc: "Balas lengkap atau serahkan manusia." },
    ],
    benefits: ["Otomasi yang berdampak operasional", "Lebih akurat karena data live", "Aman di batas permission"],
    related: ["agentic-ai", "integrasi-airene", "whatsapp-business-api"],
  },

  "integrasi-airene": {
    slug: "integrasi-airene",
    title: "Airene",
    heroTitle: "Asisten AI untuk agent CS (Jasmine di Motovax)",
    heroDesc:
      "Di Motovax, peran asisten CS dijalankan Jasmine dan workspace Call Center: draft bantuan, data stok/kredit, takeover, dan eskalasi — setara fungsi “AI copilot” untuk agent manusia.",
    status: "Live",
    module: "M2 + M3",
    demo: "omni",
    demoHash: "omniDemo",
    category: "AI & Chatbot",
    breadcrumbs: ["Produk", "Fitur", "AI Agent CS"],
    capabilities: [
      { title: "Copilot agent", desc: "AI menyiapkan jawaban & data saat agent menangani chat." },
      { title: "Takeover mulus", desc: "Dari full AI ke agent tanpa hilang riwayat." },
      { title: "Aksi cepat", desc: "Inventori & simulasi dari panel yang sama." },
    ],
    howItWorks: [
      { title: "AI jaga baseload", desc: "Jasmine jawab rutin." },
      { title: "Agent assist", desc: "Manusia dibantu konteks & tools." },
      { title: "Eskalasi", desc: "Kasus kompleks ke PIC spesialis." },
    ],
    benefits: ["Produktivitas agent naik", "Kualitas jawaban lebih konsisten", "Training lebih cepat"],
    related: ["chatbot", "aplikasi-customer-service", "agentic-ai"],
  },

  "agentic-ai": {
    slug: "agentic-ai",
    title: "Agentic AI",
    heroTitle: "Agen AI yang mengeksekusi pekerjaan bisnis",
    heroDesc:
      "Falcon (sales/internal) dan Jasmine (customer/CS) menjalankan tool untuk stok, media, finance, CRM ops, handoff, konten, knowledge, trade-in, dan MRP.",
    status: "Live",
    module: "M2 · Agentic AI",
    flag: "whatsapp_ai",
    badge: "New",
    demo: "falcon",
    demoHash: "falconDemo",
    category: "AI & Chatbot",
    breadcrumbs: ["Produk", "Fitur", "Agentic AI"],
    capabilities: [
      { title: "Native tools", desc: "Bukan wrapper chat generik — tool terhubung backend Motovax." },
      { title: "Multi-peran", desc: "Falcon & Jasmine dengan kebijakan berbeda." },
      { title: "Permission aware", desc: "Aksi sensitif mengikuti role/permission tenant." },
      { title: "Knowledge + web", desc: "Fetch URL / web search untuk jawaban berdasar sumber." },
    ],
    howItWorks: [
      { title: "Instruksi + tools", desc: "Agent dilengkapi schema & policy tenant." },
      { title: "Percakapan", desc: "User request → pilih tool → hasil ke chat." },
      { title: "Human-in-the-loop", desc: "Handoff saat perlu judgement manusia." },
    ],
    benefits: ["Otomasi sampai aksi selesai", "Data selalu dari sistem of record", "Siap multi-industri lewat tools"],
    related: ["whatsapp-business-api", "chatbot", "automasi-workflow", "aplikasi-omnichannel"],
  },

  "knowledge-base": {
    slug: "knowledge-base",
    title: "Knowledge Base",
    heroTitle: "Pengetahuan tenant untuk jawaban AI yang konsisten",
    heroDesc:
      "Motovax mendukung preferensi reply, guideline CRM, fetch URL/web search pada agent, serta konfigurasi AI tenant. Knowledge base tenant formal ada di roadmap P1 sebagai perluasan.",
    status: "Partial",
    module: "M2 + M4 guideline + roadmap KB",
    demo: "automation",
    demoHash: "capabilityDemo",
    category: "Automasi Operasional & Workflow",
    breadcrumbs: ["Produk", "Fitur", "Knowledge Base"],
    capabilities: [
      { title: "Guideline sales/CS", desc: "SOP membimbing AI dan tim." },
      { title: "Preferensi reply", desc: "Gaya & batasan balasan per tenant." },
      { title: "Fetch pengetahuan", desc: "Agent dapat menarik konten URL saat menjawab." },
    ],
    howItWorks: [
      { title: "Konfigurasi", desc: "Isi guideline & preferensi di settings." },
      { title: "Pakai di chat", desc: "AI merujuk aturan saat reply." },
      { title: "Perbaiki", desc: "Update policy tanpa ubah kode." },
    ],
    benefits: ["Jawaban lebih seragam", "Onboarding agent lebih cepat", "Kontrol brand voice"],
    related: ["agentic-ai", "automasi-workflow", "chatbot"],
  },

  "automasi-workflow": {
    slug: "automasi-workflow",
    title: "Workflow",
    heroTitle: "Otomasi alur kerja lintas chat, CRM, dan stok",
    heroDesc:
      "Motovax mengotomasi lewat agent tools, faneling, auto follow CRM, workers (foto, email report), dan integrasi. Workflow builder event-driven ada di roadmap P1.",
    status: "Live · partial builder",
    module: "M2–M5 + platform workers",
    demo: "automation",
    demoHash: "capabilityDemo",
    category: "Automasi Operasional & Workflow",
    breadcrumbs: ["Produk", "Fitur", "Workflow"],
    capabilities: [
      { title: "Auto follow CRM", desc: "Nudge lead stale otomatis." },
      { title: "Workers backend", desc: "Perawatan foto, laporan, job async." },
      { title: "Tool chains", desc: "AI merangkai beberapa aksi dalam satu percakapan." },
    ],
    howItWorks: [
      { title: "Trigger", desc: "Event chat, jadwal, atau status deal." },
      { title: "Aksi", desc: "Tool AI / worker / notifikasi." },
      { title: "Hasil", desc: "Update data & jejak di app." },
    ],
    benefits: ["Kurangi kerja repetitif", "Proses lebih konsisten", "Fondasi workflow builder"],
    related: ["knowledge-base", "agentic-ai", "manajemen-deal"],
  },

  "aplikasi-broadcast-whatsapp": {
    slug: "aplikasi-broadcast-whatsapp",
    title: "WhatsApp Broadcast",
    heroTitle: "Broadcast WhatsApp untuk promo & update stok",
    heroDesc:
      "Gabungan social automation, campaign, dan WhatsApp AI Motovax untuk menyebarkan penawaran unit secara massal namun tetap personal.",
    status: "Live · flag",
    module: "M5 + M2",
    demo: "social",
    demoHash: "socialDemo",
    category: "Manajemen Campaign",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Broadcast"],
    capabilities: [
      { title: "Promo unit", desc: "Broadcast menampilkan unit ready stock." },
      { title: "Kalender konten", desc: "Jadwalkan posting/campaign terkait." },
      { title: "Balasan terkelola", desc: "Reply masuk Call Center." },
    ],
    howItWorks: [
      { title: "Pilih campaign", desc: "Tentukan penawaran & audiens." },
      { title: "Broadcast", desc: "Kirim lewat channel WhatsApp." },
      { title: "Convert", desc: "AI/agent handle inbound." },
    ],
    benefits: ["Reach luas", "Tetap terhubung stok", "Closing di CRM"],
    related: ["wa-blast", "motovax-broadcast", "ctwa"],
  },

  "aplikasi-call-center": {
    slug: "aplikasi-call-center",
    title: "Call Center",
    heroTitle: "Call Center AI omnichannel untuk dealer modern",
    heroDesc:
      "Modul Call Center Motovax menyatukan inbox multi-channel, faneling, SSE realtime, aksi inventori dan kredit, serta pemantauan performa layanan pelanggan.",
    status: "Live",
    module: "M3 · AI Omnichannel & Call Center",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Call Center",
    breadcrumbs: ["Produk", "Fitur", "Call Center"],
    capabilities: [
      { title: "Omnichannel inbox", desc: "WA, FB, IG dalam satu antarmuka." },
      { title: "AI + manusia", desc: "Kolaborasi Jasmine dan agent." },
      { title: "Operasional dealer", desc: "Stok & kredit di ujung jari agent." },
    ],
    howItWorks: [
      { title: "Masuk antrian", desc: "Channel terhubung tenant." },
      { title: "Handle", desc: "AI/agent memproses." },
      { title: "Lanjut sales", desc: "Handoff MR / pipeline." },
    ],
    benefits: ["CS & sales satu platform", "Data live", "Skalabel multi-cabang"],
    related: ["aplikasi-omnichannel", "aplikasi-customer-service", "agentic-ai"],
  },

  "motovax-broadcast": {
    slug: "motovax-broadcast",
    title: "Motovax Broadcast",
    heroTitle: "Solusi broadcast untuk jangkauan massal terukur",
    heroDesc:
      "Paket solusi outbound Motovax: WhatsApp + social campaign + konten dari inventory, dengan balasan masuk ke omnichannel dan CRM.",
    status: "Live · suite",
    module: "M5 + M2 + M3",
    demo: "social",
    demoHash: "socialDemo",
    category: "Suite Motovax",
    breadcrumbs: ["Produk", "Suite Motovax", "Motovax Broadcast"],
    capabilities: [
      { title: "Outbound scale", desc: "Jangkau banyak prospek tanpa proses manual murni." },
      { title: "Konten stok", desc: "Pesan menempel unit nyata." },
      { title: "Inbound ready", desc: "Reply ditangani AI/Call Center." },
    ],
    howItWorks: [
      { title: "Rancang", desc: "Tentukan promo & segmen." },
      { title: "Siarkan", desc: "Broadcast + ads." },
      { title: "Konversi", desc: "CRM menuntaskan." },
    ],
    benefits: ["GTM lebih cepat", "Pesan konsisten", "Loop tertutup ke sales"],
    related: ["wa-blast", "ctwa", "motovax-360"],
  },

  "motovax-sales-suite": {
    slug: "motovax-sales-suite",
    title: "Motovax Sales Suite",
    heroTitle: "Solusi komprehensif untuk mempercepat penjualan",
    heroDesc:
      "Gabungan Inventory, Agentic WhatsApp, Autopilot CRM, dan Dashboard dalam satu alur lead hingga closing.",
    status: "Live · suite",
    module: "M1 + M2 + M4 + M6",
    demo: "crm",
    demoHash: "crmDemo",
    category: "Suite Motovax",
    breadcrumbs: ["Produk", "Suite Motovax", "Motovax Sales Suite"],
    capabilities: [
      { title: "Stok akurat", desc: "IMS multi-cabang sebagai fondasi penawaran." },
      { title: "AI sales", desc: "Falcon bantu kualifikasi & data." },
      { title: "Pipeline", desc: "CRM menuntun closing." },
      { title: "Analytics", desc: "Dashboard memantau target." },
    ],
    howItWorks: [
      { title: "Attract", desc: "Channel & ads." },
      { title: "Engage", desc: "AI + agent." },
      { title: "Close", desc: "CRM + inventory." },
    ],
    benefits: ["Satu journey sales", "Kurangi tools terpisah", "Data closing terpercaya"],
    related: ["aplikasi-crm", "whatsapp-business-api", "motovax-360"],
  },

  "motovax-service-suite": {
    slug: "motovax-service-suite",
    title: "Motovax Service Suite",
    heroTitle: "Solusi layanan pelanggan yang responsif",
    heroDesc:
      "Call Center omnichannel, AI Jasmine, handoff, dan metrik performa — paket service Motovax untuk pengalaman pelanggan yang cepat.",
    status: "Live · suite",
    module: "M2 + M3",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Suite Motovax",
    breadcrumbs: ["Produk", "Suite Motovax", "Motovax Service Suite"],
    capabilities: [
      { title: "Omnichannel CS", desc: "Semua chat di satu tempat." },
      { title: "AI 24/7", desc: "Baseload dijawab otomatis." },
      { title: "Human excellence", desc: "Agent tools untuk kasus rumit." },
    ],
    howItWorks: [
      { title: "Terima", desc: "Multi-channel masuk." },
      { title: "Selesaikan", desc: "AI/agent + data." },
      { title: "Ukur", desc: "Scorecard & SLA." },
    ],
    benefits: ["CS scalable", "Kepuasan naik", "Terhubung sales saat opportunity"],
    related: ["aplikasi-call-center", "aplikasi-customer-service", "agentic-ai"],
  },

  "motovax-360": {
    slug: "motovax-360",
    title: "Motovax 360",
    heroTitle: "Platform terintegrasi end-to-end untuk dealer",
    heroDesc:
      "Inventory + AI WhatsApp + Omnichannel + CRM + Social + Dashboard + Platform multi-tenant. Motovax 360 adalah cara memandang seluruh modul produksi sebagai satu sistem.",
    status: "Live · suite",
    module: "M1–M8",
    category: "Suite Motovax",
    breadcrumbs: ["Produk", "Suite Motovax", "Motovax 360"],
    capabilities: [
      { title: "Satu data", desc: "Unit, lead, chat, campaign saling terkait." },
      { title: "Satu journey", desc: "Dari awareness sampai aftersales light." },
      { title: "Multi-tenant SaaS", desc: "IAM, config, API, workers." },
      { title: "Siap multi-industri", desc: "Generalisasi lewat tools & config." },
    ],
    howItWorks: [
      { title: "Aktifkan modul", desc: "Sesuai feature flag tenant." },
      { title: "Integrasikan channel", desc: "WhatsApp & Meta." },
      { title: "Operasikan", desc: "Tim sales/CS di satu app." },
    ],
    benefits: ["Tidak ada silo tools", "ROI platform lebih jelas", "Skalakan cabang & brand"],
    related: ["motovax-sales-suite", "motovax-service-suite", "motovax-broadcast", "aplikasi-omnichannel"],
  },
};

// alias for menu title consistency
window.MOTOVAX_FEATURES["custom-crm-report"] = window.MOTOVAX_FEATURES["personalisasi-report-sales"];
window.MOTOVAX_FEATURES["manajemen-pipeline"] = window.MOTOVAX_FEATURES["manajemen-deal"];
