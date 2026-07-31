# Plan Demo Solusi Social Media Automation

**Repo target:** `motovax.ai` (landing static + product demos)  
**Produk:** Social Media & Ads Automation (Social Growth Studio)  
**Tanggal plan:** 2026-07-31  
**Status implementasi seed:** produk diperluas · fitur mobil diperkaya · Panduan Demo multi-step aktif

---

## 0. Latar belakang (3 poin human task)

| # | Poin human | Temuan | Tindakan |
|---|------------|--------|----------|
| 1 | **Tambahkan produknya lebih banyak** | Catalog social hanya 3 unit (Zenix, BR-V, Xpander); IMS seed 10 unit | Perluas katalog inventory & Social Growth Studio |
| 2 | **Cek ulang fitur mobil Motovax** | Detail unit hanya tahun/transmisi/warna/odo; creative social tanpa highlight fitur | Tambah body, BBM, mesin, seats, daftar fitur di IMS + social |
| 3 | **Panduan Demo belum jalan** | Demo social **tidak punya** tombol/popover panduan (berbeda IMS/CRM) | Implementasi Panduan Demo 8 langkah + highlight area |

Dari tiga poin di atas disusun **rencana demo live** solusi Social Media Automation di bawah.

---

## 1. Tujuan demo

Menyajikan demo interaktif **Social Media & Ads Automation** yang:

1. Memakai **katalog unit yang kaya** (selaras inventory Motovax).
2. Menampilkan **fitur mobil** yang relevan untuk copy iklan & creative.
3. Memandu sales/prospect lewat **Panduan Demo** step-by-step.
4. Menjelaskan rantai nilai: **Inventory → Konten → Jadwal → Campaign Insight → Lead CRM**.
5. Tetap **aman publik**: mock/tenant demo, tidak publish ke Meta produksi.

---

## 2. Narasi pitch (1 kalimat)

> “Dari stok live, konten iklan Meta bisa digenerate, dijadwalkan, dan setiap klik diatribusi sampai lead masuk CRM—tanpa pindah tools.”

---

## 3. Scope fitur demo (acceptance)

| Area | Requirement | Acceptance |
|------|-------------|------------|
| Produk | ≥ 8 unit di Content Studio | Kartu unit bisa dipilih; count “N unit ready” benar |
| Fitur mobil | Spec + fitur unggulan | Kartu unit & preview creative menampilkan fuel/seats/feature; IMS detail lengkap |
| Panduan | Tombol **Panduan demo** + auto-open pertama kali | 8 langkah navigasi Kembali/Lanjut/Selesai; highlight area |
| Studio | Pilih unit → format → caption → jadwal | Preview live; generate 3 varian caption |
| Kalender | Post draft/planned/published | Setelah schedule, unit muncul planned |
| Insight | Multi campaign + ranking produk | KPI, trend, UTM, lead table, top products |
| Keamanan | Tidak kirim ke Meta | Copy “tenant demo” / “Demo aman” terlihat |

---

## 4. Katalog produk demo (setelah perluasan)

### 4.1 Social Growth Studio (Content Studio)

| ID | Unit | Highlight fitur | Campaign insight |
|----|------|-----------------|------------------|
| zenix | Toyota Innova Zenix Hybrid 2023 | TNGA Hybrid, Captain Seat | Meta · Zenix Hybrid Juli |
| brv | Honda BR-V Prestige 2021 | Honda Sensing, 7 Seater | Instagram · BR-V Family |
| xpander | Mitsubishi Xpander Ultimate 2021 | Head Unit 9", Keyless | Meta · Xpander Weekend |
| raize | Toyota Raize GR Sport 2022 | Turbo, GR Sport Kit | Meta · Raize GR Sport |
| pajero | Mitsubishi Pajero Sport Dakar 2020 | Diesel, 360 Camera | Facebook · Pajero Dakar |
| ertiga | Suzuki Ertiga GX Hybrid 2023 | SHVS Hybrid | Instagram · Ertiga Hybrid |
| crv | Honda CR-V Turbo Prestige 2021 | Sensing, Panoramic | (ranking di campaign lain) |
| almaz | Wuling Almaz RS Pro 2022 | ADAS, IoV | (ranking di campaign lain) |

### 4.2 Inventory seed (IMS)

