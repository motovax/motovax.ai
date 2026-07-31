# Plan Demo Solusi One Dashboard

**Repo target:** `motovax.ai` (landing static + product demos)  
**Produk:** One Dashboard (Executive Command Center)  
**Tanggal plan:** 2026-07-31  
**Status:** diimplementasikan (2026-07-31) — onboarding + multi-vertical + highlight custom live di `#dashboardDemo`

---

## 0. Latar belakang (poin human task)

| # | Poin human | Temuan di demo sekarang | Tindakan |
|---|------------|-------------------------|----------|
| 1 | **Tambahkan flow deskripsi bisnis calon customer / pilihan bisnis di awal** | Demo langsung buka dashboard otomotif Motovax; customizer peran (Direktur / SM / BM) muncul first-open, **tanpa** langkah “bisnis apa?” | Tambah **Business Onboarding Wizard** di awal (pilih industri + deskripsi singkat) sebelum masuk dashboard |
| 2 | **Properti auto-generate dari bisnis yang dipilih; highlight bisa custom; otomotif = samakan persis dashboard kita** | Semua label/KPI/seed hard-code otomotif (`unit` closing, cabang dealer, deal Rp23,6 jt, pipeline lead mobil) — tidak multi-vertical | Seed per vertical → **auto map** KPI/widget/label/cabang/agent/alert; panel **Highlight custom**; vertical `automotive` = **snapshot 1:1** demo existing |

> Catatan human: *“jika dilihat demo sekarang sudah bagus jadi tambahkan plan di atas”*  
> → **Jangan regresi** alur role · widget toggle · branch · period · chart · funnel yang sudah ada. Otomotif = baseline gold.

---

## 1. Tujuan demo

Menyajikan demo interaktif **One Dashboard** di landing `motovax.ai` yang:

1. Membuka dengan **flow bisnis calon customer** (pilih industri + deskripsi opsional) agar pitch multi-vertical terasa personal.
2. **Auto-generate** label, KPI, unit metrik, cabang, pipeline stage, agent, dan alert dari vertical yang dipilih.
3. Memungkinkan **highlight custom** (kartu insight / banner prioritas) yang bisa diedit presenter/prospect di demo.
4. Jika vertical **Otomotif / Dealer**, tampilan **persis** dashboard Motovax yang sudah live di `#dashboardDemo` (role, widget, angka, cabang Pondok Bambu/Cinere/Cibubur).
5. Tetap **static-first**, aman publik (mock / tenant demo), Bahasa Indonesia.

---

## 2. Narasi pitch (1 kalimat)

> “Ceritakan bisnis Anda sekali—dashboard, KPI, dan highlight langsung menyesuaikan industri; untuk dealer otomotif, persis Command Center Motovax yang dipakai operasional harian.”

---

## 3. Baseline yang **tidak diubah** (otomotif gold)

Demo existing (`OneDashboardDemo` + markup `#dashboardDemo`) sudah bagus. Saat vertical = **automotive**, output harus identik:

| Area | Baseline (jangan diubah semantik) |
|------|-----------------------------------|
| Role presets | Direktur · Sales Manager · Kepala Cabang + widget set masing-masing |
| Filter | Cabang (Semua / Pondok Bambu / Cinere / Cibubur) · MTD / QTD / YTD |
| Widget | KPI · Tren+Forecast · Pipeline · Performa Cabang · Top Agent · Insight & Peringatan |
| Customizer | Toggle widget live + Simpan layout + toast |
| Data seed | `dashboardDemoData` (branches, agents, chart) + KPI `Rp1,84 M`, 1.248 lead, conversion, dll. |
| First-open | Customizer peran (boleh digeser **setelah** onboarding bisnis) |
| Live metrics | Optional `publicDemoData.snapshot()` untuk pipeline (hanya relevan otomotif) |

**Acceptance otomotif:** side-by-side dengan main **sebelum** fitur baru → pixel/semantik sama (label “unit”, “lead”, cabang dealer, angka sama).

