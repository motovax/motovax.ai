# Plan Demo Solusi AI Omnichannel

**Repo target:** `motovax.ai` (landing static + product demos)  
**Referensi produk:** Call Center produksi di `motovax-app`  
- URL: `https://mobix.motovax.com/call-center`  
- Kode: `apps/frontend/src/pages/call-center/*`  
- Desain: `motovax-app/docs/handoff-call-center-design.md`  
**UI MR (referensi):** `apps/frontend/src/pages/sales/percakapan/MRConversationView.tsx`  
**Status dokumen:** plan (belum implementasi) · 2026-07-31

---

## 1. Tujuan demo

Menyajikan **demo interaktif AI Omnichannel** di landing `motovax.ai` yang:

1. **Terlihat dan terasa sama** dengan UI Call Center produksi (layout 3 kolom dense).
2. **Menampilkan fitur inti** Call Center yang relevan untuk pitch sales (faneling/bucket, pipeline, riwayat, aksi cepat, handoff AI ↔ Call Center ↔ MR).
3. **Menjelaskan peran UI MR** (bukan mengganti Call Center, melainkan workspace sales/MR setelah handoff).
4. Tetap **aman untuk demo publik**: data mock/simulasi, tanpa API produksi customer.

---

## 2. Baseline saat ini (gap analysis)

### 2.1 Demo sekarang (`#omniDemo` di `index.html` + `OmnichannelAIDemo` di `script.js`)

| Area | Kondisi sekarang |
|------|------------------|
| Layout | 2+ panel (inbox + chat + trace eval), **bukan** 3 kolom Call Center |
| Navigasi kiri | Sidebar “AI Test Lab” (Falcon AI, Quality Eval, Security) — **bukan** shell Call Center |
| Inbox | Filter channel saja (Semua / WA / IG / FB) |
| Faneling / bucket | **Tidak ada** (Saya Handle / AI / Semua; group Ditangani AI / Call Center / MR) |
| Panel kanan context | **Tidak ada** (Detail Lead + Riwayat) |
| Pipeline COLD→WARM→HOT→BOOK | **Tidak ada** di demo omni (ada di demo CRM terpisah) |
| Riwayat lead / audit | **Tidak ada** di demo omni |
| Aksi Cepat | **Tidak ada** chips Simulasi Kredit / Cek Inventori / Tanya Falcon |
| Takeover | Tombol “Ambil alih” sederhana |
| Handoff ke MR | **Tidak ada** |
| Fokus demo | AI Trace, guardrail, scenario prompts (nilai agentic) |
| UI MR | **Tidak ada** info/panel/tour |

### 2.2 Call Center produksi (sumber kebenaran UI)

Layout 3 kolom full-screen:

```
HEADER: MotoVax Call Center · Omnichannel
┌─────────────────┬──────────────────────────┬────────────────────┐
│ LeadQueuePanel  │ ConversationPanel        │ LeadContextPanel   │
│ search + filter │ header + Handoff         │ tab Detail/Riwayat │
│ tab faneling    │ banner status AI/agent   │ status, kontak, MR │
│ channel WA/FB/IG│ bubbles                  │ unit, pipeline     │
│ bucket groups   │ AKSI CEPAT chips         │ catatan, riwayat   │
│ conversation row│ composer                 │                    │
└─────────────────┴──────────────────────────┴────────────────────┘
```

**Faneling (bucket)** — tab utama + grouping:

| Tab / group | Makna |
|-------------|--------|
| **Saya Handle** | Percakapan yang diklaim agent login |
| **AI** | Ditangani AI (Falcon/Jasmine) |
| **Semua** | Gabungan, dikelompokkan |
| Group: **Ditangani AI** | Pure AI / released ke AI |
| Group: **Menunggu Agent** / pending | Perlu claim |
| Group: **MR Belum Respons / Belum Balas** | Sudah di-assign MR, belum balas |
| Group per agent | Nama agent / “(Saya)” |
| Sub-tab channel | Semua · WA · FB · IG |

**Aksi Cepat (produksi):** Simulasi Kredit · Cek Inventori · Tanya Falcon (+ dialog terkait).

**Aksi header chat:** Takeover / kembalikan ke AI · Handoff ke MR · Close lead · Escalate.

**Panel kanan:** Lead Status, Kontak, MR yang menangani, Unit & kunjungan, Unit spesifik, **PipelineSteps** (COLD→WARM→HOT→BOOK), Catatan, tab **Riwayat** (timeline event + chat).

**UI MR terpisah:** `MRConversationView` di sales/percakapan — MR membalas lead yang di-handoff, reuse beberapa komponen Call Center (InventorySheet, CreditSimulation, LeadContextPanel).

---

## 3. Prinsip desain demo

