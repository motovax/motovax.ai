# AGENTS.md

Panduan untuk coding agent yang mengerjakan repositori landing **motovax.ai**.

## Ringkasan project

Landing page statis (`index.html`, `modul.html`, `styles.css`, `script.js`) untuk situs publik Motovax. Bukan aplikasi produk penuh.

## Referensi konten fitur & service

Informasi **fitur, service, modul, capability, dan deskripsi produk** yang ditampilkan di motovax.ai (copy landing, menu Produk, kartu fitur, demo, `modul.html`, `docs/product/*`, dsb.) **referensi utamanya diambil dari motovax.app** — yaitu produk aplikasi Motovax / codebase **motovax-app** (route, sidebar, feature flag tenant, backend service, tool agent, behavior produksi).

- **Prioritas #1:** apa yang benar-benar ada atau tercermin di **motovax.app** / **motovax-app**.
- **Tidak menutup kemungkinan** merujuk sumber lain (brief marketing, design.md, task Fural, feedback user, kompetitor sebagai inspirasi UI, dsb.) — selama tidak menyesatkan seolah fitur live di produk jika belum ada.
- Saat menulis atau mengubah klaim fitur: selaraskan nama, cakupan, dan status (live / partial / roadmap) dengan realitas produk di motovax.app bila memungkinkan; tandai roadmap secara eksplisit jika belum live.

### Sumber praktis di monorepo produk

Jika workspace punya clone `motovax-app`, utamakan:

- Frontend: `apps/frontend` (route, sidebar, halaman fitur)
- Backend: `apps/backend` (service, API, flag)
- Docs produk: `docs/` di motovax-app
- Di landing ini: `docs/product/modul-fitur-breakdown.md` sebagai peta ringkas yang sudah diselaraskan ke produksi

## Bahasa & gaya

- Komunikasi agent ke manusia organisasi: **bahasa Indonesia** (kecuali user minta lain).
- Copy UI landing boleh campuran EN/ID sesuai branding yang sudah ada; jangan mengubah tone masif tanpa diminta.

## Responsivitas UI

- Setiap perubahan, terutama perubahan UI, wajib disesuaikan dan diverifikasi pada mode **mobile**, **tablet**, dan **normal/desktop**.
- Jangan menganggap tampilan desktop otomatis aman di layar yang lebih kecil. Periksa minimal navigasi, grid, tipografi, media, tombol/CTA, formulir, tabel, modal/demo interaktif, serta potensi horizontal overflow pada tiap mode.
- Gunakan breakpoint dan pola responsif yang konsisten dengan `styles.css`; pertahankan target sentuh yang layak dan pastikan konten utama tidak terpotong atau saling bertumpuk.

## Screenshot fitur landing

