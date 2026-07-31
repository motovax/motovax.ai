# Plan Demo Solusi Autopilot CRM

**Repo target:** `motovax.ai` (landing static + product demos)  
**Referensi produk:** Autopilot CRM di `motovax-app`  
- URL: `https://mobix.motovax.com/sales/pipeline` (+ Customer, Campaign, Panduan)  
- Sidebar: `apps/frontend/src/components/management-sidebar.tsx` → `salesNav`  
- Pipeline: `apps/frontend/src/pages/sales/pipeline/index.tsx`  
- Campaign (program): `apps/frontend/src/pages/sales/program/*`  
- Label i18n: `apps/frontend/src/locales/id.json` → `sidebar.*`  
**Demo saat ini:** `#crmDemo` di `index.html` + `AutopilotCRMDemo` di `script.js`  
**Status dokumen:** plan (siap implementasi) · 2026-07-31  
**Pola panduan multi-step (referensi):** IMS demo + `docs/plans/demo-social-media-automation.md`

---

## 0. Latar belakang (4 poin human task)

| # | Poin human | Temuan di codebase | Arah solusi |
|---|------------|--------------------|-------------|
| 1 | **Samakan menu selain campaign** | Sidebar demo: *Sales Performance · Customer · Pipeline · Program · Guideline* — label & set item **tidak** sama dengan produksi Autopilot CRM | Samakan label + urutan menu non-campaign dengan Motovax; buat navigasi view (seperti IMS `data-ims-nav`) |
| 2 | **Ganti campaign → auto follow customer** | Produksi label `sidebar.program` = **Campaign** (`/sales/program` = jadwal follow-up WA). Demo memakai **Program** | Ganti entri Campaign menjadi **Auto Follow Customer**; view demo menampilkan auto-follow / nurture (bukan ads campaign) |
| 3 | **Panduan Demo belum jalan** | CRM hanya punya popover 1 langkah (“Mulai simulasi”); **tidak** multi-step + highlight seperti IMS/Social; z-index guide (8) di dalam overlay 100, tetapi alur panduan lemah / mudah terasa “tidak jalan” | Implementasi Panduan Demo multi-langkah + highlight + Kembali/Lanjut/Selesai |
| 4 | **Detail di pipeline belum sama dengan mobil Motovax** | Kartu/detail lead hanya string `unit` generik; tidak taut ke `inventoryDemoSeed` (plate, harga, cabang, fitur, status stok) | Detail lead pipeline menampilkan unit selaras katalog IMS Motovax + layout detail mirip produksi |

---

## 1. Tujuan demo

Menyajikan demo interaktif **Autopilot CRM** di landing `motovax.ai` yang:

1. **Sidebar & label menu** selaras Motovax (kecuali entri Campaign diganti **Auto Follow Customer**).
2. **Pipeline** terasa seperti produk: filter sumber, kanban Cold→Warm→Hot→Prospect, Deal & Handover, detail lead kaya.
3. Menonjolkan nilai pitch: **auto follow-up AI** (simulasi, tenant demo, tidak kirim pesan nyata).
4. **Panduan Demo** step-by-step yang benar-benar memandu presenter/sales prospect.
5. **Unit mobil** di lead = katalog Motovax (`inventoryDemoSeed` / snapshot tenant demo).
6. Tetap **static-first** + aman publik (mock / public demo API).

---

## 2. Narasi pitch (1 kalimat)

> “Lead dari omnichannel & import masuk satu pipeline; AI merangkum minat, merekomendasikan follow-up, dan menaikkan stage—tanpa sales harus mengejar manual satu per satu.”

---

## 3. Baseline vs produksi (gap analysis)

### 3.1 Menu Autopilot CRM

| Area | Produksi Motovax (`salesNav` + i18n ID) | Demo `#crmDemo` sekarang | Gap |
|------|----------------------------------------|--------------------------|-----|
| Section | **Autopilot CRM** | Autopilot CRM | OK |
| Item 1 | **Customer** (`/sales/customer`) | Customer | Label OK; **tidak bisa diganti view** |
| Item 2 | **Pipeline** (`/sales/pipeline`) | Pipeline (active) | Hanya view ini yang “hidup” |
| Item 3 | **Campaign** (`/sales/program`) | **Program** | Label salah + harus diganti **Auto Follow Customer** |
| Item 4 | **Panduan** (`/sales/guideline`) | **Guideline** | Label EN; view kosong |
| Extra di demo | — | **Sales Performance** | Bukan item `salesNav` CRM (di produksi “Performa Sales” ada di Analytics `/sales`) → **pindahkan / hilangkan dari sidebar CRM**, atau tampilkan sebagai item Analytics terpisah jika tetap ingin pitch performa |

