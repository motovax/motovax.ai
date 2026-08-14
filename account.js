(function () {
  "use strict";

  var API_ORIGIN = "https://onboard.motovax.com";
  var TOKEN_KEY = "motovax_portal_session";
  var token = localStorage.getItem(TOKEN_KEY) || "";
  var pageName = document.body.getAttribute("data-account-page") || "profile";
  var shell = document.querySelector("[data-account-shell]");
  var guest = document.querySelector("[data-account-guest]");

  var featureLabels = {
    whatsapp_ai: "WhatsApp AI Chat",
    inventory_management: "Inventory Management",
    crm_autopilot: "Autopilot CRM",
    social_media_automation: "Social Media Automation",
    one_dashboard: "One Dashboard",
    data_insight: "Data Insight",
  };

  function portalApi(path, options) {
    options = options || {};
    return fetch(API_ORIGIN + path, {
      method: options.method || "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: options.body,
    }).then(function (response) {
      if (response.status === 204) return null;
      return response.json().catch(function () { return {}; }).then(function (payload) {
        if (!response.ok) {
          var error = new Error(payload.message || "Data akun belum dapat dimuat.");
          error.status = response.status;
          throw error;
        }
        return payload;
      });
    });
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.textContent = value == null ? "" : String(value);
    });
  }

  function showGuest(message) {
    if (shell) shell.hidden = true;
    if (guest) guest.hidden = false;
    setText("[data-account-guest-copy]", message || "Silakan login untuk membuka pusat akun Motovax Anda.");
  }

  function renderUser(user) {
    var name = user.displayName || user.username || "Akun Motovax";
    var initials = name.split(/\s+/).filter(Boolean).map(function (part) { return part.charAt(0); }).join("").slice(0, 2).toUpperCase();
    setText("[data-account-name]", name);
    setText("[data-account-email]", user.email || "—");
    setText("[data-account-username]", user.username ? "@" + user.username : "—");
    setText("[data-account-role]", user.role || "Anggota");
    setText("[data-account-tenant]", user.tenant && user.tenant.name ? user.tenant.name : "Workspace");
    setText("[data-account-domain]", user.tenant && user.tenant.domain ? user.tenant.domain : "—");
    setText("[data-account-initials]", initials || "MV");
    document.querySelectorAll("[data-billing-link]").forEach(function (element) {
      element.hidden = user.canViewBilling !== true;
    });
    if (pageName === "billing" && user.canViewBilling !== true) {
      throw Object.assign(new Error("Akun ini tidak memiliki akses untuk melihat billing workspace."), { status: 403 });
    }
  }

  function formatLimit(value) {
    return !value || value < 1 ? "Tanpa batas" : new Intl.NumberFormat("id-ID").format(value);
  }

  function formatPeriod(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(new Date(end).getTime() - 1);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return "Periode berjalan";
    var formatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    return formatter.format(startDate) + " – " + formatter.format(endDate);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value || 0));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  function appendCreditMetric(parent, label, value, emphasize) {
    var metric = document.createElement("div");
    var title = document.createElement("span");
    var amount = document.createElement("strong");
    title.textContent = label;
    amount.textContent = formatNumber(value);
    if (emphasize) amount.className = "is-emphasized";
    metric.append(title, amount);
    parent.appendChild(metric);
  }

  function renderBillingPackages(packages) {
    var container = document.querySelector("[data-billing-packages]");
    if (!container) return;
    container.innerHTML = "";
    packages.forEach(function (pkg) {
      var card = document.createElement("article");
      card.className = "billing-package";
      var header = document.createElement("div");
      var identity = document.createElement("div");
      var name = document.createElement("h3");
      var price = document.createElement("p");
      var badge = document.createElement("span");
      name.textContent = pkg.name;
      price.textContent = formatCurrency(pkg.price_amount) + " / bulan";
      badge.textContent = "Aktif";
      identity.append(name, price);
      header.append(identity, badge);
      card.appendChild(header);
      if (pkg.included_credits > 0) {
        var credits = document.createElement("div");
        credits.className = "billing-package-credits";
        appendCreditMetric(credits, "Paket", pkg.included_credits, false);
        appendCreditMetric(credits, "Terpakai", pkg.used_credits, false);
        appendCreditMetric(credits, "Sisa", pkg.remaining_credits, true);
        card.appendChild(credits);
      } else {
        var noCredits = document.createElement("small");
        noCredits.textContent = "Tidak memakai alokasi kredit AI.";
        card.appendChild(noCredits);
      }
      container.appendChild(card);
    });
  }

  function renderBilling(billing) {
    setText("[data-billing-period]", formatPeriod(billing.period_start, billing.period_end));
    setText("[data-billing-members]", billing.member_count);
    setText("[data-billing-max-users]", formatLimit(billing.max_users));
    setText("[data-billing-max-listings]", formatLimit(billing.max_listings));
    var features = (billing.enabled_features || []).filter(function (feature) { return feature !== "billing_menu"; });
    setText("[data-billing-module-count]", features.length);
    setText("[data-billing-total-price]", formatCurrency(billing.total_monthly_price));
    setText("[data-billing-included-credits]", formatNumber(billing.included_credits));
    setText("[data-billing-used-credits]", formatNumber(billing.used_credits));
    setText("[data-billing-remaining-credits]", formatNumber(billing.remaining_credits));
    var includedCredits = Number(billing.included_credits || 0);
    var remainingCredits = Number(billing.remaining_credits || 0);
    var remainingPercentage = includedCredits > 0 ? Math.max(0, Math.min(100, remainingCredits / includedCredits * 100)) : 0;
    var progress = document.querySelector("[data-billing-credit-progress]");
    if (progress) {
      progress.setAttribute("aria-valuenow", String(Math.round(remainingPercentage)));
      var progressFill = progress.querySelector("span");
      if (progressFill) progressFill.style.width = remainingPercentage + "%";
    }
    renderBillingPackages(billing.packages || []);
    var tags = document.querySelector("[data-billing-modules]");
    if (tags) {
      tags.innerHTML = "";
      if (!features.length) tags.textContent = "Belum ada modul aktif.";
      features.forEach(function (feature) {
        var tag = document.createElement("span");
        tag.textContent = featureLabels[feature] || feature;
        tags.appendChild(tag);
      });
    }
    var members = document.querySelector("[data-billing-member-list]");
    if (members) {
      members.innerHTML = "";
      (billing.members || []).forEach(function (member) {
        var row = document.createElement("div");
        row.className = "account-member";
        var identity = document.createElement("div");
        var name = document.createElement("b");
        var username = document.createElement("small");
        var roles = document.createElement("span");
        name.textContent = member.display_name || member.username;
        username.textContent = "@" + member.username;
        roles.textContent = member.roles || "Tanpa role";
        identity.append(name, username);
        row.append(identity, roles);
        members.appendChild(row);
      });
    }
  }

  function enterWorkspace(button) {
    button.disabled = true;
    portalApi("/api/portal/workspace/enter", { method: "POST", body: JSON.stringify({ destination: "/" }) })
      .then(function (payload) { window.location.assign(payload.redirectUrl); })
      .catch(function (error) {
        button.disabled = false;
        if (error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          showGuest("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          window.alert(error.message);
        }
      });
  }

  document.querySelectorAll("[data-account-workspace]").forEach(function (button) {
    button.addEventListener("click", function () { enterWorkspace(button); });
  });

  document.querySelectorAll("[data-account-logout]").forEach(function (button) {
    button.addEventListener("click", function () {
      button.disabled = true;
      portalApi("/api/portal/logout", { method: "POST", body: "{}" }).catch(function () {}).finally(function () {
        localStorage.removeItem(TOKEN_KEY);
        window.location.assign("./index.html");
      });
    });
  });

  if (!token) {
    showGuest();
    return;
  }

  portalApi("/api/portal/me")
    .then(function (payload) {
      renderUser(payload.user);
      if (pageName === "billing") return portalApi("/api/portal/billing").then(renderBilling);
      return null;
    })
    .then(function () {
      if (guest) guest.hidden = true;
      if (shell) shell.hidden = false;
    })
    .catch(function (error) {
      if (error.status === 401) localStorage.removeItem(TOKEN_KEY);
      showGuest(error.message);
    });
})();
