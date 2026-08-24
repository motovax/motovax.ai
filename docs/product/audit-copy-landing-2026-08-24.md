# Audit Konten & Penjelasan Produk — Landing motovax.ai

**Tanggal:** 2026-08-24
**Ruangan:** Katalog produk / megamenu Produk + seluruh halaman fitur (`fitur/*.html` + `fitur/features-data.js`), `index.html`, `modul.html`.
**Trigger:** Task "Lakukan deep investigation — terlihat panjang lebar dan tidak menjual" (screenshot mobile menu Katalog Produk).

> Dokumen ini adalah **hasil investigasi dan rekomendasi** — belum ada perubahan copy yang diterapkan. Seluruh klaim status produk diselaraskan dengan produksi (`motovax-app`) sesuai kebijakan konten repo.

---

## 1. Ringkasan eksekutif

Mesin `features-data.js` berisi **40 halaman fitur** dengan struktur copy yang seragam (heroTitle, heroDesc, capabilities, howItWorks, benefits). Struktur rapi, tapi **isi copy-nya gagal menjual** karena tiga penyakit utama:

1. **Bertele-tele & generik** — banyak deskripsi menyebut *kemampuan teknis/daftar modul* alih-alih *hasil bisnis*. Rata-rata heroDesc **23 kata**, dengan beberapa mencapai **28–30 kata** dalam satu kalimat tanpa jeda alur.
2. **Jargon internal tanpa translasi nilai** — istilah seperti *faneling, handoff ke MR, listing, HPP, TNS, GP, pivot, worker* dipakai mentah tanpa menjelaskan *kenapa dealer butuh itu*.
3. **Duplikasi & kanibal masif** — banyak slug dengan isi salinan yang sama (contoh: **3×** "Call Center AI Omnichannel", **4×** "WhatsApp Broadcast", **2×** "Manajemen Deal", "Aplikasi CRM" vs "Manajemen Kontak/Deal"), sehingga katalog terasa panjang, berulang, dan tidak fokus.

Efeknya di mobile (screenshot): menu Katalog Produk memuat **enam suite × 4–7 fitur**, tiap fitur punya paragraf deskripsi, sehingga halaman menjadi dinding teks yang "panjang lebar" dan tidak mengarahkan ke tindakan.

---

## 2. Metodologi

- Membuka seluruh `heroTitle`/`heroDesc` 40 fitur dari `fitur/features-data.js` dan menghitung metrik panjang copy (Node).
- Membandingkan struktur megamenu Produk (`script.js` → `dealerProductNavigation`) dengan menu mobile Katalog Produk.
- Memvalidasi klaim status terhadap produksi (`apps/frontend/src/App.tsx` routes & feature flags di `motovax-app`) serta `docs/product/modul-fitur-breakdown.md`.
- Kategorisasi berdasarkan prinsip copywriting B2B SaaS (benefit-led, outcome, spesifisitas, CTA).

---

## 3. Temuan utama

### 3.1 Copy lebih bertele-tele dari yang seharusnya (angka)

| Metrik | Nilai | Catatan |
|---|---|---|
| Total halaman fitur | 40 | — |
| Fitur dengan `heroDesc` | 40 (100%) | setiap halaman wajib punya paragraf |
| Rata-rata kata `heroDesc` | **23** | panjang untuk satu baris value prop |
| Rata-rata kata per `capability.desc` | **9** | masih masuk akal |
| `heroDesc` terlama | **30 kata** | Call Center AI Omnichannel (×3 duplikat) |
| Fitur `heroDesc` > 28 kata | 4+ | Sora, FB Messenger, Automasi Workflow, Jasmine, Falcon |

**Masalah bukan soal panjang absolut**, tapi *padatan kalimat*: heroDesc umumnya satu kalimat berisi daftar klausa (mis. "…antrean, takeover, handoff ke MR, aksi inventori dan kredit, serta performa layanan").

### 3.2 Deskriptif → terlalu banyak "capability listing", sedikit "outcome"

Pola dominan: **"[modul] menyediakan/ menggabungkan/ menghubungkan X, Y, Z, dan W"**. Contoh terbaik yang GAGAL:

