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
    });
  }

  function setFormLoading(form, loading) {
    if (!form) return;
    qsa("button, input, select, textarea", form).forEach(function (element) {
      element.disabled = loading;
    });
    form.classList.toggle("is-loading", loading);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function routeContentLinksToLanding() {
    qsa("a[href]").forEach(function (link) {
      if (link.matches("[data-google-login]") || link.closest("[data-reset-form]")) return;
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

    this.steps = qsa("[data-step]");
    this.railItems = qsa("[data-rail-step]");
    this.progressBar = qs("[data-onboarding-progress]");
    this.toast = qs("[data-onboarding-toast]");

    this.signupForm = qs('[data-auth-form="signup"]');
    this.resetForm = qs("[data-reset-form]");
    this.businessForm = qs("[data-business-form]");
    this.modulesForm = qs("[data-modules-form]");
    this.industryGrid = qs("[data-industry-grid]");
    this.goalGrid = qs("[data-goal-grid]");
    this.openWorkspace = qs("[data-open-workspace]");

    this.bind();
    this.hydrate();
    // Workspace aktif hanya boleh berasal dari session server, bukan localStorage lama.
    this.goTo(1, { silent: true });
    var initialParams = new URLSearchParams(window.location.search);
    if (initialParams.get("reset") === "1" && initialParams.get("token")) this.showResetForm();
    this.hydrateGoogleSession();
  }

  OnboardingApp.prototype.bind = function () {
    var self = this;

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

    // Deep-link: ?step=2. Parameter mode lama diabaikan karena portal ini signup-only.
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
      this.showError(form, "Password minimal 8 karakter dan harus berisi huruf serta angka.");
      return;
    }
    if (password !== confirmation) {
      this.showError(form, "Konfirmasi password tidak cocok.");
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
      this.setAuthMode();
      this.showToast("Password berhasil diperbarui", "Masuk melalui domain workspace Anda.");
    } catch (error) {
      this.showError(form, error.message);
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
  };

  OnboardingApp.prototype.showError = function (form, message) {
    var err = qs("[data-form-error]", form);
    if (!err) return;
    err.hidden = false;
    err.textContent = message;
  };

  OnboardingApp.prototype.submitSignup = async function () {
    var form = this.signupForm;
    var fd = new FormData(form);
    var fullName = String(fd.get("fullName") || "").trim();
    var email = String(fd.get("email") || "").trim().toLowerCase();
    var password = String(fd.get("password") || "");
    var confirm = String(fd.get("passwordConfirm") || "");

    if (fullName.length < 2) {
      this.showError(form, "Masukkan nama lengkap yang valid.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showError(form, "Format email tidak valid.");
      return;
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      this.showError(form, "Password minimal 8 karakter dan harus berisi huruf serta angka.");
      return;
    }
    if (password !== confirm) {
      this.showError(form, "Konfirmasi password tidak cocok.");
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
        form.password.value = "";
        form.passwordConfirm.value = "";
        return;
      }
      this.applyAccountPayload(payload);
      this.state.authMode = "signup";
      saveState(this.state);
      this.showToast("Akun berhasil dibuat", "Lanjut isi profil bisnis Anda.");
      this.goTo(2);
    } catch (error) {
      this.showError(form, error.message);
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

        if (self.state.workspace) {
          self.goTo(4);
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
      this.showError(form, "Nama bisnis / brand wajib diisi.");
      return;
    }
    if (region.length < 2) {
      this.showError(form, "Isi kota / wilayah utama.");
      return;
    }
    if (!this.validWorkspaceSlug(workspaceSlug)) {
      this.showError(form, "Subdomain harus 3–40 karakter, berisi huruf kecil, angka, atau tanda hubung.");
      return;
    }

    var industry = this.state.business.industry || "general";
    if (industry === "other") industry = "general";
    setFormLoading(form, true);
    try {
      var available = await this.checkWorkspaceAvailability();
      if (!available) {
        this.showError(form, "Nama workspace tidak tersedia. Pilih nama lain.");
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
      this.showError(form, error.message);
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
      this.showError(form, "Pilih minimal satu modul prioritas.");
      return;
    }

    this.state.modules = checked;
    setFormLoading(form, true);
    try {
      await this.saveProfile();
      var payload = await api("/api/onboarding/complete", {
        method: "POST",
        body: "{}",
      });
      this.state.workspace = payload.workspace;
      this.state.completed = true;
      this.state.step = 4;
      saveState(this.state);
      this.renderSummary();
      this.showToast("Tenant berhasil dibuat", "Domain aplikasi sedang disiapkan. Halaman ini akan memperbarui status otomatis.");
      this.goTo(4);
      this.waitForWorkspace();
    } catch (error) {
      this.showError(form, error.message);
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
      this.showToast("Workspace belum dapat dibuka", error.message);
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
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-done", n < step);
    });

    if (this.progressBar) {
      this.progressBar.style.setProperty("--p", step * 25 + "%");
    }

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
