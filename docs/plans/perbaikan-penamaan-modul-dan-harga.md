# Plan Perbaikan — Harga & Penamaan Modul Landing vs Produk

**Tanggal:** 2026-08-24
**Asal:** Task review coretan `harga.html` — oval pada hero copy + tanda pada kartu Core.
**Sumber kebenaran produk:** `motovax-app/apps/backend/tenant/billing_catalog.go` (katalog billing) & `docs/product/modul-fitur-breakdown.md`.

> Plan ini masih **rencana** (belum dieksekusi). Lihat §7 untuk keputusan yang perlu konfirmasi sebelum implementasi.

---

## 1. Tujuan

1. Landing tidak menyimpang dari produk: **nama modul** di seluruh halaman sama dengan label yang benar-benar tampil di billing produk (`motovax-app`).
2. **Harga per modul** jujur terhadap katalog (atau eksplisit "Hubungi kami" bila keputusan bisnis tetap menutup harga).
3. Copy hero `harga.html` lebih **outcome-first** dan tidak generik (selaras `docs/product/audit-copy-landing-2026-08-24.md`).

---

## 2. Label Produk (kebenaran)

Dari `apps/backend/tenant/billing_catalog.go`:

| ID | Label produk (app billing) | Landing saat ini | Status |
|---|---|---|---|
| `core` | Core — Platform Integrasi Agentic AI | Core — Platform Integrasi Agentic AI (kartu) / "Core Platform" (katalog) | ✅ selaras (Core = selalu aktif/Wajib) |
| `crm` | CRM | CRM | ✅ selaras |
| `omni_jasmine` | **Omni + Jasmine AI** | "Jasmine AI + Omnichannel" | ⚠️ urutan/istilah beda |
| `inventory_falcon` | **Inventory + Falcon AI** | "Falcon AI + Inventory" | ⚠️ urutan/istilah beda |
| `ana_analytics` | **Ana AI — Advanced Analytics** | "Ana AI Analytics" (hero) / "Ana AI — Advanced Analytics" (kartu) | ⚠️ hero & kartu beda |
| `social_sora` | **Social Media + Sora AI** | "Sora AI + Social Media" | ⚠️ urutan/istilah beda |

Harga katalog (bulanan): Core **Rp1,5jt**, CRM Rp1,5jt, Omni+Jasmine AI **Rp2jt**, Inventory+Falcon AI Rp1,5jt, Ana AI Rp1jt, Social Media+Sora AI Rp1,5jt. Landing saat ini menyembunyikan angka ("Hubungi Kami" + harga di komentar HTML).

---

## 3. Cakupan perubahan file

Nama modul yang dipakai lebih dari satu tempat → ubah konsisten di:

- `harga.html` — hero + 5 kartu + kartu Core
- `script.js` — `dealerProductNavigation` / megamenu Produk (label suite)
- `fitur/features-data.js` — meta 40 fitur (heroTitle suite: omni 4×, inventory 3×, ana 2×, sora …)
- `fitur/feature-page.js`, `fitur/index.html`
- `fitur/omni-jasmine-ai.html`, `fitur/inventory-falcon-ai.html`, `fitur/ana-ai-analytics.html`, halaman Sora/social
- `modul.html`, `index.html`, `server.mjs` (routing/meta)
- `tests/ui.test.mjs`, `tests/index-alt.test.mjs` (cek referensi nama lama)
- `docs/product/modul-fitur-breakdown.md`, `docs/product/audit-copy-landing-2026-08-24.md` (sinkronisasi istilah opsional)

---

## 4. Item kerja (berurutan)

### Fase A — Standarisasi nama modul
- [ ] Tetapkan satu arah nama: **ikuti label app** (`Omni + Jasmine AI`, `Inventory + Falcon AI`, `Social Media + Sora AI`, `Ana AI — Advanced Analytics`) sebagai kanon, atau pertahankan "AI-first" bila konfirmasi bisnis memilih itu (lih. §7).
- [ ] Ganti seluruh kemunculan nama lama → nama kanon di semua file §3.
- [ ] Samakan hero & kartu `harga.html` (hapus inkonsistensi `Ana AI Analytics`).
- [ ] Update test yang menyebut nama lama.

### Fase B — Harga
- [ ] Keputusan: tampilkan angka katalog (Core, CRM, dst) **atau** tetap "Hubungi Kami".
- [ ] Jika tampil: aktifkan angka di `core-price` & `price-tag` (hapus komentar `<!-- Rp … -->`), format IDR konsisten.
- [ ] Jika tetap tertutup: pastikan ada CTA yang jelas (semua tombol seragam "Hubungi Kami") + catatan "custom sesuai skala".

### Fase C — Copy hero `harga.html`
- [ ] HeroDesc pindah ke **benefit/outcome**: mis. "satu fondasi aman untuk semua cabang, aktifkan hanya modul yang tim pakai" (ganti capability-listing generik), mengikuti pola §6 di audit-copy-landing.
- [ ] Terjemahkan jargon (tenant, agentic, faneling, handoff MR) ke bahasa nilai dealer bila muncul di harga.
- [ ] Core card: pertahankan klaim "fondasi + wajib" (benar di produk) tetapi tulis dengan benefit, bukan daftar kata kunci.

### Fase D — Responsif & verifikasi
- [ ] Render `harga.html` pakai Chromium/Playwright di **1440×1000**, **834×1112**, **390×844** (cache off + cache-buster).
- [ ] Cek grid 5 kolom harga tidak hancur di tablet/mobile (fallback kolom), tidak ada horizontal overflow, nama/angka panjang tidak terpotong.
- [ ] Jalan `npm test` (ui.test.mjs, index-alt.test.mjs) setelah rename.

### Fase E — Docs & deploy
- [ ] Sinkronkan `docs/product/modul-fitur-breakdown.md` bila ada perubahan nama.
- [ ] Commit sebagai identitas member, push `main`, deploy via `fural-agent repos ship` (mode Coolify org).

---

## 5. Kriteria sukses

- Nama modul di `harga.html` (+ katalog & fitur) 100% sama dengan `billing_catalog.go`.
- Hero & kartu harga konsisten; tidak ada nama varian ganda.
- Harga (atau status "Hubungi Kami") eksplisit dan konsisten; tidak ada komentar harga mati.
- Tidak ada regresi responsif/tekstual di 3 viewport; seluruh test hijau.
- Deploy production diverifikasi ulang pada URL live.

---

## 6. Risiko / catatan

- Ada arah yang saling berseberangan: commit `9a9b8b4` "nama AI dulu, baru tools" vs label app "module-first". Perlu satu sumber keputusan bisnis.
- Mengubah nama di `features-data.js`/routing berisiko memutus tautan lama → pertahankan slug, hanya ubah label tampil.
- Harga publik = sensitif; jangan publish tanpa konfirmasi harga katalog yang disetujui.

---

## 7. Konfirmasi yang dibutuhkan (sebelum eksekusi)

1. **Arah nama modul:** ikut label app (`Omni + Jasmine AI`, `Inventory + Falcon AI`, `Social Media + Sora AI`) atau pertahankan AI-first? *(rekomendasi: ikut app demi konsistensi produk)*
2. **Tampilkan harga** per modul (angka katalog) atau tetap "Hubungi Kami"?
3. **Skala rewrite copy hero** — hanya nama/harga, atau sekalian aplikasikan rekomendasi benefit-led dari audit-copy-landing?
