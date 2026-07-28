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
  },
];

class InventoryProductDemo {
  constructor(root) {
    this.root = root;
    this.units = inventoryDemoSeed.map((unit) => ({ ...unit }));
    this.status = "ALL";
    this.branch = "ALL";
    this.query = "";
    this.sort = "newest";
    this.selectedId = null;
    this.lastFocusedElement = null;
    this.hasOpenedGuide = false;

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

    this.bind();
    this.render();
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-inventory-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }

    for (const button of this.root.querySelectorAll("[data-close-inventory-demo]")) {
      button.addEventListener("click", () => this.close());
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

    this.root.querySelector("[data-demo-guide]").addEventListener("click", () => this.openGuide());
    this.root.querySelector("[data-close-demo-guide]").addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-demo-guide-start]").addEventListener("click", () => {
      this.closeGuide();
      this.searchInput.focus();
    });
    this.root.querySelector("[data-close-demo-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
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

  openGuide() {
    this.guide.hidden = false;
    this.guide.querySelector("[data-demo-guide-start]").focus();
  }

  closeGuide() {
    this.guide.hidden = true;
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
    this.units = inventoryDemoSeed.map((unit) => ({ ...unit }));
    this.selectedId = null;
    this.closeDetail();
    this.toast.hidden = true;
    this.clearFilters();
  }

  getVisibleUnits() {
    const visible = this.units.filter((unit) => {
      const matchesStatus = this.status === "ALL" || unit.status === this.status;
      const matchesBranch = this.branch === "ALL" || unit.branch === this.branch;
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
    this.resultCount.textContent = `${visibleUnits.length} dari ${this.units.length} unit ditampilkan`;
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
                <span class="demo-unit-thumb">${this.initials(unit.brand)}</span>
                <div>
                  <b>${unit.brand} ${unit.type}</b>
                  <span>${unit.color} · ${unit.year} · ${unit.photos} foto</span>
                </div>
              </div>
            </td>
            <td><span class="demo-plate">${unit.plate}</span></td>
            <td><div class="demo-cell-stack"><b>${this.formatCompactPrice(unit.buyingPrice)}</b><span>Modal awal</span></div></td>
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
  }

  closeDetail() {
    this.detailPanel.classList.remove("is-open");
    this.detailPanel.setAttribute("aria-hidden", "true");
    this.detailBackdrop.hidden = true;
  }

  bookSelectedUnit() {
    const unit = this.units.find((item) => item.id === this.selectedId);
    if (!unit || unit.status !== "UNIT READY") return;
    unit.status = "BOOKED";
    this.populateDetail(unit);
    this.render();
    this.toast.hidden = false;
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

const crmDemoSeed = [
  {
    id: "lead-nadia",
    name: "Nadia Demo",
    unit: "Mitsubishi Xpander Ultimate 2023",
    stage: "warm",
    score: 62,
    value: 320000000,
    days: 8,
    source: "whatsapp",
    handler: "AI Bot · Dimas",
    ai: true,
    summary:
      "Nadia menanyakan cicilan Xpander dan sudah menyebut kisaran uang muka. Respons terakhir positif, tetapi belum ada tindak lanjut selama 8 hari.",
    recommendation: "Kirim simulasi cicilan dan tawarkan jadwal test drive.",
    message:
      "Halo Kak Nadia, saya Dimas dari Motovax. Simulasi cicilan Xpander Ultimate yang Kakak tanyakan sudah siap. Apakah saya boleh kirimkan rinciannya sekaligus bantu jadwalkan test drive minggu ini?",
    events: [
      { icon: "WA", title: "Menanyakan simulasi cicilan", detail: "WhatsApp masuk", time: "8 hari lalu" },
      { icon: "AI", title: "AI mengidentifikasi minat tinggi", detail: "Intent: financing", time: "8 hari lalu" },
      { icon: "D", title: "Dialihkan ke Dimas", detail: "Sales consultant", time: "8 hari lalu" },
    ],
  },
  {
    id: "lead-bayu",
    name: "Bayu Prakoso",
    unit: "Toyota Raize GR Sport 2022",
    stage: "cold",
    score: 28,
    value: 236000000,
    days: 2,
    source: "instagram",
    handler: "AI Bot · Rani",
    ai: true,
    summary: "Bayu menyimpan konten unit dari Instagram dan baru menanyakan ketersediaan warna.",
    recommendation: "Kirim pilihan warna dan foto unit yang tersedia.",
    message:
      "Halo Kak Bayu, warna Toyota Raize yang Kakak tanyakan masih tersedia. Saya bisa kirim foto unit dan detail harganya di sini.",
    events: [
      { icon: "IG", title: "Membalas Instagram Story", detail: "Instagram DM", time: "2 hari lalu" },
      { icon: "AI", title: "AI menjawab ketersediaan", detail: "Respons otomatis", time: "2 hari lalu" },
    ],
  },
  {
    id: "lead-sinta",
    name: "Sinta Maharani",
    unit: "Honda BR-V Prestige 2021",
    stage: "cold",
    score: 34,
    value: 255000000,
    days: 5,
    source: "facebook",
    handler: "AI Bot",
    ai: true,
    summary: "Sinta mengisi formulir iklan dan tertarik menukar unit lama, tetapi belum memberi detail kendaraan.",
    recommendation: "Minta data singkat unit trade-in untuk estimasi awal.",
    message:
      "Halo Kak Sinta, terima kasih sudah tertarik dengan Honda BR-V. Boleh kirim tipe, tahun, dan foto unit lama Kakak agar tim kami bantu estimasi trade-in?",
    events: [
      { icon: "FB", title: "Lead dari Facebook Ads", detail: "Form iklan", time: "5 hari lalu" },
      { icon: "AI", title: "Lead berhasil dikualifikasi", detail: "Minat: trade-in", time: "5 hari lalu" },
    ],
  },
  {
    id: "lead-andi",
    name: "Andi Saputra",
    unit: "Toyota Rush G AT 2022",
    stage: "warm",
    score: 55,
    value: 190000000,
    days: 4,
    source: "excel_import",
    handler: "Ayu",
    ai: false,
    summary: "Andi berasal dari daftar pameran dan sudah menerima katalog harga.",
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
    unit: "Honda HR-V S CVT 2020",
    stage: "warm",
    score: 58,
    value: 248000000,
    days: 7,
    source: "whatsapp",
    handler: "AI Bot · Dimas",
    ai: true,
    summary: "Farhan meminta video kondisi interior dan membandingkan dua pilihan unit.",
    recommendation: "Kirim video walkaround dan tekankan hasil inspeksi.",
    message:
      "Halo Kak Farhan, video interior HR-V dan ringkasan inspeksinya sudah siap. Saya kirimkan sekarang agar Kakak bisa membandingkan kedua unitnya.",
    events: [
      { icon: "WA", title: "Meminta video unit", detail: "WhatsApp masuk", time: "7 hari lalu" },
      { icon: "AI", title: "Kebutuhan dicatat AI", detail: "Intent: unit comparison", time: "7 hari lalu" },
    ],
  },
  {
    id: "lead-rizky",
    name: "Rizky Ramadhan",
    unit: "Suzuki Ertiga GX Hybrid 2023",
    stage: "hot",
    score: 88,
    value: 243000000,
    days: 1,
    source: "whatsapp",
    handler: "Rani",
    ai: false,
    summary: "Rizky sudah menyetujui kisaran cicilan dan ingin melihat unit akhir pekan ini.",
    recommendation: "Kunci jadwal test drive dan siapkan unit.",
    message:
      "Halo Pak Rizky, kami siap jadwalkan test drive Ertiga Hybrid akhir pekan ini. Bapak lebih nyaman datang Sabtu atau Minggu?",
    events: [
      { icon: "WA", title: "Menyetujui kisaran cicilan", detail: "WhatsApp", time: "1 hari lalu" },
      { icon: "R", title: "Rani menawarkan test drive", detail: "Aktivitas sales", time: "1 hari lalu" },
    ],
  },
  {
    id: "lead-laras",
    name: "Laras Wulandari",
    unit: "Daihatsu Rocky 1.2 X CVT 2022",
    stage: "hot",
    score: 79,
    value: 189000000,
    days: 3,
    source: "instagram",
    handler: "AI Bot · Ayu",
    ai: true,
    summary: "Laras sudah mengirim KTP untuk pengecekan awal dan menunggu pilihan paket pembiayaan.",
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
    unit: "Toyota Avanza G CVT 2022",
    stage: "prospect",
    score: 91,
    value: 229000000,
    days: 1,
    source: "walk_in",
    handler: "Dimas",
    ai: false,
    summary: "Yoga sudah test drive, memilih unit, dan sedang melengkapi dokumen pemesanan.",
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
    unit: "Nissan Serena HWS AT 2023",
    stage: "prospect",
    score: 86,
    value: 350000000,
    days: 2,
    source: "excel_import",
    handler: "Ayu",
    ai: false,
    summary: "Maya telah menerima penawaran final dan meminta waktu untuk persetujuan keluarga.",
    recommendation: "Follow-up singkat dengan masa berlaku penawaran.",
    message:
      "Halo Ibu Maya, saya ingin mengingatkan bahwa penawaran Serena berlaku sampai Jumat. Jika ada bagian yang ingin didiskusikan bersama keluarga, saya siap membantu.",
    events: [
      { icon: "XL", title: "Lead pelanggan lama", detail: "Excel Import", time: "9 hari lalu" },
      { icon: "A", title: "Penawaran final dikirim", detail: "Ayu", time: "2 hari lalu" },
    ],
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
    this.source = "all";
    this.query = "";
    this.mobileStage = "cold";
    this.selectedId = null;
    this.lastFocusedElement = null;
    this.hasOpenedGuide = false;

    this.board = root.querySelector("[data-crm-board]");
    this.stageTabs = root.querySelector("[data-crm-stage-tabs]");
    this.searchInput = root.querySelector("[data-crm-search]");
    this.detailPanel = root.querySelector(".crm-detail-panel");
    this.detailBackdrop = root.querySelector("[data-crm-detail-backdrop]");
    this.guide = root.querySelector("[data-crm-guide-popover]");
    this.toast = root.querySelector("[data-crm-toast]");
    this.messagePreview = root.querySelector("[data-crm-message-preview]");
    this.prepareButton = root.querySelector("[data-crm-prepare-followup]");
    this.closedList = root.querySelector("[data-crm-closed-list]");

    this.bind();
    this.render();
  }

  cloneSeed() {
    return crmDemoSeed.map((lead) => ({
      ...lead,
      events: lead.events.map((event) => ({ ...event })),
    }));
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-crm-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }

    for (const button of this.root.querySelectorAll("[data-close-crm-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    for (const button of this.root.querySelectorAll("[data-crm-source]")) {
      button.addEventListener("click", () => {
        this.source = button.dataset.crmSource || "all";
        this.render();
      });
    }

    this.searchInput.addEventListener("input", () => {
      this.query = this.searchInput.value.trim().toLocaleLowerCase("id");
      this.render();
    });

    this.board.addEventListener("click", (event) => this.handleLeadActivation(event));
    this.board.addEventListener("keydown", (event) => this.handleLeadActivation(event));
    this.stageTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-crm-stage]");
      if (!button) return;
      this.mobileStage = button.dataset.crmStage;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-close-crm-detail]")) {
      button.addEventListener("click", () => this.closeDetail());
    }
    this.detailBackdrop.addEventListener("click", () => this.closeDetail());

    this.prepareButton.addEventListener("click", () => this.prepareFollowup());
    this.root.querySelector("[data-crm-send-followup]").addEventListener("click", () => this.sendFollowup());
    this.root.querySelector("[data-crm-reset]").addEventListener("click", () => this.reset());

    this.root.querySelector("[data-crm-guide]").addEventListener("click", () => this.openGuide());
    this.root.querySelector("[data-close-crm-guide]").addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-crm-guide-start]").addEventListener("click", () => {
      this.closeGuide();
      this.source = "all";
      this.query = "";
      this.searchInput.value = "";
      this.mobileStage = "warm";
      this.render();
      const featuredLead = this.root.querySelector('[data-lead-id="lead-nadia"]');
      if (featuredLead) featuredLead.focus();
    });
    this.root.querySelector("[data-close-crm-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.root.querySelector("[data-crm-toggle-closed]").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      this.closedList.hidden = isExpanded;
      this.root.querySelector("[data-crm-closed-chevron]").textContent = isExpanded ? "⌄" : "⌃";
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

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-crm-demo]").focus();
    if (!this.hasOpenedGuide) {
      this.openGuide();
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

  openGuide() {
    this.guide.hidden = false;
    this.guide.querySelector("[data-crm-guide-start]").focus();
  }

  closeGuide() {
    this.guide.hidden = true;
  }

  reset() {
    this.leads = this.cloneSeed();
    this.source = "all";
    this.query = "";
    this.mobileStage = "cold";
    this.selectedId = null;
    this.searchInput.value = "";
    this.closedList.hidden = true;
    const closedToggle = this.root.querySelector("[data-crm-toggle-closed]");
    closedToggle.setAttribute("aria-expanded", "false");
    this.root.querySelector("[data-crm-closed-chevron]").textContent = "⌄";
    this.closeDetail();
    this.toast.hidden = true;
    this.render();
  }

  getVisibleLeads() {
    return this.leads.filter((lead) => {
      const isOmnichannel = ["whatsapp", "instagram", "facebook"].includes(lead.source);
      const matchesSource =
        this.source === "all" ||
        (this.source === "omnichannel" && isOmnichannel) ||
        (this.source === "excel" && lead.source === "excel_import");
      const haystack = `${lead.name} ${lead.unit} ${lead.handler}`.toLocaleLowerCase("id");
      return matchesSource && haystack.includes(this.query);
    });
  }

  render() {
    const visibleLeads = this.getVisibleLeads();
    this.renderSummary();
    this.renderFilters();
    this.renderStageTabs(visibleLeads);
    this.renderBoard(visibleLeads);
  }

  renderSummary() {
    const pipeline = this.leads.reduce((total, lead) => total + lead.value, 0);
    const forecast = this.leads.reduce(
      (total, lead) => total + lead.value * crmStageConfig[lead.stage].probability,
      0,
    );
    this.root.querySelector("[data-crm-pipeline-value]").textContent = this.formatCompactPrice(pipeline);
    this.root.querySelector("[data-crm-forecast]").textContent = this.formatCompactPrice(forecast);
    this.root.querySelector("[data-crm-active-count]").textContent = String(this.leads.length);
    this.root.querySelector("[data-crm-followup-count]").textContent = String(
      this.leads.filter((lead) => lead.days >= 7).length,
    );
    this.root.querySelector("[data-crm-hot-count]").textContent = String(
      this.leads.filter((lead) => lead.stage === "hot").length,
    );
    this.root.querySelector("[data-crm-ai-count]").textContent = String(
      this.leads.filter((lead) => lead.ai).length,
    );
  }

  renderFilters() {
    for (const button of this.root.querySelectorAll("[data-crm-source]")) {
      button.classList.toggle("active", button.dataset.crmSource === this.source);
    }
  }

  renderStageTabs(leads) {
    this.stageTabs.innerHTML = Object.entries(crmStageConfig)
      .map(([stage, config]) => {
        const count = leads.filter((lead) => lead.stage === stage).length;
        return `<button class="${stage === this.mobileStage ? "active" : ""}" type="button" role="tab" aria-selected="${stage === this.mobileStage}" data-crm-stage="${stage}">${config.label} (${count})</button>`;
      })
      .join("");
  }

  renderBoard(leads) {
    this.board.innerHTML = Object.entries(crmStageConfig)
      .map(([stage, config]) => {
        const stageLeads = leads.filter((lead) => lead.stage === stage);
        const stageValue = stageLeads.reduce((total, lead) => total + lead.value, 0);
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
    const isFeatured = lead.id === "lead-nadia" && !lead.followedUp;
    return `
      <article class="crm-lead-card ${isFeatured ? "featured" : ""}" data-lead-id="${lead.id}" tabindex="0" aria-label="Buka detail ${lead.name}">
        ${isFeatured ? '<span class="crm-try-badge">Coba ini</span>' : ""}
        <div class="crm-lead-card-head">
          <h3>${lead.name}</h3>
          <span class="crm-score">${lead.score}/100</span>
        </div>
        <p class="crm-lead-unit">${lead.unit}</p>
        <div class="crm-lead-meta">
          <span class="crm-source-badge ${lead.source}">${this.sourceLabel(lead.source)}</span>
          <b>${this.formatCompactPrice(lead.value)}</b>
        </div>
        <div class="crm-lead-card-footer">
          <span class="crm-handler">${lead.handler}</span>
          <span class="crm-stale ${lead.days >= 7 ? "high" : ""}">${lead.days} hari di stage</span>
        </div>
      </article>
    `;
  }

  handleLeadActivation(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-lead-id]");
    if (!card) return;
    if (event.type === "keydown") event.preventDefault();
    this.openDetail(card.dataset.leadId);
  }

  openDetail(leadId) {
    const lead = this.leads.find((item) => item.id === leadId);
    if (!lead) return;
    this.selectedId = lead.id;
    this.closeGuide();
    this.populateDetail(lead);
    this.detailBackdrop.hidden = false;
    this.detailPanel.classList.add("is-open");
    this.detailPanel.setAttribute("aria-hidden", "false");
    this.detailPanel.querySelector("[data-close-crm-detail]").focus();
  }

  populateDetail(lead) {
    this.root.querySelector("[data-crm-detail-name]").textContent = lead.name;
    this.root.querySelector("[data-crm-detail-unit]").textContent = lead.unit;
    const stageBadge = this.root.querySelector("[data-crm-detail-stage]");
    stageBadge.className = `crm-stage-badge ${lead.stage}`;
    stageBadge.textContent = crmStageConfig[lead.stage].label;
    const sourceBadge = this.root.querySelector("[data-crm-detail-source]");
    sourceBadge.className = `crm-source-badge ${lead.source}`;
    sourceBadge.textContent = this.sourceLabel(lead.source);
    this.root.querySelector("[data-crm-detail-score]").textContent = `Skor ${lead.score}/100`;
    this.root.querySelector("[data-crm-detail-value]").textContent = this.formatCompactPrice(lead.value);
    this.root.querySelector("[data-crm-detail-days]").textContent = `${lead.days} hari`;
    this.root.querySelector("[data-crm-detail-handler]").textContent = lead.handler;
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
    this.prepareButton.textContent = lead.followedUp ? "Follow-up sudah disimulasikan" : "Siapkan follow-up AI";
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
    this.root.querySelector("[data-crm-send-followup]").focus();
  }

  sendFollowup() {
    const lead = this.leads.find((item) => item.id === this.selectedId);
    if (!lead || lead.followedUp) return;
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
      { icon: "✓", title: "Lead merespons positif (simulasi)", detail: "Stage dan skor diperbarui", time: "baru saja" },
      { icon: "AI", title: "Follow-up AI dikirim (simulasi)", detail: "Tidak ada pesan nyata", time: "baru saja" },
    );
    this.mobileStage = lead.stage;
    this.render();
    this.populateDetail(lead);
    this.toast.querySelector("b").textContent = `Lead naik menjadi ${crmStageConfig[lead.stage].label}`;
    this.toast.querySelector("p").textContent =
      `Skor ${lead.name} berubah ${oldScore} → ${lead.score} dan forecast diperbarui.`;
    this.toast.hidden = false;
  }

  sourceLabel(source) {
    if (source === "excel_import") return "Excel";
    if (source === "walk_in") return "Walk-in";
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

const omniDemoContacts = [
  {
    id: "omni-nadia",
    name: "Nadia Demo",
    channel: "whatsapp",
    preview: "Cari mobil keluarga budget 250 juta",
    time: "10:42",
    messages: [
      {
        role: "customer",
        content: "Saya cari mobil keluarga budget sekitar 250 juta. Ada rekomendasi?",
        time: "10:41",
      },
      {
        role: "assistant",
        content:
          "Ada dua pilihan dari stok demo: Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Lebih penting kabin luas atau efisiensi cicilan, Kak?",
        time: "10:42",
      },
    ],
  },
  {
    id: "omni-rizky",
    name: "Rizky Ramadhan",
    channel: "instagram",
    preview: "Mau test drive besok sore",
    time: "10:18",
    messages: [
      { role: "customer", content: "Unit Ertiga Hybrid masih ada? Saya mau test drive besok sore.", time: "10:17" },
      {
        role: "assistant",
        content:
          "Unit tersedia di data demo. Minat test drive saya tandai sebagai HOT dan saya siapkan konteksnya untuk Call Center. Besok sekitar pukul berapa, Kak?",
        time: "10:18",
      },
    ],
  },
  {
    id: "omni-sinta",
    name: "Sinta Maharani",
    channel: "messenger",
    preview: "Bisa trade-in mobil lama?",
    time: "09:56",
    messages: [
      { role: "customer", content: "Kalau beli BR-V bisa trade-in mobil lama?", time: "09:55" },
      {
        role: "assistant",
        content: "Bisa dibantu estimasi awal. Sebutkan merek, tipe, tahun, dan kondisi singkat mobilnya ya, Kak.",
        time: "09:56",
      },
    ],
  },
  {
    id: "omni-bayu",
    name: "Bayu Prakoso",
    channel: "whatsapp",
    preview: "Minta foto interior Raize",
    time: "09:34",
    messages: [
      { role: "customer", content: "Boleh lihat foto interior Raize yang ready?", time: "09:33" },
      {
        role: "assistant",
        content: "Boleh. Saya cek unit yang tepat dulu agar foto tidak tertukar. Ada preferensi warna, Kak?",
        time: "09:34",
      },
    ],
  },
  {
    id: "omni-laras",
    name: "Laras Wulandari",
    channel: "instagram",
    preview: "Tanya paket pembiayaan",
    time: "08:47",
    messages: [
      { role: "customer", content: "Ada paket pembiayaan untuk Rocky?", time: "08:46" },
      {
        role: "assistant",
        content: "Ada beberapa opsi. Agar tidak mengarang angka, saya perlu unit, target DP, dan tenor yang diinginkan.",
        time: "08:47",
      },
    ],
  },
  {
    id: "omni-farhan",
    name: "Farhan Rizki",
    channel: "messenger",
    preview: "Bandingkan HR-V dan Xpander",
    time: "Kemarin",
    messages: [
      { role: "customer", content: "Untuk keluarga lebih cocok HR-V atau Xpander?", time: "Kemarin" },
      {
        role: "assistant",
        content:
          "Saya bisa bantu membandingkan dari kebutuhan dan data unit. Berapa jumlah penumpang rutin dan lebih sering dipakai di kota atau perjalanan jauh?",
        time: "Kemarin",
      },
    ],
  },
  {
    id: "omni-maya",
    name: "Maya Lestari",
    channel: "whatsapp",
    preview: "Lokasi showroom terdekat",
    time: "Kemarin",
    messages: [
      { role: "customer", content: "Showroom terdekat dari Bintaro di mana?", time: "Kemarin" },
      {
        role: "assistant",
        content: "Saya cek lokasi resmi dealer untuk area Bintaro agar tidak memberi alamat yang keliru.",
        time: "Kemarin",
      },
    ],
  },
  {
    id: "omni-andi",
    name: "Andi Saputra",
    channel: "whatsapp",
    preview: "Mau booking Toyota Rush",
    time: "Senin",
    messages: [
      { role: "customer", content: "Saya sudah cocok dengan Rush, mau booking.", time: "Senin" },
      {
        role: "assistant",
        content: "Siap, minat booking saya tandai sebagai prioritas tinggi dan konteksnya disiapkan untuk tim sales.",
        time: "Senin",
      },
    ],
  },
];

class OmnichannelAIDemo {
  constructor(root) {
    this.root = root;
    this.contacts = this.cloneContacts();
    this.activeContactId = "omni-nadia";
    this.channel = "all";
    this.mobilePanel = "chat";
    this.lastFocusedElement = null;
    this.hasOpenedGuide = false;
    this.humanTakeover = false;

    this.contactList = root.querySelector("[data-omni-contact-list]");
    this.chatLog = root.querySelector("[data-omni-chat-log]");
    this.input = root.querySelector("[data-omni-input]");
    this.form = root.querySelector("[data-omni-form]");
    this.guide = root.querySelector("[data-omni-guide-popover]");
    this.toast = root.querySelector("[data-omni-toast]");
    this.takeoverButton = root.querySelector("[data-omni-human-takeover]");

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
    this.trace = { ...this.defaultTrace };

    this.bind();
    this.render();
  }

  cloneContacts() {
    return omniDemoContacts.map((contact) => ({
      ...contact,
      messages: contact.messages.map((message) => ({ ...message })),
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
    this.root.querySelector("[data-omni-guide]").addEventListener("click", () => this.openGuide());
    this.root.querySelector("[data-close-omni-guide]").addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-omni-guide-start]").addEventListener("click", () => {
      this.closeGuide();
      this.runPrompt("Saya cari mobil keluarga budget 250 juta");
    });
    this.root.querySelector("[data-close-omni-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    for (const button of this.root.querySelectorAll("[data-omni-channel]")) {
      button.addEventListener("click", () => {
        this.channel = button.dataset.omniChannel || "all";
        const activeStillVisible =
          this.channel === "all" || this.activeContact().channel === this.channel;
        if (!activeStillVisible) {
          const firstMatch = this.contacts.find((contact) => contact.channel === this.channel);
          if (firstMatch) this.activeContactId = firstMatch.id;
        }
        this.render();
      });
    }

    this.contactList.addEventListener("click", (event) => {
      const contact = event.target.closest("[data-omni-contact]");
      if (!contact) return;
      this.activeContactId = contact.dataset.omniContact;
      this.humanTakeover = false;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-omni-prompt]")) {
      button.addEventListener("click", () => this.runPrompt(button.dataset.omniPrompt || ""));
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = this.input.value.trim();
      if (!message) return;
      this.runPrompt(message);
    });

    this.takeoverButton.addEventListener("click", () => {
      this.humanTakeover = !this.humanTakeover;
      this.takeoverButton.classList.toggle("taken", this.humanTakeover);
      this.takeoverButton.textContent = this.humanTakeover ? "Diambil alih" : "Ambil alih";
      const contact = this.activeContact();
      contact.messages.push({
        role: "assistant",
        content: this.humanTakeover
          ? "Call Center mengambil alih percakapan (simulasi). Ringkasan kebutuhan dan riwayat lead tetap tersedia."
          : "Percakapan dikembalikan ke Jasmine AI (simulasi).",
        time: "baru saja",
      });
      this.renderChat();
    });

    for (const button of this.root.querySelectorAll("[data-omni-mobile-tab]")) {
      button.addEventListener("click", () => {
        this.mobilePanel = button.dataset.omniMobileTab || "chat";
        this.renderMobilePanel();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (!this.guide.hidden) {
        this.closeGuide();
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
    this.root.querySelector("[data-close-omni-demo]").focus();
    if (!this.hasOpenedGuide) {
      this.openGuide();
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

  openGuide() {
    this.guide.hidden = false;
    this.guide.querySelector("[data-omni-guide-start]").focus();
  }

  closeGuide() {
    this.guide.hidden = true;
  }

  reset() {
    this.contacts = this.cloneContacts();
    this.activeContactId = "omni-nadia";
    this.channel = "all";
    this.mobilePanel = "chat";
    this.trace = { ...this.defaultTrace };
    this.humanTakeover = false;
    this.takeoverButton.classList.remove("taken");
    this.takeoverButton.textContent = "Ambil alih";
    this.input.value = "";
    this.toast.hidden = true;
    this.render();
  }

  activeContact() {
    return this.contacts.find((contact) => contact.id === this.activeContactId) || this.contacts[0];
  }

  render() {
    this.renderChannelFilter();
    this.renderContacts();
    this.renderChat();
    this.renderTrace();
    this.renderMobilePanel();
  }

  renderChannelFilter() {
    for (const button of this.root.querySelectorAll("[data-omni-channel]")) {
      button.classList.toggle("active", button.dataset.omniChannel === this.channel);
    }
  }

  renderContacts() {
    const contacts = this.contacts.filter(
      (contact) => this.channel === "all" || contact.channel === this.channel,
    );
    if (!contacts.length) {
      this.contactList.innerHTML = '<div class="omni-contact-empty">Tidak ada percakapan pada channel ini.</div>';
      return;
    }
    this.contactList.innerHTML = contacts
      .map(
        (contact) => `
          <button class="omni-contact ${contact.id === this.activeContactId ? "active" : ""}" type="button" data-omni-contact="${contact.id}">
            <span class="omni-contact-avatar ${contact.channel}">${this.initials(contact.name)}</span>
            <span class="omni-contact-main">
              <span><i class="omni-channel-dot ${contact.channel}"></i><b>${contact.name}</b></span>
              <small>${contact.preview}</small>
            </span>
            <time>${contact.time}</time>
          </button>
        `,
      )
      .join("");
  }

  renderChat() {
    const contact = this.activeContact();
    const avatar = this.root.querySelector("[data-omni-active-avatar]");
    avatar.className = `omni-contact-avatar ${contact.channel}`;
    avatar.textContent = this.initials(contact.name);
    this.root.querySelector("[data-omni-active-name]").textContent = contact.name;
    this.root.querySelector("[data-omni-active-channel]").textContent = this.channelLabel(contact.channel);

    this.chatLog.replaceChildren();
    for (const message of contact.messages) {
      const row = document.createElement("div");
      row.className = `omni-message ${message.role}${message.blocked ? " blocked" : ""}`;
      const bubble = document.createElement("div");
      bubble.className = "omni-message-bubble";
      bubble.textContent = message.content;
      const meta = document.createElement("div");
      meta.className = "omni-message-meta";
      if (message.role === "assistant") {
        const badge = document.createElement("span");
        badge.className = message.blocked ? "omni-blocked-badge" : "omni-ai-badge";
        badge.textContent = message.blocked ? "GUARDRAIL" : "JASMINE AI";
        meta.appendChild(badge);
      }
      meta.append(document.createTextNode(message.time));
      row.append(bubble, meta);
      this.chatLog.appendChild(row);
    }
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
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
    status.textContent = this.trace.blocked ? "BLOCKED · PASS" : "PASS";

    const assertions = this.root.querySelector("[data-omni-assertions]");
    assertions.replaceChildren();
    for (const assertion of this.trace.assertions) {
      const item = document.createElement("li");
      item.className = this.trace.blocked ? "blocked" : "pass";
      const icon = document.createElement("span");
      icon.textContent = "✓";
      item.append(icon, document.createTextNode(assertion));
      assertions.appendChild(item);
    }
  }

  renderMobilePanel() {
    for (const button of this.root.querySelectorAll("[data-omni-mobile-tab]")) {
      const active = button.dataset.omniMobileTab === this.mobilePanel;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    }
    for (const panel of this.root.querySelectorAll("[data-omni-mobile-panel]")) {
      panel.classList.toggle("is-mobile-active", panel.dataset.omniMobilePanel === this.mobilePanel);
    }
  }

  runPrompt(message) {
    const text = message.trim().slice(0, 500);
    if (!text) return;
    this.closeGuide();
    this.toast.hidden = true;
    this.input.value = "";

    const contact = this.activeContact();
    contact.messages.push({ role: "customer", content: text, time: "baru saja" });
    const result = this.evaluateMessage(text);
    contact.messages.push({
      role: "assistant",
      content: result.response,
      time: "baru saja",
      blocked: result.trace.blocked,
    });
    contact.preview = result.trace.blocked ? "Ancaman diblokir oleh guardrail" : text;
    contact.time = "baru";
    this.trace = result.trace;
    this.render();

    if (result.trace.blocked) {
      this.toast.hidden = false;
    }
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
          "Minat kunjungan terdeteksi sebagai HOT. Saya tidak mengirim apa pun dari demo ini, tetapi konteks lead sudah disiapkan: unit minat, waktu kunjungan, dan alasan handoff. Besok sekitar pukul berapa, Kak?",
        trace: {
          domain: "handoff",
          risk: "medium",
          effect: "simulated_write",
          router: "Sinyal buying intent tinggi diarahkan ke handoff.",
          tool: "lead.handoff · simulasi saja",
          grounding: "Konteks handoff disusun dari pesan, tanpa mengarang data.",
          evalTitle: "HOT lead & contextual handoff",
          blocked: false,
          assertions: [
            "Lead diklasifikasi HOT",
            "Konteks handoff lengkap",
            "External send = 0",
            "Tidak ada data nyata berubah",
          ],
        },
      };
    }

    if (/(dp|cicilan|tenor|kredit|angsuran|leasing|pembiayaan)/.test(normalized)) {
      return {
        response:
          "Saya tidak akan mengarang angka pembiayaan. Sebutkan unit, target DP, dan tenor yang diinginkan; sistem kemudian memakai kalkulator resmi atau menyerahkannya ke sales untuk penawaran final.",
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
            "Penawaran final diarahkan ke sales",
          ],
        },
      };
    }

    if (/(foto|gambar|video|interior|eksterior)/.test(normalized)) {
      return {
        response:
          "Saya cek unit yang tepat lebih dulu agar media tidak tertukar. Di demo ini tidak ada file yang dikirim. Sebutkan model atau plat unit fiktif yang ingin dilihat.",
        trace: {
          domain: "photo",
          risk: "low",
          effect: "read_only",
          router: "Permintaan media masuk domain photo.",
          tool: "inventory.search · read_only",
          grounding: "Unit diverifikasi sebelum media dipilih.",
          evalTitle: "Safe media selection",
          blocked: false,
          assertions: [
            "Domain photo sesuai",
            "Unit diverifikasi dahulu",
            "External send = 0",
            "Tidak ada media nyata dikirim",
          ],
        },
      };
    }

    if (/(caption|konten|promo|posting|iklan)/.test(normalized)) {
      return {
        response:
          "Saya bisa menyiapkan draft konten dari data unit yang terverifikasi. Pada demo ini hasil hanya berupa preview dan tidak dipublikasikan ke channel mana pun.",
        trace: {
          domain: "content",
          risk: "low",
          effect: "read_only",
          router: "Permintaan materi promosi masuk domain content.",
          tool: "content.caption · preview",
          grounding: "Draft memakai atribut unit yang sudah diverifikasi.",
          evalTitle: "Content preview safety",
          blocked: false,
          assertions: [
            "Domain content sesuai",
            "Unit source terverifikasi",
            "Publish tidak dipanggil",
            "External send = 0",
          ],
        },
      };
    }

    if (/(mobil|unit|stok|harga|budget|keluarga|xpander|br-v|brv|rush|raize|ertiga|rocky)/.test(normalized)) {
      return {
        response:
          "Dari stok fiktif demo, ada Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Agar rekomendasinya tepat, lebih penting kabin luas, konsumsi bahan bakar, atau cicilan ringan, Kak?",
        trace: {
          ...this.defaultTrace,
          assertions: [...this.defaultTrace.assertions],
        },
      };
    }

    return {
      response:
        "Saya siap membantu dari satu inbox untuk WhatsApp, Instagram, dan Facebook. Ceritakan kebutuhan kendaraan, budget, atau rencana waktunya agar saya bisa menentukan langkah berikutnya.",
      trace: {
        domain: "general",
        risk: "low",
        effect: "none",
        router: "Belum ada domain operasional yang cukup spesifik.",
        tool: "none · menunggu konteks",
        grounding: "AI meminta klarifikasi daripada menebak.",
        evalTitle: "Clarify before acting",
        blocked: false,
        assertions: [
          "Tidak menebak intent",
          "Tidak memanggil tool prematur",
          "Pertanyaan lanjutan relevan",
          "Tidak ada side effect",
        ],
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
        value: `${Math.round(1248 * multiplier).toLocaleString("id-ID")} lead`,
        change: "12,4%",
        context: "prospek bertumbuh",
      },
      {
        label: "Tingkat Konversi",
        icon: "%",
        value: `${(7.7 + (this.branch === "pondok-bambu" ? 0.7 : 0)).toFixed(1).replace(".", ",")}%`,
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
    specs: "Hybrid · Automatic",
    price: "Rp468 juta",
    offer: "TDP mulai Rp48 juta",
    color: "#f8fafc",
    caption:
      "Naik kelas bersama Toyota Innova Zenix Hybrid 2023. Kabin premium, hemat bahan bakar, dan siap menemani setiap perjalanan keluarga. TDP mulai Rp48 juta. #ZENIXHYBRID #MobixAutos",
  },
  {
    id: "brv",
    name: "Honda BR-V Prestige",
    shortName: "BR-V Prestige",
    year: "2021",
    specs: "CVT · 7 Seater",
    price: "Rp255 juta",
    offer: "Cicilan mulai Rp5,8 juta",
    color: "#94a3b8",
    caption:
      "Waktunya membawa keluarga menjelajah lebih jauh bersama Honda BR-V Prestige CVT. Nyaman, lega, dan siap pakai. Cicilan mulai Rp5,8 juta. #BRVFAMILY #MobixAutos",
  },
  {
    id: "xpander",
    name: "Mitsubishi Xpander",
    shortName: "Xpander Ultimate",
    year: "2021",
    specs: "Ultimate · Automatic",
    price: "Rp239 juta",
    offer: "Bonus servis berkala",
    color: "#f1f5f9",
    caption:
      "Mitsubishi Xpander Ultimate—partner andal untuk aktivitas dan liburan keluarga. Unit ready dengan bonus servis berkala. Jadwalkan test drive hari ini. #XPANDERWEEKEND #MobixAutos",
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

    this.vehicleOptions = root.querySelector("[data-social-vehicle-options]");
    this.captionInput = root.querySelector("[data-social-caption]");
    this.headlineInput = root.querySelector("[data-social-headline]");
    this.offerInput = root.querySelector("[data-social-offer]");
    this.dateInput = root.querySelector("[data-social-date]");
    this.timeInput = root.querySelector("[data-social-time]");
    this.toast = root.querySelector("[data-social-toast]");
    this.campaignSelect = root.querySelector("[data-social-campaign]");

    this.bind();
    this.reset();
  }

  defaultPosts() {
    return [
      { date: "2026-07-08", title: "BR-V Family Deal", platform: "instagram", status: "published" },
      { date: "2026-07-16", title: "Xpander Weekend", platform: "facebook", status: "published" },
      { date: "2026-07-24", title: "Tips Trade In", platform: "instagram", status: "draft" },
      { date: "2026-07-29", title: "Zenix Hybrid", platform: "instagram", status: "planned" },
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
      const variants = [
        vehicle.caption,
        `${vehicle.name} ${vehicle.year} siap menemani cerita baru Anda. ${this.offerInput.value}. Unit terpilih, inspeksi transparan, dan bisa test drive. ${this.hashtagForVehicle()} #MobixAutos`,
        `Cari ${vehicle.shortName} dengan kondisi siap pakai? Temukan penawaran spesial ${this.offerInput.value.toLowerCase()} dan konsultasikan kebutuhan Anda hari ini. ${this.hashtagForVehicle()} #MobilBekasBerkualitas`,
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
      else this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-social-demo]").focus();
  }

  close() {
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
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
    this.root.querySelector(".social-progress span:last-child").classList.remove("active");
    this.renderAll();
    this.switchView("studio");
  }

  vehicle() {
    return socialDemoVehicles.find((vehicle) => vehicle.id === this.vehicleId) || socialDemoVehicles[0];
  }

  hashtagForVehicle() {
    if (this.vehicleId === "brv") return "#BRVFAMILY";
    if (this.vehicleId === "xpander") return "#XPANDERWEEKEND";
    return "#ZENIXHYBRID";
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

  renderVehicles() {
    this.vehicleOptions.innerHTML = socialDemoVehicles
      .map(
        (vehicle) => `
          <button class="social-vehicle-card ${vehicle.id === this.vehicleId ? "active" : ""}" type="button" data-social-vehicle="${vehicle.id}">
            <span class="social-vehicle-thumb" style="--car-color:${vehicle.color}"></span>
            <span><b>${vehicle.shortName}</b><small>${vehicle.year} · ${vehicle.price}</small></span>
            <em>✓</em>
          </button>
        `,
      )
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
    creative.className = `social-creative-frame ${this.format}`;
    this.root.querySelector("[data-social-preview-format]").textContent = formatLabels[this.format];
    this.root.querySelector("[data-social-creative-title]").textContent = vehicle.name;
    this.root.querySelector("[data-social-creative-year]").textContent = `${vehicle.year} · ${vehicle.specs}`;
    this.root.querySelector("[data-social-car-art]").style.setProperty("--preview-car", vehicle.color);
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

  schedule() {
    const date = this.dateInput.value;
    const time = this.timeInput.value;
    if (!date || !time) return;
    const selectedPlatforms = [...this.platforms];
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
      `${this.vehicle().shortName} · ${this.formatDate(date)} pukul ${time} WIB.`;
    this.root.querySelector(".social-progress span:last-child").classList.add("active");
    this.toast.hidden = false;
    this.switchView("calendar");
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

    const ranking = [
      ["Toyota Innova Zenix", "498 klik · 42 lead", "8,4%"],
      ["Honda BR-V Prestige", "382 klik · 29 lead", "7,6%"],
      ["Mitsubishi Xpander", "274 klik · 18 lead", "6,6%"],
    ];
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
if (socialDemoMount) {
  new SocialGrowthDemo(socialDemoMount);
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
