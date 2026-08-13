(function () {
  "use strict";

  var STORAGE_KEY = "motovax_onboarding_v1";
  var INDUSTRY_LABELS = {
    general: "Umum / Lainnya",
    automotive: "Otomotif",
    property: "Properti",
    retail: "Retail",
    other: "Umum / Lainnya", // legacy localStorage
  };
  var MODULE_LABELS = {
    ims: "Inventory",
    omni: "Omnichannel",
    social: "Social & Ads",
    crm: "Autopilot CRM",
    dashboard: "One Dashboard",
    insight: "Data Insight",
  };
  var LOGIN_ROLES = [
    { id: "owner", label: "Owner / Admin", badge: "OA", desc: "Pemilik & admin tenant. Akses penuh, kelola tim, peran, dan konfigurasi.", modules: ["ims", "omni", "social", "crm", "dashboard", "insight"], steps: [
      { t: "Aktifkan akun", d: "Workspace Anda sudah dibuat saat onboarding. Mulai dari domain khusus: {domain}." },
      { t: "Login sebagai owner", d: "Gunakan email kerja dan password yang sama dengan saat Anda mendaftar onboarding Motovax." },
      { t: "Masuk ke dashboard", d: "Setelah login, Anda diarahkan ke halaman utama tenant sesuai modul yang aktif." },
      { t: "Buat akun tim", d: "Buka Pengaturan → Pengguna & Peran, tambahkan anggota, lalu tetapkan peran (Sales, Marketing, Call Center, PIC)." },
    ] },
    { id: "sales", label: "Salesperson", badge: "SL", desc: "Tenaga penjual tim: stok unit, pipeline deal, dan follow-up lead.", modules: ["ims", "crm", "omni", "dashboard"], steps: [
      { t: "Akun dibuat admin", d: "Owner/admin membuat akun Anda di Pengaturan → Pengguna & Peran dengan peran Salesperson." },
      { t: "Buka domain aplikasi", d: "Login di {domain} menggunakan username dan password yang diberikan admin." },
      { t: "Masuk sesuai peran", d: "Anda diarahkan ke halaman Sales (tanpa menu full setting) agar fokus pada stok dan pipeline." },
      { t: "Mulai berjualan", d: "Cek stok, lakukan simulasi kredit, dan follow-up lead lewat WhatsApp AI." },
    ] },
    { id: "marketing", label: "Marketing Rep", badge: "MR", desc: "Marketing representative: follow-up lead, program MR, dan campaign.", modules: ["crm", "social", "omni", "ims", "dashboard"], steps: [
      { t: "Akun dibuat admin", d: "Owner/admin membuat akun Anda dengan peran Marketing Representative." },
      { t: "Buka domain aplikasi", d: "Login di {domain} menggunakan username dan password dari admin." },
      { t: "Masuk ke area marketing", d: "Anda diarahkan ke pipeline MR dan percakapan untuk follow-up lead." },
      { t: "Kelola campaign", d: "Akses konten sosial & ads untuk mendukung closing dan program promosi." },
    ] },
    { id: "callcenter", label: "Call Center", badge: "CC", desc: "Operator omnichannel: inbox WA, Messenger & IG, takeover dan handoff.", modules: ["omni", "crm", "dashboard"], steps: [
      { t: "Akun dibuat admin", d: "Owner/admin membuat akun Anda dengan peran Call Center." },
      { t: "Buka domain aplikasi", d: "Login di {domain} menggunakan username dan password dari admin." },
      { t: "Masuk ke inbox", d: "Anda diarahkan langsung ke Inbox Omnichannel untuk merespons percakapan pelanggan." },
      { t: "Takeover & handoff", d: "Ambil alih dari AI saat perlu, lalu handoff lead ke MR/admin untuk closing." },
    ] },
    { id: "pic", label: "PIC Agent Officer", badge: "PA", desc: "Pengawas operasional agen: pantau conversation, inventory, dan kinerja tim.", modules: ["ims", "omni", "social", "crm", "insight", "dashboard"], steps: [
      { t: "Akun dibuat admin", d: "Owner/admin membuat akun Anda dengan peran PIC Agent Officer." },
      { t: "Buka domain aplikasi", d: "Login di {domain} menggunakan username dan password dari admin." },
      { t: "Masuk ke sidebar PIC", d: "Anda mendapatkan sidebar khusus: conversations, inventory, analytics, social, sales, system." },
      { t: "Pantau & tinjau", d: "Pantau percakapan, data stok, dan insight untuk evaluasi operasional tim." },
    ] },
    { id: "management", label: "Management / Dirut", badge: "MG", desc: "Manajemen & Presiden Direktur: insight, keuangan, dan pengawasan seluruh tenant.", modules: ["ims", "omni", "social", "crm", "dashboard", "insight"], steps: [
      { t: "Login sebagai management", d: "Masuk di {domain} dengan akun yang berperan Management / President Director." },
      { t: "Lihat insight strategis", d: "Akses One Dashboard dan analytics untuk membaca tren, profit, dan aging stok." },
      { t: "Pantau seluruh cabang", d: "Tinjau performa penjualan, infloat, dan konversi lintas lokasi." },
      { t: "Tindak lanjuti", d: "Gunakan data insight untuk memutuskan langkah selanjutnya bersama tim leaders." },
    ] },
  ];
  // Walkthrough setup WhatsApp — selaras modul di depan user dan alur Integrasi Manager
  // di produksi (Pengaturan → Integrasi → pilih WhatsApp Sales/Falcon atau
  // WhatsApp Call Center/Jasmine → Buat Kode QR → tautkan perangkat di WhatsApp).
  var WA_AGENTS = [
    {
      id: "falcon",
      module: "ims",
      label: "Falcon",
      type: "WhatsApp Sales",
      badge: "FA",
      tab: "Falcon · Sales",
      moduleLabel: "Modul Inventory",
      desc: "Asisten sales dan operasional internal. Menjawab lewat WhatsApp dengan stok unit, foto, simulasi kredit, follow-up, dan handoff.",
      steps: [
        { t: "Buka Integrasi", d: "Login sebagai owner, buka Pengaturan → Integrasi, lalu pilih WhatsApp Sales (Falcon)." },
        { t: "Buat kode QR", d: "Klik “Buat Kode QR” untuk menghasilkan kode tautan perangkat Sales." },
        { t: "Siapkan nomor kantor", d: "Gunakan nomor WhatsApp khusus sales. Di ponsel, gunakan satu akun untuk perangkat ini." },
        { t: "Tautkan perangkat", d: "Di WhatsApp: Menu/Pengaturan → Perangkat Tertaut → Tautkan Perangkat, lalu arahkan kamera ke kode QR." },
        { t: "Cek status Terhubung", d: "Setelah tertaut, status berubah menjadi Terhubung. Falcon siap melayani chat: cek stok, kirim foto unit, dan simulasi kredit." },
        { t: "Mulai uji coba", d: "Kirim pesan WA pertama ke nomor tersebut (mis. “cek unit XLR ready”). Balasan otomatis Falcon masuk dalam hitungan detik." },
      ],
      tools: ["Cek stok", "Kirim foto", "Simulasi kredit", "Follow-up lead", "Handoff"],
      caption: "Contoh balasan Falcon di nomor WhatsApp Sales setelah terhubung.",
      phone: {
        name: "Falcon · Motovax Sales",
        avatar: "FA",
        messages: [
          { from: "you", text: "Cek unit XLR Pro yang ready dong" },
          { from: "ai", text: "Halo, stok XLR Pro putih ada. 📷 Kirim foto?" },
          { from: "you", text: "Boleh, sekalian simulasi kredit" },
          { from: "ai", text: "Siap. 48x ± Rp 12,6 jt/bulan. Mau coba test drive?" },
        ],
      },
    },
    {
      id: "jasmine",
      module: "omni",
      label: "Jasmine",
      type: "WhatsApp Call Center",
      badge: "JA",
      tab: "Jasmine · Call Center",
      moduleLabel: "Modul Omnichannel",
      desc: "Asisten customer service dan call center. Menyapa, menjawab rutin, menangkap konteks lead, lalu mengambil alih/handoff ke tim.",
      steps: [
        { t: "Buka Integrasi", d: "Login sebagai owner, buka Pengaturan → Integrasi, lalu pilih WhatsApp Call Center (Jasmine)." },
        { t: "Buat kode QR", d: "Klik “Buat Kode QR” untuk menghasilkan kode tautan perangkat Call Center." },
        { t: "Siapkan nomor CS", d: "Gunakan nomor WhatsApp yang dipakai chat pelanggan. Jangan tautkan sebagai akun utama di ponsel pribadi." },
        { t: "Tautkan perangkat", d: "Di WhatsApp: Menu/Pengaturan → Perangkat Tertaut → Tautkan Perangkat, lalu pindai kode. Verifikasi passkey bila diminta WhatsApp." },
        { t: "Cek status Terhubung", d: "Status menjadi Terhubung. Jasmine online di Call Center: menyapa, menjawab rutin, dan memberi konteks untuk agent." },
        { t: "Aktifkan omnichannel", d: "Conversation masuk ke Inbox Omnichannel (WA/IG/Messenger). Agent bisa takeover dan handoff lead ke MR dari sana." },
      ],
      tools: ["Sapa & jawab rutin", "Konteks lead", "Takeover agent", "Handoff MR"],
      caption: "Contoh percakapan Jasmine di nomor WhatsApp Call Center setelah terhubung.",
      phone: {
        name: "Jasmine · Motovax CS",
        avatar: "JA",
        messages: [
          { from: "you", text: "Mau lihat unit & proses kredit gimana?" },
          { from: "ai", text: "Halo, saya Jasmine 👋 Bisa cek jadwal kunjungan & simulasi." },
          { from: "ai", text: "Kapan kira-kira Anda bisa ke diler?" },
          { from: "you", text: "Sabtu pagi bisa?" },
          { from: "ai", text: "Slot Sabtu 10.00 ada. Agen kami konfirmasi ya 🙏" },
        ],
      },
    },
  ];
  var GOAL_LABELS = {
    conversion: "Tingkatkan konversi",
    response: "Percepat respon lead",
    inventory: "Kontrol stok & aging",
    scale: "Scale multi-lokasi",
  };
  var AUTH_LEAD = "Buat akun Motovax menggunakan email kerja atau akun Google Anda.";
  var GOOGLE_AUTH_ORIGIN = "https://onboard.motovax.com";
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var loaded = Object.assign(defaultState(), JSON.parse(raw));
      if (loaded.account) delete loaded.account.password;
      return loaded;
    } catch (e) {
      return defaultState();
    }
  }

  function defaultState() {
    return {
      step: 1,
      authMode: "signup",
      onboardingMode: "",
      walkthroughRole: "owner",
      waAgent: "falcon",
      account: { fullName: "", email: "", password: "" },
      business: {
        businessName: "",
        workspaceSlug: "",
        branchCount: "4-10",
        region: "",
        industry: "general",
        description: "",
      },
      modules: ["ims", "omni", "crm"],
      goal: "conversion",
      completed: false,
      workspace: null,
      meeting: null,
    };
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore quota */
    }
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function api(path, options) {
    options = options || {};
    options.credentials = "same-origin";
    options.headers = Object.assign(
      { Accept: "application/json", "Content-Type": "application/json" },
      options.headers || {},
    );
    return fetch(path, options).then(function (response) {
      if (response.status === 204) return null;
      return response.json().catch(function () { return {}; }).then(function (payload) {
        if (!response.ok) {
          var error = new Error(payload.message || "Permintaan belum berhasil. Silakan coba lagi.");
          error.status = response.status;
          error.code = payload.error;
          throw error;
        }
        return payload;
      });
    }).catch(function (error) {
      if (error && typeof error.status === "number") throw error;
      var networkError = new Error("Koneksi ke server terputus. Periksa internet Anda, lalu coba lagi.");
      networkError.code = "network_error";
      throw networkError;
    });
  }

  function setFormLoading(form, loading) {
    if (!form) return;
    var submitButton = qs('button[type="submit"]', form);
    if (submitButton) {
      if (loading) {
        if (!submitButton.dataset.originalHtml) submitButton.dataset.originalHtml = submitButton.innerHTML;
        submitButton.textContent = submitButton.dataset.loadingLabel || "Memproses…";
        submitButton.setAttribute("aria-busy", "true");
      } else {
        if (submitButton.dataset.originalHtml) submitButton.innerHTML = submitButton.dataset.originalHtml;
        submitButton.removeAttribute("aria-busy");
      }
    }
    qsa("button, input, select, textarea", form).forEach(function (element) {
      element.disabled = loading;
    });
    form.classList.toggle("is-loading", loading);
  }

  function friendlySubmitError(error, fallback) {
    if (!error) return fallback || "Proses belum berhasil. Silakan coba lagi.";
    if (error.code === "network_error") return error.message;
    if (error.status === 401) return "Sesi Anda sudah berakhir. Muat ulang halaman, lalu masuk atau daftar kembali.";
    if (error.status === 429) return "Terlalu banyak percobaan. Tunggu beberapa menit sebelum mencoba kembali.";
    if (error.status >= 500) return "Layanan sedang mengalami gangguan. Data Anda belum dikirim; silakan coba lagi beberapa saat.";
    return error.message || fallback || "Proses belum berhasil. Periksa isian Anda lalu coba lagi.";
  }

  function clearPasswordFields(form) {
    if (!form) return;
    qsa('input[type="password"], input[data-password-revealed]', form).forEach(function (input) {
      input.value = "";
      input.type = "password";
      input.removeAttribute("data-password-revealed");
    });
    qsa("[data-password-toggle]", form).forEach(function (toggle) {
      var label = toggle.dataset.passwordLabel || "password";
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Tampilkan " + label);
    });
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function loadRecaptchaScript(siteKey) {
    if (window.grecaptcha && window.grecaptcha.enterprise) return Promise.resolve();
    var existing = document.querySelector('script[data-motovax-recaptcha]');
    if (existing) {
      return new Promise(function (resolve, reject) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      });
    }
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/enterprise.js?render=" + encodeURIComponent(siteKey);
      script.async = true;
      script.defer = true;
      script.dataset.motovaxRecaptcha = "true";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", function () {
        reject(new Error("Proteksi keamanan gagal dimuat. Periksa koneksi lalu muat ulang halaman."));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  function routeContentLinksToLanding() {
    qsa("a[href]").forEach(function (link) {
      if (
        link.matches("[data-google-login]") ||
        link.closest("[data-reset-form]") ||
        link.closest(".onboarding-recaptcha-disclosure")
      ) return;
      var href = link.getAttribute("href");
      if (!href || /^(?:mailto:|tel:|javascript:)/i.test(href)) return;
      var target = new URL(href, "https://motovax.ai/");
      link.href = "https://motovax.ai" + target.pathname + target.search + target.hash;
    });
  }

  function OnboardingApp() {
    var isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    if (window.location.origin !== GOOGLE_AUTH_ORIGIN && !isLocal) {
      window.location.replace(GOOGLE_AUTH_ORIGIN + "/onboarding.html" + window.location.search + window.location.hash);
      return;
    }
    var mobileTrigger = qs("[data-mobile-nav-trigger]");
    if (mobileTrigger) mobileTrigger.remove();
    routeContentLinksToLanding();
    this.root = document.body;
    this.state = loadState();
    this.toastTimer = null;
    this.workspacePollTimer = null;
    this.slugCheckTimer = null;
    this.slugAvailability = { slug: "", available: null };
    this.recaptchaConfigPromise = this.prepareRecaptcha();

    this.steps = qsa("[data-step]");
    this.railItems = qsa("[data-rail-step]");
    this.progressBar = qs("[data-onboarding-progress]");
    this.toast = qs("[data-onboarding-toast]");

    this.signupForm = qs('[data-auth-form="signup"]');
    this.resetForm = qs("[data-reset-form]");
    this.businessForm = qs("[data-business-form]");
    this.modulesForm = qs("[data-modules-form]");
    this.meetingForm = qs("[data-meeting-form]");
    this.industryGrid = qs("[data-industry-grid]");
    this.goalGrid = qs("[data-goal-grid]");
    this.openWorkspace = qs("[data-open-workspace]");
    this.walkthrough = qs("[data-login-walkthrough]");
    this.roleList = qs("[data-role-list]");
    this.rolePanel = qs("[data-role-panel]");
    this.waWalk = qs("[data-wa-walkthrough]");
    this.waTabs = qs("[data-wa-tabs]");
    this.waPanel = qs("[data-wa-panel]");

    this.bind();
    this.hydrate();
    // Workspace aktif hanya boleh berasal dari session server, bukan localStorage lama.
    this.goTo(1, { silent: true });
    var initialParams = new URLSearchParams(window.location.search);
    if (initialParams.get("reset") === "1" && initialParams.get("token")) this.showResetForm();
    this.hydrateGoogleSession();
  }

  OnboardingApp.prototype.prepareRecaptcha = function () {
    return api("/api/config")
      .then(function (payload) {
        var config = payload && payload.recaptcha;
        if (!config || !config.enabled || !config.siteKey || !config.action) {
          throw new Error("Proteksi keamanan belum tersedia. Hubungi tim MOTOVAX.");
        }
        return loadRecaptchaScript(config.siteKey).then(function () { return config; });
      })
      .catch(function (error) {
        return { enabled: false, error: error.message || "Proteksi keamanan belum tersedia." };
      });
  };

  OnboardingApp.prototype.getRecaptchaToken = async function () {
    var config = await this.recaptchaConfigPromise;
    if (!config || !config.enabled || !window.grecaptcha || !window.grecaptcha.enterprise) {
      throw new Error(config && config.error || "Proteksi keamanan belum siap. Muat ulang halaman dan coba lagi.");
    }
    return new Promise(function (resolve, reject) {
      window.grecaptcha.enterprise.ready(function () {
        window.grecaptcha.enterprise.execute(config.siteKey, { action: config.action })
          .then(resolve)
          .catch(function () {
            reject(new Error("Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi."));
          });
      });
    });
  };

  OnboardingApp.prototype.bind = function () {
    var self = this;

    qsa("[data-password-toggle]").forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var input = document.getElementById(toggle.getAttribute("aria-controls"));
        if (!input) return;
        var reveal = input.type === "password";
        var label = toggle.dataset.passwordLabel || "password";
        input.type = reveal ? "text" : "password";
        input.toggleAttribute("data-password-revealed", reveal);
        toggle.setAttribute("aria-pressed", reveal ? "true" : "false");
        toggle.setAttribute("aria-label", (reveal ? "Sembunyikan " : "Tampilkan ") + label);
        input.focus({ preventScroll: true });
      });
    });

    qsa(".onboarding-form input, .onboarding-form select, .onboarding-form textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        field.removeAttribute("aria-invalid");
        var form = field.closest("form");
        var error = form && qs("[data-form-error]", form);
        if (error && !error.hidden) {
          error.hidden = true;
          error.textContent = "";
        }
      });
    });

    if (this.signupForm) {
      this.signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.submitSignup();
      });
    }

    if (this.resetForm) {
      this.resetForm.addEventListener("submit", function (event) {
        event.preventDefault();
        self.submitResetPassword();
      });
    }

    var googleBtn = qs("[data-google-login]");
    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        googleBtn.classList.add("is-loading");
        googleBtn.setAttribute("aria-label", "Mengalihkan ke Google");
      });
    }

    if (this.businessForm) {
      this.businessForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.submitBusiness();
      });
      var slugInput = this.businessForm.workspaceSlug;
      if (slugInput) {
        slugInput.addEventListener("input", function () {
          slugInput.value = slugInput.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
          var formError = qs("[data-form-error]", self.businessForm);
          if (formError) {
            formError.hidden = true;
            formError.textContent = "";
          }
          self.slugAvailability = { slug: "", available: null };
          window.clearTimeout(self.slugCheckTimer);
          if (!self.validWorkspaceSlug(slugInput.value)) {
            self.setSlugStatus("idle", "Isi sendiri 3–40 karakter: huruf kecil, angka, dan tanda hubung.");
            return;
          }
          self.setSlugStatus("checking", "Memeriksa ketersediaan workspace…");
          self.slugCheckTimer = window.setTimeout(function () {
            self.checkWorkspaceAvailability();
          }, 400);
        });
        slugInput.addEventListener("blur", function () {
          window.clearTimeout(self.slugCheckTimer);
          if (self.validWorkspaceSlug(slugInput.value)) self.checkWorkspaceAvailability();
        });
      }
    }

    qsa("[data-onboarding-choice]").forEach(function (choice) {
      choice.addEventListener("click", function () {
        var mode = choice.getAttribute("data-onboarding-choice");
        self.state.onboardingMode = mode;
        saveState(self.state);
        if (mode === "self") {
          self.goTo(3);
          return;
        }
        self.showMeetingForm();
      });
    });

    var pathBackAccount = qs("[data-path-back-account]");
    if (pathBackAccount) pathBackAccount.addEventListener("click", function () {
      self.goTo(1);
    });

    if (this.meetingForm) {
      this.meetingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        self.submitMeeting();
      });
    }
    var meetingCancel = qs("[data-meeting-cancel]");
    if (meetingCancel) meetingCancel.addEventListener("click", function () { self.hideMeetingForm(); });
    var meetingBackAccount = qs("[data-meeting-back-account]");
    if (meetingBackAccount) meetingBackAccount.addEventListener("click", function () {
      self.hideMeetingForm();
      self.goTo(1);
    });
    var changeMeeting = qs("[data-change-meeting]");
    if (changeMeeting) changeMeeting.addEventListener("click", function () {
      self.goTo(2);
      self.showMeetingForm();
    });

    if (this.modulesForm) {
      this.modulesForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.submitModules();
      });
    }

    qsa("[data-step-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.goTo(Math.max(1, self.state.step - 1));
      });
    });

    if (this.industryGrid) {
      qsa("[data-industry]", this.industryGrid).forEach(function (card) {
        card.addEventListener("click", function () {
          self.selectIndustry(card.getAttribute("data-industry"));
        });
      });
    }

    if (this.goalGrid) {
      qsa("[data-goal]", this.goalGrid).forEach(function (chip) {
        chip.addEventListener("click", function () {
          self.selectGoal(chip.getAttribute("data-goal"));
        });
      });
    }

    var resetBtn = qs("[data-onboarding-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        self.state = defaultState();
        saveState(self.state);
        self.hydrate();
        self.goTo(1);
        self.showToast("Onboarding direset", "Anda bisa mengisi ulang dari langkah akun.");
      });
    }

    if (this.openWorkspace) {
      this.openWorkspace.addEventListener("click", function () {
        self.enterWorkspace();
      });
    }

    if (this.roleList) {
      this.roleList.addEventListener("click", function (event) {
        var button = event.target.closest("[data-wt-role]");
        if (!button) return;
        self.setWalkthroughRole(button.getAttribute("data-wt-role"));
      });
    }
    var wtPrev = qs("[data-wt-prev]");
    var wtNext = qs("[data-wt-next]");
    if (wtPrev) wtPrev.addEventListener("click", function () { self.stepWalkthroughRole(-1); });
    if (wtNext) wtNext.addEventListener("click", function () { self.stepWalkthroughRole(1); });

    if (this.waTabs) {
      this.waTabs.addEventListener("click", function (event) {
        var button = event.target.closest("[data-wa-tab]");
        if (!button) return;
        self.setWaAgent(button.getAttribute("data-wa-tab"));
      });
    }
    var waPrev = qs("[data-wa-prev]");
    var waNext = qs("[data-wa-next]");
    if (waPrev) waPrev.addEventListener("click", function () { self.stepWaAgent(-1); });
    if (waNext) waNext.addEventListener("click", function () { self.stepWaAgent(1); });

    // Deep-link: ?step=2. Parameter mode lama diabaikan karena portal ini signup-only.
    var params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1" && params.get("token")) {
      this.showResetForm();
    }
    var stepParam = parseInt(params.get("step"), 10);
    if (stepParam >= 1 && stepParam <= 5) {
      this.state.step = stepParam;
    }
  };

  OnboardingApp.prototype.setAuthMode = function () {
    this.state.authMode = "signup";

    if (this.signupForm) {
      this.signupForm.hidden = false;
      this.signupForm.style.display = "";
      this.signupForm.setAttribute("aria-hidden", "false");
    }
    if (this.resetForm) this.resetForm.hidden = true;
    var divider = qs(".onboarding-auth-divider");
    var googleButton = qs("[data-google-login]");
    if (divider) divider.hidden = false;
    if (googleButton) googleButton.hidden = false;

    var lead = qs("[data-auth-lead]");
    if (lead) lead.textContent = AUTH_LEAD;

    var googleBtn = qs("[data-google-login]");
    if (googleBtn) {
      googleBtn.setAttribute(
        "href",
        GOOGLE_AUTH_ORIGIN +
          "/api/auth/google/start?mode=signup",
      );
    }

    this.clearErrors();
    saveState(this.state);
  };

  OnboardingApp.prototype.showResetForm = function () {
    if (!this.resetForm) return;
    if (this.signupForm) this.signupForm.hidden = true;
    this.resetForm.hidden = false;
    var divider = qs(".onboarding-auth-divider");
    var googleButton = qs("[data-google-login]");
    if (divider) divider.hidden = true;
    if (googleButton) googleButton.hidden = true;
    var lead = qs("[data-auth-lead]");
    if (lead) lead.textContent = "Buat password baru untuk akun Motovax Anda.";
  };

  OnboardingApp.prototype.submitResetPassword = async function () {
    var form = this.resetForm;
    var data = new FormData(form);
    var password = String(data.get("password") || "");
    var confirmation = String(data.get("passwordConfirm") || "");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      this.showError(form, "Password baru belum memenuhi syarat: gunakan minimal 8 karakter yang berisi huruf dan angka.", "password");
      return;
    }
    if (password !== confirmation) {
      this.showError(form, "Konfirmasi password baru tidak sama. Ketik ulang password yang sama persis.", "passwordConfirm");
      return;
    }
    setFormLoading(form, true);
    try {
      var params = new URLSearchParams(window.location.search);
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: params.get("token"), password: password }),
      });
      window.history.replaceState({}, "", window.location.pathname);
      clearPasswordFields(form);
      this.setAuthMode();
      this.showToast("Password berhasil diperbarui", "Masuk melalui domain workspace Anda.");
    } catch (error) {
      this.showError(form, friendlySubmitError(error, "Password belum berhasil diperbarui. Periksa tautan reset lalu coba lagi."));
    } finally {
      setFormLoading(form, false);
    }
  };

  OnboardingApp.prototype.showMeetingForm = function () {
    var pathGrid = qs(".onboarding-path-grid");
    var pathActions = qs("[data-path-actions]");
    if (pathGrid) pathGrid.hidden = true;
    if (pathActions) pathActions.hidden = true;
    if (this.meetingForm) this.meetingForm.hidden = false;
  };

  OnboardingApp.prototype.hideMeetingForm = function () {
    var pathGrid = qs(".onboarding-path-grid");
    var pathActions = qs("[data-path-actions]");
    if (pathGrid) pathGrid.hidden = false;
    if (pathActions) pathActions.hidden = false;
    if (this.meetingForm) this.meetingForm.hidden = true;
    this.state.onboardingMode = "";
    saveState(this.state);
  };

  OnboardingApp.prototype.submitMeeting = async function () {
    var form = this.meetingForm;
    var data = new FormData(form);
    var date = String(data.get("date") || "");
    var time = String(data.get("time") || "");
    if (!date) {
      this.showError(form, "Tanggal meeting belum dipilih. Pilih hari Senin–Jumat yang tersedia.", "date");
      return;
    }
    if (!time) {
      this.showError(form, "Waktu meeting belum dipilih. Pilih salah satu slot waktu WIB.", "time");
      return;
    }
    var day = new Date(date + "T00:00:00Z").getUTCDay();
    if (day === 0 || day === 6) {
      this.showError(form, "Tanggal tersebut jatuh pada akhir pekan. Pilih hari Senin sampai Jumat.", "date");
      return;
    }
    setFormLoading(form, true);
    try {
      var recaptchaToken = await this.getRecaptchaToken();
      var payload = await api("/api/onboarding/meeting", {
        method: "POST",
        body: JSON.stringify({
          date: date,
          time: time,
          timezone: "Asia/Jakarta",
          recaptchaToken: recaptchaToken,
        }),
      });
      this.state.onboardingMode = "team";
      this.state.meeting = payload.meeting;
      this.state.workspace = null;
      this.state.completed = true;
      saveState(this.state);
      this.renderSummary();
      this.goTo(5);
      this.showToast("Jadwal pilihan diterima", "Tim Motovax akan mengirim detail meeting melalui email.");
    } catch (error) {
      this.showError(form, friendlySubmitError(error, "Jadwal belum berhasil dikirim. Periksa pilihan waktu lalu coba lagi."));
    } finally {
      setFormLoading(form, false);
    }
  };

  OnboardingApp.prototype.selectIndustry = function (id) {
    this.state.business.industry = id;
    qsa("[data-industry]", this.industryGrid).forEach(function (card) {
      var active = card.getAttribute("data-industry") === id;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-selected", active ? "true" : "false");
    });
    saveState(this.state);
  };

  OnboardingApp.prototype.selectGoal = function (id) {
    this.state.goal = id;
    qsa("[data-goal]", this.goalGrid).forEach(function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-goal") === id);
    });
    saveState(this.state);
  };

  OnboardingApp.prototype.clearErrors = function () {
    qsa("[data-form-error]").forEach(function (el) {
      el.hidden = true;
      el.textContent = "";
    });
    qsa('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
  };

  OnboardingApp.prototype.showError = function (form, message, field) {
    var err = qs("[data-form-error]", form);
    if (!err) return;
    if (!err.id) err.id = "onboardingFormError-" + (qsa("[data-form-error]").indexOf(err) + 1);
    err.hidden = false;
    err.textContent = message;
    if (field) {
      var target = typeof field === "string" ? form.elements[field] : field;
      if (target) {
        target.setAttribute("aria-invalid", "true");
        target.setAttribute("aria-describedby", err.id);
        target.focus({ preventScroll: true });
      }
    }
    err.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  OnboardingApp.prototype.submitSignup = async function () {
    var form = this.signupForm;
    var fd = new FormData(form);
    var fullName = String(fd.get("fullName") || "").trim();
    var email = String(fd.get("email") || "").trim().toLowerCase();
    var password = String(fd.get("password") || "");
    var confirm = String(fd.get("passwordConfirm") || "");

    if (fullName.length < 2) {
      this.showError(form, "Nama lengkap belum valid. Masukkan minimal 2 karakter.", "fullName");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showError(form, "Email kerja belum valid. Gunakan format seperti nama@perusahaan.com.", "email");
      return;
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      this.showError(form, "Password belum memenuhi syarat: gunakan minimal 8 karakter yang berisi huruf dan angka.", "password");
      return;
    }
    if (password !== confirm) {
      this.showError(form, "Konfirmasi password tidak sama. Ketik ulang password yang sama persis.", "passwordConfirm");
      return;
    }

    setFormLoading(form, true);
    try {
      var payload = await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ fullName: fullName, email: email, password: password }),
      });
      if (payload.verificationRequired) {
        this.showToast("Periksa email Anda", "Klik tautan verifikasi untuk melanjutkan onboarding.");
        clearPasswordFields(form);
        return;
      }
      this.applyAccountPayload(payload);
      clearPasswordFields(form);
      this.state.authMode = "signup";
      saveState(this.state);
      this.showToast("Akun berhasil dibuat", "Lanjut isi profil bisnis Anda.");
      this.goTo(2);
    } catch (error) {
      this.showError(form, friendlySubmitError(error, "Akun belum berhasil dibuat. Periksa isian lalu coba lagi."));
    } finally {
      setFormLoading(form, false);
    }
  };

  OnboardingApp.prototype.applyAccountPayload = function (payload) {
    if (!payload || !payload.user) return;
    this.state.account = {
      fullName: payload.user.fullName || payload.user.email.split("@")[0],
      email: payload.user.email,
      provider: payload.user.provider || "password",
    };
    if (payload.profile) {
      this.state.business = {
        businessName: payload.profile.business_name || "",
        workspaceSlug: payload.profile.workspace_slug || "",
        branchCount: payload.profile.branch_count || "1",
        region: payload.profile.region || "",
        industry: payload.profile.industry || "general",
        description: payload.profile.description || "",
      };
      this.state.modules = payload.profile.modules || this.state.modules;
      this.state.goal = payload.profile.goal || this.state.goal;
    } else {
      var clean = defaultState();
      this.state.business = clean.business;
      this.state.modules = clean.modules;
      this.state.goal = clean.goal;
    }
    if (payload.workspaces && payload.workspaces.length) {
      this.state.workspace = Object.assign({ ready: true }, payload.workspaces[0]);
      this.state.meeting = null;
      this.state.onboardingMode = "self";
      this.state.completed = true;
    } else if (payload.meeting) {
      this.state.workspace = null;
      this.state.meeting = {
        id: payload.meeting.id,
        scheduledFor: payload.meeting.scheduled_for || payload.meeting.scheduledFor,
        timezone: payload.meeting.timezone,
        status: payload.meeting.status,
      };
      this.state.onboardingMode = "team";
      this.state.completed = true;
    } else {
      this.state.workspace = null;
      this.state.meeting = null;
      this.state.completed = false;
    }
    this.hydrate();
  };

  OnboardingApp.prototype.hydrateGoogleSession = function () {
    var self = this;
    var params = new URLSearchParams(window.location.search);
    var oauthStatus = params.get("oauth");
    var emailStatus = params.get("email");
    var isAuthHost = window.location.origin === GOOGLE_AUTH_ORIGIN;
    var isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

    if (!isAuthHost && !isLocal) return;
    if (oauthStatus === "denied") {
      this.showToast("Pendaftaran Google dibatalkan", "Silakan coba lagi jika Anda ingin melanjutkan.");
      return;
    }
    if (oauthStatus === "failed") {
      this.showToast("Pendaftaran Google belum berhasil", "Silakan coba lagi atau hubungi tim MOTOVAX.");
      return;
    }
    if (emailStatus === "invalid") {
      this.showToast("Tautan verifikasi tidak valid", "Minta tautan baru dengan mengulangi proses daftar.");
    }

    fetch("/api/auth/me", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.status === 401) return { authenticated: false };
        if (!response.ok) throw new Error("Session belum dapat diperiksa.");
        return response.json();
      })
      .then(function (payload) {
        if (!payload || !payload.authenticated || !payload.user) {
          self.state = defaultState();
          saveState(self.state);
          self.hydrate();
          self.goTo(1, { silent: true });
          if (params.get("reset") === "1" && params.get("token")) self.showResetForm();
          return;
        }
        self.applyAccountPayload(payload);
        self.state.authMode = "signup";
        saveState(self.state);

        if (self.state.workspace || self.state.meeting) {
          self.goTo(5);
        } else {
          self.goTo(self.state.business.businessName ? 4 : 2);
        }
        if (oauthStatus === "success") {
          self.showToast("Akun Google berhasil didaftarkan", "Lanjut lengkapi onboarding Anda.");
          params.delete("oauth");
          params.delete("reason");
          var query = params.toString();
          window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : ""));
        } else if (emailStatus === "verified") {
          self.showToast("Email berhasil diverifikasi", "Lanjut lengkapi profil bisnis Anda.");
          params.delete("email");
          var emailQuery = params.toString();
          window.history.replaceState({}, "", window.location.pathname + (emailQuery ? "?" + emailQuery : ""));
        }
      })
      .catch(function () {
        if (oauthStatus === "success") {
          self.showToast("Session belum dapat dimuat", "Muat ulang halaman atau coba daftar kembali.");
        }
      });
  };

  OnboardingApp.prototype.submitBusiness = async function () {
    var form = this.businessForm;
    var fd = new FormData(form);
    var businessName = String(fd.get("businessName") || "").trim();
    var workspaceSlug = String(fd.get("workspaceSlug") || "").trim();
    var branchCount = String(fd.get("branchCount") || "1");
    var region = String(fd.get("region") || "").trim();
    var description = String(fd.get("description") || "").trim();

    if (businessName.length < 2) {
      this.showError(form, "Nama bisnis belum valid. Masukkan minimal 2 karakter.", "businessName");
      return;
    }
    if (region.length < 2) {
      this.showError(form, "Kota atau wilayah utama belum valid. Masukkan minimal 2 karakter.", "region");
      return;
    }
    if (!this.validWorkspaceSlug(workspaceSlug)) {
      this.showError(form, "Nama workspace belum valid. Gunakan 3–40 karakter berupa huruf kecil, angka, atau tanda hubung.", "workspaceSlug");
      return;
    }

    var industry = this.state.business.industry || "general";
    if (industry === "other") industry = "general";
    setFormLoading(form, true);
    try {
      var available = await this.checkWorkspaceAvailability();
      if (!available) {
        this.showError(form, "Nama workspace ini tidak tersedia. Coba nama lain yang lebih spesifik.", "workspaceSlug");
        return;
      }
      this.state.business = {
        businessName: businessName,
        workspaceSlug: workspaceSlug,
        branchCount: branchCount,
        region: region,
        industry: industry,
        description: description,
      };
      await this.saveProfile();
      saveState(this.state);
      this.showToast("Profil disimpan", "Pilih modul yang ingin diaktifkan.");
      this.goTo(4);
    } catch (error) {
      this.showError(form, friendlySubmitError(error, "Profil belum berhasil disimpan. Periksa isian lalu coba lagi."));
    } finally {
      setFormLoading(form, false);
    }
  };

  OnboardingApp.prototype.validWorkspaceSlug = function (slug) {
    return /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/.test(String(slug || ""));
  };

  OnboardingApp.prototype.setSlugStatus = function (state, message) {
    var status = qs("[data-slug-status]");
    if (!status) return;
    status.dataset.state = state;
    status.textContent = message;
  };

  OnboardingApp.prototype.checkWorkspaceAvailability = async function () {
    var input = this.businessForm && this.businessForm.workspaceSlug;
    var slug = String(input && input.value || "").trim();
    if (!this.validWorkspaceSlug(slug)) {
      this.slugAvailability = { slug: slug, available: false };
      this.setSlugStatus("unavailable", "Nama workspace belum valid.");
      return false;
    }
    if (this.slugAvailability.slug === slug && this.slugAvailability.available === true) {
      return true;
    }

    this.setSlugStatus("checking", "Memeriksa ketersediaan workspace…");
    try {
      var result = await api("/api/onboarding/slug?slug=" + encodeURIComponent(slug));
      if (String(input.value || "").trim() !== slug) return false;
      this.slugAvailability = { slug: slug, available: result.available === true };
      if (result.available) {
        this.setSlugStatus("available", "Tersedia: " + result.domain);
        return true;
      }
      this.setSlugStatus("unavailable", "Sudah digunakan atau tidak dapat dipakai. Pilih nama lain.");
      return false;
    } catch (error) {
      if (String(input.value || "").trim() !== slug) return false;
      this.slugAvailability = { slug: slug, available: false };
      this.setSlugStatus("unavailable", "Ketersediaan belum dapat diperiksa. Coba lagi.");
      return false;
    }
  };

  OnboardingApp.prototype.saveProfile = function () {
    return api("/api/onboarding/profile", {
      method: "POST",
      body: JSON.stringify({
        businessName: this.state.business.businessName,
        workspaceSlug: this.state.business.workspaceSlug,
        branchCount: this.state.business.branchCount,
        region: this.state.business.region,
        industry: this.state.business.industry,
        description: this.state.business.description,
        modules: this.state.modules,
        goal: this.state.goal,
      }),
    });
  };

  OnboardingApp.prototype.submitModules = async function () {
    var form = this.modulesForm;
    var checked = qsa('input[name="modules"]:checked', form).map(function (el) {
      return el.value;
    });

    if (!checked.length) {
      this.showError(form, "Belum ada modul yang dipilih. Aktifkan minimal satu modul untuk melanjutkan.", qs('input[name="modules"]', form));
      return;
    }

    this.state.modules = checked;
    setFormLoading(form, true);
    try {
      await this.saveProfile();
      var recaptchaToken = await this.getRecaptchaToken();
      var payload = await api("/api/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({ recaptchaToken: recaptchaToken }),
      });
      this.state.workspace = payload.workspace;
      this.state.meeting = null;
      this.state.onboardingMode = "self";
      this.state.completed = true;
      this.state.step = 5;
      saveState(this.state);
      this.renderSummary();
      this.showToast("Tenant berhasil dibuat", "Domain aplikasi sedang disiapkan. Halaman ini akan memperbarui status otomatis.");
      this.goTo(5);
      this.waitForWorkspace();
    } catch (error) {
      this.showError(form, friendlySubmitError(error, "Workspace belum berhasil dibuat. Pilihan Anda tetap tersimpan; silakan coba lagi."));
    } finally {
      setFormLoading(form, false);
    }
  };

  OnboardingApp.prototype.enterWorkspace = async function () {
    var workspace = this.state.workspace;
    if (!workspace) return;
    if (!workspace.ready) {
      this.showToast("Workspace sedang disiapkan", "Tunggu sampai domain HTTPS aktif sebelum masuk.");
      this.waitForWorkspace();
      return;
    }
    if (workspace.redirectUrl) {
      window.location.assign(workspace.redirectUrl);
      return;
    }
    this.openWorkspace.disabled = true;
    try {
      var payload = await api("/api/workspaces/" + encodeURIComponent(workspace.id) + "/enter", {
        method: "POST",
        body: "{}",
      });
      window.location.assign(payload.redirectUrl);
    } catch (error) {
      this.showToast("Workspace belum dapat dibuka", friendlySubmitError(error, "Tunggu beberapa saat lalu coba kembali."));
      this.openWorkspace.disabled = false;
    }
  };

  OnboardingApp.prototype.waitForWorkspace = function () {
    var self = this;
    var workspace = this.state.workspace;
    if (!workspace || workspace.ready || this.workspacePollTimer) return;
    var startedAt = Date.now();
    var poll = function () {
      api("/api/workspaces/" + encodeURIComponent(workspace.id) + "/status")
        .then(function (payload) {
          if (payload.ready) {
            self.state.workspace = Object.assign({}, workspace, payload.workspace, { ready: true });
            saveState(self.state);
            self.workspacePollTimer = null;
            self.renderSummary();
            self.showToast("Workspace siap digunakan", self.state.workspace.domain + " sudah aktif.");
            return;
          }
          if (Date.now() - startedAt > 8 * 60 * 1000) {
            self.workspacePollTimer = null;
            self.showToast("Provisioning masih berjalan", "Muat ulang halaman beberapa saat lagi untuk memeriksa status.");
            return;
          }
          self.workspacePollTimer = window.setTimeout(poll, 5000);
        })
        .catch(function () {
          self.workspacePollTimer = window.setTimeout(poll, 7000);
        });
    };
    this.workspacePollTimer = window.setTimeout(poll, 2000);
  };

  OnboardingApp.prototype.hydrate = function () {
    var acc = this.state.account || {};
    var biz = this.state.business || {};

    if (this.signupForm) {
      if (this.signupForm.fullName) this.signupForm.fullName.value = acc.fullName || "";
      if (this.signupForm.email) this.signupForm.email.value = acc.email || "";
    }
    if (this.businessForm) {
      if (this.businessForm.businessName) this.businessForm.businessName.value = biz.businessName || "";
      if (this.businessForm.workspaceSlug) this.businessForm.workspaceSlug.value = biz.workspaceSlug || "";
      if (this.businessForm.branchCount) this.businessForm.branchCount.value = biz.branchCount || "4-10";
      if (this.businessForm.region) this.businessForm.region.value = biz.region || "";
      if (this.businessForm.description) this.businessForm.description.value = biz.description || "";
    }
    if (this.meetingForm && this.meetingForm.date) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var maximum = new Date();
      maximum.setDate(maximum.getDate() + 90);
      this.meetingForm.date.min = tomorrow.toISOString().slice(0, 10);
      this.meetingForm.date.max = maximum.toISOString().slice(0, 10);
    }

    var industry = biz.industry || "general";
    if (industry === "other") industry = "general";
    this.selectIndustry(industry);
    this.selectGoal(this.state.goal || "conversion");
    this.setAuthMode();

    var selected = this.state.modules || [];
    qsa('input[name="modules"]').forEach(function (input) {
      input.checked = selected.indexOf(input.value) !== -1;
    });

    this.renderSummary();
  };

  OnboardingApp.prototype.renderSummary = function () {
    var acc = this.state.account || {};
    var biz = this.state.business || {};

    var nameEl = qs("[data-summary-name]");
    var userEl = qs("[data-summary-user]");
    var industryEl = qs("[data-summary-industry]");
    var branchesEl = qs("[data-summary-branches]");
    var regionEl = qs("[data-summary-region]");
    var goalEl = qs("[data-summary-goal]");
    var modulesEl = qs("[data-summary-modules]");
    var statusEl = qs("[data-workspace-status]");
    var meetingMode = Boolean(this.state.meeting && !this.state.workspace);
    var workspaceSummary = qs("[data-workspace-summary]");
    var meetingSummary = qs("[data-meeting-summary]");
    var workspaceActions = qs("[data-workspace-actions]");
    var meetingActions = qs("[data-meeting-actions]");
    var readyTitle = qs("[data-ready-title]");
    var readyCopy = qs("[data-ready-copy]");
    if (workspaceSummary) workspaceSummary.hidden = meetingMode;
    if (meetingSummary) meetingSummary.hidden = !meetingMode;
    if (workspaceActions) workspaceActions.hidden = meetingMode;
    if (meetingActions) meetingActions.hidden = !meetingMode;
    if (readyTitle) readyTitle.textContent = meetingMode ? "Jadwal onboarding telah diajukan" : "Workspace Anda siap digunakan";
    if (readyCopy) readyCopy.textContent = meetingMode
      ? "Tim Motovax akan mengonfirmasi jadwal dan mengirim detail meeting melalui email."
      : "Tenant, domain, akun owner, dan konfigurasi awal berhasil dibuat.";
    var meetingUser = qs("[data-meeting-user]");
    if (meetingUser && meetingMode) meetingUser.textContent = "Konfirmasi akan dikirim ke " + (acc.email || "email akun Anda") + ".";
    var meetingDatetime = qs("[data-meeting-datetime]");
    if (meetingDatetime && meetingMode) {
      meetingDatetime.textContent = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(this.state.meeting.scheduledFor)) + " WIB";
    }

    if (nameEl) nameEl.textContent = biz.businessName || "Bisnis Anda";
    if (userEl) {
      userEl.textContent = acc.fullName
        ? acc.fullName + " · " + (acc.email || "")
        : acc.email || "Siap masuk sebagai user demo";
    }
    if (industryEl) industryEl.textContent = INDUSTRY_LABELS[biz.industry] || INDUSTRY_LABELS.general;
    if (branchesEl) branchesEl.textContent = (biz.branchCount || "—") + " lokasi";
    if (regionEl) regionEl.textContent = biz.region || "—";
    if (goalEl) goalEl.textContent = GOAL_LABELS[this.state.goal] || GOAL_LABELS.conversion;

    if (modulesEl) {
      modulesEl.innerHTML = "";
      (this.state.modules || []).forEach(function (id) {
        var tag = document.createElement("span");
        tag.textContent = MODULE_LABELS[id] || id;
        modulesEl.appendChild(tag);
      });
    }

    var domainEl = qs("[data-summary-domain]");
    if (domainEl) {
      domainEl.textContent = this.state.workspace?.domain || (biz.workspaceSlug ? biz.workspaceSlug + ".motovax.com" : "—");
    }
    if (statusEl) statusEl.textContent = this.state.workspace?.ready ? "Tenant aktif" : "Menyiapkan domain";
    if (this.openWorkspace) {
      this.openWorkspace.disabled = !this.state.workspace?.ready;
      this.openWorkspace.innerHTML = this.state.workspace?.ready
        ? "Masuk ke workspace <span>→</span>"
        : "Menyiapkan workspace…";
    }
    this.renderWalkthrough();
    this.renderWaWalkthrough();
  };



  OnboardingApp.prototype.walkthroughDomain = function () {
    var workspace = this.state.workspace;
    if (workspace && workspace.domain) return workspace.domain;
    var slug = this.state.business && this.state.business.workspaceSlug;
    return slug ? slug + ".motovax.com" : "nama-workspace.motovax.com";
  };

  OnboardingApp.prototype.activeWalkthroughRole = function () {
    var stored = this.state.walkthroughRole;
    for (var i = 0; i < LOGIN_ROLES.length; i += 1) {
      if (LOGIN_ROLES[i].id === stored) return i;
    }
    return 0;
  };

  OnboardingApp.prototype.setWalkthroughRole = function (id) {
    for (var i = 0; i < LOGIN_ROLES.length; i += 1) {
      if (LOGIN_ROLES[i].id === id) {
        this.state.walkthroughRole = id;
        saveState(this.state);
        this.renderWalkthrough();
        return;
      }
    }
  };

  OnboardingApp.prototype.stepWalkthroughRole = function (delta) {
    if (!LOGIN_ROLES.length) return;
    var current = this.activeWalkthroughRole();
    var next = (current + delta + LOGIN_ROLES.length) % LOGIN_ROLES.length;
    this.setWalkthroughRole(LOGIN_ROLES[next].id);
  };

  OnboardingApp.prototype.renderWalkthrough = function () {
    if (!this.roleList || !this.rolePanel) return;
    var activeModules = this.state.modules || [];
    var index = this.activeWalkthroughRole();
    var role = LOGIN_ROLES[index];
    var domain = this.walkthroughDomain();

    this.roleList.innerHTML = "";
    LOGIN_ROLES.forEach(function (item, i) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "onboarding-wt-role" + (i === index ? " is-active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", i === index ? "true" : "false");
      button.setAttribute("data-wt-role", item.id);
      button.innerHTML = "<span class='onboarding-wt-role-badge'>" + item.badge + "</span>" +
        "<b>" + item.label + "</b>";
      this.roleList.appendChild(button);
    }, this);

    var badge = qs("[data-role-badge]", this.rolePanel);
    var name = qs("[data-role-name]", this.rolePanel);
    var desc = qs("[data-role-desc]", this.rolePanel);
    var steps = qs("[data-role-steps]", this.rolePanel);
    var modulesEl = qs("[data-role-modules]", this.rolePanel);
    var counter = qs("[data-role-counter]", this.rolePanel);

    if (badge) badge.textContent = role.badge;
    if (name) name.textContent = role.label;
    if (desc) desc.textContent = role.desc;

    if (steps) {
      steps.innerHTML = "";
      role.steps.forEach(function (step, i) {
        var li = document.createElement("li");
        var t = document.createElement("b");
        var d = document.createElement("small");
        t.textContent = (i + 1) + ". " + step.t;
        d.textContent = step.d.replace(/\{domain\}/g, domain);
        li.appendChild(t);
        li.appendChild(d);
        steps.appendChild(li);
      });
    }

    if (modulesEl) {
      modulesEl.innerHTML = "";
      var activeForRole = role.modules.filter(function (id) {
        return activeModules.indexOf(id) !== -1;
      });
      if (!activeForRole.length) {
        var hint = document.createElement("small");
        hint.className = "onboarding-wt-modules-empty";
        hint.textContent = "Belum ada modul aktif untuk peran ini. Aktifkan modul terkait pada langkah sebelumnya agar akses peran terlihat.";
        modulesEl.appendChild(hint);
      } else {
        activeForRole.forEach(function (id) {
          var chip = document.createElement("span");
          chip.textContent = MODULE_LABELS[id] || id;
          modulesEl.appendChild(chip);
        });
      }
    }

    if (counter) counter.textContent = "Peran " + (index + 1) + " dari " + LOGIN_ROLES.length;
    this.rolePanel.hidden = false;

    var meetingMode = Boolean(this.state.meeting && !this.state.workspace);
    if (this.walkthrough) this.walkthrough.hidden = meetingMode;
  };

  OnboardingApp.prototype.availableWaAgents = function () {
    var activeModules = this.state.modules || [];
    return WA_AGENTS.filter(function (agent) {
      return activeModules.indexOf(agent.module) !== -1;
    });
  };

  OnboardingApp.prototype.activeWaAgent = function () {
    var list = this.availableWaAgents();
    var stored = this.state.waAgent;
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === stored) return i;
    }
    return 0;
  };

  OnboardingApp.prototype.setWaAgent = function (id) {
    for (var i = 0; i < WA_AGENTS.length; i += 1) {
      if (WA_AGENTS[i].id === id) {
        this.state.waAgent = id;
        saveState(this.state);
        this.renderWaWalkthrough();
        return;
      }
    }
  };

  OnboardingApp.prototype.stepWaAgent = function (delta) {
    var list = this.availableWaAgents();
    if (!list.length) return;
    var current = this.activeWaAgent();
    var next = (current + delta + list.length) % list.length;
    this.setWaAgent(list[next].id);
  };

  OnboardingApp.prototype.renderWaWalkthrough = function () {
    var meetingMode = Boolean(this.state.meeting && !this.state.workspace);
    var list = this.availableWaAgents();
    if (!this.waWalk) return;
    if (!list.length || meetingMode) {
      this.waWalk.hidden = true;
      return;
    }
    if (!this.waTabs || !this.waPanel) return;

    var index = this.activeWaAgent();
    var agent = list[index];
    var domain = this.walkthroughDomain();

    this.waWalk.hidden = false;
    this.waTabs.innerHTML = "";
    list.forEach(function (item, i) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "onboarding-wa-tab" + (i === index ? " is-active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", i === index ? "true" : "false");
      button.setAttribute("data-wa-tab", item.id);
      button.innerHTML = "<span class='onboarding-wt-role-badge'>" + item.badge + "</span>" +
        "<b>" + item.tab + "</b><small>" + item.moduleLabel + "</small>";
      this.waTabs.appendChild(button);
    }, this);

    var badge = qs("[data-wa-badge]", this.waPanel);
    var name = qs("[data-wa-name]", this.waPanel);
    var desc = qs("[data-wa-desc]", this.waPanel);
    var steps = qs("[data-wa-steps]", this.waPanel);
    var counter = qs("[data-wa-counter]", this.waPanel);

    if (badge) badge.textContent = agent.badge + " · " + agent.type;
    if (name) name.textContent = agent.label + " — " + agent.type;
    if (desc) desc.textContent = agent.desc;
    if (steps) {
      steps.innerHTML = "";
      agent.steps.forEach(function (step, i) {
        var li = document.createElement("li");
        var t = document.createElement("b");
        var d = document.createElement("small");
        t.textContent = "Langkah " + (i + 1) + ". " + step.t;
        d.textContent = step.d.replace(/\{domain\}/g, domain);
        li.appendChild(t);
        li.appendChild(d);
        steps.appendChild(li);
      });
    }
    if (counter) counter.textContent = "Agent " + (index + 1) + " dari " + list.length;
    this.waPanel.hidden = false;

    this.renderWaPhone(agent);
  };

  OnboardingApp.prototype.renderWaPhone = function (agent) {
    var phone = qs("[data-wa-phone]");
    if (!phone) return;
    var name = qs("[data-wa-phone-name]", phone);
    var avatar = qs("[data-wa-phone-avatar]", phone);
    var status = qs("[data-wa-phone-status]", phone);
    var chat = qs("[data-wa-chat]", phone);
    var tools = qs("[data-wa-phone-tools]", phone);
    var caption = qs("[data-wa-phone-caption]", phone);
    var p = agent.phone;

    if (name) name.textContent = p.name;
    if (avatar) avatar.textContent = p.avatar || agent.badge;
    if (status) status.textContent = "terhubung";
    if (caption) caption.textContent = agent.caption;

    if (chat) {
      chat.innerHTML = "";
      (p.messages || []).forEach(function (msg) {
        var bubble = document.createElement("div");
        bubble.className = "onboarding-wa-msg " + (msg.from === "you" ? "is-you" : "is-ai");
        bubble.textContent = msg.text;
        chat.appendChild(bubble);
      });
    }
    if (tools) {
      tools.innerHTML = "";
      (agent.tools || []).forEach(function (tool) {
        var chip = document.createElement("span");
        chip.textContent = tool;
        tools.appendChild(chip);
      });
    }
  };

  OnboardingApp.prototype.goTo = function (step, opts) {
    opts = opts || {};
    step = Math.min(5, Math.max(1, step));
    this.state.step = step;
    if (!opts.silent) saveState(this.state);

    this.steps.forEach(function (panel) {
      var n = parseInt(panel.getAttribute("data-step"), 10);
      var active = n === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    var teamCompletion = this.state.onboardingMode === "team" && step === 5;
    var railCopies = {
      3: "Organisasi & cabang",
      4: "Fokus first value",
    };
    this.railItems.forEach(function (item) {
      var n = parseInt(item.getAttribute("data-rail-step"), 10);
      var skipped = teamCompletion && (n === 3 || n === 4);
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-done", n < step && !skipped);
      item.classList.toggle("is-skipped", skipped);
      var copy = qs("small", item);
      if (copy && railCopies[n]) copy.textContent = skipped ? "Dibahas bersama tim" : railCopies[n];
    });

    if (this.progressBar) {
      this.progressBar.style.setProperty("--p", step * 20 + "%");
    }

    if (step === 5) this.renderSummary();

    if (!opts.silent) {
      var panel = qs('.onboarding-panel');
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  OnboardingApp.prototype.showToast = function (title, copy) {
    if (!this.toast) return;
    var t = qs("[data-toast-title]", this.toast);
    var c = qs("[data-toast-copy]", this.toast);
    if (t) t.textContent = title;
    if (c) c.textContent = copy;
    this.toast.hidden = false;
    clearTimeout(this.toastTimer);
    var self = this;
    this.toastTimer = setTimeout(function () {
      self.toast.hidden = true;
    }, 3200);
  };

  function bootOnboarding() {
    if (!qs("[data-step]")) return;
    if (window.motovaxOnboarding) return;
    window.motovaxOnboarding = new OnboardingApp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootOnboarding);
  } else {
    bootOnboarding();
  }
})();
