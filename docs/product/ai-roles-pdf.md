## PDF ilustrasi tiga peran AI

Task: `bsckdformnjggtuxdlukcctb` — mengadaptasi hero AI Sales & CRM pada lampiran menjadi PDF dengan contoh AI menjawab sebagai sales, customer service, dan tim internal dealer mobil.

- Halaman unduh: `/ai-roles.html`.
- PDF: `/assets/ai-roles/motovax-ai-tiga-peran.pdf` (4 halaman landscape, 1280 × 800 CSS px / 960 × 600 pt).
- Ilustrasi: `/assets/ai-roles/ilustrasi-tiga-peran-ai.png`, dibuat dengan image generation untuk materi ini.
- Semua percakapan, unit, harga, cabang, jam operasional, dan angka stok adalah data demo. Mockup percakapan merupakan ilustrasi editorial, bukan screenshot produksi.

## Acuan capability

Mengikuti `docs/product/modul-fitur-breakdown.md`, terutama M1–M3. Acuan codebase produk yang diperiksa:

- `motovax-app/apps/backend/whatsapp/falcon_router.go`: query, inventory report, handoff admin/call center, akses tool berdasarkan domain.
- `motovax-app/apps/backend/whatsapp/eval_scenarios_jasmine_showroom_location.sql`: respons informasi cabang berdasarkan konteks dan data tersedia.
- Demo tiga mode hero di `script.js` sebagai acuan presentasi, dengan percakapan baru yang tidak memuat identitas operasional asli.

## Regenerasi dan pemeriksaan

Jalankan `node scripts/export-ai-roles.mjs`. Bila Chromium bawaan Playwright tidak cocok dengan runtime, gunakan `CHROMIUM_PATH=/usr/bin/chromium node scripts/export-ai-roles.mjs`.

Script memeriksa empat halaman pada desktop 1440×1000, tablet 834×1112, dan mobile 390×844 menggunakan Chromium/CDP dengan cache dinonaktifkan. Semua viewport lulus: tidak ada overflow horizontal, konten tidak bertabrakan dengan footer, dan gambar berhasil decode. Bukti gambar per halaman dan JSON disimpan di `/tmp/motovax-ai-roles/`.

Ukuran sumber ilustrasi 1536×1024 dengan `object-fit: contain`; proporsi dipertahankan. Keempat halaman PDF juga dirender dengan PyMuPDF dan diinspeksi visual; jumlah halaman tepat empat, teks dapat diseleksi, dan percakapan serta footer tidak terpotong.

Verifikasi production: `AI_ROLES_URL=https://motovax.ai/ai-roles.html AI_ROLES_EVIDENCE=/tmp/motovax-ai-roles-production CHROMIUM_PATH=/usr/bin/chromium node scripts/export-ai-roles.mjs`. Mode URL hanya memeriksa, tidak menimpa PDF lokal.
