(function () {
  "use strict";

  var STORAGE_KEY = "motovax_onboarding_v1";
  var INDUSTRY_LABELS = {
    automotive: "Dealer mobil",
  };
  var MODULE_LABELS = {
    ims: "Inventory",
    omni: "Omnichannel",
    social: "Social & Ads",
    crm: "Autopilot CRM",
    dashboard: "One Dashboard",
    insight: "Data Insight",
  };
  var GOAL_LABELS = {
    conversion: "Tingkatkan konversi",
    response: "Percepat respon lead",
    inventory: "Kontrol stok & aging",
    scale: "Scale multi-lokasi",
  };
  var GOOGLE_AUTH_ORIGIN = "https://onboard.motovax.com";
  var API_REQUEST_TIMEOUT_MS = 10000;
  var RECAPTCHA_TIMEOUT_MS = 20000;
  var WORKSPACE_SETUP_TIMEOUT_MS = 15000;
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
      pendingVerification: null,
      onboardingMode: "self",
      account: { fullName: "", email: "", password: "" },
      business: {
        businessName: "",
        workspaceSlug: "",
        branchCount: "",
        region: "",
        industry: "automotive",
        description: "",
      },
      modules: ["ims", "omni", "crm"],
      goal: "conversion",
      completed: false,
      workspace: null,
    };
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
      .replace(/-+$/g, "");
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
    var timeoutMs = Number(options.timeoutMs || 0);
    delete options.timeoutMs;
    var timeoutId = null;
    var controller = null;
    if (timeoutMs > 0 && !options.signal) {
      controller = new AbortController();
      options.signal = controller.signal;
      timeoutId = window.setTimeout(function () {
        controller.abort();
      }, timeoutMs);
    }
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
          error.payload = payload;
          error.retryAfterSeconds = payload.retryAfterSeconds;
          throw error;
        }
        return payload;
      });
    }).catch(function (error) {
      if (error && typeof error.status === "number") throw error;
      if (error && error.name === "AbortError") {
        var timeoutError = new Error("Proses melewati batas waktu. Silakan coba lagi; data yang sudah tersimpan tetap aman.");
        timeoutError.code = "request_timeout";
        throw timeoutError;
      }
      var networkError = new Error("Koneksi ke server terputus. Periksa internet Anda, lalu coba lagi.");
      networkError.code = "network_error";
      throw networkError;
    }).finally(function () {
      if (timeoutId) window.clearTimeout(timeoutId);
    });
  }

  function withTimeout(promise, timeoutMs, message) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timeoutId = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        var error = new Error(message || "Proses melewati batas waktu. Silakan coba lagi.");
        error.code = "request_timeout";
        reject(error);
      }, Math.max(1, timeoutMs));
      Promise.resolve(promise).then(function (value) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        resolve(value);
      }, function (error) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        reject(error);
      });
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
    if (error.code === "request_timeout") return error.message;
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
      script.src = "https://www.recaptcha.net/recaptcha/enterprise.js?render=" + encodeURIComponent(siteKey);
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
        link.matches("[data-verification-mailbox]") ||
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
    var initialParams = new URLSearchParams(window.location.search);
    this.isFreshRegistration = initialParams.get("fresh") === "1";
    this.state = this.isFreshRegistration ? defaultState() : loadState();
    this.toastTimer = null;
    this.workspacePollTimer = null;
    this.slugCheckTimer = null;
    this.verificationTimer = null;
    this.isRedirecting = false;
    this.slugAvailability = { slug: "", available: null };
    this.slugIsAutomatic = !this.state.business.workspaceSlug;
    this.steps = qsa("[data-step]");
    this.railItems = qsa("[data-rail-step]");
    this.progressBar = qs("[data-onboarding-progress]");
    this.legal = qs("[data-onboarding-legal]");
    this.toast = qs("[data-onboarding-toast]");

    this.signupForm = qs('[data-auth-form="signup"]');
    this.resetForm = qs("[data-reset-form]");
    this.verificationPanel = qs("[data-verification-panel]");
    this.verifiedBanner = qs("[data-email-verified-banner]");
    this.businessForm = qs("[data-business-form]");
    this.modulesForm = qs("[data-modules-form]");
    this.goalGrid = qs("[data-goal-grid]");
    this.openWorkspace = qs("[data-open-workspace]");
    this.recaptchaConfigPromise = this.prepareRecaptcha();

    this.bind();
    this.hydrate();
    // Workspace aktif hanya boleh berasal dari session server, bukan localStorage lama.
    this.goTo(1, { silent: true });
    if (initialParams.get("reset") === "1" && initialParams.get("token")) this.showResetForm();
    if (this.isFreshRegistration) {
      this.startFreshRegistration(initialParams);
    } else {
      this.resumeExistingSession();
    }
  }

  OnboardingApp.prototype.resumeExistingSession = function () {
    var self = this;
    api("/api/portal/workspace/enter", { method: "POST", body: "{}" })
      .then(function (payload) {
        if (!payload?.redirectUrl) throw new Error("Workspace belum dapat dibuka.");
        self.showRedirectState();
        window.location.replace(payload.redirectUrl);
      })
      .catch(function (error) {
        if (error.status !== 401) {
          self.showToast("Sesi workspace belum dapat dibuka", "Onboarding akun tetap diperiksa agar progress Anda tidak hilang.");
        }
        self.hydrateGoogleSession();
      });
  };

  OnboardingApp.prototype.startFreshRegistration = function (params) {
    var self = this;
    setFormLoading(this.signupForm, true);
    api("/api/auth/logout", { method: "POST", body: "{}", timeoutMs: API_REQUEST_TIMEOUT_MS })
      .then(function () {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_error) {
          /* state in-memory tetap menjadi sumber formulir baru */
        }
        self.state = defaultState();
        self.slugIsAutomatic = true;
        self.hydrate();
        self.goTo(1, { silent: true });
        params.delete("fresh");
        var query = params.toString();
        window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : "") + window.location.hash);
        self.isFreshRegistration = false;
      })
      .catch(function (error) {
        self.showError(
          self.signupForm,
          friendlySubmitError(error, "Sesi pendaftaran sebelumnya belum dapat diakhiri. Muat ulang halaman untuk mencoba lagi."),
        );
      })
      .finally(function () {
        setFormLoading(self.signupForm, false);
      });
  };

  OnboardingApp.prototype.prepareRecaptcha = function () {
    var self = this;
    this.setRecaptchaStatus("loading", "Memuat proteksi keamanan…");
    return api("/api/config")
      .then(function (payload) {
        var config = payload && payload.recaptcha;
        if (!config || !config.enabled || !config.siteKey || !config.action) {
          throw new Error("Proteksi keamanan belum tersedia. Hubungi tim MOTOVAX.");
        }
        return loadRecaptchaScript(config.siteKey).then(function () {
          self.setRecaptchaStatus("ready", "reCAPTCHA siap · berjalan otomatis tanpa checkbox");
          return config;
        });
      })
      .catch(function (error) {
        var message = error.message || "Proteksi keamanan belum tersedia.";
        self.setRecaptchaStatus("error", message);
        return { enabled: false, error: message };
      });
  };

  OnboardingApp.prototype.setRecaptchaStatus = function (state, message) {
    var status = qs("[data-recaptcha-status]");
    var copy = qs("[data-recaptcha-status-copy]", status);
    if (!status || !copy) return;
    status.dataset.state = state;
    copy.textContent = message;
  };

  OnboardingApp.prototype.getRecaptchaToken = async function (timeoutMs) {
    var availableMs = Math.max(1, Number(timeoutMs || RECAPTCHA_TIMEOUT_MS));
    var startedAt = Date.now();
    var remainingTime = function () {
      return Math.max(1, availableMs - (Date.now() - startedAt));
    };
    var config = await withTimeout(
      this.recaptchaConfigPromise,
      remainingTime(),
      "Verifikasi keamanan membutuhkan waktu terlalu lama. Periksa koneksi dan coba lagi.",
    );
    if (!config || !config.enabled || !window.grecaptcha || !window.grecaptcha.enterprise) {
      throw new Error(config && config.error || "Proteksi keamanan belum siap. Muat ulang halaman dan coba lagi.");
    }
    return withTimeout(new Promise(function (resolve, reject) {
      window.grecaptcha.enterprise.ready(function () {
        window.grecaptcha.enterprise.execute(config.siteKey, { action: config.action })
          .then(resolve)
          .catch(function () {
            reject(new Error("Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi."));
          });
      });
    }), remainingTime(), "Verifikasi keamanan membutuhkan waktu terlalu lama. Periksa koneksi dan coba lagi.");
  };

  OnboardingApp.prototype.completeWithFreshRecaptcha = async function () {
    var recaptchaToken = await this.getRecaptchaToken(RECAPTCHA_TIMEOUT_MS);
    return api("/api/onboarding/complete", {
      method: "POST",
      timeoutMs: WORKSPACE_SETUP_TIMEOUT_MS,
      body: JSON.stringify({ recaptchaToken: recaptchaToken }),
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

    var verificationResend = qs("[data-verification-resend]");
    if (verificationResend) {
      verificationResend.addEventListener("click", function () {
        self.resendVerification();
      });
    }
    var verificationChange = qs("[data-verification-change]");
    if (verificationChange) {
      verificationChange.addEventListener("click", function () {
        self.changeVerificationEmail();
      });
    }
    var verificationCheck = qs("[data-verification-check]");
    if (verificationCheck) {
      verificationCheck.addEventListener("click", function () {
        self.checkVerificationStatus();
      });
    }
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && self.verificationPanel && !self.verificationPanel.hidden) {
        self.checkVerificationStatus({ quiet: true });
      }
    });

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
      var businessNameInput = this.businessForm.businessName;
      if (slugInput) {
        slugInput.addEventListener("input", function (event) {
          if (event.isTrusted) self.slugIsAutomatic = false;
          slugInput.value = slugInput.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
          var formError = qs("[data-form-error]", self.businessForm);
          if (formError) {
            formError.hidden = true;
            formError.textContent = "";
          }
          self.slugAvailability = { slug: "", available: null };
          window.clearTimeout(self.slugCheckTimer);
          if (!self.validWorkspaceSlug(slugInput.value)) {
            self.setSlugStatus("idle", "Otomatis dibuat dari nama bisnis; Anda tetap dapat mengubahnya.");
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
        if (businessNameInput) {
          businessNameInput.addEventListener("input", function () {
            if (!self.slugIsAutomatic) return;
            slugInput.value = slugify(businessNameInput.value);
            slugInput.dispatchEvent(new Event("input", { bubbles: true }));
          });
        }
      }
    }

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
        self.slugIsAutomatic = true;
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

    // Deep-link hanya menerima empat langkah onboarding mandiri.
    var params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1" && params.get("token")) {
      this.showResetForm();
    }
    var stepParam = parseInt(params.get("step"), 10);
    if (stepParam >= 1 && stepParam <= 4) {
      this.state.step = stepParam;
    }
  };

  OnboardingApp.prototype.setAuthMode = function () {
    this.state.authMode = "signup";
    window.clearInterval(this.verificationTimer);
    this.verificationTimer = null;

    if (this.signupForm) {
      this.signupForm.hidden = false;
      this.signupForm.style.display = "";
      this.signupForm.setAttribute("aria-hidden", "false");
    }
    if (this.resetForm) this.resetForm.hidden = true;
    if (this.verificationPanel) this.verificationPanel.hidden = true;
    if (this.verifiedBanner) this.verifiedBanner.hidden = true;
    var divider = qs(".onboarding-auth-divider");
    var googleButton = qs("[data-google-login]");
    if (divider) divider.hidden = false;
    if (googleButton) googleButton.hidden = false;

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

  OnboardingApp.prototype.mailboxTarget = function (email) {
    var domain = String(email || "").split("@")[1] || "";
    if (/^(outlook|hotmail|live)\./i.test(domain)) return { href: "https://outlook.live.com/mail/", label: "Buka Outlook" };
    if (/^yahoo\./i.test(domain)) return { href: "https://mail.yahoo.com/", label: "Buka Yahoo Mail" };
    if (/^(gmail|googlemail)\.com$/i.test(domain)) return { href: "https://mail.google.com/", label: "Buka Gmail" };
    return { href: "https://mail.google.com/", label: "Buka kotak masuk" };
  };

  OnboardingApp.prototype.showVerificationView = function (state, options) {
    options = options || {};
    var email = options.email || this.state.pendingVerification?.email || this.state.account?.email || "";
    var viewState = state || "pending";
    var panelHeading = "Periksa kotak masuk";
    var copy = "Kami mengirim link verifikasi ke:";
    var status = options.status || "Link berlaku selama 24 jam. Anda dapat menutup halaman ini dan kembali nanti.";
    if (viewState === "expired") {
      panelHeading = "Minta link verifikasi baru";
      copy = "Kirim link baru untuk memverifikasi:";
      status = options.status || "Link hanya berlaku 24 jam. Kirim ulang email untuk mendapatkan link baru.";
    } else if (viewState === "used") {
      panelHeading = "Gunakan link terbaru";
      copy = "Gunakan email verifikasi terbaru untuk:";
      status = options.status || "Link mungkin sudah digunakan atau digantikan oleh kiriman yang lebih baru.";
    } else if (viewState === "invalid") {
      panelHeading = "Minta link verifikasi baru";
      copy = "Minta link baru untuk memverifikasi:";
      status = options.status || "Pastikan link disalin lengkap atau kirim ulang email verifikasi.";
    }

    if (this.signupForm) this.signupForm.hidden = true;
    if (this.resetForm) this.resetForm.hidden = true;
    if (this.verificationPanel) {
      this.verificationPanel.hidden = false;
      this.verificationPanel.dataset.state = viewState === "pending" ? "pending" : "error";
    }
    var divider = qs(".onboarding-auth-divider");
    var googleButton = qs("[data-google-login]");
    if (divider) divider.hidden = true;
    if (googleButton) googleButton.hidden = true;
    var panelTitle = qs("[data-verification-title]");
    var panelCopy = qs("[data-verification-copy]");
    var panelEmail = qs("[data-verification-email]");
    var panelStatus = qs("[data-verification-status]");
    if (panelTitle) panelTitle.textContent = panelHeading;
    if (panelCopy) panelCopy.textContent = copy;
    if (panelEmail) panelEmail.textContent = email || "Alamat email pendaftaran";
    if (panelStatus) panelStatus.textContent = status;
    qsa("[data-verification-icon]", this.verificationPanel).forEach(function (icon) {
      icon.hidden = icon.dataset.verificationIcon !== (viewState === "pending" ? "mail" : "error");
    });
    var mailbox = qs("[data-verification-mailbox]");
    var mailboxTarget = this.mailboxTarget(email);
    if (mailbox) {
      mailbox.href = mailboxTarget.href;
      var mailboxLabel = qs("[data-verification-mailbox-label]", mailbox);
      if (mailboxLabel) mailboxLabel.textContent = mailboxTarget.label;
    }
    this.updateVerificationCountdown();
    window.clearInterval(this.verificationTimer);
    this.verificationTimer = window.setInterval(this.updateVerificationCountdown.bind(this), 1000);
    this.verificationPanel?.scrollIntoView({ behavior: options.silent ? "auto" : "smooth", block: "nearest" });
  };

  OnboardingApp.prototype.updateVerificationCountdown = function () {
    var button = qs("[data-verification-resend]");
    if (!button) return;
    var availableAt = Number(this.state.pendingVerification?.resendAvailableAt || 0);
    var seconds = Math.max(0, Math.ceil((availableAt - Date.now()) / 1000));
    button.disabled = seconds > 0;
    button.textContent = seconds > 0 ? "Kirim ulang dalam " + seconds + " dtk" : "Kirim ulang email";
  };

  OnboardingApp.prototype.resendVerification = async function () {
    var button = qs("[data-verification-resend]");
    var status = qs("[data-verification-status]");
    if (button) button.disabled = true;
    if (status) status.textContent = "Mengirim email verifikasi baru…";
    try {
      var payload = await api("/api/auth/resend-verification", { method: "POST", body: "{}" });
      this.state.pendingVerification = Object.assign({}, this.state.pendingVerification, {
        email: payload.email || this.state.pendingVerification?.email || "",
        resendAvailableAt: Date.now() + Number(payload.resendAfterSeconds || 60) * 1000,
      });
      saveState(this.state);
      this.showVerificationView("pending", {
        email: this.state.pendingVerification.email,
        status: "Email baru sudah dikirim. Gunakan link terbaru; link sebelumnya otomatis tidak berlaku.",
      });
    } catch (error) {
      if (error.status === 429 && error.retryAfterSeconds) {
        this.state.pendingVerification = Object.assign({}, this.state.pendingVerification, {
          resendAvailableAt: Date.now() + Number(error.retryAfterSeconds) * 1000,
        });
        saveState(this.state);
      }
      if (status) status.textContent = friendlySubmitError(error, "Email belum dapat dikirim ulang. Silakan coba lagi.");
      this.updateVerificationCountdown();
    }
  };

  OnboardingApp.prototype.changeVerificationEmail = async function () {
    var button = qs("[data-verification-change]");
    var status = qs("[data-verification-status]");
    if (button) button.disabled = true;
    if (status) status.textContent = "Membatalkan pendaftaran lama…";
    try {
      await api("/api/auth/pending-signup", { method: "DELETE", body: "{}" });
      this.state.pendingVerification = null;
      this.state.account.email = "";
      saveState(this.state);
      this.setAuthMode();
      if (this.signupForm?.email) {
        this.signupForm.email.value = "";
        this.signupForm.email.focus({ preventScroll: true });
      }
    } catch (error) {
      if (status) status.textContent = friendlySubmitError(error, "Alamat email belum dapat diganti. Silakan coba lagi.");
    } finally {
      if (button) button.disabled = false;
    }
  };

  OnboardingApp.prototype.checkVerificationStatus = async function (options) {
    options = options || {};
    var button = qs("[data-verification-check]");
    var status = qs("[data-verification-status]");
    if (button) button.disabled = true;
    if (!options.quiet && status) status.textContent = "Memeriksa status verifikasi…";
    try {
      var payload = await api("/api/auth/me");
      if (!this.isVerifiedPendingAccount(payload)) {
        throw Object.assign(new Error("Email belum terverifikasi."), { status: 401 });
      }
      this.state.pendingVerification = null;
      this.applyAccountPayload(payload);
      saveState(this.state);
      if (this.verifiedBanner) this.verifiedBanner.hidden = false;
      this.goTo(this.state.business.businessName ? 3 : 2);
    } catch (error) {
      if (error.status === 401) {
        if (!options.quiet && status) status.textContent = "Email belum terverifikasi. Klik link pada email terbaru lalu periksa kembali.";
      } else if (status) {
        status.textContent = friendlySubmitError(error, "Status belum dapat diperiksa. Coba lagi beberapa saat.");
      }
    } finally {
      if (button) button.disabled = false;
    }
  };

  OnboardingApp.prototype.isVerifiedPendingAccount = function (payload) {
    var pendingEmail = String(this.state.pendingVerification?.email || "").trim().toLowerCase();
    var sessionEmail = String(payload?.user?.email || "").trim().toLowerCase();
    return Boolean(
      pendingEmail
      && payload?.authenticated
      && payload?.user?.emailVerified === true
      && sessionEmail === pendingEmail
    );
  };

  OnboardingApp.prototype.showResetForm = function () {
    if (!this.resetForm) return;
    if (this.signupForm) this.signupForm.hidden = true;
    this.resetForm.hidden = false;
    var divider = qs(".onboarding-auth-divider");
    var googleButton = qs("[data-google-login]");
    if (divider) divider.hidden = true;
    if (googleButton) googleButton.hidden = true;
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

  OnboardingApp.prototype.selectIndustry = function (id) {
    this.state.business.industry = "automotive";
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
        this.state.account = { fullName: fullName, email: payload.email || email, provider: "password" };
        this.state.pendingVerification = {
          email: payload.email || email,
          resendAvailableAt: Date.now() + Number(payload.resendAfterSeconds || 60) * 1000,
        };
        saveState(this.state);
        clearPasswordFields(form);
        this.showVerificationView("pending", { email: this.state.pendingVerification.email });
        return;
      }
      this.applyAccountPayload(payload);
      this.state.pendingVerification = null;
      clearPasswordFields(form);
      this.state.authMode = "signup";
      saveState(this.state);
      this.showToast(
        payload.accountUpdated ? "Perubahan akun disimpan" : "Akun berhasil dibuat",
        "Lanjut isi profil dealer Anda.",
      );
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
        branchCount: payload.profile.branch_count || "",
        region: payload.profile.region || "",
        industry: "automotive",
        description: payload.profile.description || "",
      };
      this.state.modules = payload.profile.modules || this.state.modules;
      this.state.goal = payload.profile.goal || this.state.goal;
    } else {
      var clean = defaultState();
      this.state.business = clean.business;
      this.state.modules = clean.modules;
      this.state.goal = clean.goal;
      this.slugIsAutomatic = true;
    }
    if (payload.workspaces && payload.workspaces.length) {
      this.state.workspace = Object.assign({ ready: true }, payload.workspaces[0]);
      this.state.onboardingMode = "self";
      this.state.completed = true;
    } else {
      this.state.workspace = null;
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
          return self.restorePendingSignup(emailStatus, params);
        }
        if (self.state.pendingVerification?.email && !self.isVerifiedPendingAccount(payload)) {
          return self.restorePendingSignup(emailStatus, params);
        }
        self.state.pendingVerification = null;
        self.applyAccountPayload(payload);
        self.state.authMode = "signup";
        saveState(self.state);

        if (self.state.workspace) {
          self.goTo(4);
          self.showRedirectState();
          self.enterWorkspace();
        } else {
          self.goTo(self.state.business.businessName ? 3 : 2);
        }
        if (oauthStatus === "success") {
          self.showToast("Akun Google berhasil didaftarkan", "Lanjut lengkapi onboarding Anda.");
          params.delete("oauth");
          params.delete("reason");
          var query = params.toString();
          window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : ""));
        } else if (emailStatus === "verified") {
          if (self.verifiedBanner) self.verifiedBanner.hidden = false;
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

  OnboardingApp.prototype.restorePendingSignup = function (emailStatus, params) {
    var self = this;
    return api("/api/auth/pending-signup")
      .then(function (payload) {
        self.state.account = Object.assign({}, self.state.account, { email: payload.email, provider: "password" });
        self.state.pendingVerification = {
          email: payload.email,
          resendAvailableAt: Date.now() + Number(payload.resendAfterSeconds || 0) * 1000,
        };
        saveState(self.state);
        self.goTo(1, { silent: true });
        var view = ["expired", "used", "invalid"].indexOf(emailStatus) !== -1 ? emailStatus : "pending";
        self.showVerificationView(view, { email: payload.email, silent: true });
        if (emailStatus) {
          params.delete("email");
          var query = params.toString();
          window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : ""));
        }
        return true;
      })
      .catch(function (error) {
        if (error.status !== 401) throw error;
        self.state = defaultState();
        self.slugIsAutomatic = true;
        saveState(self.state);
        self.hydrate();
        self.goTo(1, { silent: true });
        if (params.get("reset") === "1" && params.get("token")) self.showResetForm();
        if (["expired", "used", "invalid"].indexOf(emailStatus) !== -1) {
          self.showToast("Link verifikasi tidak dapat digunakan", "Daftar kembali untuk mendapatkan link verifikasi baru.");
        }
        return false;
      });
  };

  OnboardingApp.prototype.submitBusiness = async function () {
    var form = this.businessForm;
    var fd = new FormData(form);
    var businessName = String(fd.get("businessName") || "").trim();
    var workspaceSlug = String(fd.get("workspaceSlug") || "").trim();
    var branchCount = String(fd.get("branchCount") || "");
    var region = String(fd.get("region") || "").trim();
    var description = String(fd.get("description") || "").trim();

    if (businessName.length < 2) {
      this.showError(form, "Nama bisnis belum valid. Masukkan minimal 2 karakter.", "businessName");
      return;
    }
    if (region.length === 1) {
      this.showError(form, "Kota atau wilayah utama boleh dikosongkan atau diisi minimal 2 karakter.", "region");
      return;
    }
    if (!this.validWorkspaceSlug(workspaceSlug)) {
      this.showError(form, "Nama workspace belum valid. Gunakan 3–40 karakter berupa huruf kecil, angka, atau tanda hubung.", "workspaceSlug");
      return;
    }

    var industry = "automotive";
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
      this.goTo(3);
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

  OnboardingApp.prototype.saveProfile = function (timeoutMs) {
    return api("/api/onboarding/profile", {
      method: "POST",
      timeoutMs: timeoutMs,
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
      await this.saveProfile(API_REQUEST_TIMEOUT_MS);
      this.setRecaptchaStatus("verifying", "Memverifikasi keamanan…");
      var payload;
      try {
        payload = await this.completeWithFreshRecaptcha();
      } catch (error) {
        if (error.code !== "recaptcha_invalid") throw error;
        this.setRecaptchaStatus("verifying", "Memperbarui verifikasi keamanan…");
        payload = await this.completeWithFreshRecaptcha();
      }
      this.setRecaptchaStatus("ready", "Verifikasi keamanan berhasil");
      this.state.workspace = payload.workspace;
      this.state.onboardingMode = "self";
      this.state.completed = true;
      this.state.step = 4;
      saveState(this.state);
      this.renderSummary();
      this.goTo(4);
      this.showRedirectState();
      if (this.state.workspace.ready) this.enterWorkspace();
      else this.waitForWorkspace();
    } catch (error) {
      if (error.code === "recaptcha_invalid" || error.code === "recaptcha_low_score") {
        this.setRecaptchaStatus("error", "Verifikasi belum berhasil · coba lagi");
      }
      this.showError(form, friendlySubmitError(error, "Workspace belum berhasil dibuat. Pilihan Anda tetap tersimpan; silakan coba lagi."));
    } finally {
      setFormLoading(form, false);
    }
  };

  OnboardingApp.prototype.showRedirectState = function () {
    this.isRedirecting = true;
    var redirectState = qs("[data-redirect-state]");
    var workspaceSummary = qs("[data-workspace-summary]");
    var workspaceActions = qs("[data-workspace-actions]");
    var redirectDomain = qs("[data-redirect-domain]");
    window.clearTimeout(this.toastTimer);
    if (this.toast) this.toast.hidden = true;
    if (redirectState) redirectState.hidden = false;
    if (workspaceSummary) workspaceSummary.hidden = true;
    if (workspaceActions) workspaceActions.hidden = true;
    if (redirectDomain) redirectDomain.textContent = this.state.workspace?.domain || "workspace dealer Anda";
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
    if (this.openWorkspace) this.openWorkspace.disabled = true;
    try {
      var payload = await api("/api/workspaces/" + encodeURIComponent(workspace.id) + "/enter", {
        method: "POST",
        body: "{}",
      });
      window.location.assign(payload.redirectUrl);
    } catch (error) {
      if (error.code === "workspace_provisioning") {
        this.state.workspace = Object.assign({}, workspace, { ready: false });
        saveState(this.state);
        this.showRedirectState();
        this.waitForWorkspace();
        return;
      }
      this.showToast("Workspace belum dapat dibuka", friendlySubmitError(error, "Tunggu beberapa saat lalu coba kembali."));
      if (this.openWorkspace) {
        this.openWorkspace.hidden = false;
        this.openWorkspace.disabled = false;
      }
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
            self.showRedirectState();
            self.enterWorkspace();
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
      if (this.businessForm.branchCount) this.businessForm.branchCount.value = biz.branchCount || "";
      if (this.businessForm.region) this.businessForm.region.value = biz.region || "";
      if (this.businessForm.description) this.businessForm.description.value = biz.description || "";
    }
    this.selectIndustry("automotive");
    this.selectGoal(this.state.goal || "conversion");
    if (this.state.pendingVerification?.email) {
      this.showVerificationView("pending", { email: this.state.pendingVerification.email, silent: true });
    } else {
      this.setAuthMode();
    }

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
    var workspaceSummary = qs("[data-workspace-summary]");
    var workspaceActions = qs("[data-workspace-actions]");
    var redirectState = qs("[data-redirect-state]");
    this.isRedirecting = false;
    if (redirectState) redirectState.hidden = true;
    if (workspaceSummary) workspaceSummary.hidden = false;
    if (workspaceActions) workspaceActions.hidden = false;

    if (nameEl) nameEl.textContent = biz.businessName || "Dealer Anda";
    if (userEl) {
      userEl.textContent = acc.fullName
        ? acc.fullName + " · " + (acc.email || "")
        : acc.email || "Siap masuk sebagai user demo";
    }
    if (industryEl) industryEl.textContent = INDUSTRY_LABELS.automotive;
    if (branchesEl) branchesEl.textContent = biz.branchCount ? biz.branchCount + " lokasi" : "Belum ditentukan";
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
      this.openWorkspace.innerHTML = "Coba alihkan kembali <span>→</span>";
    }
  };

  OnboardingApp.prototype.goTo = function (step, opts) {
    opts = opts || {};
    step = Math.min(4, Math.max(1, step));
    this.state.step = step;
    if (!opts.silent) saveState(this.state);

    this.steps.forEach(function (panel) {
      var n = parseInt(panel.getAttribute("data-step"), 10);
      var active = n === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    this.railItems.forEach(function (item) {
      var n = parseInt(item.getAttribute("data-rail-step"), 10);
      var isActive = n === step;
      item.classList.toggle("is-active", isActive);
      item.classList.toggle("is-done", n < step);
      if (isActive) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    if (this.progressBar) {
      this.progressBar.style.setProperty("--p", step * 25 + "%");
    }
    if (this.legal) this.legal.hidden = step !== 1;

    if (step === 4) this.renderSummary();

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