**Keputusan plan (disarankan):**

```
Autopilot CRM
├── Customer
├── Pipeline          ← default active (inti demo)
├── Auto Follow Customer   ← pengganti Campaign
└── Panduan
```

*Sales Performance / Performa Sales* **tidak** dimasukkan sebagai item menu CRM agar “samakan menu” konsisten dengan `salesNav` produksi. Opsional: taut teks “Lihat Performa Sales” di tip sidebar ke demo One Dashboard (sudah ada di landing).

### 3.2 Pipeline board

| Area | Produksi | Demo sekarang | Gap |
|------|----------|---------------|-----|
| Stage aktif | Cold, Warm, Hot, Prospect | Cold, Warm, Hot, Prospect | OK |
| Stage closed | Deal + Handover (section terpisah) | Deal & Handover collapsible (static 2 kartu) | Perkuat data dinamis + label selaras |
| Filter sumber | Semua / Omnichannel / Excel + sub-channel | Semua / Omnichannel / Excel | OK dasar; opsional sub-channel |
| Header | Pipeline value + Forecast + Tambah Lead + Refresh | Pipeline + Forecast + Panduan demo | Tambah Lead boleh mock UI; Refresh = reset filter |
| Kartu | Nama, unit_interest, score, nilai, channel badge, intent, stale, AI/handler | Nama, unit, score, source, nilai, handler, hari di stage | Tambah **badge channel**, taut unit ke stok, intent opsional |
| Detail | Stage, channel, score, nilai, stale, **Status Percakapan**, Ringkasan AI, **Riwayat Leads** | Badges, overview, ringkasan AI, rekomendasi, preview FU, timeline | Samakan blok Status Percakapan + riwayat; **tambah blok unit mobil Motovax** |
| Follow-up AI | Ada di Campaign/program & aksi sales | Siapkan + kirim simulasi | Pertahankan sebagai aksi inti; pindahkan “rumah” konsep ke menu **Auto Follow Customer** |

### 3.3 Campaign → Auto Follow Customer

| Produksi Campaign (`/sales/program`) | Target demo Auto Follow Customer |
|--------------------------------------|----------------------------------|
| Daftar program follow-up WA terjadwal | Daftar **program auto-follow** (nurture / re-engagement / hot follow-up) |
| Jadwal hari + jam, status, penerima | Jadwal mock, channel, #lead ter-cover, status Aktif |
| Buat/edit/hapus campaign | Tombol “Buat program” UI-only + toast demo |
| Eksekusi kirim WA | **Simulasi saja** — copy “tidak mengirim pesan nyata” |

Ini selaras narasi fitur AI CRM (follow-up otomatis, re-engagement) di `docs/features/ai-features-overview.md`, tanpa mengklaim Ads Campaign Social Media.

### 3.4 Panduan Demo

| Demo IMS / Social | Demo CRM sekarang | Gap |
|-------------------|-------------------|-----|
| Multi-step + Kembali/Lanjut/Selesai | 1 panel + “Mulai simulasi” | Tidak ada alur panduan penuh |
| Auto-open first visit | Auto-open first visit | OK |
| Highlight area (`data-guide-target`) | Tidak ada | Tidak “mengarahkan” mata user |
| Skrip presenter 5–7 menit | Satu kalimat | Tidak cukup untuk demo sales |

### 3.5 Unit mobil vs inventory Motovax

