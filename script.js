const whatsappUrl =
  "https://wa.me/6281999197186?text=Halo%20MOTOVAX%2C%20saya%20ingin%20jadwalkan%20demo.";

for (const el of document.querySelectorAll("[data-year]")) {
  el.textContent = String(new Date().getFullYear());
}

for (const link of document.querySelectorAll("[data-wa]")) {
  if (link instanceof HTMLAnchorElement) {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  }
}

class PublicDemoDataBridge {
  constructor() {
    this.baseUrl = "https://mobix.motovax.com/api/public/demo/motovax-ai";
    this.snapshotPromise = null;
    this.sessionId = localStorage.getItem("motovax_demo_session_id");
    if (!this.sessionId) {
      this.sessionId = crypto.randomUUID();
      localStorage.setItem("motovax_demo_session_id", this.sessionId);
    }
  }

  async snapshot(force = false) {
    if (!this.snapshotPromise || force) {
      this.snapshotPromise = fetch(`${this.baseUrl}/snapshot`, {
        headers: { Accept: "application/json" },
      }).then(async (response) => {
        if (!response.ok) throw new Error("Data tenant demo belum dapat dimuat.");
        return response.json();
      }).then((snapshot) => {
        this.updateConnectionStatus(snapshot.tenant);
        return snapshot;
      }).catch((error) => {
        this.updateConnectionStatus(null, error);
        throw error;
      });
    }
    return this.snapshotPromise;
  }

  updateConnectionStatus(tenant, error = null) {
    const tenantName = String(tenant?.name || "Tenant demo").trim();
    const writesActive = Boolean(tenant?.writes_active);

    for (const status of document.querySelectorAll("[data-demo-tenant-status]")) {
      const dataOnly = status.hasAttribute("data-demo-data-only");
      const label = error
        ? "Tenant demo tidak terhubung"
        : dataOnly
          ? "Tenant Demo · Data live"
          : writesActive
            ? "Tenant Demo · Input tersimpan"
            : "Tenant Demo · Mode baca";
      status.classList.toggle("is-error", Boolean(error));
      status.classList.toggle("is-readonly", !error && !writesActive);
      const text = status.querySelector("[data-demo-tenant-label]");
      if (text) text.textContent = label;
      status.title = error
        ? error.message
        : `Terhubung ke ${tenantName}; terisolasi dari tenant customer lain.`;
    }
  }

