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

## Git & deploy

- Commit sebagai identitas member (jangan invent author agent).
- Push ke `main` bila diminta / sesuai alur Fural org; deploy production lewat `fural-agent repos ship` (Coolify bila sudah dikonfigurasi org).
