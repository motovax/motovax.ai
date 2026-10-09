## Redesign AI Dashboard Omnichannel Motovax

Landing mengikuti urutan: navbar floating, hero + dashboard demo, strip kanal, revenue,
use case dealer, tim AI, tab platform, studi kasus Mobix, CTA, footer.
65 halaman publik memakai template statis `shared/chrome.mjs`, token/theme
`shared/design.css`, dan interaksi `shared/public.js`. Generator fitur/solusi menyinkronkan
header/footer otomatis. CTA onboarding, login, WhatsApp tetap menggunakan tujuan resmi.

## Validasi lokal

- 95 tes regresi lolos (`node --test tests/*.test.mjs`), termasuk autentikasi tenant,
  CTA harga, handoff sesi portal legacy, mobile navigation, keyboard tab dan modal.
- 195 pemeriksaan layout Chromium/CDP: 65 halaman × desktop 1440×1000,
  tablet 834×1112, mobile 390×844. Tidak ada horizontal overflow atau image rusak.
- Cache dinonaktifkan. Image di-decode dan di-scroll sebelum capture/ukur.
- Modal mobile: tombol tutup, backdrop, Escape, scroll lock, dan pengembalian fokus lolos.
- Tab preview berbeda sesuai capability. Tanpa sidebar aplikasi. Data demo/anonymized.
- Semua baris Omnichannel termasuk `.reverse` memiliki container dan ukuran render sama
  (selisih 0 px). Proporsi gambar dipertahankan dengan `object-fit: contain`.

| Viewport | Preview landing, semua tab | Image landing | Container fitur Omni 01–05 | Image fitur Omni |
| --- | --- | --- | --- | --- |
| Desktop | 1200 × 750 | 1198 × 748 | 480 × 300 | 480 × 300 |
| Tablet | 786 × 491,25 | 784 × 489,25 | 733,96875 × 458,71875 | 733,96875 × 458,71875 |
| Mobile | 358 × 223,75 | 356 × 221,75 | 320 × 200 | 320 × 200 |

Sumber preview landing: Omni 1200×750, CRM 1200×549, Falcon 1200×750,
Ana 1200×750. CRM diberi letterbox di kanvas 16:10 agar konten tidak terpotong.
Detail `naturalWidth`, `naturalHeight`, rect container/image, `aspectRatio`, `objectFit`,
`currentSrc`, dan hasil overflow ada di `measurements.json`.

## Copy dan batas klaim

Rujukan: `docs/product/modul-fitur-breakdown.md` serta route/backend/frontend di
clone `motovax-app`, khususnya omnichannel, TikTok integration, inventory, dan CRM.
Inbox utama dijelaskan sebagai WA/IG/Messenger. Kanal tambahan mengikuti layanan,
konfigurasi, dan integrasi tenant. Meta, Google Sheets import, inventory, simulasi
kredit, dan Developer API dijelaskan sesuai cakupannya; TikTok Ads dan integrasi leasing
universal tidak diklaim live. Tidak ada janji respons 3 detik tanpa data pendukung.
Fino dijelaskan sebagai peran simulasi kredit melalui tool AI.

Data/metric Mobix sudah diminta kepada manusia. Halaman menyatakan metric belum
dipublikasikan dan rincian klien menunggu konfirmasi, tanpa mengarang hasil/lokasi/kanal.
File referensi `Motovax Landing.dc.html` tidak ditemukan di workspace; implementasi
menggunakan spesifikasi visual dan struktur pada body task.

## Production

motovax.ai menggunakan GitHub Pages (`main`, root), bukan app Coolify default organisasi.
Build Pages untuk commit `2a7742a` berhasil. Target Coolify default `mtvx-app` ternyata
repo produk utama; deploy awal terpicu ke target default tersebut. Aplikasi yang memakai
repo landing adalah `motovax-onboarding` (`onboard.motovax.com`); deploy lanjutan
diarahkan dengan override `COOLIFY_APP_UUID` per invocation, tanpa mengubah konfigurasi
organisasi bersama. Dockerfile disesuaikan agar folder `shared/` ikut tersedia.

Pemeriksaan production dilakukan setelah deployment. Detail disimpan terpisah pada
`production-measurements.json` agar hasil lokal dan live bisa dibandingkan.