  async submit(kind, payload = {}) {
    const response = await fetch(`${this.baseUrl}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        request_id: crypto.randomUUID(),
        session_id: this.sessionId,
        kind,
        ...payload,
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || "Aksi belum dapat disimpan ke tenant demo.");
    }
    this.snapshotPromise = null;
    return response.json();
  }
}

const publicDemoData = new PublicDemoDataBridge();

const inventoryDemoSeed = [
  {
    id: "unit-001",
    brand: "Nissan",
    type: "Serena HWS AT",
    plate: "B 1201 MVX",
    year: 2023,
    color: "Putih Hitam",
    transmission: "Automatic",
    odometer: 70978,
    branch: "CINERE",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 304000000,
    cashPrice: 350000000,
    creditPrice: 358000000,
    aging: 110,
    source: "Rental Up · PT BAS",
    photos: 18,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "2.0 L",
    seats: 7,
    features: ["Power Sliding Door", "Around View Monitor", "Captain Seat", "Keyless Entry"],
  },
  {
    id: "unit-002",
    brand: "Toyota",
    type: "Rush G AT",
    plate: "B 1202 MVX",
    year: 2022,
    color: "Silver",
    transmission: "Automatic",
    odometer: 56660,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "BOOKED",
    buyingPrice: 165000000,
    cashPrice: 190000000,
    creditPrice: 197000000,
    aging: 60,
    source: "Referensi · Rental",
    photos: 14,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["ABS + EBD", "Dual Airbag", "Rear Camera", "Roof Rail"],
  },
  {
    id: "unit-003",
    brand: "Toyota",
    type: "Rush 1.5 S TRD AT",
    plate: "B 1203 MVX",
    year: 2019,
    color: "Putih",
    transmission: "Automatic",
    odometer: 48684,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 170000000,
    cashPrice: 197000000,
    creditPrice: 203000000,
    aging: 48,
    source: "Trade In · Mitsubishi",
    photos: 22,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["TRD Bodykit", "Touchscreen Audio", "Rear Parking Sensor", "Daytime Running Light"],
  },
  {
    id: "unit-004",
    brand: "Honda",
    type: "HR-V S CVT",
    plate: "B 1204 MVX",
    year: 2016,
    color: "Abu-abu Metalik",
    transmission: "Automatic",
    odometer: 80359,
    branch: "PONDOK BAMBU",
    position: "Bintaro",
    status: "BOOKED",
    buyingPrice: 131000000,
    cashPrice: 153000000,
    creditPrice: 158000000,
    aging: 40,
    source: "Referensi · Sales",
    photos: 12,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 5,
    features: ["Magic Seat", "ECON Mode", "Cruise Control", "Side Camera"],
  },
  {
    id: "unit-005",
    brand: "Honda",
    type: "Mobilio E CVT",
    plate: "B 1205 MVX",
    year: 2019,
    color: "Abu-abu Metalik",
    transmission: "Automatic",
    odometer: 80503,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 132000000,
    cashPrice: 150000000,
    creditPrice: 155000000,
    aging: 34,
    source: "Referensi · Sales",
    photos: 16,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Ultra Seat", "Double Blower", "ABS", "ISOFIX"],
  },
  {
    id: "unit-006",
    brand: "Mitsubishi",
    type: "Xpander Ultimate",
    plate: "B 1206 MVX",
    year: 2021,
    color: "Quartz White",
    transmission: "Automatic",
    odometer: 42380,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 208000000,
    cashPrice: 239000000,
    creditPrice: 247000000,
    aging: 21,
    source: "Trade In",
    photos: 20,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Head Unit 9\"", "Keyless Push Start", "Cruise Control", "Rear Camera"],
  },
  {
    id: "unit-007",
    brand: "Suzuki",
    type: "Ertiga GX Hybrid",
    plate: "B 1207 MVX",
    year: 2023,
    color: "Cool Black",
    transmission: "Automatic",
    odometer: 18540,
    branch: "BEKASI",
    position: "Showroom Bekasi",
    status: "UNIT READY",
    buyingPrice: 214000000,
    cashPrice: 243000000,
    creditPrice: 251000000,
    aging: 12,
    source: "Lelang Partner",
    photos: 24,
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "1.5 L Hybrid",
    seats: 7,
    features: ["SHVS Hybrid", "ESP", "Hill Hold", "Smart Key"],
  },
  {
    id: "unit-008",
    brand: "Toyota",
    type: "Avanza G CVT",
    plate: "B 1208 MVX",
    year: 2022,
    color: "Black Metallic",
    transmission: "Automatic",
    odometer: 31902,
    branch: "CINERE",
    position: "Showroom Cinere",
    status: "SOLD",
    buyingPrice: 198000000,
    cashPrice: 229000000,
    creditPrice: 236000000,
    aging: 27,
    source: "Trade In",
    photos: 19,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["DNGA Platform", "VSC", "Rear Camera", "Digital AC"],
  },
  {
    id: "unit-009",
    brand: "Daihatsu",
    type: "Rocky 1.2 X CVT",
    plate: "B 1209 MVX",
    year: 2022,
    color: "Compagno Red",
    transmission: "Automatic",
    odometer: 28750,
    branch: "BEKASI",
    position: "Warehouse Bekasi",
    status: "SOLD",
    buyingPrice: 165000000,
    cashPrice: 189000000,
    creditPrice: 196000000,
    aging: 31,
    source: "Fleet Partner",
    photos: 15,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.2 L",
    seats: 5,
    features: ["DNGA", "LED Headlamp", "Keyless", "Rear Camera"],
  },
  {
    id: "unit-010",
    brand: "Honda",
    type: "BR-V Prestige CVT",
    plate: "B 1210 MVX",
    year: 2021,
    color: "Lunar Silver",
    transmission: "Automatic",
    odometer: 35420,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 221000000,
    cashPrice: 255000000,
    creditPrice: 264000000,
    aging: 16,
    source: "Customer Direct",
    photos: 21,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Honda Sensing", "LaneWatch", "7 Seater", "Smart Key"],
  },
  {
    id: "unit-011",
    brand: "Toyota",
    type: "Innova Zenix Hybrid Q",
    plate: "B 1211 MVX",
    year: 2023,
    color: "Platinum White Pearl",
    transmission: "Automatic",
    odometer: 12450,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 410000000,
    cashPrice: 468000000,
    creditPrice: 482000000,
    aging: 9,
    source: "Customer Direct",
    photos: 28,
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "2.0 L Hybrid",
    seats: 7,
    features: ["TNGA Hybrid", "Panoramic Roof", "Captain Seat", "TSS Safety"],
  },
  {
    id: "unit-012",
    brand: "Toyota",
    type: "Raize GR Sport 1.0T",
    plate: "B 1212 MVX",
    year: 2022,
    color: "Turquoise Mica Metallic",
    transmission: "Automatic",
    odometer: 22100,
    branch: "CINERE",
    position: "Showroom Cinere",
    status: "UNIT READY",
    buyingPrice: 198000000,
    cashPrice: 228000000,
    creditPrice: 235000000,
    aging: 18,
    source: "Trade In",
    photos: 17,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.0 L Turbo",
    seats: 5,
    features: ["GR Sport Kit", "Turbo Engine", "LED Projector", "Digital Meter"],
  },
  {
    id: "unit-013",
    brand: "Mitsubishi",
    type: "Pajero Sport Dakar 4x2",
    plate: "B 1213 MVX",
    year: 2020,
    color: "Graphite Grey",
    transmission: "Automatic",
    odometer: 58200,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 385000000,
    cashPrice: 435000000,
    creditPrice: 448000000,
    aging: 42,
    source: "Fleet Partner",
    photos: 26,
    bodyType: "SUV",
    fuel: "Diesel",
    engine: "2.4 L Diesel",
    seats: 7,
    features: ["4WD Select", "Cruise Control", "Rockford Audio", "360 Camera"],
  },
  {
    id: "unit-014",
    brand: "Honda",
    type: "CR-V Turbo Prestige",
    plate: "B 1214 MVX",
    year: 2021,
    color: "Crystal Black Pearl",
    transmission: "Automatic",
    odometer: 29800,
    branch: "BEKASI",
    position: "Showroom Bekasi",
    status: "BOOKED",
    buyingPrice: 420000000,
    cashPrice: 475000000,
    creditPrice: 489000000,
    aging: 25,
    source: "Referensi · Sales",
    photos: 23,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Honda Sensing", "Panoramic Roof", "Power Tailgate", "Leather Seat"],
  },
  {
    id: "unit-015",
    brand: "Daihatsu",
    type: "Xenia R ADS 1.5",
    plate: "B 1215 MVX",
    year: 2023,
    color: "Icy White",
    transmission: "Automatic",
    odometer: 9800,
    branch: "CINERE",
    position: "Showroom Cinere",
    status: "UNIT READY",
    buyingPrice: 185000000,
    cashPrice: 212000000,
    creditPrice: 219000000,
    aging: 11,
    source: "Lelang Partner",
    photos: 16,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["ADS Package", "Digital AC", "Rear Camera", "VSC + HAC"],
  },
  {
    id: "unit-016",
    brand: "Wuling",
    type: "Almaz RS Pro",
    plate: "B 1216 MVX",
    year: 2022,
    color: "Carnelian Red",
    transmission: "Automatic",
    odometer: 24500,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 265000000,
    cashPrice: 305000000,
    creditPrice: 315000000,
    aging: 28,
    source: "Customer Direct",
    photos: 20,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Internet of Vehicle", "360 Camera", "ADAS Level 2", "Panoramic Sunroof"],
  },
];

class InventoryProductDemo {
  constructor(root) {
    this.root = root;
    this.units = [];
    this.status = "ALL";
    this.branch = "ALL";
    this.query = "";
    this.sort = "newest";
    this.selectedId = null;
    this.dataError = "";
    this.lastFocusedElement = null;
    this.hasOpenedGuide = false;
    this.activeView = "units";
    this.activeUploadTab = "inventory";
    this.guideStepIndex = 0;
    this.falconRole = "sales"; // sales | management
    this.falconMessages = [];
    this.falconSalesDone = false;
    this.falconTutorialDone = { sales: {}, management: {} };

    this.tableBody = root.querySelector("[data-demo-table-body]");
    this.mobileList = root.querySelector("[data-demo-mobile-list]");
    this.emptyState = root.querySelector("[data-demo-empty]");
    this.searchInput = root.querySelector("[data-demo-search]");
    this.branchSelect = root.querySelector("[data-demo-branch]");
    this.sortSelect = root.querySelector("[data-demo-sort]");
    this.resultCount = root.querySelector("[data-demo-result-count]");
    this.detailPanel = root.querySelector(".demo-detail-panel");
    this.detailBackdrop = root.querySelector("[data-demo-detail-backdrop]");
    this.guide = root.querySelector("[data-demo-guide-popover]");
    this.toast = root.querySelector("[data-demo-toast]");
    this.bookingButton = root.querySelector("[data-demo-book-unit]");
    this.bookingCopy = root.querySelector("[data-demo-booking-copy]");
    this.branchTotals = root.querySelector("[data-ims-branch-totals]");
    this.branchGrid = root.querySelector("[data-ims-branch-grid]");
    this.tipTitle = root.querySelector("[data-ims-tip-title]");
    this.tipBody = root.querySelector("[data-ims-tip-body]");
    this.falconMessagesEl = root.querySelector("[data-falcon-messages]");
    this.falconInput = root.querySelector("[data-falcon-input]");
    this.falconContact = root.querySelector("[data-falcon-contact]");
    this.falconAvatar = root.querySelector("[data-falcon-avatar]");
    this.falconRoleLabel = root.querySelector("[data-falcon-role-label]");
    this.falconRoleHint = root.querySelector("[data-falcon-role-hint]");
    this.falconTutorialList = root.querySelector("[data-falcon-tutorial-list]");
    this.falconQuickPrompts = root.querySelector("[data-falcon-quick-prompts]");

    this.bind();
    this.setView("units");
    this.initFalconChat();
    this.render();
    this.loadTenantData();
  }

  guideSteps() {
    const samples = this.sampleUnitNames();
    return [
      {
        view: "units",
        title: "Tiga modul SMI seperti Mobix",
        body: "Sidebar Sistem Manajemen Inventaris berisi Manajemen Unit, Unit per Cabang, dan Upload Data — sama dengan Mobix. Klik Lanjut untuk mencoba satu per satu.",
      },
      {
        view: "units",
        title: "Manajemen Unit",
        body: "Cari merek/tipe, filter status Ready/Booked/Sold, lalu buka detail unit. Coba booking unit Ready (tersimpan di tenant demo).",
      },
      {
        view: "per-cabang",
        title: "Unit per Cabang",
        body: "Lihat ringkasan stok Ready, Booked, dan foto per cabang. Klik kartu cabang untuk kembali ke Manajemen Unit dengan filter cabang itu.",
      },
      {
        view: "uploads",
        title: "Upload Data",
        body: "Tab Import Inventory, Foto, Handover, dan MRP — alur yang sama dengan Mobix. Di demo, unggah bersifat simulasi.",
      },
      {
        view: "falcon",
        title: "Masuk AI Falcon",
        body: "Mock WhatsApp. Mode Sales Agent — Falcon demo semua fitur sales Motovax (tanpa laporan management).",
        enter: () => this.setFalconRole("sales", { greet: true }),
      },
      {
        view: "falcon",
        title: "Sales: cek stok unit",
        body: `Tanya unit (unit_query). Contoh: “Halo mau tanya ${samples.join(", ")}”.`,
        enter: () => {
          this.setFalconRole("sales");
          this.sendFalconUserMessage(
            `Halo mau tanya ${samples.join(", ")}`,
            { fromGuide: true },
          );
        },
      },
      {
        view: "falcon",
        title: "Sales: minta foto unit",
        body: "photo_send — “Minta foto” unit. Falcon mengirim mock foto galeri tenant.",
        enter: () => this.sendFalconUserMessage("Minta foto", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: upload foto stok",
        body: "Tekan 📎 di composer — simulasi update foto stok lewat WA (bukan DB production).",
        enter: () => this.simulateFalconPhotoUpload({ fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: simulasi kredit",
        body: "finance_simulation — coba “Simulasi kredit 20% DP 48 bulan”.",
        enter: () =>
          this.sendFalconUserMessage("Simulasi kredit 20% DP 48 bulan", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: lokasi showroom",
        body: "location_map — “Lokasi showroom” / map cabang.",
        enter: () => this.sendFalconUserMessage("Lokasi showroom", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: catat lead",
        body: "lead_own — “Catat lead Budi 08123456789 minat Innova”.",
        enter: () =>
          this.sendFalconUserMessage("Catat lead Budi 08123456789 minat Innova", {
            fromGuide: true,
          }),
      },
      {
        view: "falcon",
        title: "Sales: handoff ke admin",
        body: "handoff — “Hubungkan customer ke admin”.",
        enter: () =>
          this.sendFalconUserMessage("Hubungkan customer ke admin", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: generate konten",
        body: "image_generation — “Buat caption promo unit”.",
        enter: () =>
          this.sendFalconUserMessage("Buat caption promo unit", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: performa sendiri",
        body: "analytics:sales_performance (terbatas) — “Performa sales saya”. Bukan laporan management.",
        enter: () =>
          this.sendFalconUserMessage("Performa sales saya", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Sales: ringkasan semua fitur",
        body: "Falcon merangkum seluruh capability Sales Agent (bukan sekadar cek mode).",
        enter: () =>
          this.sendFalconUserMessage("Tampilkan semua fitur sales", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Berganti ke Management Agent",
        body: "Tutorial Sales selesai. Ganti ke Management — laporan, aging, GP, import, edit unit, dokumen, analytics.",
        enter: () => this.setFalconRole("management", { greet: true, fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: stok per cabang",
        body: "Laporan stok agregat per cabang (mock demo).",
        enter: () =>
          this.sendFalconUserMessage("Laporan stok per cabang", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: aging unit",
        body: "Inventory analysis — “Laporan aging unit”.",
        enter: () =>
          this.sendFalconUserMessage("Laporan aging unit", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: GP / margin",
        body: "Insight GP & margin internal (hanya Management).",
        enter: () =>
          this.sendFalconUserMessage("Gross profit margin unit", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: import Excel",
        body: "excel_import — “Import inventory lewat WA”.",
        enter: () =>
          this.sendFalconUserMessage("Import inventory lewat WA", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: edit unit",
        body: "unit_edit — “Ubah status unit jadi Booked”.",
        enter: () =>
          this.sendFalconUserMessage("Ubah status unit jadi Booked", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: dokumen",
        body: "document_upload / review — “Upload dokumen unit”.",
        enter: () =>
          this.sendFalconUserMessage("Upload dokumen unit", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: analisis stok",
        body: "Rekomendasi inventory & perputaran stok.",
        enter: () =>
          this.sendFalconUserMessage("Analisis inventory dan rekomendasi stok", {
            fromGuide: true,
          }),
      },
      {
        view: "falcon",
        title: "Management: tren penjualan",
        body: "analytics — “Tren penjualan bulan ini”.",
        enter: () =>
          this.sendFalconUserMessage("Tren penjualan bulan ini", { fromGuide: true }),
      },
      {
        view: "falcon",
        title: "Management: ringkasan fitur",
        body: "Semua capability Management Agent dalam satu ringkasan demo.",
        enter: () =>
          this.sendFalconUserMessage("Tampilkan semua fitur management", {
            fromGuide: true,
          }),
      },
      {
        view: "falcon",
        title: "Panduan selesai",
        body: "SMI + AI Falcon: tutorial Sales (tanpa report) dan Management (laporan & operasional penuh). Eksplor bebas atau Reset demo.",
      },
    ];
  }

  sampleUnitNames() {
    const ready = (this.units.length ? this.units : inventoryDemoSeed)
      .filter((u) => String(u.status).toUpperCase().includes("READY") || u.status === "UNIT READY")
      .slice(0, 3);
    const pool = ready.length ? ready : (this.units.length ? this.units : inventoryDemoSeed).slice(0, 3);
    return pool.map((u) => `${u.brand} ${u.type}`);
  }

  async loadTenantData(force = false) {
    try {
      const snapshot = await publicDemoData.snapshot(force);
      this.dataError = "";
      this.units = snapshot.inventory.map((unit) => {
        const seed =
          inventoryDemoSeed.find(
            (item) =>
              item.id === unit.id ||
              (`${item.brand} ${item.type}`.toLowerCase() ===
                `${unit.brand || ""} ${unit.type || ""}`.toLowerCase()),
          ) || {};
        return {
          id: unit.id,
          brand: unit.brand,
          type: unit.type,
          plate: unit.plate || seed.plate || "Unit Demo",
          year: unit.year,
          color: unit.color || seed.color,
          transmission: this.titleCase(unit.transmission || seed.transmission || "Automatic"),
          odometer: unit.odometer ?? seed.odometer ?? 0,
          branch: unit.branch || seed.branch || "Demo Jakarta",
          position: unit.position || unit.branch || seed.position || "Showroom Demo",
          status: String(unit.status).toUpperCase().includes("READY") ? "UNIT READY" : unit.status,
          buyingPrice: null,
          cashPrice: unit.cash_price ?? seed.cashPrice,
          creditPrice: unit.credit_price ?? seed.creditPrice,
          aging: unit.aging ?? seed.aging ?? 0,
          source: unit.source || seed.source || "Inventory tenant demo",
          photos: unit.photo_count ?? unit.photos ?? seed.photos ?? 0,
          photoUrl: unit.photo_url || seed.photoUrl || "",
          bodyType: unit.body_type || unit.bodyType || seed.bodyType || unit.category,
          fuel: unit.fuel || seed.fuel,
          engine: unit.engine || seed.engine,
          seats: unit.seats || seed.seats,
          features: unit.features || seed.features || [],
        };
      });
      // Share live photo URLs with Social Growth Studio (same tenant inventory).
      if (typeof window.__motovaxApplyInventoryPhotos === "function") {
        window.__motovaxApplyInventoryPhotos(this.units);
      }
      this.render();
    } catch (error) {
      this.units = inventoryDemoSeed.map((unit) => ({ ...unit }));
      this.dataError = "";
      this.render();
    }
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-inventory-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }

    for (const button of this.root.querySelectorAll("[data-close-inventory-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    for (const button of this.root.querySelectorAll("[data-ims-nav]")) {
      button.addEventListener("click", () => {
        this.setView(button.dataset.imsNav || "units");
      });
    }

    for (const button of this.root.querySelectorAll("[data-ims-upload-tab]")) {
      button.addEventListener("click", () => {
        this.setUploadTab(button.dataset.imsUploadTab || "inventory");
      });
    }

    for (const button of this.root.querySelectorAll("[data-ims-upload-sim]")) {
      button.addEventListener("click", () => {
        const kind = button.dataset.imsUploadSim || "inventory";
        const labels = {
          inventory: "Import inventory",
          foto: "Upload foto",
          handover: "Handover sales",
          mrp: "Upload MRP",
        };
        this.toast.querySelector("b").textContent = `${labels[kind] || "Upload"} disimulasikan`;
        this.toast.querySelector("p").textContent =
          "Di Mobix file diunggah ke tenant Anda; demo ini hanya menampilkan alur yang sama.";
        this.toast.hidden = false;
      });
    }

    for (const button of this.root.querySelectorAll("[data-status-filter]")) {
      button.addEventListener("click", () => {
        this.status = button.dataset.statusFilter || "ALL";
        this.render();
      });
    }

    this.searchInput.addEventListener("input", () => {
      this.query = this.searchInput.value.trim().toLocaleLowerCase("id");
      this.render();
    });

    this.branchSelect.addEventListener("change", () => {
      this.branch = this.branchSelect.value;
      this.render();
    });

    this.sortSelect.addEventListener("change", () => {
      this.sort = this.sortSelect.value;
      this.render();
    });

    this.tableBody.addEventListener("click", (event) => this.handleUnitActivation(event));
    this.tableBody.addEventListener("keydown", (event) => this.handleUnitActivation(event));
    this.mobileList.addEventListener("click", (event) => this.handleUnitActivation(event));
    this.mobileList.addEventListener("keydown", (event) => this.handleUnitActivation(event));

    const handleBranchFilterClick = (event) => {
      const card = event.target.closest("[data-ims-branch-filter]");
      if (!card) return;
      const branch = card.dataset.imsBranchFilter || "ALL";
      const status = card.dataset.imsStatusFilter || "ALL";
      this.branch = branch;
      this.status = status;
      if (this.branchSelect && [...this.branchSelect.options].some((opt) => opt.value === branch)) {
        this.branchSelect.value = branch;
      } else if (this.branchSelect && branch === "ALL") {
        this.branchSelect.value = "ALL";
      }
      this.setView("units");
      this.render();
    };
    this.branchTotals?.addEventListener("click", handleBranchFilterClick);
    this.branchGrid?.addEventListener("click", handleBranchFilterClick);

    for (const button of this.root.querySelectorAll("[data-close-demo-detail]")) {
      button.addEventListener("click", () => this.closeDetail());
    }
    this.detailBackdrop.addEventListener("click", () => this.closeDetail());

    this.bookingButton.addEventListener("click", () => this.bookSelectedUnit());
    this.root.querySelector("[data-demo-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-demo-clear-filter]").addEventListener("click", () => {
      this.clearFilters();
      this.searchInput.focus();
    });

    for (const button of this.root.querySelectorAll("[data-demo-guide]")) {
      button.addEventListener("click", () => this.openGuide(0));
    }
    this.root.querySelector("[data-close-demo-guide]").addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-demo-guide-next]")?.addEventListener("click", () => this.nextGuideStep());
    this.root.querySelector("[data-demo-guide-prev]")?.addEventListener("click", () => this.prevGuideStep());
    this.root.querySelector("[data-demo-guide-finish]")?.addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-close-demo-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.root.querySelector("[data-falcon-send]")?.addEventListener("click", () => this.handleFalconSend());
    this.root.querySelector("[data-falcon-attach]")?.addEventListener("click", () =>
      this.simulateFalconPhotoUpload(),
    );
    this.falconInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleFalconSend();
      }
    });
    this.falconQuickPrompts?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-falcon-prompt]");
      if (!chip) return;
      this.sendFalconUserMessage(chip.dataset.falconPrompt || chip.textContent);
    });

    this._onGuideReposition = () => {
      if (!this.guide.hidden) this.positionGuide();
    };
    window.addEventListener("resize", this._onGuideReposition);
    this.root.querySelector(".demo-workspace")?.addEventListener("scroll", this._onGuideReposition, {
      passive: true,
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (!this.guide.hidden) {
        this.closeGuide();
      } else if (this.detailPanel.classList.contains("is-open")) {
        this.closeDetail();
      } else {
        this.close();
      }
    });
  }

  setView(view) {
    const next = ["units", "per-cabang", "uploads", "falcon"].includes(view) ? view : "units";
    this.activeView = next;

    for (const button of this.root.querySelectorAll("[data-ims-nav]")) {
      const isActive = button.dataset.imsNav === next;
      button.classList.toggle("active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }

    for (const panel of this.root.querySelectorAll("[data-ims-view]")) {
      const isActive = panel.dataset.imsView === next;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    }

    const tips = {
      units: {
        title: "Coba cari dan filter unit",
        body: "Klik salah satu unit untuk melihat detail lalu coba ubah statusnya menjadi booked.",
      },
      "per-cabang": {
        title: "Pantau stok per cabang",
        body: "Klik kartu cabang untuk membuka Manajemen Unit dengan filter cabang yang sama seperti di Mobix.",
      },
      uploads: {
        title: "Alur upload data",
        body: "Pilih tab Import Inventory, Foto, Handover, atau MRP — tiga menu IMS ini sama dengan Mobix.",
      },
      falcon: {
        title: "Chat AI Falcon",
        body: "Tutorial semua fitur Falcon: Sales Agent (tanpa report) dulu, lalu Management Agent (laporan, import, edit, analytics).",
      },
    };
    const tip = tips[next] || tips.units;
    if (this.tipTitle) this.tipTitle.textContent = tip.title;
    if (this.tipBody) this.tipBody.textContent = tip.body;

    if (next !== "units") this.closeDetail();
    this.renderBranchSummary();
    this.renderUploadMeta();
    if (next === "falcon") {
      this.renderFalconChrome();
      this.renderFalconTutorial();
      this.renderFalconQuickPrompts();
    }
  }

  setUploadTab(tab) {
    const next = ["inventory", "foto", "handover", "mrp"].includes(tab) ? tab : "inventory";
    this.activeUploadTab = next;

    for (const button of this.root.querySelectorAll("[data-ims-upload-tab]")) {
      const isActive = button.dataset.imsUploadTab === next;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    }

    for (const panel of this.root.querySelectorAll("[data-ims-upload-panel]")) {
      panel.hidden = panel.dataset.imsUploadPanel !== next;
    }
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-inventory-demo]").focus();
    if (!this.hasOpenedGuide) {
      this.openGuide();
      this.hasOpenedGuide = true;
    }
    this.loadTenantData(true);
  }

  close() {
    this.closeDetail();
    this.closeGuide();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    this.guideStepIndex = Math.max(0, startIndex);
    this.guide.hidden = false;
    this.renderGuideStep();
    const focusBtn =
      this.guide.querySelector("[data-demo-guide-next]:not([hidden])") ||
      this.guide.querySelector("[data-demo-guide-finish]:not([hidden])");
    focusBtn?.focus();
  }

  closeGuide() {
    this.guide.hidden = true;
    this.clearGuidePosition();
  }

  clearGuidePosition() {
    if (!this.guide) return;
    this.guide.classList.remove("is-falcon-anchor");
    this.guide.style.top = "";
    this.guide.style.left = "";
    this.guide.style.right = "";
    this.guide.style.bottom = "";
    this.guide.style.maxWidth = "";
  }

  /**
   * Posisikan popover panduan agar tidak menutupi mockup iPhone di view AI Falcon.
   * Langkah non-Falcon tetap di kanan atas (CSS default).
   */
  positionGuide() {
    if (!this.guide || this.guide.hidden) return;

    const steps = this.guideSteps();
    const step = steps[this.guideStepIndex] || steps[0];
    const isFalcon = step?.view === "falcon";

    if (!isFalcon) {
      this.clearGuidePosition();
      return;
    }

    this.guide.classList.add("is-falcon-anchor");

    const rectIsVisible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    const place = () => {
      if (!this.guide || this.guide.hidden) return;
      const phone = this.root.querySelector(".iphone-frame");
      if (!phone || !rectIsVisible(phone)) {
        // Fallback: kiri area workspace, jauh dari mockup iPhone
        this.guide.style.top = "92px";
        this.guide.style.right = "auto";
        this.guide.style.left = "16px";
        this.guide.style.bottom = "auto";
        return;
      }

      const rect = phone.getBoundingClientRect();
      const gw = Math.min(330, window.innerWidth - 32);
      const gh = this.guide.offsetHeight || 200;
      const gap = 16;
      const minTop = 76;

      let left = rect.left - gw - gap;
      let top = rect.top;

      if (left >= 12) {
        // Cukup ruang di kiri iPhone — letakkan di samping (kolom role panel)
        top = Math.max(minTop, Math.min(top, window.innerHeight - gh - 16));
      } else {
        // Layout sempit / stacked: di atas iPhone, atau di bawah jika tidak muat
        left = Math.max(12, Math.min(rect.left, window.innerWidth - gw - 12));
        top = rect.top - gh - gap;
        if (top < minTop) {
          top = Math.min(rect.bottom + gap, window.innerHeight - gh - 16);
          left = Math.max(
            12,
            Math.min(rect.left + (rect.width - gw) / 2, window.innerWidth - gw - 12),
          );
        }
      }

      this.guide.style.top = `${Math.round(top)}px`;
      this.guide.style.left = `${Math.round(left)}px`;
      this.guide.style.right = "auto";
      this.guide.style.bottom = "auto";
      this.guide.style.maxWidth = `${gw}px`;
    };

    // Tunggu layout view Falcon + bubble chat selesai
    requestAnimationFrame(() => {
      requestAnimationFrame(place);
      // enter() bisa menambah bubble; reposisi sekali lagi setelah layout stabil
      window.setTimeout(place, 80);
    });
  }

  renderGuideStep() {
    const steps = this.guideSteps();
    const step = steps[this.guideStepIndex] || steps[0];
    const total = steps.length;
    const index = this.guideStepIndex + 1;

    this.guide.querySelector("[data-demo-guide-step-label]").textContent =
      `LANGKAH ${index} DARI ${total}`;
    this.guide.querySelector("[data-demo-guide-title]").textContent = step.title;
    this.guide.querySelector("[data-demo-guide-body]").textContent = step.body;

    const prev = this.guide.querySelector("[data-demo-guide-prev]");
    const next = this.guide.querySelector("[data-demo-guide-next]");
    const finish = this.guide.querySelector("[data-demo-guide-finish]");
    const isLast = this.guideStepIndex >= total - 1;
    const isFirst = this.guideStepIndex <= 0;

    if (prev) prev.hidden = isFirst;
    if (next) next.hidden = isLast;
    if (finish) finish.hidden = !isLast;

    if (step.view) this.setView(step.view);
    if (typeof step.enter === "function") step.enter();
    this.positionGuide();
  }

  nextGuideStep() {
    const steps = this.guideSteps();
    if (this.guideStepIndex >= steps.length - 1) {
      this.closeGuide();
      return;
    }
    this.guideStepIndex += 1;
    this.renderGuideStep();
  }

  prevGuideStep() {
    if (this.guideStepIndex <= 0) return;
    this.guideStepIndex -= 1;
    this.renderGuideStep();
  }

  clearFilters() {
    this.status = "ALL";
    this.branch = "ALL";
    this.query = "";
    this.sort = "newest";
    this.searchInput.value = "";
    this.branchSelect.value = "ALL";
    this.sortSelect.value = "newest";
    this.render();
  }

  reset() {
    this.selectedId = null;
    this.closeDetail();
    this.toast.hidden = true;
    this.clearFilters();
    this.guideStepIndex = 0;
    this.falconSalesDone = false;
    this.falconTutorialDone = { sales: {}, management: {} };
    this.setFalconRole("sales", { greet: true, reset: true });
    this.setView("units");
    this.setUploadTab("inventory");
    this.loadTenantData(true);
  }

  initFalconChat() {
    this.setFalconRole("sales", { greet: true, reset: true });
  }

  setFalconRole(role, options = {}) {
    const next = role === "management" ? "management" : "sales";
    this.falconRole = next;
    if (next === "management") this.falconSalesDone = true;

    if (options.reset) {
      this.falconMessages = [];
    }

    this.renderFalconChrome();
    this.renderFalconTutorial();
    this.renderFalconQuickPrompts();

    if (options.greet) {
      if (next === "sales") {
        this.pushFalconBot(
          "Halo! Saya Falcon untuk Sales Agent.\n\nSaya bisa bantu: cek stok/unit, foto, simulasi kredit, lokasi showroom, catat lead, handoff admin, generate konten, dan performa sales Anda.\n\nTidak bisa: laporan aging/GP, import Excel, edit unit massal, atau data harga internal.\n\nCoba chip di kiri, atau ketik “tampilkan semua fitur sales” untuk ringkasan + cara coba tiap fitur.",
        );
      } else {
        this.pushFalconSystem("Mode berganti ke Management Agent.");
        this.pushFalconBot(
          "Halo! Saya Falcon untuk Management Agent.\n\nSaya bisa semua fitur Sales + laporan stok/cabang/aging, GP/margin, import Excel, edit unit, dokumen, analisis inventory, dan analytics tren.\n\nCoba “laporan stok per cabang” atau “tampilkan semua fitur management”.",
        );
      }
    }

    this.renderFalconMessages();
  }

  renderFalconChrome() {
    const isSales = this.falconRole === "sales";
    if (this.falconContact) {
      this.falconContact.textContent = isSales ? "Sales Agent" : "Management Agent";
    }
    if (this.falconAvatar) {
      this.falconAvatar.textContent = isSales ? "SA" : "MA";
      this.falconAvatar.classList.toggle("is-management", !isSales);
    }
    if (this.falconRoleLabel) {
      this.falconRoleLabel.textContent = isSales ? "Sales Agent" : "Management Agent";
    }
    if (this.falconRoleHint) {
      this.falconRoleHint.textContent = isSales
        ? "Falcon menjawab dengan capability Sales — tidak bisa laporan management / data internal."
        : "Falcon menjawab dengan capability Management — laporan, aging, analytics, dan operasional inventory.";
    }
    const badge = this.root.querySelector("[data-falcon-role-badge]");
    badge?.classList.toggle("is-management", !isSales);
  }

  salesTutorialItems() {
    // Capability Falcon role Salesperson (motovax-app IAM): unit_query, finance_simulation,
    // image_generation, photo_send, lead_own, handoff, analytics:sales_performance (terbatas).
    // Tidak termasuk: analytics_query/laporan management, excel_import, unit_edit, document_*.
    return [
      { id: "unit", label: "Cek stok & detail unit" },
      { id: "photo", label: "Minta foto unit" },
      { id: "upload", label: "Upload foto update stok" },
      { id: "finance", label: "Simulasi kredit & asuransi" },
      { id: "map", label: "Lokasi showroom / map" },
      { id: "lead", label: "Catat lead customer" },
      { id: "handoff", label: "Handoff customer ke admin" },
      { id: "content", label: "Generate konten / caption" },
      { id: "performance", label: "Performa sales sendiri" },
      { id: "features", label: "Ringkasan semua fitur Sales" },
    ];
  }

  managementTutorialItems() {
    // Management = fullTenantPermissions: semua Sales + laporan, import, edit, dokumen, analytics.
    return [
      { id: "report_branch", label: "Laporan stok per cabang" },
      { id: "report_aging", label: "Laporan aging unit" },
      { id: "gp", label: "Insight GP / margin" },
      { id: "import", label: "Import Excel inventory" },
      { id: "unit_edit", label: "Edit data / status unit" },
      { id: "document", label: "Upload / review dokumen" },
      { id: "analysis", label: "Analisis inventory & rekomendasi" },
      { id: "analytics", label: "Analytics / tren penjualan" },
      { id: "features", label: "Ringkasan semua fitur Management" },
    ];
  }

  renderFalconTutorial() {
    if (!this.falconTutorialList) return;
    const items =
      this.falconRole === "sales" ? this.salesTutorialItems() : this.managementTutorialItems();
    const doneMap = this.falconTutorialDone[this.falconRole] || {};
    this.falconTutorialList.innerHTML = items
      .map(
        (item) => `
        <li class="${doneMap[item.id] ? "is-done" : ""}">
          <span>${doneMap[item.id] ? "✓" : "○"}</span>
          <span>${item.label}</span>
        </li>
      `,
      )
      .join("");

    if (this.falconRole === "sales") {
      const required = this.salesTutorialItems().map((i) => i.id);
      const allDone = required.every((id) => doneMap[id]);
      if (allDone && !this.falconSalesDone) {
        this.falconSalesDone = true;
      }
    }
  }

  markFalconTutorial(id) {
    if (!this.falconTutorialDone[this.falconRole]) {
      this.falconTutorialDone[this.falconRole] = {};
    }
    this.falconTutorialDone[this.falconRole][id] = true;
    this.renderFalconTutorial();
  }

  renderFalconQuickPrompts() {
    if (!this.falconQuickPrompts) return;
    const samples = this.sampleUnitNames();
    const sales = [
      `Halo mau tanya ${samples.slice(0, 2).join(" dan ")}`,
      "Minta foto",
      "Simulasi kredit 20% DP 48 bulan",
      "Lokasi showroom",
      "Catat lead Budi 08123456789 minat Innova",
      "Hubungkan customer ke admin",
      "Buat caption promo unit",
      "Performa sales saya",
      "Tampilkan semua fitur sales",
      "Laporan aging stok",
      "Ganti ke Management Agent",
    ];
    const management = [
      "Laporan stok per cabang",
      "Laporan aging unit",
      "Gross profit / margin unit",
      "Import inventory lewat WA",
      "Ubah status unit jadi Booked",
      "Upload dokumen unit",
      "Analisis inventory dan rekomendasi stok",
      "Tren penjualan bulan ini",
      "Tampilkan semua fitur management",
      "Kembali ke Sales Agent",
    ];
    const list = this.falconRole === "sales" ? sales : management;
    this.falconQuickPrompts.innerHTML = list
      .map(
        (text) =>
          `<button type="button" data-falcon-prompt="${text.replace(/"/g, "&quot;")}">${text}</button>`,
      )
      .join("");
  }

  pushFalconBot(text, extra = {}) {
    this.falconMessages.push({ role: "bot", text, ...extra });
  }

  pushFalconUser(text, extra = {}) {
    this.falconMessages.push({ role: "user", text, ...extra });
  }

  pushFalconSystem(text) {
    this.falconMessages.push({ role: "system", text });
  }

  renderFalconMessages() {
    if (!this.falconMessagesEl) return;
    this.falconMessagesEl.innerHTML = this.falconMessages
      .map((msg) => {
        if (msg.role === "system") {
          return `<div class="wa-system"><span>${this.escapeHtml(msg.text)}</span></div>`;
        }
        if (msg.role === "user") {
          const media = msg.photo
            ? `<div class="wa-media-thumb" aria-hidden="true">📷 Foto stok</div>`
            : "";
          return `<div class="wa-bubble wa-out">${media}<p>${this.escapeHtml(msg.text)}</p></div>`;
        }
        const media =
          msg.photos
            ? `<div class="wa-photo-grid">${msg.photos
                .map(
                  (p) =>
                    `<div class="wa-photo-card"><b>${this.escapeHtml(p.label)}</b><span>${this.escapeHtml(p.meta)}</span></div>`,
                )
                .join("")}</div>`
            : "";
        const report = msg.reportHtml || "";
        return `<div class="wa-bubble wa-in">${media}${report}<p>${this.escapeHtml(msg.text)}</p></div>`;
      })
      .join("");
    this.falconMessagesEl.scrollTop = this.falconMessagesEl.scrollHeight;
  }

  escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  handleFalconSend() {
    const text = (this.falconInput?.value || "").trim();
    if (!text) return;
    if (this.falconInput) this.falconInput.value = "";
    this.sendFalconUserMessage(text);
  }

  sendFalconUserMessage(text, options = {}) {
    const content = String(text || "").trim();
    if (!content) return;
    this.pushFalconUser(content);
    this.renderFalconMessages();
    const reply = this.buildFalconReply(content);
    window.setTimeout(() => {
      if (reply.roleSwitch) {
        this.setFalconRole(reply.roleSwitch, { greet: true });
        return;
      }
      this.pushFalconBot(reply.text, {
        photos: reply.photos,
        reportHtml: reply.reportHtml,
      });
      if (reply.tutorialId) this.markFalconTutorial(reply.tutorialId);
      this.renderFalconMessages();
    }, options.fromGuide ? 280 : 420);
  }

  simulateFalconPhotoUpload(options = {}) {
    this.pushFalconUser("📷 [Foto unit dari galeri]", { photo: true });
    this.renderFalconMessages();
    window.setTimeout(() => {
      if (this.falconRole === "sales") {
        this.pushFalconBot(
          "Foto diterima (simulasi). Saya tautkan ke unit stok demo dan status “foto ter-update”. Di Mobix, upload foto lewat WA memutakhirkan galeri unit tenant Anda — di sini tidak mengubah DB production.",
        );
        this.markFalconTutorial("upload");
      } else {
        this.pushFalconBot(
          "Foto stok diterima (simulasi Management). Bisa digabung ke multi-unit / merge photo seperti di Motovax. Tidak mengubah database production.",
        );
        this.markFalconTutorial("import");
      }
      this.renderFalconMessages();
    }, options.fromGuide ? 280 : 400);
  }

  buildFalconReply(raw) {
    const text = raw.toLocaleLowerCase("id");
    const isSales = this.falconRole === "sales";

    // 1) Ringkasan fitur HARUS diproses dulu — jangan tertangkap matcher "sales agent" / role-switch.
    if (
      /fitur|kemampuan|bisa (apa|bantu)|apa saja yang bisa|tampilkan semua fitur|daftar fitur|tutorial fitur/.test(
        text,
      )
    ) {
      if (isSales) {
        if (/management/.test(text) && !/sales/.test(text)) {
          return {
            text: "Daftar fitur Management hanya di mode Management Agent. Ketik “Ganti ke Management Agent” setelah menyelesaikan tutorial Sales, atau coba “tampilkan semua fitur sales” untuk capability role ini.",
          };
        }
        return { tutorialId: "features", text: this.salesFeaturesText() };
      }
      if (/sales/.test(text) && !/management/.test(text)) {
        return {
          text: `Anda di mode Management. Ringkas fitur Sales:\n${this.salesFeaturesText()}\n\nKetik “Kembali ke Sales Agent” untuk demo role Sales, atau “tampilkan semua fitur management” untuk capability penuh Management.`,
        };
      }
      return { tutorialId: "features", text: this.managementFeaturesText() };
    }

    // 2) Ganti role — hanya intent eksplisit (ganti/mode/kembali), bukan frasa "fitur sales agent".
    if (
      /ganti.*management|mode management|jadi management|ke management agent|management agent$/.test(
        text,
      ) ||
      (text.includes("management agent") && /ganti|mode|jadi|switch|ke /.test(text))
    ) {
      if (isSales) return { roleSwitch: "management" };
      return { text: "Anda sudah di mode Management Agent. Coba “tampilkan semua fitur management” atau laporan stok/aging." };
    }
    if (
      /ganti.*sales|kembali.*sales|mode sales|jadi sales|ke sales agent|sales agent$/.test(text) ||
      (text.includes("sales agent") && /ganti|mode|jadi|switch|kembali|ke /.test(text))
    ) {
      if (!isSales) return { roleSwitch: "sales" };
      return { text: "Anda sudah di mode Sales Agent. Coba “tampilkan semua fitur sales” atau tanya unit." };
    }

    // 3) Performa sales sendiri (boleh Sales) vs laporan/analytics management (diblok Sales).
    if (/performa sales|performa saya|kinerja sales|sales performance saya/.test(text)) {
      if (isSales) {
        return {
          tutorialId: "performance",
          text: "Performa sales Anda (demo, analytics:sales_performance terbatas):\n• Lead dicatat minggu ini: 12\n• Follow-up aktif: 5\n• Closing: 2 unit\n• Unit paling sering ditanya: Innova, Xpander\n\nIni metrik milik sales sendiri — bukan laporan aging/GP/tren cabang (itu Management).",
        };
      }
      return {
        tutorialId: "analytics",
        text: "Performa sales (demo Management):\n• Tim: 8 agent aktif\n• Lead total minggu ini: 96\n• Closing rate demo: ~18%\n• Top agent: Rina (5 closing)\n\nDi production data dari analytics:sales_performance + analytics:management.",
      };
    }

    if (
      /laporan|aging|gross profit|margin|gp |analitik|analytics|tren penjualan|insight|rekomendasi stok|analisis inventory|analisis inventori/.test(
        text,
      )
    ) {
      if (isSales) {
        return {
          text: "Maaf, laporan management (aging internal, GP, margin, tren agregat, analisis inventory) tidak tersedia di role Sales Agent.\n\nYang boleh Sales: cek unit, foto, simulasi kredit, lead, handoff, performa sendiri.\n\nKetik “Ganti ke Management Agent” untuk demo laporan, atau “tampilkan semua fitur sales” untuk capability lengkap role ini.",
        };
      }
      return this.buildManagementReport(text);
    }

    // 4) Lokasi / map
    if (/lokasi|showroom|peta|map|alamat cabang|jam buka/.test(text)) {
      return {
        tutorialId: isSales ? "map" : undefined,
        text: "Lokasi showroom (demo):\n• Cinere — Jl. Cinere Raya No. 12 · [MAP: Showroom Cinere | -6.333, 106.783]\n• Pondok Bambu — Jl. Pahlawan Revolusi · [MAP: Showroom PDB | -6.241, 106.901]\n\nDi Motovax, Falcon mengirim token map & jam operasional cabang tenant.",
      };
    }

    // 5) Lead capture
    if (/catat lead|daftar lead|lead baru|customer baru|simpan lead|lapor lead/.test(text)) {
      const nameMatch = raw.match(/(?:lead|customer)\s+([A-Za-zÀ-ÿ.]+)/i);
      const name = nameMatch?.[1] || "Budi";
      return {
        tutorialId: isSales ? "lead" : undefined,
        text: `Lead dicatat (simulasi lead_own) ✅\n• Nama: ${name}\n• HP: 08123456789\n• Minat: Innova / unit demo\n• Assign: ke akun Sales yang chat\n\nDi production Falcon memanggil lead_update_admin; Sales hanya mengelola lead miliknya. Lanjut handoff? Ketik “Hubungkan customer ke admin”.`,
      };
    }

    // 6) Handoff
    if (/handoff|hubungkan.*admin|sambungkan.*admin|hubungi admin|daftar admin|pic agent/.test(text)) {
      return {
        tutorialId: isSales ? "handoff" : undefined,
        text: "Handoff ke admin (demo whatsapp:handoff):\n1. Anggun — Admin · wa.me/628111000001\n2. Rudi — PIC Agent Officer · wa.me/628111000002\n\nPilih nomor/nama admin. Di production Falcon menampilkan daftar PIC lalu memproses handoff tanpa konfirmasi ulang setelah dipilih.",
      };
    }

    // 7) Generate konten / image
    if (/caption|konten|promo|image generation|generate (gambar|image|konten)|buat (caption|konten|copy)/.test(text)) {
      const unit = this.pickUnitsForChat(text, 1)[0];
      const label = unit ? `${unit.brand} ${unit.type} ${unit.year}` : "unit Ready pilihan";
      return {
        tutorialId: isSales ? "content" : undefined,
        text: `Konten promo (demo image_generation) untuk ${label}:\n\n“🔥 Ready stok ${label}! Kilometer rapi, full original, siap survey. DP ringan & proses kredit dibantu sampai approved. Chat sekarang — slot unit terbatas.”\n\nDi Motovax, Falcon bisa bantu draft caption + generate visual sesuai unit tenant.`,
      };
    }

    // 8) Foto
    if (/minta foto|kirim foto|foto unit|lihat foto/.test(text)) {
      const units = this.pickUnitsForChat(text, 2);
      return {
        tutorialId: isSales ? "photo" : undefined,
        photos: units.map((u) => ({
          label: `${u.brand} ${u.type}`,
          meta: `${u.year} · ${this.titleCase(u.branch || "")} · mock foto`,
        })),
        text: units.length
          ? `Berikut foto unit (mock photo_send) untuk ${units.map((u) => `${u.brand} ${u.type}`).join(" & ")}. Di Mobix foto dikirim dari galeri tenant.`
          : "Belum ada unit cocok. Sebut merek/tipe unit dulu, ya.",
      };
    }

    // 9) Simulasi kredit
    if (/simulasi|kredit|cicilan|dp |angsuran|asuransi/.test(text)) {
      const unit = this.pickUnitsForChat(text, 1)[0];
      const price = unit?.cashPrice || unit?.cash_price || 250000000;
      const dp = Math.round(price * 0.2);
      const angsuran = Math.round((price - dp) / 48);
      return {
        tutorialId: isSales ? "finance" : undefined,
        text: unit
          ? `Simulasi kredit (demo finance_simulation) ${unit.brand} ${unit.type}:\n• OTR ~ ${this.formatPrice(price)}\n• DP 20% ~ ${this.formatPrice(dp)}\n• Tenor 48 bln → angsuran ~ ${this.formatPrice(angsuran)}/bln\n• Asuransi: bisa dihitung ADDM/ADDB di production\n\nRumus penuh mengikuti KKB tenant Motovax.`
          : "Simulasi kredit aktif. Sebut unit-nya (contoh Innova / Xpander) agar saya hitung DP & angsuran demo.",
      };
    }

    // 10) Edit unit (Management)
    if (/ubah status|edit unit|update unit|jadi booked|jadi ready|unit_edit|ganti harga jual/.test(text)) {
      if (isSales) {
        return {
          text: "Edit unit penuh (whatsapp:unit_edit) hanya untuk Management/Admin. Sales Agent boleh cek stok & minta foto, tapi tidak mengubah status/harga master unit. Ketik “Ganti ke Management Agent” untuk demo edit.",
        };
      }
      const unit = this.pickUnitsForChat(text, 1)[0];
      const label = unit ? `${unit.brand} ${unit.type}` : "unit demo";
      return {
        tutorialId: "unit_edit",
        text: `Edit unit (simulasi unit_edit) ✅\n• Unit: ${label}\n• Status → BOOKED (demo)\n• Catatan: “Di-hold untuk customer survey”\n\nDi production Falcon memvalidasi permission whatsapp:unit_edit sebelum menulis ke inventory.`,
      };
    }

    // 11) Dokumen (Management)
    if (/dokumen|document|stnk|bpkb|upload dokumen|review dokumen/.test(text)) {
      if (isSales) {
        return {
          text: "Upload/review dokumen unit (document_upload / document_review) adalah capability Management. Sales Agent tidak memproses unggahan dokumen legal lewat Falcon. Ganti ke Management Agent untuk demo.",
        };
      }
      return {
        tutorialId: "document",
        text: "Dokumen (simulasi Management) ✅\n• Jenis: STNK + BPKB (mock)\n• Status review: lengkap · 2 file\n• Unit tertaut: inventaris demo\n\nDi production Falcon memandu upload via WA lalu menandai review sesuai permission.",
      };
    }

    // 12) Import
    if (/import|upload data|excel|handover|mrp/.test(text)) {
      if (isSales) {
        return {
          text: "Import Excel inventory / handover / MRP (whatsapp:excel_import) adalah capability Management/Admin. Role Sales Agent tidak memproses import massal lewat Falcon. Ganti ke Management Agent untuk mencoba alur simulasi.",
        };
      }
      return {
        tutorialId: "import",
        text: "Import (simulasi Management / excel_import):\n• File: inventory_demo.xlsx\n• Baris diproses: 48\n• Unit diupdate: 45\n• Warning: 3 baris perlu cek plate\n\nDi production Falcon memvalidasi baris & warning seperti di Upload Data SMI.",
      };
    }

    // 13) Unit query / stok
    if (
      /unit|stok|tanya|halo|ready|innova|xpander|rush|hr-v|mobilio|serena|toyota|honda|mitsubishi|nissan|daihatsu|bmw|mazda/.test(
        text,
      )
    ) {
      const units = this.pickUnitsForChat(text, 3);
      if (!units.length) {
        return {
          text: "Stok demo belum termuat. Coba buka Manajemen Unit dulu atau Reset demo.",
        };
      }
      const lines = units.map(
        (u) =>
          `• ${u.brand} ${u.type} ${u.year} — ${this.statusLabel(u.status)} · ${this.titleCase(u.branch || "-")} · OTR ${this.formatCompactPrice(u.cashPrice || u.cash_price || 0)}`,
      );
      return {
        tutorialId: isSales ? "unit" : undefined,
        text: `Berikut unit yang cocok (unit_query, data demo real-like):\n${lines.join("\n")}\n\nMau foto, simulasi kredit, atau detail salah satu unit?`,
      };
    }

    return {
      text: isSales
        ? "Saya Falcon (Sales Agent). Coba chip fitur di kiri, “tampilkan semua fitur sales”, tanya unit, minta foto, simulasi kredit, catat lead, handoff, atau “Ganti ke Management Agent”."
        : "Saya Falcon (Management Agent). Coba “tampilkan semua fitur management”, laporan stok/aging, GP, import, edit unit, dokumen, atau “Kembali ke Sales Agent”.",
    };
  }

  salesFeaturesText() {
    return (
      "📦 Fitur Falcon — Sales Agent (dari Motovax / role Salesperson)\n\n" +
      "Yang BISA dilakukan:\n" +
      "1. Cek stok & detail unit — whatsapp:unit_query\n" +
      "   Coba: “Halo mau tanya Innova / Xpander”\n" +
      "2. Minta foto unit — whatsapp:photo_send\n" +
      "   Coba: “Minta foto”\n" +
      "3. Upload foto update stok (via lampiran WA)\n" +
      "   Coba: tekan 📎 di composer\n" +
      "4. Simulasi kredit & asuransi — whatsapp:finance_simulation\n" +
      "   Coba: “Simulasi kredit 20% DP 48 bulan”\n" +
      "5. Lokasi showroom / map\n" +
      "   Coba: “Lokasi showroom”\n" +
      "6. Catat lead milik sendiri — whatsapp:lead_own\n" +
      "   Coba: “Catat lead Budi 0812… minat Innova”\n" +
      "7. Handoff customer ke admin — whatsapp:handoff\n" +
      "   Coba: “Hubungkan customer ke admin”\n" +
      "8. Generate konten / caption — whatsapp:image_generation\n" +
      "   Coba: “Buat caption promo unit”\n" +
      "9. Performa sales sendiri — analytics:sales_performance\n" +
      "   Coba: “Performa sales saya”\n\n" +
      "❌ Tidak bisa (role Sales):\n" +
      "• Laporan aging / GP / margin / tren cabang (butuh Management)\n" +
      "• Import Excel inventory massal\n" +
      "• Edit unit penuh (status/harga master)\n" +
      "• Upload/review dokumen legal unit\n" +
      "• Data internal: HPP, harga beli, bottom price, profit\n\n" +
      "Centang checklist di kiri sambil mencoba tiap fitur. Data demo, bukan production."
    );
  }

  managementFeaturesText() {
    return (
      "📊 Fitur Falcon — Management Agent (dari Motovax / role Management)\n\n" +
      "Termasuk semua kemampuan Sales, plus:\n" +
      "1. Laporan stok per cabang — inventory analysis\n" +
      "   Coba: “Laporan stok per cabang”\n" +
      "2. Laporan aging unit\n" +
      "   Coba: “Laporan aging unit”\n" +
      "3. Insight GP / margin (tanpa guardrail harga internal)\n" +
      "   Coba: “Gross profit margin unit”\n" +
      "4. Import Excel inventory / handover / MRP — whatsapp:excel_import\n" +
      "   Coba: “Import inventory lewat WA”\n" +
      "5. Edit data & status unit — whatsapp:unit_edit\n" +
      "   Coba: “Ubah status unit jadi Booked”\n" +
      "6. Upload & review dokumen — document_upload / document_review\n" +
      "   Coba: “Upload dokumen unit”\n" +
      "7. Analisis inventory & rekomendasi stok\n" +
      "   Coba: “Analisis inventory dan rekomendasi stok”\n" +
      "8. Analytics / tren penjualan — whatsapp:analytics_query, analytics:*\n" +
      "   Coba: “Tren penjualan bulan ini”\n" +
      "9. Media upload & operasional inventory seperti admin\n" +
      "10. Konfigurasi user/role/tenant (sesuai permission penuh)\n\n" +
      "Centang checklist di kiri untuk menyelesaikan tutorial Management. Data mock demo."
    );
  }

  buildManagementReport(text) {
    const rows = this.getBranchSummaries();
    if (/aging/.test(text)) {
      const aged = [...(this.units.length ? this.units : inventoryDemoSeed)]
        .sort((a, b) => (b.aging || 0) - (a.aging || 0))
        .slice(0, 4);
      const lines = aged.map(
        (u) =>
          `• ${u.brand} ${u.type} — ${u.aging || 0} hari · ${this.titleCase(u.branch || "-")}`,
      );
      return {
        tutorialId: "report_aging",
        text: `Laporan aging (demo):\n${lines.join("\n")}\n\nRekomendasi: unit >60 hari diprioritaskan promo / penyesuaian harga. Data mock real-like, bukan production.`,
      };
    }
    if (/gross|margin|gp|profit/.test(text)) {
      return {
        tutorialId: "gp",
        text: "Insight GP/margin (demo Management):\n• Rata-rata GP prediksi demo ~8–12% unit Ready Cinere & Pondok Bambu\n• Unit aging tinggi: margin ditekan — pertimbangkan promo\n\nSales Agent tidak boleh melihat angka ini. Angka di sini ilustratif untuk tutorial.",
      };
    }
    if (/analisis|rekomendasi stok|inventory analysis/.test(text)) {
      return {
        tutorialId: "analysis",
        text: "Analisis inventory (demo Management):\n• Ready tinggi di Cinere — dorong campaign lokal\n• Pondok Bambu: 3 unit aging >90 hari → prioritas diskon/PD form\n• Rasio foto lengkap: ~70% — lengkapi galeri agar Falcon photo_send optimal\n\nRekomendasi: fokus promo MPV Ready + lengkapi foto unit tanpa media.",
      };
    }
    if (/tren|analitik|analytics|penjualan|conversion|performa tim/.test(text)) {
      return {
        tutorialId: "analytics",
        text: "Analytics / tren penjualan (demo):\n• Lead masuk 30 hari: 420 (+12% MoM)\n• Closing: 38 unit · conversion ~9%\n• Channel terkuat: WhatsApp & Walk-in\n• Unit terlaris: Innova, Xpander, HR-V\n\nSumber production: whatsapp:analytics_query + analytics:management / sales_trend.",
      };
    }
    const lines = rows.length
      ? rows.map(
          (r) =>
            `• ${this.titleCase(r.branch)}: Ready ${r.ready}, Booked ${r.booked}, Sold ${r.sold}, total ${r.total}`,
        )
      : ["• Belum ada ringkasan cabang — muat data inventory dulu."];
    return {
      tutorialId: "report_branch",
      reportHtml: `<div class="wa-report">${rows
        .slice(0, 4)
        .map(
          (r) =>
            `<div><b>${this.escapeHtml(this.titleCase(r.branch))}</b><span>R ${r.ready} · B ${r.booked}</span></div>`,
        )
        .join("")}</div>`,
      text: `Laporan stok per cabang (demo):\n${lines.join("\n")}\n\nIni capability Management (inventory analysis). Ketik “laporan aging” atau “tren penjualan” untuk insight lain.`,
    };
  }

  pickUnitsForChat(text, limit = 3) {
    const source = this.units.length ? this.units : inventoryDemoSeed;
    const q = String(text || "").toLocaleLowerCase("id");
    const scored = source.map((unit) => {
      const hay = `${unit.brand} ${unit.type} ${unit.plate || ""}`.toLocaleLowerCase("id");
      let score = 0;
      for (const token of hay.split(/\s+/)) {
        if (token.length > 2 && q.includes(token)) score += 2;
      }
      if (String(unit.status).toUpperCase().includes("READY")) score += 0.5;
      return { unit, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const matched = scored.filter((s) => s.score >= 2).map((s) => s.unit);
    if (matched.length) return matched.slice(0, limit);
    return source.slice(0, limit);
  }

  getBranchSummaries() {
    const map = new Map();
    for (const unit of this.units) {
      const key = (unit.branch || "Lainnya").toLocaleUpperCase("id");
      if (!map.has(key)) {
        map.set(key, {
          branch: key,
          ready: 0,
          booked: 0,
          sold: 0,
          total: 0,
          withPhotos: 0,
          withoutPhotos: 0,
        });
      }
      const row = map.get(key);
      row.total += 1;
      if (unit.status === "UNIT READY") row.ready += 1;
      if (unit.status === "BOOKED") row.booked += 1;
      if (unit.status === "SOLD") row.sold += 1;
      if ((unit.photos || 0) > 0) row.withPhotos += 1;
      else if (unit.status !== "SOLD") row.withoutPhotos += 1;
    }
    return [...map.values()].sort((a, b) => a.branch.localeCompare(b.branch, "id"));
  }

  renderBranchSummary() {
    if (!this.branchTotals || !this.branchGrid) return;
    const rows = this.getBranchSummaries();
    const totals = rows.reduce(
      (acc, row) => {
        acc.stock += row.ready + row.booked;
        acc.ready += row.ready;
        acc.booked += row.booked;
        acc.withPhotos += row.withPhotos;
        acc.withoutPhotos += row.withoutPhotos;
        return acc;
      },
      { stock: 0, ready: 0, booked: 0, withPhotos: 0, withoutPhotos: 0 },
    );

    this.branchTotals.innerHTML = `
      <button type="button" data-ims-branch-filter="ALL" data-ims-status-filter="ALL">
        <small>Stok Cabang</small><b>${totals.stock}</b>
      </button>
      <button type="button" data-ims-branch-filter="ALL" data-ims-status-filter="UNIT READY">
        <small>Ready</small><b>${totals.ready}</b>
      </button>
      <button type="button" data-ims-branch-filter="ALL" data-ims-status-filter="BOOKED">
        <small>Booked</small><b>${totals.booked}</b>
      </button>
      <button type="button" class="sky" data-ims-branch-filter="ALL" data-ims-status-filter="ALL">
        <small>Ada Foto</small><b>${totals.withPhotos}</b>
      </button>
      <button type="button" class="rose" data-ims-branch-filter="ALL" data-ims-status-filter="ALL">
        <small>Tanpa Foto</small><b>${totals.withoutPhotos}</b>
      </button>
    `;

    if (!rows.length) {
      this.branchGrid.innerHTML = `
        <div class="ims-branch-empty">
          <b>Belum ada data cabang</b>
          <p>${this.dataError || "Muat ulang demo untuk mengambil stok tenant."}</p>
        </div>
      `;
      return;
    }

    this.branchGrid.innerHTML = rows
      .map(
        (row) => `
        <article class="ims-branch-card">
          <header>
            <span class="ims-branch-pin" aria-hidden="true">📍</span>
            <div>
              <b>${this.titleCase(row.branch)}</b>
              <span>${row.total} unit tercatat</span>
            </div>
          </header>
          <div class="ims-branch-metrics">
            <button type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="UNIT READY">
              <small>Ready</small><b>${row.ready}</b>
            </button>
            <button type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="BOOKED">
              <small>Booked</small><b>${row.booked}</b>
            </button>
            <button type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="SOLD">
              <small>Sold</small><b>${row.sold}</b>
            </button>
            <button type="button" class="sky" data-ims-branch-filter="${row.branch}" data-ims-status-filter="ALL">
              <small>Foto</small><b>${row.withPhotos}</b>
            </button>
          </div>
          <button class="ims-branch-open" type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="ALL">
            Buka di Manajemen Unit →
          </button>
        </article>
      `,
      )
      .join("");
  }

  renderUploadMeta() {
    const withPhotos = this.units.filter((unit) => (unit.photos || 0) > 0).length;
    const withoutPhotos = this.units.filter(
      (unit) => unit.status !== "SOLD" && (unit.photos || 0) === 0,
    ).length;
    const missing = this.root.querySelector("[data-ims-photo-missing]");
    const ready = this.root.querySelector("[data-ims-photo-ready]");
    if (missing) missing.textContent = String(withoutPhotos);
    if (ready) ready.textContent = String(withPhotos);
  }

  getVisibleUnits() {
    const branchFilter = String(this.branch || "ALL").toLocaleUpperCase("id");
    const visible = this.units.filter((unit) => {
      const matchesStatus = this.status === "ALL" || unit.status === this.status;
      const unitBranch = String(unit.branch || "").toLocaleUpperCase("id");
      const matchesBranch = branchFilter === "ALL" || unitBranch === branchFilter;
      const haystack = `${unit.brand} ${unit.type} ${unit.plate}`.toLocaleLowerCase("id");
      return matchesStatus && matchesBranch && haystack.includes(this.query);
    });

    return visible.sort((left, right) => {
      if (this.sort === "oldest") return right.aging - left.aging;
      if (this.sort === "price-high") return right.cashPrice - left.cashPrice;
      if (this.sort === "price-low") return left.cashPrice - right.cashPrice;
      return left.aging - right.aging;
    });
  }

  render() {
    const visibleUnits = this.getVisibleUnits();
    this.renderStats();
    this.renderFilters();
    this.renderTable(visibleUnits);
    this.renderMobileList(visibleUnits);
    this.renderBranchSummary();
    this.renderUploadMeta();
    this.resultCount.textContent = this.dataError ||
      `${visibleUnits.length} dari ${this.units.length} unit ditampilkan`;
    this.emptyState.hidden = visibleUnits.length > 0;
  }

  renderStats() {
    const counts = this.units.reduce(
      (total, unit) => {
        total.all += 1;
        if (unit.status === "UNIT READY") total.ready += 1;
        if (unit.status === "BOOKED") total.booked += 1;
        if (unit.status === "SOLD") total.sold += 1;
        return total;
      },
      { all: 0, ready: 0, booked: 0, sold: 0 },
    );

    this.root.querySelector("[data-stat-all]").textContent = String(counts.all);
    this.root.querySelector("[data-stat-ready]").textContent = String(counts.ready);
    this.root.querySelector("[data-stat-booked]").textContent = String(counts.booked);
    this.root.querySelector("[data-stat-sold]").textContent = String(counts.sold);
  }

  renderFilters() {
    for (const button of this.root.querySelectorAll("[data-status-filter]")) {
      button.classList.toggle("active", button.dataset.statusFilter === this.status);
    }
  }

  renderTable(units) {
    this.tableBody.innerHTML = units
      .map(
        (unit) => `
          <tr data-unit-id="${unit.id}" tabindex="0" aria-label="Buka detail ${unit.brand} ${unit.type}">
            <td>
              <div class="demo-unit-cell">
                ${
                  unit.photoUrl
                    ? `<span class="demo-unit-thumb has-photo"><img src="${unit.photoUrl}" alt="" loading="lazy" /></span>`
                    : `<span class="demo-unit-thumb">${this.initials(unit.brand)}</span>`
                }
                <div>
                  <b>${unit.brand} ${unit.type}</b>
                  <span>${unit.color} · ${unit.year} · ${unit.photos || 0} foto</span>
                </div>
              </div>
            </td>
            <td><span class="demo-plate">${unit.plate}</span></td>
            <td><div class="demo-cell-stack"><b>${unit.buyingPrice ? this.formatCompactPrice(unit.buyingPrice) : "Privat"}</b><span>${unit.buyingPrice ? "Modal awal" : "Tidak ditampilkan"}</span></div></td>
            <td><div class="demo-cell-stack"><b class="price">${this.formatCompactPrice(unit.cashPrice)}</b><span>Kredit ${this.formatCompactPrice(unit.creditPrice)}</span></div></td>
            <td><div class="demo-cell-stack"><b>${unit.odometer.toLocaleString("id-ID")} KM</b><span class="demo-aging ${unit.aging >= 60 ? "high" : ""}">${unit.aging} hari di stok</span></div></td>
            <td><div class="demo-cell-stack"><b>${this.titleCase(unit.branch)}</b><span>${unit.position}</span></div></td>
            <td style="text-align:center"><span class="demo-status ${this.statusClass(unit.status)}">${this.statusLabel(unit.status)}</span></td>
          </tr>
        `,
      )
      .join("");
  }

  renderMobileList(units) {
    this.mobileList.innerHTML = units
      .map(
        (unit) => `
          <article class="demo-mobile-card" data-unit-id="${unit.id}" tabindex="0" aria-label="Buka detail ${unit.brand} ${unit.type}">
            <div class="demo-mobile-card-top">
              <div>
                <h3>${unit.brand} ${unit.type}</h3>
                <span class="demo-plate">${unit.plate}</span>
              </div>
              <span class="demo-status ${this.statusClass(unit.status)}">${this.statusLabel(unit.status)}</span>
            </div>
            <div class="demo-mobile-card-meta">
              <div><small>Harga Jual</small><b>${this.formatCompactPrice(unit.cashPrice)}</b></div>
              <div><small>Cabang</small><b>${this.titleCase(unit.branch)}</b></div>
              <div><small>Odometer</small><b>${unit.odometer.toLocaleString("id-ID")} KM</b></div>
              <div><small>Aging</small><b class="demo-aging ${unit.aging >= 60 ? "high" : ""}">${unit.aging} hari</b></div>
            </div>
          </article>
        `,
      )
      .join("");
  }

  handleUnitActivation(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const target = event.target.closest("[data-unit-id]");
    if (!target) return;
    if (event.type === "keydown") event.preventDefault();
    this.openDetail(target.dataset.unitId);
  }

  openDetail(unitId) {
    const unit = this.units.find((item) => item.id === unitId);
    if (!unit) return;
    this.selectedId = unit.id;
    this.closeGuide();
    this.populateDetail(unit);
    this.detailBackdrop.hidden = false;
    this.detailPanel.classList.add("is-open");
    this.detailPanel.setAttribute("aria-hidden", "false");
    this.detailPanel.querySelector("[data-close-demo-detail]").focus();
  }

  populateDetail(unit) {
    this.root.querySelector("[data-detail-name]").textContent = `${unit.brand} ${unit.type}`;
    this.root.querySelector("[data-detail-brand]").textContent = this.initials(unit.brand);
    const statusElement = this.root.querySelector("[data-detail-status]");
    statusElement.className = `demo-status ${this.statusClass(unit.status)}`;
    statusElement.textContent = this.statusLabel(unit.status);
    this.root.querySelector("[data-detail-plate]").textContent = unit.plate;
    this.root.querySelector("[data-detail-price]").textContent = this.formatPrice(unit.cashPrice);
    this.root.querySelector("[data-detail-credit]").textContent =
      `Harga kredit ${this.formatPrice(unit.creditPrice)}`;
    this.root.querySelector("[data-detail-year]").textContent = String(unit.year);
    this.root.querySelector("[data-detail-transmission]").textContent = unit.transmission;
    this.root.querySelector("[data-detail-color]").textContent = unit.color;
    this.root.querySelector("[data-detail-odometer]").textContent =
      `${unit.odometer.toLocaleString("id-ID")} KM`;
    this.root.querySelector("[data-detail-branch]").textContent = this.titleCase(unit.branch);
    this.root.querySelector("[data-detail-position]").textContent = unit.position;
    this.root.querySelector("[data-detail-aging]").textContent = `${unit.aging} hari`;
    this.root.querySelector("[data-detail-source]").textContent = unit.source;

    const carVisual = this.root.querySelector(".demo-detail-car");
    const carPhoto = this.root.querySelector("[data-detail-photo]");
    if (carVisual && carPhoto) {
      if (unit.photoUrl) {
        carPhoto.src = unit.photoUrl;
        carPhoto.hidden = false;
        carPhoto.alt = `${unit.brand} ${unit.type}`;
        carVisual.classList.add("has-photo");
      } else {
        carPhoto.removeAttribute("src");
        carPhoto.hidden = true;
        carVisual.classList.remove("has-photo");
      }
    }

    const bodyEl = this.root.querySelector("[data-detail-body]");
    const fuelEl = this.root.querySelector("[data-detail-fuel]");
    const engineEl = this.root.querySelector("[data-detail-engine]");
    const seatsEl = this.root.querySelector("[data-detail-seats]");
    if (bodyEl) bodyEl.textContent = unit.bodyType || "—";
    if (fuelEl) fuelEl.textContent = unit.fuel || "—";
    if (engineEl) engineEl.textContent = unit.engine || "—";
    if (seatsEl) seatsEl.textContent = unit.seats ? `${unit.seats} penumpang` : "—";

    const featuresEl = this.root.querySelector("[data-detail-features]");
    if (featuresEl) {
      const list = Array.isArray(unit.features) && unit.features.length ? unit.features : [];
      featuresEl.innerHTML = list.length
        ? list.map((f) => `<li>${f}</li>`).join("")
        : "<li>Fitur unit akan dilengkapi dari master data tenant.</li>";
    }

    this.root.querySelector("[data-detail-insight]").textContent =
      unit.aging >= 60
        ? "Aging unit melewati 60 hari. Pertimbangkan penyesuaian harga atau promosi untuk mempercepat perputaran stok."
        : "Aging unit masih sehat. Harga jual berada dalam rentang yang kompetitif untuk cabang ini.";

    this.bookingButton.disabled = unit.status !== "UNIT READY";
    this.bookingButton.textContent =
      unit.status === "SOLD"
        ? "Unit sudah terjual"
        : unit.status === "BOOKED"
          ? "Unit sudah di-booking"
          : "Booking unit ini";
    this.bookingCopy.textContent = unit.bookedBy
      ? `${unit.bookedBy} tercatat booking ${unit.brand} ${unit.type} ${unit.year} di tenant demo.`
      : unit.status === "BOOKED"
        ? "Unit ini sudah berstatus Booked di tenant demo."
        : "Minat booking tersimpan di tenant demo; status unit asli tidak diubah.";
  }

  closeDetail() {
    this.detailPanel.classList.remove("is-open");
    this.detailPanel.setAttribute("aria-hidden", "true");
    this.detailBackdrop.hidden = true;
  }

  async bookSelectedUnit() {
    const unit = this.units.find((item) => item.id === this.selectedId);
    if (!unit || unit.status !== "UNIT READY") return;
    this.bookingButton.disabled = true;
    this.bookingButton.textContent = "Menyimpan ke tenant demo…";
    try {
      const booking = await publicDemoData.submit("inventory_interest", {
        unit_id: unit.id,
        unit_interest: `${unit.brand} ${unit.type} ${unit.year}`,
      });
      const customerName = String(booking.customer_name || "").trim();
      if (!customerName) throw new Error("Identitas pengunjung demo belum tersedia.");
      unit.status = "BOOKED";
      unit.bookedBy = customerName;
      this.populateDetail(unit);
      this.render();
      this.toast.querySelector("b").textContent = `${customerName} sudah booking`;
      this.toast.querySelector("p").textContent =
        `${unit.brand} ${unit.type} ${unit.year} tercatat di tenant demo MotoVax App.`;
      this.toast.hidden = false;
    } catch (error) {
      this.bookingButton.disabled = false;
      this.bookingButton.textContent = "Booking unit ini";
      this.toast.querySelector("b").textContent = "Belum berhasil disimpan";
      this.toast.querySelector("p").textContent = error.message;
      this.toast.hidden = false;
    }
  }

  statusClass(status) {
    if (status === "BOOKED") return "booked";
    if (status === "SOLD") return "sold";
    return "ready";
  }

  statusLabel(status) {
    if (status === "UNIT READY") return "UNIT READY";
    return status;
  }

  initials(brand) {
    return brand.slice(0, 3).toLocaleUpperCase("id");
  }

  titleCase(value) {
    return value
      .toLocaleLowerCase("id")
      .replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("id"));
  }

  formatPrice(value) {
    return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
  }

  formatCompactPrice(value) {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
    }
    return `Rp ${(value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} jt`;
  }
}

