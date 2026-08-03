# Breakdown Modul & Fitur Motovax

**Posisi produk:** Agentic AI ERP — platform multi-tenant yang mengintegrasikan operasional bisnis dengan agen AI (WhatsApp, omnichannel, otomasi).  
**Vertical utama hari ini:** Dealer otomotif (contoh tenant: Mobix).  
**Arah:** Modul yang sama dapat digeneralisasi ke industri lain (properti, ritel, jasa) lewat konfigurasi tenant + agent tools + dashboard multi-vertical.

Dokumen ini memetakan **apa yang sudah ada di produksi** (`motovax-app`) dan **apa yang masuk akal dibangun** sebagai perluasan ERP agentic. Sumber: feature flags tenant, route frontend, sidebar, backend services, dan tool agent WhatsApp.

Halaman publik ringkas: [`/modul.html`](../../modul.html)

---

## 1. Ringkasan arsitektur produk

| Lapisan | Peran |
|--------|--------|
| **Web app (React)** | Operasional harian: inventory, CRM, analytics, settings, call center, social media |
| **Agentic AI (WhatsApp / Falcon)** | Agen dengan tool: query stok, foto, kredit, follow-up, handoff, konten, admin ops |
| **Omnichannel inbox** | Call Center: WA + Messenger + Instagram DM, SSE realtime, handoff AI ↔ manusia ↔ MR |
| **Integrasi** | WhatsApp session, Meta Business / Socimoto publish, Facebook, Instagram, Developer API |
| **Platform** | Multi-tenant, RBAC, LLM endpoints, workers, email report, usage |

### Feature flag tenant (`tenantfeatures`)

| Key | Default | Membuka |
|-----|---------|---------|
| `whatsapp_ai` | on | Integrasi channel AI (WA / Meta) |
| `inventory_management` | on | Unit, stok, upload, analytics trend |
| `crm_autopilot` | off | Sales CRM, pipeline, customer, MR, agents |
| `social_media_automation` | off | Generator konten, posting, ads campaign |

---

## 2. Peta modul — status produksi

Status: **Live** = dipakai di produksi · **Partial** = ada di kode tapi scope terbatas / flag off by default · **Platform** = internal / control-plane.

### M1 · Inventory Management System (IMS) — **Live**

| Area | Fitur |
|------|--------|
| Unit | Daftar unit, detail, edit, filter multi-cabang |
| Per cabang | Tampilan stok per branch |
| Upload / import | Excel import, warnings, missing-ready confirmation |
| Foto | Upload foto unit, worker perawatan foto |
| Stok sales | View stok-unit untuk salesperson |
| AI inventory | Query stok via WhatsApp, create/edit unit, laporan inventory, stock alert, import Google Sheets |

**Demo landing:** `#inventoryDemo` · **Flag:** `inventory_management`

---

### M2 · Agentic AI (WhatsApp / Falcon / Jasmine) — **Live**

Agen AI dengan tool native (bukan chatbot keyword). Peran tipikal: **Jasmine** (call center / customer), **Falcon** (sales / internal).

| Kategori tool | Contoh kemampuan |
|---------------|------------------|
| Data & stok | Query unit, schema query, unit serupa, alternatif, laporan inventory |
| Media | Kirim foto unit, dokumen, generate image, recap foto |
| Finance | Simulasi kredit, TNS/GP, analisis finansial admin |
| CRM ops | Assign MR, submit MR lead, schedule follow-up |
| Handoff | Handoff admin, call center, request contact, list PIC |
| Konten | Caption promo, post content |
| Knowledge | Web search, fetch URL, preferensi reply, notifikasi |
| Spesial | Trade-in appraise, MRP, draft discount proposal |

**Demo landing:** `#falconDemo` (Falcon) dan `#capabilityDemo` (kontrol channel) · **Flag:** `whatsapp_ai`

---

### M3 · AI Omnichannel & Call Center — **Live**

| Area | Fitur |
|------|--------|
| Inbox | Omnichannel WA / FB / IG, faneling (AI / agent / MR) |
| Realtime | SSE (bukan polling) |
| Operator | Takeover AI, handoff MR, escalate, close lead |
| Aksi cepat | Simulasi kredit, cek inventori, tanya AI |
| Performa | Hasil omnichannel / performa CRM |

**Demo landing:** `#omniDemo`

---

### M4 · Autopilot CRM — **Live** (flag default off)

Customer · Pipeline · Program/campaign follow-up · Guideline · MR · Salespeople · Agents · Percakapan MR · Sales dashboard.

**Demo landing:** `#crmDemo` · **Flag:** `crm_autopilot`

---

### M5 · Social Media & Ads Automation — **Live** (flag default off)

Generator creative · Posting/schedule · Ads campaign · Meta Business publish (Socimoto) · Integrasi Meta/Messenger/IG.

**Demo landing:** `#socialDemo` · **Flag:** `social_media_automation`

