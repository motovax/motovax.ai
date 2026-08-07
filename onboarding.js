(function () {
  "use strict";

  var STORAGE_KEY = "motovax_onboarding_v1";
  var INDUSTRY_LABELS = {
    automotive: "Otomotif / Dealer",
    property: "Properti",
    retail: "Retail",
    other: "Lainnya",
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
    scale: "Scale multi-cabang",
  };
  var DEMO_ANCHORS = {
    ims: "#inventoryDemo",
    omni: "#omniDemo",
    social: "#socialDemo",
    crm: "#crmDemo",
    dashboard: "#dashboardDemo",
    insight: "#insightDemo",
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
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
        branchCount: "4-10",
        region: "",
        industry: "automotive",
        description: "",
      },
      modules: ["ims", "omni", "crm"],
      goal: "conversion",
      completed: false,
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

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function OnboardingApp() {
    this.root = document.body;
    this.state = loadState();
    this.toastTimer = null;

    this.steps = qsa("[data-step]");
    this.railItems = qsa("[data-rail-step]");
    this.progressBar = qs("[data-onboarding-progress]");
    this.toast = qs("[data-onboarding-toast]");

    this.authTabs = qsa("[data-auth-mode]");
    this.signupForm = qs('[data-auth-form="signup"]');
    this.loginForm = qs('[data-auth-form="login"]');
    this.businessForm = qs("[data-business-form]");
    this.modulesForm = qs("[data-modules-form]");
    this.industryGrid = qs("[data-industry-grid]");
    this.goalGrid = qs("[data-goal-grid]");
    this.openDemo = qs("[data-open-demo]");

    this.bind();
    this.hydrate();
    this.goTo(this.state.completed ? 4 : this.state.step || 1, { silent: true });
  }

  OnboardingApp.prototype.bind = function () {
    var self = this;

    this.authTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        self.setAuthMode(tab.getAttribute("data-auth-mode"));
      });
    });

    if (this.signupForm) {
      this.signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.submitSignup();
      });
    }

    if (this.loginForm) {
      this.loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.submitLogin();
      });
    }

    var forgot = qs("[data-auth-forgot]");
    if (forgot) {
      forgot.addEventListener("click", function () {
        self.showToast("Reset password (demo)", "Di produksi, tautan reset dikirim ke email. Untuk demo, gunakan Login dengan email apa pun.");
      });
    }

    if (this.businessForm) {
      this.businessForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.submitBusiness();
      });
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

    // Deep-link: ?mode=login | ?step=2
    var params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "login") {
      this.setAuthMode("login");
    }
    var stepParam = parseInt(params.get("step"), 10);
    if (stepParam >= 1 && stepParam <= 4) {
      this.state.step = stepParam;
    }
  };

  OnboardingApp.prototype.setAuthMode = function (mode) {
    this.state.authMode = mode === "login" ? "login" : "signup";
    this.authTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-auth-mode") === this.state.authMode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    }, this);
    if (this.signupForm) this.signupForm.hidden = this.state.authMode !== "signup";
    if (this.loginForm) this.loginForm.hidden = this.state.authMode !== "login";
    this.clearErrors();
    saveState(this.state);
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

  OnboardingApp.prototype.submitSignup = function () {
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
    if (password.length < 8) {
      this.showError(form, "Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      this.showError(form, "Konfirmasi password tidak cocok.");
      return;
    }

    this.state.account = { fullName: fullName, email: email, password: password };
    this.state.authMode = "signup";
    saveState(this.state);
    this.showToast("Akun demo dibuat", "Lanjut isi profil bisnis dealer.");
    this.goTo(2);
  };

  OnboardingApp.prototype.submitLogin = function () {
    var form = this.loginForm;
    var fd = new FormData(form);
    var email = String(fd.get("email") || "").trim().toLowerCase();
    var password = String(fd.get("password") || "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showError(form, "Format email tidak valid.");
      return;
    }
    if (!password) {
      this.showError(form, "Password wajib diisi.");
      return;
    }

    // Demo: accept any credentials; prefer existing saved account
    if (this.state.account && this.state.account.email && this.state.account.email !== email) {
      this.state.account.email = email;
      if (!this.state.account.fullName) {
        this.state.account.fullName = email.split("@")[0];
      }
    } else if (!this.state.account || !this.state.account.email) {
      this.state.account = {
        fullName: email.split("@")[0],
        email: email,
        password: password,
      };
    }

    this.state.authMode = "login";
    saveState(this.state);

    if (this.state.completed) {
      this.showToast("Login berhasil", "Melanjutkan ke ringkasan workspace.");
      this.goTo(4);
      return;
    }

    this.showToast("Login berhasil", "Lanjut lengkapi onboarding.");
    this.goTo(this.state.business.businessName ? 3 : 2);
  };

  OnboardingApp.prototype.submitBusiness = function () {
    var form = this.businessForm;
    var fd = new FormData(form);
    var businessName = String(fd.get("businessName") || "").trim();
    var branchCount = String(fd.get("branchCount") || "1");
    var region = String(fd.get("region") || "").trim();
    var description = String(fd.get("description") || "").trim();

    if (businessName.length < 2) {
      this.showError(form, "Nama dealer / brand wajib diisi.");
      return;
    }
    if (region.length < 2) {
      this.showError(form, "Isi kota / wilayah utama.");
      return;
    }

    this.state.business = {
      businessName: businessName,
      branchCount: branchCount,
      region: region,
      industry: this.state.business.industry || "automotive",
      description: description,
    };
    saveState(this.state);
    this.showToast("Profil disimpan", "Pilih modul yang ingin dicoba dulu.");
    this.goTo(3);
  };

  OnboardingApp.prototype.submitModules = function () {
    var form = this.modulesForm;
    var checked = qsa('input[name="modules"]:checked', form).map(function (el) {
      return el.value;
    });

    if (!checked.length) {
      this.showError(form, "Pilih minimal satu modul prioritas.");
      return;
    }

    this.state.modules = checked;
    this.state.completed = true;
    this.state.step = 4;
    saveState(this.state);
    this.renderSummary();
    this.showToast("Setup selesai", "Workspace demo siap digunakan.");
    this.goTo(4);
  };

  OnboardingApp.prototype.hydrate = function () {
    var acc = this.state.account || {};
    var biz = this.state.business || {};

    if (this.signupForm) {
      if (this.signupForm.fullName) this.signupForm.fullName.value = acc.fullName || "";
      if (this.signupForm.email) this.signupForm.email.value = acc.email || "";
    }
    if (this.loginForm && this.loginForm.email) {
      this.loginForm.email.value = acc.email || "";
    }
    if (this.businessForm) {
      if (this.businessForm.businessName) this.businessForm.businessName.value = biz.businessName || "";
      if (this.businessForm.branchCount) this.businessForm.branchCount.value = biz.branchCount || "4-10";
      if (this.businessForm.region) this.businessForm.region.value = biz.region || "";
      if (this.businessForm.description) this.businessForm.description.value = biz.description || "";
    }

    this.selectIndustry(biz.industry || "automotive");
    this.selectGoal(this.state.goal || "conversion");
    this.setAuthMode(this.state.authMode || "signup");

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

    if (nameEl) nameEl.textContent = biz.businessName || "Dealer Anda";
    if (userEl) {
      userEl.textContent = acc.fullName
        ? acc.fullName + " · " + (acc.email || "")
        : acc.email || "Siap masuk sebagai user demo";
    }
    if (industryEl) industryEl.textContent = INDUSTRY_LABELS[biz.industry] || INDUSTRY_LABELS.automotive;
    if (branchesEl) branchesEl.textContent = (biz.branchCount || "—") + " cabang";
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

    if (this.openDemo) {
      var first = (this.state.modules && this.state.modules[0]) || "dashboard";
      var anchor = DEMO_ANCHORS[first] || "#solusi";
      this.openDemo.setAttribute("href", "./index.html" + anchor);
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

  document.addEventListener("DOMContentLoaded", function () {
    if (!qs("[data-step]")) return;
    window.motovaxOnboarding = new OnboardingApp();
  });
})();