16 unit: unit-001 … unit-016 (tambahan Zenix Hybrid Q, Raize GR, Pajero Sport, CR-V Turbo, Xenia ADS, Almaz RS) dengan field:

`bodyType`, `fuel`, `engine`, `seats`, `features[]` + field operasional lama.

---

## 5. Panduan Demo — skrip 8 langkah (~5–7 menit)

| Langkah | View | Yang ditunjukkan | Aksi presenter |
|---------|------|------------------|----------------|
| 1 | Studio | Overview Social Growth | Buka demo dari kartu fitur |
| 2 | Studio | Katalog unit (8) | Klik 1–2 unit berbeda |
| 3 | Studio | Fitur mobil di creative | Tunjuk fuel/seats/feature di kartu + preview |
| 4 | Studio | Format & headline | Ganti 1:1 → 4:5 / 9:16 |
| 5 | Studio | Platform + Generate caption | Generate Ulang 1× |
| 6 | Studio | Jadwalkan | Pilih tanggal/waktu → Jadwalkan |
| 7 | Kalender | Post planned | Tunjukkan entry di kalender |
| 8 | Insight | UTM → lead CRM | Ganti campaign, baca ranking & lead |

**CTA penutup:** “Lead yang masuk diatribusi UTM campaign yang sama, siap di-follow-up di Autopilot CRM / Call Center.”

---

## 6. Alur teknis (data flow demo)

```
Inventory seed / tenant snapshot
        │
        ▼
 Content Studio (pilih unit + fitur)
        │ caption + creative
        ▼
 Schedule → publicDemoData.submit("social_schedule")
        │
        ▼
 Kalender (planned posts)
        │
        ▼
 Campaign Insight (mock KPI + ranking + leads)
        │
        ▼
 Narasi handoff → CRM / Call Center (demo terpisah di landing)
```

---

## 7. File yang disentuh

| File | Perubahan |
|------|-----------|
| `script.js` | Seed inventory 16 unit + fitur; `socialDemoVehicles` 8; campaigns 6; `SocialGrowthDemo` guide + ranking per campaign; detail IMS features |
| `index.html` | Tombol Panduan demo; anchor highlight; fitur di detail panel; opsi campaign baru |
| `styles.css` | Heading actions, highlight guide, chips fitur detail, meta kartu unit |
| `docs/plans/demo-social-media-automation.md` | Dokumen plan ini |

---

## 8. Script demo sales (ringkas)

1. Buka **Social Media & Ads Automation** → biarkan panduan auto-open (atau klik **Panduan demo**).  
2. Tunjukkan **8 unit** ready dari inventory.  
3. Pilih Zenix → highlight **fitur Hybrid + Captain Seat** di creative.  
4. Ubah format Story → “siap multi-channel Meta”.  
5. Generate caption → “copy AI berbasis unit & penawaran”.  
6. Jadwalkan → “masuk tenant demo, bukan Meta live”.  
7. Kalender → planned post terlihat.  
8. Insight → klik/lead/UTM + ranking produk → “atribusi ke CRM”.  
9. Tutup + CTA **Jadwalkan Demo** / WhatsApp.

---

## 9. QA checklist

- [ ] Tombol **Coba Demo Gratis** membuka `#socialDemo`
- [ ] **Panduan demo** muncul (auto pertama kali + manual)
- [ ] Kembali / Lanjut / Selesai berfungsi; Escape menutup panduan dulu
- [ ] ≥ 8 kartu unit; fitur meta terlihat
- [ ] IMS detail: body, BBM, mesin, seats, chips fitur
- [ ] Schedule memicu toast + view kalender
- [ ] 6 opsi campaign di Insight merender KPI berbeda
- [ ] Mobile: heading actions & guide usable

---

## 10. Deploy

Static site → `fural-agent repos ship RP5a52bad565635abf41dab4fa --mode coolify` (atau `auto` bila Coolify terkonfigurasi di `$HOME/.env`).

---

## 11. Keputusan yang dikunci

| Topik | Keputusan |
|-------|-----------|
| Jumlah produk social | **8 unit** di studio (bukan hanya 3) |
| Fitur mobil | Field Motovax: body, fuel, engine, seats, features[] |
| Panduan | Multi-step seperti IMS, 8 langkah, highlight anchor |
| Publish Meta | **Tidak** — tenant demo only |
| Bahasa UI | **Indonesia** (sesuai org instruction) |
