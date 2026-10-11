# Blueprint Revamp Motovax.ai: AI Dashboard Omnichannel & Prompt Konsultasi ChatGPT

Dokumen ini berisi analisis keselarasan fitur antara **motovax-app**, portal produksi **mobix.motovax.com**, dan landing page publik **motovax.ai** (termasuk `presentation.html`), serta paket prompt dan referensi komprehensif untuk dikonsultasikan ke **ChatGPT (chatgpt.com)** agar menghasilkan rekomendasi UI/UX kelas dunia.

---

## 1. Analisis Kesenjangan: Apa yang "Miss" Saat Ini?

### 1.1 Masalah di Landing Page (`index.html`) Saat Ini
- **Terlalu berfokus pada WhatsApp & Mobile Chat Mockup**: Hero section saat ini menampilkan frame smartphone dengan chat WhatsApp. Pengunjung pertama kali mengira Motovax hanya "chatbot WhatsApp" atau "CRM chat biasa".
- **Omnichannel Dashboard Tidak Menjadi Panggung Utama**: Padahal kekuatan terbesar Motovax di produksi (`motovax-app` / `mobix.motovax.com`) adalah **Web Workspace Omnichannel Call Center** lengkap dengan multi-channel inbox (WhatsApp, Instagram DM, Facebook Messenger, TikTok, In-App), realtime SSE, panel antrian lead, dan panel konteks lead.
- **Fitur "Human Takeover" Tidak Terlihat di Atas Lipatan (Above the fold)**: Padahal di aplikasi live, tombol dan status **Takeover** ("Ambil Alih dari AI", "Lepas Takeover ke AI", "Handoff ke MR") adalah workflow utama operator call center dealer.
- **Kekuatan Falcon (MIS & Knowledge Management) Belum Terefleksikan**: Falcon di landing hanya disebut "jawab stok & harga", padahal di backend dan workspace, Falcon adalah **AI Copilot** yang bisa melakukan query database natural language (`whatsapp_query_data`), laporan inventori lintas cabang, simulasi kredit, proposal diskon, dan knowledge lookup.

### 1.2 Masalah di Deck Presentasi (`presentation.html`) Saat Ini
- **Slide 1 - 3 Terlalu Abstrak**: Menampilkan narasi generik "Ubah chat jadi penjualan" dan "Satu data, satu tim".
- **Omnichannel Baru Muncul di Slide 6**: Konsep Omnichannel tertimbun di slide tengah setelah Inventori dan Agen AI terpisah.
- **Padahal Pitch yang Menjual ke Dealer**: Dealer mobil butuh solusi yang langsung dipahami dalam 10 detik pertama:
  > *"Motovax adalah Omnichannel Customer Conversation Platform (respond.io versi Indonesia untuk otomotif) yang dipersenjatai Agen AI otonom untuk merespons 24/7 di seluruh kanal (WhatsApp, IG, Messenger, Web/In-app), dilengkapi kendali Takeover manusia, serta AI Falcon yang terhubung langsung ke MIS/Database dan Knowledge Management dealer."*

---

## 2. Pemetaan Fitur Produk Riil (motovax-app & mobix.motovax.com)

Hasil audit langsung pada codebase `motovax-app` dan tenant aktif `mobix.motovax.com`:

| Komponen Produk | Implementasi Nyata di Produk (`motovax-app`) | Refleksi Ideal di Landing Page / Deck |
|---|---|---|
| **Multi-Channel Ingestion** | Meta Cloud API (WhatsApp), IG Direct DM, FB Messenger, TikTok integration, serta **Falcon External Stream API / SSE** (`/api/falcon/external/stream`) untuk chat in-app / web widget. | *"Deploy AI Agent di seluruh channel komunikasi & marketing (WhatsApp, Instagram, FB, TikTok, in-app web)."* |
| **Workspace Call Center** | 3-Column layout (`LeadQueuePanel`, `ConversationPanel`, `LeadContextPanel`) dengan SSE realtime updates. | Visual hero utama: Desktop workspace dashboard interaktif (bukan sekadar HP). |
| **Mekanisme Takeover** | Status: `none` (AI Jasmine aktif), `claimed` (operator manusia ambil alih), `pending` (menunggu respon). Tombol: *Ambil Alih Percakapan*, *Lepas Takeover ke AI*, *Handoff ke MR*. | Visual badge status jelas: `[🤖 Jasmine Aktif]` ↔ `[👤 Operator Takeover]` ↔ `[🚀 Handoff ke Sales]`. |
| **Falcon Engine (MIS & KM)** | Tool native: `query_data` (natural language ke SQL/database), `inventory_report` (laporan stok/aging cabang), `finance_simulation` (kalkulator kredit), `draft_discount_proposal`, dan knowledge search. Di inbox ada panel samping `FalconAssistantPanel`. | Ditampilkan sebagai **The Secret Weapon**: Copilot cerdas yang menghubungkan chat dengan data bisnis dan SOP dealer secara real-time. |
| **Multi-Agent Ecosystem** | - **Jasmine**: Frontline AI 24/7 di semua channel.<br>- **Falcon**: Internal copilot & MIS/Knowledge engine.<br>- **Fino**: Finance specialist (kredit, DP, tenor, MRP).<br>- **Iris**: Creative studio (content generator, auto plate blur, ads).<br>- **Ana**: Business analytics & financial trend report. | Persona spesialis yang bekerja harmonis di belakang satu dashboard. |

---

## 3. Daftar URL & Benchmark Referensi untuk Konsultasi

Berikan URL referensi berikut kepada ChatGPT saat berdiskusi agar model memahami standar visual dan arsitektur yang diinginkan:

1. **Respond.io (Benchmark Utama Omnichannel Platform)**:
   - Homepage: `https://respond.io/` (Perhatikan hero section dengan screenshot dashboard omnichannel interaktif, pills channel WhatsApp/IG/Messenger, dan copy "AI Customer Conversation Platform").
   - AI Agent Feature: `https://respond.io/features/ai-agent` (Arsitektur bot setup, knowledge source, dan takeover).
   - Omnichannel Inbox: `https://respond.io/features/omnichannel-inbox` (Workspace kolaboratif, routing, dan collision detection).
2. **Intercom Fin AI Copilot**:
   - `https://www.intercom.com/fin` (Inspirasi panel copilot di sisi kanan inbox yang membantu operator membuat draft balasan cerdas).
3. **Linear.app & Attio CRM**:
   - `https://linear.app/` dan `https://attio.com/` (Inspirasi dark/light modern UI, bento-grid card, micro-interactions, badge status bercahaya).

---

## 4. Paket Prompt Siap Pakai untuk ChatGPT (chatgpt.com)

Salin prompt di bawah ini langsung ke ChatGPT. Prompt disusun dengan metode **Chain-of-Density & Role Prompting** agar ChatGPT memberikan respon terperinci, presisi, dan siap diimplementasikan.

### Prompt 1: Rombak Hero & Landing Page `motovax.ai` (Master UI/UX & Copy Prompt)

