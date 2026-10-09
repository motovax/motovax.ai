# MOTOVAX Landing Page

Static landing page for `motovax.ai`.

## Local Preview

```bash
python -m http.server 5179
```

Open `http://localhost:5179/`.

- Home: `index.html` (Core Platform + kapabilitas)
- Demo interaktif (arsip): `index-legacy.html`
- Login tenant: `login.html` (+ `login.js`) — autentikasi Google atau username/email, deteksi tenant otomatis, dan handoff SSO langsung ke aplikasi tanpa portal akun perantara
- Onboarding user baru: `onboarding.html` (+ `onboarding.js`) — daftar, profil dealer, modul
- Modul breakdown: `modul.html`
- Product map (markdown): `docs/product/modul-fitur-breakdown.md`

## Deploy

This repository is static HTML/CSS/JS and can be deployed on Vercel, Netlify, GitHub Pages, or any static web server. The production entry point is `index.html`.