- Screenshot fitur publik **tidak boleh menyertakan menu sidebar aplikasi**. Crop atau atur viewport agar hanya area konten/capability yang relevan yang terlihat, tanpa sidebar di sisi kiri.
- Jangan memakai screenshot umum hanya karena berasal dari modul yang sama. Telusuri route dan alur produksi di `motovax-app`, jalankan interaksi yang diperlukan sampai capability yang dibahas terlihat jelas, lalu capture **state hasil akhirnya**.
- Contoh pola: buka halaman produk → pilih data/conversation yang relevan → jalankan aksi capability → tunggu hasil/state tujuan muncul → baru ambil screenshot. Untuk Faneling Omnichannel, state yang dicapture harus memperlihatkan jejak AI, takeover Agent, dan handoff/bucket MR.
- Screenshot publik wajib memakai data demo atau data yang sudah dianonimkan. Jangan mempublikasikan nama, nomor telepon, pelat, ID unit, credential, atau identitas operasional asli.
- Untuk satu rangkaian fitur pada halaman yang sama, gunakan kanvas dan rasio visual yang konsisten dengan screenshot fitur 01. Acuan halaman Omnichannel saat ini: **1440×900 (16:10)** dan container preview 16:10.
- Kesamaan screenshot tidak cukup dinilai dari atribut HTML `width`/`height` atau rasio file. Bandingkan juga ukuran sumber (`naturalWidth`/`naturalHeight`), ukuran render aktual (`getBoundingClientRect()`), `aspect-ratio`, `object-fit`, framing, dan area capability yang benar-benar terlihat. Baris grid bergantian/reverse wajib menghasilkan lebar dan tinggi image yang sama dengan fitur 01; toleransi selisih render hanya pembulatan subpixel (maksimal **0,1 px**).
- Jangan memotong state penting di dalam capability. Untuk screenshot conversation, minimal pastikan daftar conversation yang relevan, jejak respons AI, takeover Agent, aksi lanjutan/handoff, dan konteks/detail lead yang menjadi outcome tetap terlihat. Jika rasio sumber berbeda, gunakan crop atau letterbox yang terkontrol; jangan merusak proporsi, menggambar ulang UI, atau menyembunyikan informasi penting hanya agar memenuhi rasio.
- Setelah mengganti file dengan nama yang sama, tambahkan cache-buster pada URL image/script/CSS yang terkait agar browser dan CDN tidak menampilkan aset atau layout lama. Pastikan `currentSrc` di production mengarah ke versi baru.
- Deskripsi fitur menjelaskan capability dan outcome, bukan langkah internal yang dilakukan agent untuk menghasilkan screenshot, kecuali manusia secara eksplisit meminta tutorial tersebut ditampilkan.
- Aksi **Buka ukuran penuh** harus memakai modal image viewer di halaman yang sama, bukan membuka file gambar di tab baru. Modal wajib responsif, dapat ditutup dengan tombol, backdrop, dan `Escape`, serta mengunci scroll halaman saat terbuka.
- Verifikasi minimal desktop, tablet, dan mobile: screenshot berbeda sesuai capability, ukuran container konsisten, tidak ada horizontal overflow, dan modal ukuran penuh tetap dapat dibaca/di-scroll.

### Verifikasi screenshot dengan Chromium DevTools

- Verifikasi perubahan image dengan browser Chromium/Chrome yang benar-benar merender halaman, melalui Chrome DevTools atau Chrome DevTools Protocol (CDP). Pemeriksaan source/CSS saja tidak dianggap cukup.
- Gunakan minimal viewport **desktop 1440×1000**, **tablet 834×1112**, dan **mobile 390×844**. Matikan cache (`Network.setCacheDisabled`) atau gunakan URL verifikasi/cache-buster saat memeriksa hasil terbaru.
- Sebelum mengukur atau mengambil screenshot, tunggu halaman dan image selesai, jalankan `await img.decode()`, lalu `scrollIntoView()` ke fitur target. Capture offscreen tanpa scroll dapat menghasilkan screenshot kosong walaupun `naturalWidth` sudah terisi.
- Pada setiap viewport, catat untuk fitur 01 dan semua fitur pembanding:
  - `img.naturalWidth` dan `img.naturalHeight`;
  - `getBoundingClientRect()` untuk container image dan elemen `img`;
  - hasil `getComputedStyle()` untuk `aspectRatio` dan `objectFit`;
  - `img.currentSrc` untuk memastikan cache-buster/aset production benar;
  - `document.documentElement.scrollWidth <= document.documentElement.clientWidth` untuk memastikan tidak ada horizontal overflow.
- Jangan hanya membandingkan hasil fitur ganjil. Baris `.reverse`/fitur genap harus diukur terpisah karena urutan grid dapat menempatkan image di kolom yang lebih sempit walaupun CSS image-nya sama.
- Ambil dan inspeksi screenshot visual setelah scroll nyata pada desktop, tablet, dan mobile. Pastikan tidak ada crop yang menghilangkan state capability, whitespace/framing tetap masuk akal, teks penting terbaca, serta tidak ada sidebar aplikasi atau data operasional asli.
- Uji modal **Buka ukuran penuh** setidaknya di mobile: image memakai source yang benar, area modal bisa di-scroll, body terkunci saat modal terbuka, dan tombol tutup, backdrop, serta `Escape` mengembalikan scroll halaman.
- Setelah deploy, ulangi pengukuran terhadap URL production (bukan hanya localhost). Untuk penggantian aset, bandingkan hash file production dengan file lokal bila memungkinkan, lalu simpan ringkasan ukuran render per viewport di laporan task.

## Git & deploy

- Commit sebagai identitas member (jangan invent author agent).
- Push ke `main` bila diminta / sesuai alur Fural org; deploy production lewat `fural-agent repos ship` (Coolify bila sudah dikonfigurasi org).