```markdown
Role: Anda adalah Principal Product Designer & B2B SaaS Growth Copywriter kelas dunia dengan pengalaman mendesain landing page untuk produk seperti respond.io, Intercom, Attio, dan Linear.

Konteks Proyek:
Kami sedang merombak landing page motovax.ai.
Motovax adalah "Respond.io versi Indonesia khusus dealer mobil dan penjualan bernilai tinggi (high-involvement sales)", dengan keunggulan utama:
1. AI Dashboard Omnichannel: Satu inbox terpadu untuk WhatsApp (Meta API & QR), Instagram Direct, Facebook Messenger, TikTok, dan In-App/Web Chat Widget.
2. Deployable AI Agent: AI agent dapat dideploy di seluruh channel komunikasi dan marketing (termasuk Click-to-WhatsApp Ads dan in-app).
3. AI Agent Multi-Fungsi: Bukan sekadar bot FAQ! AI kami bisa cek stok unit live per cabang, hitung simulasi kredit, membuat draft diskon, mendeteksi & memburamkan plat nomor mobil, serta routing lead.
4. Human Takeover yang Mulus: Operator manusia dapat mengambil alih (takeover) percakapan dari AI dengan 1-klik, atau mengembalikan percakapan ke AI kapan saja.
5. Kekuatan Utama "Falcon Engine" (MIS & Knowledge Management): Motovax terhubung langsung ke database/MIS (bisa query inventori, aging stok, laporan performa via natural language) dan Knowledge Base internal dealer.

Masalah Saat Ini di motovax.ai:
Landing page kami saat ini terlalu berfokus pada WhatsApp mobile mockup (seperti sekadar bot WA murah), sehingga calon klien tidak menyadari bahwa Motovax adalah platform Omnichannel Dashboard lengkap ala respond.io dengan dashboard desktop modern, panel takeover, dan AI copilot.

Tugas Anda:
1. Buat konsep Hero Section baru yang memukau (Above-the-fold):
   - Headline & Subheadline yang tegas, modern, dan langsung memposisikan Motovax sebagai AI Omnichannel Dashboard untuk dealer mobil Indonesia.
   - Micro-copy & Trust badges.
   - CTA utama (Jadwalkan Demo & Coba Live Interactive Sandbox).
2. Wireframe Visual & Komposisi Hero Graphic (Desktop Workspace 3-Pane Preview ala respond.io):
   - Jelaskan tata letak 3 kolom: 
     * Kolom 1 (Kiri): Inbox & Kanal (Pills WA, IG, FB, TikTok, In-App, filter status lead HOT/WARM, indikator unread).
     * Kolom 2 (Tengah): Percakapan Live (Balasan AI Jasmine, Typing indicator, Banner status "Ambil Alih dari AI / Takeover", dan pesan operator).
     * Kolom 3 (Kanan): Lead Context & Falcon AI Copilot (Detail unit mobil Honda CR-V 2022, simulasi DP/kredit, dan Falcon Panel yang menyarankan jawaban berbasis database stok/MIS).
3. Struktur Informasi Halaman (Bento Grid Section setelah Hero):
   - Pillar 1: Omnichannel Inbox & Multi-Channel Deployment (WA, IG, Messenger, In-App).
   - Pillar 2: Falcon AI Engine (Kekuatan MIS & Knowledge Management).
   - Pillar 3: Human-in-the-loop: Seamless Takeover & Field Sales Handoff (MR).
   - Pillar 4: Autonomous Automotive Agents (Jasmine CS, Falcon MIS, Fino Finance, Iris Content/Ads, Ana Analytics).
   - Pillar 5: Real-time Analytics & Deal Pipeline.
4. Berikan output dalam bentuk:
   - Rekomendasi copy bahasa Indonesia yang tajam dan profesional.
   - ASCII Wireframe atau deskripsi detail UI components.
   - Token desain (warna, tipografi, efek glassmorphism/shadow) yang cocok untuk B2B tech modern.
```

---

### Prompt 2: Rombak 12 Slide Deck Presentasi (`presentation.html`)

```markdown
Role: Anda adalah Chief Marketing Officer dan Enterprise Pitch Deck Strategist untuk B2B SaaS.

Konteks:
Kami memiliki presentasi web interaktif (12 slide, format 16:9, responsive HTML/PDF) di https://motovax.ai/presentation.html.
Saat ini deck tersebut urutannya kurang greget: topik Omnichannel baru dibahas di Slide 6, dan Falcon MIS/Knowledge engine tidak ditonjolkan.

Tujuan:
Rombak narasi 12 slide agar dari Slide 1 audiens (pemilik dealer, GM, Head of Sales/Marketing) langsung paham bahwa Motovax adalah:
"AI Dashboard Omnichannel Terpadu (respond.io Indonesia) yang mengintegrasikan percakapan customer, inventori mobil, simulasi leasing, dan MIS Back-Office lewat AI Agents."

Tolong susun ulang outline 12 Slide dengan detail berikut untuk setiap slide:
- Slide No & Judul Slide (Punchy & Action-oriented)
- Eyebrow (Kategori slide)
- Headline Utama & Lead Paragraph
- 3 Card Poin / Split Layout Content (Data points, visual layout, feature highlights)
- Elemen Visual yang Harus Ditampilkan (mockup dashboard, flow takeover, query Falcon, dsb.)
- Key Takeaway untuk Audiens Dealer

Struktur 12 Slide yang Direkomendasikan:
1. Cover: AI Omnichannel Dashboard untuk Dealer Mobil Modern (One Inbox. Multi-Agent AI. Every Lead Connected).
2. Masalah Nyata: Fragmentasi Percakapan (WA pribadi sales tercecer, IG/FB lambat dibalas, stok cabang tidak sinkron).
3. Solusi Motovax: The Indonesian Respond.io with Automotive AI Power (Satu inbox, multi-kanal, multi-agen).
4. Kanal & Deployment: Hadir di Semua Touchpoint (WhatsApp Business API & Web, Instagram DM, FB Messenger, TikTok, In-App Widget).
5. Kolaborasi Manusia & AI: Human Takeover & Handoff (AI menangani 24/7, operator takeover dalam 1 detik, handoff ke sales lapangan/MR).
6. Superpower Falcon: MIS & Knowledge Management AI (Bisa tanya database stok, aging unit, laporan profit, dan SOP via natural language).
7. Agen Spesialis Otomotif: Jasmine (Frontline CS), Fino (Kalkulator Kredit & Leasing), Iris (Kreator Konten & Plat Nomor), Ana (Analitik).
8. Live Inventory & Multi-Cabang: Hubungkan stok showroom fisik langsung ke chat customer.
9. Pipeline CRM & Lead Tracking: Dari chat pertama, test drive, SPK, hingga serah terima unit (Handover).
10. Dashboard & Analytics: SLA respons, leaderboard sales, rasio closing per kanal iklan.
11. Arsitektur & Keamanan Enterprise: Role-based access (RBAC), multi-tenant, compliance Meta.
12. Closing & CTA: Jadwalkan Demo Langsung / Coba Workspace.
```

