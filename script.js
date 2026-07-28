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