| Lead demo (contoh) | Katalog IMS `inventoryDemoSeed` | Gap |
|--------------------|---------------------------------|-----|
| “Mitsubishi Xpander Ultimate **2023**” | unit-006 Xpander Ultimate **tahun seed** + plate/harga/fitur | Tahun/string bebas, **tidak linked** |
| Raize GR Sport 2022 | unit-012 Raize GR Sport 1.0T | Nama mirip, detail stok tidak muncul di detail lead |
| Serena HWS AT 2023 | unit-001 | OK nama; tanpa plate/cabang/status |
| Unit fiktif / inkonsisten tahun | 16 unit ber-spec lengkap | Detail lead **belum** menampilkan body/fuel/seats/features/harga cash |

---

## 4. Prinsip desain demo

1. **Parity label & struktur menu dulu** — copy production ID; ganti hanya Campaign → Auto Follow Customer.
2. **Parity visual pipeline selektif** — kanban + detail; interaksi simulasi.
3. **Satu sumber kebenaran unit** — lead mereferensikan `unitId` dari `inventoryDemoSeed` (atau snapshot tenant).
4. **Panduan = produk** — multi-step wajib, sama pola Social/IMS.
5. **Static-first** — HTML/CSS/JS di `motovax.ai`; submit follow-up tetap lewat `publicDemoData` jika tersedia.
6. **Bahasa UI Indonesia.**

---

## 5. Scope fitur demo (acceptance)

### 5.1 Wajib (4 poin human)

| # | Requirement | Acceptance di demo |
|---|-------------|-------------------|
| 1 | Menu selain campaign sama Motovax | Sidebar: **Customer · Pipeline · Auto Follow Customer · Panduan**; label ID; breadcrumb/section **Autopilot CRM**; navigasi ganti view (active state) |
| 2 | Campaign diganti Auto Follow Customer | Tidak ada label “Campaign”/“Program” di sidebar CRM; view Auto Follow menampilkan daftar program follow-up + 1 aksi simulasi |
| 3 | Panduan Demo jalan | Tombol **Panduan demo** + auto-open pertama kali; ≥ 6 langkah; Kembali/Lanjut/Selesai; highlight target; Esc menutup |
| 4 | Detail pipeline = mobil Motovax | Setiap lead `unitId` valid; panel detail menampilkan **nama unit, plate, tahun, cabang, status stok, harga, 2–4 fitur** dari seed IMS; tidak ada unit “hantu” di luar katalog |

### 5.2 Wajib pendukung (pitch)

| Area | Acceptance |
|------|------------|
| Pipeline kanban | 4 kolom Cold→Prospect; filter sumber; search; KPI lead aktif / FU / hot / AI |
| Follow-up simulasi | Dari detail lead: siapkan pesan → kirim simulasi → stage/score naik + toast; **tidak** kirim channel nyata |
| Deal & Handover | Section collapsible dengan ≥ 2 transaksi mock yang unit-nya juga dari katalog Motovax |
| Keamanan copy | Badge “Tenant Demo · tidak mengirim pesan” terlihat di toolbar + footer detail |

### 5.3 Out of scope (sengaja)

- API produksi customer / drag-and-drop stage ke backend nyata  
- Kirim WhatsApp/Email sungguhan  
- Form Tambah Lead full validation production  
- Halaman Customer full CRUD (cukup list mock + buka detail ringkas)  
- Ads Campaign Social Media (sudah ada di demo Social Growth)

---

## 6. Spesifikasi menu & view

### 6.1 Sidebar (target)

```html
<nav aria-label="Navigasi Autopilot CRM">
  <span>Autopilot CRM</span>
  <button data-crm-nav="customer">Customer</button>
  <button data-crm-nav="pipeline" class="active">Pipeline</button>
  <button data-crm-nav="auto-follow">Auto Follow Customer</button>
  <button data-crm-nav="panduan">Panduan</button>
</nav>
```

### 6.2 View Customer (mock parity ringan)

- Tabel/list: nama, telepon mask, unit minat, stage, handler, last activity  
- Klik baris → buka **detail panel yang sama** dengan pipeline (reuse)  
- Empty search state  
- Data = subset `crmDemoSeed`

### 6.3 View Pipeline (inti — default)

Tetap layout sekarang, diperbaiki:

1. Heading: breadcrumb `Autopilot CRM / Pipeline`  
2. KPI strip (4 kartu)  
3. Toolbar filter sumber + search + safety pill  
4. Kanban 4 stage + mobile stage tabs  
5. Deal & Handover collapsible (data dari seed closed)  
6. Detail drawer (lihat §7)

