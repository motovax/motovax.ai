# Rencana: Halaman Dedicated untuk Setiap Sub-Menu / Card Produk (Mega Menu)

## 1. Ringkasan masalah (hasil deep investigation)

Mega menu **Produk** (desktop) dan accordion **Produk** (mobile) di landing
dibangun dari satu sumber data `dealerProductNavigation.suites` di `script.js`
(disksian ke `data-produk-mount` desktop dan `data-mobile-nav-panel` mobile,
mis. `script.js:1063`). Setiap suite punya kartu capabilitas (`features[]`)
dengan atribut `slug` yang menjadi target link.

Temuan: **hanya suite CRM yang membawa tiap kartu ke halaman dedicated**
(manajemen-kontak, manajemen-deal, personalisasi-report-sales,
automasi-workflow) — pola inilah yang benar sesuai gambar 1.

Untuk 4 suite lainnya, **semua kartu di dalam suite menunjuk ke halaman suite
itu sendiri**, bukan ke konten miliknya masing-masing:

- Suite Jasmine AI + Omnichannel → semua kartu ke `omni-jasmine-ai.html`
- Suite Falcon AI + Inventory → semua kartu ke `inventory-falcon-ai.html`
- Suite Ana AI Analytics → semua kartu ke `ana-ai-analytics.html`
- Suite Iris AI + Social Media → semua kartu ke `social-media-sora-ai.html`

Akibatnya saat kartu diklik, halaman yang terbuka **tidak berubah** (selalu
mendarat di halaman suite yang sama), tidak seperti pola CRM. Ini sesuai
keluhan: `jasmine ai itu di klik mana saja linknya ke omni-jasmine-ai.html,
begitu juga menu di bawahnya sama saja`.

### Cakupan investigasi lain
- Menu **Solusi** (outcomes + roles) menunjuk ke halaman yang **berbeda-beda**
  dan tidak duplikat — tidak perlu diubah.
- Kartu suite yang sama muncul 2× di `index.html` (card + link) tapi mendarat
  ke page suite masing-masing yang valid — bukan masalah.
- Halaman `fitur/index.html` (Semua Fitur) sudah berisi link dedicated untuk
  sebagian besar fitur — akan ditambahkan halaman baru ke daftar ini.
- Halaman bertitle "Halaman dipindahkan" (aplikasi-call-center,
  aplikasi-customer-service, chatbot, ticket-creation-integration, wa-blast,
  whatsapp-bulk) adalah redirect dan di luar scope rencana ini.

## 2. Pola halaman saat ini (referensi implementasi)

Sebuah halaman fitur = file HTML tipis + entri di `fitur/features-data.js`:

1. `fitur/<slug>.html` — template: `window.__FEATURE_SLUG__ = "<slug>"`,
   muat `features-data.js`, `feature-page.js`, `script.js`.
2. `fitur/features-data.js` — `window.MOTOVAX_FEATURES[slug]` berisi
   `title, heroTitle, heroDesc, status, module, flag, category, breadcrumbs,
   capabilities[], howItWorks[], benefits[], related[]`.
3. `script.js` — `dealerProductNavigation.suites[].features[].slug` -> target
   link dihitung `f(slug) = ../fitur/<slug>.html` (desktop) dan
   `root + fitur/<slug>.html` (mobile). Satu sumber, otomatis keduanya ter-update.

## 3. Peta sasaran per kartu

### a. CRM (pola benar — TIDAK DIUBAH)
| Kartu | Target saat ini | Aksi |
|---|---|---|
| Lead / Customer List | manajemen-kontak | ✓ sudah benar |
| Pipeline & Customer Journey | manajemen-deal | ✓ sudah benar |
| Analytics | personalisasi-report-sales | ✓ sudah benar |
| Auto Follow Up | automasi-workflow | ✓ sudah benar |

### b. Jasmine AI + Omnichannel (suite: omni-jasmine-ai)
| Kartu | Target saat ini | Rekomendasi target | Aksi |
|---|---|---|---|
| WhatsApp, Instagram & Facebook | omni-jasmine-ai | aplikasi-omnichannel | reuse (isi cocok: inbox multi-channel) |
| Omni analytic | omni-jasmine-ai | omni-analytic | page baru |
| Custom aksi cepat | omni-jasmine-ai | custom-aksi-cepat | page baru |
| 3 funneling & 1 auto routing | omni-jasmine-ai | auto-routing-faneling | page baru |
| AI 500 credit | omni-jasmine-ai | ai-500-credit | page baru (dipakai bersama lintas suite) |

### c. Falcon AI + Inventory (suite: inventory-falcon-ai)
| Kartu | Target saat ini | Rekomendasi target | Aksi |
|---|---|---|---|
| Falcon AI: searching, kirim foto & rekomendasi otomatis | inventory-falcon-ai | falcon-ai-search | page baru |
| Laporan dan aksi sesuai peran | inventory-falcon-ai | inventory-laporan-peran | page baru |
| Item / listing multi cabang | inventory-falcon-ai | inventory-multi-cabang | page baru |
| Import listing via WhatsApp | inventory-falcon-ai | inventory-import-wa | page baru |
| Live katalog API | inventory-falcon-ai | inventory-live-katalog-api | page baru |
| AI 500 credit | inventory-falcon-ai | ai-500-credit | reuse (shared) |

