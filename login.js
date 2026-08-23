(function () {
  "use strict";

  var AUTH_ORIGIN = "https://onboard.motovax.com";
  var local = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  if (!local && window.location.origin !== AUTH_ORIGIN) {
    window.location.replace(AUTH_ORIGIN + "/login.html" + window.location.search);
    return;
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var loginView = document.querySelector("[data-login-view]");
  var forgotView = document.querySelector("[data-forgot-view]");
  var resetView = document.querySelector("[data-reset-view]");
  var loginForm = document.querySelector("[data-portal-login-form]");
  var forgotForm = document.querySelector("[data-forgot-form]");
  var resetForm = document.querySelector("[data-reset-form]");
  var loginError = document.querySelector("[data-login-error]");
  var loginRegister = document.querySelector("[data-login-register]");
  var loginRegisterPrompt = document.querySelector("[data-login-register-prompt]");
  var loginStatus = document.querySelector("[data-login-status]");
  var forgotError = document.querySelector("[data-forgot-error]");
  var forgotStatus = document.querySelector("[data-forgot-status]");
  var resetError = document.querySelector("[data-reset-error]");
  var googleButton = document.querySelector("[data-google-login]");
  var params = new URLSearchParams(window.location.search);
  var workspace = String(params.get("workspace") || "").trim().toLowerCase();
  var resetToken = String(params.get("token") || "");
  var recoveryMode = params.get("forgot") === "1" || (params.get("reset") === "1" && resetToken);

  function revealLogin() {
    document.body.classList.remove("is-session-checking");
  }

  function showView(view) {
    loginView.hidden = view !== "login";
    forgotView.hidden = view !== "forgot";
    resetView.hidden = view !== "reset";
  }

  function enterActiveWorkspace() {
    return fetch("/api/portal/workspace/enter", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ destination: "/" }),
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (payload) {
        if (!response.ok || !payload.redirectUrl) {
          var error = new Error(payload.message || "Sesi belum dapat dilanjutkan.");
          error.status = response.status;
          throw error;
        }
        return payload.redirectUrl;
      });
    });
  }

  function revokeActivePortalSession() {
    return fetch("/api/portal/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
  }

  function showError(box, message, field) {
    box.hidden = false;
    var messageBox = box.querySelector("[data-error-message]");
    if (messageBox) messageBox.textContent = message;
    else box.textContent = message;
    if (box === loginError) {
      if (loginRegister) loginRegister.hidden = true;
      if (loginRegisterPrompt) loginRegisterPrompt.hidden = false;
    }
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus({ preventScroll: true });
    }
  }

  function clearFeedback(form, errorBox) {
    errorBox.hidden = true;
    var messageBox = errorBox.querySelector("[data-error-message]");
    if (messageBox) messageBox.textContent = "";
    else errorBox.textContent = "";
    if (errorBox === loginError) {
      if (loginRegister) loginRegister.hidden = true;
      if (loginRegisterPrompt) loginRegisterPrompt.hidden = false;
    }
    Array.prototype.forEach.call(form.elements, function (field) {
      field.removeAttribute("aria-invalid");
    });
  }

  function setLoading(form, loading) {
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

  function requestJSON(path, body) {
    return fetch(path, {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (payload) {
        if (!response.ok) {
          var error = new Error(payload.message || "Permintaan belum berhasil. Silakan coba lagi.");
          error.status = response.status;
          throw error;
        }
        return payload;
      });
    });
  }

  function showLogin(message) {
    showView("login");
    clearFeedback(loginForm, loginError);
    if (loginStatus) {
      loginStatus.hidden = !message;
      loginStatus.textContent = message || "";
    }
    window.history.replaceState({}, "", window.location.pathname);
    loginForm.elements.identifier.focus({ preventScroll: true });
  }

  function showForgot() {
    showView("forgot");
    clearFeedback(forgotForm, forgotError);
    forgotStatus.hidden = true;
    forgotStatus.textContent = "";
    var email = params.get("email") || "";
    if (email && !forgotForm.elements.email.value) forgotForm.elements.email.value = email;
    var scope = document.querySelector("[data-recovery-scope]");
    if (scope) {
      scope.hidden = !workspace;
      scope.textContent = workspace ? `Pemulihan dibatasi untuk workspace ${workspace}.` : "";
    }
    forgotForm.elements.email.focus({ preventScroll: true });
  }

  function showReset() {
    showView("reset");
    clearFeedback(resetForm, resetError);
    resetForm.elements.password.focus({ preventScroll: true });
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

  if (recoveryMode) {
    revealLogin();
    if (params.get("reset") === "1" && resetToken) showReset();
    else showForgot();
  } else {
    var requireReauthentication = params.get("reauth") === "1";
    if (params.get("oauth") === "failed" || params.get("oauth") === "denied") {
      var oauthReason = params.get("oauth") === "denied" ? "denied" : params.get("reason");
      showError(loginError, googleErrorMessage(oauthReason));
      if (oauthReason === "account_not_found") {
        if (loginRegister) loginRegister.hidden = false;
        if (loginRegisterPrompt) loginRegisterPrompt.hidden = true;
      }
      params.delete("oauth");
      params.delete("reason");
      var cleanQuery = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (cleanQuery ? "?" + cleanQuery : "") + window.location.hash);
    }

    if (requireReauthentication) {
      params.delete("reauth");
      var reauthQuery = params.toString();
      revokeActivePortalSession().finally(function () {
        window.history.replaceState({}, "", window.location.pathname + (reauthQuery ? "?" + reauthQuery : "") + window.location.hash);
        revealLogin();
      });
    } else {
      enterActiveWorkspace()
        .then(function (redirectUrl) { window.location.replace(redirectUrl); })
        .catch(function (error) {
          revealLogin();
          if (error.status && error.status !== 401) {
            showError(loginError, "Sesi tersimpan belum dapat dibuka. Silakan login kembali.");
          }
        });
    }
  }

  if (googleButton) {
    googleButton.addEventListener("click", function () {
      googleButton.classList.add("is-loading");
      googleButton.setAttribute("aria-busy", "true");
      googleButton.setAttribute("aria-label", "Mengalihkan ke login Google");
    });
  }

  document.querySelector("[data-show-forgot]").addEventListener("click", function () {
    workspace = "";
    params = new URLSearchParams();
    showForgot();
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-back-login]"), function (button) {
    button.addEventListener("click", function () { showLogin(""); });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-password-toggle]"), function (button) {
    button.addEventListener("click", function () {
      var field = document.getElementById(button.getAttribute("aria-controls"));
      var reveal = field.type === "password";
      field.type = reveal ? "text" : "password";
      button.setAttribute("aria-pressed", reveal ? "true" : "false");
      button.setAttribute("aria-label", reveal ? "Sembunyikan password" : "Tampilkan password");
      field.focus({ preventScroll: true });
    });
  });

  Array.prototype.forEach.call(loginForm.elements, function (field) {
    field.addEventListener("input", function () {
      clearFeedback(loginForm, loginError);
      if (loginStatus) loginStatus.hidden = true;
    });
  });
  Array.prototype.forEach.call(forgotForm.elements, function (field) {
    field.addEventListener("input", function () { clearFeedback(forgotForm, forgotError); });
  });
  Array.prototype.forEach.call(resetForm.elements, function (field) {
    field.addEventListener("input", function () { clearFeedback(resetForm, resetError); });
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var identifier = loginForm.elements.identifier.value.trim();
    var password = loginForm.elements.password.value;
    if (identifier.length < 2) return showError(loginError, "Masukkan username atau email akun tenant Anda.", loginForm.elements.identifier);
    if (!password) return showError(loginError, "Masukkan password akun tenant Anda.", loginForm.elements.password);

    setLoading(loginForm, true);
    requestJSON("/api/portal/login", { identifier: identifier, password: password })
      .then(function (payload) {
        if (!payload.redirectUrl) throw new Error("Workspace belum dapat dibuka.");
        window.location.assign(payload.redirectUrl);
      })
      .catch(function (error) {
        showError(loginError, error.message || "Login belum berhasil. Silakan coba lagi.");
        setLoading(loginForm, false);
      });
  });

  forgotForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = forgotForm.elements.email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showError(forgotError, "Masukkan alamat email akun yang valid.", forgotForm.elements.email);
    }
    setLoading(forgotForm, true);
    requestJSON("/api/portal/forgot-password", { email: email, workspace: workspace })
      .then(function (payload) {
        forgotStatus.hidden = false;
        forgotStatus.textContent = payload.message || "Jika email terdaftar, tautan reset telah dikirim.";
      })
      .catch(function (error) {
        showError(forgotError, error.message || "Tautan reset belum dapat dikirim. Silakan coba lagi.");
      })
      .finally(function () { setLoading(forgotForm, false); });
  });

  resetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var password = resetForm.elements.password.value;
    var confirmation = resetForm.elements.passwordConfirm.value;
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return showError(resetError, "Password minimal 8 karakter dan harus berisi huruf serta angka.", resetForm.elements.password);
    }
    if (password !== confirmation) {
      return showError(resetError, "Konfirmasi password baru tidak sama.", resetForm.elements.passwordConfirm);
    }
    setLoading(resetForm, true);
    requestJSON("/api/portal/reset-password", { token: resetToken, password: password })
      .then(function (payload) {
        resetForm.reset();
        showLogin(payload.message || "Password berhasil diperbarui. Silakan login dengan password baru.");
      })
      .catch(function (error) {
        showError(resetError, error.message || "Password belum berhasil diperbarui. Periksa tautan reset lalu coba lagi.");
      })
      .finally(function () { setLoading(resetForm, false); });
  });
})();
