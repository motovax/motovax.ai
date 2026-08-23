import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { after, before, test } from "node:test";
import { homedir } from "node:os";
import path from "node:path";

import { chromium } from "playwright";

import { createApp } from "../server.mjs";

let browser;
let server;
let baseUrl;

function libraryDirectories(root) {
  if (!existsSync(root)) return [];
  const directories = [root];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) directories.push(...libraryDirectories(path.join(root, entry.name)));
  }
  return directories;
}

before(async () => {
  const app = createApp({
    config: {
      nodeEnv: "test",
      port: 0,
      publicDir: process.cwd(),
      publicBaseUrl: "http://127.0.0.1",
      portalLandingUrl: "https://motovax.ai/",
      oauthSuccessUrl: "http://127.0.0.1/onboarding.html",
      googleClientId: "",
      googleClientSecret: "",
      googleRedirectUri: "http://127.0.0.1/api/auth/google/callback",
      sessionSecret: "",
      databaseUrl: "",
      tenantDomainSuffix: "motovax.com",
      trustProxy: false,
    },
  });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const chromiumRoot = path.join(homedir(), ".local/chromium-root");
  const chromiumPath = path.join(chromiumRoot, "usr/lib/chromium/chromium");
  const useAlpineChromium = existsSync(chromiumPath);
  const libraryPath = [
    ...libraryDirectories(path.join(chromiumRoot, "lib")),
    ...libraryDirectories(path.join(chromiumRoot, "usr/lib")),
  ].join(":");
  browser = await chromium.launch({
    headless: true,
    executablePath: useAlpineChromium ? chromiumPath : undefined,
    args: useAlpineChromium ? ["--disable-gpu", "--disable-gpu-compositing"] : [],
    env: useAlpineChromium ? {
      ...process.env,
      LD_LIBRARY_PATH: libraryPath,
      FONTCONFIG_PATH: path.join(chromiumRoot, "etc/fonts"),
      FONTCONFIG_FILE: path.join(chromiumRoot, "etc/fonts/fonts.conf"),
      FONTCONFIG_SYSROOT: chromiumRoot,
      XDG_DATA_DIRS: path.join(chromiumRoot, "usr/share"),
    } : process.env,
  });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
});

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const publicNavigationPages = [
  "/index.html",
  "/modul.html",
  "/fitur/index.html",
  "/fitur/aplikasi-omnichannel.html",
  "/solusi/otomotif.html",
  "/harga.html",
  "/hubungi-kami.html",
  "/kebijakan-privasi.html",
  "/syarat-ketentuan.html",
];