1. **Parity visual dulu, parity perilaku selektif** — samakan layout/copy/chip; interaksi cukup simulasi (tanpa backend).
2. **Pertahankan nilai “AI Test Lab”** — panel trace/eval boleh tetap, dipindah ke tab/mode sekunder agar tidak mengorbankan kemiripan Call Center.
3. **Static-first** — tetap pure HTML/CSS/JS di `motovax.ai`; data mock di `script.js`.
4. **Dense operator UI** — mirip production: font kecil, padding rapat, warna semantik (Cold/Warm/Hot/Booking, channel WA/FB/IG, eskalasi/pending/MR).
5. **Bahasa UI Indonesia.**

---

## 4. Scope fitur demo (acceptance)

### Wajib (sesuai requirement human)

| # | Requirement | Acceptance di demo |
|---|-------------|-------------------|
| 1 | UI samakan Call Center | Header Call Center + 3 kolom + densitas mirip handoff design |
| 2 | Fitur sama & berjalan | Fitur di tabel di bawah **simulasi interaktif** (klik → state berubah / dialog mock) |
| 3 | Faneling (AI / Call Center / MR) | Tab + group bucket; filter mengubah daftar mock |
| 4 | Riwayat di demo | Tab Riwayat di panel kanan; timeline mock |
| 5 | Pipeline | `PipelineSteps` COLD→WARM→HOT→BOOK di panel Detail + chip status di row |
| 6 | Aksi Cepat (+ aksi CC lain) | Chips + dialog/sheet mock; Handoff, Takeover, (opsional Close) |
| 7 | Info UI MR | Banner/section + mini preview atau tour “setelah handoff → UI MR” |

### Fitur Call Center yang di-provide di demo (prioritas)

**P0 — wajib pitch**

- [ ] Layout 3 kolom + header “MotoVax Call Center · Omnichannel”
- [ ] Lead queue: search (client filter), tab Saya Handle / AI / Semua
- [ ] Grouping bucket: Ditangani AI · Menunggu Agent · MR Belum Balas · per agent
- [ ] Channel filter WA / FB / IG
- [ ] Conversation row: avatar, channel dot, tag Cold/Warm/Hot/Booking, preview, badge ESKALASI / MR BELUM BALAS, tombol Ambil
- [ ] Chat: bubbles AI vs human vs customer, banner status AI/agent
- [ ] Takeover / kembalikan ke AI (simulasi)
- [ ] Aksi Cepat: Simulasi Kredit · Cek Inventori · Tanya Falcon (modal mock)
- [ ] Handoff ke MR (dialog mock + pindah bucket + update “MR yang menangani”)
- [ ] LeadContext: Detail Lead (status, kontak, MR, unit, **pipeline**, catatan)
- [ ] LeadContext: **Riwayat** (timeline event mock)
- [ ] Blok info UI MR (copy + visual mini atau state post-handoff)

**P1 — bagus untuk demo live**

- [ ] Pin conversation (UI only)
- [ ] Escalate dialog (mock)
- [ ] Close lead (mock + hilang dari queue aktif)
- [ ] AI suggestions strip
- [ ] Mode “AI Lab” (toggle) untuk skenario guardrail / HOT detection yang sudah ada

**P2 — out of scope default (kecuali diminta)**

- Media upload / voice recorder nyata
- Bulk close
- Analytics dialog penuh
- Live API tenant
- Edit message Meta
- Full MR app shell (cukup info + mini preview)

---

## 5. Arsitektur implementasi di `motovax.ai`

### 5.1 File

| File | Perubahan |
|------|-----------|
| `index.html` | Rewrite markup `#omniDemo` → shell Call Center 3 kolom + dialogs mock + blok MR info |
| `styles.css` | Section `.cc-demo-*` meniru token produksi (slate/indigo/channel/tag) |
| `script.js` | Extend/refactor `OmnichannelAIDemo` → data model conversation + bucket + pipeline + aksi |
| `docs/plans/demo-ai-omnichannel.md` | Dokumen plan ini |

Opsional: pecah data mock ke `omni-demo-data.js` jika `script.js` terlalu besar.

### 5.2 Model data mock (disarankan)

```js
// konsep — bukan kontrak final
{
  id, name, phone, channel, // whatsapp | messenger | instagram
  tag, // cold | warm | hot | booking
  bucket, // ai | pending | call_center | mr | closed
  handlerName, // agent / "Jasmine AI" / MR name
  mrName, priority, escalated, mrUnanswered,
  pipelineStage, // cold | warm | hot | book
  preview, time, pinned,
  messages: [{ role, content, time, kind? }],
  context: { location, unitInterest, budget, notes, visitStatus },
  history: [{ type, label, time }], // untuk tab Riwayat
}
```

### 5.3 Interaksi simulasi