> "Fondasi multi-tenant, akses berbasis peran, integrasi, dashboard, dan konfigurasi modul" — Core Platform
> "Digabungkan broadcast, bulk messaging, segmentasi audiens, konten inventory, dan penanganan balasan dalam satu alur" — WhatsApp Broadcast ×4

Kalimat seperti ini menyebut *fitur*, bukan *manfaat bagi dealer* (lebih cepat closing, follow-up tidak tercecer, tak kehilangan lead). Ini yang membuat "tidak menjual".

### 3.3 Jargon internal tanpa "translasi nilai"

Kata yang sulit dipahami pembaca awam/dealer non-teknis dan dipakai mentah:

`faneling`, `handoff ke MR`, `MR`, `PIC`, `listing`, `HPP`, `TNS`, `GP`, `one dashboard`, `agentic`, `tool schema`, `SSE realtime`, `multi-tenant`, `tenant`, `MRP`.

Sebagian sudah masuk akal di konteks dealer (listing, HPP), sebagian perlu disandingkan dengan **hasil** (mis. "handoff ke MR = follow-up closing oleh tim mobil yang tepat").

### 3.4 Duplikasi & kanibal (penyebab terbesar terasa "panjang lebar")

| Kelompok | Slug | Masalah |
|---|---|---|
| **Call Center AI Omnichannel** | `aplikasi-omnichannel`, `aplikasi-call-center`, `aplikasi-customer-service` | heroTitle & heroDesc **identik 100%** (3×) |
| **WhatsApp Broadcast** | `wa-blast`, `whatsapp-bulk`, `aplikasi-broadcast-whatsapp`, `motovax-broadcast` | isi hampir sama (4×) |
| **Manajemen Deal** | `manajemen-deal`, `manajemen-pipeline` | heroDesc sama |
| **CRM** | `aplikasi-crm` vs `manajemen-kontak`, `manajemen-deal` | cakupan tumpang tindih |
| **Call Center** | `aplikasi-call-center` vs `aplikasi-omnichannel` | — |

Akibatnya di `modul.html` dan katalog: item yang "beda link" tapi "sama isi" membuat daftar produk tampak panjang tanpa menambah nilai/kejelasan.

### 3.5 Alignment status dengan produksi (umumnya sudah baik, sebagian perlu label)

Dari 40 fitur: **21 Live, 9 "Live · flag", 4 "Live · suite", 3 Partial, 1 Partial·roadmap, 1 Live·depends Meta, 1 Partial·roadmap voice**. Umumnya sudah jujur; yang perlu dicermati adalah fitur "Partial/roadmap" yang masih tampil biasa di katalog (mis. Sales GPS, WhatsApp Call, Knowledge Base, Automasi Workflow no-code) — berisiko dibaca pembaca sebagai **sudah live**.

### 3.6 CTA & hierarki halaman fitur

Halaman fitur sudah punya struktur (hero, capabilities, howItWorks, benefits, related, demo). **Kekuatan**: sudah ada CTA demo & "related". **Kelemahan**: value prop di atas lipatan (heroTitle/heroDesc) tidak menempatkan *hasil bisnis* atau *angka*; manfaat kuantitatif (mis. respon lebih cepat, anti lead tercecer) tidak muncul di awal.

---

## 4. Analisis per komponen kunci

### 4.1 Menu mobile "Katalog Produk" (objek screenshot)

- Memuat **6 suite × 4–7 fitur** = ~30 item, masing-masing dengan `<strong>` judul + `<small>` deskripsi.
- Deskripsi memakai `feat.desc` yang sama dengan megamenu desktop → panjang untuk satu baris kecil di mobile, sering terpotong.
- Judul suite (`Core Platform`, `CRM`, `Jasmine AI + Omnichannel`…) dipakai sebagai header, namun **tidak ada deskripsi satu kalimat per suite** yang menjual — langsung loncat ke daftar fitur.
- **Rekomendasi cepat:** beri satu value-line per suite dan ringkas `desc` tiap item jadi <8 kata; pisahkan "fitur teras" (3–4) dari "lengkap" (lihat semua).

### 4.2 Index / hero & section solusi