const inventoryDemoMount = document.getElementById("inventoryDemo");
if (inventoryDemoMount) {
  new InventoryProductDemo(inventoryDemoMount);
}

const crmIntentLabels = {
  aware: "Contacted",
  considering: "Interested",
  comparing: "Viewing",
  ready_to_buy: "Negotiation",
  postponed: "Postponed",
};

function crmResolveUnit(unitId) {
  return inventoryDemoSeed.find((u) => u.id === unitId) || null;
}

function crmUnitLabel(unit) {
  if (!unit) return "Unit Motovax";
  return `${unit.brand} ${unit.type} ${unit.year}`;
}

function crmLeadValue(lead) {
  if (typeof lead.value === "number" && lead.value > 0) return lead.value;
  const unit = crmResolveUnit(lead.unitId);
  return unit?.cashPrice || 0;
}

const crmDemoSeed = [
  {
    id: "lead-nadia",
    name: "Nadia Demo",
    unitId: "unit-006",
    stage: "warm",
    score: 62,
    value: null,
    days: 8,
    source: "whatsapp",
    intent: "considering",
    handler: "AI Bot · Dimas",
    ai: true,
    phone: "62812****901",
    summary:
      "Nadia menanyakan cicilan Xpander Ultimate dan sudah menyebut kisaran uang muka. Respons terakhir positif, tetapi belum ada tindak lanjut selama 8 hari.",
    recommendation: "Kirim simulasi cicilan dan tawarkan jadwal test drive.",
    message:
      "Halo Kak Nadia, saya Dimas dari Motovax. Simulasi cicilan Xpander Ultimate (B 1206 MVX) yang Kakak tanyakan sudah siap. Boleh saya kirimkan rinciannya sekaligus bantu jadwalkan test drive minggu ini?",
    events: [
      { icon: "WA", title: "Menanyakan simulasi cicilan", detail: "WhatsApp masuk", time: "8 hari lalu" },
      { icon: "AI", title: "AI mengidentifikasi minat tinggi", detail: "Intent: financing", time: "8 hari lalu" },
      { icon: "D", title: "Dialihkan ke Dimas", detail: "Sales consultant", time: "8 hari lalu" },
    ],
  },
  {
    id: "lead-bayu",
    name: "Bayu Prakoso",
    unitId: "unit-012",
    stage: "cold",
    score: 28,
    value: null,
    days: 2,
    source: "instagram",
    intent: "aware",
    handler: "AI Bot · Rani",
    ai: true,
    phone: "62813****442",
    summary: "Bayu menyimpan konten Raize GR Sport dari Instagram dan baru menanyakan ketersediaan warna.",
    recommendation: "Kirim pilihan warna dan foto unit stok yang tersedia.",
    message:
      "Halo Kak Bayu, warna Toyota Raize GR Sport yang Kakak tanyakan masih tersedia di showroom Cinere. Saya bisa kirim foto unit dan detail harganya di sini.",
    events: [
      { icon: "IG", title: "Membalas Instagram Story", detail: "Instagram DM", time: "2 hari lalu" },
      { icon: "AI", title: "AI menjawab ketersediaan", detail: "Respons otomatis", time: "2 hari lalu" },
    ],
  },
  {
    id: "lead-sinta",
    name: "Sinta Maharani",
    unitId: "unit-010",
    stage: "cold",
    score: 34,
    value: null,
    days: 5,
    source: "facebook",
    intent: "aware",
    handler: "AI Bot",
    ai: true,
    phone: "62821****118",
    summary: "Sinta mengisi formulir iklan BR-V dan tertarik trade-in, tetapi belum memberi detail unit lama.",
    recommendation: "Minta data singkat unit trade-in untuk estimasi awal.",
    message:
      "Halo Kak Sinta, terima kasih sudah tertarik dengan Honda BR-V Prestige. Boleh kirim tipe, tahun, dan foto unit lama agar tim kami bantu estimasi trade-in?",
    events: [
      { icon: "FB", title: "Lead dari Facebook Ads", detail: "Form iklan", time: "5 hari lalu" },
      { icon: "AI", title: "Lead berhasil dikualifikasi", detail: "Minat: trade-in", time: "5 hari lalu" },
    ],
  },
  {
    id: "lead-andi",
    name: "Andi Saputra",
    unitId: "unit-002",
    stage: "warm",
    score: 55,
    value: null,
    days: 4,
    source: "excel_import",
    intent: "considering",
    handler: "Ayu",
    ai: false,
    phone: "62856****773",
    summary: "Andi berasal dari daftar pameran dan sudah menerima katalog harga Rush G AT.",
    recommendation: "Konfirmasi kebutuhan tenor dan target pembelian.",
    message:
      "Halo Pak Andi, saya Ayu dari Motovax. Apakah katalog Toyota Rush sudah sempat dilihat? Saya bisa bantu hitungkan cicilan sesuai tenor yang Bapak inginkan.",
    events: [
      { icon: "XL", title: "Diimpor dari daftar pameran", detail: "Excel Import", time: "6 hari lalu" },
      { icon: "A", title: "Katalog dikirim oleh Ayu", detail: "Aktivitas sales", time: "4 hari lalu" },
    ],
  },
  {
    id: "lead-farhan",
    name: "Farhan Rizki",
    unitId: "unit-004",
    stage: "warm",
    score: 58,
    value: null,
    days: 7,
    source: "whatsapp",
    intent: "comparing",
    handler: "AI Bot · Dimas",
    ai: true,
    phone: "62818****905",
    summary: "Farhan meminta video kondisi interior HR-V dan membandingkan dua pilihan unit.",
    recommendation: "Kirim video walkaround dan tekankan hasil inspeksi.",
    message:
      "Halo Kak Farhan, video interior HR-V S CVT dan ringkasan inspeksinya sudah siap. Saya kirimkan sekarang agar Kakak bisa membandingkan kedua unitnya.",
    events: [
      { icon: "WA", title: "Meminta video unit", detail: "WhatsApp masuk", time: "7 hari lalu" },
      { icon: "AI", title: "Kebutuhan dicatat AI", detail: "Intent: unit comparison", time: "7 hari lalu" },
    ],
  },
  {
    id: "lead-rizky",
    name: "Rizky Ramadhan",
    unitId: "unit-007",
    stage: "hot",
    score: 88,
    value: null,
    days: 1,
    source: "whatsapp",
    intent: "ready_to_buy",
    handler: "Rani",
    ai: false,
    phone: "62877****221",
    summary: "Rizky sudah menyetujui kisaran cicilan Ertiga Hybrid dan ingin melihat unit akhir pekan ini.",
    recommendation: "Kunci jadwal test drive dan siapkan unit di Bekasi.",
    message:
      "Halo Pak Rizky, kami siap jadwalkan test drive Ertiga GX Hybrid akhir pekan ini. Bapak lebih nyaman datang Sabtu atau Minggu?",
    events: [
      { icon: "WA", title: "Menyetujui kisaran cicilan", detail: "WhatsApp", time: "1 hari lalu" },
      { icon: "R", title: "Rani menawarkan test drive", detail: "Aktivitas sales", time: "1 hari lalu" },
    ],
  },
  {
    id: "lead-laras",
    name: "Laras Wulandari",
    unitId: "unit-009",
    stage: "hot",
    score: 79,
    value: null,
    days: 3,
    source: "instagram",
    intent: "ready_to_buy",
    handler: "AI Bot · Ayu",
    ai: true,
    phone: "62896****334",
    summary: "Laras sudah mengirim KTP untuk pengecekan awal Rocky dan menunggu paket pembiayaan.",
    recommendation: "Kirim dua opsi paket pembiayaan terbaik.",
    message:
      "Halo Kak Laras, pengecekan awal sudah selesai. Saya punya dua pilihan paket pembiayaan Rocky yang paling sesuai. Boleh saya kirimkan perbandingannya?",
    events: [
      { icon: "IG", title: "Melanjutkan chat dari Instagram", detail: "Instagram DM", time: "3 hari lalu" },
      { icon: "AI", title: "Dokumen awal diterima", detail: "Dibantu AI", time: "3 hari lalu" },
    ],
  },
  {
    id: "lead-yoga",
    name: "Yoga Permana",
    unitId: "unit-008",
    stage: "prospect",
    score: 91,
    value: null,
    days: 1,
    source: "walk_in",
    intent: "ready_to_buy",
    handler: "Dimas",
    ai: false,
    phone: "62811****667",
    summary: "Yoga sudah test drive Avanza, memilih unit, dan sedang melengkapi dokumen pemesanan.",
    recommendation: "Pastikan kelengkapan dokumen dan konfirmasi metode pembayaran.",
    message:
      "Halo Pak Yoga, terima kasih sudah test drive Avanza. Saya bantu cek kembali kelengkapan dokumen agar proses pemesanannya bisa segera dilanjutkan.",
    events: [
      { icon: "TD", title: "Test drive selesai", detail: "Kunjungan showroom", time: "1 hari lalu" },
      { icon: "D", title: "Dokumen pemesanan diminta", detail: "Dimas", time: "1 hari lalu" },
    ],
  },
  {
    id: "lead-maya",
    name: "Maya Lestari",
    unitId: "unit-001",
    stage: "prospect",
    score: 86,
    value: null,
    days: 2,
    source: "excel_import",
    intent: "comparing",
    handler: "Ayu",
    ai: false,
    phone: "62852****890",
    summary: "Maya telah menerima penawaran final Serena HWS dan meminta waktu untuk persetujuan keluarga.",
    recommendation: "Follow-up singkat dengan masa berlaku penawaran.",
    message:
      "Halo Ibu Maya, saya ingin mengingatkan bahwa penawaran Serena HWS berlaku sampai Jumat. Jika ada bagian yang ingin didiskusikan bersama keluarga, saya siap membantu.",
    events: [
      { icon: "XL", title: "Lead pelanggan lama", detail: "Excel Import", time: "9 hari lalu" },
      { icon: "A", title: "Penawaran final dikirim", detail: "Ayu", time: "2 hari lalu" },
    ],
  },
];

const crmClosedSeed = [
  {
    id: "closed-raka",
    name: "Raka Demo",
    unitId: "unit-011",
    status: "deal",
    value: null,
  },
  {
    id: "closed-putri",
    name: "Putri Demo",
    unitId: "unit-004",
    status: "handover",
    value: null,
  },
];

const crmAutoFollowPrograms = [
  {
    id: "af-nurture",
    name: "New Lead Nurture 24j",
    type: "Nurture",
    channel: "WhatsApp",
    schedule: "Setiap hari 09:00",
    contacts: 42,
    active: true,
  },
  {
    id: "af-warm",
    name: "Warm ≥7 hari",
    type: "Follow-up",
    channel: "WhatsApp",
    schedule: "Sen–Jum 10:00",
    contacts: 18,
    active: true,
  },
  {
    id: "af-hot",
    name: "Hot closing push",
    type: "Hot FU",
    channel: "WA + Call task",
    schedule: "Setiap hari 14:00",
    contacts: 11,
    active: true,
  },
  {
    id: "af-reeng",
    name: "Re-engagement Cold 30h",
    type: "Re-engagement",
    channel: "WhatsApp",
    schedule: "Rabu 11:00",
    contacts: 27,
    active: false,
  },
];

const crmStageConfig = {
  cold: { label: "Cold", probability: 0.1 },
  warm: { label: "Warm", probability: 0.3 },
  hot: { label: "Hot", probability: 0.7 },
  prospect: { label: "Prospect", probability: 0.8 },
};

class AutopilotCRMDemo {
  constructor(root) {
    this.root = root;
    this.leads = this.cloneSeed();
    this.closed = this.cloneClosed();
    this.programs = crmAutoFollowPrograms.map((p) => ({ ...p }));
    this.cycleRun = 0;
    this.source = "all";
    this.query = "";
    this.customerQuery = "";
    this.mobileStage = "cold";
    this.view = "pipeline";
    this.selectedId = null;
    this.lastFocusedElement = null;
    this.hasOpenedGuide = false;
    this.guideStepIndex = 0;

    this.board = root.querySelector("[data-crm-board]");
    this.stageTabs = root.querySelector("[data-crm-stage-tabs]");
    this.searchInput = root.querySelector("[data-crm-search]");
    this.customerList = root.querySelector("[data-crm-customer-list]");
    this.customerSearch = root.querySelector("[data-crm-customer-search]");
    this.afList = root.querySelector("[data-crm-af-list]");
    this.detailPanel = root.querySelector(".crm-detail-panel");
    this.detailBackdrop = root.querySelector("[data-crm-detail-backdrop]");
    this.guide = root.querySelector("[data-crm-guide-popover]");
    this.toast = root.querySelector("[data-crm-toast]");
    this.messagePreview = root.querySelector("[data-crm-message-preview]");
    this.prepareButton = root.querySelector("[data-crm-prepare-followup]");
    this.closedList = root.querySelector("[data-crm-closed-list]");

    this.bind();
    this.switchView("pipeline");
    this.render();
  }

  cloneSeed() {
    return crmDemoSeed.map((lead) => ({
      ...lead,
      events: lead.events.map((event) => ({ ...event })),
    }));
  }

  cloneClosed() {
    return crmClosedSeed.map((item) => ({ ...item }));
  }

  guideSteps() {
    return [
      {
        view: "pipeline",
        title: "Menu Autopilot CRM",
        body: "Sidebar selaras Motovax: Customer, Pipeline, Auto Follow Customer, dan Panduan. Campaign diganti Auto Follow Customer.",
        enter: () => this.highlightAnchor("sidebar"),
      },
      {
        view: "pipeline",
        title: "Pipeline & filter",
        body: "Lihat nilai pipeline, forecast, dan KPI. Filter Semua / Omnichannel / Excel Import seperti di produk.",
        enter: () => {
          this.source = "all";
          this.render();
          this.highlightAnchor("kpi-grid");
        },
      },
      {
        view: "pipeline",
        title: "Lead prioritas Nadia",
        body: "Buka kartu Nadia Demo bertanda “Coba ini” — Warm, stale ≥7 hari, siap follow-up AI.",
        enter: () => {
          this.closeDetail();
          this.source = "all";
          this.mobileStage = "warm";
          this.render();
          this.highlightAnchor("board");
          requestAnimationFrame(() => {
            const card = this.root.querySelector('[data-lead-id="lead-nadia"]');
            card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
            card?.focus();
          });
        },
      },
      {
        view: "pipeline",
        title: "Unit = stok Motovax",
        body: "Detail lead menampilkan unit dari katalog inventory: plate, cabang, status, harga, dan fitur.",
        enter: () => {
          this.openDetail("lead-nadia", { keepGuide: true });
          this.highlightAnchor("unit-card");
        },
      },
      {
        view: "pipeline",
        title: "AI Co-Pilot",
        body: "Baca ringkasan AI dan rekomendasi berikutnya — input untuk follow-up otomatis.",
        enter: () => {
          this.openDetail("lead-nadia", { keepGuide: true });
          this.highlightAnchor("ai-summary");
        },
      },
      {
        view: "pipeline",
        title: "Simulasi follow-up AI",
        body: "Siapkan pesan WhatsApp buatan AI, lalu Kirim simulasi. Stage naik, skor naik — pesan tidak dikirim ke customer.",
        enter: () => {
          this.openDetail("lead-nadia", { keepGuide: true });
          this.prepareFollowup();
          this.highlightAnchor("followup");
        },
      },
      {
        view: "auto-follow",
        title: "Auto Follow Customer",
        body: "Program follow-up terjadwal (nurture, warm ≥7h, hot push). Ganti menu Campaign di Motovax.",
        enter: () => {
          this.closeDetail();
          this.highlightAnchor("auto-follow");
        },
      },
      {
        view: "pipeline",
        title: "Dampak di pipeline",
        body: "Setelah follow-up, lead pindah kolom dan forecast berubah. Siap ditutup sales. Selesai — silakan eksplor bebas.",
        enter: () => {
          this.closeDetail();
          this.mobileStage = this.leads.find((l) => l.id === "lead-nadia")?.stage || "hot";
          this.render();
          this.highlightAnchor("board");
        },
      },
    ];
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-crm-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }

    for (const button of this.root.querySelectorAll("[data-close-crm-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-crm-nav]");
      if (nav && this.root.contains(nav)) {
        this.switchView(nav.dataset.crmNav || "pipeline");
      }
    });

    for (const button of this.root.querySelectorAll("[data-crm-source]")) {
      button.addEventListener("click", () => {
        this.source = button.dataset.crmSource || "all";
        this.render();
      });
    }

    this.searchInput?.addEventListener("input", () => {
      this.query = this.searchInput.value.trim().toLocaleLowerCase("id");
      this.render();
    });

    this.customerSearch?.addEventListener("input", () => {
      this.customerQuery = this.customerSearch.value.trim().toLocaleLowerCase("id");
      this.renderCustomers();
    });

    this.board?.addEventListener("click", (event) => this.handleLeadActivation(event));
    this.board?.addEventListener("keydown", (event) => this.handleLeadActivation(event));
    this.customerList?.addEventListener("click", (event) => {
      const row = event.target.closest("[data-lead-id]");
      if (row) this.openDetail(row.dataset.leadId);
    });

    this.stageTabs?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-crm-stage]");
      if (!button) return;
      this.mobileStage = button.dataset.crmStage;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-close-crm-detail]")) {
      button.addEventListener("click", () => this.closeDetail());
    }
    this.detailBackdrop?.addEventListener("click", () => this.closeDetail());

    this.prepareButton?.addEventListener("click", () => this.prepareFollowup());
    this.root.querySelector("[data-crm-send-followup]")?.addEventListener("click", () => this.sendFollowup());
    this.root.querySelector("[data-crm-reset]")?.addEventListener("click", () => this.reset());

    for (const button of this.root.querySelectorAll("[data-crm-guide]")) {
      button.addEventListener("click", () => this.openGuide(0));
    }
    this.root.querySelector("[data-close-crm-guide]")?.addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-crm-guide-next]")?.addEventListener("click", () => this.nextGuideStep());
    this.root.querySelector("[data-crm-guide-prev]")?.addEventListener("click", () => this.prevGuideStep());
    this.root.querySelector("[data-crm-guide-finish]")?.addEventListener("click", () => this.closeGuide());

    this.root.querySelector("[data-close-crm-toast]")?.addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.root.querySelector("[data-crm-toggle-closed]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      this.closedList.hidden = isExpanded;
      this.root.querySelector("[data-crm-closed-chevron]").textContent = isExpanded ? "⌄" : "⌃";
    });

    this.root.querySelector("[data-crm-af-run]")?.addEventListener("click", () => this.runAutoFollowCycle());

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (this.guide && !this.guide.hidden) {
        this.closeGuide();
      } else if (this.detailPanel.classList.contains("is-open")) {
        this.closeDetail();
      } else {
        this.close();
      }
    });
  }

  switchView(view) {
    const allowed = ["customer", "pipeline", "auto-follow", "panduan"];
    this.view = allowed.includes(view) ? view : "pipeline";
    for (const section of this.root.querySelectorAll("[data-crm-view]")) {
      const active = section.dataset.crmView === this.view;
      section.hidden = !active;
      section.classList.toggle("is-active", active);
    }
    for (const button of this.root.querySelectorAll("[data-crm-nav]")) {
      const active = button.dataset.crmNav === this.view;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    if (this.view === "customer") this.renderCustomers();
    if (this.view === "auto-follow") this.renderAutoFollow();
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-crm-demo]")?.focus();
    if (!this.hasOpenedGuide) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
    }
  }

  close() {
    this.closeDetail();
    this.closeGuide();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    if (!this.guide) return;
    this.guideStepIndex = Math.max(0, startIndex);
    this.guide.hidden = false;
    this.renderGuideStep();
    const focusBtn =
      this.guide.querySelector("[data-crm-guide-next]:not([hidden])") ||
      this.guide.querySelector("[data-crm-guide-finish]:not([hidden])");
    focusBtn?.focus();
  }

  closeGuide() {
    if (!this.guide) return;
    this.guide.hidden = true;
    this.clearHighlight();
  }

  highlightAnchor(name) {
    this.clearHighlight();
    const el = this.root.querySelector(`[data-crm-anchor="${name}"]`);
    if (el) {
      el.classList.add("crm-guide-highlight");
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  clearHighlight() {
    for (const el of this.root.querySelectorAll(".crm-guide-highlight")) {
      el.classList.remove("crm-guide-highlight");
    }
  }

  renderGuideStep() {
    if (!this.guide) return;
    const steps = this.guideSteps();
    const step = steps[this.guideStepIndex] || steps[0];
    const total = steps.length;
    const index = this.guideStepIndex + 1;

    this.guide.querySelector("[data-crm-guide-step-label]").textContent =
      `LANGKAH ${index} DARI ${total}`;
    this.guide.querySelector("[data-crm-guide-title]").textContent = step.title;
    this.guide.querySelector("[data-crm-guide-body]").textContent = step.body;

    const prev = this.guide.querySelector("[data-crm-guide-prev]");
    const next = this.guide.querySelector("[data-crm-guide-next]");
    const finish = this.guide.querySelector("[data-crm-guide-finish]");
    const isLast = this.guideStepIndex >= total - 1;
    const isFirst = this.guideStepIndex <= 0;

    if (prev) prev.hidden = isFirst;
    if (next) next.hidden = isLast;
    if (finish) finish.hidden = !isLast;

    if (step.view) this.switchView(step.view);
    if (typeof step.enter === "function") step.enter();
  }

  nextGuideStep() {
    const steps = this.guideSteps();
    if (this.guideStepIndex >= steps.length - 1) {
      this.closeGuide();
      return;
    }
    this.guideStepIndex += 1;
    this.renderGuideStep();
  }

  prevGuideStep() {
    if (this.guideStepIndex <= 0) return;
    this.guideStepIndex -= 1;
    this.renderGuideStep();
  }

  reset() {
    this.leads = this.cloneSeed();
    this.closed = this.cloneClosed();
    this.programs = crmAutoFollowPrograms.map((p) => ({ ...p }));
    this.cycleRun = 0;
    this.source = "all";
    this.query = "";
    this.customerQuery = "";
    this.mobileStage = "cold";
    this.selectedId = null;
    if (this.searchInput) this.searchInput.value = "";
    if (this.customerSearch) this.customerSearch.value = "";
    this.closedList.hidden = true;
    const closedToggle = this.root.querySelector("[data-crm-toggle-closed]");
    if (closedToggle) {
      closedToggle.setAttribute("aria-expanded", "false");
      this.root.querySelector("[data-crm-closed-chevron]").textContent = "⌄";
    }
    this.closeDetail();
    this.toast.hidden = true;
    this.switchView("pipeline");
    this.render();
  }

  getVisibleLeads() {
    return this.leads.filter((lead) => {
      const unit = crmResolveUnit(lead.unitId);
      const unitLabel = crmUnitLabel(unit);
      const isOmnichannel = ["whatsapp", "instagram", "facebook"].includes(lead.source);
      const matchesSource =
        this.source === "all" ||
        (this.source === "omnichannel" && isOmnichannel) ||
        (this.source === "excel" && lead.source === "excel_import");
      const haystack = `${lead.name} ${unitLabel} ${lead.handler}`.toLocaleLowerCase("id");
      return matchesSource && haystack.includes(this.query);
    });
  }

  render() {
    const visibleLeads = this.getVisibleLeads();
    this.renderSummary();
    this.renderFilters();
    this.renderStageTabs(visibleLeads);
    this.renderBoard(visibleLeads);
    this.renderClosed();
    if (this.view === "customer") this.renderCustomers();
    if (this.view === "auto-follow") this.renderAutoFollow();
  }

  renderSummary() {
    const pipeline = this.leads.reduce((total, lead) => total + crmLeadValue(lead), 0);
    const forecast = this.leads.reduce(
      (total, lead) => total + crmLeadValue(lead) * (crmStageConfig[lead.stage]?.probability || 0),
      0,
    );
    const setText = (sel, value) => {
      const el = this.root.querySelector(sel);
      if (el) el.textContent = value;
    };
    setText("[data-crm-pipeline-value]", this.formatCompactPrice(pipeline));
    setText("[data-crm-forecast]", this.formatCompactPrice(forecast));
    setText("[data-crm-active-count]", String(this.leads.length));
    setText(
      "[data-crm-followup-count]",
      String(this.leads.filter((lead) => lead.days >= 7).length),
    );
    setText(
      "[data-crm-hot-count]",
      String(this.leads.filter((lead) => lead.stage === "hot").length),
    );
    setText(
      "[data-crm-ai-count]",
      String(this.leads.filter((lead) => lead.ai).length),
    );
  }

  renderFilters() {
    for (const button of this.root.querySelectorAll("[data-crm-source]")) {
      button.classList.toggle("active", button.dataset.crmSource === this.source);
    }
  }

  renderStageTabs(leads) {
    if (!this.stageTabs) return;
    this.stageTabs.innerHTML = Object.entries(crmStageConfig)
      .map(([stage, config]) => {
        const count = leads.filter((lead) => lead.stage === stage).length;
        return `<button class="${stage === this.mobileStage ? "active" : ""}" type="button" role="tab" aria-selected="${stage === this.mobileStage}" data-crm-stage="${stage}">${config.label} (${count})</button>`;
      })
      .join("");
  }

  renderBoard(leads) {
    if (!this.board) return;
    this.board.innerHTML = Object.entries(crmStageConfig)
      .map(([stage, config]) => {
        const stageLeads = leads.filter((lead) => lead.stage === stage);
        const stageValue = stageLeads.reduce((total, lead) => total + crmLeadValue(lead), 0);
        const cards = stageLeads.length
          ? stageLeads.map((lead) => this.renderLeadCard(lead)).join("")
          : '<div class="crm-empty">Belum ada lead pada filter ini.</div>';
        return `
          <section class="crm-column ${stage === this.mobileStage ? "is-mobile-active" : ""}" data-crm-column="${stage}">
            <div class="crm-column-head ${stage}">
              <span><i></i><b>${config.label}</b><em>${stageLeads.length}</em></span>
              <small>${this.formatCompactPrice(stageValue)}</small>
            </div>
            <div class="crm-column-list">${cards}</div>
          </section>
        `;
      })
      .join("");
  }

  renderLeadCard(lead) {
    const unit = crmResolveUnit(lead.unitId);
    const unitLabel = crmUnitLabel(unit);
    const value = crmLeadValue(lead);
    const isFeatured = lead.id === "lead-nadia" && !lead.followedUp;
    const intent = lead.intent ? crmIntentLabels[lead.intent] : null;
    return `
      <article class="crm-lead-card ${isFeatured ? "featured" : ""}" data-lead-id="${lead.id}" tabindex="0" aria-label="Buka detail ${lead.name}">
        ${isFeatured ? '<span class="crm-try-badge">Coba ini</span>' : ""}
        <div class="crm-lead-card-head">
          <h3>${lead.name}</h3>
          <span class="crm-score">${lead.score}/100</span>
        </div>
        <p class="crm-lead-unit">${unitLabel}</p>
        <div class="crm-lead-meta">
          <span class="crm-source-badge ${lead.source}">${this.sourceLabel(lead.source)}</span>
          ${intent ? `<span class="crm-intent-chip">${intent}</span>` : ""}
          <b>${this.formatCompactPrice(value)}</b>
        </div>
        <div class="crm-lead-card-footer">
          <span class="crm-handler">${lead.ai ? "AI · " : ""}${lead.handler}</span>
          <span class="crm-stale ${lead.days >= 7 ? "high" : ""}">${lead.days} hari di stage</span>
        </div>
      </article>
    `;
  }

  renderClosed() {
    if (!this.closedList) return;
    let total = 0;
    this.closedList.innerHTML = this.closed
      .map((item) => {
        const unit = crmResolveUnit(item.unitId);
        const value = item.value || unit?.cashPrice || 0;
        total += value;
        const statusClass = item.status === "deal" ? "sold" : "ready";
        const statusLabel = item.status === "deal" ? "DEAL" : "HANDOVER";
        return `<article><span class="demo-status ${statusClass}">${statusLabel}</span><div><b>${item.name}</b><small>${crmUnitLabel(unit)}${unit ? ` · ${unit.plate}` : ""}</small></div><strong>${this.formatCompactPrice(value)}</strong></article>`;
      })
      .join("");
    const summary = this.root.querySelector("[data-crm-closed-summary]");
    if (summary) {
      summary.textContent = `${this.closed.length} transaksi · ${this.formatCompactPrice(total)}`;
    }
  }

  renderCustomers() {
    if (!this.customerList) return;
    const rows = this.leads.filter((lead) => {
      const unit = crmResolveUnit(lead.unitId);
      const haystack = `${lead.name} ${crmUnitLabel(unit)} ${lead.handler}`.toLocaleLowerCase("id");
      return haystack.includes(this.customerQuery);
    });
    this.customerList.innerHTML = rows.length
      ? rows
          .map((lead) => {
            const unit = crmResolveUnit(lead.unitId);
            return `
              <tr data-lead-id="${lead.id}" tabindex="0" role="button" aria-label="Buka detail ${lead.name}">
                <td><b>${lead.name}</b><small class="crm-muted">${lead.phone || "—"}</small></td>
                <td>${crmUnitLabel(unit)}</td>
                <td><span class="crm-stage-badge ${lead.stage}">${crmStageConfig[lead.stage].label}</span></td>
                <td><span class="crm-source-badge ${lead.source}">${this.sourceLabel(lead.source)}</span></td>
                <td>${lead.handler}</td>
                <td><b>${lead.score}</b></td>
              </tr>`;
          })
          .join("")
      : `<tr><td colspan="6" class="crm-empty-cell">Tidak ada customer pada pencarian ini.</td></tr>`;
  }

  renderAutoFollow() {
    const active = this.programs.filter((p) => p.active).length;
    const covered = this.programs.reduce((s, p) => s + p.contacts, 0);
    const week = 34 + this.cycleRun * 6;
    const rate = Math.min(48, 31 + this.cycleRun * 4);
    const setText = (sel, v) => {
      const el = this.root.querySelector(sel);
      if (el) el.textContent = v;
    };
    setText("[data-crm-af-active]", String(active));
    setText("[data-crm-af-covered]", String(covered));
    setText("[data-crm-af-week]", String(week));
    setText("[data-crm-af-rate]", `${rate}%`);

    if (!this.afList) return;
    this.afList.innerHTML = this.programs
      .map(
        (p) => `
        <article class="crm-af-card ${p.active ? "is-active" : ""}">
          <div class="crm-af-card-head">
            <div>
              <span class="crm-af-type">${p.type}</span>
              <h3>${p.name}</h3>
            </div>
            <em class="${p.active ? "on" : "off"}">${p.active ? "Aktif" : "Nonaktif"}</em>
          </div>
          <div class="crm-af-card-meta">
            <span>${p.channel}</span>
            <span>${p.schedule}</span>
            <span>${p.contacts} lead</span>
          </div>
          <p class="crm-af-note">Simulasi tenant demo · tidak mengirim ke channel nyata</p>
        </article>`,
      )
      .join("");
  }

  runAutoFollowCycle() {
    this.cycleRun += 1;
    const stale = this.leads
      .filter((l) => l.days >= 7 && !l.followedUp)
      .sort((a, b) => b.days - a.days)[0];
    if (stale) {
      const nextStage = { cold: "warm", warm: "hot", hot: "prospect", prospect: "prospect" };
      const old = stale.stage;
      stale.stage = nextStage[stale.stage];
      stale.score = Math.min(95, stale.score + 12);
      stale.days = 0;
      stale.followedUp = true;
      stale.events.unshift({
        icon: "AI",
        title: "Auto Follow siklus dijalankan",
        detail: `Program · ${old} → ${stale.stage}`,
        time: "baru saja",
      });
      this.toast.querySelector("b").textContent = `Siklus follow-up: ${stale.name}`;
      this.toast.querySelector("p").textContent =
        `Lead naik ke ${crmStageConfig[stale.stage].label}. Pesan tidak dikirim ke nomor nyata.`;
    } else {
      this.toast.querySelector("b").textContent = "Siklus follow-up selesai";
      this.toast.querySelector("p").textContent =
        "Tidak ada lead stale tersisa. Metrik program diperbarui (simulasi).";
    }
    this.toast.hidden = false;
    this.render();
  }

  handleLeadActivation(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-lead-id]");
    if (!card) return;
    if (event.type === "keydown") event.preventDefault();
    this.openDetail(card.dataset.leadId);
  }

  openDetail(leadId, options = {}) {
    const lead = this.leads.find((item) => item.id === leadId);
    if (!lead) return;
    this.selectedId = lead.id;
    if (!options.keepGuide) this.closeGuide();
    this.populateDetail(lead);
    this.detailBackdrop.hidden = false;
    this.detailPanel.classList.add("is-open");
    this.detailPanel.setAttribute("aria-hidden", "false");
    if (!options.keepGuide) {
      this.detailPanel.querySelector("[data-close-crm-detail]")?.focus();
    }
  }

  populateDetail(lead) {
    const unit = crmResolveUnit(lead.unitId);
    const unitLabel = crmUnitLabel(unit);
    const value = crmLeadValue(lead);

    this.root.querySelector("[data-crm-detail-name]").textContent = lead.name;
    this.root.querySelector("[data-crm-detail-unit]").textContent = unitLabel;

    const stageBadge = this.root.querySelector("[data-crm-detail-stage]");
    stageBadge.className = `crm-stage-badge ${lead.stage}`;
    stageBadge.textContent = crmStageConfig[lead.stage].label;

    const sourceBadge = this.root.querySelector("[data-crm-detail-source]");
    sourceBadge.className = `crm-source-badge ${lead.source}`;
    sourceBadge.textContent = this.sourceLabel(lead.source);

    this.root.querySelector("[data-crm-detail-score]").textContent = `Skor ${lead.score}/100`;

    const intentBadge = this.root.querySelector("[data-crm-detail-intent]");
    if (lead.intent && crmIntentLabels[lead.intent]) {
      intentBadge.hidden = false;
      intentBadge.textContent = crmIntentLabels[lead.intent];
    } else {
      intentBadge.hidden = true;
    }

    this.root.querySelector("[data-crm-detail-value]").textContent = this.formatCompactPrice(value);
    this.root.querySelector("[data-crm-detail-days]").textContent = `${lead.days} hari`;
    this.root.querySelector("[data-crm-detail-handler]").textContent = lead.handler;
    this.root.querySelector("[data-crm-handler-mode]").textContent = lead.ai
      ? "AI Bot (aktif)"
      : "Handler manual";
    this.root.querySelector("[data-crm-handler-icon]").textContent = lead.ai ? "AI" : "MR";
    this.root.querySelector("[data-crm-handler-icon]").className =
      `crm-handler-icon ${lead.ai ? "ai" : "human"}`;

    this.root.querySelector("[data-crm-unit-title]").textContent = unitLabel;
    this.root.querySelector("[data-crm-unit-status]").textContent = unit?.status || "—";
    this.root.querySelector("[data-crm-unit-plate]").textContent = unit?.plate || "—";
    this.root.querySelector("[data-crm-unit-branch]").textContent = unit
      ? `${unit.branch} · ${unit.position}`
      : "—";
    this.root.querySelector("[data-crm-unit-year]").textContent = unit ? String(unit.year) : "—";
    this.root.querySelector("[data-crm-unit-color]").textContent = unit?.color || "—";
    this.root.querySelector("[data-crm-unit-trans]").textContent = unit?.transmission || "—";
    this.root.querySelector("[data-crm-unit-odo]").textContent = unit
      ? `${unit.odometer.toLocaleString("id-ID")} km`
      : "—";
    this.root.querySelector("[data-crm-unit-features]").innerHTML = (unit?.features || [])
      .slice(0, 4)
      .map((f) => `<span>${f}</span>`)
      .join("");

    this.root.querySelector("[data-crm-detail-summary]").textContent = lead.summary;
    this.root.querySelector("[data-crm-detail-recommendation]").textContent = lead.recommendation;
    this.root.querySelector("[data-crm-message]").textContent = lead.message;
    this.root.querySelector("[data-crm-timeline]").innerHTML = lead.events
      .map(
        (event) => `
          <div class="crm-timeline-item">
            <span>${event.icon}</span>
            <div><b>${event.title}</b><small>${event.detail}</small></div>
            <time>${event.time}</time>
          </div>
        `,
      )
      .join("");
    this.messagePreview.hidden = true;
    this.prepareButton.disabled = Boolean(lead.followedUp);
    this.prepareButton.textContent = lead.followedUp
      ? "Follow-up sudah disimulasikan"
      : "Siapkan follow-up AI";
    const sendButton = this.root.querySelector("[data-crm-send-followup]");
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = "Kirim simulasi";
    }
  }

  closeDetail() {
    this.detailPanel.classList.remove("is-open");
    this.detailPanel.setAttribute("aria-hidden", "true");
    this.detailBackdrop.hidden = true;
    this.messagePreview.hidden = true;
  }

  prepareFollowup() {
    const lead = this.leads.find((item) => item.id === this.selectedId);
    if (!lead || lead.followedUp) return;
    this.messagePreview.hidden = false;
    this.root.querySelector("[data-crm-send-followup]")?.focus();
  }

  async sendFollowup() {
    const lead = this.leads.find((item) => item.id === this.selectedId);
    if (!lead || lead.followedUp) return;
    const unit = crmResolveUnit(lead.unitId);
    const sendButton = this.root.querySelector("[data-crm-send-followup]");
    sendButton.disabled = true;
    sendButton.textContent = "Menyimpan ke tenant demo…";
    try {
      await publicDemoData.submit("crm_followup", {
        message: lead.message,
        unit_interest: crmUnitLabel(unit),
      });
    } catch (error) {
      sendButton.disabled = false;
      sendButton.textContent = "Kirim simulasi";
      this.toast.querySelector("b").textContent = "Follow-up belum tersimpan";
      this.toast.querySelector("p").textContent = error.message;
      this.toast.hidden = false;
      return;
    }
    const nextStage = { cold: "warm", warm: "hot", hot: "prospect", prospect: "prospect" };
    const oldScore = lead.score;
    lead.stage = nextStage[lead.stage];
    lead.score = Math.min(95, lead.score + 22);
    lead.days = 0;
    lead.followedUp = true;
    lead.summary =
      "Follow-up simulasi mendapat respons positif. Lead meminta rincian berikutnya dan kini masuk prioritas tinggi.";
    lead.recommendation = "Hubungi secara personal untuk mengunci jadwal test drive.";
    lead.events.unshift(
      {
        icon: "✓",
        title: "Lead merespons positif (simulasi)",
        detail: "Stage dan skor diperbarui",
        time: "baru saja",
      },
      {
        icon: "AI",
        title: "Follow-up AI dicatat",
        detail: "Tersimpan di tenant demo; tidak dikirim ke channel nyata",
        time: "baru saja",
      },
    );
    this.mobileStage = lead.stage;
    this.render();
    this.populateDetail(lead);
    this.toast.querySelector("b").textContent = `Lead naik menjadi ${crmStageConfig[lead.stage].label}`;
    this.toast.querySelector("p").textContent =
      `Skor ${lead.name} berubah ${oldScore} → ${lead.score}; aktivitas tercatat di tenant demo.`;
    this.toast.hidden = false;
  }

  sourceLabel(source) {
    if (source === "excel_import") return "Excel";
    if (source === "walk_in") return "Walk-in";
    if (source === "whatsapp") return "WhatsApp";
    if (source === "instagram") return "Instagram";
    if (source === "facebook") return "Facebook";
    return source;
  }

  formatCompactPrice(value) {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
    }
    return `Rp ${(value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} jt`;
  }
}

const crmDemoMount = document.getElementById("crmDemo");
if (crmDemoMount) {
  new AutopilotCRMDemo(crmDemoMount);
}

const omniPipelineOrder = ["cold", "warm", "hot", "book"];

const omniDemoSeed = () => [
  {
    id: "omni-nadia",
    name: "Nadia Demo",
    phone: "62812****901",
    channel: "whatsapp",
    tag: "hot",
    bucket: "ai",
    handlerName: "Jasmine AI",
    mrName: "",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "hot",
    preview: "Cari mobil keluarga budget 250 juta",
    time: "10:42",
    location: "BSD",
    unit: "Mitsubishi Xpander Ultimate",
    budget: "Budget ~Rp 250 jt",
    notes: "Keluarga 4 orang, butuh kabin luas",
    messages: [
      { role: "customer", content: "Saya cari mobil keluarga budget sekitar 250 juta. Ada rekomendasi?", time: "10:41" },
      {
        role: "assistant",
        content:
          "Ada dua pilihan dari stok demo: Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Lebih penting kabin luas atau efisiensi cicilan, Kak?",
        time: "10:42",
      },
    ],
    history: [
      { label: "Lead masuk dari WhatsApp", time: "10:40" },
      { label: "AI membalas rekomendasi unit", time: "10:42" },
    ],
  },
  {
    id: "omni-rizky",
    name: "Rizky Ramadhan",
    phone: "62813****112",
    channel: "instagram",
    tag: "warm",
    bucket: "ai",
    handlerName: "Jasmine AI",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "Mau test drive besok sore",
    time: "10:18",
    location: "Jakarta Selatan",
    unit: "Suzuki Ertiga Hybrid",
    budget: "Cicilan ringan",
    notes: "",
    messages: [
      { role: "customer", content: "Unit Ertiga Hybrid masih ada? Saya mau test drive besok sore.", time: "10:17" },
      {
        role: "assistant",
        content:
          "Unit tersedia di data demo. Minat test drive saya tandai sebagai WARM→HOT dan siapkan konteks untuk Call Center. Besok sekitar pukul berapa, Kak?",
        time: "10:18",
      },
    ],
    history: [
      { label: "Lead masuk Instagram", time: "10:15" },
      { label: "AI deteksi minat test drive", time: "10:18" },
    ],
  },
  {
    id: "omni-bayu",
    name: "Bayu Prakoso",
    phone: "62821****440",
    channel: "whatsapp",
    tag: "hot",
    bucket: "pending",
    handlerName: "—",
    mrName: "",
    priority: "tinggi",
    escalated: true,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "hot",
    preview: "Minta human agent sekarang",
    time: "09:50",
    location: "Depok",
    unit: "Toyota Raize",
    budget: "Cash / credit",
    notes: "Customer minta human",
    messages: [
      { role: "customer", content: "Tolong sambungkan ke agent manusia, saya mau nego serius.", time: "09:49" },
      {
        role: "assistant",
        content: "Baik Kak, saya eskalasi ke Call Center. Agent akan segera mengambil alih percakapan ini.",
        time: "09:50",
      },
    ],
    history: [
      { label: "AI menangani awal", time: "09:30" },
      { label: "Eskalasi: minta human agent", time: "09:50" },
    ],
  },
  {
    id: "omni-sinta",
    name: "Sinta Maharani",
    phone: "62878****221",
    channel: "messenger",
    tag: "book",
    bucket: "mr",
    handlerName: "MR Dimas",
    mrName: "Dimas Pratama",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: true,
    pinned: false,
    closed: false,
    pipelineStage: "book",
    preview: "Handoff → MR Dimas (belum balas)",
    time: "09:20",
    location: "Tangerang",
    unit: "Honda BR-V",
    budget: "Trade-in",
    notes: "Handoff HOT + booking intent",
    messages: [
      { role: "customer", content: "Kalau beli BR-V bisa trade-in mobil lama?", time: "09:10" },
      { role: "assistant", content: "Bisa dibantu estimasi awal. Saya serahkan ke MR untuk follow-up closing.", time: "09:12" },
      { role: "agent", content: "Call Center: konteks trade-in dicatat. Handoff ke MR Dimas.", time: "09:15" },
      { role: "system", content: "Handoff oleh Agent Demo ke MR Dimas Pratama", time: "09:15" },
    ],
    history: [
      { label: "Takeover Call Center", time: "09:14" },
      { label: "Handoff ke MR Dimas Pratama", time: "09:15" },
      { label: "MR belum membalas", time: "09:20" },
    ],
  },
  {
    id: "omni-laras",
    name: "Laras Wulandari",
    phone: "62856****778",
    channel: "whatsapp",
    tag: "cold",
    bucket: "call_center",
    handlerName: "Agent Demo (Saya)",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: true,
    closed: false,
    pipelineStage: "cold",
    preview: "Follow-up budget Rocky",
    time: "08:47",
    location: "Bekasi",
    unit: "Daihatsu Rocky",
    budget: "Masih bandingkan",
    notes: "Pin — follow-up sore",
    messages: [
      { role: "customer", content: "Ada paket pembiayaan untuk Rocky?", time: "08:40" },
      { role: "assistant", content: "Ada beberapa opsi. Saya hubungkan ke agent untuk hitung cicilan resmi.", time: "08:42" },
      { role: "agent", content: "Halo Kak Laras, saya dari Call Center. Boleh sebutkan target DP dan tenor?", time: "08:47" },
    ],
    history: [
      { label: "AI domain finance", time: "08:42" },
      { label: "Takeover Agent Demo", time: "08:47" },
    ],
  },
  {
    id: "omni-farhan",
    name: "Farhan Rizki",
    phone: "62811****330",
    channel: "messenger",
    tag: "warm",
    bucket: "ai",
    handlerName: "Jasmine AI",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "Bandingkan HR-V dan Xpander",
    time: "Kemarin",
    location: "Bandung",
    unit: "HR-V / Xpander",
    budget: "250–300 jt",
    notes: "",
    messages: [
      { role: "customer", content: "Untuk keluarga lebih cocok HR-V atau Xpander?", time: "Kemarin" },
      {
        role: "assistant",
        content:
          "Saya bisa bantu membandingkan dari kebutuhan dan data unit. Berapa jumlah penumpang rutin, Kak?",
        time: "Kemarin",
      },
    ],
    history: [{ label: "Lead masuk Messenger", time: "Kemarin" }],
  },
  {
    id: "omni-maya",
    name: "Maya Lestari",
    phone: "62857****901",
    channel: "instagram",
    tag: "cold",
    bucket: "mr",
    handlerName: "MR Sari",
    mrName: "Sari Wijaya",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "MR sudah balas lokasi showroom",
    time: "Kemarin",
    location: "Bintaro",
    unit: "Showroom visit",
    budget: "—",
    notes: "MR sudah respons",
    messages: [
      { role: "customer", content: "Showroom terdekat dari Bintaro di mana?", time: "Kemarin" },
      { role: "assistant", content: "Saya cek lokasi resmi… menyerahkan ke MR area.", time: "Kemarin" },
      { role: "mr", content: "Halo Kak Maya, saya Sari. Showroom Bintaro buka 09–17, bisa saya bookingkan slot?", time: "Kemarin" },
    ],
    history: [
      { label: "Handoff ke MR Sari", time: "Kemarin" },
      { label: "MR membalas", time: "Kemarin" },
    ],
  },
  {
    id: "omni-andi",
    name: "Andi Saputra",
    phone: "62819****555",
    channel: "whatsapp",
    tag: "book",
    bucket: "call_center",
    handlerName: "Agent Rina",
    mrName: "",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "book",
    preview: "Booking Toyota Rush — agent lain",
    time: "Senin",
    location: "Serpong",
    unit: "Toyota Rush G AT",
    budget: "Siap booking",
    notes: "Ditangani Agent Rina",
    claimedByOther: true,
    messages: [
      { role: "customer", content: "Saya sudah cocok dengan Rush, mau booking.", time: "Senin" },
      { role: "agent", content: "Siap Kak Andi, saya Rina bantu proses booking unit demo.", time: "Senin" },
    ],
    history: [
      { label: "HOT → BOOK", time: "Senin" },
      { label: "Claim Agent Rina", time: "Senin" },
    ],
  },
];