for (const viewport of viewports) {
  test(`navigasi halaman publik konsisten pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());

    for (const route of publicNavigationPages) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
      const scheduleDemoLinks = await page.locator("a, button").evaluateAll((elements) =>
        elements.filter((element) => /^Jadwalkan Demo(?:\s*(?:→|->))?$/i.test(element.textContent.replace(/\s+/g, " ").trim())).length,
      );
      assert.equal(scheduleDemoLinks, 0, route);
      if (viewport.width > 1024) {
        const labels = await page.locator(".site-header .nav").evaluate((nav) =>
          [...nav.children].map((item) => {
            const target = item.matches("a") ? item : item.querySelector(":scope > button");
            return target?.textContent.replace(/\s+/g, " ").trim() || "";
          }),
        );
        const expectedNav = route === "/index.html"
          ? ["Produk", "Kapabilitas", "Harga", "Hubungi Kami"]
          : ["Produk", "Cara Kerja", "Solusi", "Harga", "Hubungi Kami"];
        assert.deepEqual(labels, expectedNav, route);
      } else {
        await page.click("[data-mobile-nav-trigger]");
        const mobileState = await page.locator("[data-mobile-nav-panel]:not([hidden]) .mobile-nav-links > a, [data-mobile-nav-panel]:not([hidden]) .mobile-nav-links > details > summary").evaluateAll((links) => ({
          labels: links.map((link) => link.textContent),
          allVisible: links.every((link) => {
            const rect = link.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight;
          }),
          bodyLocked: document.body.classList.contains("mobile-menu-open"),
        }));
        assert.deepEqual(
          mobileState.labels.map((label) => label.replace(/[→+]/g, "").trim()),
          ["Produk", "Cara Kerja", "Solusi", "Harga", "Hubungi Kami"],
          route,
        );
        assert.equal(mobileState.allVisible, true, route);
        assert.equal(mobileState.bodyLocked, true, route);
        const login = page.locator(".site-header .header-login");
        if (await login.count()) {
          const loginBox = await login.boundingBox();
          const triggerBox = await page.locator("[data-mobile-nav-trigger]").boundingBox();
          assert.ok(loginBox && triggerBox, route);
          assert.ok(Math.abs(loginBox.y - triggerBox.y) <= 4, `header wrap on ${route}`);
        }
        const urlBeforeProduk = page.url();
        await page.locator('[data-mobile-nav-panel]:not([hidden]) summary', { hasText: "Produk" }).click();
        assert.equal(page.url(), urlBeforeProduk, route);
        assert.equal(await page.locator("[data-mobile-nav-panel]:not([hidden]) .mobile-product-suite").count(), 6, route);
        assert.equal(await page.locator('[data-mobile-nav-panel]:not([hidden]) .mobile-product-suite > p', { hasText: "Core Platform" }).isVisible(), true, route);
        assert.equal(await page.locator('[data-mobile-nav-panel]:not([hidden]) a', { hasText: "Lead / Customer List" }).isVisible(), true, route);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("[data-mobile-nav-panel]").isHidden(), true, route);
        assert.equal(await page.locator("body").evaluate((body) => body.classList.contains("mobile-menu-open")), false, route);
      }
      assert.equal(await noOverflow(page), true, route);
    }

    await context.close();
  });
}

for (const viewport of viewports) {
  test(`CTA daftar membuka formulir registrasi awal kosong pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      localStorage.setItem("motovax_onboarding_v1", JSON.stringify({
        step: 4,
        account: { fullName: "Owner Demo", email: "owner@demo.test" },
        business: { businessName: "Tenant Demo", workspaceSlug: "tenant-demo", industry: "automotive" },
        completed: true,
        workspace: { id: "tenant-demo", name: "Tenant Demo", domain: "tenant-demo.motovax.com", ready: true },
      }));
    });
    const page = await context.newPage();
    let logoutCount = 0;
    let meCount = 0;
    let workspaceEnterCount = 0;
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: true, siteKey: "test", action: "complete_onboarding" } }) }));
    await page.route("**/api/auth/logout", (route) => {
      logoutCount += 1;
      return route.fulfill({ status: 204 });
    });
    await page.route("**/api/auth/me", (route) => {
      meCount += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
        authenticated: true,
        user: { id: "owner-demo", email: "owner@demo.test", fullName: "Owner Demo", provider: "password" },
        profile: { business_name: "Tenant Demo", workspace_slug: "tenant-demo" },
        workspaces: [{ id: "tenant-demo", name: "Tenant Demo", domain: "tenant-demo.motovax.com", ready: true }],
      }) });
    });
    await page.route("**/api/portal/workspace/enter", (route) => {
      workspaceEnterCount += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ redirectUrl: "https://tenant-demo.motovax.com/magic-login?token=stale-register-session" }) });
    });

    await page.goto(`${baseUrl}/onboarding.html?fresh=1`, { waitUntil: "load" });
    await page.waitForFunction(() => !new URL(window.location.href).searchParams.has("fresh"));
    await page.waitForSelector('[data-step="1"].is-active');

    assert.equal(logoutCount, 1);
    assert.equal(meCount, 0);
    assert.equal(workspaceEnterCount, 0);
    assert.equal(await page.inputValue('[data-auth-form="signup"] input[name="fullName"]'), "");
    assert.equal(await page.inputValue('[data-auth-form="signup"] input[name="email"]'), "");
    assert.equal(await page.locator('[data-step="4"]').isHidden(), true);
    assert.equal(await page.getByText("Jadwalkan demo live", { exact: false }).count(), 0);
    assert.equal(await page.getByRole("link", { name: "Jadwalkan Demo", exact: true }).count(), 0);
    assert.equal(await page.getByRole("link", { name: "Kembali ke beranda", exact: false }).count(), 1);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("motovax_onboarding_v1")).workspace), null);
    const onboardingShellStyle = await page.evaluate(() => {
      const panel = document.querySelector(".onboarding-panel");
      const activeRailStep = document.querySelector(".onboarding-rail li.is-active");
      const secondRailStep = document.querySelector('[data-rail-step="2"]');
      const progress = document.querySelector(".onboarding-progress");
      const legal = document.querySelector("[data-onboarding-legal]");
      const panelStyle = getComputedStyle(panel);
      const activeRailStyle = getComputedStyle(activeRailStep);
      const activeNumberStyle = getComputedStyle(activeRailStep.querySelector("i"));
      return {
        panelBorderStyle: panelStyle.borderStyle,
        panelBorderRadius: panelStyle.borderRadius,
        panelBoxShadow: panelStyle.boxShadow,
        panelBackground: panelStyle.backgroundColor,
        activeRailBackground: activeRailStyle.backgroundColor,
        activeRailBoxShadow: activeRailStyle.boxShadow,
        activeNumberBoxShadow: activeNumberStyle.boxShadow,
        secondRailConnectorContent: getComputedStyle(secondRailStep, "::before").content,
        currentStepCopy: document.querySelector(".onboarding-rail-head strong")?.textContent.replace(/\s+/g, " ").trim(),
        activeAriaCurrent: activeRailStep.getAttribute("aria-current"),
        progressDisplay: getComputedStyle(progress).display,
        railInsidePanel: panel.contains(activeRailStep),
        legalOutsidePanel: !panel.contains(legal),
      };
    });
    assert.equal(onboardingShellStyle.railInsidePanel, true);
    assert.equal(onboardingShellStyle.legalOutsidePanel, true);
    assert.equal(onboardingShellStyle.progressDisplay, "none");
    assert.equal(onboardingShellStyle.currentStepCopy, "Langkah 1 dari 4 · Akun");
    assert.equal(onboardingShellStyle.activeAriaCurrent, "step");
    assert.notEqual(onboardingShellStyle.activeNumberBoxShadow, "none");
    assert.notEqual(onboardingShellStyle.secondRailConnectorContent, "none");
    assert.equal(await fitsViewport(page), true);
    if (viewport.width <= 720) {
      assert.equal(onboardingShellStyle.panelBorderStyle, "none");
      assert.equal(onboardingShellStyle.panelBorderRadius, "0px");
      assert.equal(onboardingShellStyle.panelBoxShadow, "none");
      assert.equal(onboardingShellStyle.panelBackground, "rgba(0, 0, 0, 0)");
      assert.equal(onboardingShellStyle.activeRailBackground, "rgba(0, 0, 0, 0)");
      assert.equal(onboardingShellStyle.activeRailBoxShadow, "none");
    } else {
      assert.notEqual(onboardingShellStyle.panelBorderStyle, "none");
      assert.equal(onboardingShellStyle.panelBorderRadius, "12px");
      assert.equal(onboardingShellStyle.panelBoxShadow, "none");
    }
    const primaryButtonStyles = await page.evaluate(() => [...document.querySelectorAll(".onboarding-panel .btn-primary:not(:disabled)")].map((button) => {
      const style = getComputedStyle(button);
      const arrow = button.querySelector(":scope > span:last-child, :scope > i:last-child");
      const arrowStyle = arrow ? getComputedStyle(arrow) : null;
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        arrowBackgroundColor: arrowStyle?.backgroundColor || null,
        arrowBorderWidth: arrowStyle?.borderTopWidth || null,
      };
    }));
    assert.ok(primaryButtonStyles.length >= 5);
    assert.equal(new Set(primaryButtonStyles.map((style) => style.backgroundColor)).size, 1);
    assert.equal(new Set(primaryButtonStyles.map((style) => style.borderRadius)).size, 1);
    assert.equal(new Set(primaryButtonStyles.map((style) => style.boxShadow)).size, 1);
    assert.equal(primaryButtonStyles.every((style) => style.arrowBackgroundColor === null || style.arrowBackgroundColor === "rgba(0, 0, 0, 0)"), true);
    assert.equal(primaryButtonStyles.every((style) => style.arrowBorderWidth === null || style.arrowBorderWidth === "0px"), true);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-fresh-registration-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}

