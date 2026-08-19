/**
 * Katalog fitur landing motovax.ai — referensi utama: motovax.app / motovax-app
 * (route, sidebar, call center, CRM, WhatsApp agent tools, social, dashboard).
 * Struktur & slug menu selaras pola qontak.com/fitur/* agar UX akrab.
 */
window.MOTOVAX_FEATURES = {
  "aplikasi-omnichannel": {
    slug: "aplikasi-omnichannel",
    title: "Call Center AI Omnichannel",
    heroTitle: "Satu workspace untuk seluruh channel dan tim layanan pelanggan",
    heroDesc:
      "Satukan WhatsApp, Instagram DM, Facebook Messenger, AI, dan agent manusia dalam Call Center Motovax. Kelola antrean, takeover, handoff ke MR, aksi inventori dan kredit, serta performa layanan dari satu workspace.",
    status: "Live",
    module: "M3 · AI Omnichannel & Call Center",
    flag: "whatsapp_ai",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Aplikasi Omnichannel",
    breadcrumbs: ["Produk", "Fitur", "Call Center AI Omnichannel"],
    capabilities: [
      {
        title: "Inbox multi-channel",
        desc: "Kelola percakapan WhatsApp, Facebook, dan Instagram dalam satu workspace Call Center. Pesan dan perubahan status langsung diperbarui tanpa perlu refresh.",
      },
      {
        title: "Antrean & workspace agent",
        desc: "Pisahkan percakapan yang ditangani AI, Call Center, dan Marketing Representative agar kepemilikan setiap lead selalu jelas.",
      },
      {
        title: "Faneling AI · Agent · MR",
        desc: "Chat masuk ditangani AI, dapat diambil alih Agent tanpa kehilangan konteks, lalu di-handoff ke Marketing Representative untuk follow-up dan closing.",
      },
      {
        title: "Notifikasi & status realtime",
        desc: "Pesan baru, status percakapan, dan aktivitas agent langsung muncul di workspace agar pelanggan dapat ditangani lebih cepat.",
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
        desc: "Pantau hasil channel, aktivitas agent, dan performa CRM yang terhubung ke journey lead di Motovax.",
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
      "Antrean dan kepemilikan lead lebih mudah diawasi",
    ],
    related: ["instagram-api", "sistem-manajemen-tiket", "agentic-ai", "manajemen-sla"],
  },

  "facebook-messenger": {
    slug: "facebook-messenger",
    title: "Facebook Messenger",
    heroTitle: "Layani lead Facebook langsung dari satu workspace",
    heroDesc:
      "Hubungkan Facebook Messenger ke Call Center Motovax agar inquiry dari Facebook ditangani realtime oleh AI dan agent, tetap membawa konteks lead, lalu diteruskan ke MR tanpa berpindah aplikasi.",
    status: "Live",
    module: "M3 · Omnichannel + integrasi Meta",
    flag: "whatsapp_ai",
    demo: "omni",
    demoHash: "omniDemo",
    category: "Aplikasi Omnichannel",
    breadcrumbs: ["Produk", "Fitur", "Facebook Messenger"],
    capabilities: [
      {
        title: "Inbox Messenger terpusat",
        desc: "Filter Facebook menampilkan percakapan Messenger dalam workspace Call Center yang sama, tanpa mencampurkan fokus agent dengan channel lain.",
      },
      {
        title: "Respons AI dan takeover agent",
        desc: "AI menangani respons awal, lalu agent dapat mengambil alih percakapan dengan konteks chat dan kebutuhan customer tetap tersimpan.",
      },
      {
        title: "Routing lead ke MR",
        desc: "Lead Messenger dapat di-handoff ke Marketing Representative lengkap dengan status, alasan, dan catatan tindak lanjut.",
      },
      {
        title: "Konteks stok dan simulasi kredit",
        desc: "Agent dapat mengecek inventori, menjalankan simulasi kredit, dan bertanya ke AI langsung dari percakapan Messenger.",
      },
      {
        title: "Update percakapan realtime",
        desc: "Pesan dan perubahan status hadir langsung di inbox melalui koneksi realtime agar respons tim lebih cepat.",
      },
      {
        title: "Journey lead terukur",
        desc: "Aktivitas dari Messenger tetap terhubung ke status lead, pipeline, dan performa omnichannel Motovax.",
      },
    ],
    howItWorks: [
      { title: "Hubungkan akun Meta", desc: "Aktifkan Facebook Messenger dari pengaturan integrasi tenant Motovax." },
      { title: "Inquiry masuk", desc: "Pesan Facebook tampil di filter Messenger pada inbox Call Center." },
      { title: "AI atau agent merespons", desc: "AI memberi respons awal dan agent mengambil alih saat dibutuhkan." },
      { title: "Lanjutkan ke sales", desc: "Handoff lead ke MR atau lanjutkan tindak lanjut melalui pipeline CRM." },
    ],
    benefits: [
      "Inquiry Facebook tidak tercecer di akun atau perangkat personal",
      "Respons awal lebih cepat dengan AI dan update realtime",
      "Takeover manusia tanpa kehilangan konteks percakapan",
      "Lead Messenger tersambung ke MR, CRM, dan performa channel",
    ],
    related: ["aplikasi-omnichannel", "instagram-api", "agentic-ai", "aplikasi-crm"],
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
    title: "Manajemen Tiket Terintegrasi",
    heroTitle: "Ubah percakapan menjadi penanganan yang terukur",
    heroDesc:
      "Buat penanganan dari chat, pantau status, eskalasikan ke PIC, dan lanjutkan follow-up melalui CRM tanpa kehilangan konteks pelanggan.",
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
    related: ["manajemen-sla", "aplikasi-omnichannel", "agent-scorecard"],
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
    title: "Agentic & Conversational AI",
    heroTitle: "Percakapan AI yang dapat mengeksekusi pekerjaan bisnis",
    heroDesc:
      "Falcon (sales/internal) dan Jasmine (customer/CS) memahami percakapan lalu menjalankan tool untuk stok, media, finance, CRM, handoff, konten, knowledge, trade-in, dan MRP.",
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
    benefits: ["Otomasi sampai aksi selesai", "Data selalu dari sistem dealer", "Tool AI memahami stok dan alur dealer"],
    related: ["whatsapp-business-api", "integrasi-airene", "automasi-workflow", "aplikasi-omnichannel"],
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
    title: "Automasi Workflow",
    heroTitle: "Automasi yang bekerja sampai tugas selesai",
    heroDesc:
      "Motovax menghubungkan percakapan, CRM, inventori, laporan, dan publishing lewat agent AI, scheduler, serta worker. Tim tetap memegang kendali saat keputusan manusia dibutuhkan; builder visual no-code masih dalam roadmap.",
    status: "Live",
    module: "M2–M5 + platform scheduler & workers",
    demo: "automation",
    demoHash: "capabilityDemo",
    category: "Automasi Operasional & Workflow",
    breadcrumbs: ["Produk", "Fitur", "Automasi Workflow"],
    capabilities: [
      {
        title: "Agent AI yang mengeksekusi aksi",
        desc: "Falcon dan Jasmine tidak berhenti pada jawaban. Agent dapat mencari stok, mengirim foto, menghitung simulasi kredit, memperbarui lead, dan menjalankan tool bisnis sesuai konteks serta permission.",
      },
      {
        title: "Follow-up yang berjalan otomatis",
        desc: "Lead yang perlu ditindaklanjuti dapat masuk ke jadwal follow-up AI, sementara status aktif, overdue, dan interaksi terakhir membantu tim memusatkan perhatian pada peluang yang tepat.",
      },
      {
        title: "Routing AI ke tim yang tepat",
        desc: "Percakapan dapat berpindah dari AI ke Call Center lalu ke Marketing Representative dengan konteks, status, dan jejak handoff yang tetap tersimpan.",
      },
      {
        title: "Laporan terjadwal tanpa rekap manual",
        desc: "Jadwalkan email report beserta penerima dan attachment. Log pengiriman memberi visibilitas atas laporan yang diproses scheduler.",
      },
      {
        title: "Publishing konten yang terjadwal",
        desc: "Tim marketing dapat menyiapkan materi dari inventori, menyusun kalender posting, dan menjalankan publishing terjadwal tanpa memutus alur dari sumber data produk.",
      },
    ],
    howItWorks: [
      { title: "Sinyal masuk", desc: "Percakapan, jadwal, status lead, atau aktivitas operasional memulai alur." },
      { title: "Konteks diperiksa", desc: "Agent dan layanan Motovax membaca data tenant, role, serta kondisi terbaru." },
      { title: "Aksi dijalankan", desc: "Tool AI, scheduler, atau worker mengeksekusi tugas yang sesuai." },
      { title: "Hasil tercatat", desc: "Data diperbarui dan pekerjaan diteruskan ke manusia saat judgement dibutuhkan." },
    ],
    benefits: [
      "Pekerjaan rutin bergerak tanpa menunggu proses manual",
      "AI bekerja dengan data operasional yang sama",
      "Handoff tetap jelas dan dapat ditindaklanjuti",
      "Jadwal dan hasil kerja lebih konsisten",
    ],
    related: ["knowledge-base", "agentic-ai", "manajemen-deal"],
  },

  "aplikasi-broadcast-whatsapp": {
    slug: "aplikasi-broadcast-whatsapp",
    title: "WhatsApp Broadcast",
    heroTitle: "Campaign WhatsApp massal yang tetap relevan dan terukur",
    heroDesc:
      "Gabungkan broadcast, bulk messaging, segmentasi audiens, konten inventory, dan penanganan balasan dalam satu alur campaign WhatsApp Motovax.",
    status: "Live · flag",
    module: "M5 + M2",
    demo: "social",
    demoHash: "socialDemo",
    category: "Manajemen Campaign",
    breadcrumbs: ["Produk", "Fitur", "WhatsApp Broadcast"],
    capabilities: [
      { title: "Audiens tersegmentasi", desc: "Kirim pesan massal ke kelompok kontak yang relevan, bukan daftar acak tanpa konteks." },
      { title: "Konten dari stok", desc: "Gunakan unit ready dan konteks cabang untuk membuat penawaran lebih relevan." },
      { title: "Campaign terukur", desc: "Susun pesan, jalankan campaign, dan hubungkan respons ke journey lead." },
      { title: "Balasan terkelola", desc: "Reply masuk ke Call Center AI Omnichannel untuk ditangani AI atau agent." },
    ],
    howItWorks: [
      { title: "Pilih campaign", desc: "Tentukan penawaran & audiens." },
      { title: "Broadcast", desc: "Kirim lewat channel WhatsApp." },
      { title: "Convert", desc: "AI/agent handle inbound." },
    ],
    benefits: ["Jangkauan luas tanpa copas manual", "Pesan tetap terhubung stok", "Balasan langsung masuk funnel CRM"],
    related: ["motovax-broadcast", "ctwa", "manajemen-kontak"],
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

  "core-platform-agentic-ai": {
    slug: "core-platform-agentic-ai",
    title: "Core Platform Agentic AI",
    heroTitle: "Fondasi terintegrasi untuk seluruh modul dan agen AI Motovax",
    heroDesc: "Core Platform menyediakan tenant terisolasi, role dan permission, konfigurasi cabang, integrasi channel, dashboard, serta fondasi agentic AI yang dipakai seluruh modul Motovax.",
    status: "Live",
    module: "Core Platform",
    category: "Platform",
    demo: "whatsapp",
    demoHash: "capabilityDemo",
    breadcrumbs: ["Produk", "Core Platform", "Agentic AI"],
    capabilities: [
      { title: "Multi-tenant dan multi-cabang", desc: "Data, konfigurasi, branding, cabang, dan fitur dipisahkan per organisasi." },
      { title: "Role dan permission", desc: "Akses halaman serta aksi mengikuti role pengguna dan kebijakan tenant." },
      { title: "Integrasi channel bisnis", desc: "Hubungkan WhatsApp, Meta Business, email report, dan Developer API dari satu platform." },
      { title: "Agentic AI dengan native tools", desc: "Agen AI menjalankan tool stok, kredit, CRM, handoff, konten, dan operasi sesuai izin." },
    ],
    howItWorks: [
      { title: "Siapkan tenant", desc: "Konfigurasi organisasi, cabang, role, branding, dan modul aktif." },
      { title: "Hubungkan integrasi", desc: "Aktifkan channel dan koneksi yang dibutuhkan operasional." },
      { title: "Operasikan modul", desc: "Tim bekerja di workspace yang sesuai role dengan data yang saling terhubung." },
    ],
    benefits: ["Satu fondasi untuk seluruh modul", "Kontrol akses yang konsisten", "Konfigurasi per tenant dan cabang", "AI menjalankan aksi bisnis nyata"],
    related: ["aplikasi-crm", "omni-jasmine-ai", "inventory-falcon-ai", "ana-ai-analytics"],
  },

  "omni-jasmine-ai": {
    slug: "omni-jasmine-ai",
    title: "Jasmine AI + Omnichannel",
    heroTitle: "Satukan channel pelanggan dengan AI dan agent manusia",
    heroDesc: "Jasmine AI + Omnichannel menyatukan WhatsApp, Instagram DM, dan Facebook Messenger di Call Center Motovax dengan respons AI, aksi cepat, funneling, takeover agent, serta handoff ke Marketing Representative.",
    status: "Live",
    module: "Jasmine AI + Omnichannel",
    flag: "whatsapp_ai",
    category: "Aplikasi Omnichannel",
    demo: "omni",
    demoHash: "omniDemo",
    breadcrumbs: ["Produk", "Modul", "Jasmine AI + Omnichannel"],
    sectionTitle: "Jasmine merespons pelanggan, tools omnichannel menjaga alurnya",
    showcaseTitle: "Kecanggihan Jasmine dulu, baru tools yang dipakai tim",
    showcaseDesc: "Jasmine membaca konteks percakapan dan menjalankan aksi bisnis dari inbox. Setelah itu baru funneling, takeover, dan analytics yang dipakai Call Center serta MR.",
    processTitle: "Dari pesan masuk hingga handoff dengan konteks utuh",
    capabilities: [
      {
        title: "Jasmine AI memahami dan bertindak",
        desc: "Jasmine membaca konteks percakapan dan tenant dealer, menyusun respons yang relevan, lalu menjalankan tool bisnis seperti cek stok, kirim foto unit, atau simulasi kredit sebelum alur diserahkan ke agent manusia.",
      },
      { title: "Inbox multi-channel", desc: "WhatsApp, Facebook Messenger, dan Instagram DM hadir di satu workspace." },
      { title: "Funneling dan auto routing", desc: "Lead bergerak melalui bucket AI, Call Center, dan MR dengan kepemilikan yang jelas." },
      {
        title: "Aksi cepat inventori dan kredit",
        desc: "Dari Aksi Cepat di percakapan Call Center, agent bisa cek inventori unit ready dan cek simulasi kredit tanpa meninggalkan inbox.",
        points: [
          "Cek inventori — Cari unit ready, harga, cabang, dan foto stok live dealer langsung dari percakapan.",
          "Cek simulasi kredit — Hitung DP, tenor, dan angsuran dari Aksi Cepat, lalu bagikan ke pelanggan.",
        ],
      },
      { title: "Analytics omnichannel", desc: "Pantau journey lead, channel, respons, dan hasil penanganan tim." },
    ],
    howItWorks: [
      { title: "Pesan masuk", desc: "Percakapan dari channel aktif masuk ke inbox realtime." },
      { title: "Jasmine merespons", desc: "AI menggunakan konteks tenant dan tool bisnis untuk membantu pelanggan." },
      { title: "Agent mengambil alih", desc: "Call Center takeover, menjalankan aksi cepat, atau melakukan eskalasi." },
      { title: "Handoff ke MR", desc: "Lead diteruskan dengan konteks dan riwayat lengkap untuk closing." },
    ],
    benefits: ["Channel pelanggan tidak tercecer", "Respons awal lebih cepat", "Handoff tanpa kehilangan konteks", "Kinerja channel dapat diukur"],
    related: ["aplikasi-omnichannel", "facebook-messenger", "instagram-api", "aplikasi-crm"],
  },

  "inventory-falcon-ai": {
    slug: "inventory-falcon-ai",
    title: "Falcon AI + Inventory",
    heroTitle: "Falcon mencari dan merekomendasikan unit dari stok live dealer",
    heroDesc:
      "Falcon AI mencari unit, mengirim foto, merekomendasikan alternatif, dan menyusun laporan dari stok live dealer. Listing multi-cabang, import, dan katalog API menjaga data yang dibaca AI tetap akurat.",
    status: "Live",
    module: "Falcon AI + Inventory",
    flag: "inventory_management",
    category: "Inventory Management",
    demo: "falcon",
    demoHash: "contoh-alur",
    demoLabel: "Lihat Falcon di lapangan",
    breadcrumbs: ["Produk", "Modul", "Falcon AI + Inventory"],
    sectionTitle: "Falcon mengerjakan stok live, tools inventory menjaga datanya",
    showcaseTitle: "Falcon mencari unit, mengirim foto, dan menyusun laporan dari stok live",
    showcaseDesc: "Sales atau management menuliskan kebutuhan unit di percakapan. Falcon memahami permintaan, menjalankan tool inventory, lalu mengirim unit ready, foto, alternatif, atau laporan sesuai peran. Listing multi-cabang, import, dan katalog API menjaga data yang dibaca AI tetap akurat.",
    processTitle: "Dari permintaan stok hingga data yang sama di seluruh tim",
    capabilities: [
      {
        title: "Falcon memahami permintaan stok",
        desc: "Sales atau management mengetik kebutuhan unit — model, tahun, cabang, kilometer, harga, atau status. Falcon menjalankan tool inventory tenant dan mengembalikan unit ready yang benar-benar ada.",
      },
      {
        title: "Foto, unit serupa, dan alternatif otomatis",
        desc: "Falcon mengirim foto unit, menawarkan unit serupa, dan merancang alternatif jika stok yang diminta tidak tersedia — tanpa membuka folder atau spreadsheet.",
      },
      {
        title: "Laporan dan aksi sesuai peran",
        desc: "Sales mendapat pencarian, foto, simulasi, dan pencatatan lead. Management dapat laporan stok per cabang, aging, import Excel atau Google Sheets, dan perubahan status lewat percakapan yang sama.",
      },
      {
        title: "Listing dan stok multi-cabang",
        desc: "Kelola unit, status, pricing, foto, dokumen, dan lokasi cabang sebagai sumber kebenaran yang dibaca Falcon.",
      },
      {
        title: "Import, validasi, dan live katalog API",
        desc: "Import Excel atau Google Sheets — termasuk lewat WhatsApp — dengan deteksi warning dan konflik identitas. Endpoint katalog menyajikan stok aktif ke aplikasi eksternal.",
      },
    ],
    howItWorks: [
      { title: "Minta ke Falcon", desc: "Sales atau management menuliskan kebutuhan stok, foto, atau laporan di percakapan." },
      { title: "Falcon menjalankan tool", desc: "AI memilih query, foto, rekomendasi, atau laporan dari inventory tenant sesuai peran." },
      { title: "Hasil sampai di chat", desc: "Unit, foto, alternatif, atau ringkasan stok dikirim tanpa pindah aplikasi." },
      { title: "IMS menjaga data akurat", desc: "Listing, import, status, dan API memastikan Falcon selalu membaca stok live dealer." },
    ],
    benefits: [
      "Cari stok lewat percakapan, bukan filter tabel",
      "Foto dan rekomendasi langsung dari unit ready",
      "Sales dan management mendapat tool sesuai peran",
      "Listing multi-cabang jadi sumber kebenaran AI",
    ],
    related: ["agentic-ai", "aplikasi-crm", "ana-ai-analytics", "social-media-sora-ai"],
  },

  "ana-ai-analytics": {
    slug: "ana-ai-analytics",
    title: "Ana AI — Advanced Analytics",
    heroTitle: "Ubah data operasional, finansial, dan sales menjadi keputusan",
    heroDesc: "Ana AI Analytics menyatukan dashboard operasional, laporan finansial, performa sales, omnichannel, cabang, stok, aging, revenue, HPP, dan gross profit dalam tampilan sesuai peran.",
    status: "Live",
    module: "Ana AI — Advanced Analytics",
    category: "Analytics",
    demo: "dashboard",
    demoHash: "dashboardDemo",
    breadcrumbs: ["Produk", "Modul", "Ana AI Analytics"],
    capabilities: [
      { title: "Analitik operasional", desc: "Pantau stok lama, rata-rata hari jual, unit terjual, omzet, dan konversi lead ke booking." },
      { title: "Analitik finansial", desc: "Lihat revenue, HPP, gross profit, margin, tren laba, dan nilai stok." },
      { title: "Sales performance", desc: "Bandingkan pipeline, closing, produktivitas salesperson, dan performa tim." },
      { title: "Performa cabang dan channel", desc: "Analisis hasil per cabang, sumber lead, dan channel omnichannel." },
    ],
    howItWorks: [
      { title: "Data modul terhubung", desc: "Inventory, CRM, sales, dan omnichannel menjadi sumber metrik." },
      { title: "Pilih peran dan periode", desc: "Dashboard menyesuaikan KPI serta rentang MTD, QTD, YTD, atau harian." },
      { title: "Baca tren dan rincian", desc: "Tim menelusuri KPI hingga cabang, sales, channel, atau unit terkait." },
    ],
    benefits: ["KPI utama dalam satu dashboard", "Keputusan berbasis data aktual", "Perbandingan lintas cabang", "Visibilitas revenue dan margin"],
    related: ["inventory-falcon-ai", "aplikasi-crm", "omni-jasmine-ai", "motovax-360"],
  },

  "social-media-sora-ai": {
    slug: "social-media-sora-ai",
    title: "Sora AI + Social Media",
    heroTitle: "Buat, jadwalkan, publikasikan, dan ukur konten dari satu studio",
    heroDesc: "Sora AI + Social Media menghubungkan inventory dengan content studio, pengolahan visual AI, caption, kalender posting, publikasi Facebook dan Instagram melalui Meta Business, WhatsApp content, serta ads campaign analytics.",
    status: "Live · flag",
    module: "Sora AI + Social Media",
    flag: "social_media_automation",
    category: "Manajemen Campaign",
    demo: "social",
    demoHash: "socialDemo",
    breadcrumbs: ["Produk", "Modul", "Sora AI + Social Media"],
    sectionTitle: "Sora mengolah konten, tools studio menjaga publikasinya",
    showcaseTitle: "Kecanggihan Sora dulu, baru tools yang dipakai tim",
    showcaseDesc: "Sora meningkatkan visual dan membantu caption dari data stok. Setelah itu baru studio, scheduler, publish, dan ads yang dipakai marketing.",
    processTitle: "Dari unit ready hingga kampanye yang terukur",
    capabilities: [
      { title: "Content studio dari inventory", desc: "Pilih unit ready sebagai sumber desain, harga, atribut, dan materi kampanye." },
      { title: "Pengolahan visual dengan AI", desc: "Buat variasi materi, tingkatkan kualitas gambar, dan sesuaikan background untuk kebutuhan konten." },
      { title: "Publish dan scheduler", desc: "Siapkan lalu publikasikan atau jadwalkan feed, reel, dan story melalui Meta Business sesuai capability aktif." },
      { title: "WhatsApp content dan broadcast", desc: "Gunakan materi promosi untuk posting WhatsApp dan campaign pelanggan." },
      { title: "Ads campaign analytics", desc: "Pantau campaign, klik, lead, UTM, ranking produk, dan hasil masuk ke pipeline." },
    ],
    howItWorks: [
      { title: "Pilih unit atau materi", desc: "Content studio mengambil data dan foto dari inventory tenant." },
      { title: "Susun creative", desc: "Tim mengedit desain, gambar, platform, dan caption." },
      { title: "Jadwalkan atau publikasikan", desc: "Konten dikirim melalui integrasi channel yang sudah terhubung." },
      { title: "Ukur hasil", desc: "Campaign insight menghubungkan performa konten dengan lead dan pipeline." },
    ],
    benefits: ["Produksi konten lebih cepat", "Materi konsisten dengan stok", "Jadwal tim lebih teratur", "Hasil campaign terhubung ke lead"],
    related: ["inventory-falcon-ai", "aplikasi-broadcast-whatsapp", "aplikasi-crm", "ana-ai-analytics"],
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
      { title: "Siap multi-cabang", desc: "Data, role, dan dashboard dealer dipisahkan per cabang." },
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

// URL lama tetap dipetakan ke halaman kanonik agar related link dan deep link
// tidak menghasilkan konten duplikat.
window.MOTOVAX_FEATURES["aplikasi-call-center"] = window.MOTOVAX_FEATURES["aplikasi-omnichannel"];
window.MOTOVAX_FEATURES["aplikasi-customer-service"] = window.MOTOVAX_FEATURES["aplikasi-omnichannel"];
window.MOTOVAX_FEATURES["ticket-creation-integration"] = window.MOTOVAX_FEATURES["sistem-manajemen-tiket"];
window.MOTOVAX_FEATURES["wa-blast"] = window.MOTOVAX_FEATURES["aplikasi-broadcast-whatsapp"];
window.MOTOVAX_FEATURES["whatsapp-bulk"] = window.MOTOVAX_FEATURES["aplikasi-broadcast-whatsapp"];
window.MOTOVAX_FEATURES["chatbot"] = window.MOTOVAX_FEATURES["agentic-ai"];