| Aksi user | Efek demo |
|-----------|-----------|
| Ganti tab faneling / channel | Filter list |
| Ambil / Takeover | `bucket` → call_center, banner berubah, composer aktif |
| Kembalikan ke AI | `bucket` → ai |
| Handoff MR | Dialog pilih MR mock → `bucket` → mr, panel MR terisi, toast “Lead di handoff ke UI MR” |
| Aksi Cepat Simulasi Kredit | Modal angka cicilan mock (reuse copy dari demo IMS/Falcon bila ada) |
| Aksi Cepat Cek Inventori | Sheet list unit mock |
| Aksi Cepat Tanya Falcon | Side panel / mini chat saran AI |
| Ubah pipeline (opsional chip) | Update PipelineSteps + tag row |
| Reset demo | Kembalikan seed data |

### 5.4 UI MR di demo (poin 7)

Minimal (disarankan default):

1. **Kartu info** di sidebar tip / bottom panel:  
   *“Setelah Handoff, sales/MR membuka workspace Percakapan MR — chat lead yang sama, aksi inventori & simulasi kredit, detail lead.”*
2. Setelah handoff sukses: **toast + highlight** bucket “MR” + link “Lihat preview UI MR”.
3. **Preview ringkas** (sheet/modal): header MR + chat + 1–2 aksi (bukan full app).

Jangan klaim “full UI MR production” di demo kecuali diimplementasikan penuh.

### 5.5 AI Trace / Lab (nilai pembeda yang sudah ada)

Jangan dibuang. Opsi:

- **A)** Tab di panel kanan: Detail | Riwayat | **AI Trace**  
- **B)** Tombol “Mode AI Lab” di header yang menampilkan strip skenario + eval (existing prompts)

Rekomendasi: **A + strip skenario** di atas composer (mirip production “saran” + scenario chips yang sudah ada).

---

## 6. Tahapan kerja (PR / sesi)

| Fase | Kerja | Estimasi relatif | Done when |
|------|--------|------------------|-----------|
| **F0** | Klarifikasi poin terbuka (lihat §8) | 0.5 hari | Human approve scope |
| **F1** | Shell UI 3 kolom + header + empty/mock list | 1 hari | Visual parity layout |
| **F2** | Faneling + channel + conversation rows + seed data | 1 hari | Bucket AI/CC/MR terlihat & filterable |
| **F3** | Chat panel + takeover + banner status | 0.5–1 hari | Ambil alih / AI berjalan |
| **F4** | LeadContext Detail + Pipeline + Riwayat | 1 hari | Panel kanan lengkap |
| **F5** | Aksi Cepat + dialog mock + Handoff MR | 1 hari | Semua aksi P0 klikable |
| **F6** | Info/preview UI MR + guide tour | 0.5 hari | Poin 7 terpenuhi |
| **F7** | Polish mobile (stack panels), reset, QA script demo 5 menit | 0.5–1 hari | Siap presentasi |
| **F8** | Deploy Coolify / ship static | 0.25 hari | Live di domain demo |

**Total kasar:** ~5–7 hari kerja setelah scope dikunci (1 engineer).

---

## 7. Script demo 5 menit (untuk sales)

1. Buka demo → tunjukkan **inbox omnichannel** (WA/FB/IG) + bucket **Ditangani AI**.  
2. Pilih lead HOT → chat AI + **pipeline** di panel kanan.  
3. **Ambil alih** → banner Call Center; balas manual (simulasi).  
4. **Aksi Cepat**: Cek Inventori → Simulasi Kredit.  
5. **Handoff ke MR** → bucket MR / MR Belum Balas; tunjukkan **info UI MR**.  
6. Buka tab **Riwayat** → timeline audit.  
7. (Opsional) Mode AI Lab: guardrail “hapus knowledge” → blocked.  
8. Reset demo.

---

## 8. Poin yang kurang jelas (butuh jawaban human)

> Jawaban di §8 menentukan F0. Tanpa ini, implementasi bisa meleset scope.

### A. Scope & target

1. **“Samakan UI Call Center”** — seberapa ketat?  
   - (a) **Pixel-ish parity** 3 kolom dense seperti produksi, atau  
   - (b) **Visual family** (warna/struktur mirip) tapi boleh lebih “marketing”?  
2. **“Semua fitur”** — literal **semua** aksi Call Center (media, voice, bulk close, analytics, edit Meta, escalate, close lead, templates, …) atau **hanya fitur yang disebut di poin 3–7 + aksi cepat**?  
3. Repo implementasi hanya **`motovax.ai` (static)** atau juga perubahan di **`motovax-app`**?

### B. Faneling (poin 3)

4. “Bucket ditangani **AI, Call Center, MR**” — apakah cukup **3 bucket** itu, atau wajib meniru tab produksi lengkap (**Saya Handle / AI / Semua** + group **Menunggu Agent / MR Belum Balas / per agent**)?  
5. Apakah demo perlu menampilkan **multi-agent** (beberapa nama agent fiktif) atau cukup 1 persona agent + AI + 1 MR?