---

### Prompt 3: Spesifikasi Komponen Interaktif "Omnichannel Preview" (Interactive Demo Code)

```markdown
Role: Anda adalah Senior Frontend Architect spesialis Tailwind CSS dan Modern Vanilla JavaScript.

Konteks:
Kami ingin menambahkan komponen interaktif di landing page motovax.ai (menggantikan atau meningkatkan hero demo yang ada) yang mensimulasikan "AI Omnichannel Dashboard" mirip interaktivitas di respond.io.

Fitur Interaktif yang Harus Bisa Dimainkan Pengunjung:
1. Switch Kanal: Pengunjung bisa klik tab kanal (WhatsApp, Instagram, Messenger, In-App) dan melihat pesan serta format percakapan berubah sesuai kanal.
2. Live AI Reply: Pengunjung bisa klik skenario pertanyaan ("Tanya Stok Brio", "Simulasi Kredit CR-V", "Cek Cabang"). Pesan pengunjung muncul, disusul indikator "Jasmine AI sedang mengetik...", lalu balasan AI muncul dengan unit mobil / angka simulasi kredit.
3. Tombol "Ambil Alih (Takeover)":
   - Ketika diklik, status berubah dari [🤖 AI Aktif] menjadi [👤 Operator Mengambil Alih].
   - Composer chat terbuka dan pengunjung bisa mengetik pesan sebagai agen manusia.
   - Ada opsi "Kembalikan ke AI".
4. Panel Kanan Interaktif (Falcon Assistant):
   - Tab "Info Unit" (foto mobil, harga, cabang).
   - Tab "Falcon Copilot" (Pengunjung bisa klik "Tanya Stok Alternatif" -> Falcon memberikan rekomendasi -> tombol "Salin ke Chat").

Tolong buatkan:
1. Markup HTML semantik yang bersih.
2. CSS murni yang modern (Glassmorphism, clean borders, badges, responsive di Desktop 1440px, Tablet 834px, dan Mobile 390px).
3. JavaScript modular tanpa dependensi framework (Vanilla JS) dengan state management sederhana untuk mengontrol pergantian tab, simulasi pesan, dan status takeover.
```

---

## 5. Rangkuman Langkah Implementasi Selanjutnya

1. **Konsultasi dengan ChatGPT**: Gunakan paket prompt di atas di `chatgpt.com`.
2. **Evaluasi Output Desain**: Pilih variasi copy dan layout dashboard preview terbaik dari ChatGPT.
3. **Penyelarasan Kode Lokal**:
   - Terapkan struktur hero baru pada `index.html`.
   - Update `presentation.html` ke alur 12 slide baru.
   - Update stylesheet di `styles.css` / `styles-alt.css` dan interaktivitas demo di `script.js`.
4. **Verifikasi Responsif & Visual**:
   - Jalankan verifikasi di Desktop (1440×1000), Tablet (834×1112), dan Mobile (390×844) sesuai protokol `AGENTS.md`.
5. **Deploy & Ship**: Gunakan alur organisasi via `fural-agent repos ship`.