for (const viewport of viewports) {
  test(`kartu kapabilitas homepage konsisten pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index-legacy.html`, { waitUntil: "load" });

    const section = page.locator("#solusi");
    await section.scrollIntoViewIfNeeded();
    const layout = await section.evaluate((element) => {
      const intro = element.querySelector(".solution-intro").getBoundingClientRect();
      const grid = element.querySelector(".solution-grid").getBoundingClientRect();
      const cards = [...element.querySelectorAll(".solution-card")].map((card) => {
        const rect = card.getBoundingClientRect();
        const style = getComputedStyle(card);
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          backgroundColor: style.backgroundColor,
          color: style.color,
        };
      });
      const allCapabilitiesLink = element.querySelector(".solution-intro > a").getBoundingClientRect();
      return {
        cards,
        introGap: grid.top - intro.bottom,
        allCapabilitiesLinkHeight: allCapabilitiesLink.height,
      };
    });

    assert.equal(layout.cards.length, 6);
    assert.equal(new Set(layout.cards.map((card) => card.backgroundColor)).size, 1);
    assert.equal(new Set(layout.cards.map((card) => card.color)).size, 1);
    assert.ok(layout.introGap >= 29, `jarak judul ke kartu ${layout.introGap}px`);
    assert.ok(layout.allCapabilitiesLinkHeight >= 44);

    const firstRowY = layout.cards[0].y;
    const firstRowCards = layout.cards.filter((card) => Math.abs(card.y - firstRowY) < 1);
    assert.equal(firstRowCards.length, viewport.name === "desktop" ? 3 : viewport.name === "tablet" ? 2 : 1);
    assert.ok(layout.cards.every((card) => Math.abs(card.height - layout.cards[0].height) < .1));
    assert.equal(await noOverflow(page), true);

    await section.screenshot({ path: `/tmp/motovax-solution-cards-${viewport.name}.png` });
    await context.close();
  });
}

function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

function fitsViewport(page) {
  return page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight);
}

for (const viewport of viewports) {
  test(`verifikasi email manual responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      window.grecaptcha = { enterprise: { ready(callback) { callback(); }, execute() { return Promise.resolve("recaptcha-token"); } } };
    });
    const page = await context.newPage();
    let resendCount = 0;
    let cancelCount = 0;
    let mePayload = null;
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: true, siteKey: "test", action: "complete_onboarding" } }) }));
    await page.route("**/api/auth/me", (route) => mePayload
      ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mePayload) })
      : route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ authenticated: false }) }));
    await page.route("**/api/auth/pending-signup", (route) => {
      if (route.request().method() === "DELETE") {
        cancelCount += 1;
        return route.fulfill({ status: 204 });
      }
      return route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ pending: false }) });
    });
    await page.route("**/api/auth/signup", (route) => route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ verificationRequired: true, email: "owner.dealer@gmail.com", expiresInSeconds: 86400, resendAfterSeconds: 1 }),
    }));
    await page.route("**/api/auth/resend-verification", (route) => {
      resendCount += 1;
      return route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ sent: true, email: "owner.dealer@gmail.com", resendAfterSeconds: 60, expiresInSeconds: 86400 }),
      });
    });

    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Dealer");
    await page.fill('[data-auth-form="signup"] input[name="email"]', "owner.dealer@gmail.com");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia123");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia123");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-verification-panel]:not([hidden])');

    assert.equal(await page.locator('[data-auth-form="signup"]').isHidden(), true);
    assert.equal(await page.locator('[data-google-login]').isHidden(), true);
    assert.equal(await page.locator('[data-verification-email]').textContent(), "owner.dealer@gmail.com");
    assert.match(await page.locator('[data-verification-mailbox]').textContent(), /Buka Gmail/);
    assert.match(await page.locator('[data-verification-status]').textContent(), /24 jam/);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-email-verification-${viewport.name}.png`, fullPage: false });
    if (viewport.name === "mobile") {
      await page.locator('.email-verification-actions').scrollIntoViewIfNeeded();
      await page.screenshot({ path: "/tmp/motovax-email-verification-mobile-actions.png", fullPage: false });
    }

    mePayload = {
      authenticated: true,
      user: { id: "old-session", email: "akun-lama@dealer.test", emailVerified: true, fullName: "Akun Lama", provider: "password" },
      profile: null,
      workspaces: [],
    };
    await page.click('[data-verification-check]');
    await page.waitForFunction(() => document.querySelector('[data-verification-status]')?.textContent.includes("belum terverifikasi"));
    assert.equal(await page.locator('[data-verification-panel]').isVisible(), true);
    assert.equal(await page.locator('[data-step="2"]').isHidden(), true);

    await page.waitForTimeout(1100);
    await page.click('[data-verification-resend]');
    await page.waitForFunction(() => document.querySelector('[data-verification-status]')?.textContent.includes("Email baru sudah dikirim"));
    assert.equal(resendCount, 1);
    assert.match(await page.locator('[data-verification-resend]').textContent(), /Kirim ulang dalam/);
    assert.match(await page.locator('[data-verification-status]').textContent(), /link sebelumnya otomatis tidak berlaku/i);

    await page.click('[data-verification-change]');
    await page.waitForSelector('[data-auth-form="signup"]:not([hidden])');
    assert.equal(cancelCount, 1);
    assert.equal(await page.inputValue('[data-auth-form="signup"] input[name="email"]'), "");
    assert.equal(await noOverflow(page), true);
    await context.close();
  });
}