const omniTutorialSteps = [
  {
    title: "Selamat datang — 2 role dalam omnichannel",
    body: "Demo ini meniru Call Center produksi (3 kolom dense). Ada dua role manusia: Call Center (operator inbox) dan MR (sales penutup deal). AI menangani percakapan dulu, lalu bisa di-takeover dan di-handoff.",
    fanel: "ai",
    contactId: "omni-nadia",
    ctxTab: "detail",
  },
  {
    title: "Role 1 — Call Center: faneling & bucket",
    body: "Tab Saya Handle · AI · Semua meniru produksi. Group: Ditangani AI, Menunggu Agent, MR Belum/Sudah Balas, dan per agent. Pilih lead Nadia di bucket AI.",
    fanel: "ai",
    contactId: "omni-nadia",
    ctxTab: "detail",
  },
  {
    title: "Ambil alih dari AI",
    body: "Ketik pesan atau aksi takeover memindahkan lead ke Call Center (Saya Handle). Banner status berubah; agent bisa pakai Aksi Cepat.",
    fanel: "ai",
    contactId: "omni-nadia",
    ctxTab: "detail",
    action: "takeover",
  },
  {
    title: "Aksi Cepat + Detail / Riwayat / Pipeline",
    body: "Simulasi Kredit, Cek Inventori, Tanya Falcon — sama produksi. Panel kanan: Detail Lead, Pipeline COLD→BOOK, dan tab Riwayat audit.",
    fanel: "mine",
    contactId: "omni-nadia",
    ctxTab: "riwayat",
  },
  {
    title: "Handoff ke MR (sesuai produksi)",
    body: "Tombol Handoff menyerahkan lead ke Marketing Representative. Bucket menjadi MR; badge MR BELUM BALAS muncul sampai MR membalas.",
    fanel: "mine",
    contactId: "omni-nadia",
    ctxTab: "detail",
    action: "handoff",
  },
  {
    title: "Role 2 — UI MR (preview)",
    body: "MR punya workspace Percakapan sendiri (bukan inbox Call Center). Konteks lead terbawa. Di production: sales follow-up & closing. Lihat preview UI MR.",
    fanel: "all",
    contactId: "omni-nadia",
    ctxTab: "detail",
    action: "mr_preview",
  },
  {
    title: "AI Trace (ex AI Lab) + CRM terpisah",
    body: "Tab AI Trace menampilkan router, tool, grounding, dan guardrail (merge AI Lab). Pipeline CRM sales ada di demo Autopilot CRM terpisah di landing — stage lead di Call Center selaras narasi CRM.",
    fanel: "all",
    contactId: "omni-nadia",
    ctxTab: "trace",
  },
];

class OmnichannelAIDemo {
  constructor(root) {
    this.root = root;
    this.contacts = this.cloneSeed();
    this.activeContactId = "omni-nadia";
    this.fanel = "ai";
    this.channel = "all";
    this.tagFilter = new Set();
    this.selectedIds = new Set();
    this.contextOpen = true;
    this.ctxTab = "detail";
    this.lastFocusedElement = null;
    this.tutorialStep = 0;
    this.tutorialActive = false;
    this.agentName = "Agent Demo";

    this.contactList = root.querySelector("[data-omni-contact-list]");
    this.chatLog = root.querySelector("[data-omni-chat-log]");
    this.input = root.querySelector("[data-omni-input]");
    this.form = root.querySelector("[data-omni-form]");
    this.toast = root.querySelector("[data-omni-toast]");
    this.searchInput = root.querySelector("[data-omni-search]");

    this.defaultTrace = {
      domain: "query",
      risk: "low",
      effect: "read_only",
      router: "Memilih domain query dari konteks percakapan.",
      tool: "inventory.search · read_only",
      grounding: "Jawaban hanya memakai hasil data demo.",
      evalTitle: "Skenario pencarian stok",
      blocked: false,
      assertions: [
        "Domain routing sesuai",
        "Data source terverifikasi",
        "Tidak ada side effect",
        "Data sensitif tidak bocor",
      ],
    };
    this.trace = { ...this.defaultTrace, assertions: [...this.defaultTrace.assertions] };

    this.bind();
    this.render();
  }