### 6.4 View Auto Follow Customer (pengganti Campaign)

**Wireframe konten:**

| Blok | Isi |
|------|-----|
| Header | Judul **Auto Follow Customer** · sub “Program follow-up otomatis · simulasi tenant demo” |
| KPI | Program aktif · Lead tercakup · Follow-up 7 hari · Respons rate (mock) |
| Daftar program | Kartu/tabel: nama, tipe (Nurture / Hot FU / Re-engagement), channel, jadwal, #kontak, status |
| Aksi demo | “Jalankan 1 siklus follow-up” → toast + opsional update 1 lead di pipeline (stage+1) |
| Safety | “Pesan tidak dikirim ke nomor customer” |

**Seed program contoh:**

| Nama | Tipe | Channel | Jadwal |
|------|------|---------|--------|
| New Lead Nurture 24j | Nurture | WhatsApp | Setiap hari 09:00 |
| Warm ≥7 hari | Follow-up | WhatsApp | Sen–Jum 10:00 |
| Hot closing push | Hot FU | WA + Call task | Setiap hari 14:00 |
| Re-engagement Cold 30h | Re-engagement | WhatsApp | Rab 11:00 |

### 6.5 View Panduan (in-app, selain popover)

- Ringkas 4 langkah pakai Autopilot CRM (mirror production guideline tone)  
- CTA **Mulai Panduan Demo interaktif** → membuka popover multi-step  
- Link teks ke view Pipeline / Auto Follow

---

## 7. Detail lead pipeline (= mobil Motovax + parity UI)

### 7.1 Model data lead (target)

```js
{
  id: "lead-nadia",
  name: "Nadia Demo",
  unitId: "unit-006",          // wajib — referensi inventoryDemoSeed
  stage: "warm",
  score: 62,
  value: null,                 // null = pakai cashPrice unit; atau override deal_value
  days: 8,
  source: "whatsapp",          // whatsapp | instagram | facebook | excel_import | walk_in
  intent: "considering",       // opsional: aware|considering|comparing|ready_to_buy|postponed
  handler: "AI Bot · Dimas",
  ai: true,
  summary: "…",
  recommendation: "…",
  message: "…",                // draft follow-up AI
  events: [ /* riwayat */ ],
}
```

Resolve unit:

```js
const unit = inventoryDemoSeed.find(u => u.id === lead.unitId);
// tampil: `${unit.brand} ${unit.type} ${unit.year}` · plate · branch · status · cashPrice · features
```

### 7.2 Layout panel detail (urutan)

1. **Header** — nama lead · unit full name · close  
2. **Badges** — stage · channel · score · intent (jika ada) · stale warning  
3. **Kartu Unit Motovax** *(baru, wajib poin 4)*  
   - Brand/type/year · plate · warna · transmisi · odo  
   - Cabang + posisi · status stok (Ready/Booked/…)  
   - Harga cash (atau deal value) · 3–4 chips fitur  
4. **Status Percakapan** — AI Bot aktif / handler manual (parity produksi)  
5. **Ringkasan AI** + **Rekomendasi berikutnya**  
6. **Preview follow-up** (setelah “Siapkan follow-up AI”) + Kirim simulasi  
7. **Riwayat Lead** — timeline events  

### 7.3 Mapping lead → unit (usulan seed)

| Lead | unitId | Catatan |
|------|--------|---------|
| Nadia Demo (featured) | unit-006 Xpander Ultimate | Featured FU demo |
| Bayu | unit-012 Raize GR Sport | Cold IG |
| Sinta | unit-010 BR-V Prestige | Cold FB trade-in |
| Andi | unit-002 Rush G AT | Warm excel |
| Farhan | unit-004 HR-V S CVT | Warm WA |
| Rizky | unit-007 Ertiga GX Hybrid | Hot |
| Laras | unit-009 Rocky 1.2 X | Hot IG |
| Yoga | unit-008 Avanza G CVT | Prospect walk-in |
| Maya | unit-001 Serena HWS | Prospect excel |
| Closed Raka | unit-011 Zenix Hybrid Q | Deal |
| Closed Putri | unit-004 / unit sejenis HR-V | Handover — pastikan konsisten plate mock |