test("link verifikasi kedaluwarsa menampilkan pemulihan yang jelas", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: false } }) }));
  await page.route("**/api/auth/me", (route) => route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ authenticated: false }) }));
  await page.route("**/api/auth/pending-signup", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ pending: true, email: "owner@dealer.test", resendAfterSeconds: 0, expiresInSeconds: 86400 }) }));
  await page.goto(`${baseUrl}/onboarding.html?email=expired`, { waitUntil: "load" });
  await page.waitForSelector('[data-verification-panel][data-state="error"]:not([hidden])');
  assert.equal(await page.locator('[data-auth-title]').textContent(), "Link verifikasi kedaluwarsa");
  assert.equal(await page.locator('[data-verification-title]').textContent(), "Minta link verifikasi baru");
  assert.match(await page.locator('[data-verification-status]').textContent(), /Kirim ulang email/);
  assert.equal(await noOverflow(page), true);
  await context.close();
});

test("verifikasi berhasil berlanjut ke profil dealer dengan konfirmasi", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: false } }) }));
  await page.route("**/api/auth/me", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
    authenticated: true,
    user: { id: "owner-verified", email: "owner@dealer.test", emailVerified: true, fullName: "Owner Dealer", provider: "password" },
    profile: null,
    workspaces: [],
  }) }));
  await page.goto(`${baseUrl}/onboarding.html?email=verified`, { waitUntil: "load" });
  await page.waitForSelector('[data-step="2"].is-active');
  assert.equal(await page.locator('[data-email-verified-banner]').isVisible(), true);
  assert.match(await page.locator('[data-email-verified-banner]').textContent(), /Email berhasil diverifikasi/);
  assert.equal(new URL(page.url()).searchParams.has("email"), false);
  assert.equal(await noOverflow(page), true);
  await context.close();
});

test("alur final berhenti menunggu setelah 3 detik ketika server tidak merespons", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    window.grecaptcha = { enterprise: { ready(callback) { callback(); }, execute() { return Promise.resolve("recaptcha-token"); } } };
    localStorage.setItem("motovax_onboarding_v1", JSON.stringify({
      step: 3,
      authMode: "signup",
      account: { fullName: "Owner Dealer", email: "owner@dealer.test", provider: "password" },
      business: { businessName: "Dealer Timeout", workspaceSlug: "dealer-timeout", branchCount: "", region: "", industry: "automotive", description: "" },
      modules: ["ims", "omni", "crm"],
      goal: "conversion",
      completed: false,
      workspace: null,
    }));
  });
  const page = await context.newPage();
  await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: true, siteKey: "test", action: "complete_onboarding" } }) }));
  await page.route("**/api/auth/me", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
    authenticated: true,
    user: { id: "owner-timeout", email: "owner@dealer.test", fullName: "Owner Dealer", provider: "password" },
    profile: { business_name: "Dealer Timeout", workspace_slug: "dealer-timeout", branch_count: "", region: "", description: "", modules: ["ims", "omni", "crm"], goal: "conversion" },
    workspaces: [],
  }) }));
  await page.route("**/api/onboarding/profile", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ profile: route.request().postDataJSON() }) }));

  await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
  await page.waitForSelector('[data-step="3"].is-active');
  await page.evaluate(() => {
    const originalFetch = window.fetch.bind(window);
    window.__finalTimeoutStartedAt = 0;
    window.__finalTimeoutEndedAt = 0;
    const form = document.querySelector("[data-modules-form]");
    const error = form?.querySelector("[data-form-error]");
    form?.addEventListener("submit", () => {
      window.__finalTimeoutStartedAt = performance.now();
    }, { capture: true, once: true });
    if (error) {
      const observer = new MutationObserver(() => {
        if (!error.hidden && !window.__finalTimeoutEndedAt) {
          window.__finalTimeoutEndedAt = performance.now();
          observer.disconnect();
        }
      });
      observer.observe(error, { attributes: true, attributeFilter: ["hidden"] });
    }
    window.fetch = (input, options = {}) => {
      if (String(input).includes("/api/onboarding/complete")) {
        return new Promise((_, reject) => {
          options.signal?.addEventListener("abort", () => {
            reject(new DOMException("Request dibatalkan karena timeout.", "AbortError"));
          }, { once: true });
        });
      }
      return originalFetch(input, options);
    };
  });
  await page.click('[data-modules-form] button[type="submit"]');
  await page.waitForSelector('[data-modules-form] [data-form-error]:not([hidden])', { timeout: 4500 });
  const elapsed = await page.evaluate(() => window.__finalTimeoutEndedAt - window.__finalTimeoutStartedAt);
  assert.ok(elapsed >= 2500 && elapsed < 3400, `timeout UI selesai dalam ${elapsed}ms`);
  assert.match(await page.locator('[data-modules-form] [data-form-error]').textContent(), /batas waktu/);
  assert.equal(await page.locator('[data-modules-form] button[type="submit"]').isEnabled(), true);
  assert.equal(await page.getAttribute('[data-modules-form] button[type="submit"]', "aria-busy"), null);
  assert.equal(await noOverflow(page), true);
  await context.close();
});