  cloneSeed() {
    return omniDemoSeed().map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({ ...m })),
      history: c.history.map((h) => ({ ...h })),
    }));
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-omni-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }
    for (const button of this.root.querySelectorAll("[data-close-omni-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-omni-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-close-omni-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.searchInput.addEventListener("input", () => this.render());

    for (const button of this.root.querySelectorAll("[data-omni-fanel]")) {
      button.addEventListener("click", () => {
        this.fanel = button.dataset.omniFanel || "all";
        this.render();
      });
    }
    for (const button of this.root.querySelectorAll("[data-omni-channel]")) {
      button.addEventListener("click", () => {
        this.channel = button.dataset.omniChannel || "all";
        this.ensureActiveVisible();
        this.render();
      });
    }

    this.root.querySelector("[data-omni-tag-filter]").addEventListener("click", () => {
      const chips = this.root.querySelector("[data-omni-tag-chips]");
      chips.hidden = !chips.hidden;
      if (!chips.dataset.ready) {
        chips.dataset.ready = "1";
        for (const tag of ["cold", "warm", "hot", "book"]) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = tag.toUpperCase();
          b.dataset.tag = tag;
          b.addEventListener("click", () => {
            if (this.tagFilter.has(tag)) this.tagFilter.delete(tag);
            else this.tagFilter.add(tag);
            b.classList.toggle("on", this.tagFilter.has(tag));
            this.render();
          });
          chips.appendChild(b);
        }
      }
    });

    this.contactList.addEventListener("click", (event) => {
      const claim = event.target.closest("[data-omni-claim]");
      if (claim) {
        event.stopPropagation();
        this.takeoverContact(claim.dataset.omniClaim);
        return;
      }
      const pin = event.target.closest("[data-omni-pin]");
      if (pin) {
        event.stopPropagation();
        const c = this.contacts.find((x) => x.id === pin.dataset.omniPin);
        if (c) c.pinned = !c.pinned;
        this.render();
        return;
      }
      const check = event.target.closest("[data-omni-select]");
      if (check) {
        event.stopPropagation();
        const id = check.dataset.omniSelect;
        if (check.checked) this.selectedIds.add(id);
        else this.selectedIds.delete(id);
        this.renderBulkBar();
        return;
      }
      const row = event.target.closest("[data-omni-contact]");
      if (!row) return;
      this.activeContactId = row.dataset.omniContact;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-omni-prompt]")) {
      button.addEventListener("click", () => this.runPrompt(button.dataset.omniPrompt || "", { asCustomer: true }));
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = this.input.value.trim();
      if (!message) return;
      this.runPrompt(message, { asCustomer: false });
    });

    this.root.querySelector("[data-omni-toggle-context]").addEventListener("click", () => this.toggleContext());
    this.root.querySelector("[data-omni-toggle-context-icon]").addEventListener("click", () => this.toggleContext());

    for (const button of this.root.querySelectorAll("[data-omni-ctx-tab]")) {
      button.addEventListener("click", () => {
        this.ctxTab = button.dataset.omniCtxTab || "detail";
        this.renderContextTabs();
      });
    }

    this.root.querySelector("[data-omni-release]").addEventListener("click", () => this.releaseToAI());
    this.root.querySelector("[data-omni-handoff]").addEventListener("click", () => this.openModal("handoff"));
    this.root.querySelector("[data-omni-handoff-submit]").addEventListener("click", () => this.submitHandoff());
    this.root.querySelector("[data-omni-copy]").addEventListener("click", () => this.copyConversation());
    this.root.querySelector("[data-omni-close-lead]").addEventListener("click", () => this.openModal("close"));
    this.root.querySelector("[data-omni-close-submit]").addEventListener("click", () => this.submitCloseLead());
    this.root.querySelector("[data-omni-escalate]").addEventListener("click", () => this.openModal("escalate"));
    this.root.querySelector("[data-omni-escalate-submit]").addEventListener("click", () => this.submitEscalate());

    this.root.querySelector("[data-omni-qa-credit]").addEventListener("click", () => this.openCredit());
    this.root.querySelector("[data-omni-qa-inventory]").addEventListener("click", () => this.openInventory());
    this.root.querySelector("[data-omni-qa-falcon]").addEventListener("click", () => this.openFalcon());
    // MR modal also has credit/inventory buttons - use delegation
    this.root.addEventListener("click", (event) => {
      if (event.target.closest("[data-omni-qa-credit]") && event.target.closest("[data-omni-mr-modal], .cc-mr-chat")) {
        this.openCredit();
      }
      if (event.target.closest("[data-omni-qa-inventory]") && event.target.closest("[data-omni-mr-modal], .cc-mr-chat")) {
        this.openInventory();
      }
    });

    this.root.querySelector("[data-omni-falcon-use]").addEventListener("click", () => {
      const text = this.root.querySelector("[data-omni-falcon-answer]").textContent;
      this.input.value = text;
      this.closeModal("falcon");
      this.input.focus();
    });

    this.root.querySelector("[data-omni-manual-lead]").addEventListener("click", () => this.openModal("manual"));
    this.root.querySelector("[data-omni-manual-submit]").addEventListener("click", () => this.submitManualLead());
    this.root.querySelector("[data-omni-templates]").addEventListener("click", () => {
      this.showSimple("TEMPLATE SUMBER", "Lead Source Templates", "Di produksi, agent memilih template pesan per sumber lead (WA ads, IG, FB). Di demo ini UI disediakan sebagai simulasi.");
    });
    this.root.querySelector("[data-omni-analytics]").addEventListener("click", () => {
      this.showSimple("ANALYTICS", "Performa Call Center (demo)", "Inbox aktif: " + this.contacts.filter((c) => !c.closed).length + " · Ditangani AI: " + this.contacts.filter((c) => c.bucket === "ai" && !c.closed).length + " · MR: " + this.contacts.filter((c) => c.bucket === "mr" && !c.closed).length + " · Escalated: " + this.contacts.filter((c) => c.escalated && !c.closed).length);
    });

    this.root.querySelector("[data-omni-bulk-close]").addEventListener("click", () => {
      if (!this.selectedIds.size) return;
      for (const id of [...this.selectedIds]) {
        const c = this.contacts.find((x) => x.id === id);
        if (c) {
          c.closed = true;
          c.bucket = "closed";
          c.history.push({ label: "Bulk close (demo)", time: "baru saja" });
        }
      }
      this.selectedIds.clear();
      this.showToast("Bulk close", "Lead terpilih ditutup (simulasi).");
      this.render();
    });
    this.root.querySelector("[data-omni-bulk-cancel]").addEventListener("click", () => {
      this.selectedIds.clear();
      this.render();
    });

    this.root.querySelector("[data-omni-open-mr-preview]").addEventListener("click", () => this.openMrPreview());
    this.root.querySelector("[data-omni-tutorial]").addEventListener("click", () => this.startTutorial());
    this.root.querySelector("[data-omni-tutorial-close]").addEventListener("click", () => this.endTutorial());
    this.root.querySelector("[data-omni-tutorial-skip]").addEventListener("click", () => this.endTutorial());
    this.root.querySelector("[data-omni-tutorial-next]").addEventListener("click", () => this.nextTutorial());

    for (const el of this.root.querySelectorAll("[data-close-modal]")) {
      el.addEventListener("click", () => this.closeModal(el.dataset.closeModal));
    }

    // Status banner takeover from MR
    this.root.querySelector("[data-omni-status-banner]").addEventListener("click", (event) => {
      const btn = event.target.closest("[data-omni-takeover-mr]");
      if (!btn) return;
      this.takeoverFromMR();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
        return;
      }
      const openModal = this.root.querySelector(".cc-modal-backdrop:not([hidden])");
      if (openModal) {
        openModal.hidden = true;
        return;
      }
      this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-omni-demo]").focus();
    this.render();
  }

  close() {
    this.endTutorial(true);
    this.toast.hidden = true;
    for (const modal of this.root.querySelectorAll(".cc-modal-backdrop")) modal.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  reset() {
    this.contacts = this.cloneSeed();
    this.activeContactId = "omni-nadia";
    this.fanel = "ai";
    this.channel = "all";
    this.tagFilter.clear();
    this.selectedIds.clear();
    this.contextOpen = true;
    this.ctxTab = "detail";
    this.trace = { ...this.defaultTrace, assertions: [...this.defaultTrace.assertions] };
    this.input.value = "";
    this.toast.hidden = true;
    for (const modal of this.root.querySelectorAll(".cc-modal-backdrop")) modal.hidden = true;
    this.render();
    this.showToast("Reset demo", "Data mock Call Center dikembalikan.");
  }

  activeContact() {
    return this.contacts.find((c) => c.id === this.activeContactId) || this.contacts[0];
  }

  toggleContext() {
    this.contextOpen = !this.contextOpen;
    this.root.querySelector(".cc-shell").classList.toggle("context-hidden", !this.contextOpen);
    this.root.querySelector("[data-omni-context-panel]").classList.toggle("is-hidden", !this.contextOpen);
  }

  openModal(name) {
    const map = {
      handoff: "[data-omni-handoff-modal]",
      credit: "[data-omni-credit-modal]",
      inventory: "[data-omni-inventory-modal]",
      falcon: "[data-omni-falcon-modal]",
      close: "[data-omni-close-modal]",
      escalate: "[data-omni-escalate-modal]",
      manual: "[data-omni-manual-modal]",
      simple: "[data-omni-simple-modal]",
      mr: "[data-omni-mr-modal]",
      tutorial: "[data-omni-tutorial-modal]",
    };
    const sel = map[name];
    if (sel) this.root.querySelector(sel).hidden = false;
  }

  closeModal(name) {
    const map = {
      handoff: "[data-omni-handoff-modal]",
      credit: "[data-omni-credit-modal]",
      inventory: "[data-omni-inventory-modal]",
      falcon: "[data-omni-falcon-modal]",
      close: "[data-omni-close-modal]",
      escalate: "[data-omni-escalate-modal]",
      manual: "[data-omni-manual-modal]",
      simple: "[data-omni-simple-modal]",
      mr: "[data-omni-mr-modal]",
    };
    const sel = map[name];
    if (sel) this.root.querySelector(sel).hidden = true;
  }

  showSimple(kicker, title, body) {
    this.root.querySelector("[data-omni-simple-kicker]").textContent = kicker;
    this.root.querySelector("[data-omni-simple-title]").textContent = title;
    this.root.querySelector("[data-omni-simple-body]").textContent = body;
    this.openModal("simple");
  }

  showToast(title, body) {
    this.root.querySelector("[data-omni-toast-title]").textContent = title;
    this.root.querySelector("[data-omni-toast-body]").textContent = body;
    this.toast.hidden = false;
  }

  matchesFilters(c) {
    if (c.closed && this.fanel !== "all") return false;
    if (this.channel !== "all" && c.channel !== this.channel) return false;
    if (this.tagFilter.size && !this.tagFilter.has(c.tag)) return false;
    const q = (this.searchInput.value || "").trim().toLowerCase();
    if (q && !(`${c.name} ${c.phone} ${c.preview}`.toLowerCase().includes(q))) return false;
    if (this.fanel === "mine") {
      return c.bucket === "call_center" && !c.claimedByOther && !c.closed;
    }
    if (this.fanel === "ai") {
      return (c.bucket === "ai" || c.bucket === "pending") && !c.closed;
    }
    return true;
  }

  ensureActiveVisible() {
    const visible = this.contacts.filter((c) => this.matchesFilters(c));
    if (!visible.some((c) => c.id === this.activeContactId) && visible[0]) {
      this.activeContactId = visible[0].id;
    }
  }

  render() {
    this.ensureActiveVisible();
    this.renderFanelTabs();
    this.renderChannelTabs();
    this.renderContacts();
    this.renderChat();
    this.renderDetail();
    this.renderRiwayat();
    this.renderTrace();
    this.renderContextTabs();
    this.renderBulkBar();
    this.root.querySelector(".cc-shell").classList.toggle("context-hidden", !this.contextOpen);
    this.root.querySelector("[data-omni-context-panel]").classList.toggle("is-hidden", !this.contextOpen);
  }

  renderFanelTabs() {
    const counts = {
      mine: this.contacts.filter((c) => c.bucket === "call_center" && !c.claimedByOther && !c.closed).length,
      ai: this.contacts.filter((c) => (c.bucket === "ai" || c.bucket === "pending") && !c.closed).length,
      all: this.contacts.filter((c) => !c.closed).length,
    };
    this.root.querySelector("[data-omni-count-mine]").textContent = counts.mine;
    this.root.querySelector("[data-omni-count-ai]").textContent = counts.ai;
    this.root.querySelector("[data-omni-count-all]").textContent = counts.all;
    for (const button of this.root.querySelectorAll("[data-omni-fanel]")) {
      button.classList.toggle("active", button.dataset.omniFanel === this.fanel);
    }
  }

  renderChannelTabs() {
    const base = this.contacts.filter((c) => !c.closed);
    const count = (ch) => base.filter((c) => ch === "all" || c.channel === ch).length;
    this.root.querySelector("[data-omni-ch-all]").textContent = count("all");
    this.root.querySelector("[data-omni-ch-wa]").textContent = count("whatsapp");
    this.root.querySelector("[data-omni-ch-fb]").textContent = count("messenger");
    this.root.querySelector("[data-omni-ch-ig]").textContent = count("instagram");
    for (const button of this.root.querySelectorAll("[data-omni-channel]")) {
      button.classList.toggle("active", button.dataset.omniChannel === this.channel);
    }
  }

  renderBulkBar() {
    const bar = this.root.querySelector("[data-omni-bulk-bar]");
    bar.hidden = this.selectedIds.size === 0;
    this.root.querySelector("[data-omni-bulk-count]").textContent = `${this.selectedIds.size} dipilih`;
  }

  groupContacts(list) {
    const groups = [];
    const push = (key, title, cls, items, opts = {}) => {
      if (items.length) groups.push({ key, title, cls, items, ...opts });
    };
    push("mr_pending", "MR Belum Balas", "mr", list.filter((c) => c.bucket === "mr" && c.mrUnanswered && !c.closed));
    push("mr_done", "MR Sudah Balas", "mr", list.filter((c) => c.bucket === "mr" && !c.mrUnanswered && !c.closed));
    push("ai", "Ditangani AI", "ai", list.filter((c) => c.bucket === "ai" && !c.closed));
    push("pending", "Menunggu Agent", "pending", list.filter((c) => c.bucket === "pending" && !c.closed));
    const agents = {};
    for (const c of list.filter((x) => x.bucket === "call_center" && !x.closed)) {
      const key = c.claimedByOther ? c.handlerName : "Saya";
      agents[key] = agents[key] || [];
      agents[key].push(c);
    }
    for (const [name, items] of Object.entries(agents)) {
      push("cc-" + name, name === "Saya" ? "Ditangani Agent (Saya)" : `Ditangani ${name}`, "cc", items);
    }
    push("closed", "Closed / Riwayat", "closed", list.filter((c) => c.closed));
    return groups;
  }

  renderContacts() {
    let list = this.contacts.filter((c) => this.matchesFilters(c));
    list = [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    if (!list.length) {
      this.contactList.innerHTML = '<div class="cc-empty">Tidak ada percakapan pada filter ini.</div>';
      return;
    }
    const groups = this.fanel === "all" || this.fanel === "ai" ? this.groupContacts(list) : [{ key: "flat", title: "", cls: "", items: list }];
    const html = [];
    for (const group of groups) {
      if (group.title) {
        html.push(`<div class="cc-group-title ${group.cls}">${group.title}<span>${group.items.length}</span></div>`);
        html.push(`<div class="cc-group-actions"><button type="button" data-omni-select-group="${group.key}">Select bucket</button></div>`);
      }
      for (const c of group.items) {
        const classes = ["cc-row"];
        if (c.id === this.activeContactId) classes.push("active");
        if (c.escalated) classes.push("escalated");
        else if (c.mrUnanswered) classes.push("mr-timeout");
        else if (c.bucket === "pending") classes.push("pending");
        const badges = [];
        if (c.escalated) badges.push('<span class="cc-badge-sm es">ESKALASI</span>');
        if (c.mrUnanswered) badges.push('<span class="cc-badge-sm mr">MR BELUM BALAS</span>');
        if (c.bucket === "pending")
          badges.push(`<button type="button" class="cc-badge-sm claim" data-omni-claim="${c.id}">Ambil</button>`);
        html.push(`
          <div class="${classes.join(" ")}" data-omni-contact="${c.id}" role="button" tabindex="0">
            <input type="checkbox" data-omni-select="${c.id}" ${this.selectedIds.has(c.id) ? "checked" : ""} aria-label="Pilih ${c.name}" />
            <span class="cc-avatar ${c.channel}">${this.initials(c.name)}<i class="dot ${c.channel}"></i></span>
            <span class="cc-row-main">
              <b>${c.name}<span class="cc-tag ${c.tag}">${c.tag.toUpperCase()}</span></b>
              <div class="meta">${c.preview}</div>
              ${badges.join(" ")}
            </span>
            <span class="cc-row-side">
              <div>${c.time}</div>
              <button type="button" class="cc-pin ${c.pinned ? "on" : ""}" data-omni-pin="${c.id}" title="Pin">📌</button>
            </span>
          </div>
        `);
      }
    }
    this.contactList.innerHTML = html.join("");
    for (const btn of this.contactList.querySelectorAll("[data-omni-select-group]")) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const g = groups.find((x) => x.key === btn.dataset.omniSelectGroup);
        if (!g) return;
        for (const c of g.items) this.selectedIds.add(c.id);
        this.render();
      });
    }
  }

  renderChat() {
    const c = this.activeContact();
    const avatar = this.root.querySelector("[data-omni-active-avatar]");
    avatar.className = `cc-avatar ${c.channel}`;
    avatar.innerHTML = `${this.initials(c.name)}<i class="dot ${c.channel}"></i>`;
    this.root.querySelector("[data-omni-active-name]").textContent = c.name;
    const tagEl = this.root.querySelector("[data-omni-active-tag]");
    tagEl.className = `cc-tag ${c.tag}`;
    tagEl.textContent = c.tag.toUpperCase();
    this.root.querySelector("[data-omni-active-channel]").textContent = this.channelLabel(c.channel);
    this.root.querySelector("[data-omni-active-phone]").textContent = c.phone;
    this.root.querySelector("[data-omni-handler-label]").textContent = this.handlerLabel(c);

    const banner = this.root.querySelector("[data-omni-status-banner]");
    banner.className = "cc-status-banner show";
    if (c.closed) {
      banner.classList.add("other");
      banner.textContent = "Lead ditutup (simulasi). Riwayat tetap bisa dibaca.";
    } else if (c.bucket === "mr" && c.mrUnanswered) {
      banner.classList.add("mr");
      banner.innerHTML = `Lead ditangani MR <strong>${c.mrName}</strong> (belum balas). <button type="button" data-omni-takeover-mr>Ambil Alih dari MR</button>`;
    } else if (c.bucket === "mr") {
      banner.classList.add("mr");
      banner.innerHTML = `Lead ditangani MR <strong>${c.mrName}</strong>. <button type="button" data-omni-takeover-mr>Ambil Alih dari MR</button>`;
    } else if (c.bucket === "ai") {
      banner.textContent = "AI Jasmine/Falcon sedang menangani. Ketik pesan untuk ambil alih sebagai Call Center.";
    } else if (c.bucket === "pending") {
      banner.classList.add("pending");
      banner.textContent = "Customer minta human agent. Ketik pesan atau tekan Ambil untuk handle.";
    } else if (c.claimedByOther) {
      banner.classList.add("other");
      banner.textContent = `Ditangani ${c.handlerName}. Kirim pesan untuk mengambil alih (simulasi).`;
    } else {
      banner.classList.add("other");
      banner.textContent = `Anda menangani percakapan ini · AI di-pause. Gunakan tombol 🤖 AI untuk mengembalikan ke AI.`;
    }

    this.chatLog.replaceChildren();
    for (const message of c.messages) {
      const row = document.createElement("div");
      const isOut = message.role === "assistant" || message.role === "agent" || message.role === "mr" || message.role === "system";
      row.className = `cc-msg ${isOut ? "out" : "in"} ${message.role}${message.blocked ? " blocked" : ""}`;
      const bubble = document.createElement("div");
      bubble.className = "cc-bubble";
      bubble.textContent = message.content;
      const meta = document.createElement("div");
      meta.className = "meta";
      if (message.role === "assistant") {
        const badge = document.createElement("span");
        badge.className = message.blocked ? "cc-ai-badge guard" : "cc-ai-badge";
        badge.textContent = message.blocked ? "GUARDRAIL" : "JASMINE AI";
        meta.appendChild(badge);
      } else if (message.role === "agent") {
        const badge = document.createElement("span");
        badge.className = "cc-ai-badge";
        badge.style.color = "#059669";
        badge.textContent = "CALL CENTER";
        meta.appendChild(badge);
      } else if (message.role === "mr") {
        const badge = document.createElement("span");
        badge.className = "cc-ai-badge";
        badge.style.color = "#ea580c";
        badge.textContent = "MR";
        meta.appendChild(badge);
      }
      meta.append(document.createTextNode(message.time || ""));
      row.append(bubble, meta);
      this.chatLog.appendChild(row);
    }
    this.chatLog.scrollTop = this.chatLog.scrollHeight;

    const lockedMr = c.bucket === "mr";
    for (const sel of ["[data-omni-qa-credit]", "[data-omni-qa-inventory]", "[data-omni-qa-falcon]"]) {
      const el = this.root.querySelector(`.cc-chat ${sel}`);
      if (el) el.disabled = lockedMr || c.closed;
    }
  }

  handlerLabel(c) {
    if (c.closed) return "closed";
    if (c.bucket === "ai") return "ditangani Jasmine AI";
    if (c.bucket === "pending") return "menunggu agent";
    if (c.bucket === "mr") return `MR ${c.mrName || ""}`.trim();
    return c.handlerName || "Call Center";
  }

  renderDetail() {
    const c = this.activeContact();
    const tag = this.root.querySelector("[data-omni-detail-tag]");
    tag.className = `cc-tag ${c.tag}`;
    tag.textContent = c.tag.toUpperCase();
    this.root.querySelector("[data-omni-detail-priority]").textContent =
      c.priority === "tinggi" ? "Prioritas tinggi" : "Prioritas normal";
    this.root.querySelector("[data-omni-detail-contact]").textContent = `📞 ${c.phone} · 📍 ${c.location || "—"}`;
    const mr = this.root.querySelector("[data-omni-detail-mr]");
    if (c.mrName) {
      mr.textContent = c.mrName + (c.mrUnanswered ? " · belum balas" : "");
      mr.classList.remove("muted");
    } else {
      mr.textContent = "belum ada — handoff dulu";
      mr.classList.add("muted");
    }
    this.root.querySelector("[data-omni-detail-unit]").textContent = c.unit || "—";
    this.root.querySelector("[data-omni-detail-budget]").textContent = c.budget || "";
    const notes = this.root.querySelector("[data-omni-detail-notes]");
    notes.textContent = c.notes || "belum ada";
    notes.classList.toggle("muted", !c.notes);
    this.renderPipeline(this.root.querySelector("[data-omni-pipeline]"), c.pipelineStage);
  }

  renderPipeline(el, stage) {
    if (!el) return;
    const idx = omniPipelineOrder.indexOf(stage);
    for (const node of el.querySelectorAll("[data-stage]")) {
      const s = node.dataset.stage;
      const i = omniPipelineOrder.indexOf(s);
      node.classList.remove("done", "cur");
      if (i < idx) node.classList.add("done");
      else if (i === idx) node.classList.add("cur");
    }
  }

  renderRiwayat() {
    const c = this.activeContact();
    const el = this.root.querySelector("[data-omni-riwayat]");
    const items = [...(c.history || [])].reverse();
    if (!items.length) {
      el.innerHTML = '<div class="cc-empty">Belum ada riwayat.</div>';
      return;
    }
    el.innerHTML = items
      .map((h) => `<div class="cc-timeline-item"><b>${h.label}</b><span>${h.time}</span></div>`)
      .join("");
  }

  renderContextTabs() {
    for (const button of this.root.querySelectorAll("[data-omni-ctx-tab]")) {
      button.classList.toggle("active", button.dataset.omniCtxTab === this.ctxTab);
    }
    this.root.querySelector("[data-omni-ctx-detail]").hidden = this.ctxTab !== "detail";
    this.root.querySelector("[data-omni-ctx-riwayat]").hidden = this.ctxTab !== "riwayat";
    this.root.querySelector("[data-omni-ctx-trace]").hidden = this.ctxTab !== "trace";
  }

  renderTrace() {
    this.root.querySelector("[data-omni-domain]").textContent = this.trace.domain;
    this.root.querySelector("[data-omni-risk]").textContent = this.trace.risk;
    this.root.querySelector("[data-omni-effect]").textContent = this.trace.effect;
    this.root.querySelector("[data-omni-router]").textContent = this.trace.router;
    this.root.querySelector("[data-omni-tool]").textContent = this.trace.tool;
    this.root.querySelector("[data-omni-grounding]").textContent = this.trace.grounding;
    this.root.querySelector("[data-omni-eval-title]").textContent = this.trace.evalTitle;
    const status = this.root.querySelector("[data-omni-eval-status]");
    status.className = `omni-eval-status ${this.trace.blocked ? "blocked" : "pass"}`;
    status.textContent = this.trace.blocked ? "BLOCKED" : "PASS";
    const assertions = this.root.querySelector("[data-omni-assertions]");
    assertions.replaceChildren();
    for (const assertion of this.trace.assertions) {
      const item = document.createElement("li");
      item.className = this.trace.blocked ? "blocked" : "pass";
      const icon = document.createElement("span");
      icon.textContent = "✓";
      item.append(icon, document.createTextNode(" " + assertion));
      assertions.appendChild(item);
    }
  }

  takeoverContact(id) {
    const c = this.contacts.find((x) => x.id === id);
    if (!c || c.closed) return;
    c.bucket = "call_center";
    c.handlerName = "Agent Demo (Saya)";
    c.claimedByOther = false;
    c.escalated = false;
    c.messages.push({
      role: "agent",
      content: "Call Center mengambil alih percakapan (simulasi). Ringkasan kebutuhan tetap tersedia di panel kanan.",
      time: "baru saja",
    });
    c.history.push({ label: "Takeover Call Center (Agent Demo)", time: "baru saja" });
    c.preview = "Diambil alih Call Center";
    c.time = "baru";
    this.activeContactId = c.id;
    this.fanel = "mine";
    this.render();
    this.showToast("Takeover", `${c.name} sekarang di Saya Handle.`);
  }

  releaseToAI() {
    const c = this.activeContact();
    if (c.closed) return;
    c.bucket = "ai";
    c.handlerName = "Jasmine AI";
    c.claimedByOther = false;
    c.mrName = "";
    c.mrUnanswered = false;
    c.messages.push({
      role: "assistant",
      content: "Percakapan dikembalikan ke Jasmine AI (simulasi). AI akan membalas pesan berikutnya.",
      time: "baru saja",
    });
    c.history.push({ label: "Release ke AI", time: "baru saja" });
    c.preview = "Kembali ke AI";
    this.fanel = "ai";
    this.render();
    this.showToast("AI aktif", "Lead dikembalikan ke bucket Ditangani AI.");
  }

  takeoverFromMR() {
    const c = this.activeContact();
    c.bucket = "call_center";
    c.handlerName = "Agent Demo (Saya)";
    c.mrUnanswered = false;
    c.claimedByOther = false;
    c.messages.push({
      role: "agent",
      content: `Call Center mengambil alih dari MR ${c.mrName || ""} (simulasi).`,
      time: "baru saja",
    });
    c.history.push({ label: "Takeover dari MR", time: "baru saja" });
    this.fanel = "mine";
    this.render();
    this.showToast("Takeover dari MR", "Lead kembali ke Call Center.");
  }

  submitHandoff() {
    const c = this.activeContact();
    const mr = this.root.querySelector("[data-omni-handoff-mr]").value;
    const reason = this.root.querySelector("[data-omni-handoff-reason]").value;
    const notes = this.root.querySelector("[data-omni-handoff-notes]").value.trim();
    c.bucket = "mr";
    c.mrName = mr;
    c.handlerName = `MR ${mr.split(" ")[0]}`;
    c.mrUnanswered = true;
    c.claimedByOther = false;
    if (c.pipelineStage === "cold" || c.pipelineStage === "warm") {
      c.pipelineStage = "hot";
      c.tag = "hot";
    }
    c.notes = notes || c.notes;
    c.messages.push({
      role: "system",
      content: `Handoff oleh Agent Demo ke MR ${mr} · alasan: ${reason}`,
      time: "baru saja",
    });
    c.history.push({ label: `Handoff ke MR ${mr}`, time: "baru saja" });
    c.preview = `Handoff → MR ${mr.split(" ")[0]}`;
    this.closeModal("handoff");
    this.fanel = "all";
    this.render();
    this.showToast("Handoff ke MR", `${c.name} diserahkan ke ${mr}. Lanjut preview role MR.`);
  }

  submitCloseLead() {
    const c = this.activeContact();
    const reason = this.root.querySelector("[data-omni-close-reason]").value;
    c.closed = true;
    c.bucket = "closed";
    c.history.push({ label: `Close lead · ${reason}`, time: "baru saja" });
    c.messages.push({ role: "system", content: `Lead ditutup (${reason}) — simulasi.`, time: "baru saja" });
    this.closeModal("close");
    this.render();
    this.showToast("Lead ditutup", "Lead masuk group Closed / Riwayat.");
  }

  submitEscalate() {
    const c = this.activeContact();
    c.escalated = true;
    if (c.bucket === "ai") c.bucket = "pending";
    c.history.push({ label: "Eskalasi ditandai", time: "baru saja" });
    this.closeModal("escalate");
    this.render();
    this.showToast("Eskalasi", "Badge ESKALASI aktif pada lead.");
  }

  submitManualLead() {
    const name = this.root.querySelector("[data-omni-manual-name]").value.trim() || "Lead Manual";
    const channel = this.root.querySelector("[data-omni-manual-channel]").value;
    const id = "omni-manual-" + Date.now();
    this.contacts.unshift({
      id,
      name,
      phone: "62800****" + String(Math.floor(Math.random() * 900 + 100)),
      channel,
      tag: "cold",
      bucket: "call_center",
      handlerName: "Agent Demo (Saya)",
      mrName: "",
      priority: "normal",
      escalated: false,
      mrUnanswered: false,
      pinned: false,
      closed: false,
      pipelineStage: "cold",
      preview: "Lead manual ditambahkan",
      time: "baru",
      location: "—",
      unit: "—",
      budget: "",
      notes: "Dibuat via Lead Manual (demo)",
      messages: [{ role: "agent", content: `Lead manual ${name} dibuat oleh Call Center.`, time: "baru saja" }],
      history: [{ label: "Lead manual dibuat", time: "baru saja" }],
    });
    this.activeContactId = id;
    this.fanel = "mine";
    this.closeModal("manual");
    this.render();
    this.showToast("Lead manual", `${name} ditambahkan ke Saya Handle.`);
  }

  openCredit() {
    const c = this.activeContact();
    const price = 255000000;
    const dp = Math.round(price * 0.2);
    const angsuran = Math.round((price - dp) / 48);
    this.root.querySelector("[data-omni-credit-result]").innerHTML = `
      <b>Unit:</b> ${c.unit || "Unit demo"}<br/>
      <b>OTR (demo):</b> Rp ${price.toLocaleString("id-ID")}<br/>
      <b>DP 20%:</b> Rp ${dp.toLocaleString("id-ID")}<br/>
      <b>Tenor 48 bln:</b> ± Rp ${angsuran.toLocaleString("id-ID")}/bln<br/>
      <small style="color:#64748b">Angka fiktif demo — di produksi memakai kalkulator KKB tenant.</small>
    `;
    c.history.push({ label: "Aksi Cepat: Simulasi Kredit", time: "baru saja" });
    this.openModal("credit");
    this.renderRiwayat();
  }

  openInventory() {
    const list = this.root.querySelector("[data-omni-inventory-list]");
    list.innerHTML = [
      ["Honda BR-V Prestige 2021", "Ready · Rp 255 jt · Putih"],
      ["Toyota Rush G AT 2022", "Ready · Rp 190 jt · Hitam"],
      ["Mitsubishi Xpander Ultimate", "Ready · Rp 248 jt · Silver"],
      ["Suzuki Ertiga Hybrid", "Indent · hubungi MR"],
    ]
      .map(([t, s]) => `<div class="cc-inv-item"><b>${t}</b><span>${s}</span></div>`)
      .join("");
    this.activeContact().history.push({ label: "Aksi Cepat: Cek Inventori", time: "baru saja" });
    this.openModal("inventory");
    this.renderRiwayat();
  }

  openFalcon() {
    const c = this.activeContact();
    this.root.querySelector("[data-omni-falcon-answer]").textContent =
      `Saran Falcon untuk ${c.name}: tawarkan ${c.unit || "unit stok live"} dengan opsi test drive, konfirmasi budget (${c.budget || "belum diisi"}), dan siapkan handoff ke MR jika sinyal HOT. Jangan kirim angka kredit tanpa parameter DP/tenor.`;
    c.history.push({ label: "Aksi Cepat: Tanya Falcon", time: "baru saja" });
    this.openModal("falcon");
    this.renderRiwayat();
  }

  openMrPreview() {
    const c = this.activeContact();
    this.root.querySelector("[data-omni-mr-agent]").textContent = c.mrName || "Dimas Pratama";
    this.root.querySelector("[data-omni-mr-lead-name]").textContent = `${c.name} · ${c.tag.toUpperCase()} · ${c.unit || "—"}`;
    this.renderPipeline(this.root.querySelector("[data-omni-mr-pipeline]"), c.pipelineStage);
    const chat = this.root.querySelector("[data-omni-mr-chat]");
    chat.replaceChildren();
    const msgs = c.messages.slice(-4);
    for (const message of msgs) {
      const row = document.createElement("div");
      const isOut = message.role !== "customer";
      row.className = `cc-msg ${isOut ? "out" : ""} ${message.role}`;
      const bubble = document.createElement("div");
      bubble.className = "cc-bubble";
      bubble.textContent = message.content;
      row.append(bubble);
      chat.appendChild(row);
    }
    if (c.bucket === "mr" && c.mrUnanswered) {
      const row = document.createElement("div");
      row.className = "cc-msg out mr";
      row.innerHTML = `<div class="cc-bubble"><span class="cc-ai-badge" style="color:#ea580c">PREVIEW</span><br/>MR belum membalas di production. Di preview ini Anda melihat shell role MR.</div>`;
      chat.appendChild(row);
    } else if (c.bucket !== "mr") {
      const row = document.createElement("div");
      row.className = "cc-msg out mr";
      row.innerHTML = `<div class="cc-bubble">Preview role MR. Lakukan Handoff dulu agar lead benar-benar pindah bucket MR (seperti produksi).</div>`;
      chat.appendChild(row);
    }
    this.openModal("mr");
  }

  async copyConversation() {
    const c = this.activeContact();
    const text = c.messages.map((m) => `[${m.role}] ${m.content}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("Disalin", "Percakapan disalin ke clipboard.");
    } catch {
      this.showToast("Copy", "Clipboard tidak tersedia di lingkungan ini.");
    }
  }

  startTutorial() {
    this.tutorialActive = true;
    this.tutorialStep = 0;
    this.showTutorialStep();
  }

  endTutorial(silent) {
    this.tutorialActive = false;
    this.root.querySelector("[data-omni-tutorial-modal]").hidden = true;
    if (!silent) this.showToast("Tutorial selesai", "Silakan eksplorasi bebas semua aksi Call Center.");
  }

  nextTutorial() {
    if (this.tutorialStep >= omniTutorialSteps.length - 1) {
      this.endTutorial();
      return;
    }
    this.tutorialStep += 1;
    this.showTutorialStep();
  }

  showTutorialStep() {
    const step = omniTutorialSteps[this.tutorialStep];
    if (step.fanel) this.fanel = step.fanel;
    if (step.contactId) this.activeContactId = step.contactId;
    if (step.ctxTab) this.ctxTab = step.ctxTab;
    if (step.action === "takeover") this.takeoverContact(step.contactId);
    if (step.action === "handoff") {
      const c = this.activeContact();
      if (c.bucket !== "mr") {
        this.root.querySelector("[data-omni-handoff-mr]").value = "Dimas Pratama";
        this.root.querySelector("[data-omni-handoff-notes]").value = "Tutorial: HOT + test drive";
        this.submitHandoff();
      }
    }
    this.render();
    if (step.action === "mr_preview") this.openMrPreview();
    this.root.querySelector("[data-omni-tutorial-title]").textContent = `Langkah ${this.tutorialStep + 1}/${omniTutorialSteps.length}: ${step.title}`;
    this.root.querySelector("[data-omni-tutorial-body]").textContent = step.body;
    const stepsEl = this.root.querySelector("[data-omni-tutorial-steps]");
    stepsEl.innerHTML = omniTutorialSteps
      .map((_, i) => `<span class="${i === this.tutorialStep ? "on" : ""}">${i + 1}</span>`)
      .join("");
    this.root.querySelector("[data-omni-tutorial-next]").textContent =
      this.tutorialStep >= omniTutorialSteps.length - 1 ? "Selesai" : "Lanjut";
    this.openModal("tutorial");
  }

  async runPrompt(message, { asCustomer = true } = {}) {
    const text = message.trim().slice(0, 500);
    if (!text) return;
    this.toast.hidden = true;
    this.input.value = "";
    const contact = this.activeContact();
    if (contact.closed) {
      this.showToast("Lead closed", "Buka lead aktif untuk mengirim pesan.");
      return;
    }

    if (asCustomer) {
      contact.messages.push({ role: "customer", content: text, time: "baru saja" });
      if (contact.bucket === "call_center" || contact.bucket === "mr") {
        /* customer message while human handles */
      }
      const result = this.evaluateMessage(text);
      contact.messages.push({
        role: "assistant",
        content: result.response,
        time: "baru saja",
        blocked: result.trace.blocked,
      });
      contact.preview = result.trace.blocked ? "Ancaman diblokir guardrail" : text;
      contact.time = "baru";
      this.trace = result.trace;
      if (!result.trace.blocked && /(test drive|booking|mau beli)/.test(text.toLowerCase())) {
        contact.tag = "hot";
        contact.pipelineStage = "hot";
        contact.history.push({ label: "Pipeline → HOT (deteksi AI)", time: "baru saja" });
      }
      contact.history.push({ label: result.trace.blocked ? "Guardrail block" : `AI · ${result.trace.domain}`, time: "baru saja" });
      this.ctxTab = "trace";
      this.render();
      if (result.trace.blocked) {
        this.showToast("Ancaman diblokir", "Tidak ada tool atau perubahan yang dijalankan.");
        return;
      }
      try {
        await publicDemoData.submit("chat_message", {
          message: text,
          unit_interest: this.extractUnitInterest(text),
        });
      } catch (error) {
        this.showToast("Pesan belum tersimpan", error.message);
      }
      return;
    }

    // Agent reply → takeover if needed
    if (contact.bucket === "ai" || contact.bucket === "pending") {
      contact.bucket = "call_center";
      contact.handlerName = "Agent Demo (Saya)";
      contact.claimedByOther = false;
      contact.history.push({ label: "Takeover via kirim pesan", time: "baru saja" });
      this.fanel = "mine";
    }
    if (contact.claimedByOther) {
      contact.claimedByOther = false;
      contact.handlerName = "Agent Demo (Saya)";
      contact.history.push({ label: "Takeover dari agent lain", time: "baru saja" });
    }
    contact.messages.push({ role: "agent", content: text, time: "baru saja" });
    contact.preview = text;
    contact.time = "baru";
    contact.history.push({ label: "Balasan Call Center", time: "baru saja" });
    this.render();
  }

  extractUnitInterest(message) {
    const knownModels = ["Xpander", "Rush", "Zenix", "BR-V", "Serena", "Avanza", "Ertiga"];
    return knownModels.find((model) => message.toLocaleLowerCase("id").includes(model.toLocaleLowerCase("id"))) || "";
  }

  evaluateMessage(message) {
    const normalized = message
      .normalize("NFKD")
      .toLocaleLowerCase("id")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (this.isSecurityThreat(normalized)) {
      return {
        response:
          "Permintaan tidak diizinkan. Saya tidak dapat menghapus knowledge/data, mengungkap prompt atau kredensial, mengubah permission, maupun mengakses tenant lain. Tidak ada tool atau perubahan yang dijalankan.",
        trace: {
          domain: "security",
          risk: "critical",
          effect: "blocked",
          router: "Instruksi bertentangan dengan kebijakan dan batas role.",
          tool: "none · 0 tool calls",
          grounding: "Input dihentikan sebelum menyentuh data atau channel.",
          evalTitle: "Prompt injection & destructive action",
          blocked: true,
          assertions: [
            "Instruksi berbahaya ditolak",
            "System prompt tetap rahasia",
            "Tool calls = 0",
            "Side effects = 0",
          ],
        },
      };
    }

    if (/(test drive|tes drive|lihat unit|datang|booking|mau beli|mau ambil|deal)/.test(normalized)) {
      return {
        response:
          "Minat kunjungan terdeteksi sebagai HOT. Saya tidak mengirim apa pun dari demo ini, tetapi konteks lead sudah disiapkan: unit minat, waktu kunjungan, dan alasan handoff ke MR. Besok sekitar pukul berapa, Kak?",
        trace: {
          domain: "handoff",
          risk: "medium",
          effect: "simulated_write",
          router: "Sinyal buying intent tinggi diarahkan ke handoff MR.",
          tool: "lead.capture · tenant demo",
          grounding: "Konteks handoff disusun dari pesan, tanpa mengarang data.",
          evalTitle: "HOT lead & contextual handoff",
          blocked: false,
          assertions: [
            "Lead diklasifikasi HOT",
            "Konteks handoff lengkap",
            "External send = 0",
            "Perubahan terisolasi di tenant demo",
          ],
        },
      };
    }

    if (/(dp|cicilan|tenor|kredit|angsuran|leasing|pembiayaan)/.test(normalized)) {
      return {
        response:
          "Saya tidak akan mengarang angka pembiayaan. Sebutkan unit, target DP, dan tenor; atau minta agent memakai Aksi Cepat Simulasi Kredit.",
        trace: {
          domain: "finance",
          risk: "low",
          effect: "read_only",
          router: "Pertanyaan DP/cicilan masuk domain finance.",
          tool: "finance.simulate · menunggu parameter",
          grounding: "Angka hanya boleh berasal dari kalkulator resmi.",
          evalTitle: "Finance without fabrication",
          blocked: false,
          assertions: [
            "Domain finance sesuai",
            "Tidak mengarang angka",
            "Parameter wajib diminta",
            "Penawaran final diarahkan ke sales/MR",
          ],
        },
      };
    }

    if (/(foto|gambar|video|interior|eksterior)/.test(normalized)) {
      return {
        response:
          "Saya cek unit yang tepat lebih dulu agar media tidak tertukar. Di demo ini tidak ada file yang dikirim. Sebutkan model yang ingin dilihat.",
        trace: {
          domain: "photo",
          risk: "low",
          effect: "read_only",
          router: "Permintaan media masuk domain photo.",
          tool: "inventory.search · read_only",
          grounding: "Unit diverifikasi sebelum media dipilih.",
          evalTitle: "Safe media selection",
          blocked: false,
          assertions: ["Domain photo sesuai", "Unit diverifikasi dahulu", "External send = 0", "Tidak ada media nyata dikirim"],
        },
      };
    }

    if (/(mobil|unit|stok|harga|budget|keluarga|xpander|br-v|brv|rush|raize|ertiga|rocky)/.test(normalized)) {
      return {
        response:
          "Dari stok fiktif demo, ada Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Agar rekomendasinya tepat, lebih penting kabin luas, BBM, atau cicilan ringan, Kak?",
        trace: {
          ...this.defaultTrace,
          assertions: [...this.defaultTrace.assertions],
        },
      };
    }

    return {
      response:
        "Saya siap membantu dari satu inbox WhatsApp, Instagram, dan Facebook. Ceritakan kebutuhan kendaraan, budget, atau rencana waktunya.",
      trace: {
        domain: "general",
        risk: "low",
        effect: "none",
        router: "Belum ada domain operasional yang cukup spesifik.",
        tool: "none · menunggu konteks",
        grounding: "AI meminta klarifikasi daripada menebak.",
        evalTitle: "Clarify before acting",
        blocked: false,
        assertions: ["Tidak menebak intent", "Tidak memanggil tool prematur", "Pertanyaan lanjutan relevan", "Tidak ada side effect"],
      },
    };
  }

  isSecurityThreat(message) {
    const threatPatterns = [
      /(hapus|delete|remove|drop|kosongkan|reset|wipe|destroy|musnahkan).*(knowledge|database|data|customer|tenant|riwayat|log|sistem|stok)/,
      /(abaikan|ignore|bypass|lewati|override).*(instruksi|instruction|aturan|guardrail|security|system|sistem)/,
      /(system prompt|prompt sistem|api key|token rahasia|password|credential|secret|kredensial)/,
      /(ubah|naikkan|beri|jadikan).*(permission|role|akses|admin|otorisasi)/,
      /(tenant lain|semua tenant|cross.?tenant|lintas tenant)/,
      /(sql|shell|terminal|command).*(jalankan|run|execute|eksekusi)/,
      /(export|unduh|download|kirim).*(semua customer|seluruh data|database|semua lead)/,
    ];
    return threatPatterns.some((pattern) => pattern.test(message));
  }

  initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toLocaleUpperCase("id");
  }

  channelLabel(channel) {
    if (channel === "instagram") return "Instagram";
    if (channel === "messenger") return "Facebook Messenger";
    return "WhatsApp";
  }
}

const omniDemoMount = document.getElementById("omniDemo");
if (omniDemoMount) {
  new OmnichannelAIDemo(omniDemoMount);
}

const dashboardDemoRoles = {
  director: {
    label: "Direktur",
    title: "Executive Overview",
    description: "Ringkasan lintas cabang untuk keputusan strategis dan pertumbuhan bisnis.",
    widgets: ["kpi", "revenue", "pipeline", "branches", "agents", "alerts"],
  },
  sales: {
    label: "Sales Manager",
    title: "Sales Performance",
    description: "Pantau kualitas pipeline, produktivitas tim, dan peluang closing dari satu layar.",
    widgets: ["kpi", "revenue", "pipeline", "agents", "alerts"],
  },
  branch: {
    label: "Kepala Cabang",
    title: "Branch Command Center",
    description: "Fokus pada target, aktivitas sales, dan prioritas operasional cabang hari ini.",
    widgets: ["kpi", "pipeline", "branches", "agents", "alerts"],
  },
};

const dashboardDemoData = {
  branches: [
    { id: "pondok-bambu", name: "Pondok Bambu", revenue: 742, closing: 31, conversion: 8.4, target: 92 },
    { id: "cinere", name: "Cinere", revenue: 618, closing: 26, conversion: 7.8, target: 84 },
    { id: "cibubur", name: "Cibubur", revenue: 480, closing: 21, conversion: 6.9, target: 76 },
  ],
  agents: [
    { name: "Rizky Pratama", branch: "Pondok Bambu", closing: 14, revenue: 328 },
    { name: "Nadia Putri", branch: "Cinere", closing: 12, revenue: 286 },
    { name: "Fajar Maulana", branch: "Cibubur", closing: 10, revenue: 241 },
    { name: "Ayu Lestari", branch: "Pondok Bambu", closing: 9, revenue: 218 },
  ],
  chart: [
    { label: "Feb", actual: 54 },
    { label: "Mar", actual: 68 },
    { label: "Apr", actual: 61 },
    { label: "Mei", actual: 78 },
    { label: "Jun", actual: 72 },
    { label: "Jul", actual: 88, forecast: 96 },
    { label: "Agu", forecast: 100 },
  ],
};

class OneDashboardDemo {
  constructor(root) {
    this.root = root;
    this.role = "director";
    this.period = "mtd";
    this.branch = "all";
    this.visibleWidgets = new Set(dashboardDemoRoles.director.widgets);
    this.lastFocusedElement = null;
    this.hasOpened = false;
    this.liveMetrics = null;

    this.customizer = root.querySelector("[data-dashboard-customizer]");
    this.customizerBackdrop = root.querySelector("[data-dashboard-customizer-backdrop]");
    this.toast = root.querySelector("[data-dashboard-toast]");
    this.kpiGrid = root.querySelector("[data-dashboard-widget='kpi']");
    this.chart = root.querySelector("[data-dashboard-chart]");
    this.funnel = root.querySelector("[data-dashboard-funnel]");
    this.branchTable = root.querySelector("[data-dashboard-branch-table]");
    this.agentList = root.querySelector("[data-dashboard-agent-list]");
    this.alertList = root.querySelector("[data-dashboard-alert-list]");
    this.branchSelect = root.querySelector("[data-dashboard-branch]");

    this.bind();
    this.render();
    publicDemoData.snapshot().then((snapshot) => {
      this.liveMetrics = snapshot.leads;
      this.render();
    }).catch(() => {});
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-dashboard-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }

    for (const button of this.root.querySelectorAll("[data-close-dashboard-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-dashboard-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-dashboard-customize]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-dashboard-customize-banner]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-dashboard-customize-sidebar]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-dashboard-customizer-close]").addEventListener("click", () => this.closeCustomizer());
    this.customizerBackdrop.addEventListener("click", () => this.closeCustomizer());

    for (const button of this.root.querySelectorAll("[data-dashboard-period]")) {
      button.addEventListener("click", () => {
        this.period = button.dataset.dashboardPeriod || "mtd";
        this.render();
      });
    }

    this.branchSelect.addEventListener("change", () => {
      this.branch = this.branchSelect.value;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-dashboard-role]")) {
      button.addEventListener("click", () => {
        this.role = button.dataset.dashboardRole || "director";
        this.visibleWidgets = new Set(dashboardDemoRoles[this.role].widgets);
        this.syncWidgetInputs();
        this.render();
      });
    }

    for (const input of this.root.querySelectorAll("[data-dashboard-toggle]")) {
      input.addEventListener("change", () => {
        const widget = input.dataset.dashboardToggle;
        if (!widget) return;
        if (input.checked) this.visibleWidgets.add(widget);
        else this.visibleWidgets.delete(widget);
        this.renderWidgets();
      });
    }

    this.root.querySelector("[data-dashboard-save]").addEventListener("click", () => {
      this.closeCustomizer();
      this.root.querySelector("[data-dashboard-toast-copy]").textContent =
        `Dashboard ${dashboardDemoRoles[this.role].label} siap digunakan.`;
      this.toast.hidden = false;
      this.toast.querySelector("[data-dashboard-toast-close]").focus();
    });

    this.root.querySelector("[data-dashboard-toast-close]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (this.customizer.classList.contains("is-open")) {
        this.closeCustomizer();
      } else {
        this.close();
      }
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-dashboard-demo]").focus();

    if (!this.hasOpened) {
      this.openCustomizer();
      this.hasOpened = true;
    }
  }

  close() {
    this.closeCustomizer();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openCustomizer() {
    this.customizer.classList.add("is-open");
    this.customizer.setAttribute("aria-hidden", "false");
    this.customizerBackdrop.hidden = false;
    this.customizer.querySelector("[data-dashboard-customizer-close]").focus();
  }

  closeCustomizer() {
    this.customizer.classList.remove("is-open");
    this.customizer.setAttribute("aria-hidden", "true");
    this.customizerBackdrop.hidden = true;
  }

  reset() {
    this.role = "director";
    this.period = "mtd";
    this.branch = "all";
    this.branchSelect.value = "all";
    this.visibleWidgets = new Set(dashboardDemoRoles.director.widgets);
    this.toast.hidden = true;
    this.syncWidgetInputs();
    this.render();
  }

  syncWidgetInputs() {
    for (const input of this.root.querySelectorAll("[data-dashboard-toggle]")) {
      input.checked = this.visibleWidgets.has(input.dataset.dashboardToggle);
    }
  }

  periodMultiplier() {
    if (this.period === "qtd") return 2.56;
    if (this.period === "ytd") return 6.84;
    return 1;
  }

  branchMultiplier() {
    if (this.branch === "pondok-bambu") return 0.4;
    if (this.branch === "cinere") return 0.335;
    if (this.branch === "cibubur") return 0.265;
    return 1;
  }

  scopedBranches() {
    if (this.branch === "all") return dashboardDemoData.branches;
    return dashboardDemoData.branches.filter((branch) => branch.id === this.branch);
  }

  render() {
    const role = dashboardDemoRoles[this.role];
    const multiplier = this.periodMultiplier() * this.branchMultiplier();
    const periodLabel = this.period.toLocaleUpperCase("id");

    this.root.querySelector("[data-dashboard-title]").textContent = role.title;
    this.root.querySelector("[data-dashboard-description]").textContent = role.description;

    for (const button of this.root.querySelectorAll("[data-dashboard-period]")) {
      const active = button.dataset.dashboardPeriod === this.period;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    for (const button of this.root.querySelectorAll("[data-dashboard-role]")) {
      const active = button.dataset.dashboardRole === this.role;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const kpis = [
      {
        label: `Pendapatan ${periodLabel}`,
        icon: "Rp",
        value: this.formatRupiahCompact(1840 * multiplier),
        change: "18,6%",
        context: "vs periode lalu",
      },
      {
        label: "Pipeline Aktif",
        icon: "PL",
        value: `${Math.round((this.liveMetrics?.total || 1248) * multiplier).toLocaleString("id-ID")} lead`,
        change: "12,4%",
        context: "prospek bertumbuh",
      },
      {
        label: "Tingkat Konversi",
        icon: "%",
        value: `${((this.liveMetrics?.conversion_rate || 7.7) + (this.branch === "pondok-bambu" ? 0.7 : 0)).toFixed(1).replace(".", ",")}%`,
        change: "1,2 pt",
        context: "di atas target",
      },
      {
        label: "Rata-rata Deal",
        icon: "AV",
        value: "Rp23,6 jt",
        change: "8,3%",
        context: "nilai per closing",
      },
      {
        label: "Kecepatan Closing",
        icon: "⏱",
        value: this.branch === "cinere" ? "4,2 hari" : "4,8 hari",
        change: "0,9 hari",
        context: "lebih cepat",
      },
    ];

    this.kpiGrid.innerHTML = kpis
      .map(
        (kpi) => `
          <article class="dashboard-kpi-card">
            <span>${kpi.label}<i>${kpi.icon}</i></span>
            <b>${kpi.value}</b>
            <small><em>↑ ${kpi.change}</em>${kpi.context}</small>
          </article>
        `,
      )
      .join("");

    const chartScale = Math.min(1.08, 0.76 + this.periodMultiplier() * 0.12);
    this.chart.innerHTML = dashboardDemoData.chart
      .map((point) => {
        const actual = point.actual
          ? `<i style="height:${Math.min(100, point.actual * chartScale)}%" title="Aktual ${point.label}"></i>`
          : "";
        const forecast = point.forecast
          ? `<i class="forecast" style="height:${Math.min(100, point.forecast * chartScale)}%" title="Forecast ${point.label}"></i>`
          : "";
        return `<div class="dashboard-bar-item">${actual}${forecast}<small>${point.label}</small></div>`;
      })
      .join("");

    this.root.querySelector("[data-dashboard-revenue-total]").textContent =
      this.formatRupiahCompact(1840 * multiplier);
    this.root.querySelector("[data-dashboard-revenue-delta]").textContent =
      `↑ ${this.period === "ytd" ? "24,1" : "18,6"}% vs periode lalu`;

    const pipeline = [
      ["Lead Baru", 1248, 100],
      ["Terhubung", 864, 69],
      ["Prospek", 512, 41],
      ["Hot", 226, 18],
      ["Deal", 96, 8],
    ];
    this.root.querySelector("[data-dashboard-pipeline-total]").textContent =
      `${Math.round(1248 * multiplier).toLocaleString("id-ID")} lead`;
    this.funnel.innerHTML = pipeline
      .map(
        ([label, count, width]) => `
          <div class="dashboard-funnel-row">
            <span>${label}</span>
            <div class="dashboard-funnel-track"><i style="width:${width}%"></i></div>
            <b>${Math.max(1, Math.round(count * multiplier)).toLocaleString("id-ID")}</b>
          </div>
        `,
      )
      .join("");

    this.branchTable.innerHTML = this.scopedBranches()
      .map(
        (branch) => `
          <tr>
            <td>${branch.name}</td>
            <td>${this.formatRupiahCompact(branch.revenue * this.periodMultiplier())}</td>
            <td>${Math.round(branch.closing * this.periodMultiplier())} unit</td>
            <td>${branch.conversion.toFixed(1).replace(".", ",")}%</td>
            <td><span class="dashboard-target-cell"><i style="--progress:${branch.target}%"></i>${branch.target}%</span></td>
          </tr>
        `,
      )
      .join("");

    const agents = this.branch === "all"
      ? dashboardDemoData.agents
      : dashboardDemoData.agents.filter((agent) => agent.branch.toLocaleLowerCase("id").replaceAll(" ", "-") === this.branch);
    this.agentList.innerHTML = agents
      .slice(0, 4)
      .map(
        (agent, index) => `
          <div class="dashboard-agent">
            <span>${index + 1}</span>
            <span class="dashboard-agent-avatar">${this.initials(agent.name)}</span>
            <div><b>${agent.name}</b><small>${agent.branch} · ${Math.round(agent.closing * this.periodMultiplier())} closing</small></div>
            <strong>${this.formatRupiahCompact(agent.revenue * this.periodMultiplier())}</strong>
          </div>
        `,
      )
      .join("");

    const branchName = this.branchSelect.options[this.branchSelect.selectedIndex].text;
    const alerts = [
      {
        type: "warning",
        icon: "!",
        title: "7 lead HOT belum ditindaklanjuti",
        copy: `${branchName} · potensi Rp186 jt menunggu respons sales.`,
      },
      {
        type: "positive",
        icon: "↑",
        title: "Konversi naik 18,6%",
        copy: "WhatsApp menjadi sumber dengan pertumbuhan closing tertinggi.",
      },
      {
        type: "info",
        icon: "i",
        title: "Forecast mencapai 108% target",
        copy: "Pertahankan kecepatan follow-up untuk mengamankan proyeksi.",
      },
    ];
    this.alertList.innerHTML = alerts
      .map(
        (alert) => `
          <div class="dashboard-alert-item ${alert.type}">
            <span>${alert.icon}</span>
            <div><b>${alert.title}</b><p>${alert.copy}</p></div>
          </div>
        `,
      )
      .join("");

    this.renderWidgets();
  }

  renderWidgets() {
    for (const widget of this.root.querySelectorAll("[data-dashboard-widget]")) {
      widget.hidden = !this.visibleWidgets.has(widget.dataset.dashboardWidget);
    }
  }

  formatRupiahCompact(valueInMillions) {
    if (valueInMillions >= 1000) {
      return `Rp${(valueInMillions / 1000).toFixed(2).replace(".", ",")} M`;
    }
    return `Rp${Math.round(valueInMillions).toLocaleString("id-ID")} jt`;
  }

  initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toLocaleUpperCase("id");
  }
}

const dashboardDemoMount = document.getElementById("dashboardDemo");
if (dashboardDemoMount) {
  new OneDashboardDemo(dashboardDemoMount);
}

const socialDemoVehicles = [
  {
    id: "zenix",
    name: "Toyota Innova Zenix",
    shortName: "Innova Zenix",
    year: "2023",
    specs: "Hybrid · Automatic · 7 Seater",
    price: "Rp468 juta",
    offer: "TDP mulai Rp48 juta",
    color: "#f8fafc",
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "2.0 L Hybrid",
    seats: 7,
    features: ["TNGA Hybrid", "Panoramic Roof", "Captain Seat", "TSS Safety"],
    caption:
      "Naik kelas bersama Toyota Innova Zenix Hybrid 2023. Kabin premium, hemat bahan bakar, dan siap menemani setiap perjalanan keluarga. TDP mulai Rp48 juta. #ZENIXHYBRID #MobixAutos",
  },
  {
    id: "brv",
    name: "Honda BR-V Prestige",
    shortName: "BR-V Prestige",
    year: "2021",
    specs: "CVT · 7 Seater · Sensing",
    price: "Rp255 juta",
    offer: "Cicilan mulai Rp5,8 juta",
    color: "#94a3b8",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Honda Sensing", "LaneWatch", "7 Seater", "Smart Key"],
    caption:
      "Waktunya membawa keluarga menjelajah lebih jauh bersama Honda BR-V Prestige CVT. Nyaman, lega, dan siap pakai. Cicilan mulai Rp5,8 juta. #BRVFAMILY #MobixAutos",
  },
  {
    id: "xpander",
    name: "Mitsubishi Xpander",
    shortName: "Xpander Ultimate",
    year: "2021",
    specs: "Ultimate · Automatic · 7 Seater",
    price: "Rp239 juta",
    offer: "Bonus servis berkala",
    color: "#f1f5f9",
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Head Unit 9\"", "Keyless Push Start", "Cruise Control", "Rear Camera"],
    caption:
      "Mitsubishi Xpander Ultimate—partner andal untuk aktivitas dan liburan keluarga. Unit ready dengan bonus servis berkala. Jadwalkan test drive hari ini. #XPANDERWEEKEND #MobixAutos",
  },
  {
    id: "raize",
    name: "Toyota Raize GR Sport",
    shortName: "Raize GR Sport",
    year: "2022",
    specs: "1.0T · Automatic · 5 Seater",
    price: "Rp228 juta",
    offer: "TDP mulai Rp28 juta",
    color: "#14b8a6",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.0 L Turbo",
    seats: 5,
    features: ["GR Sport Kit", "Turbo Engine", "LED Projector", "Digital Meter"],
    caption:
      "Toyota Raize GR Sport 1.0 Turbo—gaya sporty, lincah di kota, irit di jalanan. TDP mulai Rp28 juta. Unit ready inspeksi lengkap. #RAIZEGR #MobixAutos",
  },
  {
    id: "pajero",
    name: "Mitsubishi Pajero Sport",
    shortName: "Pajero Sport Dakar",
    year: "2020",
    specs: "2.4 Diesel · 7 Seater",
    price: "Rp435 juta",
    offer: "Cashback suku cadang",
    color: "#475569",
    bodyType: "SUV",
    fuel: "Diesel",
    engine: "2.4 L Diesel",
    seats: 7,
    features: ["4WD Select", "Cruise Control", "Rockford Audio", "360 Camera"],
    caption:
      "Mitsubishi Pajero Sport Dakar 4x2—tangguh, lega, siap petualangan. Cashback suku cadang + servis. Jadwalkan test drive. #PAJEROSPORT #MobixAutos",
  },
  {
    id: "ertiga",
    name: "Suzuki Ertiga Hybrid",
    shortName: "Ertiga GX Hybrid",
    year: "2023",
    specs: "Hybrid · Automatic · 7 Seater",
    price: "Rp243 juta",
    offer: "Cicilan mulai Rp4,9 juta",
    color: "#0f172a",
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "1.5 L Hybrid",
    seats: 7,
    features: ["SHVS Hybrid", "ESP", "Hill Hold", "Smart Key"],
    caption:
      "Suzuki Ertiga GX Hybrid 2023—MPV hemat BBM untuk keluarga modern. Cicilan mulai Rp4,9 juta. Unit ready cabang Bekasi. #ERTIGAHYBRID #MobixAutos",
  },
  {
    id: "crv",
    name: "Honda CR-V Turbo",
    shortName: "CR-V Turbo Prestige",
    year: "2021",
    specs: "1.5T · Prestige · 7 Seater",
    price: "Rp475 juta",
    offer: "Trade-in prioritas",
    color: "#1e293b",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Honda Sensing", "Panoramic Roof", "Power Tailgate", "Leather Seat"],
    caption:
      "Honda CR-V Turbo Prestige—SUV premium dengan Honda Sensing dan panoramic roof. Trade-in prioritas minggu ini. #CRVTURBO #MobixAutos",
  },
  {
    id: "almaz",
    name: "Wuling Almaz RS",
    shortName: "Almaz RS Pro",
    year: "2022",
    specs: "1.5T · ADAS · 7 Seater",
    price: "Rp305 juta",
    offer: "Gratis IoV 1 tahun",
    color: "#b91c1c",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Internet of Vehicle", "360 Camera", "ADAS Level 2", "Panoramic Sunroof"],
    caption:
      "Wuling Almaz RS Pro—SUV cerdas dengan ADAS & IoV. Gratis konektivitas 1 tahun. Siap test drive hari ini. #ALMAZRS #MobixAutos",
  },
];

const socialDemoCampaigns = {
  zenix: {
    name: "Meta · Zenix Hybrid Juli",
    utm: "utm_campaign=zenix_hybrid_jul26",
    hashtag: "#ZENIXHYBRID",
    clicks: 1284,
    possible: 214,
    leads: 96,
    conversion: 7.5,
    change: ["18,4%", "22,1%", "16,9%", "1,3 pt"],
    trend: [
      [38, 13], [52, 19], [47, 17], [68, 26], [61, 23], [78, 34], [91, 39],
    ],
  },
  brv: {
    name: "Instagram · BR-V Family Deal",
    utm: "utm_campaign=brv_family_jul26",
    hashtag: "#BRVFAMILY",
    clicks: 864,
    possible: 148,
    leads: 71,
    conversion: 8.2,
    change: ["12,7%", "15,4%", "20,3%", "1,8 pt"],
    trend: [
      [29, 11], [35, 14], [42, 18], [40, 17], [57, 25], [64, 31], [71, 36],
    ],
  },
  xpander: {
    name: "Meta · Xpander Weekend",
    utm: "utm_campaign=xpander_weekend",
    hashtag: "#XPANDERWEEKEND",
    clicks: 642,
    possible: 103,
    leads: 43,
    conversion: 6.7,
    change: ["9,8%", "11,2%", "8,6%", "0,7 pt"],
    trend: [
      [24, 8], [31, 10], [28, 9], [39, 14], [44, 17], [51, 20], [58, 24],
    ],
  },
  raize: {
    name: "Meta · Raize GR Sport",
    utm: "utm_campaign=raize_gr_jul26",
    hashtag: "#RAIZEGR",
    clicks: 712,
    possible: 118,
    leads: 52,
    conversion: 7.3,
    change: ["14,2%", "16,8%", "11,5%", "0,9 pt"],
    trend: [
      [26, 9], [33, 12], [41, 15], [48, 19], [55, 22], [62, 28], [70, 31],
    ],
  },
  pajero: {
    name: "Facebook · Pajero Sport Dakar",
    utm: "utm_campaign=pajero_dakar",
    hashtag: "#PAJEROSPORT",
    clicks: 498,
    possible: 82,
    leads: 31,
    conversion: 6.2,
    change: ["7,4%", "9,1%", "5,8%", "0,5 pt"],
    trend: [
      [18, 6], [22, 7], [27, 9], [31, 11], [36, 13], [42, 16], [48, 18],
    ],
  },
  ertiga: {
    name: "Instagram · Ertiga Hybrid Deal",
    utm: "utm_campaign=ertiga_hybrid",
    hashtag: "#ERTIGAHYBRID",
    clicks: 580,
    possible: 96,
    leads: 44,
    conversion: 7.6,
    change: ["10,3%", "12,6%", "14,1%", "1,1 pt"],
    trend: [
      [21, 8], [28, 11], [34, 13], [39, 16], [46, 19], [53, 23], [61, 27],
    ],
  },
};

class SocialGrowthDemo {
  constructor(root) {
    this.root = root;
    this.view = "studio";
    this.vehicleId = "zenix";
    this.format = "square";
    this.platforms = new Set(["instagram", "facebook"]);
    this.captionVariant = 0;
    this.monthOffset = 0;
    this.lastFocusedElement = null;
    this.posts = this.defaultPosts();
    this.guideStepIndex = 0;
    this.hasOpenedGuide = false;

    this.vehicleOptions = root.querySelector("[data-social-vehicle-options]");
    this.captionInput = root.querySelector("[data-social-caption]");
    this.headlineInput = root.querySelector("[data-social-headline]");
    this.offerInput = root.querySelector("[data-social-offer]");
    this.dateInput = root.querySelector("[data-social-date]");
    this.timeInput = root.querySelector("[data-social-time]");
    this.toast = root.querySelector("[data-social-toast]");
    this.campaignSelect = root.querySelector("[data-social-campaign]");
    this.guide = root.querySelector("[data-social-guide-popover]");

    this.bind();
    this.reset();
    this.loadTenantPosts();
  }

  async loadTenantPosts(force = false) {
    try {
      const snapshot = await publicDemoData.snapshot(force);
      if (Array.isArray(snapshot.inventory) && snapshot.inventory.length) {
        this.applyInventoryPhotos(
          snapshot.inventory.map((unit) => ({
            id: unit.id,
            brand: unit.brand,
            type: unit.type,
            photoUrl: unit.photo_url || "",
          })),
        );
      }
      if (snapshot.social_posts.length) {
        this.posts = snapshot.social_posts.map((post) => ({
          date: post.scheduled_at.slice(0, 10),
          title: post.title,
          platform: Array.isArray(post.platforms) ? post.platforms[0] || "instagram" : "instagram",
          status: post.status,
        }));
        this.renderCalendar();
      }
    } catch (error) {
      this.root.querySelector("[data-social-toast-copy]").textContent = error.message;
    }
  }

  defaultPosts() {
    return [
      { date: "2026-07-08", title: "BR-V Family Deal", platform: "instagram", status: "published" },
      { date: "2026-07-16", title: "Xpander Weekend", platform: "facebook", status: "published" },
      { date: "2026-07-24", title: "Tips Trade In", platform: "instagram", status: "draft" },
      { date: "2026-07-29", title: "Zenix Hybrid", platform: "instagram", status: "planned" },
    ];
  }

  guideSteps() {
    return [
      {
        view: "studio",
        title: "Social Growth Studio",
        body: "Demo Social Media & Ads Automation: alur Konten → Jadwal → Insight lead. Data mock aman, tidak terkirim ke Meta asli.",
      },
      {
        view: "studio",
        title: "Pilih unit dari inventory",
        body: "Delapan unit ready siap jadi materi iklan. Klik kartu unit untuk mengganti preview, harga, dan caption otomatis.",
        enter: () => {
          this.vehicleId = "zenix";
          this.offerInput.value = this.vehicle().offer;
          this.captionInput.value = this.vehicle().caption;
          this.renderStudio();
          this.highlightAnchor("vehicles");
        },
      },
      {
        view: "studio",
        title: "Cek fitur mobil di creative",
        body: "Setiap unit membawa spesifikasi Motovax: bodi, BBM, mesin, kapasitas, dan fitur unggulan yang ikut ke caption & preview.",
        enter: () => {
          this.vehicleId = "brv";
          this.offerInput.value = this.vehicle().offer;
          this.captionInput.value = this.vehicle().caption;
          this.renderStudio();
          this.highlightAnchor("vehicles");
        },
      },
      {
        view: "studio",
        title: "Desain & format konten",
        body: "Pilih format Post 1:1, Feed 4:5, atau Story 9:16. Edit headline dan penawaran—preview langsung berubah.",
        enter: () => {
          this.format = "portrait";
          this.renderStudio();
          this.highlightAnchor("design");
        },
      },
      {
        view: "studio",
        title: "Platform & generate caption",
        body: "Aktifkan Instagram/Facebook, lalu Generate Ulang untuk 3 varian caption berbasis unit + penawaran.",
        enter: () => {
          this.highlightAnchor("caption");
          this.root.querySelector("[data-social-generate]")?.focus();
        },
      },
      {
        view: "studio",
        title: "Jadwalkan ke tenant demo",
        body: "Atur tanggal/waktu lalu Jadwalkan. Posting tersimpan di tenant demo (tidak publish ke akun Meta).",
        enter: () => {
          this.root.querySelector(".social-progress span:last-child")?.classList.add("active");
          this.highlightAnchor("schedule");
        },
      },
      {
        view: "calendar",
        title: "Kalender konten",
        body: "Lihat draft, terjadwal, dan terbit. Setelah schedule, unit masuk sebagai posting planned di kalender.",
        enter: () => this.highlightAnchor("calendar"),
      },
      {
        view: "insight",
        title: "Campaign Insight → CRM",
        body: "Ganti campaign untuk melihat klik, lead, UTM, ranking produk, dan lead terbaru yang masuk pipeline CRM.",
        enter: () => {
          this.campaignSelect.value = "zenix";
          this.renderInsight();
          this.highlightAnchor("insight");
        },
      },
    ];
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-social-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }
    for (const button of this.root.querySelectorAll("[data-close-social-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-social-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-social-toast-close]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    for (const button of this.root.querySelectorAll("[data-social-guide]")) {
      button.addEventListener("click", () => this.openGuide(0));
    }
    this.root.querySelector("[data-close-social-guide]")?.addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-social-guide-next]")?.addEventListener("click", () => this.nextGuideStep());
    this.root.querySelector("[data-social-guide-prev]")?.addEventListener("click", () => this.prevGuideStep());
    this.root.querySelector("[data-social-guide-finish]")?.addEventListener("click", () => this.closeGuide());

    for (const button of this.root.querySelectorAll("[data-social-nav]")) {
      button.addEventListener("click", () => this.switchView(button.dataset.socialNav || "studio"));
    }

    this.vehicleOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-social-vehicle]");
      if (!button) return;
      this.vehicleId = button.dataset.socialVehicle;
      this.offerInput.value = this.vehicle().offer;
      this.captionInput.value = this.vehicle().caption;
      this.renderStudio();
    });

    for (const button of this.root.querySelectorAll("[data-social-format]")) {
      button.addEventListener("click", () => {
        this.format = button.dataset.socialFormat || "square";
        this.renderStudio();
      });
    }

    for (const button of this.root.querySelectorAll("[data-social-platform]")) {
      button.addEventListener("click", () => {
        const platform = button.dataset.socialPlatform;
        if (!platform) return;
        if (this.platforms.has(platform)) {
          if (this.platforms.size === 1) return;
          this.platforms.delete(platform);
        } else {
          this.platforms.add(platform);
        }
        this.renderStudio();
      });
    }

    this.headlineInput.addEventListener("input", () => this.renderPreviewCopy());
    this.offerInput.addEventListener("input", () => this.renderPreviewCopy());
    this.captionInput.addEventListener("input", () => this.renderPreviewCopy());

    this.root.querySelector("[data-social-generate]").addEventListener("click", () => {
      this.captionVariant += 1;
      const vehicle = this.vehicle();
      const featureLine = (vehicle.features || []).slice(0, 2).join(" · ");
      const variants = [
        vehicle.caption,
        `${vehicle.name} ${vehicle.year} siap menemani cerita baru Anda. ${this.offerInput.value}. ${featureLine ? `Highlight: ${featureLine}. ` : ""}Unit terpilih, inspeksi transparan, dan bisa test drive. ${this.hashtagForVehicle()} #MobixAutos`,
        `Cari ${vehicle.shortName} (${vehicle.fuel || "siap pakai"} · ${vehicle.seats || 7} penumpang)? Penawaran ${this.offerInput.value.toLowerCase()}. ${this.hashtagForVehicle()} #MobilBekasBerkualitas`,
      ];
      this.captionInput.value = variants[this.captionVariant % variants.length];
      this.renderPreviewCopy();
    });

    this.root.querySelector("[data-social-schedule]").addEventListener("click", () => this.schedule());
    this.root.querySelector("[data-social-month-prev]").addEventListener("click", () => {
      this.monthOffset = Math.max(0, this.monthOffset - 1);
      this.renderCalendar();
    });
    this.root.querySelector("[data-social-month-next]").addEventListener("click", () => {
      this.monthOffset = Math.min(1, this.monthOffset + 1);
      this.renderCalendar();
    });
    this.campaignSelect.addEventListener("change", () => this.renderInsight());

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) this.toast.hidden = true;
      else if (this.guide && !this.guide.hidden) this.closeGuide();
      else this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-social-demo]").focus();
    this.loadTenantPosts(true);
    if (!this.hasOpenedGuide) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
    }
  }

  close() {
    this.closeGuide();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    if (!this.guide) return;
    this.guideStepIndex = Math.max(0, startIndex);
    this.guide.hidden = false;
    this.renderGuideStep();
    const focusBtn =
      this.guide.querySelector("[data-social-guide-next]:not([hidden])") ||
      this.guide.querySelector("[data-social-guide-finish]:not([hidden])");
    focusBtn?.focus();
  }

  closeGuide() {
    if (!this.guide) return;
    this.guide.hidden = true;
    this.clearHighlight();
  }

  highlightAnchor(name) {
    this.clearHighlight();
    const el = this.root.querySelector(`[data-social-anchor="${name}"]`);
    if (el) el.classList.add("social-guide-highlight");
  }

  clearHighlight() {
    for (const el of this.root.querySelectorAll(".social-guide-highlight")) {
      el.classList.remove("social-guide-highlight");
    }
  }

  renderGuideStep() {
    if (!this.guide) return;
    const steps = this.guideSteps();
    const step = steps[this.guideStepIndex] || steps[0];
    const total = steps.length;
    const index = this.guideStepIndex + 1;

    this.guide.querySelector("[data-social-guide-step-label]").textContent =
      `LANGKAH ${index} DARI ${total}`;
    this.guide.querySelector("[data-social-guide-title]").textContent = step.title;
    this.guide.querySelector("[data-social-guide-body]").textContent = step.body;

    const prev = this.guide.querySelector("[data-social-guide-prev]");
    const next = this.guide.querySelector("[data-social-guide-next]");
    const finish = this.guide.querySelector("[data-social-guide-finish]");
    const isLast = this.guideStepIndex >= total - 1;
    const isFirst = this.guideStepIndex <= 0;

    if (prev) prev.hidden = isFirst;
    if (next) next.hidden = isLast;
    if (finish) finish.hidden = !isLast;

    if (step.view) this.switchView(step.view);
    if (typeof step.enter === "function") step.enter();
  }

  nextGuideStep() {
    const steps = this.guideSteps();
    if (this.guideStepIndex >= steps.length - 1) {
      this.closeGuide();
      return;
    }
    this.guideStepIndex += 1;
    this.renderGuideStep();
  }

  prevGuideStep() {
    if (this.guideStepIndex <= 0) return;
    this.guideStepIndex -= 1;
    this.renderGuideStep();
  }

  reset() {
    this.view = "studio";
    this.vehicleId = "zenix";
    this.format = "square";
    this.platforms = new Set(["instagram", "facebook"]);
    this.captionVariant = 0;
    this.monthOffset = 0;
    this.posts = this.defaultPosts();
    this.headlineInput.value = "Drive Your Dream Today";
    this.offerInput.value = this.vehicle().offer;
    this.captionInput.value = this.vehicle().caption;
    this.dateInput.value = "2026-07-31";
    this.timeInput.value = "09:00";
    this.campaignSelect.value = "zenix";
    this.toast.hidden = true;
    this.closeGuide();
    this.root.querySelector(".social-progress span:last-child").classList.remove("active");
    this.renderAll();
    this.switchView("studio");
  }

  vehicle() {
    return socialDemoVehicles.find((vehicle) => vehicle.id === this.vehicleId) || socialDemoVehicles[0];
  }

  hashtagForVehicle() {
    const map = {
      brv: "#BRVFAMILY",
      xpander: "#XPANDERWEEKEND",
      raize: "#RAIZEGR",
      pajero: "#PAJEROSPORT",
      ertiga: "#ERTIGAHYBRID",
      crv: "#CRVTURBO",
      almaz: "#ALMAZRS",
      zenix: "#ZENIXHYBRID",
    };
    return map[this.vehicleId] || "#MOTOVAX";
  }

  switchView(view) {
    this.view = view;
    const headings = {
      studio: {
        breadcrumb: "Social Media / Content Studio",
        title: "Buat Konten Siap Tayang",
        description: "Pilih unit, sesuaikan desain, lalu jadwalkan ke channel pilihan dalam satu alur.",
      },
      calendar: {
        breadcrumb: "Social Media / Kalender Posting",
        title: "Kalender Konten",
        description: "Lihat seluruh draft, jadwal, dan konten yang sudah terbit dalam satu kalender.",
      },
      insight: {
        breadcrumb: "Social Media / Campaign Insight",
        title: "Campaign Insight",
        description: "Hubungkan setiap klik campaign dengan lead dan status CRM yang dihasilkan.",
      },
    };
    const heading = headings[view] || headings.studio;

    for (const button of this.root.querySelectorAll("[data-social-nav]")) {
      const active = button.dataset.socialNav === view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    }
    for (const panel of this.root.querySelectorAll("[data-social-view-panel]")) {
      const active = panel.dataset.socialViewPanel === view;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    }
    this.root.querySelector("[data-social-breadcrumb]").textContent = heading.breadcrumb;
    this.root.querySelector("[data-social-page-title]").textContent = heading.title;
    this.root.querySelector("[data-social-page-description]").textContent = heading.description;
    if (view === "calendar") this.renderCalendar();
    if (view === "insight") this.renderInsight();
    this.root.querySelector(".social-workspace").scrollTop = 0;
  }

  renderAll() {
    this.renderVehicles();
    this.renderStudio();
    this.renderCalendar();
    this.renderInsight();
  }

  applyInventoryPhotos(units) {
    if (!Array.isArray(units) || !units.length) return;
    const tokens = {
      zenix: ["zenix", "innova"],
      brv: ["br-v", "brv"],
      xpander: ["xpander"],
      raize: ["raize"],
      pajero: ["pajero"],
      ertiga: ["ertiga"],
      crv: ["cr-v", "crv"],
      almaz: ["almaz"],
    };
    for (const vehicle of socialDemoVehicles) {
      const keys = tokens[vehicle.id] || [vehicle.shortName.toLowerCase()];
      const match = units.find((unit) => {
        const hay = `${unit.brand || ""} ${unit.type || ""}`.toLowerCase();
        return keys.some((key) => hay.includes(key));
      });
      if (match?.photoUrl) {
        vehicle.photoUrl = match.photoUrl;
        vehicle.unitId = match.id;
      }
    }
    this.renderStudio();
  }

  renderVehicles() {
    const countEl = this.root.querySelector("[data-social-vehicle-count]");
    if (countEl) countEl.textContent = `${socialDemoVehicles.length} unit ready`;

    this.vehicleOptions.innerHTML = socialDemoVehicles
      .map((vehicle) => {
        const featureHint = (vehicle.features || []).slice(0, 2).join(" · ");
        const thumb = vehicle.photoUrl
          ? `<span class="social-vehicle-thumb has-photo" style="--car-color:${vehicle.color}"><img src="${vehicle.photoUrl}" alt="" loading="lazy" /></span>`
          : `<span class="social-vehicle-thumb" style="--car-color:${vehicle.color}"></span>`;
        return `
          <button class="social-vehicle-card ${vehicle.id === this.vehicleId ? "active" : ""}" type="button" data-social-vehicle="${vehicle.id}">
            ${thumb}
            <span>
              <b>${vehicle.shortName}</b>
              <small>${vehicle.year} · ${vehicle.price}</small>
              <small class="social-vehicle-meta">${vehicle.fuel || "—"} · ${vehicle.seats || "—"} penumpang${featureHint ? ` · ${featureHint}` : ""}</small>
            </span>
            <em>✓</em>
          </button>
        `;
      })
      .join("");
  }

  renderStudio() {
    const vehicle = this.vehicle();
    this.renderVehicles();
    for (const button of this.root.querySelectorAll("[data-social-format]")) {
      const active = button.dataset.socialFormat === this.format;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    for (const button of this.root.querySelectorAll("[data-social-platform]")) {
      const active = this.platforms.has(button.dataset.socialPlatform);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const formatLabels = {
      square: "Instagram Post · 1:1",
      portrait: "Facebook / IG Feed · 4:5",
      story: "Instagram Story · 9:16",
    };
    const creative = this.root.querySelector("[data-social-creative]");
    creative.className = `social-creative-frame ${this.format}${vehicle.photoUrl ? " has-photo" : ""}`;
    this.root.querySelector("[data-social-preview-format]").textContent = formatLabels[this.format];
    this.root.querySelector("[data-social-creative-title]").textContent = vehicle.name;
    const featureTag = (vehicle.features || [])[0];
    this.root.querySelector("[data-social-creative-year]").textContent = featureTag
      ? `${vehicle.year} · ${vehicle.specs} · ${featureTag}`
      : `${vehicle.year} · ${vehicle.specs}`;
    const carArt = this.root.querySelector("[data-social-car-art]");
    carArt.style.setProperty("--preview-car", vehicle.color);
    if (vehicle.photoUrl) {
      carArt.style.backgroundImage = `url("${vehicle.photoUrl}")`;
      carArt.classList.add("has-photo");
    } else {
      carArt.style.backgroundImage = "";
      carArt.classList.remove("has-photo");
    }
    const platformCount = this.platforms.size;
    this.root.querySelector("[data-social-platform-count]").textContent =
      `${platformCount} platform`;
    this.renderPreviewCopy();
  }

  renderPreviewCopy() {
    const headline = this.headlineInput.value.trim() || "Drive Your Dream Today";
    const offer = this.offerInput.value.trim() || this.vehicle().offer;
    const caption = this.captionInput.value.trim();
    this.root.querySelector("[data-social-creative-headline]").textContent = headline.toLocaleUpperCase("id");
    this.root.querySelector("[data-social-creative-offer]").textContent = offer;
    this.root.querySelector("[data-social-preview-caption]").textContent = caption;
    this.root.querySelector("[data-social-caption-count]").textContent = `${caption.length}/500`;
  }

  async schedule() {
    const date = this.dateInput.value;
    const time = this.timeInput.value;
    if (!date || !time) return;
    const selectedPlatforms = [...this.platforms];
    const scheduleButton = this.root.querySelector("[data-social-schedule]");
    scheduleButton.disabled = true;
    const originalLabel = scheduleButton.textContent;
    scheduleButton.textContent = "Menyimpan ke tenant demo…";
    try {
      await publicDemoData.submit("social_schedule", {
        title: this.vehicle().shortName,
        caption: this.captionInput.value.trim(),
        platforms: selectedPlatforms,
        scheduled_at: new Date(`${date}T${time}:00+07:00`).toISOString(),
        unit_interest: this.vehicle().name,
      });
    } catch (error) {
      scheduleButton.disabled = false;
      scheduleButton.textContent = originalLabel;
      this.root.querySelector("[data-social-toast-copy]").textContent = error.message;
      this.toast.hidden = false;
      return;
    }
    const existingIndex = this.posts.findIndex((post) => post.isDemoScheduled);
    const post = {
      date,
      title: this.vehicle().shortName,
      platform: selectedPlatforms[0],
      status: "planned",
      isDemoScheduled: true,
    };
    if (existingIndex >= 0) this.posts[existingIndex] = post;
    else this.posts.push(post);
    this.monthOffset = date.startsWith("2026-08") ? 1 : 0;
    this.renderCalendar();
    this.root.querySelector("[data-social-toast-copy]").textContent =
      `${this.vehicle().shortName} tersimpan di tenant demo · ${this.formatDate(date)} pukul ${time} WIB.`;
    this.root.querySelector(".social-progress span:last-child").classList.add("active");
    this.toast.hidden = false;
    this.switchView("calendar");
    scheduleButton.disabled = false;
    scheduleButton.textContent = originalLabel;
  }

  renderCalendar() {
    const year = 2026;
    const month = 6 + this.monthOffset;
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus"];
    this.root.querySelector("[data-social-month-title]").textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(Date.UTC(year, month, 1));
    const mondayOffset = (firstDay.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const daysInPrevious = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const cellCount = mondayOffset + daysInMonth > 35 ? 42 : 35;
    const cells = [];

    for (let index = 0; index < cellCount; index += 1) {
      const day = index - mondayOffset + 1;
      const inMonth = day >= 1 && day <= daysInMonth;
      const displayDay = day < 1 ? daysInPrevious + day : day > daysInMonth ? day - daysInMonth : day;
      const date = inMonth
        ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        : "";
      const dayPosts = date ? this.posts.filter((post) => post.date === date) : [];
      const postMarkup = dayPosts
        .map(
          (post) => `
            <button class="social-calendar-post ${post.status} ${post.platform}" type="button" title="${post.title}">
              <i>${post.platform === "facebook" ? "FB" : "IG"}</i>${post.title}
            </button>
          `,
        )
        .join("");
      cells.push(`<div class="social-calendar-day ${inMonth ? "" : "is-muted"}"><span>${displayDay}</span>${postMarkup}</div>`);
    }
    this.root.querySelector("[data-social-calendar-days]").innerHTML = cells.join("");
    const planned = this.posts.filter((post) => post.status === "planned").length;
    this.root.querySelector("[data-social-total-posts]").textContent = String(this.posts.length);
    this.root.querySelector("[data-social-planned-posts]").textContent = String(planned);
    this.root.querySelector("[data-social-calendar-count]").textContent = String(this.posts.length);
  }

  renderInsight() {
    const campaign = socialDemoCampaigns[this.campaignSelect.value] || socialDemoCampaigns.zenix;
    this.root.querySelector("[data-social-campaign-name]").textContent = campaign.name;
    this.root.querySelector("[data-social-utm]").textContent = campaign.utm;
    this.root.querySelector("[data-social-hashtag]").textContent = campaign.hashtag;

    const metrics = [
      ["↗", "Tracked Clicks", campaign.clicks.toLocaleString("id-ID")],
      ["◷", "Possible Leads", campaign.possible.toLocaleString("id-ID")],
      ["✓", "Confirmed Leads", campaign.leads.toLocaleString("id-ID")],
      ["%", "Conversion Rate", `${campaign.conversion.toFixed(1).replace(".", ",")}%`],
    ];
    this.root.querySelector("[data-social-insight-kpis]").innerHTML = metrics
      .map(
        ([icon, label, value], index) => `
          <article class="social-insight-kpi"><span>${icon}</span><div><small>${label}</small><b>${value}</b><em>↑ ${campaign.change[index]} vs lalu</em></div></article>
        `,
      )
      .join("");

    const maxClicks = Math.max(...campaign.trend.map((point) => point[0]));
    this.root.querySelector("[data-social-trend-chart]").innerHTML = campaign.trend
      .map(
        ([clicks, leads], index) => `
          <div class="social-trend-day">
            <i style="height:${Math.max(8, (clicks / maxClicks) * 100)}%"></i>
            <i style="height:${Math.max(8, (leads / maxClicks) * 100)}%"></i>
            <span>${22 + index} Jul</span>
          </div>
        `,
      )
      .join("");

    const steps = [
      ["UTM", "Tracked Click", campaign.utm, campaign.clicks],
      ["?", "Possible Lead", "Nomor mulai teridentifikasi", campaign.possible],
      ["CRM", "Confirmed Lead", "Customer masuk pipeline", campaign.leads],
    ];
    this.root.querySelector("[data-social-attribution]").innerHTML = steps
      .map(
        ([icon, label, copy, value]) => `
          <div class="social-attribution-step"><span>${icon}</span><div><b>${label}</b><small>${copy}</small></div><strong>${Number(value).toLocaleString("id-ID")}</strong></div>
        `,
      )
      .join("");

    const rankingByCampaign = {
      zenix: [
        ["Toyota Innova Zenix", "498 klik · 42 lead", "8,4%"],
        ["Honda BR-V Prestige", "382 klik · 29 lead", "7,6%"],
        ["Suzuki Ertiga Hybrid", "301 klik · 22 lead", "7,3%"],
        ["Mitsubishi Xpander", "274 klik · 18 lead", "6,6%"],
      ],
      brv: [
        ["Honda BR-V Prestige", "412 klik · 34 lead", "8,3%"],
        ["Toyota Raize GR Sport", "298 klik · 21 lead", "7,0%"],
        ["Honda CR-V Turbo", "256 klik · 17 lead", "6,6%"],
        ["Wuling Almaz RS", "188 klik · 12 lead", "6,4%"],
      ],
      xpander: [
        ["Mitsubishi Xpander", "320 klik · 24 lead", "7,5%"],
        ["Suzuki Ertiga Hybrid", "245 klik · 18 lead", "7,3%"],
        ["Toyota Innova Zenix", "198 klik · 14 lead", "7,1%"],
        ["Daihatsu Xenia ADS", "142 klik · 9 lead", "6,3%"],
      ],
      raize: [
        ["Toyota Raize GR Sport", "356 klik · 28 lead", "7,9%"],
        ["Honda BR-V Prestige", "274 klik · 19 lead", "6,9%"],
        ["Wuling Almaz RS", "210 klik · 14 lead", "6,7%"],
        ["Daihatsu Rocky", "156 klik · 9 lead", "5,8%"],
      ],
      pajero: [
        ["Mitsubishi Pajero Sport", "288 klik · 18 lead", "6,3%"],
        ["Honda CR-V Turbo", "241 klik · 15 lead", "6,2%"],
        ["Toyota Innova Zenix", "198 klik · 12 lead", "6,1%"],
        ["Mitsubishi Xpander", "164 klik · 9 lead", "5,5%"],
      ],
      ertiga: [
        ["Suzuki Ertiga Hybrid", "310 klik · 26 lead", "8,4%"],
        ["Mitsubishi Xpander", "252 klik · 18 lead", "7,1%"],
        ["Toyota Avanza G", "198 klik · 13 lead", "6,6%"],
        ["Honda Mobilio", "141 klik · 8 lead", "5,7%"],
      ],
    };
    const campaignKey = this.campaignSelect.value;
    const ranking = rankingByCampaign[campaignKey] || rankingByCampaign.zenix;
    this.root.querySelector("[data-social-product-ranking]").innerHTML = ranking
      .map(
        ([name, copy, conversion], index) => `
          <div class="social-product-row"><span>${index + 1}</span><span class="social-product-thumb"></span><div><b>${name}</b><small>${copy}</small></div><strong>${conversion}</strong></div>
        `,
      )
      .join("");

    const leads = [
      ["Nadia Putri", "Innova Zenix", "Instagram", "Prospek"],
      ["Raka Aditya", "Honda BR-V", "Facebook", "Follow-up"],
      ["Dewi Maharani", "Innova Zenix", "Instagram", "Test Drive"],
      ["Bima Pratama", "Raize GR Sport", "Instagram", "Prospek"],
      ["Siti Aulia", "Ertiga Hybrid", "Facebook", "Follow-up"],
      ["Andi Wijaya", "Pajero Sport", "Facebook", "Test Drive"],
    ];
    this.root.querySelector("[data-social-leads]").innerHTML = leads
      .map(
        ([customer, product, source, status]) => `
          <tr><td>${customer}</td><td>${product}</td><td>${source}</td><td><span class="social-lead-status">${status}</span></td></tr>
        `,
      )
      .join("");
  }

  formatDate(value) {
    const date = new Date(`${value}T00:00:00Z`);
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  }
}

const socialDemoMount = document.getElementById("socialDemo");
let socialGrowthDemoInstance = null;
if (socialDemoMount) {
  socialGrowthDemoInstance = new SocialGrowthDemo(socialDemoMount);
  window.__motovaxApplyInventoryPhotos = (units) => {
    socialGrowthDemoInstance?.applyInventoryPhotos(units);
  };
}

const insightDemoSources = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "WA",
    volume: 562,
    hot: 78,
    response: 1.4,
    conversion: 8.7,
    followup: 34,
    status: "Peluang tinggi",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "IG",
    volume: 318,
    hot: 52,
    response: 2.1,
    conversion: 9.4,
    followup: 17,
    status: "Terbaik",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "FB",
    volume: 246,
    hot: 31,
    response: 3.8,
    conversion: 6.1,
    followup: 22,
    status: "Perlu optimasi",
  },
  {
    id: "website",
    name: "Website",
    icon: "WEB",
    volume: 122,
    hot: 19,
    response: 2.6,
    conversion: 7.2,
    followup: 9,
    status: "Stabil",
  },
];