---

## 4. Gap analysis (sekarang vs target)

| Area | Sekarang | Target |
|------|----------|--------|
| Entry | Klik “Coba Demo Gratis” → langsung workspace dashboard | Klik → **step onboarding bisnis** → baru workspace |
| Vertical | Hard-code 1 industri (otomotif) | Catalog vertical + custom text deskripsi |
| Properti/metrik | Fixed di `render()` | `verticalPresets[id].properties` → generate KPI labels, funnel stages, table headers, agent metric, currency unit |
| Highlight | 3 alert fixed di `render()` | Default dari preset + **bisa diedit** (judul/copy/tipe) di customizer atau panel “Atur Highlight” |
| Reset | Role/period/branch/widget | + vertical & highlight kembali ke default preset |
| Branding topbar | “One Dashboard · Executive Command Center” | Boleh tambah badge industri aktif (mis. `Otomotif` / `Properti` / `F&B`) |

---

## 5. Scope fitur demo (acceptance)

| # | Requirement | Acceptance di demo |
|---|-------------|-------------------|
| 1 | Flow bisnis di awal | Overlay/step **Pilih bisnis** muncul **sebelum** workspace (kecuali user sudah pilih di session & belum reset) |
| 2 | Pilihan bisnis | ≥ 5 preset industri + opsi **Lainnya** (teks bebas deskripsi) |
| 3 | Deskripsi bisnis | Textarea opsional (max ~280 char); dipakai untuk menyetel subtitle banner / toast personalisasi |
| 4 | Auto-generate properti | Setelah pilih → KPI label, funnel stage, header tabel lokasi, label closing, alert default **berganti** sesuai preset |
| 5 | Otomotif = baseline | Preset `automotive` memakai data & copy **identik** demo sekarang (tidak rewrite angka) |
| 6 | Highlight custom | User bisa edit ≥ 3 highlight (judul + body + tipe warning/positive/info); simpan memicu toast; Reset mengembalikan default preset |
| 7 | Role & widget tetap | Customizer peran + toggle widget **tetap** bekerja di semua vertical |
| 8 | Filter cabang/periode | Periode selalu ada; “Cabang/Outlet/Proyek” label menyesuaikan vertical |
| 9 | Keamanan | Tidak hit API industri eksternal; badge tenant demo tetap |
| 10 | Bahasa | Seluruh UI wizard + toast + highlight **Bahasa Indonesia** |

---

## 6. Flow UX (alur demo)

```
[Landing kartu One Dashboard]
        │  data-open-dashboard-demo
        ▼
┌─────────────────────────────────────┐
│  STEP 0 · Business Onboarding       │
│  1) Pilih industri (kartu grid)     │
│  2) Deskripsi singkat (opsional)    │
│  3) CTA “Generate Dashboard →”      │
│     · Skip? → default Otomotif      │
└─────────────────────────────────────┘
        │  applyVertical(preset)
        ▼
┌─────────────────────────────────────┐
│  STEP 1 · One Dashboard workspace   │
│  (baseline UI + badge industri)     │
│  · first-open: customizer peran     │
│    (seperti sekarang)               │
└─────────────────────────────────────┘
        │  opsional
        ▼
┌─────────────────────────────────────┐
│  Highlight custom (di customizer    │
│  fieldset baru ATAU panel inline)   │
└─────────────────────────────────────┘
```

### 6.1 Aturan skip & reset

| Aksi | Perilaku |
|------|----------|
| Buka pertama kali di session | Selalu tampilkan onboarding |
| “Lewati — pakai contoh Otomotif” | Langsung `automotive` gold + buka customizer role (seperti now) |
| “Ganti bisnis” (tombol di topbar / banner) | Kembali ke Step 0 tanpa menutup overlay demo |
| Reset demo | Clear vertical choice → onboarding lagi + reset role/widget/period/highlight |
| Escape | Tutup onboarding dulu jika terbuka; else customizer; else demo (prioritas sama pola demo lain) |