Hero sudah bagus (outcome: *More Test Drives / More Unit Sales*, CTA jelas, screenshot nyata). Section `#solusi` berkualitas. Bagian yang "bertele-tele" justru di **modul.html** dan **katalog**.

### 4.3 modul.html

Satu-satunya halaman ringkas modul; kartu per modul sudah padat. Masalah: judul kartu dan deskripsi sudah baik, tapi **tabel/status & istilah** (faneling, handoff MR, MRP) tanpa glosar; perlu sentuhan benefit per modul.

---

## 5. Contoh transformasi copy (sebelum → sesudah)

Prinsip: **Hasil bisnis dulu, spesifik, lalu bagaimana**; pindahkan rincian teknis ke bawah.

1. **Core Platform Agentic AI**
   - Sebelum: *"Fondasi multi-tenant, akses berbasis peran, integrasi, dashboard, dan konfigurasi modul."*
   - Sesudah: *"Satu fondasi aman untuk semua cabang — atur peran tim, integrasi WhatsApp/Meta, dan aktifkan modul hanya dengan beberapa klik."*

2. **Call Center AI Omnichannel**
   - Sebelum (30 kata): *"Satukan WhatsApp, Instagram DM, Facebook Messenger, AI, dan agent manusia dalam Call Center Motovax. Kelola antrean, takeover, handoff ke MR, aksi inventori dan kredit, serta performa layanan dari satu workspace."*
   - Sesudah: *"Semua chat pelanggan (WA, IG, FB) di satu inbox, ditangani AI 24/7. Saat butuh manusia, lead di-handoff ke sales yang tepat tanpa kehilangan konteks."* (detail antrean/takeover/kredit → pindah ke capabilities)

3. **WhatsApp Broadcast**
   - Sebelum: *"Gabungkan broadcast, bulk messaging, segmentasi audiens, konten inventory, dan penanganan balasan dalam satu alur campaign WhatsApp Motovax."*
   - Sesudah: *"Kirim promosi & riwayat follow-up ke pelanggan yang tepat secara massal, dan balasan tetap masuk ke inbox yang sama."*

4. **CRM**
   - Sebelum: *"Modul CRM Motovax mencakup Customer, Pipeline Cold→Deal, program follow-up, guideline, MR, salespeople, agents, dan dashboard sales dalam satu workspace."*
   - Sesudah: *"Kelola peluang dari cold sampai deal, dengan follow-up otomatis yang tidak ada lead tercecer."*

> Catatan: contoh di atas adalah **usulan copy** yang belum diterapkan. Eksekusi perlu dikonfirmasi sebelum commit (lihat §7).

---

## 6. Rekomendasi prioritas

| # | Aksi | Dampak | Prioritas |
|---|---|---|---|
| 1 | **Deduplikasi** slug yg isi identik (Call Center ×3, Broadcast ×4, Deal ×2) — rapikan katalog dan modul | Katalog jauh lebih pendek & fokus | Tinggi |
| 2 | **Rewrite value-prop** heroTitle/heroDesc 40 fitur: hasil bisnis dulu, cup ≤18 kata | Copy langsung "menjual" | Tinggi |
| 3 | **Ringkas katalog mobile** pakai value-line per suite + desc item <8 kata | Fix objek screenshot | Tinggi |
| 4 | **Terjemahkan jargon** (faneling, handoff MR, HPP, dst) dengan label nilai | Memahami & meyakinkan | Sedang |
| 5 | **Tandai status** Partial/roadmap lebih jelas di katalog & modul | Menghindari overclaim | Sedang |
| 6 | Gunakan **angka/social proof spesifik** di hero index & fitur pilar | Kredibilitas | Sedang |
| 7 | **CTA lanjutan** per fitur (lihat demo / hubungi) konsisten | Konversi | Rendah–Sedang |

---

## 7. Catatan eksekusi

- Eksekusi rewrite sebaiknya bertahap: mulai dedup + ringkas katalog (foreground), lalu heroDesc pilar (omni, inventory, social, analytics), baru sisanya.
- Setiap klaim harus dicek ulang ke `motovax-app`; fitur yang belum live tidak boleh diklaim sebagai live.
- Hindari menambah panjang halaman; ukuran copy tentang kotak itu *berkurang*, bukan bertambah.
