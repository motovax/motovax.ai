/**
 * Motovax Omnichannel Preview
 * Vanilla JS, self-contained demo data; no API keys, trackers, server, storage or framework.
 * To integrate in production, replace the demo adapters inside runScenario() and getFalconAnswer().
 */
(() => {
  'use strict';

  const CHANNELS = Object.freeze({
    whatsapp: { name: 'WhatsApp', count: '08', contacts: [
      { id: 'wa-nadia', name: 'Nadia Putri', initials: 'NP', stage: 'HOT', preview: 'Honda HR-V ready?', time: '10:24' },
      { id: 'wa-dimas', name: 'Dimas Saputra', initials: 'DS', stage: 'WARM', preview: 'Mau tanya DP mobil...', time: '09:48' },
      { id: 'wa-bagas', name: 'Bagas Pratama', initials: 'BP', stage: 'SPK', preview: 'Terima kasih, sudah SPK', time: 'Kemarin' }
    ] },
    instagram: { name: 'Instagram DM', count: '04', contacts: [
      { id: 'ig-citra', name: 'Citra Maharani', initials: 'CM', stage: 'HOT', preview: 'HR-V yang di reels ready?', time: '10:12' },
      { id: 'ig-reza', name: 'Reza Ahmad', initials: 'RA', stage: 'WARM', preview: 'Info harga dan cicilan?', time: '09:39' },
      { id: 'ig-amelia', name: 'Amelia', initials: 'AM', stage: 'SPK', preview: 'Jadwal ambil unit', time: 'Kemarin' }
    ] },
    messenger: { name: 'Facebook Messenger', count: '06', contacts: [
      { id: 'fb-rizki', name: 'Rizki Aditya', initials: 'RA', stage: 'HOT', preview: 'Stok HR-V 2022?', time: '10:19' },
      { id: 'fb-yusuf', name: 'Yusuf Firmansyah', initials: 'YF', stage: 'WARM', preview: 'Minta rekomendasi SUV', time: '08:56' },
      { id: 'fb-irma', name: 'Irma Lestari', initials: 'IL', stage: 'SPK', preview: 'Dokumen sudah dikirim', time: 'Kemarin' }
    ] },
    webchat: { name: 'In-App Web Chat', count: '03', contacts: [
      { id: 'web-tasya', name: 'Tasya Rahma', initials: 'TR', stage: 'HOT', preview: 'Bisa kredit HR-V?', time: '10:31' },
      { id: 'web-alvin', name: 'Alvin Mahendra', initials: 'AM', stage: 'WARM', preview: 'Ada unit di Surabaya?', time: '10:07' },
      { id: 'web-niken', name: 'Niken Anggraeni', initials: 'NA', stage: 'SPK', preview: 'Konfirmasi serah terima', time: 'Kemarin' }
    ] }
  });

  const SCENARIOS = Object.freeze({
    stock: {
      question: 'Halo, Honda HR-V SE 2022 masih ready?',
      tool: 'Falcon · simulasi query inventory multi-cabang',
      answer: 'Ready, Kak! 🚙 Berdasarkan data DEMO, Honda HR-V SE 2022 tersedia 3 unit: 2 di Surabaya dan 1 di Sidoarjo. Harga ilustrasi Rp280 juta. Mau saya bantu cek pilihan cabang atau simulasi kreditnya?'
    },
    finance: {
      question: 'Kalau DP Rp50 juta, cicilan Honda HR-V per bulan berapa?',
      tool: 'Fino · menghitung simulasi pembiayaan',
      answer: () => {
        const price = 280_000_000, dp = 50_000_000, months = 48, annualFlatRate = .08;
        const installment = Math.round(((price - dp) / months) + ((price - dp) * annualFlatRate / 12));
        const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
        return `Bisa, Kak! 😊 Simulasi ILUSTRASI untuk HR-V seharga ${rupiah.format(price)}, DP ${rupiah.format(dp)}, tenor 48 bulan, bunga flat 8%/tahun menghasilkan estimasi angsuran ${rupiah.format(installment)}/bulan. Belum termasuk admin dan asuransi. Nilai final mengikuti ketentuan leasing.`;
      }
    }
  });

  const FALCON_RESULTS = Object.freeze({
    alternatives: {
      title: 'Alternatif Unit Serupa', kind: 'MIS Inventory', status: 'Data simulasi',
      text: 'Untuk pelanggan yang mencari Honda HR-V 2022, berikut pilihan unit ilustratif yang dapat ditawarkan. Ketersediaan dan harga aktual perlu diverifikasi dari MIS dealer.',
      stats: [ ['HR-V SE 2022', '3 unit'], ['HR-V E 2021', '2 unit'], ['WR-V 2023', '1 unit'] ],
      source: 'Sumber contoh: MIS / Inventory (simulasi)',
      draft: 'Ada beberapa alternatif yang bisa Kakak pertimbangkan: Honda HR-V SE 2022, HR-V E 2021, atau WR-V 2023. Saya bantu cek unit, kondisi, dan harga yang paling cocok, ya.'
    },
    stock: {
      title: 'Stok HR-V Multi-Cabang', kind: 'MIS Inventory', status: 'Data simulasi',
      text: 'Honda HR-V SE 2022 tercatat tersedia pada 2 cabang dalam dataset demo. Gunakan integrasi MIS untuk memastikan stok benar-benar siap ditawarkan.',
      stats: [ ['Surabaya', '2 unit'], ['Sidoarjo', '1 unit'], ['Total', '3 unit'] ],
      source: 'Sumber contoh: MIS / Inventory (simulasi)',
      draft: 'Untuk HR-V SE 2022 tersedia pilihan unit di Surabaya dan Sidoarjo berdasarkan informasi demo. Boleh saya bantu pilih lokasi dan jadwalkan pengecekan unit?'
    },
    aging: {
      title: 'Ringkasan Aging Inventory', kind: 'MIS Reporting', status: 'Data simulasi',
      text: 'Contoh ringkasan inventori yang melewati 90 hari. Falcon dapat diarahkan untuk membantu menemukan unit prioritas follow-up atau kampanye sesuai hak akses.',
      stats: [ ['Aging >90 hari', '12 unit'], ['Rata-rata', '108 hari'], ['Prioritas', '4 unit'] ],
      source: 'Sumber contoh: laporan aging MIS (simulasi)',
      draft: 'Kami juga memiliki beberapa unit pilihan yang sedang menjadi prioritas penawaran. Apakah Kakak ingin saya kirimkan daftar yang sesuai budget dan tipe kendaraan?'
    },
    sop: {
      title: 'Knowledge Base Dealer', kind: 'Dealer SOP', status: 'Panduan contoh',
      text: 'Alur handoff pada contoh ini: (1) kualifikasi kebutuhan, (2) verifikasi data stok, (3) buat catatan lead, (4) ambil alih melalui operator, (5) teruskan ke MR dengan ringkasan konteks.',
      stats: [ ['Kualifikasi', 'Jasmine'], ['Validasi', 'Falcon'], ['Handoff', 'MR'] ],
      source: 'Sumber contoh: SOP internal dealer (simulasi)',
      draft: 'Terima kasih, Kak. Saya teruskan kebutuhan kendaraan dan pilihan pembiayaan Kakak kepada tim sales kami agar bisa ditindaklanjuti lebih detail.'
    }
  });

  const PROMPTS = Object.freeze({
    mis: [ ['Stok HR-V lintas cabang', 'stock'], ['Rekomendasikan unit serupa', 'alternatives'], ['Unit aging > 90 hari', 'aging'] ],
    kb: [ ['Bagaimana SOP handoff ke MR?', 'sop'], ['Alur penanganan lead', 'sop'], ['Cek unit alternatif', 'alternatives'] ]
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const svg = (symbol) => `<svg class="icon" aria-hidden="true"><use href="#i-${symbol}"></use></svg>`;
  const timestamp = () => new Intl.DateTimeFormat('id-ID', {hour:'2-digit',minute:'2-digit'}).format(new Date());

  class MotovaxOmniPreview {
    constructor(root) {
      this.root = root;
      this.state = { channel: 'whatsapp', contactId: CHANNELS.whatsapp.contacts[0].id, typing: false, drawer: false, falconTab: 'mis', falconResultKey: 'alternatives', mobileView: 'chat' };
      this.messagesByContact = new Map();
      this.humanByContact = new Set();
      this.typingTimer = null;
      this.toastTimer = null;
      this.lastFocused = null;
      this.refs = {
        messages: $('#messages', root), list: $('#contact-list', root), search: $('#search-contact', root),
        chatInput: $('#chat-input', root), send: $('#send-button', root), chatForm: $('#chat-form', root),
        falconQuery: $('#falcon-query', root), falconResult: $('#falcon-result', root), falconSuggestions: $('#falcon-suggestions', root),
        drawer: $('#falcon-drawer', root), backdrop: $('#drawer-backdrop', root)
      };
      this.bindEvents();
      this.renderAll();
      this.showFalconResult('alternatives');
    }

    get contact() { return CHANNELS[this.state.channel].contacts.find(c => c.id === this.state.contactId); }
    get isHuman() { return this.humanByContact.has(this.state.contactId); }

    seedMessages(id) {
      if (!this.messagesByContact.has(id)) {
        this.messagesByContact.set(id, [
          { role: 'customer', text: 'Halo, saya tertarik dengan Honda HR-V 2022. Bisa dibantu?', at: '10:20' },
          { role: 'ai', text: 'Halo! Saya Jasmine, asisten AI Motovax. Tentu bisa 😊 Silakan coba opsi cek stok atau simulasi DP di atas.', at: '10:20' }
        ]);
      }
      return this.messagesByContact.get(id);
    }

    bindEvents() {
      $$('.channel-tab', this.root).forEach(btn => {
        btn.addEventListener('click', () => this.setChannel(btn.dataset.channel));
        btn.addEventListener('keydown', e => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          e.preventDefault();
          const buttons = $$('.channel-tab', this.root);
          const current = buttons.indexOf(btn);
          const next = buttons[(current + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length];
          next.focus(); this.setChannel(next.dataset.channel);
        });
      });
      $$('.scenario-btn', this.root).forEach(btn => btn.addEventListener('click', () => this.runScenario(btn.dataset.scenario)));
      $('#takeover-btn', this.root).addEventListener('click', () => this.toggleTakeover());
      this.refs.chatForm.addEventListener('submit', e => { e.preventDefault(); this.sendOperatorMessage(); });
      this.refs.search.addEventListener('input', () => this.renderContacts());
      $$('[data-action="open-falcon"]', this.root).forEach(btn => btn.addEventListener('click', () => this.openFalcon()));
      $('#falcon-close', this.root).addEventListener('click', () => this.closeFalcon());
      this.refs.backdrop.addEventListener('click', () => this.closeFalcon());
      $('#falcon-form', this.root).addEventListener('submit', e => {
        e.preventDefault();
        const q = this.refs.falconQuery.value.trim();
        if (!q) { this.toast('Ketik pertanyaan atau pilih pertanyaan cepat.'); return; }
        this.showFalconResult(this.classifyQuery(q));
      });
      $$('.falcon-tab', this.root).forEach(btn => btn.addEventListener('click', () => this.setFalconTab(btn.dataset.falconTab)));
      $$('.mobile-pane-btn', this.root).forEach(btn => btn.addEventListener('click', () => this.setMobilePane(btn.dataset.mobilePane)));
      $('#reset-demo', this.root).addEventListener('click', () => this.reset());
      $('#theme-switch').addEventListener('click', () => this.toggleTheme());
      document.addEventListener('keydown', e => this.handleKeyboard(e));
    }

    setChannel(key) {
      if (!CHANNELS[key]) return;
      this.cancelTyping();
      this.state.channel = key;
      this.state.contactId = CHANNELS[key].contacts[0].id;
      this.refs.search.value = '';
      this.setMobilePane('chat');
      this.renderAll();
    }

    setContact(id) {
      if (!CHANNELS[this.state.channel].contacts.some(c => c.id === id)) return;
      this.cancelTyping();
      this.state.contactId = id;
      this.refs.chatInput.value = '';
      this.setMobilePane('chat');
      this.renderAll();
    }

    setMobilePane(pane) {
      if (pane !== 'inbox' && pane !== 'chat') return;
      this.state.mobileView = pane;
      $('.workspace-body', this.root).dataset.mobileView = pane;
      $$('.mobile-pane-btn', this.root).forEach(b => b.classList.toggle('selected', b.dataset.mobilePane === pane));
    }

    renderAll() {
      $$('.channel-tab', this.root).forEach(btn => {
        const selected = btn.dataset.channel === this.state.channel;
        btn.classList.toggle('active', selected);
        btn.setAttribute('aria-selected', String(selected));
        btn.tabIndex = selected ? 0 : -1;
      });
      $('#inbox-count', this.root).textContent = CHANNELS[this.state.channel].count;
      this.renderContacts(); this.renderHeader(); this.renderOwnership(); this.renderMessages();
    }

    renderContacts() {
      this.refs.list.replaceChildren();
      const query = this.refs.search.value.trim().toLowerCase();
      let visible = 0;
      CHANNELS[this.state.channel].contacts.forEach(contact => {
        if (query && !(`${contact.name} ${contact.preview} ${contact.stage}`.toLowerCase().includes(query))) return;
        visible++;
        const btn = create('button', 'contact-item');
        btn.type = 'button';
        if (contact.id === this.state.contactId) btn.classList.add('selected');
        btn.setAttribute('aria-current', contact.id === this.state.contactId ? 'true' : 'false');
        const avatar = create('span', 'contact-avatar', contact.initials);
        const content = create('span', 'contact-text');
        const top = create('span', 'contact-top');
        top.append(create('span', 'contact-name', contact.name), create('span', 'contact-time', contact.time));
        const preview = create('span', 'contact-preview', contact.preview);
        const lower = create('span', 'contact-lower');
        lower.append(create('span', `lead-chip ${contact.stage.toLowerCase()}`, contact.stage), create('span', 'handler-chip', this.humanByContact.has(contact.id) ? 'Operator' : 'Jasmine AI'));
        content.append(top, preview, lower);
        btn.append(avatar, content);
        btn.addEventListener('click', () => this.setContact(contact.id));
        this.refs.list.append(btn);
      });
      if (!visible) this.refs.list.append(create('p', 'no-results', 'Tidak ada percakapan yang cocok.'));
    }

    renderHeader() {
      const c = this.contact;
      $('#customer-name', this.root).textContent = c.name;
      $('#customer-avatar', this.root).textContent = c.initials;
      $('#customer-meta', this.root).textContent = `${CHANNELS[this.state.channel].name} · Prospek mobil`;
      $('#lead-label', this.root).textContent = `${c.stage} LEAD`;
      $('#profile-avatar', this.root).textContent = c.initials;
      $('#profile-name', this.root).textContent = c.name;
      $('#profile-origin', this.root).textContent = `Lead dari ${CHANNELS[this.state.channel].name}`;
      const stage = $('#context-stage', this.root);
      stage.textContent = `● ${c.stage}`;
      stage.className = `tag ${c.stage === 'HOT' ? 'tag-red' : c.stage === 'WARM' ? 'tag-warm' : 'tag-spk'}`;
      $('#lead-label', this.root).style.display = c.stage === 'HOT' ? '' : 'none';
    }

    renderOwnership() {
      const human = this.isHuman;
      const status = $('#ai-status', this.root);
      status.className = `ai-status ${human ? 'human-on' : 'ai-on'}`;
      status.innerHTML = `${svg(human ? 'person' : 'bot')} ${human ? 'Operator Takeover' : 'AI Aktif'}`;
      $('#ownership-caption', this.root).textContent = human ? 'Operator memegang kendali percakapan' : 'Jasmine menangani pesan otomatis';
      const btn = $('#takeover-btn', this.root);
      btn.classList.toggle('return-ai', human);
      btn.innerHTML = `${svg(human ? 'bot' : 'person')}<span>${human ? 'Kembalikan ke AI' : 'Ambil Alih'}</span>`;
      $('#handler-name', this.root).textContent = human ? 'Operator Call Center' : 'Jasmine AI';
      this.refs.chatInput.disabled = !human;
      this.refs.send.disabled = !human;
      this.refs.chatInput.placeholder = human ? 'Ketik pesan sebagai operator...' : 'Ambil alih untuk mengetik sebagai operator...';
      $('#composer-hint', this.root).textContent = human ? 'Mode operator aktif · tekan Enter untuk kirim' : 'Aktifkan Takeover untuk mengirim pesan manual';
      $$('.scenario-btn', this.root).forEach(b => b.disabled = human || this.state.typing);
      this.renderContacts();
    }

    toggleTakeover(force) {
      const activate = typeof force === 'boolean' ? force : !this.isHuman;
      if (activate) {
        this.cancelTyping();
        this.humanByContact.add(this.state.contactId);
      } else {
        this.humanByContact.delete(this.state.contactId);
        this.refs.chatInput.value = '';
      }
      this.renderOwnership();
      if (activate) { this.refs.chatInput.focus(); this.toast('Takeover aktif. Anda dapat mengetik sebagai operator demo.'); }
      else this.toast('Percakapan dikembalikan ke Jasmine AI.');
    }

    renderMessages() {
      this.refs.messages.replaceChildren();
      this.refs.messages.append(create('div', 'chat-date', 'Hari ini · Demo Motovax'));
      this.seedMessages(this.state.contactId).forEach(m => this.appendMessageDOM(m, false));
      if (this.state.typing && this.typingContact === this.state.contactId) this.appendTypingDOM();
      this.scrollToLatest();
    }

    appendMessageDOM(message, scroll = true) {
      if (message.role === 'tool') {
        const line = create('div', 'tool-action');
        line.innerHTML = svg('database');
        line.append(document.createTextNode(message.text));
        this.refs.messages.append(line);
      } else {
        const outgoing = message.role !== 'customer';
        const wrap = create('div', `message ${outgoing ? 'outgoing' : 'incoming'}`);
        const avatar = create('span', `message-avatar ${message.role === 'customer' ? 'customer' : message.role === 'operator' ? 'operator' : ''}`, message.role === 'customer' ? this.contact.initials : message.role === 'operator' ? 'OP' : 'JA');
        const content = create('div', 'message-content');
        const name = message.role === 'customer' ? this.contact.name : message.role === 'operator' ? 'Operator (demo)' : 'Jasmine AI';
        content.append(create('span', 'message-author', name), create('div', 'message-bubble', message.text), create('span', 'message-timestamp', message.at || timestamp()));
        wrap.append(avatar, content);
        this.refs.messages.append(wrap);
      }
      if (scroll) this.scrollToLatest();
    }

    appendTypingDOM() {
      const wrap = create('div', 'message incoming typing'); wrap.id = 'typing-indicator';
      const avatar = create('span', 'message-avatar', 'JA');
      const content = create('div', 'message-content');
      content.append(create('span', 'message-author', 'Jasmine AI sedang mengetik...'));
      const bubble = create('div', 'message-bubble');
      for (let i = 0; i < 3; i++) bubble.append(create('span', 'typing-dot'));
      content.append(bubble); wrap.append(avatar, content);
      this.refs.messages.append(wrap); this.scrollToLatest();
    }

    addMessage(role, text) {
      const msg = { role, text, at: timestamp() };
      this.seedMessages(this.state.contactId).push(msg);
      this.appendMessageDOM(msg);
    }

    cancelTyping() {
      if (this.typingTimer) clearTimeout(this.typingTimer);
      this.typingTimer = null;
      this.typingContact = null;
      this.state.typing = false;
      $('#typing-indicator', this.root)?.remove();
      $$('.scenario-btn', this.root).forEach(b => b.disabled = this.isHuman);
    }

    runScenario(scenarioKey) {
      const scenario = SCENARIOS[scenarioKey];
      if (!scenario) return;
      if (this.isHuman) { this.toast('Kembalikan percakapan ke AI untuk mencoba skenario otomatis.'); return; }
      if (this.state.typing) return;
      this.addMessage('customer', scenario.question);
      this.state.typing = true;
      this.typingContact = this.state.contactId;
      this.renderOwnership();
      this.appendTypingDOM();
      const contactId = this.state.contactId;
      this.typingTimer = setTimeout(() => {
        if (contactId !== this.state.contactId || this.isHuman) { this.cancelTyping(); return; }
        $('#typing-indicator', this.root)?.remove();
        this.state.typing = false;
        this.typingTimer = null; this.typingContact = null;
        this.addMessage('tool', scenario.tool);
        this.addMessage('ai', typeof scenario.answer === 'function' ? scenario.answer() : scenario.answer);
        this.renderOwnership();
      }, 1350);
    }

    sendOperatorMessage() {
      if (!this.isHuman) { this.toast('Ambil alih percakapan terlebih dahulu.'); return; }
      const value = this.refs.chatInput.value.trim();
      if (!value) return;
      this.addMessage('operator', value);
      this.refs.chatInput.value = '';
      this.refs.chatInput.focus();
      this.toast('Pesan operator ditampilkan pada demo (tidak dikirim ke pelanggan).');
    }

    scrollToLatest() { this.refs.messages.scrollTop = this.refs.messages.scrollHeight; }

    openFalcon() {
      if (this.state.drawer) return;
      this.state.drawer = true;
      this.lastFocused = document.activeElement;
      this.refs.backdrop.hidden = false;
      requestAnimationFrame(() => this.refs.backdrop.classList.add('open'));
      this.refs.drawer.classList.add('open');
      this.refs.drawer.setAttribute('aria-hidden', 'false');
      this.refs.falconQuery.focus();
    }

    closeFalcon() {
      if (!this.state.drawer) return;
      this.state.drawer = false;
      this.refs.drawer.classList.remove('open');
      this.refs.drawer.setAttribute('aria-hidden', 'true');
      this.refs.backdrop.classList.remove('open');
      this.refs.backdrop.hidden = true;
      if (this.lastFocused && typeof this.lastFocused.focus === 'function') this.lastFocused.focus();
    }

    setFalconTab(tab) {
      if (!PROMPTS[tab]) return;
      this.state.falconTab = tab;
      $$('.falcon-tab', this.root).forEach(btn => {
        const on = btn.dataset.falconTab === tab;
        btn.classList.toggle('active', on); btn.setAttribute('aria-selected', String(on));
      });
      $('#falcon-intro', this.root).textContent = tab === 'mis' ? 'Tanyakan ketersediaan unit, alternatif mobil, atau aging stok.' : 'Cari jawaban berdasarkan SOP dan panduan operasional dealer.';
      this.renderFalconSuggestions();
      this.showFalconResult(tab === 'mis' ? 'alternatives' : 'sop');
    }

    renderFalconSuggestions() {
      this.refs.falconSuggestions.replaceChildren();
      PROMPTS[this.state.falconTab].forEach(([title, key]) => {
        const chip = create('button', 'prompt-chip', title);
        chip.type = 'button';
        chip.addEventListener('click', () => { this.refs.falconQuery.value = title; this.showFalconResult(key); });
        this.refs.falconSuggestions.append(chip);
      });
    }

    classifyQuery(query) {
      const normalized = query.toLowerCase();
      if (/sop|handoff|serah|prosedur|alur|knowledge|panduan|aturan/.test(normalized)) return 'sop';
      if (/aging|90 hari|lama|menumpuk/.test(normalized)) return 'aging';
      if (/alternatif|serupa|mirip|rekomendasi|pilihan/.test(normalized)) return 'alternatives';
      if (/stok|ready|cabang|hr-v|hrv|inventori|inventory/.test(normalized)) return 'stock';
      return null;
    }

    showFalconResult(key) {
      this.renderFalconSuggestions();
      this.refs.falconResult.replaceChildren();
      if (!key || !FALCON_RESULTS[key]) {
        const note = create('div', 'result-card');
        const text = create('div', 'result-card-body', 'Ini prototipe dengan jawaban berbasis skenario, bukan AI generatif. Untuk melihat hasil, pilih pertanyaan tentang stok, unit serupa, aging inventory, atau SOP dealer.');
        note.append(text); this.refs.falconResult.append(note); return;
      }
      this.state.falconResultKey = key;
      const result = FALCON_RESULTS[key];
      const card = create('div', 'result-card');
      const head = create('div', 'result-card-head');
      const heading = create('strong'); heading.innerHTML = svg('sparkles'); heading.append(document.createTextNode(result.title));
      head.append(heading, create('span', null, result.status));
      const body = create('div', 'result-card-body');
      body.append(create('p', null, result.text));
      const stats = create('div', 'result-stats');
      result.stats.forEach(([label, value]) => { const col = create('div', 'result-stat'); col.append(create('b', null, value), create('span', null, label)); stats.append(col); });
      body.append(stats);
      const source = create('div', 'result-source'); source.innerHTML = svg('database'); source.append(document.createTextNode(result.source)); body.append(source);
      const actions = create('div', 'result-actions');
      actions.append(create('span', null, 'Draft belum dikirim'));
      const copy = create('button', 'copy-to-chat'); copy.type = 'button'; copy.innerHTML = `${svg('copy')} Salin ke Chat`;
      copy.addEventListener('click', () => this.copyToChat(result.draft));
      actions.append(copy);
      card.append(head, body, actions);
      this.refs.falconResult.append(card);
    }

    copyToChat(draft) {
      this.closeFalcon();
      this.setMobilePane('chat');
      if (!this.isHuman) this.humanByContact.add(this.state.contactId);
      this.cancelTyping();
      this.renderOwnership();
      this.refs.chatInput.value = draft;
      this.refs.chatInput.focus();
      this.refs.chatInput.setSelectionRange(draft.length, draft.length);
      this.toast('Rekomendasi Falcon masuk ke draft operator. Tekan Kirim untuk menampilkannya.');
    }

    handleKeyboard(event) {
      if (!this.state.drawer) return;
      if (event.key === 'Escape') { event.preventDefault(); this.closeFalcon(); return; }
      if (event.key !== 'Tab') return;
      const focusables = $$('button:not(:disabled),input:not(:disabled)', this.refs.drawer).filter(el => el.getClientRects().length);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    toggleTheme() {
      const isDark = document.body.dataset.theme === 'dark';
      document.body.dataset.theme = isDark ? 'light' : 'dark';
      const btn = $('#theme-switch');
      btn.innerHTML = svg(isDark ? 'moon' : 'sun');
      btn.setAttribute('aria-label', isDark ? 'Ganti ke mode gelap' : 'Ganti ke mode terang');
    }

    toast(message) {
      const el = $('#toast');
      el.textContent = message;
      el.classList.add('visible');
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
    }

    reset() {
      this.cancelTyping();
      this.closeFalcon();
      this.messagesByContact.clear();
      this.humanByContact.clear();
      this.refs.chatInput.value = '';
      this.refs.falconQuery.value = '';
      this.state.channel = 'whatsapp';
      this.state.contactId = CHANNELS.whatsapp.contacts[0].id;
      this.state.falconTab = 'mis';
      this.refs.search.value = '';
      this.setMobilePane('chat');
      this.renderAll();
      this.setFalconTab('mis');
      this.toast('Demo berhasil direset.');
    }
  }

  
  // Modal viewer logic for real Mobix screenshots
  function initMobixModal() {
    const modal = document.querySelector('[data-hero-image-modal]');
    const modalImg = document.querySelector('[data-hero-image-modal-img]');
    const modalTitle = document.querySelector('[data-hero-image-modal-title]');
    const closeBtn = document.querySelector('[data-hero-image-close]');
    const openers = Array.from(document.querySelectorAll('[data-hero-image-open]'));
    if (!modal || !modalImg) return;

    let trigger = null;
    const close = () => {
      if (modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove('feature-image-open');
      modalImg.removeAttribute('src');
      if (trigger) trigger.focus();
    };

    const open = (button) => {
      trigger = button;
      modalImg.src = button.dataset.imageSrc || './assets/feature-previews/omnichannel-workspace-mobix-real.png';
      modalImg.alt = button.dataset.imageAlt || 'Screenshot Workspace Call Center Omnichannel Mobix';
      if (modalTitle) modalTitle.textContent = button.dataset.imageTitle || 'Workspace Call Center Omnichannel (Live Mobix)';
      modal.hidden = false;
      document.body.classList.add('feature-image-open');
      if (closeBtn) closeBtn.focus();
    };

    openers.forEach(btn => btn.addEventListener('click', () => open(btn)));
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobixModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const widget = $('#omni-preview');
    if (widget) new MotovaxOmniPreview(widget);
  });
})();