---

## 7. Catalog vertical & auto-generate properti

### 7.1 Preset industri (minimal v1)

| ID | Label UI | Entity “unit” | Label lokasi | Metrik closing | Contoh KPI highlight |
|----|----------|---------------|--------------|----------------|----------------------|
| `automotive` | Otomotif / Dealer | unit mobil | Cabang | Closing unit | Pipeline lead, deal size Rp23,6 jt — **= baseline** |
| `property` | Properti / Real Estate | unit properti | Proyek / Site | Closing unit | Listing aktif, booking rate, avg ticket |
| `fnb` | F&B / Restoran | pesanan | Outlet | Transaksi | Ticket size, peak hour, repeat rate |
| `retail` | Retail / Toko | SKU / order | Toko | Order closing | Sell-through, basket size |
| `healthcare` | Klinik / Healthcare | pasien | Cabang klinik | Booking / visit | No-show rate, response booking |
| `education` | Edukasi / Kursus | pendaftar | Kampus / Cabang | Enrollment | Lead→trial→bayar |
| `custom` | Lainnya | “transaksi” generik | Lokasi | Closing | KPI generik + copy dari deskripsi user |

### 7.2 Shape preset (data model)

```js
// usulan di script.js
const dashboardVerticalPresets = {
  automotive: {
    id: "automotive",
    label: "Otomotif / Dealer",
    badge: "Otomotif",
    // properti yang di-generate ke UI
    properties: {
      entitySingular: "unit",
      entityPlural: "unit",
      locationLabel: "Cabang",
      locationAll: "Semua Cabang",
      pipelineTotalSuffix: "lead",
      dealLabel: "Rata-rata Deal",
      closingSpeedLabel: "Kecepatan Closing",
      agentMetric: "closing",
      tableHeaders: ["Cabang", "Revenue", "Closing", "Konversi", "Target"],
      funnelStages: [
        ["Lead Baru", 1248, 100],
        ["Terhubung", 864, 69],
        ["Prospek", 512, 41],
        ["Hot", 226, 18],
        ["Deal", 96, 8],
      ],
    },
    // seed angka — automotive WAJIB = dashboardDemoData existing
    data: null, // null = pakai dashboardDemoData (single source of truth)
    roles: null, // null = dashboardDemoRoles
    highlights: null, // null = generateAlerts() baseline existing
    kpis: null, // null = KPI baseline existing di render()
  },
  property: {
    id: "property",
    label: "Properti / Real Estate",
    badge: "Properti",
    properties: {
      entitySingular: "unit",
      entityPlural: "unit",
      locationLabel: "Proyek",
      locationAll: "Semua Proyek",
      pipelineTotalSuffix: "prospek",
      dealLabel: "Rata-rata Nilai Booking",
      closingSpeedLabel: "Siklus Closing",
      agentMetric: "booking",
      tableHeaders: ["Proyek", "Revenue", "Booking", "Konversi", "Target"],
      funnelStages: [
        ["Inquiry", 980, 100],
        ["Site Visit", 420, 43],
        ["Negosiasi", 210, 21],
        ["Booking", 96, 10],
        ["Akad / SP3K", 54, 5.5],
      ],
    },
    data: {
      branches: [
        { id: "bsd", name: "BSD City", revenue: 920, closing: 18, conversion: 5.4, target: 88 },
        { id: "cibubur", name: "Cibubur", revenue: 640, closing: 14, conversion: 4.9, target: 79 },
        { id: "bekasi", name: "Bekasi Timur", revenue: 410, closing: 9, conversion: 4.1, target: 71 },
      ],
      agents: [
        { name: "Sari Wulandari", branch: "BSD City", closing: 8, revenue: 410 },
        { name: "Doni Prasetyo", branch: "Cibubur", closing: 6, revenue: 298 },
        { name: "Mega Anggraini", branch: "Bekasi Timur", closing: 5, revenue: 242 },
        { name: "Raka Firmansyah", branch: "BSD City", closing: 4, revenue: 196 },
      ],
      chart: [/* skala mirip automotive, label bulan sama */],
    },
    highlights: [
      { type: "warning", icon: "!", title: "12 inquiry hot tanpa site visit", copy: "BSD City · potensi booking Rp2,4 M menunggu follow-up." },
      { type: "positive", icon: "↑", title: "Booking rate naik 14%", copy: "Kanal Instagram Ads mengungguli referral minggu ini." },
      { type: "info", icon: "i", title: "Forecast 102% target Q", copy: "Prioritaskan SP3K yang jatuh tempo 7 hari ke depan." },
    ],
    kpis: {
      revenueBase: 1970, // juta → formatRupiahCompact
      pipelineBase: 980,
      conversionBase: 5.5,
      avgDeal: "Rp412 jt",
      closingSpeed: "18 hari",
    },
  },
  // fnb, retail, healthcare, education, custom … pola sama
};
```

