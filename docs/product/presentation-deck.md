# Deck presentasi Motovax

- Versi web: `/presentation.html`.
- PDF: `/assets/presentation/motovax-presentation-2026-09.pdf`.
- 12 slide, 16:9 (1280 × 720 CSS px / 960 × 540 PDF points), teks dapat diseleksi dan tautan demo aktif.
- Bahasa Indonesia dan konteks dealer mobil; tanpa data customer, screenshot operasional, atau klaim ROI numerik.

## Sumber konten

Narasi dari `index.html` dan landing production pada 14 September 2026. Cakupan produk mengacu pada `docs/product/modul-fitur-breakdown.md`, serta route dalam `motovax-app/apps/frontend/src/App.tsx` (inventori, call center, CRM, social media). Modul bersyarat aktivasi tenant dan fitur partial/roadmap diberi label. Roadmap bukan komitmen jadwal rilis.

## Ekspor ulang

Edit `presentation.html`, lalu jalankan `node scripts/export-presentation.mjs` setelah dependensi npm dan Chromium Playwright tersedia. Untuk Chromium sistem gunakan `CHROMIUM_PATH=/usr/bin/chromium node scripts/export-presentation.mjs`.

Script memeriksa 12 slide pada desktop 1440×1000, tablet 834×1112, mobile 390×844 dan media print sebelum menulis PDF. Screenshot serta laporan JSON disimpan di `/tmp/motovax-deck-*`. Tidak diperlukan perubahan pada server atau Dockerfile karena HTML root dan direktori assets sudah ikut deployment.

Verifikasi production tanpa menimpa PDF lokal:

```sh
PRESENTATION_URL=https://motovax.ai/presentation.html CHROMIUM_PATH=/usr/bin/chromium node scripts/export-presentation.mjs
```

## Hasil verifikasi lokal

Semua 12 slide lolos pemeriksaan overflow pada ketiga viewport dan media print. PDF terbaca sebagai 12 halaman dengan ukuran seragam 960×540 points; setiap halaman memiliki teks. Cover PDF serta screenshot desktop, tablet, mobile, dan ikhtisar semua slide telah diperiksa visual.