---

### M6 · One Dashboard & Analytics — **Live**

Dashboard per role · Sales trend (revenue, GP, HPP) · Sales insight · Channel metrics.

**Demo landing:** `#dashboardDemo`

---

### M7 · Data Insight & Conversion — **Partial**

Funnel & channel breakdown sudah ada; attribution LTV multi-touch dan BI builder masih roadmap.

**Demo landing:** `#insightDemo`

---

### M8 · Platform, IAM & Integrasi — **Live**

Multi-tenant · Users/roles · Configuration · Integrations · Email report · Developer API · Control plane (tenants, LLM, workers).

**Demo landing:** `#capabilityDemo` untuk WhatsApp API & Integration serta automasi aktif. Workflow builder visual tetap ditandai **roadmap**.

---

### M9–M10 · Finance kalkulator & Trade-in/MRP — **Partial**

Simulasi kredit, TNS/GP, trade-in, MRP, promotion — belum full accounting ERP.

---

## 3. Mapping kartu landing ↔ produksi

| Kartu motovax.ai | Modul | Demo |
|------------------|-------|------|
| Inventory Management System | M1 | `#inventoryDemo` |
| AI Omnichannel & Call Center | M2+M3 | `#omniDemo` |
| Social Media & Ads Automation | M5 | `#socialDemo` |
| Autopilot CRM | M4 | `#crmDemo` |
| One Dashboard | M6 | `#dashboardDemo` |
| Data Insight & Higher Conversion | M6+M7 | `#insightDemo` |

### Routing dropdown Produk

| Kategori dropdown | Demo | Konteks |
|-------------------|------|---------|
| Omnichannel | `#omniDemo` | Inbox seluruh channel |
| Aplikasi CRM | `#crmDemo` | Customer, pipeline, auto-follow |
| WhatsApp API & Integration | `#capabilityDemo` | Session, role, routing, health channel |
| Customer Support & Ticketing | `#omniDemo` | Antrian, takeover, resolusi, riwayat |
| AI & Chatbot | `#falconDemo` | Falcon sebagai demo standalone |
| Automasi Operasional & Workflow | `#capabilityDemo` | Automasi aktif; builder visual tetap roadmap |
| Manajemen Campaign | `#socialDemo` | WhatsApp Broadcast, segmentasi, hasil campaign |
| Call Center | `#omniDemo` | Workspace operator, handoff AI–agent–MR |

Suite memakai demo yang sama dengan konteks terdekat: Broadcast → `#socialDemo`, Sales → `#crmDemo`, Service → `#omniDemo`, dan Motovax 360 → `#dashboardDemo`.

---

## 4. Roadmap yang bisa dibangun

### P0 (dekat fondasi)

- Document AI (SPK, invoice, PJB draft)
- Lead attribution Ads → deal
- Voice / call notes AI
- Stock intelligence (aging, pricing suggest)
- Multi-branch SLA routing
- Mini catalog self-serve

### P1 (ERP agentic)

- Finance Ops (AR/AP, cashflow)
- Aftersales / Service
- HR lite (target, komisi)
- Procurement inbound unit
- Knowledge base tenant
- Workflow builder event-driven

### P2 (multi-industri)

- Properti, ritel/F&B, jasa/education, generic SMB  
- Prinsip: satu platform data + agent tools + RBAC

### P3 (platform GTM)

- Self-serve onboarding
- Usage billing / credit AI
- Marketplace connectors (leasing, insurance, logistics)
- White-label partner

---

## 5. Matriks ringkas

| Modul | Status |
|-------|--------|
| Inventory / Unit | ✅ Ada |
| WhatsApp Agentic AI | ✅ Ada |
| Call Center Omnichannel | ✅ Ada |
| Autopilot CRM | ✅ Ada (flag) |
| Social + Ads + Meta publish | ✅ Ada (flag) |
| Analytics / Dashboard | ✅ Ada |
| Multi-tenant + RBAC | ✅ Ada |
| Developer API | ✅ Ada |
| Finance simulation | ✅ Partial |
| Trade-in / MRP | ✅ Partial |
| Document generation legal | 🔲 Bisa |
| Full accounting ERP | 🔲 Bisa |
| Aftersales / service | 🔲 Bisa |
| HR & komisi | 🔲 Bisa |
| Workflow no-code | 🔲 Bisa |
| Multi-industry packs | 🔲 Bisa |
| Voice AI | 🔲 Bisa |
| Billing SaaS self-serve | 🔲 Bisa |

---

## 6. Narasi pitch

> Motovax bukan sekadar chatbot. Kami adalah **ERP operasional + agen AI** yang bekerja di channel pelanggan dan di back-office: stok live, inbox omnichannel, CRM autopilot, konten & iklan, serta insight keuangan — satu data, multi-role, multi-cabang.

Sumber detail teknis: `motovax-app/docs/product/modul-fitur-breakdown.md`