### C. Pipeline & Riwayat (poin 4–5)

6. **Pipeline** di sini = **PipelineSteps lead** (COLD→WARM→HOT→BOOK) di context panel, atau juga **pipeline CRM sales** (demo CRM terpisah di landing)?  
7. **Riwayat** = tab audit di LeadContext saja, atau juga **history pesan chat panjang** di thread?  
8. Apakah stage pipeline **bisa diubah** di demo, atau **read-only** dari seed?

### D. Aksi Cepat & aksi lain (poin 6)

9. Aksi Cepat minimal: **Simulasi Kredit, Cek Inventori, Tanya Falcon** — ada aksi lain yang **wajib** (Escalate, Close Lead, Manual Lead, Source Templates, pin, …)?  
10. Handoff: produksi ke **MR** (`HandoffToMRDialog`). Teks human dulu ada “handoff ke sales”. Konfirmasi: demo **Handoff ke MR** (bukan sales generic)?

### E. UI MR (poin 7)

11. “Informasi kalau ada UI MR” =  
    - (a) **copy/banner saja**,  
    - (b) **preview interaktif mini**, atau  
    - (c) **full dual-mode** Call Center ↔ MR di demo?  
12. Apakah demo MR harus meniru `MRConversationView` (sales percakapan) secara visual?

### F. AI Lab yang sudah ada

13. Panel **AI Trace & Eval / guardrail** — **tetap** (mode/tab), diganti total oleh parity Call Center, atau digabung?  
14. Nama agent AI di demo: **Jasmine AI** (landing) vs **Falcon** (produk) — mana yang dipakai di UI demo?

### G. Data, tenant, deploy

15. Data 100% **mock lokal**, atau ada hook ke **tenant demo** Motovax (API)?  
16. Target deploy: domain **motovax.ai** via Coolify (org sudah ready) — branch `main` langsung, atau branch feature dulu?  
17. Mobile: demo harus **usable di HP** (stack panel) atau **desktop-first** untuk presentasi proyektor?

### H. Bahasa & branding

18. Branding header: **“MotoVax Call Center”** persis produksi, atau **“MOTOVAX · AI Omnichannel”** untuk marketing?  
19. Apakah perlu watermark **“DEMO · DATA SIMULASI”** yang sangat jelas (disarankan ya)?

---

## 9. Rekomendasi default (jika human setuju tanpa debat panjang)

Agar bisa start cepat, usulan default:

| Keputusan | Default |
|-----------|---------|
| Visual | Parity layout 3 kolom dense (a) |
| Fitur | P0 saja (§4); P1 jika sisa waktu |
| Repo | Hanya `motovax.ai` static |
| Faneling | Tab AI / Call Center / MR **plus** group Menunggu Agent & MR Belum Balas |
| Pipeline | PipelineSteps lead di panel kanan |
| Riwayat | Tab Riwayat context panel |
| Aksi Cepat | 3 chips produksi + Handoff MR + Takeover |
| UI MR | Banner + modal preview ringkas (b) |
| AI Lab | Tab “AI Trace” di panel kanan + scenario strip |
| Agent name | Falcon (selaras produk) + subtitle Jasmine bila perlu |
| Data | Mock only + badge DEMO |
| Mobile | Desktop-first; stack acceptable di HP |
| Deploy | `main` + Coolify setelah QA |

---

## 10. Risiko

| Risiko | Mitigasi |
|--------|----------|
| Scope “semua fitur” membengkak | Kunci P0 di F0; P2 eksplisit out of scope |
| Static JS jadi sangat besar | Komponen mock modular; batasi animasi |
| Demo terlihat “palsu” | Watermark + copy jujur “simulasi” |
| Bingung Call Center vs AI Lab | Satu shell; Lab sebagai tab, bukan halaman terpisah |
| MR dianggap fitur Call Center penuh | Info jelas: UI terpisah setelah handoff |

---

## 11. Definisi selesai (untuk task implementasi lanjutan)

- [ ] Demo omni di landing membuka UI 3 kolom mirip Call Center  
- [ ] Faneling AI / Call Center / MR (+ pending/MR timeout) berfungsi filter  
- [ ] Riwayat + Pipeline terlihat di panel kanan  
- [ ] Aksi Cepat + Takeover + Handoff MR simulasi berjalan  
- [ ] Ada informasi/preview UI MR  
- [ ] Script demo 5 menit bisa dijalankan tanpa error console  
- [ ] Deploy ke environment demo yang disepakati  

---

## 12. Langkah berikutnya

1. Human jawab **§8** (atau approve **§9 defaults**).  
2. Spawn task implementasi: *“Implementasi demo AI Omnichannel parity Call Center”*.  
3. Implement F1→F7 di `motovax.ai`, lalu ship.
