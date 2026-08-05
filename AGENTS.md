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
- Deskripsi fitur menjelaskan capability dan outcome, bukan langkah internal yang dilakukan agent untuk menghasilkan screenshot, kecuali manusia secara eksplisit meminta tutorial tersebut ditampilkan.
- Aksi **Buka ukuran penuh** harus memakai modal image viewer di halaman yang sama, bukan membuka file gambar di tab baru. Modal wajib responsif, dapat ditutup dengan tombol, backdrop, dan `Escape`, serta mengunci scroll halaman saat terbuka.
- Verifikasi minimal desktop, tablet, dan mobile: screenshot berbeda sesuai capability, ukuran container konsisten, tidak ada horizontal overflow, dan modal ukuran penuh tetap dapat dibaca/di-scroll.

## Git & deploy

- Commit sebagai identitas member (jangan invent author agent).
- Push ke `main` bila diminta / sesuai alur Fural org; deploy production lewat `fural-agent repos ship` (Coolify bila sudah dikonfigurasi org).