### d. Ana AI Analytics (suite: ana-ai-analytics)
| Kartu | Target saat ini | Rekomendasi target | Aksi |
|---|---|---|---|
| Analitik operasional | ana-ai-analytics | ana-analitik-operasional | page baru |
| Analitik financial | ana-ai-analytics | ana-analitik-financial | page baru |
| Analitik sales performance | ana-ai-analytics | ana-analitik-sales | page baru |
| Additional custom analytic | ana-ai-analytics | ana-custom-analytic | page baru |

### e. Iris AI + Social Media (suite: social-media-sora-ai)
| Kartu | Target saat ini | Rekomendasi target | Aksi |
|---|---|---|---|
| Content studio | social-media-sora-ai | iris-content-studio | page baru |
| Iris AI upscale & background edit | social-media-sora-ai | iris-ai-edit | page baru |
| Publish ke Facebook, Instagram & WhatsApp | social-media-sora-ai | iris-publish | page baru |
| Scheduler | social-media-sora-ai | iris-scheduler | page baru |
| Meta ads manager | social-media-sora-ai | iris-meta-ads | page baru |
| Meta ads analytic by Iris | social-media-sora-ai | iris-meta-ads-analytic | page baru |
| AI 500 credit | social-media-sora-ai | ai-500-credit | reuse (shared) |

**Total halaman baru unik: 19** (18 spesifik + `ai-500-credit` yang dipakai
3 suite). Kartu "WhatsApp, Instagram & Facebook" di-reuse ke
`aplikasi-omnichannel` yang sudah ada.

## 4. Langkah implementasi

1. **Tambah entri `features-data.js`** untuk 19 slug baru (mengikuti pola entri
   yang sudah ada): title, heroTitle, heroDesc, status (Live/roadmap sesuai
   produk), module, flag, category, breadcrumbs, capabilities, howItWorks,
   benefits, related.
2. **Buat 19 file `fitur/<slug>.html`** dari template
   `fitur/manajemen-kontak.html` (ganti `__FEATURE_SLUG__`, meta description,
   canonical). Aktifkan widget demo hanya jika halaman punya demo interaktif
   (omni → `obuka omniDemo`, inventory → `inventoryDemo`, dsb. per pola
   `feature-page.js`).
3. **Perbarui `script.js`** `dealerProductNavigation.suites[].features[].slug`
   untuk 4 suite non-CRM (desktop mega + mobile accordion otomatis ikut).
   Khusus kartu "AI 500 credit" di 3 suite menuju slug `ai-500-credit` yang sama.
4. **Tambahkan 19 halaman baru** ke daftar `fitur/index.html` (Semua Fitur).
5. **Selaraskan copy dengan produk** (`motovax-app`): cek route/sidebar modul
   (management-sidebar, salesperson-sidebar, dll.) agar nama/cakupan/tandai
   roadmap tidak menyesatkan (per AGENTS.md).
6. **Screenshot fitur** sesuai AGENTS.md: state hasil akhir, tanpa sidebar
   aplikasi, rasio konsisten (Omnichannel = 1440x900 16:10), data mengambang
   (anonim), cache-buster baru pada aset/CSS/JS terkait.
7. **Verifikasi responsif + render** dengan Chromium/CDP: desktop 1440x1000,
   tablet 834x1112, mobile 390x844; `img.decode()` + `scrollIntoView()`; tidak
   ada horizontal overflow; `currentSrc` menunjuk versi baru; modal fullscreen
   berfungsi di mobile.
8. **Deploy** `fural-agent repos ship` (Coolify dikonfigurasi di .env org).

## 5. Catatan
- Kredit AI (`ai-500-credit`) bersifat lintas-suite → satu halaman shared yang
  jadi target 3 suite, agar tidak duplikat konten.
- Keputusan reuse vs page baru untuk masing-masing kartu bisa disesuaikan
  manusia; tabel di atas adalah rekomendasi default.
- Belum ada perubahan kode non-plan yang dibuat — rencana ini siap dieksekusi
  sebagai sesi implementasi terpisah.

## 6. Status eksekusi (2026-08-24)

- **Selesai:** 19 halaman baru dibuat (`fitur/*.html`) + 19 entri di
  `features-data.js` + update `slug` di `script.js` (desktop mega + mobile
  accordion) + daftar `fitur/index.html` ditambah + cache-buster aset
  (`-dedicated`) di semua halaman.
- **Reuse:** kartu "WhatsApp, Instagram & Facebook" → `aplikasi-omnichannel`.
- **Verifikasi:** 87 test pass; Playwright render 19 halaman di desktop/tablet/
  mobile tanpa overflow; mega menu menunjuk tiap kartu ke halaman dedicated;
  seluruh file preview gambar yang direferensikan ada.