Semua tahun/harga di kartu **diambil dari seed**, bukan string hardcode terpisah.

---

## 8. Panduan Demo — skrip multi-langkah (~5–7 menit)

| # | View | Target highlight | Judul | Body (presenter) |
|---|------|------------------|-------|------------------|
| 1 | pipeline | Sidebar | Menu Autopilot CRM | Tunjukkan Customer, Pipeline, Auto Follow Customer, Panduan — sama Motovax, Campaign diganti Auto Follow |
| 2 | pipeline | KPI + filter | Pipeline live | Filter Omnichannel/Excel; angka pipeline & forecast |
| 3 | pipeline | Kartu Nadia | Lead prioritas | Buka “Coba ini” Nadia (Warm, stale ≥7 hari) |
| 4 | detail | Kartu unit | Unit = stok Motovax | Tunjuk plate, cabang, status, harga, fitur dari inventory |
| 5 | detail | Ringkasan AI + rekomendasi | AI Co-Pilot | Baca ringkasan & rekomendasi follow-up |
| 6 | detail | Tombol follow-up | Simulasi auto follow | Siapkan → kirim simulasi → stage naik, toast |
| 7 | auto-follow | Daftar program | Auto Follow Customer | Tunjuk program terjadwal; (opsional) jalankan 1 siklus |
| 8 | pipeline | Board setelah aksi | Dampak ke pipeline | Nadia pindah kolom / skor naik — siap closing |

**Kontrol UI panduan (parity IMS/Social):**

- `[data-crm-guide-step-label]` · title · body  
- Prev / Next / Finish  
- `data-crm-guide-target` + class highlight ring  
- Auto-open sekali per session (`hasOpenedGuide`)  
- Tombol header **Panduan demo** selalu bisa buka ulang dari step 0  

**Perbaikan teknis yang harus dicek saat implementasi:**

- Pastikan popover **di atas** detail panel (z-index guide ≥ detail; social memakai 12 — samakan CRM)  
- Saat step butuh detail terbuka, auto-`openDetail('lead-nadia')`  
- Saat pindah step ke Auto Follow, `setNav('auto-follow')`  
- Jangan biarkan hanya `focus()` kartu tanpa scroll-into-view  

---

## 9. Alur teknis (data flow demo)

```
inventoryDemoSeed  ──unitId──►  crmDemoSeed (leads)
        │                              │
        │                              ├─► render kanban cards
        │                              ├─► populateDetail (+ unit card)
        │                              └─► Auto Follow program metrics (mock count)
        │
publicDemoData.submit("crm_followup")  ──► toast + mutate lead stage/score (simulasi)
```

File sentuh (perkiraan):

| File | Perubahan |
|------|-----------|
| `index.html` | Sidebar menu, 4 view shell, guide multi-step markup, kartu unit di detail |
| `script.js` | `crmDemoSeed` + `unitId`; nav views; `guideSteps()`; detail unit resolve; Auto Follow view logic |
| `styles.css` | Nav active, view panels, unit card, guide highlight, z-index guide CRM |
| `docs/plans/demo-autopilot-crm.md` | Dokumen ini (sumber kebenaran plan) |

---

## 10. Urutan implementasi (PR / batch)

Disarankan **1 PR mono** di `motovax.ai` (static), dipecah commit logis:

| Batch | Isi | Estimasi effort |
|-------|-----|-----------------|
| **A. Menu parity** | Rename/restructure sidebar; `data-crm-nav`; 4 view shell; hapus Sales Performance & Program/Guideline salah label | S |
| **B. Auto Follow Customer** | View program list + KPI + aksi simulasi 1 siklus | S–M |
| **C. Unit Motovax di pipeline** | `unitId` di seed; kartu unit di detail; sync closed deals; nilai default dari `cashPrice` | M |
| **D. Detail parity** | Status Percakapan, intent badge, channel badge di kartu, copy riwayat | S |
| **E. Panduan multi-step** | Markup + `guideSteps` + highlight + z-index + scroll/nav coupling | M |
| **F. Polish & QA** | Reset demo, mobile stage tabs, a11y Esc, copy safety, smoke manual | S |

**Total orientasi:** 0,5–1 hari dev untuk agent session implementasi penuh.

