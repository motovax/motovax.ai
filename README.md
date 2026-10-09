# MOTOVAX Landing Page

Static landing page for `motovax.ai`.

## Local Preview

```bash
python -m http.server 5179
```

Open `http://localhost:5179/`.

- Home: `index.html` (AI Dashboard Omnichannel untuk dealer mobil)
- Demo interaktif (arsip): `index-legacy.html`
- Login tenant: `login.html` (+ `login.js`) — autentikasi Google atau username/email, deteksi tenant otomatis, dan handoff SSO langsung ke aplikasi tanpa portal akun perantara
- Onboarding user baru: `onboarding.html` (+ `onboarding.js`) — daftar, profil dealer, modul
- Modul breakdown: `modul.html`
- Product map (markdown): `docs/product/modul-fitur-breakdown.md`

## Deploy

This repository is static HTML/CSS/JS and can be deployed on Vercel, Netlify, GitHub Pages, or any static web server. The production entry point is `index.html`.

## Desain publik bersama

`shared/chrome.mjs` adalah sumber header/footer statis (tetap terbaca tanpa JavaScript).
`shared/design.css` memuat token, tema publik, dan layout landing; `shared/public.js`
menangani navigasi mobile, tab preview, modal, serta kompatibilitas handoff sesi lama di beranda.
Setelah mengubah template, jalankan `node scripts/sync-public-design.mjs`.
Generator fitur/solusi juga menyinkronkan template otomatis.

Verifikasi: `npm test` dan `node scripts/verify-public-design.mjs`.
Pemeriksaan Chromium/CDP mencakup 65 halaman × tiga viewport, cache disabled,
preview yang sudah di-decode, kesamaan ukuran baris reverse, tab dan modal mobile.
Gunakan `VERIFY_URL=https://motovax.ai` untuk production, atau `VERIFY_FILES=index.html,harga.html`
untuk pemeriksaan terarah. Hasil disimpan di `docs/verification/`.