### 7.3 Aturan generate

1. **`automotive`** tidak menduplikasi seed — `data/roles/highlights/kpis = null` → fallback ke konstanta existing (`dashboardDemoData`, `dashboardDemoRoles`, logic `render()` saat ini).  
2. Vertical lain **wajib** lengkap `properties` + `data` + `highlights` + `kpis` agar render tidak jatuh ke string otomotif.  
3. **Custom (`Lainnya`)**:  
   - Base template = generik “Sales & Growth”  
   - Jika user isi deskripsi → inject ke banner: *“Dashboard disesuaikan untuk: {deskripsi}”*  
   - Highlight default generik; user diarahkan mengedit highlight custom.  
4. **Deskripsi bisnis** (textarea) disimpan di `this.businessDescription` dan muncul di:  
   - subtitle banner personalisasi  
   - toast simpan layout  
   - (opsional) baris kecil di topbar  

### 7.4 Mapping properti → UI (tabel implementasi)

| Properti preset | Target DOM / logic |
|-----------------|--------------------|
| `locationLabel` | Label di `.dashboard-branch-select span` + legend filter |
| `locationAll` + `data.branches` | `<select data-dashboard-branch>` options di-render ulang |
| `tableHeaders` | `<thead>` performa cabang/proyek/outlet |
| `funnelStages` | `data-dashboard-funnel` rows |
| `pipelineTotalSuffix` | teks `data-dashboard-pipeline-total` |
| `entityPlural` | “31 unit” / “18 booking” di kolom closing |
| `dealLabel` / `closingSpeedLabel` | label KPI card #4–5 |
| `kpis.*` | nilai KPI + revenue total |
| `highlights` | list `data-dashboard-alert-list` (editable) |
| `badge` | chip industri di topbar |
| `roles` | opsional rename role label per industri (v1: **tetap** Direktur/SM/BM untuk konsistensi pitch) |

---

## 8. Highlight custom

### 8.1 UX

Tambah fieldset di customizer (setelah widget):

```
fieldset “Highlight prioritas”
  untuk tiap highlight [1..3]:
    - select tipe: warning | positive | info
    - input judul
    - textarea copy singkat
  tombol “Kembalikan default industri”
```

Alternatif ringkas (jika customizer penuh): tombol **“Edit highlight”** di header panel Insight membuka mini-form.

### 8.2 Behavior

| Event | Behavior |
|-------|----------|
| Ganti vertical | Highlight di-reset ke default preset |
| Edit manual | Set `this.highlightsOverride = [...]`; `renderAlerts()` pakai override |
| Simpan layout | Toast: “Highlight & layout {role} untuk {badge} disimpan” |
| Reset demo | Override hilang |
| Otomotif default | 3 alert existing (HOT lead, konversi WA, forecast 108%) |

### 8.3 Batasan demo

