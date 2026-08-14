(function () {
  "use strict";

  var AUTH_ORIGIN = "https://onboard.motovax.com";
  var LANDING_ORIGIN = "https://motovax.ai";
  var local = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  if (!local && window.location.origin !== AUTH_ORIGIN) {
    window.location.replace(AUTH_ORIGIN + "/login.html");
    return;
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
  var form = document.querySelector("[data-portal-login-form]");
  var errorBox = document.querySelector("[data-login-error]");
  var password = document.getElementById("portalPassword");
  var passwordToggle = document.querySelector("[data-password-toggle]");
  var googleButton = document.querySelector("[data-google-login]");

  function showError(message, field) {
    errorBox.hidden = false;
    errorBox.textContent = message;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus({ preventScroll: true });
    }
  }

  function setLoading(loading) {
    var button = form.querySelector('button[type="submit"]');
    if (loading) {
      button.dataset.originalHtml = button.innerHTML;
      button.textContent = button.dataset.loadingLabel;
      button.setAttribute("aria-busy", "true");
    } else {
      button.innerHTML = button.dataset.originalHtml;
      button.removeAttribute("aria-busy");
    }
    Array.prototype.forEach.call(form.elements, function (field) { field.disabled = loading; });
    form.classList.toggle("is-loading", loading);
  }

  function googleErrorMessage(reason) {
    if (reason === "account_not_found") {
      return "Email Google ini belum terdaftar pada workspace MOTOVAX. Gunakan akun tenant lain atau daftar workspace baru.";
    }
    if (reason === "ambiguous_account") {
      return "Email Google ini terhubung ke lebih dari satu workspace. Login memakai email dan password akun tenant yang spesifik.";
    }
    if (reason === "denied") return "Login Google dibatalkan. Silakan coba lagi jika Anda ingin melanjutkan.";
    if (reason === "expired" || reason === "state") return "Sesi login Google telah berakhir. Silakan mulai lagi.";
    if (reason === "configuration") return "Login Google sedang belum tersedia. Gunakan username/email dan password untuk sementara.";
    return "Login Google belum berhasil. Silakan coba lagi atau gunakan password akun tenant Anda.";
  }

  var oauthParams = new URLSearchParams(window.location.search);
  if (oauthParams.get("oauth") === "failed" || oauthParams.get("oauth") === "denied") {
    var oauthReason = oauthParams.get("oauth") === "denied" ? "denied" : oauthParams.get("reason");
    showError(googleErrorMessage(oauthReason));
    oauthParams.delete("oauth");
    oauthParams.delete("reason");
    var cleanQuery = oauthParams.toString();
    window.history.replaceState({}, "", window.location.pathname + (cleanQuery ? "?" + cleanQuery : "") + window.location.hash);
  }

  if (googleButton) {
    googleButton.addEventListener("click", function () {
      googleButton.classList.add("is-loading");
      googleButton.setAttribute("aria-busy", "true");
      googleButton.setAttribute("aria-label", "Mengalihkan ke login Google");
    });
  }

  Array.prototype.forEach.call(form.elements, function (field) {
    field.addEventListener("input", function () {
      field.removeAttribute("aria-invalid");
      errorBox.hidden = true;
      errorBox.textContent = "";
    });
  });

  if (passwordToggle) {
    passwordToggle.addEventListener("click", function () {
      var reveal = password.type === "password";
      password.type = reveal ? "text" : "password";
      passwordToggle.setAttribute("aria-pressed", reveal ? "true" : "false");
      passwordToggle.setAttribute("aria-label", reveal ? "Sembunyikan password" : "Tampilkan password");
      password.focus({ preventScroll: true });
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var identifier = form.elements.identifier.value.trim();
    var passwordValue = form.elements.password.value;
    if (identifier.length < 2) return showError("Masukkan username atau email akun tenant Anda.", form.elements.identifier);
    if (!passwordValue) return showError("Masukkan password akun tenant Anda.", form.elements.password);

    setLoading(true);
    fetch("/api/portal/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier, password: passwordValue }),
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (payload) {
          if (!response.ok) throw new Error(payload.message || "Login belum berhasil. Silakan coba lagi.");
          return payload;
        });
      })
      .then(function (payload) {
        var target = new URL(payload.returnUrl || LANDING_ORIGIN + "/");
        if (target.origin !== LANDING_ORIGIN) target = new URL(LANDING_ORIGIN + "/");
        target.hash = new URLSearchParams({
          portal_session: payload.token,
        }).toString();
        window.location.assign(target.toString());
      })
      .catch(function (error) {
        showError(error.message || "Login belum berhasil. Silakan coba lagi.");
        setLoading(false);
      });
  });
})();