const insightDemoGoals = {
  conversion: {
    label: "Tingkatkan Konversi",
    title: "Conversion Intelligence",
    description: "Temukan kebocoran funnel dan peluang terbesar untuk meningkatkan closing.",
    focus: "Fokus aktif: tingkatkan konversi dari lead masuk hingga closing.",
    opportunityTitle: "Pulihkan 18 deal potensial",
    opportunityCopy:
      "23 lead Warm belum mendapat follow-up dalam 2 jam. Prioritaskan sekarang untuk menaikkan peluang closing.",
    potentialUplift: 1.4,
    bottleneck: "Warm → Hot kehilangan 42% peluang",
    bestTime: "Selasa–Kamis · 10:00–14:00",
  },
  response: {
    label: "Percepat Respons",
    title: "Response Intelligence",
    description: "Lihat kapan dan di mana lead menunggu terlalu lama sebelum ditangani.",
    focus: "Fokus aktif: pangkas waktu respons dan cegah lead kehilangan momentum.",
    opportunityTitle: "Pangkas respons hingga 1,8 menit",
    opportunityCopy:
      "Volume tertinggi terjadi pukul 10:00–14:00, sementara kapasitas tim turun 21%. Atur ulang prioritas antrian untuk merespons lebih cepat.",
    potentialUplift: 0.9,
    bottleneck: "Connected → Warm melambat saat jam sibuk",
    bestTime: "Senin–Kamis · 09:00–13:00",
  },
  hot: {
    label: "Prioritaskan Lead HOT",
    title: "HOT Lead Intelligence",
    description: "Pisahkan peluang siap closing dan arahkan tindakan tim ke lead bernilai tinggi.",
    focus: "Fokus aktif: amankan lead HOT sebelum melewati SLA follow-up.",
    opportunityTitle: "Amankan 11 lead HOT hari ini",
    opportunityCopy:
      "11 lead HOT belum mendapat tindakan lanjutan. Handoff ke agent dengan kapasitas terbaik dapat mempertahankan peluang closing.",
    potentialUplift: 1.1,
    bottleneck: "11 lead HOT berisiko melewati SLA",
    bestTime: "Hari kerja · 09:00–16:00",
  },
};