- Max 3 highlight (cukup untuk pitch 5 menit)  
- Tidak persist ke server (session memory only)  
- Sanitasi text via `textContent` (hindari HTML injection di innerHTML)

---

## 9. UI onboarding (markup usulan)

Layer di dalam `#dashboardDemo` (z-index di atas workspace, di bawah toast):

```
div.dashboard-onboarding[data-dashboard-onboarding]
  header: “Sesuaikan demo dengan bisnis Anda”
  p: “Pilih industri — properti KPI dan highlight akan digenerate otomatis.”
  grid kartu vertical (icon + label + 1 baris contoh KPI)
  textarea[data-dashboard-business-desc] placeholder
    “Contoh: Dealer mobil bekas 3 cabang di Jabodetabek…”
  footer:
    button secondary “Lewati — contoh Otomotif”
    button primary “Generate Dashboard →”
```

Style: reuse token demo (radius, border, biru Motovax) di `styles.css` section One Dashboard (~baris 6221+).

---

## 10. Perubahan class `OneDashboardDemo` (outline)

```
state baru:
  verticalId = null | string
  businessDescription = ""
  highlightsOverride = null | Alert[]
  onboardingEl, …

method baru:
  open()
    → jika !verticalId: showOnboarding(); else showWorkspace()
  showOnboarding() / hideOnboarding()
  applyVertical(id, description?)
    → set properties, rebuild branch <select>, reset highlightsOverride, render()
  getPreset()
  getData() / getRoles() / getHighlights() / getKpis()
    → automotive fallback ke existing constants
  renderBranchSelect()
  renderAlerts()  // dari getHighlights() atau override
  openHighlightEditor() // optional
  reset()
    → verticalId=null + showOnboarding + clear override + role defaults
```

**Jangan** memecah `render()` jadi terlalu banyak file — tetap 1 class, extract helper pure function di atas class jika perlu.

---

## 11. File yang disentuh

| File | Perubahan |
|------|-----------|
| `index.html` | Markup onboarding; badge industri; fieldset highlight di customizer; opsi label lokasi dinamis (boleh kosong, diisi JS) |
| `script.js` | `dashboardVerticalPresets`; state/method `OneDashboardDemo`; pastikan `automotive` = fallback existing |
| `styles.css` | Onboarding grid, badge industri, form highlight, state hidden workspace saat onboarding |
| `docs/plans/demo-one-dashboard.md` | Dokumen plan ini (sumber kebenaran) |

Tidak menyentuh demo IMS / CRM / Social / Insight kecuali regresi visual global (class body `.demo-open`).

---

## 12. Batch implementasi (urutan PR / commit)

| Batch | Isi | Ukuran |
|-------|-----|--------|
| **A. Data model** | `dashboardVerticalPresets` + getter fallback automotive | S |
| **B. Onboarding UI** | Markup + show/hide + applyVertical + skip | M |
| **C. Render dinamis** | Branch select, KPI, funnel, table header, entity label dari properties | M |
| **D. Preset non-otomotif** | property, fnb, retail, healthcare, education, custom | M |
| **E. Highlight custom** | Fieldset edit + override + reset default | S–M |
| **F. Polish & QA** | Escape order, mobile, a11y focus, smoke, no regresi automotive | S |

---

## 13. Skrip presentasi demo live (~5–7 menit)

| # | Aksi presenter | Yang ditekankan |
|---|----------------|-----------------|
| 1 | Buka demo dari kartu **One Dashboard** | Onboarding muncul dulu |
| 2 | Pilih **Otomotif** → Generate | “Ini persis dashboard Motovax production-like” |
| 3 | Tunjuk KPI, funnel, cabang, top agent | Satu data, multi-role |
| 4 | Buka customizer → ganti role Sales Manager | Widget menyesuaikan |
| 5 | **Ganti bisnis** → pilih **Properti** | KPI/funnel/proyek auto-generate |
| 6 | Edit 1 highlight custom | “Prioritas bisa disesuaikan board meeting” |
| 7 | Opsional: vertical F&B / Retail cepat | Multi-industri, satu produk |
| 8 | Reset → onboarding lagi | Demo siap prospect berikutnya |
| 9 | CTA WhatsApp **Jadwalkan Demo** | Closing sales |