---

## 11. Skrip presentasi demo live (urutan sales)

1. Dari landing → kartu **Autopilot CRM** → buka demo.  
2. Panduan auto-open → ikuti atau skip ke Pipeline.  
3. Tunjuk **menu** = Motovax (kecuali Auto Follow).  
4. Filter **Omnichannel** → fokus lead.  
5. Buka **Nadia** → tunjuk **unit stok Motovax** (plate/harga/fitur).  
6. **Siapkan follow-up AI** → **Kirim simulasi** → toast stage naik.  
7. Pindah **Auto Follow Customer** → tunjuk program terjadwal.  
8. CTA WhatsApp “Jadwalkan Demo” di landing.

---

## 12. Test plan (manual acceptance)

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 1 | Buka demo CRM | Overlay full; Panduan muncul (first open) |
| 2 | Klik tiap menu sidebar | 4 view berganti; active state benar; label sesuai §6.1 |
| 3 | Pastikan tidak ada “Campaign”/“Program”/“Guideline”/“Sales Performance” di sidebar CRM | Pass |
| 4 | Pipeline: filter Excel | Hanya lead excel_import |
| 5 | Buka detail lead | Kartu unit menampilkan plate + fitur dari seed yang sama dengan IMS |
| 6 | Bandingkan unit-006 di IMS vs detail Nadia | Brand/type/year/harga konsisten |
| 7 | Follow-up simulasi Nadia | Stage warm→hot (atau sesuai map), score↑, toast, timeline bertambah |
| 8 | Reset demo | Seed & UI kembali awal |
| 9 | Panduan: Lanjut sampai selesai | 8 langkah; highlight pindah; Finish menutup |
| 10 | Mobile width | Stage tabs + detail drawer tetap usable |
| 11 | Network off (opsional) | Follow-up boleh gagal graceful dengan toast error tenant |

---

## 13. Deploy (setelah implementasi)

- Repo: `motovax.ai` (`RP5a52bad565635abf41dab4fa`)  
- Static host (Vercel/GitHub Pages sesuai setup org)  
- Saat human minta ship: `fural-agent repos ship RP5a52bad565635abf41dab4fa` (mode auto/coolify sesuai context org)  
- Verifikasi: buka production landing → buka Autopilot CRM → jalankan test plan §12  

---

## 14. Keputusan yang perlu human (jika beda selera)

Default plan sudah dipilih agar agent bisa langsung eksekusi tanpa blocking. Human boleh override:

| # | Topik | Default plan | Alternatif |
|---|--------|--------------|------------|
| 1 | Sales Performance di sidebar CRM | **Dihapus** dari CRM (bukan `salesNav`) | Tetap ada sebagai item ke-5 non-production |
| 2 | Isi Auto Follow | List program follow-up + 1 aksi batch | Hanya rename Campaign UI tanpa view baru |
| 3 | Kedalaman Customer view | List mock + reuse detail | Placeholder “Segera hadir” saja |
| 4 | Sumber unit | Selalu `inventoryDemoSeed` | Prefer snapshot tenant demo jika API hidup |

---

## 15. Definition of Done (implementasi follow-up task)

- [ ] 4 poin human §0 terpenuhi (menu, auto follow, panduan jalan, detail unit Motovax)  
- [ ] Test plan §12 hijau di local (`python -m http.server` / preview)  
- [ ] Tidak ada regresi demo IMS/Omni/Social (guide/z-index/body.demo-open)  
- [ ] Commit + push `motovax.ai`; deploy jika diminta  
- [ ] Task Fural implementasi ditutup `done` dengan `complete_note` berisi cara verifikasi  

---

## 16. Ringkasan eksekutif

Human meminta **plan demo Autopilot CRM**, bukan implementasi di task ini. Empat gap utama: (1) menu sidebar belum mirror Motovax, (2) Campaign harus menjadi **Auto Follow Customer**, (3) Panduan Demo CRM belum multi-step/highlight, (4) detail lead belum menampilkan **mobil dari katalog Motovax**. Plan di atas memetakan acceptance, struktur view, seed data, skrip panduan 8 langkah, batch implementasi A–F, dan test plan — siap diangkat ke task implementasi berikutnya di repo `motovax.ai`.