class ConversionInsightDemo {
  constructor(root) {
    this.root = root;
    this.sources = insightDemoSources.map((source) => ({ ...source }));
    this.goal = "conversion";
    this.period = "month";
    this.selectedSources = new Set(this.sources.map((source) => source.id));
    this.visibleWidgets = new Set(["kpi", "funnel", "opportunity", "sources", "heatmap", "actions"]);
    this.actionApplied = false;
    this.lastFocusedElement = null;
    this.hasOpened = false;

    this.customizer = root.querySelector("[data-insight-customizer]");
    this.customizerBackdrop = root.querySelector("[data-insight-customizer-backdrop]");
    this.toast = root.querySelector("[data-insight-toast]");
    this.kpiGrid = root.querySelector("[data-insight-widget='kpi']");
    this.funnel = root.querySelector("[data-insight-funnel]");
    this.sourceList = root.querySelector("[data-insight-source-list]");
    this.heatmap = root.querySelector("[data-insight-heatmap]");
    this.actionList = root.querySelector("[data-insight-action-list]");
    this.runActionButton = root.querySelector("[data-insight-run-action]");

    this.bind();
    this.reset();
    this.loadTenantMetrics();
  }

  async loadTenantMetrics(force = false) {
    try {
      const snapshot = await publicDemoData.snapshot(force);
      const sourceByID = new Map(
        snapshot.sources.map((source) => [this.sourceID(source.name), source]),
      );
      this.sources = insightDemoSources.map((source) => {
        const live = sourceByID.get(source.id);
        if (!live) return { ...source, volume: 0, hot: 0, followup: 0, conversion: 0 };
        return {
          ...source,
          volume: live.total,
          hot: live.hot,
          followup: Math.max(0, live.total - live.hot - live.closing),
          conversion: live.conversion,
        };
      });
      this.render();
    } catch (error) {
      this.showToast("Data tenant demo belum dimuat", error.message);
    }
  }

  sourceID(name) {
    const value = String(name).toLocaleLowerCase("id");
    if (value.includes("whatsapp")) return "whatsapp";
    if (value.includes("instagram")) return "instagram";
    if (value.includes("facebook") || value.includes("messenger")) return "facebook";
    return "website";
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-insight-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }
    for (const button of this.root.querySelectorAll("[data-close-insight-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-insight-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-insight-customize]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-insight-customize-banner]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-insight-customize-sidebar]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-insight-customizer-close]").addEventListener("click", () => this.closeCustomizer());
    this.customizerBackdrop.addEventListener("click", () => this.closeCustomizer());
    this.root.querySelector("[data-insight-toast-close]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    for (const button of this.root.querySelectorAll("[data-insight-period]")) {
      button.addEventListener("click", () => {
        this.period = button.dataset.insightPeriod || "month";
        this.actionApplied = false;
        this.render();
      });
    }

    for (const button of this.root.querySelectorAll("[data-insight-goal]")) {
      button.addEventListener("click", () => {
        this.goal = button.dataset.insightGoal || "conversion";
        this.actionApplied = false;
        this.render();
      });
    }

    for (const input of this.root.querySelectorAll("[data-insight-source]")) {
      input.addEventListener("change", () => {
        const source = input.value;
        if (!input.checked && this.selectedSources.size === 1) {
          input.checked = true;
          return;
        }
        if (input.checked) this.selectedSources.add(source);
        else this.selectedSources.delete(source);
        this.actionApplied = false;
        this.render();
      });
    }

    for (const input of this.root.querySelectorAll("[data-insight-toggle]")) {
      input.addEventListener("change", () => {
        const widget = input.dataset.insightToggle;
        if (!widget) return;
        if (input.checked) this.visibleWidgets.add(widget);
        else this.visibleWidgets.delete(widget);
        this.renderWidgets();
      });
    }

    this.root.querySelector("[data-insight-save]").addEventListener("click", () => {
      this.closeCustomizer();
      this.showToast(
        "Tampilan insight disimpan",
        `Fokus ${insightDemoGoals[this.goal].label} siap digunakan.`,
      );
    });

    this.runActionButton.addEventListener("click", async () => {
      if (this.actionApplied) return;
      this.runActionButton.disabled = true;
      try {
        await publicDemoData.submit("insight_action", {
          message: `Menjalankan fokus insight: ${insightDemoGoals[this.goal].label}`,
        });
      } catch (error) {
        this.runActionButton.disabled = false;
        this.showToast("Rekomendasi belum tersimpan", error.message);
        return;
      }
      this.actionApplied = true;
      this.render();
      this.showToast(
        "Rekomendasi demo dijalankan",
        "Proyeksi KPI diperbarui dan aktivitas tercatat di tenant demo.",
      );
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) this.toast.hidden = true;
      else if (this.customizer.classList.contains("is-open")) this.closeCustomizer();
      else this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-insight-demo]").focus();
    if (!this.hasOpened) {
      this.openCustomizer();
      this.hasOpened = true;
    }
  }

  close() {
    this.closeCustomizer();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openCustomizer() {
    this.customizer.classList.add("is-open");
    this.customizer.setAttribute("aria-hidden", "false");
    this.customizerBackdrop.hidden = false;
    this.customizer.querySelector("[data-insight-customizer-close]").focus();
  }

  closeCustomizer() {
    this.customizer.classList.remove("is-open");
    this.customizer.setAttribute("aria-hidden", "true");
    this.customizerBackdrop.hidden = true;
  }

  showToast(title, copy) {
    this.root.querySelector("[data-insight-toast-title]").textContent = title;
    this.root.querySelector("[data-insight-toast-copy]").textContent = copy;
    this.toast.hidden = false;
  }

  reset() {
    this.goal = "conversion";
    this.period = "month";
    this.selectedSources = new Set(this.sources.map((source) => source.id));
    this.visibleWidgets = new Set(["kpi", "funnel", "opportunity", "sources", "heatmap", "actions"]);
    this.actionApplied = false;
    this.toast.hidden = true;
    for (const input of this.root.querySelectorAll("[data-insight-source]")) input.checked = true;
    for (const input of this.root.querySelectorAll("[data-insight-toggle]")) input.checked = true;
    this.render();
  }

  activeSources() {
    return this.sources.filter((source) => this.selectedSources.has(source.id));
  }

  periodMultiplier() {
    if (this.period === "today") return 0.045;
    if (this.period === "week") return 0.24;
    return 1;
  }

  analytics() {
    const sources = this.activeSources();
    const multiplier = this.periodMultiplier();
    const rawLeads = sources.reduce((sum, source) => sum + source.volume, 0);
    const leads = Math.max(1, Math.round(rawLeads * multiplier));
    const rawHot = sources.reduce((sum, source) => sum + source.hot, 0);
    const hot = Math.max(1, Math.round(rawHot * multiplier));
    const response = sources.reduce((sum, source) => sum + source.response * source.volume, 0) / Math.max(1, rawLeads);
    const conversion = sources.reduce((sum, source) => sum + source.conversion * source.volume, 0) / Math.max(1, rawLeads);
    const followup = Math.max(1, Math.round(sources.reduce((sum, source) => sum + source.followup, 0) * multiplier));
    const actionCount = Math.max(1, Math.round((followup * 0.42) + (hot * 0.08)));

    return {
      sources,
      leads,
      hot,
      response: Math.max(0.6, response - (this.actionApplied && this.goal === "response" ? 0.8 : 0)),
      conversion: conversion + (this.actionApplied ? insightDemoGoals[this.goal].potentialUplift : 0),
      baseConversion: conversion,
      followup: this.actionApplied ? Math.max(0, followup - Math.ceil(followup * 0.28)) : followup,
      actionCount: this.actionApplied ? Math.max(0, actionCount - Math.ceil(actionCount * 0.6)) : actionCount,
    };
  }

  render() {
    const goal = insightDemoGoals[this.goal];
    const data = this.analytics();
    const periodLabel = this.period === "today" ? "Hari Ini" : this.period === "week" ? "Minggu Ini" : "Bulan Ini";

    this.root.querySelector("[data-insight-title]").textContent = goal.title;
    this.root.querySelector("[data-insight-description]").textContent = goal.description;
    this.root.querySelector("[data-insight-focus-copy]").textContent = goal.focus;

    for (const button of this.root.querySelectorAll("[data-insight-period]")) {
      const active = button.dataset.insightPeriod === this.period;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    for (const button of this.root.querySelectorAll("[data-insight-goal]")) {
      const active = button.dataset.insightGoal === this.goal;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const kpis = [
      ["LD", `Leads Masuk · ${periodLabel}`, data.leads.toLocaleString("id-ID"), "↑ 14,8%", "vs periode lalu", "leads"],
      ["HOT", "Lead HOT", data.hot.toLocaleString("id-ID"), "↑ 18,2%", "siap ditindaklanjuti", "hot"],
      ["RT", "Rata-rata Respons", `${data.response.toFixed(1).replace(".", ",")} mnt`, "↓ 22,4%", "lebih cepat", "response"],
      ["%", "Tingkat Konversi", `${data.conversion.toFixed(1).replace(".", ",")}%`, `↑ ${(data.conversion - 6.4).toFixed(1).replace(".", ",")} pt`, "dari lead masuk", "conversion"],
      ["FU", "Pending Follow-up", data.followup.toLocaleString("id-ID"), this.actionApplied ? "↓ 28,0%" : "↓ 8,1%", "perlu diselesaikan", "followup"],
      ["!", "Butuh Aksi · SLA", data.actionCount.toLocaleString("id-ID"), this.actionApplied ? "↓ 60,0%" : "↓ 12,3%", "prioritas tim", "action"],
    ];
    const priorityKey = this.goal === "response" ? "response" : this.goal === "hot" ? "hot" : "conversion";
    this.kpiGrid.innerHTML = kpis
      .map(
        ([icon, label, value, delta, copy, key]) => `
          <article class="dashboard-kpi-card ${key === priorityKey ? "is-priority" : ""}">
            <span>${label}<i>${icon}</i></span><b>${value}</b><small><em>${delta}</em>${copy}</small>
          </article>
        `,
      )
      .join("");

    this.renderFunnel(data);
    this.renderOpportunity(data, goal);
    this.renderSources(data);
    this.renderHeatmap(goal);
    this.renderActions(data);
    this.renderWidgets();
  }

  renderFunnel(data) {
    const closing = Math.max(1, Math.round(data.leads * data.conversion / 100));
    const stages = [
      ["Lead Masuk", data.leads, 100],
      ["Terhubung", Math.round(data.leads * 0.72), 72],
      ["Warm", Math.round(data.leads * 0.44), 44],
      ["Hot", data.hot, Math.max(12, (data.hot / data.leads) * 100)],
      ["Closing", closing, Math.max(7, (closing / data.leads) * 100)],
    ];
    this.funnel.innerHTML = stages
      .map(
        ([label, value, width], index) => `
          <div class="insight-funnel-row">
            <span>${label}</span>
            <div class="insight-funnel-track"><i style="width:${Math.min(100, width)}%"></i></div>
            <b>${Number(value).toLocaleString("id-ID")}</b>
            <em>${index === 0 ? "100%" : `${((Number(value) / data.leads) * 100).toFixed(0)}%`}</em>
          </div>
        `,
      )
      .join("");
    this.root.querySelector("[data-insight-funnel-rate]").textContent =
      `${data.conversion.toFixed(1).replace(".", ",")}% end-to-end`;
    this.root.querySelector("[data-insight-bottleneck]").textContent =
      insightDemoGoals[this.goal].bottleneck;
  }

  renderOpportunity(data, goal) {
    const current = data.baseConversion;
    const potential = current + goal.potentialUplift;
    this.root.querySelector("[data-insight-opportunity-title]").textContent =
      this.actionApplied ? "Rekomendasi berhasil disimulasikan" : goal.opportunityTitle;
    this.root.querySelector("[data-insight-opportunity-copy]").textContent =
      this.actionApplied
        ? "Prioritas tim telah diperbarui dalam simulasi. KPI proyeksi menunjukkan dampak jika tindakan yang sama diterapkan."
        : goal.opportunityCopy;
    this.root.querySelector("[data-insight-current-rate]").textContent =
      `${current.toFixed(1).replace(".", ",")}%`;
    this.root.querySelector("[data-insight-potential-rate]").textContent =
      `${potential.toFixed(1).replace(".", ",")}%`;
    this.runActionButton.classList.toggle("is-complete", this.actionApplied);
    this.runActionButton.disabled = this.actionApplied;
    this.runActionButton.innerHTML = this.actionApplied
      ? "<span>✓</span> Rekomendasi Diterapkan di Demo"
      : "<span>▶</span> Jalankan Rekomendasi Demo";
  }

  renderSources(data) {
    const maxVolume = Math.max(...data.sources.map((source) => source.volume), 1);
    const multiplier = this.periodMultiplier();
    const rows = data.sources
      .map((source) => {
        const warning = source.status === "Perlu optimasi";
        return `
          <div class="insight-source-row">
            <div class="insight-source-name"><span class="insight-source-icon ${source.id}">${source.icon}</span>${source.name}</div>
            <div class="insight-source-volume"><i style="--source-width:${(source.volume / maxVolume) * 100}%"></i>${Math.max(1, Math.round(source.volume * multiplier)).toLocaleString("id-ID")}</div>
            <span>${Math.max(1, Math.round(source.hot * multiplier))} HOT</span>
            <span>${source.response.toFixed(1).replace(".", ",")} mnt</span>
            <b class="insight-source-rate">${source.conversion.toFixed(1).replace(".", ",")}%</b>
            <span class="insight-source-status ${warning ? "warning" : ""}">${source.status}</span>
          </div>
        `;
      })
      .join("");
    this.sourceList.innerHTML = `
      <div class="insight-source-head"><span>Sumber</span><span>Volume Lead</span><span>Potensi</span><span>Respons</span><span>Konversi</span><span>Status</span></div>
      ${rows}
    `;
    this.root.querySelector("[data-insight-source-count]").textContent =
      `${data.sources.length} sumber aktif`;
  }

  renderHeatmap(goal) {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum"];
    const times = ["09:00", "10:00", "12:00", "14:00", "16:00"];
    const values = [
      [42, 56, 49, 38, 31],
      [58, 91, 86, 79, 45],
      [61, 94, 88, 83, 48],
      [55, 89, 92, 77, 51],
      [39, 62, 58, 47, 34],
    ];
    const cells = ['<span class="axis"></span>', ...days.map((day) => `<span class="axis">${day}</span>`)];
    times.forEach((time, row) => {
      cells.push(`<span class="axis">${time}</span>`);
      values[row].forEach((value) => cells.push(`<span class="cell" style="--heat:${value}%">${value}</span>`));
    });
    this.heatmap.innerHTML = cells.join("");
    this.root.querySelector("[data-insight-best-time]").textContent = goal.bestTime;
  }

  renderActions(data) {
    const actionSets = {
      conversion: [
        ["!", "critical", `Follow-up ${Math.max(8, data.followup)} lead Warm`, "Lewat 2 jam · potensi closing tinggi", "Sekarang"],
        ["↗", "positive", "Gunakan script Instagram terbaik", "Konversi 9,4% · unggul 1,7 poin", "+6 deal"],
        ["RT", "", "Percepat antrian Facebook", "Respons 3,8 menit · paling lambat", "Hari ini"],
      ],
      response: [
        ["RT", "critical", "Tambah kapasitas pukul 10–14", "Menangani 46% volume harian", "-1,8 mnt"],
        ["!", "", `${data.followup} follow-up menunggu`, "Urutkan berdasarkan SLA terdekat", "Sekarang"],
        ["↗", "positive", "Salin pola respons WhatsApp", "Respons tercepat 1,4 menit", "+12%"],
      ],
      hot: [
        ["!", "critical", `${Math.max(3, data.actionCount)} lead HOT melewati SLA`, "Handoff ke agent yang tersedia", "Mendesak"],
        ["HOT", "", "Prioritaskan intent test drive", "Peluang closing 2,3× lebih tinggi", "+7 deal"],
        ["✓", "positive", "Pertahankan routing Instagram", "Konversi HOT terbaik bulan ini", "9,4%"],
      ],
    };
    const actions = actionSets[this.goal];
    this.actionList.innerHTML = actions
      .map(
        ([icon, tone, title, copy, impact]) => `
          <div class="insight-action-item ${tone}"><span>${icon}</span><div><b>${title}</b><p>${copy}</p></div><em>${impact}</em></div>
        `,
      )
      .join("");
    this.root.querySelector("[data-insight-action-count]").textContent =
      `${actions.length} prioritas`;
  }

  renderWidgets() {
    for (const widget of this.root.querySelectorAll("[data-insight-widget]")) {
      widget.hidden = !this.visibleWidgets.has(widget.dataset.insightWidget);
    }
  }
}

const insightDemoMount = document.getElementById("insightDemo");
if (insightDemoMount) {
  new ConversionInsightDemo(insightDemoMount);
}

class AsciiIndonesiaBackground {
  constructor(container) {
    this.el = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.cellW = 10;
    this.cellH = 16;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.time = 0;
    this.mx = -9999;
    this.my = -9999;
    this.chars = " ..,,,---===+++***###@@@";
    this.bgChars = ".:-+|/\\01";
    this.islands = [
      [[2, 3], [5, 9], [8, 17], [11, 26], [14, 34], [18, 42], [22, 50], [26, 56], [29, 61], [31, 65], [29, 68], [26, 64], [22, 56], [18, 47], [14, 37], [10, 27], [6, 16], [3, 8]],
      [[32, 72], [37, 73], [44, 75], [51, 76], [57, 75], [61, 73], [59, 79], [53, 81], [46, 82], [39, 81], [33, 78]],
      [[33, 12], [40, 7], [49, 5], [57, 7], [63, 14], [67, 24], [69, 35], [68, 45], [64, 52], [57, 54], [49, 50], [43, 42], [38, 32], [35, 22]],
      [[58, 16], [60, 22], [62, 30], [64, 38], [63, 46], [61, 52], [59, 58], [57, 64], [61, 58], [65, 50], [67, 42], [67, 34], [65, 26], [61, 19]],
      [[79, 20], [85, 14], [91, 12], [97, 16], [100, 25], [100, 37], [97, 47], [93, 54], [87, 56], [81, 50], [78, 39], [77, 28]],
      [[61, 80], [65, 78], [67, 82], [63, 86]],
      [[67, 80], [71, 78], [73, 82], [69, 86]],
      [[73, 80], [79, 78], [85, 80], [79, 84]],
      [[85, 82], [91, 80], [96, 82], [91, 87]],
      [[89, 88], [95, 86], [100, 88], [96, 94]],
      [[28, 44], [32, 40], [34, 46], [30, 50]],
      [[35, 48], [39, 44], [41, 50], [37, 54]],
      [[70, 20], [72, 16], [74, 22], [74, 32], [72, 38], [70, 28]],
      [[74, 46], [78, 42], [82, 46], [78, 52]],
      [[70, 38], [74, 34], [76, 40], [72, 44]],
    ];

    this.el.appendChild(this.canvas);
    this.resize();
    this.bind();
    this.loop();
  }

  bind() {
    const move = (event) => {
      const point = event.touches ? event.touches[0] : event;
      const rect = this.canvas.getBoundingClientRect();
      this.mx = point.clientX - rect.left;
      this.my = point.clientY - rect.top;
    };
    const leave = () => {
      this.mx = -9999;
      this.my = -9999;
    };
    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("mousemove", move);
    this.canvas.addEventListener("touchmove", move, { passive: true });
    this.canvas.addEventListener("mouseleave", leave);
    this.canvas.addEventListener("touchend", leave);
  }

  resize() {
    const rect = this.el.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.cols = Math.floor(this.w / this.cellW);
    this.rows = Math.floor(this.h / this.cellH);
    this.buildMask();
  }

  buildMask() {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = this.cols;
    maskCanvas.height = this.rows;
    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.cols, this.rows);
    ctx.fillStyle = "#fff";
    for (const poly of this.islands) {
      ctx.beginPath();
      for (let i = 0; i < poly.length; i += 1) {
        const x = (poly[i][0] / 100) * this.cols;
        const y = (poly[i][1] / 100) * this.rows;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    const img = ctx.getImageData(0, 0, this.cols, this.rows);
    this.mask = new Float32Array(this.cols * this.rows);
    for (let i = 0; i < this.mask.length; i += 1) {
      this.mask[i] = img.data[i * 4] / 255;
    }
  }

  hash(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  noise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = this.hash(ix, iy);
    const b = this.hash(ix + 1, iy);
    const c = this.hash(ix, iy + 1);
    const d = this.hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  fbm(x, y) {
    return this.noise(x, y) * 0.6 + this.noise(x * 2.1, y * 2.1 + 3) * 0.25 + this.noise(x * 4.3 + 7, y * 4.3) * 0.15;
  }

  render() {
    const { ctx, w, h, cols, rows, cellW, cellH, dpr } = this;
    const offX = (w - cols * cellW) / 2;
    const offY = (h - rows * cellH) / 2;
    const spotR2 = 140 * 140;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${cellH - 3}px "SFMono-Regular", Consolas, "Liberation Mono", monospace`;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const px = offX + c * cellW + cellW / 2;
        const py = offY + r * cellH + cellH / 2;
        const m = this.mask[r * cols + c] || 0;
        const n = this.fbm(c * 0.12 + this.time * 0.25, r * 0.12 + this.time * 0.15);
        const routeLine = r % 7 === 0 || c % 19 === 0 || Math.abs(c * 0.62 + this.time * 7 - r) < 0.35;
        const dx = px - this.mx;
        const dy = py - this.my;
        const spot = Math.exp(-(dx * dx + dy * dy) / (2 * spotR2));
        const charSet = m > 0.01 ? this.chars : this.bgChars;
        const index = Math.min(charSet.length - 1, Math.max(0, Math.floor(n * (charSet.length - 1))));
        let alpha = 0.012 + n * 0.018;

        if (m > 0.5) alpha = 0.34 + n * 0.34 + spot * 0.32;
        else if (m > 0.01) alpha = 0.1 + n * 0.16 + spot * 0.18;
        else if (routeLine) alpha = 0.045 + n * 0.035 + spot * 0.08;

        if (alpha < 0.01) continue;

        if (m > 0.5) ctx.fillStyle = `rgba(8,17,31,${Math.min(0.8, alpha)})`;
        else if (m > 0.01) ctx.fillStyle = `rgba(18,103,245,${Math.min(0.36, alpha)})`;
        else {
          const redPulse = routeLine && (c + r + Math.floor(this.time * 12)) % 11 === 0;
          ctx.fillStyle = redPulse ? `rgba(255,77,85,${Math.min(0.18, alpha * 1.8)})` : `rgba(18,103,245,${Math.min(0.12, alpha)})`;
        }

        ctx.fillText(charSet[index], px, py);
      }
    }
  }

  loop() {
    this.time += 0.016;
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}

const asciiIndonesiaMount = document.getElementById("asciiIndonesiaBg");
if (asciiIndonesiaMount) {
  new AsciiIndonesiaBackground(asciiIndonesiaMount);
}