---

## 14. Panduan Demo multi-step (opsional v1.1)

v1 **tidak wajib** panduan multi-step (onboarding sudah memandu).  
v1.1 bisa menambahkan 6 langkah highlight seperti IMS **setelah** vertical terpilih:

1. Industri terpilih  
2. KPI utama  
3. Funnel  
4. Multi-lokasi  
5. Role customizer  
6. Highlight custom  

---

## 15. QA checklist

- [ ] Buka demo → onboarding tampil (bukan langsung chart)  
- [ ] Skip → automotive gold; angka/label sama baseline pre-change  
- [ ] Pilih Properti → header tabel “Proyek”, funnel inquiry→akad, cabang diganti  
- [ ] Pilih F&B / Retail / Klinik / Edukasi → tidak ada string “unit mobil” tersisa  
- [ ] Lainnya + deskripsi → banner memuat cuplikan deskripsi  
- [ ] Edit highlight → list alert berubah; Simpan toast; Reset mengembalikan  
- [ ] Role + widget toggle masih berfungsi di semua vertical  
- [ ] Period MTD/QTD/YTD multiplier masih benar  
- [ ] Filter lokasi memfilter tabel + agent  
- [ ] Escape: onboarding → customizer → tutup demo  
- [ ] Mobile: grid industri 1 kolom; customizer scrollable  
- [ ] Tidak regresi `#inventoryDemo`, `#crmDemo`, `#socialDemo`, `#insightDemo`  
- [ ] Bahasa Indonesia di semua copy baru  

---

## 16. Keputusan yang dikunci

| Topik | Keputusan |
|-------|-----------|
| Baseline otomotif | **Single source** `dashboardDemoData` / logic existing; preset hanya fallback null |
| Onboarding | **Wajib** di first open; Skip = otomotif |
| Jumlah vertical v1 | 6 preset + custom |
| Highlight | Max 3, editable, session-only |
| Role labels | Tetap Direktur / SM / BM di v1 (pitch “satu data beda peran”) |
| Persist server | Tidak |
| Bahasa | Indonesia |
| Scope | Hanya demo One Dashboard di `motovax.ai` — bukan backend Motovax-app |

---

## 17. Out of scope (sengaja)

- Koneksi ERP/CRM real per industri  
- AI generate KPI dari free-text (boleh v2: mock “AI menganalisis deskripsi…”)  
- Drag-and-drop urutan widget  
- Multi-bahasa EN  
- Perubahan produk Motovax-app production analytics  
- Deploy Coolify di task plan ini (dilakukan di task implementasi)

---

## 18. Deploy (saat task implementasi)

Static site:

```bash
fural-agent repos ship RP5a52bad565635abf41dab4fa --mode coolify
# atau mode auto jika env Coolify sudah di $HOME/.env
```

External DB URL org (untuk app lain, **bukan** needed landing static):  
`postgres://…@103.30.247.46:5868/motovax?sslmode=require` — **tidak dipakai** oleh `motovax.ai` static.

---

## 19. Ringkasan untuk human

Demo One Dashboard **sudah kuat** sebagai Command Center otomotif (role, widget, cabang, periode, forecast, funnel). Plan ini **menambah** dua kemampuan pitch multi-customer:

1. **Onboarding bisnis di awal** — prospect pilih industri + deskripsi singkat.  
2. **Auto-generate properti + highlight custom** — label/KPI/lokasi/funnel/alert menyesuaikan industri; **otomotif dikunci identik** dengan dashboard Motovax yang ada sekarang.

Siap diangkat ke **task implementasi** batch A→F di repo `motovax.ai` tanpa merusak baseline.