test("tombol cek hanya melanjutkan akun pending yang sama setelah verified", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem("motovax_onboarding_v1", JSON.stringify({
      step: 1,
      authMode: "signup",
      account: { fullName: "Owner Dealer", email: "owner@dealer.test", provider: "password" },
      pendingVerification: { email: "owner@dealer.test", resendAvailableAt: 0 },
      business: { businessName: "", workspaceSlug: "", branchCount: "", region: "", industry: "automotive", description: "" },
      modules: ["ims", "omni", "crm"],
      goal: "conversion",
      completed: false,
      workspace: null,
    }));
  });
  const page = await context.newPage();
  let verified = false;
  await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: false } }) }));
  await page.route("**/api/auth/pending-signup", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ pending: true, email: "owner@dealer.test", resendAfterSeconds: 0, expiresInSeconds: 86400 }) }));
  await page.route("**/api/auth/me", (route) => verified
    ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
      authenticated: true,
      user: { id: "owner-verified", email: "owner@dealer.test", emailVerified: true, fullName: "Owner Dealer", provider: "password" },
      profile: null,
      workspaces: [],
    }) })
    : route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ authenticated: false }) }));

  await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
  await page.waitForSelector('[data-verification-panel]:not([hidden])');
  verified = true;
  await page.click('[data-verification-check]');
  await page.waitForSelector('[data-step="2"].is-active');
  assert.equal(await page.locator('[data-email-verified-banner]').isVisible(), true);
  await context.close();
});

for (const viewport of viewports) {
  test(`onboarding dealer mandiri responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      window.grecaptcha = { enterprise: { ready(callback) { callback(); }, execute() { return Promise.resolve("recaptcha-token"); } } };
    });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/auth/me", (route) => route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ authenticated: false }) }));
    await page.route("**/api/config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ recaptcha: { enabled: true, siteKey: "test", action: "complete_onboarding" } }) }));
    let signupCount = 0;
    let profilePayload;
    await page.route("**/api/auth/signup", (route) => {
      signupCount += 1;
      const accountPayload = route.request().postDataJSON();
      const savedProfile = profilePayload ? {
        business_name: profilePayload.businessName,
        workspace_slug: profilePayload.workspaceSlug,
        branch_count: profilePayload.branchCount,
        region: profilePayload.region,
        description: profilePayload.description,
        modules: profilePayload.modules,
        goal: profilePayload.goal,
      } : null;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          authenticated: true,
          accountUpdated: signupCount > 1,
          user: { id: "owner-1", email: accountPayload.email, fullName: accountPayload.fullName, provider: "password" },
          profile: savedProfile,
          workspaces: [],
        }),
      });
    });
    await page.route("**/api/onboarding/slug?**", (route) => {
      const slug = new URL(route.request().url()).searchParams.get("slug");
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ slug, available: true, domain: `${slug}.motovax.com` }) });
    });
    await page.route("**/api/onboarding/profile", (route) => {
      profilePayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ profile: profilePayload, domain: `${profilePayload.workspaceSlug}.motovax.com` }) });
    });
    await page.route("**/api/onboarding/complete", (route) => route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        workspace: {
          id: "tenant-1",
          name: "Dealer Maju Jaya",
          domain: "dealer-maju-jaya.motovax.com",
          ready: true,
          redirectUrl: "https://workspace.motovax.com/magic-login?token=onboarding-handoff",
        },
      }),
    }));
    let resolveWorkspaceRedirect;
    const workspaceRedirect = new Promise((resolve) => { resolveWorkspaceRedirect = resolve; });
    await page.route("https://workspace.motovax.com/**", (route) => {
      resolveWorkspaceRedirect({ url: route.request().url(), requestedAt: Date.now() });
      return route.abort("aborted");
    });

    await page.goto(`${baseUrl}/onboarding.html`, { waitUntil: "load" });
    await page.waitForSelector('[data-step="1"].is-active');
    assert.equal(await page.locator("[data-rail-step]").count(), 4);
    assert.equal(await page.locator("[data-onboarding-choice]").count(), 0);
    assert.equal(await page.locator("[data-industry]").count(), 0);

    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Dealer");
    await page.fill('[data-auth-form="signup"] input[name="email"]', "owner@dealer.test");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia123");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia123");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-step="2"].is-active');

    await page.fill('[data-business-form] input[name="businessName"]', "Dealer Maju Jaya");
    assert.equal(await page.inputValue('[data-business-form] input[name="workspaceSlug"]'), "dealer-maju-jaya");
    assert.equal(await page.getAttribute('[data-business-form] select[name="branchCount"]', "required"), null);
    assert.equal(await page.getAttribute('[data-business-form] input[name="region"]', "required"), null);
    await page.locator('[data-business-form] input[name="workspaceSlug"]').blur();
    await page.waitForSelector('[data-slug-status][data-state="available"]');
    await page.click('[data-business-form] button[type="submit"]');
    await page.waitForSelector('[data-step="3"].is-active');
    assert.equal(profilePayload.industry, "automotive");
    assert.equal(profilePayload.branchCount, "");
    assert.equal(profilePayload.region, "");

    await page.click('[data-step="3"] [data-step-back]');
    await page.waitForSelector('[data-step="2"].is-active');
    await page.click('[data-step="2"] [data-step-back]');
    await page.waitForSelector('[data-step="1"].is-active');
    await page.fill('[data-auth-form="signup"] input[name="fullName"]', "Owner Dealer Diperbarui");
    await page.fill('[data-auth-form="signup"] input[name="password"]', "rahasia456");
    await page.fill('[data-auth-form="signup"] input[name="passwordConfirm"]', "rahasia456");
    await page.click('[data-auth-form="signup"] button[type="submit"]');
    await page.waitForSelector('[data-step="2"].is-active');
    assert.equal(signupCount, 2);
    assert.equal(await page.locator('[data-auth-form="signup"] [data-form-error]').isHidden(), true);
    assert.equal(await page.inputValue('[data-business-form] input[name="businessName"]'), "Dealer Maju Jaya");
    await page.click('[data-business-form] button[type="submit"]');
    await page.waitForSelector('[data-step="3"].is-active');

    const redirectStartedAt = Date.now();
    await page.locator('[data-modules-form] button[type="submit"]').evaluate((button) => button.click());
    await page.waitForSelector('[data-step="4"].is-active');
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      industry: document.querySelector("[data-summary-industry]")?.textContent.trim(),
      branches: document.querySelector("[data-summary-branches]")?.textContent.trim(),
      railActive: document.querySelector("[data-rail-step].is-active")?.getAttribute("data-rail-step"),
      railAriaCurrent: document.querySelector("[data-rail-step].is-active")?.getAttribute("aria-current"),
      progressCopy: document.querySelector(".onboarding-rail-head strong")?.textContent.replace(/\s+/g, " ").trim(),
      redirectVisible: !document.querySelector("[data-redirect-state]")?.hidden,
      redirectBusy: document.querySelector("[data-redirect-state]")?.getAttribute("aria-busy"),
      summaryHidden: document.querySelector("[data-workspace-summary]")?.hidden,
      actionsHidden: document.querySelector("[data-workspace-actions]")?.hidden,
    }));
    assert.deepEqual(result, {
      overflow: false,
      industry: "Dealer mobil",
      branches: "Belum ditentukan",
      railActive: "4",
      railAriaCurrent: "step",
      progressCopy: "Langkah 4 dari 4 · Siap digunakan",
      redirectVisible: true,
      redirectBusy: "true",
      summaryHidden: true,
      actionsHidden: true,
    });
    await page.screenshot({ path: `/tmp/motovax-onboarding-${viewport.name}.png`, fullPage: false });
    const redirect = await workspaceRedirect;
    assert.ok(redirect.requestedAt - redirectStartedAt < 3000);
    assert.equal(new URL(redirect.url).searchParams.get("token"), "onboarding-handoff");
    await context.close();
  });

  test(`halaman login tenant responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    let loginPayload;
    let forgotPayload;
    let resetPayload;
    await page.route("**/api/portal/login", (route) => {
      loginPayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ redirectUrl: "https://dealer-test.motovax.com/magic-login?token=login-handoff" }) });
    });
    await page.route("**/api/portal/forgot-password", (route) => {
      forgotPayload = route.request().postDataJSON();
      return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ message: "Jika email terdaftar, tautan reset telah dikirim." }) });
    });
    await page.route("**/api/portal/reset-password", (route) => {
      resetPayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "Password berhasil diperbarui. Silakan login dengan password baru." }) });
    });
    await page.route("https://dealer-test.motovax.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Workspace Dealer</title>" }));
    await page.goto(`${baseUrl}/login.html?oauth=failed&reason=account_not_found`, { waitUntil: "load" });
    await page.waitForSelector(".portal-login-auth-content:visible");
    assert.equal(await page.locator('[data-login-error]').isVisible(), true);
    assert.match(await page.locator('[data-login-error]').textContent(), /belum terdaftar pada workspace MOTOVAX/);
    assert.equal(await page.locator('[data-login-register]').isVisible(), true);
    assert.equal(await page.getAttribute('[data-login-register]', "href"), "https://onboard.motovax.com/onboarding.html?fresh=1");
    assert.match(await page.locator('[data-login-register]').textContent(), /Daftar workspace baru/);
    assert.equal(new URL(page.url()).searchParams.has("oauth"), false);
    assert.equal(await fitsViewport(page), true);

    await page.goto(`${baseUrl}/login.html?oauth=denied`, { waitUntil: "load" });
    await page.waitForSelector(".portal-login-auth-content:visible");
    assert.equal(await page.locator('[data-login-error]').isVisible(), true);
    assert.equal(await page.locator('[data-login-register]').isHidden(), true);

    await page.goto(`${baseUrl}/login.html?forgot=1&workspace=dealer-test.motovax.com&email=owner%40dealer.test`, { waitUntil: "load" });
    await page.waitForSelector("[data-forgot-view]:visible");
    assert.match(await page.locator("[data-recovery-scope]").textContent(), /dealer-test\.motovax\.com/);
    assert.equal(await page.inputValue('[data-forgot-form] input[name="email"]'), "owner@dealer.test");
    await page.click('[data-forgot-form] button[type="submit"]');
    await page.waitForSelector("[data-forgot-status]:visible");
    assert.deepEqual(forgotPayload, { email: "owner@dealer.test", workspace: "dealer-test.motovax.com" });
    assert.equal(await noOverflow(page), true);
    await page.click("[data-back-login]");
    assert.equal(await page.locator("[data-login-view]").isVisible(), true);

    await page.goto(`${baseUrl}/login.html?reset=1&token=test-reset-token`, { waitUntil: "load" });
    await page.waitForSelector("[data-reset-view]:visible");
    await page.fill('#portalResetPassword', "passwordBaru123");
    await page.fill('#portalResetPasswordConfirm', "passwordBaru123");
    await page.click('[data-reset-form] button[type="submit"]');
    await page.waitForSelector("[data-login-status]:visible");
    assert.deepEqual(resetPayload, { token: "test-reset-token", password: "passwordBaru123" });
    assert.match(await page.locator("[data-login-status]").textContent(), /berhasil diperbarui/);
    assert.equal(await fitsViewport(page), true);

    await page.goto(`${baseUrl}/login.html`, { waitUntil: "load" });
    await page.waitForSelector(".portal-login-auth-content:visible");
    assert.equal(await page.getAttribute('.portal-register-prompt a', "href"), "https://onboard.motovax.com/onboarding.html?fresh=1");
    assert.equal(await page.locator('[data-google-login]').isVisible(), true);
    assert.equal(await page.getAttribute('[data-google-login]', "href"), "https://onboard.motovax.com/api/auth/google/start?mode=portal");
    assert.equal(await page.getByRole("link", { name: "Login dengan Google", exact: true }).count(), 1);
    assert.equal(await page.locator('input[name="workspace"]').count(), 0);
    await page.fill('input[name="identifier"]', "owner");
    await page.click('[data-portal-login-form] button[type="submit"]');
    assert.equal(await page.locator('[data-login-error]').isVisible(), true);
    assert.equal(await fitsViewport(page), true);
    await page.fill('#portalPassword', "rahasia123");
    await page.click('[data-password-toggle][aria-controls="portalPassword"]');
    assert.equal(await page.getAttribute('#portalPassword', "type"), "text");
    await page.click('[data-password-toggle][aria-controls="portalPassword"]');
    assert.equal(await noOverflow(page), true);
    assert.equal(await fitsViewport(page), true);
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    await page.screenshot({ path: `/tmp/motovax-login-${viewport.name}.png`, fullPage: false });
    const response = page.waitForResponse((item) => item.url().endsWith("/api/portal/login"));
    await page.click('[data-portal-login-form] button[type="submit"]');
    await response;
    await page.waitForURL("https://dealer-test.motovax.com/**");
    assert.deepEqual(loginPayload, { identifier: "owner", password: "rahasia123" });
    assert.equal(new URL(page.url()).searchParams.get("token"), "login-handoff");
    await context.close();
  });

  test(`landing tidak menampilkan portal akun pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    assert.equal(await page.locator("[data-portal-account], [data-portal-workspace], [data-portal-billing]").count(), 0);
    assert.equal(await page.getByRole("link", { name: "Login/Daftar", exact: true }).count(), 1);
    assert.equal(await page.getAttribute('.site-header .header-login', "href"), "https://onboard.motovax.com/login.html?reauth=1");
    assert.equal(await page.locator('a[href="https://onboard.motovax.com/onboarding.html?fresh=1"]').count(), 2);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-stateless-landing-${viewport.name}.png`, fullPage: false });
    await context.close();
  });

  test(`navigasi beranda responsif pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("https://onboard.motovax.com/api/portal/me", (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });

    const trigger = page.locator("[data-mobile-nav-trigger]");
    const panel = page.locator("[data-mobile-nav-panel]");
    assert.equal(await trigger.count(), 1);

    if (viewport.width > 1024) {
      assert.equal(await trigger.isHidden(), true);
      assert.equal(await page.locator(".nav").isVisible(), true);
    } else {
      assert.equal(await trigger.isVisible(), true);
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
      await trigger.click();
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      assert.equal(await panel.isVisible(), true);
      assert.equal(await panel.locator("summary", { hasText: "Produk" }).isVisible(), true);
      assert.equal(await panel.locator("a", { hasText: "Cara Kerja" }).isVisible(), true);
      assert.equal(await panel.locator("a", { hasText: "Harga" }).isVisible(), true);
      const urlBeforeProduk = page.url();
      await panel.locator("summary", { hasText: "Produk" }).click();
      assert.equal(page.url(), urlBeforeProduk);
      assert.equal(await panel.locator(".mobile-product-suite").count(), 6);
      assert.equal(await panel.locator(".mobile-product-suite > p", { hasText: "Jasmine AI + Omnichannel" }).isVisible(), true);
      assert.equal(await panel.locator(".mobile-product-suite > p", { hasText: "Falcon AI + Inventory" }).isVisible(), true);
      assert.equal(await panel.locator(".mobile-product-suite > p", { hasText: "Iris AI + Social Media" }).isVisible(), true);
      assert.equal(await panel.locator("a", { hasText: "WhatsApp, Instagram & Facebook" }).isVisible(), true);
      await panel.locator("summary", { hasText: "Solusi" }).click();
      assert.equal(await panel.locator("a", { hasText: "Solusi dealer secara menyeluruh" }).isVisible(), true);
      assert.equal(await panel.locator("a", { hasText: "Tangkap & respons setiap lead" }).isVisible(), true);
      assert.equal(await panel.locator("a", { hasText: "Putar stok lebih cepat" }).isVisible(), true);
      assert.equal(await panel.locator("a", { hasText: "Owner & Manajemen" }).isVisible(), true);
      const panelBox = await panel.boundingBox();
      assert.ok(panelBox);
      assert.ok(Math.abs(panelBox.y + panelBox.height - viewport.height) <= 1);
      assert.ok(panelBox.height > viewport.height / 2);
      assert.equal(await page.locator("body").evaluate((body) => getComputedStyle(body).overflow), "hidden");
      await page.screenshot({ path: `/tmp/motovax-mobile-navigation-open-${viewport.name}.png`, fullPage: false });
      await panel.evaluate((element) => element.scrollTo({ top: element.scrollHeight, behavior: "instant" }));
      const mobileCtaBox = await panel.locator(".mobile-nav-cta").boundingBox();
      assert.ok(mobileCtaBox);
      assert.ok(mobileCtaBox.y >= panelBox.y - 1);
      assert.ok(mobileCtaBox.y + mobileCtaBox.height <= viewport.height + 1);
      await page.keyboard.press("Escape");
      assert.equal(await panel.isHidden(), true);
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
      await page.waitForTimeout(250);
    }

    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-mobile-navigation-${viewport.name}.png`, fullPage: false });
    await context.close();
  });

  test(`positioning dealer mobil konsisten pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());

    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    assert.equal(
      await page.locator("[data-typewriter]").getAttribute("data-phrases"),
      "One Stock.|More Sales.|Faster Response.|Unlimited Growth.",
    );
    assert.equal(await noOverflow(page), true);

    await page.goto(`${baseUrl}/solusi/otomotif.html`, { waitUntil: "load" });
    await page.waitForSelector("[data-industry-root] h1");
    const bodyText = await page.locator("body").innerText();
    assert.match(bodyText, /dealer mobil/i);
    assert.doesNotMatch(bodyText, /Pendidikan|Keuangan|Kesehatan|Tour & Travel|Perhotelan|Logistik|FMCG|Ritel|Outsourcing|Property/i);

    if (viewport.width > 1024) {
      await page.click("[data-solusi-trigger]");
      assert.equal(
        await page.locator('[data-solusi-panel]:not([hidden]) .solusi-mega-item', { hasText: "Tangkap & respons setiap lead" }).isVisible(),
        true,
      );
      assert.equal(
        await page.locator('[data-solusi-panel]:not([hidden]) .solusi-mega-item', { hasText: "Kendalikan performa semua cabang" }).isVisible(),
        true,
      );
      assert.equal(await page.locator('[data-solusi-panel]:not([hidden]) .solusi-outcome-item').count(), 5);
      assert.equal(await page.locator('[data-solusi-panel]:not([hidden]) .solusi-role-group', { hasText: "Owner & Manajemen" }).isVisible(), true);
      assert.equal(await page.locator('[data-solusi-panel]:not([hidden]) .solusi-mega-contact').getAttribute("href"), "../hubungi-kami.html");
      const solutionPanelBox = await page.locator('[data-solusi-panel]:not([hidden])').boundingBox();
      assert.ok(solutionPanelBox);
      assert.ok(solutionPanelBox.y + solutionPanelBox.height <= viewport.height + 1);
      await page.screenshot({ path: `/tmp/motovax-solutions-menu-${viewport.name}.png`, fullPage: false });
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("[data-solusi-panel]").isHidden(), true);
      assert.equal(await page.locator("[data-solusi-trigger]").evaluate((element) => element === document.activeElement), true);
    } else {
      await page.click("[data-mobile-nav-trigger]");
      await page.locator('[data-mobile-nav-panel]:not([hidden]) summary', { hasText: "Solusi" }).click();
      assert.equal(await page.locator('[data-mobile-nav-panel]:not([hidden]) a', { hasText: "Tangkap & respons setiap lead" }).isVisible(), true);
      assert.equal(await page.locator('[data-mobile-nav-panel]:not([hidden]) .mobile-solutions-grid > a').count(), 5);
      await page.screenshot({ path: `/tmp/motovax-solutions-menu-${viewport.name}.png`, fullPage: false });
    }

    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-dealer-positioning-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}

test("kunjungan ulang ke login dan onboarding langsung melanjutkan sesi tenant", async () => {
  for (const entryPath of ["/login.html", "/onboarding.html"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    let authMeCount = 0;
    await page.route("**/api/auth/me", (route) => {
      authMeCount += 1;
      return route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ authenticated: false }) });
    });
    await page.route("**/api/portal/workspace/enter", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ redirectUrl: "https://dealer-test.motovax.com/magic-login?token=returning-session" }) });
    });
    await page.route("https://dealer-test.motovax.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Workspace Dealer</title>" }));
    await page.goto(`${baseUrl}${entryPath}`, { waitUntil: "domcontentloaded" });
    if (entryPath === "/login.html") {
      await page.waitForTimeout(120);
      assert.equal(await page.locator("[data-session-check]").isVisible(), true);
      assert.equal(await page.locator("[data-login-auth-content]").isHidden(), true);
      assert.equal(await noOverflow(page), true);
      await page.screenshot({ path: "/tmp/motovax-returning-session-mobile.png", fullPage: false });
    }
    await page.waitForURL("https://dealer-test.motovax.com/**");
    assert.equal(new URL(page.url()).searchParams.get("token"), "returning-session");
    if (entryPath === "/onboarding.html") assert.equal(authMeCount, 0);
    await context.close();
  }
});

for (const viewport of viewports) {
  test(`CTA login meminta autentikasi ulang pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    let logoutCount = 0;
    let enterCount = 0;
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.route("**/api/portal/logout", (route) => {
      logoutCount += 1;
      return route.fulfill({ status: 204 });
    });
    await page.route("**/api/portal/workspace/enter", (route) => {
      enterCount += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ redirectUrl: "https://dealer-test.motovax.com/magic-login?token=stale-session" }) });
    });

    await page.goto(`${baseUrl}/login.html?reauth=1`, { waitUntil: "load" });
    await page.waitForSelector(".portal-login-auth-content:visible");

    assert.equal(logoutCount, 1);
    assert.equal(enterCount, 0);
    assert.equal(new URL(page.url()).searchParams.has("reauth"), false);
    assert.equal(await page.locator("[data-session-check]").isHidden(), true);
    assert.equal(await page.locator('[data-portal-login-form] input[name="identifier"]').isVisible(), true);
    assert.equal(await noOverflow(page), true);
    await page.screenshot({ path: `/tmp/motovax-login-reauth-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}

test("session portal legacy di landing langsung handoff ke workspace", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const token = "portal-token-test-abcdefghijklmnopqrstuvwxyz123456";
  let enterRequestCount = 0;
  await page.route("https://onboard.motovax.com/api/portal/workspace/enter", (route) => {
    enterRequestCount += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ redirectUrl: "https://dealer-test.motovax.com/magic-login?token=legacy-handoff" }) });
  });
  await page.route("https://dealer-test.motovax.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Workspace Dealer</title>" }));

  await page.goto(`${baseUrl}/index.html#portal_session=${token}&portal_action=enter_workspace`, { waitUntil: "domcontentloaded" });
  await page.waitForURL("https://dealer-test.motovax.com/**");
  assert.equal(enterRequestCount, 1);
  assert.equal(new URL(page.url()).searchParams.get("token"), "legacy-handoff");
  await context.close();
});

for (const viewport of viewports) {
  test(`fitur 04 Omni Jasmine menjelaskan cek inventori dan simulasi kredit pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/fitur/omni-jasmine-ai.html`, { waitUntil: "load" });

    const row = page.locator(".feature-showcase-row", { hasText: "Aksi cepat inventori dan kredit" });
    await row.scrollIntoViewIfNeeded();
    const copy = await row.locator(".feature-showcase-copy").innerText();
    assert.match(copy, /cek inventori/i);
    assert.match(copy, /simulasi kredit/i);
    assert.doesNotMatch(copy, /Handoff ke MR/);
    assert.doesNotMatch(copy, /Kinerja channel dapat diukur/);

    const points = await row.locator(".feature-showcase-copy li").allTextContents();
    assert.equal(points.length >= 2, true, points.join(" | "));
    assert.match(points.join("\n"), /Cek inventori/i);
    assert.match(points.join("\n"), /Cek simulasi kredit/i);
    assert.equal(await noOverflow(page), true);
    await context.close();
  });
}
