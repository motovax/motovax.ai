const whatsappUrl =
  "https://wa.me/6281999197186?text=Halo%20MOTOVAX%2C%20saya%20ingin%20jadwalkan%20demo.";

for (const el of document.querySelectorAll("[data-year]")) {
  el.textContent = String(new Date().getFullYear());
}

for (const link of document.querySelectorAll("[data-wa]")) {
  if (link instanceof HTMLAnchorElement) {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  }
}

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const value = (name) => String(data.get(name) || "").trim();
    const message = [
      "Halo MOTOVAX, saya ingin berkonsultasi.",
      "",
      `Nama: ${value("name")}`,
      `Perusahaan/dealer: ${value("company")}`,
      `Email: ${value("email")}`,
      `Nomor WhatsApp: ${value("phone")}`,
      `Kebutuhan: ${value("need")}`,
      value("message") ? `Detail: ${value("message")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/6281999197186?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
}

/**
 * Mega menu Produk — katalog kapabilitas dan suite Motovax.
 * Link diarahkan ke halaman detail fitur terkait.
 */
(function initProdukMegaMenu() {
  const menus = document.querySelectorAll("[data-produk-menu]");
  if (!menus.length) return;

  const path = location.pathname.replace(/\/+$/, "") || "/";
  const inNestedDir = path.includes("/fitur/") || path.includes("/solusi/") || /\/(fitur|solusi)$/.test(path);
  const isStandaloneRoot = path.endsWith("modul.html") || path.endsWith("hubungi-kami.html");
  const rootPrefix = inNestedDir ? "../" : "./";
  const fiturPrefix = inNestedDir ? "../fitur/" : "./fitur/";
  const home = inNestedDir ? "../index.html#" : isStandaloneRoot ? "./index.html#" : "#";
  const modul = `${rootPrefix}modul.html`;
  const f = (slug) => `${fiturPrefix}${slug}.html`;

  const icon = (paths, viewBox = "0 0 24 24") =>
    `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const I = {
    chat: icon('<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>'),
    ig: icon('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>'),
    fb: icon('<circle cx="12" cy="12" r="9"/><path d="M14.5 7.5h-1.2c-1.2 0-1.8.7-1.8 1.8V20M9 12.5h6"/>'),
    shop: icon('<path d="M4 7h16l-1.2 12.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>'),
    live: icon('<path d="M8 10h.01M12 10h.01M16 10h.01"/><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v6h-6"/>'),
    ticket: icon('<path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/>'),
    crm: icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    deal: icon('<path d="M12 3v18M8 7h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8"/>'),
    contact: icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    goal: icon('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    gps: icon('<path d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/>'),
    report: icon('<path d="M4 19V9m8 10V5m8 14v-7M2 19h20"/>'),
    wa: icon('<path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.6A8.5 8.5 0 1 1 20.5 11.5z"/><path d="M9.2 9.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.6l-.4.5c-.1.1-.2.3 0 .5.3.4 1 1.1 2 1.7 1 .6 1.4.5 1.7.4l.6-.3c.2-.1.4 0 .5.1l1.1 1.3c.1.2.2.4 0 .6-.3.4-1.2.9-1.8.9-.5 0-1.3 0-2.6-.6-1.6-.7-2.8-2.2-3.2-2.7-.4-.5-1.1-1.5-1.1-2.5 0-1 .5-1.5.7-1.7z"/>'),
    verify: icon('<path d="M12 3 4.5 6.5v5.2c0 4.5 3.1 7.8 7.5 9.3 4.4-1.5 7.5-4.8 7.5-9.3V6.5L12 3z"/><path d="m9 12 2 2 4-4"/>'),
    blast: icon('<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>'),
    ads: icon('<path d="M4 12v8a1 1 0 0 0 1 1h3v-9z"/><path d="M12 5v16h3a1 1 0 0 0 1-1V9z"/><path d="M20 9v11a1 1 0 0 0 1 1h0"/>'),
    call: icon('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"/>'),
    bulk: icon('<path d="M17 8h4v12H7v-4"/><path d="M3 4h14v12H3z"/>'),
    flow: icon('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="8.5" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4M12 10v4"/>'),
    cs: icon('<path d="M12 2a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3h1V9a5 5 0 0 1 10 0v6h-1a3 3 0 0 0-2.8 2"/><path d="M12 19a2 2 0 0 0 2 2h1"/>'),
    sla: icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    score: icon('<path d="M12 17.3 6.2 20.5l1.1-6.5L2.5 9.5l6.6-1L12 2.5l2.9 6 6.6 1-4.8 4.5 1.1 6.5z"/>'),
    bot: icon('<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M9 13h.01M15 13h.01M9 17h6M12 8V5"/><path d="M8 5h8"/>'),
    agent: icon('<path d="M12 3 4 7v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4z"/><path d="M9.5 12.5 11 14l3.5-3.5"/>'),
    ai: icon('<path d="m12 3 1.4 4.1L18 8.5l-4.6 1.4L12 14l-1.4-4.1L6 8.5l4.6-1.4L12 3z"/><path d="m19 13 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13z"/>'),
    kb: icon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    workflow: icon('<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.5 6h7M6 8.5v4.2A3 3 0 0 0 9 15.7h0M18 8.5v4.2A3 3 0 0 1 15 15.7h0M9 15.7h6"/>'),
    suite: icon('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'),
  };

  /** Produk modular yang ditawarkan pada halaman Harga. */
  const groups = [
    {
      id: "produk",
      title: "Produk",
      items: [
        {
          id: "core-platform",
          label: "Core Platform",
          paneTitle: "Core — Platform Integrasi Agentic AI",
          demo: { id: "whatsapp", hash: "capabilityDemo", context: "core-platform", label: "Lihat Fondasi Platform" },
          features: [
            { title: "Core Platform Agentic AI", desc: "Fondasi multi-tenant, akses berbasis peran, integrasi, dashboard, dan konfigurasi modul", icon: "suite", href: f("core-platform-agentic-ai") },
          ],
        },
        {
          id: "crm",
          label: "CRM",
          paneTitle: "CRM",
          demo: { id: "crm", hash: "crmDemo", context: "crm", label: "Coba CRM" },
          features: [
            { title: "Lead / Customer List", desc: "Data lead dan customer terpusat dengan riwayat interaksi serta unit yang diminati", icon: "contact", href: f("manajemen-kontak") },
            { title: "Pipeline & Customer Journey", desc: "Pantau perjalanan customer dan progres deal dari lead masuk hingga closing", icon: "deal", href: f("manajemen-deal") },
            { title: "Analytics", desc: "Ukur performa sales, conversion, channel, dan hasil pipeline CRM", icon: "report", href: f("personalisasi-report-sales") },
          ],
        },
        {
          id: "omni-jasmine",
          label: "Omni + Jasmine AI",
          paneTitle: "Omni + Jasmine AI",
          demo: { id: "omni", hash: "omniDemo", context: "omnichannel", label: "Coba Omnichannel" },
          features: [
            { title: "Omni + Jasmine AI", desc: "WhatsApp, Instagram, Facebook, funneling, routing, aksi cepat, dan AI percakapan", icon: "call", href: f("omni-jasmine-ai") },
          ],
        },
        {
          id: "inventory-falcon",
          label: "Inventory + Falcon AI",
          paneTitle: "Inventory + Falcon AI",
          demo: { id: "inventory", hash: "inventoryDemo", context: "inventory", label: "Coba Inventory" },
          features: [
            { title: "Inventory + Falcon AI", desc: "Listing multi-cabang, import data, pencarian AI, foto, rekomendasi, dan live katalog API", icon: "shop", href: f("inventory-falcon-ai") },
          ],
        },
        {
          id: "ana-analytics",
          label: "Ana AI Analytics",
          paneTitle: "Ana AI — Advanced Analytics",
          demo: { id: "dashboard", hash: "dashboardDemo", context: "analytics", label: "Lihat Analytics" },
          features: [
            { title: "Ana AI — Advanced Analytics", desc: "Analitik operasional, finansial, sales performance, dan insight lintas cabang", icon: "report", href: f("ana-ai-analytics") },
          ],
        },
        {
          id: "social-sora",
          label: "Social Media + Sora AI",
          paneTitle: "Social Media + Sora AI",
          demo: { id: "social", hash: "socialDemo", context: "social", label: "Coba Social Studio" },
          features: [
            { title: "Social Media + Sora AI", desc: "Content studio, AI image, publish, scheduler, ads manager, dan campaign analytics", icon: "ads", href: f("social-media-sora-ai") },
          ],
        },
      ],
    },
  ];

  const allPanes = groups.flatMap((g) => g.items);
  const firstPaneId = allPanes[0]?.id || "core-platform";

  function renderMenuHtml() {
    const firstGroupId = groups[0]?.id || "produk";

    const tabs = groups.length > 1 ? `
      <div class="produk-mega-tabs" role="tablist" aria-label="Kapabilitas dan Suite Motovax">
        <div class="produk-mega-tabs-inner">
          ${groups
            .map(
              (group) => `
            <button
              type="button"
              class="produk-mega-tab${group.id === firstGroupId ? " is-active" : ""}"
              role="tab"
              id="produk-tab-${group.id}"
              aria-selected="${group.id === firstGroupId ? "true" : "false"}"
              aria-controls="produk-group-${group.id}"
              data-produk-tab="${group.id}"
            >${group.title}</button>`
            )
            .join("")}
        </div>
      </div>` : "";

    const sidebar = groups
      .map((group) => {
        const isActiveGroup = group.id === firstGroupId;
        const activePaneId = isActiveGroup ? firstPaneId : group.items[0]?.id;
        return `
        <div
          class="produk-mega-group${isActiveGroup ? " is-active" : ""}"
          id="produk-group-${group.id}"
          role="tabpanel"
          aria-labelledby="produk-tab-${group.id}"
          data-produk-group="${group.id}"
          ${isActiveGroup ? "" : "hidden"}
        >
          <div class="produk-mega-group-title">${group.title}</div>
          ${group.items
            .map(
              (item) => `
            <button type="button" class="produk-mega-nav-btn${item.id === activePaneId && isActiveGroup ? " is-active" : ""}" data-produk-pane="${item.id}" data-produk-pane-group="${group.id}" aria-selected="${item.id === activePaneId && isActiveGroup ? "true" : "false"}">
              <span>${item.label}</span>
              <svg class="chev" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.334 5 13.334 10l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>`
            )
            .join("")}
        </div>`;
      })
      .join("");

    const panes = allPanes
      .map((item) => {
        const demoHref = item.demo
          ? `${rootPrefix}index.html?demo=${item.demo.id}&from=${encodeURIComponent(item.demo.context || item.id)}#${item.demo.hash}`
          : "";
        const demoCta = item.demo
          ? `<a href="${demoHref}" class="produk-mega-demo-button" data-open-${item.demo.id}-demo data-demo-context="${item.demo.context || item.id}" data-produk-close>
              ${item.demo.label}
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>`
          : "";
        const features = item.features
          .map((feat) => {
            const badge = feat.badge ? ` <span class="badge-new">${feat.badge}</span>` : "";
            return `
              <a href="${feat.href}" class="produk-mega-item" data-produk-close>
                <span class="produk-mega-icon">${I[feat.icon] || I.chat}</span>
                <span class="produk-mega-meta">
                  <span class="produk-mega-item-title">${feat.title}${badge}</span>
                  <span class="produk-mega-item-desc">${feat.desc}</span>
                </span>
              </a>`;
          })
          .join("");

        return `
          <div class="produk-mega-pane${item.id === firstPaneId ? " is-active" : ""}" data-produk-pane-panel="${item.id}" ${item.id === firstPaneId ? "" : "hidden"}>
            <div class="produk-mega-pane-heading">
              <h3 class="produk-mega-pane-title">${item.paneTitle}</h3>
              ${demoCta}
            </div>
            <div class="produk-mega-items">${features}</div>
          </div>`;
      })
      .join("");

    return `
      ${tabs}
      <div class="produk-mega-layout">
        <aside class="produk-mega-sidebar" aria-label="Kategori produk">${sidebar}</aside>
        <div class="produk-mega-content">${panes}</div>
      </div>`;
  }

  let scrim = document.querySelector("[data-produk-scrim]");
  if (!scrim) {
    scrim = document.createElement("div");
    scrim.className = "produk-mega-scrim";
    scrim.hidden = true;
    scrim.setAttribute("data-produk-scrim", "");
    document.body.appendChild(scrim);
  }

  for (const menu of menus) {
    const panel = menu.querySelector("[data-produk-mount], [data-produk-panel]");
    if (panel && !panel.dataset.built) {
      panel.innerHTML = renderMenuHtml();
      panel.dataset.built = "1";
    }
  }

  const closeAll = (except = null) => {
    for (const menu of menus) {
      if (menu === except) continue;
      menu.classList.remove("is-open");
      const trigger = menu.querySelector("[data-produk-trigger]");
      const panel = menu.querySelector("[data-produk-panel]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    }
    if (!except) {
      scrim.hidden = true;
      document.body.classList.remove("produk-menu-open");
    }
  };

  const openMenu = (menu) => {
    closeAll(menu);
    menu.classList.add("is-open");
    const trigger = menu.querySelector("[data-produk-trigger]");
    const panel = menu.querySelector("[data-produk-panel]");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    if (panel) panel.hidden = false;
    scrim.hidden = false;
    document.body.classList.add("produk-menu-open");
    document.dispatchEvent(new CustomEvent("motovax:nav-menu-open", { detail: { source: "produk" } }));
  };

  const closeMenu = (menu) => {
    menu.classList.remove("is-open");
    const trigger = menu.querySelector("[data-produk-trigger]");
    const panel = menu.querySelector("[data-produk-panel]");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
    scrim.hidden = true;
    document.body.classList.remove("produk-menu-open");
  };

  const setActivePane = (menu, paneId) => {
    for (const btn of menu.querySelectorAll("[data-produk-pane]")) {
      const on = btn.getAttribute("data-produk-pane") === paneId;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    }
    for (const pane of menu.querySelectorAll("[data-produk-pane-panel]")) {
      const on = pane.getAttribute("data-produk-pane-panel") === paneId;
      pane.classList.toggle("is-active", on);
      pane.hidden = !on;
    }
  };

  const setActiveTab = (menu, groupId) => {
    const group = groups.find((g) => g.id === groupId) || groups[0];
    if (!group) return;

    for (const tab of menu.querySelectorAll("[data-produk-tab]")) {
      const on = tab.getAttribute("data-produk-tab") === group.id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    }

    for (const panel of menu.querySelectorAll("[data-produk-group]")) {
      const on = panel.getAttribute("data-produk-group") === group.id;
      panel.classList.toggle("is-active", on);
      panel.hidden = !on;
    }

    const activeInGroup = menu.querySelector(
      `[data-produk-group="${group.id}"] [data-produk-pane].is-active`
    );
    const paneId =
      activeInGroup?.getAttribute("data-produk-pane") || group.items[0]?.id || firstPaneId;
    setActivePane(menu, paneId);
  };

  for (const menu of menus) {
    const trigger = menu.querySelector("[data-produk-trigger]");
    if (!trigger) continue;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (menu.classList.contains("is-open")) closeMenu(menu);
      else openMenu(menu);
    });

    menu.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const tabBtn = target.closest("[data-produk-tab]");
      if (tabBtn && menu.contains(tabBtn)) {
        event.preventDefault();
        event.stopPropagation();
        setActiveTab(menu, tabBtn.getAttribute("data-produk-tab") || groups[0]?.id);
        return;
      }

      const paneBtn = target.closest("[data-produk-pane]");
      if (paneBtn && menu.contains(paneBtn)) {
        event.preventDefault();
        event.stopPropagation();
        setActivePane(menu, paneBtn.getAttribute("data-produk-pane") || firstPaneId);
        return;
      }

      const closer = target.closest("[data-produk-close]");
      if (closer && menu.contains(closer)) {
        // biarkan handler demo berjalan dulu
        requestAnimationFrame(() => closeMenu(menu));
      }
    });
  }

  scrim.addEventListener("click", () => closeAll());

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-produk-menu]")) return;
    if (target.closest("[data-produk-scrim]")) return;
    closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  document.addEventListener("motovax:nav-menu-open", (event) => {
    if (event.detail?.source !== "produk") closeAll();
  });
})();

/**
 * Mega menu Solusi — struktur Industri & Roles mengikuti qontak.com/Solusi.
 * Industri ditambah Otomotif dan Property; role HR tidak ditampilkan.
 */
(function initSolusiMegaMenu() {
  const solusiLinks = [...document.querySelectorAll('.nav > a[href*="#solusi"]')].filter(
    (link) => link.textContent.trim() === "Solusi",
  );
  if (!solusiLinks.length) return;

  const path = location.pathname.replace(/\/+$/, "") || "/";
  const inNestedDir = path.includes("/fitur/") || path.includes("/solusi/") || /\/(fitur|solusi)$/.test(path);
  const fiturPrefix = inNestedDir ? "../fitur/" : "./fitur/";
  const solusiPrefix = path.includes("/solusi/") || /\/solusi$/.test(path) ? "./" : inNestedDir ? "../solusi/" : "./solusi/";
  const home = inNestedDir ? "../index.html#" : path.endsWith("modul.html") ? "./index.html#" : "#";

  const icon = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const icons = {
    education: icon('<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 5.5v13A3.5 3.5 0 0 1 7.5 15H20"/>'),
    finance: icon('<path d="m3 9 9-5 9 5"/><path d="M5 10v8m5-8v8m4-8v8m5-8v8M3 21h18"/>'),
    health: icon('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>'),
    travel: icon('<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>'),
    hotel: icon('<path d="M3 21V8l9-5 9 5v13"/><path d="M8 21v-5h8v5M8 10h.01M12 10h.01M16 10h.01"/>'),
    logistics: icon('<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>'),
    fmcg: icon('<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 7 9 5 9-5v10l-9 5-9-5z"/><path d="M12 12v10"/>'),
    retail: icon('<path d="M4 10h16v11H4zM3 10l2-6h14l2 6"/><path d="M8 21v-6h8v6M7 10a2 2 0 0 0 4 0m0 0a2 2 0 0 0 4 0m0 0a2 2 0 0 0 4 0"/>'),
    tech: icon('<path d="m8 9-4 3 4 3m8-6 4 3-4 3M14 5l-4 14"/>'),
    outsourcing: icon('<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M4 14a3 3 0 0 0 3 3h1v-6H7a3 3 0 0 0-3 3zm16 0a3 3 0 0 1-3 3h-1v-6h1a3 3 0 0 1 3 3zM16 19c-1 2-3 2-5 2"/>'),
    automotive: icon('<path d="M5 16 3.5 14.5 5 10l2-4h10l2 4 1.5 4.5L19 16"/><path d="M5 10h14M6 16h12M7 19v2m10-2v2"/><circle cx="7.5" cy="14" r="1"/><circle cx="16.5" cy="14" r="1"/>'),
    property: icon('<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/>'),
    sales: icon('<path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/><path d="m5 7 5-4 5 3 5-4"/>'),
    service: icon('<path d="M12 3a8 8 0 0 0-8 8v3a3 3 0 0 0 3 3h1v-7H7a3 3 0 0 0-3 3m16 0a3 3 0 0 0-3-3h-1v7h1a3 3 0 0 0 3-3z"/><path d="M16 19c-1 2-3 2-5 2"/>'),
    marketing: icon('<path d="M3 11v4h4l9 4V7l-9 4z"/><path d="M7 15l2 5h3M19 9c1 1 1 4 0 5"/>'),
    operations: icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1z"/>'),
  };

  const groups = [
    {
      id: "industri",
      title: "Industri",
      items: [
        { title: "Pendidikan", desc: "Fondasi inquiry dan admission", icon: "education", slug: "pendidikan", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}pendidikan.html` },
        { title: "Keuangan", desc: "Fondasi engagement nasabah", icon: "finance", slug: "keuangan", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}keuangan.html` },
        { title: "Kesehatan", desc: "Fondasi layanan dan inquiry pasien", icon: "health", slug: "kesehatan", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}kesehatan.html` },
        { title: "Tour & Travel", desc: "Fondasi inquiry dan booking", icon: "travel", slug: "tour-travel", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}tour-travel.html` },
        { title: "Perhotelan", desc: "Fondasi reservasi dan layanan tamu", icon: "hotel", slug: "perhotelan", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}perhotelan.html` },
        { title: "Logistik", desc: "Fondasi customer service pengiriman", icon: "logistics", slug: "logistik", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}logistik.html` },
        { title: "FMCG", desc: "Fondasi engagement channel partner", icon: "fmcg", slug: "fmcg", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}fmcg.html` },
        { title: "Ritel", desc: "Fondasi conversational sales", icon: "retail", slug: "ritel", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}ritel.html` },
        { title: "Teknologi Informasi", desc: "Fondasi B2B sales dan support", icon: "tech", slug: "teknologi-informasi", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}teknologi-informasi.html` },
        { title: "Outsourcing", desc: "Fondasi operasi layanan multi-klien", icon: "outsourcing", slug: "outsourcing", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}outsourcing.html` },
        { title: "Otomotif", desc: "Stok hingga closing terintegrasi", icon: "automotive", slug: "otomotif", status: "live", statusLabel: "Live", href: `${solusiPrefix}otomotif.html` },
        { title: "Property", desc: "Fondasi lead hingga site visit", icon: "property", slug: "property", status: "adapt", statusLabel: "Adaptif", href: `${solusiPrefix}property.html` },
      ],
    },
    {
      id: "roles",
      title: "Roles",
      items: [
        { title: "Sales", desc: "Lacak penjualan barang", icon: "sales", href: `${fiturPrefix}motovax-sales-suite.html` },
        { title: "Customer Service", desc: "Kelola pelayanan pelanggan", icon: "service", href: `${fiturPrefix}motovax-service-suite.html` },
        { title: "Marketing", desc: "Atur pemasaran produk", icon: "marketing", href: `${fiturPrefix}motovax-broadcast.html` },
        { title: "Operasional", desc: "Otomatiskan proses operasional", icon: "operations", href: `${fiturPrefix}automasi-workflow.html` },
      ],
    },
  ];

  const renderItems = (group) => group.items
    .map((item) => {
      const isCurrent = Boolean(item.slug && (path.endsWith(`/solusi/${item.slug}`) || path.endsWith(`/solusi/${item.slug}.html`)));
      return `
      <a class="solusi-mega-item${isCurrent ? " is-current" : ""}" href="${item.href}"${isCurrent ? ' aria-current="page"' : ""} data-solusi-close>
        <span class="solusi-mega-icon">${icons[item.icon]}</span>
        <span class="solusi-mega-meta">
          <span class="solusi-mega-title-row">
            <strong>${item.title}</strong>
            ${item.statusLabel ? `<span class="solusi-mega-status ${item.status}">${item.statusLabel}</span>` : ""}
          </span>
          <small>${item.desc}</small>
        </span>
        <svg class="solusi-mega-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;
    })
    .join("");

  const renderMenu = (id) => `
    <button type="button" class="nav-produk-trigger nav-solusi-trigger" aria-expanded="false" aria-haspopup="true" aria-controls="${id}" data-solusi-trigger>
      Solusi
      <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="produk-mega solusi-mega" id="${id}" role="region" aria-label="Menu solusi berdasarkan industri dan peran" hidden data-solusi-panel>
      <div class="produk-mega-tabs">
        <div class="produk-mega-tabs-inner" role="tablist" aria-label="Kategori solusi">
          ${groups.map((group, index) => `
            <button type="button" class="produk-mega-tab${index === 0 ? " is-active" : ""}" id="${id}-tab-${group.id}" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="${id}-panel-${group.id}" data-solusi-tab="${group.id}">${group.title}</button>`).join("")}
        </div>
      </div>
      <div class="solusi-mega-content">
        ${groups.map((group, index) => `
          <section class="solusi-mega-panel${index === 0 ? " is-active" : ""}" id="${id}-panel-${group.id}" role="tabpanel" aria-labelledby="${id}-tab-${group.id}" data-solusi-panel-content="${group.id}" ${index === 0 ? "" : "hidden"}>
            <div class="solusi-mega-heading">
              <span>Solusi</span>
              <h3>${group.title}</h3>
            </div>
            <div class="solusi-mega-grid solusi-mega-grid-${group.id}">${renderItems(group)}</div>
            <a class="solusi-mega-contact" href="${home}kontak" data-solusi-close>
              Belum menemukan yang Anda cari? <strong>Diskusikan kebutuhan bisnis Anda</strong>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </section>`).join("")}
      </div>
    </div>`;

  solusiLinks.forEach((link, index) => {
    const menu = document.createElement("div");
    menu.className = "nav-item nav-item-produk nav-item-solusi";
    menu.setAttribute("data-solusi-menu", "");
    menu.innerHTML = renderMenu(`solusi-mega-menu-${index + 1}`);
    link.replaceWith(menu);
  });

  const menus = document.querySelectorAll("[data-solusi-menu]");
  let scrim = document.querySelector("[data-solusi-scrim]");
  if (!scrim) {
    scrim = document.createElement("div");
    scrim.className = "produk-mega-scrim solusi-mega-scrim";
    scrim.hidden = true;
    scrim.setAttribute("data-solusi-scrim", "");
    document.body.appendChild(scrim);
  }

  const closeAll = (except = null) => {
    for (const menu of menus) {
      if (menu === except) continue;
      menu.classList.remove("is-open");
      menu.querySelector("[data-solusi-trigger]")?.setAttribute("aria-expanded", "false");
      const panel = menu.querySelector("[data-solusi-panel]");
      if (panel) panel.hidden = true;
    }
    if (!except) {
      scrim.hidden = true;
      document.body.classList.remove("solusi-menu-open");
    }
  };

  const openMenu = (menu) => {
    closeAll(menu);
    menu.classList.add("is-open");
    menu.querySelector("[data-solusi-trigger]")?.setAttribute("aria-expanded", "true");
    const panel = menu.querySelector("[data-solusi-panel]");
    if (panel) panel.hidden = false;
    scrim.hidden = false;
    document.body.classList.add("solusi-menu-open");
    document.dispatchEvent(new CustomEvent("motovax:nav-menu-open", { detail: { source: "solusi" } }));
  };

  const closeMenu = (menu) => {
    menu.classList.remove("is-open");
    menu.querySelector("[data-solusi-trigger]")?.setAttribute("aria-expanded", "false");
    const panel = menu.querySelector("[data-solusi-panel]");
    if (panel) panel.hidden = true;
    scrim.hidden = true;
    document.body.classList.remove("solusi-menu-open");
  };

  const setActiveTab = (menu, groupId) => {
    for (const tab of menu.querySelectorAll("[data-solusi-tab]")) {
      const active = tab.getAttribute("data-solusi-tab") === groupId;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    }
    for (const panel of menu.querySelectorAll("[data-solusi-panel-content]")) {
      const active = panel.getAttribute("data-solusi-panel-content") === groupId;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    }
  };

  for (const menu of menus) {
    const trigger = menu.querySelector("[data-solusi-trigger]");
    trigger?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (menu.classList.contains("is-open")) closeMenu(menu);
      else openMenu(menu);
    });

    menu.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const tab = target.closest("[data-solusi-tab]");
      if (tab) {
        event.preventDefault();
        event.stopPropagation();
        setActiveTab(menu, tab.getAttribute("data-solusi-tab") || "industri");
        return;
      }
      if (target.closest("[data-solusi-close]")) requestAnimationFrame(() => closeMenu(menu));
    });
  }

  scrim.addEventListener("click", () => closeAll());
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-solusi-menu], [data-solusi-scrim]")) return;
    closeAll();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
  document.addEventListener("motovax:nav-menu-open", (event) => {
    if (event.detail?.source !== "solusi") closeAll();
  });
})();

/** Navigasi mobile seluruh halaman — menjaga menu utama tetap dapat diakses. */
(function initMobileNavigation() {
  const header = document.querySelector(".site-header");
  const headerInner = header?.querySelector(".header-inner");
  if (!(header instanceof HTMLElement) || !(headerInner instanceof HTMLElement)) return;

  let trigger = header.querySelector("[data-mobile-nav-trigger]");
  let panel = header.querySelector("[data-mobile-nav-panel]");
  let backdrop = header.querySelector("[data-mobile-nav-backdrop]");

  /* Halaman selain beranda memakai header yang sama, tetapi markup menu mobile
   * tidak diduplikasi ke puluhan file HTML. Bentuk menu di sini agar setiap
   * halaman selalu mendapat navigasi mobile/tablet yang identik. */
  if (!trigger || !panel || !backdrop) {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const nested = path.includes("/fitur/") || path.includes("/solusi/") || /\/(fitur|solusi)$/.test(path);
    const root = nested ? "../" : "./";
    const home = `${root}index.html`;
    const industries = [
      ["Otomotif", "Live", "otomotif"],
      ["Property", "Adaptif", "property"],
      ["Pendidikan", "Adaptif", "pendidikan"],
      ["Keuangan", "Adaptif", "keuangan"],
      ["Kesehatan", "Adaptif", "kesehatan"],
      ["Tour & Travel", "Adaptif", "tour-travel"],
      ["Perhotelan", "Adaptif", "perhotelan"],
      ["Logistik", "Adaptif", "logistik"],
      ["FMCG", "Adaptif", "fmcg"],
      ["Ritel", "Adaptif", "ritel"],
      ["Teknologi Informasi", "Adaptif", "teknologi-informasi"],
      ["Outsourcing", "Adaptif", "outsourcing"],
    ];

    trigger = document.createElement("button");
    trigger.className = "mobile-nav-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "mobile-navigation");
    trigger.setAttribute("aria-label", "Buka menu navigasi");
    trigger.setAttribute("data-mobile-nav-trigger", "");
    trigger.innerHTML = "<span></span><span></span><span></span>";

    backdrop = document.createElement("button");
    backdrop.className = "mobile-nav-backdrop";
    backdrop.type = "button";
    backdrop.hidden = true;
    backdrop.setAttribute("aria-label", "Tutup menu navigasi");
    backdrop.setAttribute("data-mobile-nav-backdrop", "");

    panel = document.createElement("aside");
    panel.className = "mobile-nav-panel";
    panel.id = "mobile-navigation";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Navigasi mobile");
    panel.setAttribute("data-mobile-nav-panel", "");
    panel.innerHTML = `
      <nav class="mobile-nav-links">
        <a href="${root}modul.html" data-mobile-nav-close>Produk <span>→</span></a>
        <details>
          <summary>Solusi berdasarkan industri <span>+</span></summary>
          <div class="mobile-solutions-grid">
            ${industries.map(([name, status, slug]) => `<a href="${root}solusi/${slug}.html" data-mobile-nav-close>${name} <small>${status}</small></a>`).join("")}
          </div>
        </details>
        <a href="${home}#cara-kerja" data-mobile-nav-close>Cara Kerja <span>→</span></a>
        <a href="${home}#keunggulan" data-mobile-nav-close>Keunggulan <span>→</span></a>
        <a href="${root}harga.html" data-mobile-nav-close>Harga <span>→</span></a>
        <a href="${root}hubungi-kami.html" data-mobile-nav-close>Hubungi Kami <span>→</span></a>
      </nav>
      <a class="btn btn-primary mobile-nav-cta" href="${root}hubungi-kami.html" data-mobile-nav-close>Diskusikan Bisnis Anda <span>→</span></a>`;

    headerInner.appendChild(trigger);
    header.append(backdrop, panel);
  }

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement) || !(backdrop instanceof HTMLElement)) return;

  const close = ({ restoreFocus = false } = {}) => {
    panel.hidden = true;
    backdrop.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Buka menu navigasi");
    trigger.classList.remove("is-open");
    document.body.classList.remove("mobile-menu-open");
    if (restoreFocus) trigger.focus();
  };

  const open = () => {
    panel.hidden = false;
    backdrop.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-label", "Tutup menu navigasi");
    trigger.classList.add("is-open");
    document.body.classList.add("mobile-menu-open");
    panel.querySelector("a, summary")?.focus();
  };

  trigger.addEventListener("click", () => {
    if (trigger.getAttribute("aria-expanded") === "true") close();
    else open();
  });
  backdrop.addEventListener("click", () => close({ restoreFocus: true }));
  panel.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("[data-mobile-nav-close]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") close({ restoreFocus: true });
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && trigger.getAttribute("aria-expanded") === "true") close();
  });
})();

class PublicDemoDataBridge {
  constructor() {
    this.baseUrl = "https://mobix.motovax.com/api/public/demo/motovax-ai";
    this.snapshotPromise = null;
    this.sessionId = localStorage.getItem("motovax_demo_session_id");
    if (!this.sessionId) {
      this.sessionId = crypto.randomUUID();
      localStorage.setItem("motovax_demo_session_id", this.sessionId);
    }
  }

  async snapshot(force = false) {
    if (!this.snapshotPromise || force) {
      this.snapshotPromise = fetch(`${this.baseUrl}/snapshot`, {
        headers: { Accept: "application/json" },
      }).then(async (response) => {
        if (!response.ok) throw new Error("Data tenant demo belum dapat dimuat.");
        return response.json();
      }).then((snapshot) => {
        this.updateConnectionStatus(snapshot.tenant);
        return snapshot;
      }).catch((error) => {
        this.updateConnectionStatus(null, error);
        throw error;
      });
    }
    return this.snapshotPromise;
  }

  updateConnectionStatus(tenant, error = null) {
    const tenantName = String(tenant?.name || "Tenant demo").trim();
    const writesActive = Boolean(tenant?.writes_active);

    for (const status of document.querySelectorAll("[data-demo-tenant-status]")) {
      const dataOnly = status.hasAttribute("data-demo-data-only");
      const label = error
        ? "Tenant demo tidak terhubung"
        : dataOnly
          ? "Tenant Demo · Data live"
          : writesActive
            ? "Tenant Demo · Input tersimpan"
            : "Tenant Demo · Mode baca";
      status.classList.toggle("is-error", Boolean(error));
      status.classList.toggle("is-readonly", !error && !writesActive);
      const text = status.querySelector("[data-demo-tenant-label]");
      if (text) text.textContent = label;
      status.title = error
        ? error.message
        : `Terhubung ke ${tenantName}; terisolasi dari tenant customer lain.`;
    }
  }

  async submit(kind, payload = {}) {
    const response = await fetch(`${this.baseUrl}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        request_id: crypto.randomUUID(),
        session_id: this.sessionId,
        kind,
        ...payload,
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || "Aksi belum dapat disimpan ke tenant demo.");
    }
    this.snapshotPromise = null;
    return response.json();
  }
}

const publicDemoData = new PublicDemoDataBridge();

/**
 * Product-tour guide bersama (gaya IMS):
 * spotlight cutout + tooltip biru menempel target + Kembali/Berikutnya/Selesai.
 * Dipakai semua demo solusi agar flow & style seragam.
 */
class DemoProductTour {
  /**
   * @param {HTMLElement} root
   * @param {{
   *   ns: string,
   *   anchorAttr?: string,
   *   getSteps: () => Array<{title:string, body:string, anchor?:string, view?:string, label?:string, enter?:Function}>,
   *   onSwitchView?: (view: string) => void,
   *   getStepLabel?: (step: object, index: number, total: number) => string,
   * }} opts
   */
  constructor(root, opts) {
    this.root = root;
    this.ns = opts.ns;
    this.anchorAttr = opts.anchorAttr || `data-${opts.ns}-anchor`;
    this.getSteps = opts.getSteps;
    this.onSwitchView = opts.onSwitchView || null;
    this.getStepLabel = opts.getStepLabel || null;
    this.stepIndex = 0;
    this._highlightEl = null;

    this.guide = root.querySelector(`[data-${opts.ns}-guide-popover]`);
    this.spotlight = root.querySelector(`[data-${opts.ns}-guide-spotlight]`);
    this.stepLabelEl = this.guide?.querySelector(`[data-${opts.ns}-guide-step-label]`);
    this.titleEl = this.guide?.querySelector(`[data-${opts.ns}-guide-title]`);
    this.bodyEl = this.guide?.querySelector(`[data-${opts.ns}-guide-body]`);
    this.prevBtn = this.guide?.querySelector(`[data-${opts.ns}-guide-prev]`);
    this.nextBtn = this.guide?.querySelector(`[data-${opts.ns}-guide-next]`);
    this.finishBtn = this.guide?.querySelector(`[data-${opts.ns}-guide-finish]`);
    this.closeBtn = this.guide?.querySelector(`[data-close-${opts.ns}-guide]`);

    this._onReposition = () => {
      if (!this.guide || this.guide.hidden) return;
      this.syncSpotlightRect();
      this.positionGuide();
    };

    this.bindControls();
  }

  get isOpen() {
    return Boolean(this.guide && !this.guide.hidden);
  }

  bindControls() {
    if (!this.guide) return;
    for (const btn of this.root.querySelectorAll(`[data-${this.ns}-guide]`)) {
      btn.addEventListener("click", () => this.open(0));
    }
    this.closeBtn?.addEventListener("click", () => this.close());
    this.nextBtn?.addEventListener("click", () => this.next());
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.finishBtn?.addEventListener("click", () => this.close());

    window.addEventListener("resize", this._onReposition);
    const scrollParents = this.root.querySelectorAll(
      ".demo-workspace, .demo-sidebar, .cc-shell, .cc-queue, .cc-chat, .cc-context, .dashboard-workspace, .insight-workspace",
    );
    for (const el of scrollParents) {
      el.addEventListener("scroll", this._onReposition, { passive: true });
    }
  }

  open(startIndex = 0) {
    if (!this.guide) return;
    const steps = this.getSteps() || [];
    if (!steps.length) return;
    this.stepIndex = Math.max(0, Math.min(startIndex, steps.length - 1));
    this.guide.hidden = false;
    this.renderStep();
    const focusBtn =
      this.guide.querySelector(`[data-${this.ns}-guide-next]:not([hidden])`) ||
      this.guide.querySelector(`[data-${this.ns}-guide-finish]:not([hidden])`);
    focusBtn?.focus();
  }

  close() {
    if (!this.guide) return;
    this.guide.hidden = true;
    this.clearHighlight();
    this.clearGuidePosition();
  }

  next() {
    const steps = this.getSteps() || [];
    if (this.stepIndex >= steps.length - 1) {
      this.close();
      return;
    }
    this.stepIndex += 1;
    this.renderStep();
  }

  prev() {
    if (this.stepIndex <= 0) return;
    this.stepIndex -= 1;
    this.renderStep();
  }

  clearGuidePosition() {
    if (!this.guide) return;
    this.guide.classList.remove("is-anchored", "is-falcon-anchor");
    this.guide.style.top = "";
    this.guide.style.left = "";
    this.guide.style.right = "";
    this.guide.style.bottom = "";
    this.guide.style.maxWidth = "";
  }

  highlightAnchor(name) {
    this.clearHighlight(false);
    if (!name) {
      this.syncSpotlightRect(null);
      return;
    }
    const candidates = [...this.root.querySelectorAll(`[${this.anchorAttr}="${name}"]`)];
    const el =
      candidates.find((node) => {
        const r = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return r.width > 1 && r.height > 1 && style.display !== "none" && style.visibility !== "hidden";
      }) || candidates[0];
    if (!el) {
      this.syncSpotlightRect(null);
      return;
    }
    this._highlightEl = el;
    el.classList.add("demo-guide-highlight", "ims-guide-highlight");
    try {
      el.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
    } catch {
      /* ignore */
    }
    this.syncSpotlightRect(el);
  }

  clearHighlight(hideSpotlight = true) {
    for (const el of this.root.querySelectorAll(".demo-guide-highlight, .ims-guide-highlight, .crm-guide-highlight, .social-guide-highlight, .omni-guide-highlight")) {
      el.classList.remove(
        "demo-guide-highlight",
        "ims-guide-highlight",
        "crm-guide-highlight",
        "social-guide-highlight",
        "omni-guide-highlight",
      );
    }
    this._highlightEl = null;
    if (hideSpotlight) this.syncSpotlightRect(null);
  }

  syncSpotlightRect(el = this._highlightEl) {
    const spot = this.spotlight;
    if (!spot) return;
    if (!el || !this.guide || this.guide.hidden) {
      spot.hidden = true;
      spot.style.top = "";
      spot.style.left = "";
      spot.style.width = "";
      spot.style.height = "";
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 2 && r.height < 2) {
      spot.hidden = true;
      return;
    }
    const pad = 8;
    const top = Math.max(4, r.top - pad);
    const left = Math.max(4, r.left - pad);
    const width = Math.min(window.innerWidth - left - 4, r.width + pad * 2);
    const height = Math.min(window.innerHeight - top - 4, r.height + pad * 2);
    spot.hidden = false;
    spot.style.top = `${Math.round(top)}px`;
    spot.style.left = `${Math.round(left)}px`;
    spot.style.width = `${Math.round(width)}px`;
    spot.style.height = `${Math.round(height)}px`;
  }

  positionGuide() {
    if (!this.guide || this.guide.hidden) return;

    const place = () => {
      if (!this.guide || this.guide.hidden) return;
      const target =
        this._highlightEl && this._highlightEl.getBoundingClientRect().width > 0
          ? this._highlightEl
          : null;

      this.guide.classList.add("is-anchored");

      const gw = Math.min(320, window.innerWidth - 24);
      const gh = this.guide.offsetHeight || 200;
      const gap = 14;
      const margin = 12;
      const minTop = 64;

      if (!target) {
        this.guide.style.top = "92px";
        this.guide.style.right = "24px";
        this.guide.style.left = "auto";
        this.guide.style.bottom = "auto";
        this.guide.style.maxWidth = `${gw}px`;
        return;
      }

      const rect = target.getBoundingClientRect();
      let left = rect.right + gap;
      let top = rect.top;

      if (left + gw > window.innerWidth - margin) {
        left = rect.left - gw - gap;
      }
      if (left < margin) {
        left = Math.max(margin, Math.min(rect.left, window.innerWidth - gw - margin));
        top = rect.bottom + gap;
        if (top + gh > window.innerHeight - margin) {
          top = Math.max(minTop, rect.top - gh - gap);
        }
      } else {
        top = Math.max(minTop, Math.min(top, window.innerHeight - gh - margin));
      }

      left = Math.max(margin, Math.min(left, window.innerWidth - gw - margin));
      top = Math.max(minTop, Math.min(top, window.innerHeight - gh - margin));

      this.guide.style.top = `${Math.round(top)}px`;
      this.guide.style.left = `${Math.round(left)}px`;
      this.guide.style.right = "auto";
      this.guide.style.bottom = "auto";
      this.guide.style.maxWidth = `${gw}px`;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(place);
      window.setTimeout(place, 80);
      window.setTimeout(() => {
        this.syncSpotlightRect();
        place();
      }, 200);
    });
  }

  renderStep() {
    if (!this.guide) return;
    const steps = this.getSteps() || [];
    const step = steps[this.stepIndex] || steps[0];
    if (!step) {
      this.close();
      return;
    }
    const total = steps.length;
    const index = this.stepIndex + 1;

    if (this.stepLabelEl) {
      if (this.getStepLabel) {
        this.stepLabelEl.textContent = this.getStepLabel(step, index, total);
      } else {
        const viewLabel = (step.label || step.view || "Panduan").toString().toUpperCase();
        this.stepLabelEl.textContent =
          total > 1 ? `${viewLabel} · LANGKAH ${index} DARI ${total}` : viewLabel;
      }
    }
    if (this.titleEl) this.titleEl.textContent = step.title;
    if (this.bodyEl) this.bodyEl.textContent = step.body;

    const isLast = this.stepIndex >= total - 1;
    const isFirst = this.stepIndex <= 0;
    if (this.prevBtn) this.prevBtn.hidden = isFirst;
    if (this.nextBtn) {
      this.nextBtn.hidden = isLast;
      this.nextBtn.textContent = "Berikutnya";
    }
    if (this.finishBtn) this.finishBtn.hidden = !isLast;

    if (step.view && typeof this.onSwitchView === "function") {
      this.onSwitchView(step.view);
    }
    if (typeof step.enter === "function") step.enter();

    const applyHighlight = () => {
      if (step.anchor) this.highlightAnchor(step.anchor);
      else this.clearHighlight();
      this.positionGuide();
    };
    requestAnimationFrame(() => {
      applyHighlight();
      window.setTimeout(applyHighlight, 100);
    });
  }
}


const inventoryDemoSeed = [
  {
    id: "unit-001",
    brand: "Nissan",
    type: "Serena HWS AT",
    plate: "B 1201 MVX",
    year: 2023,
    color: "Putih Hitam",
    transmission: "Automatic",
    odometer: 70978,
    branch: "CINERE",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 304000000,
    cashPrice: 350000000,
    creditPrice: 358000000,
    aging: 110,
    source: "Rental Up · PT BAS",
    photos: 18,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "2.0 L",
    seats: 7,
    features: ["Power Sliding Door", "Around View Monitor", "Captain Seat", "Keyless Entry"],
  },
  {
    id: "unit-002",
    brand: "Toyota",
    type: "Rush G AT",
    plate: "B 1202 MVX",
    year: 2022,
    color: "Silver",
    transmission: "Automatic",
    odometer: 56660,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "BOOKED",
    buyingPrice: 165000000,
    cashPrice: 190000000,
    creditPrice: 197000000,
    aging: 60,
    source: "Referensi · Rental",
    photos: 14,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["ABS + EBD", "Dual Airbag", "Rear Camera", "Roof Rail"],
  },
  {
    id: "unit-003",
    brand: "Toyota",
    type: "Rush 1.5 S TRD AT",
    plate: "B 1203 MVX",
    year: 2019,
    color: "Putih",
    transmission: "Automatic",
    odometer: 48684,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 170000000,
    cashPrice: 197000000,
    creditPrice: 203000000,
    aging: 48,
    source: "Trade In · Mitsubishi",
    photos: 22,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["TRD Bodykit", "Touchscreen Audio", "Rear Parking Sensor", "Daytime Running Light"],
  },
  {
    id: "unit-004",
    brand: "Honda",
    type: "HR-V S CVT",
    plate: "B 1204 MVX",
    year: 2016,
    color: "Abu-abu Metalik",
    transmission: "Automatic",
    odometer: 80359,
    branch: "PONDOK BAMBU",
    position: "Bintaro",
    status: "BOOKED",
    buyingPrice: 131000000,
    cashPrice: 153000000,
    creditPrice: 158000000,
    aging: 40,
    source: "Referensi · Sales",
    photos: 12,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 5,
    features: ["Magic Seat", "ECON Mode", "Cruise Control", "Side Camera"],
  },
  {
    id: "unit-005",
    brand: "Honda",
    type: "Mobilio E CVT",
    plate: "B 1205 MVX",
    year: 2019,
    color: "Abu-abu Metalik",
    transmission: "Automatic",
    odometer: 80503,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 132000000,
    cashPrice: 150000000,
    creditPrice: 155000000,
    aging: 34,
    source: "Referensi · Sales",
    photos: 16,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Ultra Seat", "Double Blower", "ABS", "ISOFIX"],
  },
  {
    id: "unit-006",
    brand: "Mitsubishi",
    type: "Xpander Ultimate",
    plate: "B 1206 MVX",
    year: 2021,
    color: "Quartz White",
    transmission: "Automatic",
    odometer: 42380,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 208000000,
    cashPrice: 239000000,
    creditPrice: 247000000,
    aging: 21,
    source: "Trade In",
    photos: 20,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Head Unit 9\"", "Keyless Push Start", "Cruise Control", "Rear Camera"],
  },
  {
    id: "unit-007",
    brand: "Suzuki",
    type: "Ertiga GX Hybrid",
    plate: "B 1207 MVX",
    year: 2023,
    color: "Cool Black",
    transmission: "Automatic",
    odometer: 18540,
    branch: "BEKASI",
    position: "Showroom Bekasi",
    status: "UNIT READY",
    buyingPrice: 214000000,
    cashPrice: 243000000,
    creditPrice: 251000000,
    aging: 12,
    source: "Lelang Partner",
    photos: 24,
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "1.5 L Hybrid",
    seats: 7,
    features: ["SHVS Hybrid", "ESP", "Hill Hold", "Smart Key"],
  },
  {
    id: "unit-008",
    brand: "Toyota",
    type: "Avanza G CVT",
    plate: "B 1208 MVX",
    year: 2022,
    color: "Black Metallic",
    transmission: "Automatic",
    odometer: 31902,
    branch: "CINERE",
    position: "Showroom Cinere",
    status: "SOLD",
    buyingPrice: 198000000,
    cashPrice: 229000000,
    creditPrice: 236000000,
    aging: 27,
    source: "Trade In",
    photos: 19,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["DNGA Platform", "VSC", "Rear Camera", "Digital AC"],
  },
  {
    id: "unit-009",
    brand: "Daihatsu",
    type: "Rocky 1.2 X CVT",
    plate: "B 1209 MVX",
    year: 2022,
    color: "Compagno Red",
    transmission: "Automatic",
    odometer: 28750,
    branch: "BEKASI",
    position: "Warehouse Bekasi",
    status: "SOLD",
    buyingPrice: 165000000,
    cashPrice: 189000000,
    creditPrice: 196000000,
    aging: 31,
    source: "Fleet Partner",
    photos: 15,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.2 L",
    seats: 5,
    features: ["DNGA", "LED Headlamp", "Keyless", "Rear Camera"],
  },
  {
    id: "unit-010",
    brand: "Honda",
    type: "BR-V Prestige CVT",
    plate: "B 1210 MVX",
    year: 2021,
    color: "Lunar Silver",
    transmission: "Automatic",
    odometer: 35420,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 221000000,
    cashPrice: 255000000,
    creditPrice: 264000000,
    aging: 16,
    source: "Customer Direct",
    photos: 21,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Honda Sensing", "LaneWatch", "7 Seater", "Smart Key"],
  },
  {
    id: "unit-011",
    brand: "Toyota",
    type: "Innova Zenix Hybrid Q",
    plate: "B 1211 MVX",
    year: 2023,
    color: "Platinum White Pearl",
    transmission: "Automatic",
    odometer: 12450,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 410000000,
    cashPrice: 468000000,
    creditPrice: 482000000,
    aging: 9,
    source: "Customer Direct",
    photos: 28,
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "2.0 L Hybrid",
    seats: 7,
    features: ["TNGA Hybrid", "Panoramic Roof", "Captain Seat", "TSS Safety"],
  },
  {
    id: "unit-012",
    brand: "Toyota",
    type: "Raize GR Sport 1.0T",
    plate: "B 1212 MVX",
    year: 2022,
    color: "Turquoise Mica Metallic",
    transmission: "Automatic",
    odometer: 22100,
    branch: "CINERE",
    position: "Showroom Cinere",
    status: "UNIT READY",
    buyingPrice: 198000000,
    cashPrice: 228000000,
    creditPrice: 235000000,
    aging: 18,
    source: "Trade In",
    photos: 17,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.0 L Turbo",
    seats: 5,
    features: ["GR Sport Kit", "Turbo Engine", "LED Projector", "Digital Meter"],
  },
  {
    id: "unit-013",
    brand: "Mitsubishi",
    type: "Pajero Sport Dakar 4x2",
    plate: "B 1213 MVX",
    year: 2020,
    color: "Graphite Grey",
    transmission: "Automatic",
    odometer: 58200,
    branch: "PONDOK BAMBU",
    position: "Pondok Bambu",
    status: "UNIT READY",
    buyingPrice: 385000000,
    cashPrice: 435000000,
    creditPrice: 448000000,
    aging: 42,
    source: "Fleet Partner",
    photos: 26,
    bodyType: "SUV",
    fuel: "Diesel",
    engine: "2.4 L Diesel",
    seats: 7,
    features: ["4WD Select", "Cruise Control", "Rockford Audio", "360 Camera"],
  },
  {
    id: "unit-014",
    brand: "Honda",
    type: "CR-V Turbo Prestige",
    plate: "B 1214 MVX",
    year: 2021,
    color: "Crystal Black Pearl",
    transmission: "Automatic",
    odometer: 29800,
    branch: "BEKASI",
    position: "Showroom Bekasi",
    status: "BOOKED",
    buyingPrice: 420000000,
    cashPrice: 475000000,
    creditPrice: 489000000,
    aging: 25,
    source: "Referensi · Sales",
    photos: 23,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Honda Sensing", "Panoramic Roof", "Power Tailgate", "Leather Seat"],
  },
  {
    id: "unit-015",
    brand: "Daihatsu",
    type: "Xenia R ADS 1.5",
    plate: "B 1215 MVX",
    year: 2023,
    color: "Icy White",
    transmission: "Automatic",
    odometer: 9800,
    branch: "CINERE",
    position: "Showroom Cinere",
    status: "UNIT READY",
    buyingPrice: 185000000,
    cashPrice: 212000000,
    creditPrice: 219000000,
    aging: 11,
    source: "Lelang Partner",
    photos: 16,
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["ADS Package", "Digital AC", "Rear Camera", "VSC + HAC"],
  },
  {
    id: "unit-016",
    brand: "Wuling",
    type: "Almaz RS Pro",
    plate: "B 1216 MVX",
    year: 2022,
    color: "Carnelian Red",
    transmission: "Automatic",
    odometer: 24500,
    branch: "BINTARO",
    position: "Showroom Bintaro",
    status: "UNIT READY",
    buyingPrice: 265000000,
    cashPrice: 305000000,
    creditPrice: 315000000,
    aging: 28,
    source: "Customer Direct",
    photos: 20,
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Internet of Vehicle", "360 Camera", "ADAS Level 2", "Panoramic Sunroof"],
  },
];

class InventoryProductDemo {
  constructor(root) {
    this.root = root;
    this.units = [];
    /** Default filter Mobix: Ready (bukan Semua Status) */
    this.defaultStatus = "UNIT READY";
    this.status = "UNIT READY";
    this.branch = "ALL";
    this.query = "";
    this.sort = "newest";
    this.selectedId = null;
    this.dataError = "";
    this.lastFocusedElement = null;
    this.activeView = "units";
    this.activeUploadTab = "inventory";
    this.guideStepIndex = 0;
    this.guideView = "units";
    this._guideAutoShowing = false;
    this.falconRole = "sales"; // sales | management
    this.falconMessages = [];
    this.falconSalesDone = false;
    this.falconTutorialDone = { sales: {}, management: {} };
    /** Focus unit for Falcon photo demo: { unit, gallery: [{label, slot, url}] } */
    this.falconFocus = null;
    /** tutorial = template demo; live = real Falcon API + Motovax knowledge */
    this.falconMode = "tutorial"; // tutorial | live | picking
    this.falconLiveBusy = false;
    /** Rate-limit snapshot from /falcon-chat (session 30 / day 800 on backend). */
    this.falconLiveQuota = {
      sessionUsed: 0,
      sessionLimit: 30,
      sessionRemaining: 30,
      dayUsed: 0,
      dayLimit: 800,
      dayRemaining: 800,
    };
    this.advOpen = false;
    this.branchMenuOpen = false;
    this.advFilters = {
      brand: "",
      type: "",
      plate: "",
      branch: "",
      color: "",
      year: "",
      transmission: "",
      bodyType: "",
      minPrice: "",
      maxPrice: "",
      minBuyingPrice: "",
      maxBuyingPrice: "",
      minAging: "",
      maxAging: "",
      minPhotoCount: "",
      maxPhotoCount: "",
      dateFrom: "",
      dateTo: "",
    };

    this.tableBody = root.querySelector("[data-demo-table-body]");
    this.mobileList = root.querySelector("[data-demo-mobile-list]");
    this.emptyState = root.querySelector("[data-demo-empty]");
    this.searchInput = root.querySelector("[data-demo-search]");
    this.branchSelect = root.querySelector("[data-demo-branch]");
    this.sortSelect = root.querySelector("[data-demo-sort]");
    this.resultCount = root.querySelector("[data-demo-result-count]");
    this.advPanel = root.querySelector("[data-ims-adv-panel]");
    this.advToggle = root.querySelector("[data-ims-adv-toggle]");
    this.advBadge = root.querySelector("[data-ims-adv-badge]");
    this.activeChips = root.querySelector("[data-ims-active-chips]");
    this.exportToggle = root.querySelector("[data-ims-export-toggle]");
    this.exportMenu = root.querySelector("[data-ims-export-menu]");
    this.branchTrigger = root.querySelector("[data-ims-branch-trigger]");
    this.branchMenu = root.querySelector("[data-ims-branch-menu]");
    this.branchLabel = root.querySelector("[data-ims-branch-label]");
    this.detailPanel = root.querySelector(".demo-detail-panel");
    this.detailBackdrop = root.querySelector("[data-demo-detail-backdrop]");
    this.guide = root.querySelector("[data-demo-guide-popover]");
    this.guideSpotlight = root.querySelector("[data-demo-guide-spotlight]");
    this._highlightEl = null;
    this.toast = root.querySelector("[data-demo-toast]");
    this.bookingButton = root.querySelector("[data-demo-book-unit]");
    this.bookingCopy = root.querySelector("[data-demo-booking-copy]");
    this.branchTotals = root.querySelector("[data-ims-branch-totals]");
    this.branchGrid = root.querySelector("[data-ims-branch-grid]");
    this.tipTitle = root.querySelector("[data-ims-tip-title]");
    this.tipBody = root.querySelector("[data-ims-tip-body]");
    this.falconMessagesEl = root.querySelector("[data-falcon-messages]");
    this.falconInput = root.querySelector("[data-falcon-input]");
    this.falconContact = root.querySelector("[data-falcon-contact]");
    this.falconAvatar = root.querySelector("[data-falcon-avatar]");
    this.falconRoleLabel = root.querySelector("[data-falcon-role-label]");
    this.falconRoleHint = root.querySelector("[data-falcon-role-hint]");
    this.falconTutorialList = root.querySelector("[data-falcon-tutorial-list]");
    this.falconQuickPrompts = root.querySelector("[data-falcon-quick-prompts]");
    this.falconRoleGate = root.querySelector("[data-falcon-role-gate]");
    this.falconLiveCta = root.querySelector("[data-falcon-live-cta]");
    this.falconExitLive = root.querySelector("[data-falcon-exit-live]");
    this.falconModeLabel = root.querySelector("[data-falcon-mode-label]");
    this.falconStatus = root.querySelector("[data-falcon-status]");

    this.bind();
    this.setView("units");
    this.initFalconChat();
    this.render();
    this.loadTenantData();
  }

  /**
   * Panduan pendek per menu sidebar + spotlight (highlight area seperti product tour).
   * Tiap tab punya langkah sendiri; `anchor` menunjuk elemen data-ims-anchor.
   * Auto-aktif setiap kali user buka menu sidebar (bukan sekali-saja).
   */
  guideSteps(view = this.guideView || this.activeView) {
    const story = this.falconStoryLabel();
    const falconMessageStep = (title, body, message) => ({
      view: "falcon",
      anchor: "falcon-phone",
      title,
      body,
      enter: () => this.sendFalconUserMessage(message, { fromGuide: true }),
    });
    const byView = {
      units: [
        {
          view: "units",
          anchor: "nav-units",
          title: "Menu Manajemen Unit",
          body: "Anda di menu stok unit (sama seperti Motovax App). Area sorot = item sidebar aktif. Berikutnya: cara mencari unit.",
        },
        {
          view: "units",
          anchor: "units-search",
          title: "Cari unit",
          body: "Ketik plat, brand, tipe, atau tahun di kolom pencarian. Contoh: “Avanza” atau plat “B 1234”. Hasil tabel langsung menyusut.",
        },
        {
          view: "units",
          anchor: "units-filters",
          title: "Filter cabang & status",
          body: "Cabang, pill Ready/Booked, dan Filter Lanjutan menyaring stok. Export di kanan atas untuk unduh Excel/PDF (simulasi).",
        },
        {
          view: "units",
          anchor: "units-table",
          title: "Tabel stok & detail",
          body: "Klik satu baris unit untuk membuka detail (harga, odo, foto, dokumen) — layout mirip halaman Mobix. Lalu coba menu sidebar lain.",
        },
        {
          view: "units",
          anchor: "nav",
          title: "Menu lain di sidebar",
          body: "Unit per Cabang, Upload Data, dan AI Falcon masing-masing punya panduan sendiri. Klik menu kiri — panduan langsung aktif tanpa perlu tekan tombol dulu.",
        },
      ],
      "per-cabang": [
        {
          view: "per-cabang",
          anchor: "nav-per-cabang",
          title: "Menu Unit per Cabang",
          body: "Menu ini merangkum stok Ready, Booked, dan kelengkapan foto per cabang — setara modul cabang di Mobix.",
        },
        {
          view: "per-cabang",
          anchor: "branch-totals",
          title: "Total agregat",
          body: "Baris total di atas menampilkan ringkasan semua cabang (jumlah unit, Ready, Booked). Angka ikut data tenant demo.",
        },
        {
          view: "per-cabang",
          anchor: "branch-grid",
          title: "Kartu cabang",
          body: "Klik satu kartu cabang → kembali ke Manajemen Unit dengan filter cabang itu otomatis aktif. Tidak perlu set filter manual.",
        },
      ],
      uploads: [
        {
          view: "uploads",
          anchor: "nav-uploads",
          title: "Menu Upload Data",
          body: "Satu tempat untuk impor inventory, foto unit, handover sales, dan MRP — alur yang sama dengan Mobix.",
        },
        {
          view: "uploads",
          anchor: "upload-tabs",
          title: "Empat jenis upload",
          body: "Pilih tab: Import Inventory (Excel stok), Upload Foto, Handover Sales (unit terjual), atau Upload MRP (harga OTR massal).",
        },
        {
          view: "uploads",
          anchor: "upload-drop",
          title: "Simulasi unggah",
          body: "Di demo, tombol unggah hanya simulasi (file tidak dikirim). Di tenant asli, file divalidasi lalu masuk ke inventory Anda.",
        },
      ],
      falcon: [
        {
          view: "falcon",
          anchor: "nav-falcon",
          title: "Menu AI Falcon",
          body: "Panduan ini memperagakan seluruh capability Sales Agent, lalu capability tambahan Management Agent. Setiap langkah mengirim contoh pesan dan menampilkan hasilnya di WhatsApp mock.",
          enter: () => {
            this.falconTutorialDone = { sales: {}, management: {} };
            this.falconSalesDone = false;
            this.setFalconRole("sales", { greet: true, reset: true, fromGuide: true });
          },
        },
        {
          view: "falcon",
          anchor: "falcon-badge",
          title: "Sales Agent · 10 capability",
          body: "Sales fokus pada layanan customer dan pipeline miliknya. Ikuti semua contoh sampai checklist Sales tercentang penuh; laporan internal Management tetap dibatasi.",
        },
        falconMessageStep("Sales 1/10 · Cek stok & detail", "Falcon mencari unit ready lalu menampilkan nopol, warna, odometer, cabang, posisi, dan harga OTR.", `Halo, mau tanya ${story} dong, masih ready?`),
        falconMessageStep("Sales 2/10 · Minta foto unit", "Falcon menjaga konteks unit yang sama dan mengirim beberapa foto real unit di bubble chat.", "Boleh minta fotonya?"),
        {
          view: "falcon",
          anchor: "falcon-phone",
          title: "Sales 3/10 · Upload foto stok",
          body: "Simulasi lampiran menambahkan dua foto ke unit yang sama, menautkan nopol, lalu memperbarui jumlah galeri stok.",
          enter: () => this.simulateFalconPhotoUpload({ fromGuide: true }),
        },
        falconMessageStep("Sales 4/10 · Kredit & asuransi", "Falcon menghitung ilustrasi OTR, DP 20%, tenor 48 bulan, angsuran, serta dukungan skema asuransi.", `Simulasi kredit ${story} DP 20% tenor 48 bulan dan asuransi`),
        falconMessageStep("Sales 5/10 · Lokasi showroom", "Falcon memberikan alamat, token peta, dan konteks jam operasional cabang tenant.", "Lokasi showroom dan map cabang"),
        falconMessageStep("Sales 6/10 · Catat lead", "Falcon mencatat customer sebagai lead milik sales yang sedang chat, lengkap dengan HP dan unit minat.", `Catat lead Budi 08123456789 minat ${story}`),
        falconMessageStep("Sales 7/10 · Handoff customer", "Falcon menampilkan PIC yang tersedia dan menyiapkan perpindahan percakapan customer ke admin.", "Hubungkan customer ke admin"),
        falconMessageStep("Sales 8/10 · Konten promosi", "Falcon membuat draft caption promosi berdasarkan unit tenant; production juga mendukung visual sesuai permission.", `Buat caption promo ${story}`),
        falconMessageStep("Sales 9/10 · Performa sendiri", "Sales hanya melihat metrik miliknya: lead, follow-up, closing, dan unit yang sering ditanyakan.", "Performa sales saya"),
        falconMessageStep("Sales 10/10 · Ringkasan capability", "Falcon merangkum seluruh capability Sales beserta contoh perintah. Checklist Sales kini selesai.", "Tampilkan semua fitur sales"),
        {
          view: "falcon",
          anchor: "falcon-badge",
          title: "Management Agent · 9 capability tambahan",
          body: "Management mewarisi capability Sales dan memperoleh laporan internal, import, edit unit, dokumen, analisis, serta analytics tenant.",
          enter: () => this.setFalconRole("management", { greet: true, reset: true, fromGuide: true }),
        },
        falconMessageStep("Management 1/9 · Stok per cabang", "Falcon menyusun total Ready, Booked, Sold, dan total stok per cabang.", "Laporan stok per cabang"),
        falconMessageStep("Management 2/9 · Aging unit", "Falcon mengurutkan unit dengan aging tertinggi dan memberi rekomendasi tindak lanjut.", "Laporan aging unit"),
        falconMessageStep("Management 3/9 · GP & margin", "Angka GP/margin internal hanya tampil untuk Management dan diberi konteks risiko unit aging.", "Gross profit dan margin unit"),
        falconMessageStep("Management 4/9 · Import inventory", "Falcon memperagakan validasi Excel, jumlah baris diproses, unit terbarui, dan warning data.", "Import inventory lewat Excel"),
        falconMessageStep("Management 5/9 · Edit status unit", "Falcon memvalidasi permission lalu mensimulasikan perubahan status unit menjadi Booked.", "Ubah status unit jadi Booked"),
        falconMessageStep("Management 6/9 · Dokumen unit", "Falcon memperagakan upload dan review STNK/BPKB yang tertaut ke inventory.", "Upload dan review dokumen STNK BPKB unit"),
        falconMessageStep("Management 7/9 · Analisis inventory", "Falcon membaca distribusi stok, aging, dan kelengkapan foto lalu memberi rekomendasi operasional.", "Analisis inventory dan rekomendasi stok"),
        falconMessageStep("Management 8/9 · Analytics penjualan", "Falcon merangkum tren lead, closing, conversion, channel, dan unit terlaris.", "Tren penjualan dan analytics bulan ini"),
        falconMessageStep("Management 9/9 · Ringkasan capability", "Falcon merangkum seluruh capability Management. Checklist kedua role kini tercentang penuh.", "Tampilkan semua fitur management"),
        {
          view: "falcon",
          anchor: "falcon-chat",
          title: "Langsung chat real",
          body: "Selesai panduan. Ketik pesan, tekan kirim, atau pilih “Coba langsung” — demo otomatis beralih ke Falcon AI real dengan stok Motovax. Ganti agent kapan saja di rail kiri.",
        },
      ],
    };
    return byView[view] || byView.units;
  }

  sampleUnitNames() {
    const ready = (this.units.length ? this.units : inventoryDemoSeed)
      .filter((u) => String(u.status).toUpperCase().includes("READY") || u.status === "UNIT READY")
      .slice(0, 3);
    const pool = ready.length ? ready : (this.units.length ? this.units : inventoryDemoSeed).slice(0, 3);
    return pool.map((u) => `${u.brand} ${u.type}`);
  }

  /** Satu unit “cerita” demo Falcon — prioritaskan Serena agar alur tanya → foto → update nyambung. */
  falconStoryUnit() {
    const source = this.units.length ? this.units : inventoryDemoSeed;
    const prefer = source.find((u) =>
      `${u.brand} ${u.type}`.toLocaleLowerCase("id").includes("serena"),
    );
    if (prefer) return prefer;
    const ready = source.find(
      (u) => String(u.status).toUpperCase().includes("READY") || u.status === "UNIT READY",
    );
    return ready || source[0] || null;
  }

  falconStoryLabel() {
    const u = this.falconStoryUnit();
    return u ? `${u.brand} ${u.type}` : "Nissan Serena HWS AT";
  }

  async loadTenantData(force = false) {
    try {
      const snapshot = await publicDemoData.snapshot(force);
      this.dataError = "";
      this.units = snapshot.inventory.map((unit) => {
        const seed =
          inventoryDemoSeed.find(
            (item) =>
              item.id === unit.id ||
              (`${item.brand} ${item.type}`.toLowerCase() ===
                `${unit.brand || ""} ${unit.type || ""}`.toLowerCase()),
          ) || {};
        return {
          id: unit.id,
          brand: unit.brand,
          type: unit.type,
          plate: unit.plate || seed.plate || "Unit Demo",
          year: unit.year,
          color: unit.color || seed.color,
          transmission: this.titleCase(unit.transmission || seed.transmission || "Automatic"),
          odometer: unit.odometer ?? seed.odometer ?? 0,
          branch: unit.branch || seed.branch || "Demo Jakarta",
          position: unit.position || unit.branch || seed.position || "Showroom Demo",
          status: String(unit.status).toUpperCase().includes("READY")
            ? "UNIT READY"
            : String(unit.status || seed.status || "UNIT READY").toUpperCase().includes("BOOK")
              ? "BOOKED"
              : String(unit.status || "").toUpperCase().includes("SOLD")
                ? "SOLD"
                : unit.status || seed.status || "UNIT READY",
          buyingPrice: unit.buying_price ?? unit.buyingPrice ?? seed.buyingPrice ?? null,
          cashPrice: unit.cash_price ?? unit.cashPrice ?? seed.cashPrice,
          creditPrice: unit.credit_price ?? unit.creditPrice ?? seed.creditPrice,
          aging: unit.aging ?? seed.aging ?? 0,
          source: unit.document_title || unit.source || seed.source || "",
          photos: unit.photo_count ?? unit.photos ?? seed.photos ?? 0,
          photoUrl: unit.photo_url || seed.photoUrl || "",
          bodyType: unit.body_type || unit.bodyType || seed.bodyType || unit.category,
          fuel: unit.fuel || seed.fuel,
          engine: unit.engine || seed.engine,
          seats: unit.seats || seed.seats,
          features: unit.features || seed.features || [],
          purchaseDate: unit.purchase_date || unit.purchaseDate || "",
        };
      });
      // Share live photo URLs with Social Growth Studio (same tenant inventory).
      if (typeof window.__motovaxApplyInventoryPhotos === "function") {
        window.__motovaxApplyInventoryPhotos(this.units);
      }
      this.rebuildBranchOptions();
      this.render();
    } catch (error) {
      this.units = inventoryDemoSeed.map((unit) => ({ ...unit }));
      this.dataError = "";
      this.rebuildBranchOptions();
      this.render();
    }
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-inventory-demo]")) {
      button.addEventListener("click", () => this.open(button, { mode: "inventory" }));
    }

    for (const button of document.querySelectorAll("[data-open-falcon-demo]")) {
      button.addEventListener("click", (event) => {
        if (button instanceof HTMLAnchorElement) event.preventDefault();
        this.open(button, { mode: "falcon" });
      });
    }

    for (const button of this.root.querySelectorAll("[data-close-inventory-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    for (const button of this.root.querySelectorAll("[data-ims-nav]")) {
      button.addEventListener("click", () => {
        this.setView(button.dataset.imsNav || "units", { fromNav: true });
      });
    }

    for (const button of this.root.querySelectorAll("[data-ims-upload-tab]")) {
      button.addEventListener("click", () => {
        this.setUploadTab(button.dataset.imsUploadTab || "inventory");
      });
    }

    for (const button of this.root.querySelectorAll("[data-ims-upload-sim]")) {
      button.addEventListener("click", () => {
        const kind = button.dataset.imsUploadSim || "inventory";
        const labels = {
          inventory: "Import inventory",
          foto: "Upload foto",
          handover: "Handover sales",
          mrp: "Upload MRP",
        };
        this.toast.querySelector("b").textContent = `${labels[kind] || "Upload"} disimulasikan`;
        this.toast.querySelector("p").textContent =
          "Di Mobix file diunggah ke tenant Anda; demo ini hanya menampilkan alur yang sama.";
        this.toast.hidden = false;
      });
    }

    for (const button of this.root.querySelectorAll("[data-status-filter]")) {
      button.addEventListener("click", () => {
        this.status = button.dataset.statusFilter || "ALL";
        this.render();
      });
    }

    this.searchInput?.addEventListener("input", () => {
      this.query = this.searchInput.value.trim().toLocaleLowerCase("id");
      this.render();
    });

    this.branchSelect?.addEventListener("change", () => {
      this.branch = this.branchSelect.value;
      this.syncBranchUi();
      this.render();
    });

    this.sortSelect?.addEventListener("change", () => {
      this.sort = this.sortSelect.value;
      this.render();
    });

    this.branchTrigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.branchMenuOpen = !this.branchMenuOpen;
      if (this.branchMenu) this.branchMenu.hidden = !this.branchMenuOpen;
      this.branchTrigger.setAttribute("aria-expanded", this.branchMenuOpen ? "true" : "false");
    });

    this.branchMenu?.addEventListener("click", (event) => {
      const opt = event.target.closest("[data-ims-branch-opt]");
      if (!opt) return;
      this.setBranch(opt.dataset.imsBranchOpt || "ALL");
      this.branchMenuOpen = false;
      if (this.branchMenu) this.branchMenu.hidden = true;
      this.branchTrigger?.setAttribute("aria-expanded", "false");
      this.render();
    });

    this.advToggle?.addEventListener("click", () => {
      this.advOpen = !this.advOpen;
      this.renderAdvPanel();
    });

    this.root.querySelector("[data-ims-adv-reset]")?.addEventListener("click", () => {
      this.resetAdvFilters();
      this.render();
    });

    for (const field of this.root.querySelectorAll("[data-ims-adv]")) {
      const key = field.dataset.imsAdv;
      const handler = () => {
        if (!key || !Object.prototype.hasOwnProperty.call(this.advFilters, key)) return;
        this.advFilters[key] = String(field.value || "").trim();
        if (key === "branch") {
          this.setBranch(this.advFilters.branch || "ALL");
        }
        this.render();
      };
      field.addEventListener("input", handler);
      field.addEventListener("change", handler);
    }

    this.exportToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = this.exportMenu && this.exportMenu.hidden;
      if (this.exportMenu) this.exportMenu.hidden = !open;
      this.exportToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    for (const button of this.root.querySelectorAll("[data-ims-export]")) {
      button.addEventListener("click", () => {
        this.exportUnits(button.dataset.imsExport || "csv");
        if (this.exportMenu) this.exportMenu.hidden = true;
        this.exportToggle?.setAttribute("aria-expanded", "false");
      });
    }

    document.addEventListener("click", (event) => {
      if (this.exportMenu && !this.exportMenu.hidden) {
        if (
          !event.target.closest("[data-ims-export-toggle]") &&
          !event.target.closest("[data-ims-export-menu]")
        ) {
          this.exportMenu.hidden = true;
          this.exportToggle?.setAttribute("aria-expanded", "false");
        }
      }
      if (this.branchMenu && !this.branchMenu.hidden) {
        if (
          !event.target.closest("[data-ims-branch-trigger]") &&
          !event.target.closest("[data-ims-branch-menu]")
        ) {
          this.branchMenu.hidden = true;
          this.branchMenuOpen = false;
          this.branchTrigger?.setAttribute("aria-expanded", "false");
        }
      }
    });

    this.activeChips?.addEventListener("click", (event) => {
      const chipBtn = event.target.closest("[data-ims-chip-clear]");
      if (!chipBtn) return;
      const kind = chipBtn.dataset.imsChipClear;
      if (kind === "branch") {
        this.setBranch("ALL");
        this.advFilters.branch = "";
        const advBranch = this.root.querySelector('[data-ims-adv="branch"]');
        if (advBranch) advBranch.value = "";
      } else if (kind === "status") {
        this.status = this.defaultStatus;
      } else if (kind === "adv") {
        this.resetAdvFilters();
      } else if (kind === "all") {
        this.clearFilters();
        return;
      }
      this.render();
    });

    this.tableBody?.addEventListener("click", (event) => this.handleUnitActivation(event));
    this.tableBody?.addEventListener("keydown", (event) => this.handleUnitActivation(event));
    this.mobileList?.addEventListener("click", (event) => this.handleUnitActivation(event));
    this.mobileList?.addEventListener("keydown", (event) => this.handleUnitActivation(event));

    const handleBranchFilterClick = (event) => {
      const card = event.target.closest("[data-ims-branch-filter]");
      if (!card) return;
      const branch = card.dataset.imsBranchFilter || "ALL";
      let status = card.dataset.imsStatusFilter || this.defaultStatus;
      // Map "ALL" from branch cards to default Ready like opening stock list
      if (status === "ALL") status = this.defaultStatus;
      this.setBranch(branch);
      this.status = status;
      this.setView("units", { skipGuide: true });
      this.render();
    };
    this.branchTotals?.addEventListener("click", handleBranchFilterClick);
    this.branchGrid?.addEventListener("click", handleBranchFilterClick);

    for (const button of this.root.querySelectorAll("[data-close-demo-detail]")) {
      button.addEventListener("click", () => this.closeDetail());
    }
    this.detailBackdrop?.addEventListener("click", () => this.closeDetail());

    // Detail tabs (Detail / Gambar / Video / Dokumen / Histori) — no booking CTA
    for (const button of this.root.querySelectorAll("[data-ims-ud-tab]")) {
      button.addEventListener("click", () => {
        this.setUnitDetailTab(button.dataset.imsUdTab || "detail");
      });
    }
    this.root.querySelector("[data-detail-export-toggle]")?.addEventListener("click", () => {
      this.exportSelectedUnitDetail();
    });

    this.root.querySelector("[data-demo-reset]")?.addEventListener("click", () => this.reset());
    for (const button of this.root.querySelectorAll("[data-demo-clear-filter]")) {
      button.addEventListener("click", () => {
        this.clearFilters();
        this.searchInput?.focus();
      });
    }

    for (const button of this.root.querySelectorAll("[data-demo-guide]")) {
      button.addEventListener("click", () => this.openGuide(0, this.activeView));
    }
    this.root.querySelector("[data-close-demo-guide]").addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-demo-guide-next]")?.addEventListener("click", () => this.nextGuideStep());
    this.root.querySelector("[data-demo-guide-prev]")?.addEventListener("click", () => this.prevGuideStep());
    this.root.querySelector("[data-demo-guide-finish]")?.addEventListener("click", () => this.closeGuide());
    this.root.querySelector("[data-close-demo-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.root.querySelector("[data-falcon-send]")?.addEventListener("click", () => this.handleFalconSend());
    this.root.querySelector("[data-falcon-attach]")?.addEventListener("click", () => {
      if (this.falconMode !== "live") this.startFalconLiveMode(this.falconRole);
      this.showToast(
        "Chat real aktif",
        "Untuk melihat foto, ketik “mau lihat foto unit …”. Unggah/update foto stok tidak tersedia di uji chat real.",
      );
    });
    this.falconInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleFalconSend();
      }
    });
    this.falconQuickPrompts?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-falcon-prompt]");
      if (!chip) return;
      this.sendFalconUserMessage(chip.dataset.falconPrompt || chip.textContent);
    });

    for (const btn of this.root.querySelectorAll("[data-falcon-start-live]")) {
      btn.addEventListener("click", () => this.openFalconLiveRoleGate());
    }
    this.root.querySelector("[data-falcon-cancel-live]")?.addEventListener("click", () =>
      this.cancelFalconLivePick(),
    );
    this.falconRoleGate?.addEventListener("click", (event) => {
      const pick = event.target.closest("[data-falcon-pick-role]");
      if (!pick) return;
      this.startFalconLiveMode(pick.dataset.falconPickRole || "sales");
    });

    // Left rail: pilih agent (Sales / Management)
    this.root.querySelector(".falcon-picker-list")?.addEventListener("click", (event) => {
      const card = event.target.closest("[data-falcon-set-role]");
      if (!card) return;
      const role = card.dataset.falconSetRole || "sales";
      if (this.falconMode === "live") {
        this.setFalconRole(role, { greet: true, reset: true });
      } else if (this.falconMode === "picking") {
        this.startFalconLiveMode(role);
      } else {
        this.setFalconRole(role, { greet: true, reset: true });
      }
    });

    this._onGuideReposition = () => {
      if (!this.guide || this.guide.hidden) return;
      this.syncSpotlightRect();
      this.positionGuide();
    };
    window.addEventListener("resize", this._onGuideReposition);
    this.root.querySelector(".demo-workspace")?.addEventListener("scroll", this._onGuideReposition, {
      passive: true,
    });
    this.root.querySelector(".demo-sidebar")?.addEventListener("scroll", this._onGuideReposition, {
      passive: true,
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (!this.guide.hidden) {
        this.closeGuide();
      } else if (this.detailPanel.classList.contains("is-open")) {
        this.closeDetail();
      } else {
        this.close();
      }
    });
  }

  setView(view, options = {}) {
    const next = ["units", "per-cabang", "uploads", "falcon"].includes(view) ? view : "units";
    const prev = this.activeView;
    this.activeView = next;

    for (const button of this.root.querySelectorAll("[data-ims-nav]")) {
      const isActive = button.dataset.imsNav === next;
      button.classList.toggle("active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }

    for (const panel of this.root.querySelectorAll("[data-ims-view]")) {
      const isActive = panel.dataset.imsView === next;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    }

    const tips = {
      units: {
        title: "Coba filter seperti di app",
        body: "Pakai bar filter (cabang, status, Filter Lanjutan) lalu klik unit untuk detail — layout mirip Manajemen Unit Motovax App.",
      },
      "per-cabang": {
        title: "Pantau stok per cabang",
        body: "Klik kartu cabang untuk membuka Manajemen Unit dengan filter cabang yang sama seperti di Mobix.",
      },
      uploads: {
        title: "Alur upload data",
        body: "Pilih tab Import Inventory, Foto, Handover, atau MRP — tiga menu IMS ini sama dengan Mobix.",
      },
      falcon: {
        title: "Chat AI Falcon",
        body: "Pilih agent di kiri, coba chat di iPhone tengah. Mode demo = template; Chat real = AI + stok Motovax.",
      },
    };
    const tip = tips[next] || tips.units;
    if (this.tipTitle) this.tipTitle.textContent = tip.title;
    if (this.tipBody) this.tipBody.textContent = tip.body;

    if (next !== "units") this.closeDetail();
    this.renderBranchSummary();
    this.renderUploadMeta();
    if (next === "falcon") {
      this.renderFalconChrome();
      this.renderFalconTutorial();
      this.renderFalconQuickPrompts();
    }

    // Tutup panduan tab lama saat pindah menu (kecuali langkah panduan sendiri yang set view).
    if (
      prev !== next &&
      !options.fromGuide &&
      this.guide &&
      !this.guide.hidden &&
      this.guideView !== next
    ) {
      this.closeGuide();
    }

    // Auto-panduan setiap kali user buka menu sidebar (atau open demo) — tidak perlu tombol Panduan dulu.
    if (!options.fromGuide && !options.skipGuide) {
      this.maybeShowViewGuide(next);
    }
  }

  /**
   * Tampilkan panduan demo untuk tab sidebar yang dibuka.
   * Selalu aktif saat menu dibuka (tiap Unit / Cabang / Upload / Falcon punya tour sendiri).
   */
  maybeShowViewGuide(view) {
    if (!this.root?.classList.contains("is-open")) return;
    if (this._guideAutoShowing) return;
    const key = ["units", "per-cabang", "uploads", "falcon"].includes(view) ? view : "units";

    this._guideAutoShowing = true;
    // Biarkan layout tab settle dulu (kartu cabang / panel upload ter-render).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.openGuide(0, key);
        this._guideAutoShowing = false;
      });
    });
  }

  setUploadTab(tab) {
    const next = ["inventory", "foto", "handover", "mrp"].includes(tab) ? tab : "inventory";
    this.activeUploadTab = next;

    for (const button of this.root.querySelectorAll("[data-ims-upload-tab]")) {
      const isActive = button.dataset.imsUploadTab === next;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    }

    for (const panel of this.root.querySelectorAll("[data-ims-upload-panel]")) {
      panel.hidden = panel.dataset.imsUploadPanel !== next;
    }
  }

  open(trigger, options = {}) {
    this.lastFocusedElement = trigger;
    const falconStandalone = options.mode === "falcon";
    this.root.classList.toggle("is-falcon-standalone", falconStandalone);
    const title = this.root.querySelector("[data-inventory-demo-title]");
    const subtitle = this.root.querySelector("[data-inventory-demo-subtitle]");
    if (title) title.textContent = falconStandalone ? "Agentic AI Falcon" : "Sistem Manajemen Inventaris";
    if (subtitle) {
      subtitle.textContent = falconStandalone
        ? "WhatsApp AI · Sales & Management Agent"
        : "IMS demo · Selaras menu Mobix";
    }
    this.setView(falconStandalone ? "falcon" : "units", { skipGuide: true });
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-inventory-demo]").focus();
    // Panduan hanya untuk tab aktif (default: Manajemen Unit), bukan tour lintas semua menu.
    this.maybeShowViewGuide(falconStandalone ? "falcon" : this.activeView || "units");
    this.loadTenantData(true);
  }

  close() {
    const wasFalconStandalone = this.root.classList.contains("is-falcon-standalone");
    this.closeDetail();
    this.closeGuide();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.classList.remove("is-falcon-standalone");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (wasFalconStandalone) this.setView("units", { skipGuide: true });
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0, view = this.activeView) {
    const key = ["units", "per-cabang", "uploads", "falcon"].includes(view)
      ? view
      : this.activeView || "units";
    this.guideView = key;
    this.guideStepIndex = Math.max(0, startIndex);
    if (this.activeView !== key) {
      this.setView(key, { fromGuide: true });
    }
    if (this.guide) this.guide.hidden = false;
    this.renderGuideStep();
    const focusBtn =
      this.guide?.querySelector("[data-demo-guide-next]:not([hidden])") ||
      this.guide?.querySelector("[data-demo-guide-finish]:not([hidden])");
    focusBtn?.focus();
  }

  closeGuide() {
    if (this.guide) this.guide.hidden = true;
    this.clearHighlight();
    this.clearGuidePosition();
  }

  clearGuidePosition() {
    if (!this.guide) return;
    this.guide.classList.remove("is-falcon-anchor", "is-anchored");
    this.guide.style.top = "";
    this.guide.style.left = "";
    this.guide.style.right = "";
    this.guide.style.bottom = "";
    this.guide.style.maxWidth = "";
  }

  /**
   * Sorot elemen data-ims-anchor + gambar spotlight cutout (dim area lain).
   * Pola product tour: highlight menu/kontrol yang sedang dijelaskan.
   */
  highlightAnchor(name) {
    this.clearHighlight(false);
    if (!name) {
      this.syncSpotlightRect(null);
      return;
    }
    // Prefer elemen yang terlihat (sidebar desktop vs mobile-nav)
    const candidates = [...this.root.querySelectorAll(`[data-ims-anchor="${name}"]`)];
    const el =
      candidates.find((node) => {
        const r = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return r.width > 1 && r.height > 1 && style.display !== "none" && style.visibility !== "hidden";
      }) || candidates[0];
    if (!el) {
      this.syncSpotlightRect(null);
      return;
    }
    this._highlightEl = el;
    el.classList.add("ims-guide-highlight");
    try {
      el.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
    } catch {
      /* ignore */
    }
    this.syncSpotlightRect(el);
  }

  clearHighlight(hideSpotlight = true) {
    for (const el of this.root.querySelectorAll(".ims-guide-highlight")) {
      el.classList.remove("ims-guide-highlight");
    }
    this._highlightEl = null;
    if (hideSpotlight) this.syncSpotlightRect(null);
  }

  /**
   * Hole spotlight fixed di atas target — box-shadow besar = dim overlay.
   * Tidak terpengaruh overflow:hidden di .demo-app.
   */
  syncSpotlightRect(el = this._highlightEl) {
    const spot = this.guideSpotlight;
    if (!spot) return;
    if (!el || !this.guide || this.guide.hidden) {
      spot.hidden = true;
      spot.style.top = "";
      spot.style.left = "";
      spot.style.width = "";
      spot.style.height = "";
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 2 && r.height < 2) {
      spot.hidden = true;
      return;
    }
    const pad = 8;
    const top = Math.max(4, r.top - pad);
    const left = Math.max(4, r.left - pad);
    const width = Math.min(window.innerWidth - left - 4, r.width + pad * 2);
    const height = Math.min(window.innerHeight - top - 4, r.height + pad * 2);
    spot.hidden = false;
    spot.style.top = `${Math.round(top)}px`;
    spot.style.left = `${Math.round(left)}px`;
    spot.style.width = `${Math.round(width)}px`;
    spot.style.height = `${Math.round(height)}px`;
  }

  /**
   * Posisikan tooltip di samping area yang disorot (mirip callout product tour).
   */
  positionGuide() {
    if (!this.guide || this.guide.hidden) return;

    const place = () => {
      if (!this.guide || this.guide.hidden) return;

      const target =
        this._highlightEl && this._highlightEl.getBoundingClientRect().width > 0
          ? this._highlightEl
          : this.root.querySelector(".iphone-frame");

      this.guide.classList.add("is-anchored");
      this.guide.classList.toggle(
        "is-falcon-anchor",
        (this.guideView || this.activeView) === "falcon",
      );

      const gw = Math.min(320, window.innerWidth - 24);
      const gh = this.guide.offsetHeight || 200;
      const gap = 14;
      const margin = 12;
      const minTop = 64;

      if (!target) {
        this.guide.style.top = "92px";
        this.guide.style.right = "24px";
        this.guide.style.left = "auto";
        this.guide.style.bottom = "auto";
        this.guide.style.maxWidth = `${gw}px`;
        return;
      }

      const rect = target.getBoundingClientRect();
      let left = rect.right + gap;
      let top = rect.top;

      // Prefer kanan target; jika tidak muat, kiri; lalu atas/bawah.
      if (left + gw > window.innerWidth - margin) {
        left = rect.left - gw - gap;
      }
      if (left < margin) {
        left = Math.max(
          margin,
          Math.min(rect.left, window.innerWidth - gw - margin),
        );
        top = rect.bottom + gap;
        if (top + gh > window.innerHeight - margin) {
          top = Math.max(minTop, rect.top - gh - gap);
        }
      } else {
        top = Math.max(minTop, Math.min(top, window.innerHeight - gh - margin));
      }

      // Clamp final
      left = Math.max(margin, Math.min(left, window.innerWidth - gw - margin));
      top = Math.max(minTop, Math.min(top, window.innerHeight - gh - margin));

      this.guide.style.top = `${Math.round(top)}px`;
      this.guide.style.left = `${Math.round(left)}px`;
      this.guide.style.right = "auto";
      this.guide.style.bottom = "auto";
      this.guide.style.maxWidth = `${gw}px`;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(place);
      window.setTimeout(place, 80);
      window.setTimeout(() => {
        this.syncSpotlightRect();
        place();
      }, 200);
    });
  }

  renderGuideStep() {
    const steps = this.guideSteps(this.guideView || this.activeView);
    const step = steps[this.guideStepIndex] || steps[0];
    if (!step) {
      this.closeGuide();
      return;
    }
    const total = steps.length;
    const index = this.guideStepIndex + 1;
    const viewLabel = {
      units: "Manajemen Unit",
      "per-cabang": "Unit per Cabang",
      uploads: "Upload Data",
      falcon: "AI Falcon",
    }[this.guideView || step.view] || "Panduan";

    this.guide.querySelector("[data-demo-guide-step-label]").textContent =
      total > 1
        ? `${viewLabel.toUpperCase()} · LANGKAH ${index} DARI ${total}`
        : viewLabel.toUpperCase();
    this.guide.querySelector("[data-demo-guide-title]").textContent = step.title;
    this.guide.querySelector("[data-demo-guide-body]").textContent = step.body;

    const prev = this.guide.querySelector("[data-demo-guide-prev]");
    const next = this.guide.querySelector("[data-demo-guide-next]");
    const finish = this.guide.querySelector("[data-demo-guide-finish]");
    const isLast = this.guideStepIndex >= total - 1;
    const isFirst = this.guideStepIndex <= 0;

    if (prev) prev.hidden = isFirst;
    if (next) {
      next.hidden = isLast;
      next.textContent = "Berikutnya";
    }
    if (finish) finish.hidden = !isLast;

    if (step.view && step.view !== this.activeView) {
      this.setView(step.view, { fromGuide: true });
    }
    if (typeof step.enter === "function") step.enter();

    // Highlight setelah view settle (enter bisa ganti role / bubble)
    const applyHighlight = () => {
      if (step.anchor) this.highlightAnchor(step.anchor);
      else this.clearHighlight();
      this.positionGuide();
    };
    requestAnimationFrame(() => {
      applyHighlight();
      window.setTimeout(applyHighlight, 100);
    });
  }

  nextGuideStep() {
    const steps = this.guideSteps(this.guideView || this.activeView);
    if (this.guideStepIndex >= steps.length - 1) {
      this.closeGuide();
      return;
    }
    this.guideStepIndex += 1;
    this.renderGuideStep();
  }

  prevGuideStep() {
    if (this.guideStepIndex <= 0) return;
    this.guideStepIndex -= 1;
    this.renderGuideStep();
  }

  clearFilters() {
    this.status = this.defaultStatus;
    this.query = "";
    this.sort = "newest";
    if (this.searchInput) this.searchInput.value = "";
    if (this.sortSelect) this.sortSelect.value = "newest";
    this.resetAdvFilters();
    this.setBranch("ALL");
    this.render();
  }

  setBranch(branch) {
    const next = branch && branch !== "ALL" ? branch : "ALL";
    this.branch = next;
    if (this.branchSelect) this.branchSelect.value = next;
    this.advFilters.branch = next === "ALL" ? "" : next;
    const advBranch = this.root.querySelector('[data-ims-adv="branch"]');
    if (advBranch && advBranch.value !== this.advFilters.branch) {
      advBranch.value = this.advFilters.branch;
    }
    this.syncBranchUi();
  }

  syncBranchUi() {
    const label =
      !this.branch || this.branch === "ALL"
        ? "Semua Cabang"
        : String(this.branch).toLocaleLowerCase("id").replace(/\s+/g, "-");
    if (this.branchLabel) this.branchLabel.textContent = label;
    this.branchTrigger?.classList.toggle("is-active", Boolean(this.branch && this.branch !== "ALL"));
    for (const opt of this.root.querySelectorAll("[data-ims-branch-opt]")) {
      const value = opt.dataset.imsBranchOpt || "ALL";
      const selected = value === (this.branch || "ALL");
      opt.classList.toggle("is-selected", selected);
    }
  }

  rebuildBranchOptions() {
    if (!this.branchMenu) return;
    const set = new Set();
    for (const unit of this.units) {
      const b = String(unit.branch || "").trim();
      if (b) set.add(b.toLocaleUpperCase("id"));
    }
    // Keep known demo branches even if not in current snapshot
    for (const b of ["BANDUNG", "CINERE", "BINTARO", "PONDOK BAMBU", "BEKASI"]) set.add(b);
    const branches = [...set].sort((a, b) => a.localeCompare(b, "id"));
    const current = this.branch || "ALL";
    this.branchMenu.innerHTML = [
      `<button type="button" role="option" data-ims-branch-opt="ALL" class="${current === "ALL" ? "is-selected" : ""}">Semua Cabang</button>`,
      ...branches.map((b) => {
        const label = b.toLocaleLowerCase("id").replace(/\s+/g, "-");
        return `<button type="button" role="option" data-ims-branch-opt="${this.escapeHtml(b)}" class="${current === b ? "is-selected" : ""}">${this.escapeHtml(label)}</button>`;
      }),
    ].join("");

    // Keep hidden select + adv select in sync
    if (this.branchSelect) {
      this.branchSelect.innerHTML =
        `<option value="ALL">Semua Cabang</option>` +
        branches.map((b) => `<option value="${this.escapeHtml(b)}">${this.escapeHtml(b)}</option>`).join("");
      this.branchSelect.value = current;
    }
    const advBranch = this.root.querySelector('[data-ims-adv="branch"]');
    if (advBranch) {
      const prev = advBranch.value;
      advBranch.innerHTML =
        `<option value="">Semua Cabang</option>` +
        branches.map((b) => {
          const label = b.toLocaleLowerCase("id").replace(/\s+/g, "-");
          return `<option value="${this.escapeHtml(b)}">${this.escapeHtml(label)}</option>`;
        }).join("");
      advBranch.value = prev;
    }
    this.syncBranchUi();
  }

  resetAdvFilters() {
    this.advFilters = {
      brand: "",
      type: "",
      plate: "",
      branch: "",
      color: "",
      year: "",
      transmission: "",
      bodyType: "",
      minPrice: "",
      maxPrice: "",
      minBuyingPrice: "",
      maxBuyingPrice: "",
      minAging: "",
      maxAging: "",
      minPhotoCount: "",
      maxPhotoCount: "",
      dateFrom: "",
      dateTo: "",
    };
    this.sort = "newest";
    if (this.sortSelect) this.sortSelect.value = "newest";
    for (const field of this.root.querySelectorAll("[data-ims-adv]")) {
      field.value = "";
    }
  }

  countActiveAdvFilters() {
    // branch is mirrored from top filter — count only advanced-specific fields
    return Object.entries(this.advFilters).filter(([key, value]) => {
      if (key === "branch") return false;
      return String(value || "").trim() !== "";
    }).length;
  }

  renderAdvPanel() {
    if (this.advPanel) this.advPanel.hidden = !this.advOpen;
    if (this.advToggle) {
      this.advToggle.classList.toggle("is-open", this.advOpen);
      this.advToggle.setAttribute("aria-expanded", this.advOpen ? "true" : "false");
      const count = this.countActiveAdvFilters();
      this.advToggle.classList.toggle("has-filters", count > 0);
      if (this.advBadge) {
        this.advBadge.hidden = count === 0;
        this.advBadge.textContent = String(count);
      }
    }
  }

  renderActiveChips() {
    if (!this.activeChips) return;
    const chips = [];
    if (this.branch && this.branch !== "ALL") {
      chips.push(
        `<span class="ims-chip">Cabang: ${this.escapeHtml(String(this.branch).toLocaleLowerCase("id"))} <button type="button" data-ims-chip-clear="branch" aria-label="Hapus filter cabang">×</button></span>`,
      );
    }
    // Match app: only chip status when different from default Ready
    if (this.status && this.status !== this.defaultStatus) {
      const label =
        this.status === "ACTIVE"
          ? "Stok Aktif"
          : this.status === "UNIT READY"
            ? "Ready"
            : this.status === "BOOKED"
              ? "Booked"
              : this.status === "SOLD"
                ? "Sold"
                : this.status === "ALL"
                  ? "Semua Status"
                  : this.status;
      chips.push(
        `<span class="ims-chip">Status: ${this.escapeHtml(label)} <button type="button" data-ims-chip-clear="status" aria-label="Hapus filter status">×</button></span>`,
      );
    }
    const advCount = this.countActiveAdvFilters();
    if (advCount > 0) {
      chips.push(
        `<span class="ims-chip">Filter Lanjutan (${advCount}) <button type="button" data-ims-chip-clear="adv" aria-label="Hapus filter lanjutan">×</button></span>`,
      );
    }
    if (chips.length) {
      chips.push(`<button type="button" class="ims-chip-clear" data-ims-chip-clear="all">Hapus semua</button>`);
    }
    this.activeChips.innerHTML = chips.join("");
  }

  escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  matchesAdvFilters(unit) {
    const f = this.advFilters;
    const includes = (hay, needle) =>
      `${hay || ""}`.toLocaleLowerCase("id").includes(`${needle || ""}`.toLocaleLowerCase("id"));

    if (f.brand && !includes(unit.brand, f.brand)) return false;
    if (f.type && !includes(unit.type, f.type)) return false;
    if (f.plate && !includes(unit.plate, f.plate)) return false;
    if (f.color && !includes(unit.color, f.color)) return false;
    if (f.year && String(unit.year || "") !== String(f.year)) return false;
    if (f.transmission) {
      const unitTrans = `${unit.transmission || ""}`.toLocaleLowerCase("id");
      if (!unitTrans.includes(f.transmission.toLocaleLowerCase("id"))) return false;
    }
    if (f.bodyType) {
      const body = `${unit.bodyType || unit.category || ""}`.toLocaleLowerCase("id");
      if (body !== f.bodyType.toLocaleLowerCase("id")) return false;
    }

    const sellPrice = Number(unit.cashPrice || unit.creditPrice || 0);
    // Harga di app = nilai penuh Rupiah (bukan jutaan)
    if (f.minPrice !== "" && Number.isFinite(Number(f.minPrice)) && sellPrice < Number(f.minPrice)) {
      return false;
    }
    if (f.maxPrice !== "" && Number.isFinite(Number(f.maxPrice)) && sellPrice > Number(f.maxPrice)) {
      return false;
    }
    const buyPrice = Number(unit.buyingPrice || 0);
    if (f.minBuyingPrice !== "" && Number.isFinite(Number(f.minBuyingPrice)) && buyPrice < Number(f.minBuyingPrice)) {
      return false;
    }
    if (f.maxBuyingPrice !== "" && Number.isFinite(Number(f.maxBuyingPrice)) && buyPrice > Number(f.maxBuyingPrice)) {
      return false;
    }

    const aging = Number(unit.aging || 0);
    if (f.minAging !== "" && Number.isFinite(Number(f.minAging)) && aging < Number(f.minAging)) {
      return false;
    }
    if (f.maxAging !== "" && Number.isFinite(Number(f.maxAging)) && aging > Number(f.maxAging)) {
      return false;
    }

    const photos = Number(unit.photos || 0);
    if (f.minPhotoCount !== "" && Number.isFinite(Number(f.minPhotoCount)) && photos < Number(f.minPhotoCount)) {
      return false;
    }
    if (f.maxPhotoCount !== "" && Number.isFinite(Number(f.maxPhotoCount)) && photos > Number(f.maxPhotoCount)) {
      return false;
    }

    // Periode: filter kasar by year if purchaseDate unavailable
    if (f.dateFrom) {
      const fromYear = Number(String(f.dateFrom).slice(0, 4));
      const unitYear = Number(unit.year || 0);
      if (Number.isFinite(fromYear) && unitYear && unitYear < fromYear) return false;
    }
    if (f.dateTo) {
      const toYear = Number(String(f.dateTo).slice(0, 4));
      const unitYear = Number(unit.year || 0);
      if (Number.isFinite(toYear) && unitYear && unitYear > toYear) return false;
    }

    return true;
  }

  agingClass(unit) {
    if (unit.status === "SOLD") return "sold";
    if ((unit.aging || 0) > 60) return "high";
    if ((unit.aging || 0) > 30) return "mid";
    return "ok";
  }

  agingLabel(unit) {
    const aging = unit.aging ?? "-";
    if (unit.status === "SOLD") return `${aging} hr aging saat terjual`;
    return `${aging} hr aging`;
  }

  formatFullPrice(value) {
    if (value === null || value === undefined || value === 0) return "-";
    return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
  }

  exportUnits(kind) {
    const units = this.getVisibleUnits();
    if (!units.length) {
      this.toast.querySelector("b").textContent = "Tidak ada data unit";
      this.toast.querySelector("p").textContent = "Sesuaikan filter lalu coba export lagi.";
      this.toast.hidden = false;
      return;
    }

    if (kind === "pdf") {
      const rows = units
        .map(
          (unit) =>
            `<tr><td>${this.escapeHtml(unit.plate)}</td><td>${this.escapeHtml(unit.brand)}</td><td>${this.escapeHtml(unit.type)}</td><td>${this.escapeHtml(unit.status)}</td><td>${this.escapeHtml(unit.aging)}</td><td>${this.escapeHtml(unit.branch)}</td></tr>`,
        )
        .join("");
      const printWindow = window.open("", "_blank", "width=1200,height=800");
      if (!printWindow) {
        this.toast.querySelector("b").textContent = "Popup diblokir";
        this.toast.querySelector("p").textContent = "Izinkan popup browser untuk export PDF.";
        this.toast.hidden = false;
        return;
      }
      printWindow.document.write(`<!doctype html><html><head><title>Export Unit</title>
        <style>body{font-family:Arial,sans-serif;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d1d5db;padding:8px;font-size:12px;text-align:left}th{background:#f3f4f6}</style>
        </head><body><h1>Manajemen Unit - Export Data</h1><p>Total data: ${units.length}</p>
        <table><thead><tr><th>Plate No</th><th>Brand</th><th>Type</th><th>Status</th><th>Aging (hr)</th><th>Branch</th></tr></thead>
        <tbody>${rows}</tbody></table></body></html>`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 200);
      return;
    }

    const headers = [
      "Plate No",
      "Brand",
      "Type",
      "Year",
      "Color",
      "Status",
      "Aging (hr)",
      "Branch",
      "Harga Beli",
      "Harga Jual Cash",
    ];
    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = units.map((unit) => [
      unit.plate,
      unit.brand,
      unit.type,
      unit.year,
      unit.color,
      unit.status,
      unit.aging,
      unit.branch,
      unit.buyingPrice ?? "",
      unit.cashPrice ?? "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `units-export-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  reset() {
    this.selectedId = null;
    this.closeDetail();
    this.toast.hidden = true;
    this.clearFilters();
    this.guideStepIndex = 0;
    this.falconSalesDone = false;
    this.falconTutorialDone = { sales: {}, management: {} };
    this.falconFocus = null;
    this.falconMode = "tutorial";
    this.falconLiveBusy = false;
    this.falconLiveQuota = {
      sessionUsed: 0,
      sessionLimit: 30,
      sessionRemaining: 30,
      dayUsed: 0,
      dayLimit: 800,
      dayRemaining: 800,
    };
    this.setFalconRole("sales", { greet: true, reset: true });
    this.setView("units", { skipGuide: true });
    this.setUploadTab("inventory");
    this.loadTenantData(true);
  }

  initFalconChat() {
    this.falconFocus = null;
    this.falconMode = "tutorial";
    this.falconLiveBusy = false;
    this.falconLiveQuota = {
      sessionUsed: 0,
      sessionLimit: 30,
      sessionRemaining: 30,
      dayUsed: 0,
      dayLimit: 800,
      dayRemaining: 800,
    };
    this.setFalconRole("sales", { greet: true, reset: true });
  }

  openFalconLiveRoleGate() {
    // Role sudah dipilih di rail kiri — langsung chat real (gate overlay jadi cadangan).
    this.setView("falcon", { skipGuide: true });
    this.startFalconLiveMode(this.falconRole || "sales");
  }

  cancelFalconLivePick() {
    if (this.falconMode === "picking") {
      this.falconMode = "tutorial";
    }
    if (this.falconRoleGate) this.falconRoleGate.hidden = true;
    this.renderFalconChrome();
  }

  startFalconLiveMode(role) {
    const next = role === "management" ? "management" : "sales";
    this.falconMode = "live";
    this.falconLiveBusy = false;
    this.falconRole = next;
    if (next === "management") this.falconSalesDone = true;
    this.falconMessages = [];
    this.falconFocus = null;
    // Soft reset of client quota display; server remains source of truth per session_id.
    this.falconLiveQuota = {
      sessionUsed: 0,
      sessionLimit: 30,
      sessionRemaining: 30,
      dayUsed: 0,
      dayLimit: 800,
      dayRemaining: 800,
    };
    if (this.falconRoleGate) this.falconRoleGate.hidden = true;
    this.closeGuide();

    this.renderFalconChrome();
    this.renderFalconTutorial();
    this.renderFalconQuickPrompts();

    const label = next === "sales" ? "Sales Agent" : "Management Agent";
    this.pushFalconSystem(`Mode live · ${label} · knowledge Motovax · max 30 chat/sesi`);
    this.pushFalconBot(
      `Halo! Saya Falcon (live) untuk ${label}.\n\nTanya apa saja tentang stok, unit, atau insight inventory — saya jawab dengan data Motovax, bukan skrip demo.\n\nContoh: “Ada Serena ready berapa unit?” atau “Rekomendasi MPV di bawah 350 juta”.\n\nBatas uji: 30 pesan per sesi browser / 800 per hari (seluruh pengunjung demo).`,
    );
    this.renderFalconMessages();
    this.falconInput?.focus();
  }

  exitFalconLiveMode() {
    this.falconMode = "tutorial";
    this.falconLiveBusy = false;
    if (this.falconRoleGate) this.falconRoleGate.hidden = true;
    this.setFalconRole(this.falconRole, { greet: true, reset: true });
  }

  applyFalconLiveQuota(body = {}) {
    const q = this.falconLiveQuota || {};
    const num = (v, fallback) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    };
    this.falconLiveQuota = {
      sessionUsed: num(body.session_used ?? body.SessionUsed, q.sessionUsed ?? 0),
      sessionLimit: num(body.session_limit ?? body.SessionLimit, q.sessionLimit ?? 30),
      sessionRemaining: num(
        body.session_remaining ?? body.SessionRemaining,
        q.sessionRemaining ?? 30,
      ),
      dayUsed: num(body.day_used ?? body.DayUsed, q.dayUsed ?? 0),
      dayLimit: num(body.day_limit ?? body.DayLimit, q.dayLimit ?? 800),
      dayRemaining: num(body.day_remaining ?? body.DayRemaining, q.dayRemaining ?? 800),
    };
  }

  setFalconRole(role, options = {}) {
    const next = role === "management" ? "management" : "sales";
    this.falconRole = next;
    if (next === "management") this.falconSalesDone = true;

    if (options.reset) {
      this.falconMessages = [];
      this.falconFocus = null;
    }

    // Role switch during live stays live; guide tutorial forces template mode.
    if (options.fromGuide || this.falconMode !== "live") {
      if (options.fromGuide) this.falconMode = "tutorial";
    }

    this.renderFalconChrome();
    this.renderFalconTutorial();
    this.renderFalconQuickPrompts();

    if (options.greet) {
      if (this.falconMode === "live") {
        const label = next === "sales" ? "Sales Agent" : "Management Agent";
        this.pushFalconSystem(`Mode live · ${label}`);
        this.pushFalconBot(
          `Siap — sekarang saya Falcon live sebagai ${label}. Silakan tanya dengan data stok Motovax.`,
        );
      } else if (next === "sales") {
        this.pushFalconBot(
          "Halo! Saya Falcon untuk Sales Agent.\n\nSaya bisa bantu: cek stok/unit, foto, simulasi kredit, lokasi showroom, catat lead, handoff admin, generate konten, dan performa sales Anda.\n\nPilih “Coba langsung” di kiri atau ketik pesan sendiri. Pesan Anda otomatis dijawab Falcon AI real.",
        );
      } else {
        this.pushFalconSystem("Mode berganti ke Management Agent.");
        this.pushFalconBot(
          "Halo! Saya Falcon untuk Management Agent.\n\nSaya bisa semua fitur Sales + laporan stok/cabang/aging, GP/margin, import Excel, edit unit, dokumen, analisis inventory, dan analytics tren.\n\nPilih “Coba langsung” di kiri atau ketik pesan sendiri. Pesan Anda otomatis dijawab Falcon AI real.",
        );
      }
    }

    this.renderFalconMessages();
  }

  renderFalconChrome() {
    const isSales = this.falconRole === "sales";
    const isLive = this.falconMode === "live";
    if (this.falconContact) {
      this.falconContact.textContent = isSales ? "Sales Agent" : "Management Agent";
    }
    if (this.falconAvatar) {
      this.falconAvatar.textContent = isSales ? "SA" : "MA";
      this.falconAvatar.classList.toggle("is-management", !isSales);
    }
    if (this.falconRoleLabel) {
      this.falconRoleLabel.textContent = isSales ? "Sales Agent" : "Management Agent";
    }
    if (this.falconModeLabel) {
      this.falconModeLabel.textContent = isLive ? "MODE LIVE · FALCON AI" : "PANDUAN TEMPLATE";
    }
    if (this.falconStatus) {
      if (isLive) {
        const q = this.falconLiveQuota || {};
        const used = Number(q.sessionUsed) || 0;
        const limit = Number(q.sessionLimit) || 30;
        const rem = Number.isFinite(Number(q.sessionRemaining))
          ? Number(q.sessionRemaining)
          : Math.max(0, limit - used);
        this.falconStatus.textContent =
          rem <= 0
            ? `live · batas sesi ${used}/${limit}`
            : `live · sisa ${rem}/${limit} chat`;
        this.falconStatus.title =
          rem <= 0
            ? "Batas chat live sesi ini tercapai. Reset demo atau coba lagi besok."
            : `Kuota chat live: ${used} terpakai dari ${limit} per sesi (hari ini bersama pengunjung lain: ${Number(q.dayUsed) || 0}/${Number(q.dayLimit) || 800}).`;
      } else {
        this.falconStatus.textContent = "online · Falcon AI";
        this.falconStatus.title = "";
      }
    }
    if (this.falconRoleHint) {
      if (isLive) {
        const q = this.falconLiveQuota || {};
        const rem = Number.isFinite(Number(q.sessionRemaining))
          ? Number(q.sessionRemaining)
          : 30;
        this.falconRoleHint.textContent = isSales
          ? `Chat real: Falcon AI menjawab sebagai Sales Agent dengan stok Motovax. Sisa kuota sesi: ${rem} pesan.`
          : `Chat real: Falcon AI sebagai Management Agent + knowledge inventory. Sisa kuota sesi: ${rem} pesan.`;
      } else {
        this.falconRoleHint.textContent = isSales
          ? "Panduan Sales aktif. Ketik atau pilih prompt untuk langsung memakai Falcon AI real."
          : "Panduan Management aktif. Ketik atau pilih prompt untuk langsung memakai Falcon AI real.";
      }
    }
    const badge = this.root.querySelector("[data-falcon-role-badge]");
    badge?.classList.toggle("is-management", !isSales);
    badge?.classList.toggle("is-live", isLive);

    // Sync left-rail role cards
    for (const card of this.root.querySelectorAll("[data-falcon-set-role]")) {
      const active = (card.dataset.falconSetRole || "sales") === this.falconRole;
      card.classList.toggle("is-selected", active);
      card.setAttribute("aria-selected", active ? "true" : "false");
    }
    if (this.falconLiveCta) this.falconLiveCta.hidden = true;
    if (this.falconTutorialList) {
      this.falconTutorialList.hidden = isLive;
    }

    const composer = this.root.querySelector(".wa-composer");
    composer?.classList.toggle("is-live-busy", Boolean(this.falconLiveBusy));
  }

  salesTutorialItems() {
    // Capability Falcon role Salesperson (motovax-app IAM): unit_query, finance_simulation,
    // image_generation, photo_send, lead_own, handoff, analytics:sales_performance (terbatas).
    // Tidak termasuk: analytics_query/laporan management, excel_import, unit_edit, document_*.
    return [
      { id: "unit", label: "Cek stok & detail unit" },
      { id: "photo", label: "Minta foto unit" },
      { id: "upload", label: "Upload foto update stok" },
      { id: "finance", label: "Simulasi kredit & asuransi" },
      { id: "map", label: "Lokasi showroom / map" },
      { id: "lead", label: "Catat lead customer" },
      { id: "handoff", label: "Handoff customer ke admin" },
      { id: "content", label: "Generate konten / caption" },
      { id: "performance", label: "Performa sales sendiri" },
      { id: "features", label: "Ringkasan semua fitur Sales" },
    ];
  }

  managementTutorialItems() {
    // Management = fullTenantPermissions: semua Sales + laporan, import, edit, dokumen, analytics.
    return [
      { id: "report_branch", label: "Laporan stok per cabang" },
      { id: "report_aging", label: "Laporan aging unit" },
      { id: "gp", label: "Insight GP / margin" },
      { id: "import", label: "Import Excel inventory" },
      { id: "unit_edit", label: "Edit data / status unit" },
      { id: "document", label: "Upload / review dokumen" },
      { id: "analysis", label: "Analisis inventory & rekomendasi" },
      { id: "analytics", label: "Analytics / tren penjualan" },
      { id: "features", label: "Ringkasan semua fitur Management" },
    ];
  }

  renderFalconTutorial() {
    if (!this.falconTutorialList) return;
    const items =
      this.falconRole === "sales" ? this.salesTutorialItems() : this.managementTutorialItems();
    const doneMap = this.falconTutorialDone[this.falconRole] || {};
    this.falconTutorialList.innerHTML = items
      .map(
        (item) => `
        <li class="${doneMap[item.id] ? "is-done" : ""}">
          <span>${doneMap[item.id] ? "✓" : "○"}</span>
          <span>${item.label}</span>
        </li>
      `,
      )
      .join("");

    if (this.falconRole === "sales") {
      const required = this.salesTutorialItems().map((i) => i.id);
      const allDone = required.every((id) => doneMap[id]);
      if (allDone && !this.falconSalesDone) {
        this.falconSalesDone = true;
      }
    }
  }

  markFalconTutorial(id, role = this.falconRole) {
    const targetRole = role === "management" ? "management" : "sales";
    if (!this.falconTutorialDone[targetRole]) {
      this.falconTutorialDone[targetRole] = {};
    }
    this.falconTutorialDone[targetRole][id] = true;
    this.renderFalconTutorial();
  }

  renderFalconQuickPrompts() {
    if (!this.falconQuickPrompts) return;
    const salesLive = [
      "Ada unit Serena ready berapa?",
      "Rekomendasi MPV di bawah 350 juta",
      "Mau lihat foto Xenia",
      "Simulasi kredit Xpander DP 20% 48 bulan",
      "Unit ready cabang mana saja?",
    ];
    const managementLive = [
      "Ringkas stok ready vs booked",
      "Unit aging di atas 90 hari",
      "Tampilkan foto unit aging",
      "Cabang mana stoknya paling banyak?",
      "Rekomendasi unit yang perlu dipromosikan",
    ];
    const list = this.falconRole === "sales" ? salesLive : managementLive;
    this.falconQuickPrompts.innerHTML = list
      .map(
        (text) =>
          `<button type="button" data-falcon-prompt="${text.replace(/"/g, "&quot;")}">${text}</button>`,
      )
      .join("");
  }

  pushFalconBot(text, extra = {}) {
    this.falconMessages.push({ role: "bot", text, ...extra });
  }

  pushFalconUser(text, extra = {}) {
    this.falconMessages.push({ role: "user", text, ...extra });
  }

  pushFalconSystem(text) {
    this.falconMessages.push({ role: "system", text });
  }

  renderFalconPhotoGrid(photos, direction = "in") {
    if (!Array.isArray(photos) || !photos.length) return "";
    const cards = photos
      .map((p) => {
        const url = p.url || p.photoUrl || "";
        if (!url) return "";
        // Tanpa label sudut — hanya foto real unit (1 unit, beberapa frame).
        const safe = String(url).replace(/'/g, "%27").replace(/"/g, "&quot;");
        return `<div class="wa-photo-card has-photo is-plain" style="background-image:url('${safe}')" role="img" aria-label="Foto unit"></div>`;
      })
      .join("");
    return `<div class="wa-photo-grid wa-photo-grid-${direction}">${cards}</div>`;
  }

  renderFalconMessages() {
    if (!this.falconMessagesEl) return;
    this.falconMessagesEl.innerHTML = this.falconMessages
      .map((msg) => {
        if (msg.role === "system") {
          return `<div class="wa-system"><span>${this.escapeHtml(msg.text)}</span></div>`;
        }
        if (msg.role === "user") {
          const media = msg.photos?.length
            ? this.renderFalconPhotoGrid(msg.photos, "out")
            : msg.photo
              ? `<div class="wa-media-thumb" aria-hidden="true">📷 Foto stok</div>`
              : "";
          return `<div class="wa-bubble wa-out">${media}<p>${this.escapeHtml(msg.text)}</p></div>`;
        }
        const media = msg.photos?.length ? this.renderFalconPhotoGrid(msg.photos, "in") : "";
        const report = msg.reportHtml || "";
        const typingClass = msg.typing ? " is-typing" : "";
        return `<div class="wa-bubble wa-in${typingClass}">${media}${report}<p>${this.escapeHtml(msg.text)}</p></div>`;
      })
      .join("");
    this.falconMessagesEl.scrollTop = this.falconMessagesEl.scrollHeight;
  }

  escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  handleFalconSend() {
    const text = (this.falconInput?.value || "").trim();
    if (!text) return;
    if (this.falconLiveBusy) return;
    if (this.falconInput) this.falconInput.value = "";
    this.sendFalconUserMessage(text);
  }

  sendFalconUserMessage(text, options = {}) {
    const content = String(text || "").trim();
    if (!content) return;
    const roleAtSend = this.falconRole;

    // Interaksi user selalu memakai Falcon real; template hanya untuk langkah panduan otomatis.
    if (!options.fromGuide) {
      if (this.falconMode !== "live") this.startFalconLiveMode(this.falconRole);
      this.sendFalconLiveMessage(content);
      return;
    }

    this.pushFalconUser(content);
    this.renderFalconMessages();
    const reply = this.buildFalconReply(content);
    window.setTimeout(() => {
      if (reply.roleSwitch) {
        this.setFalconRole(reply.roleSwitch, { greet: true });
        return;
      }
      this.pushFalconBot(reply.text, {
        photos: reply.photos,
        reportHtml: reply.reportHtml,
      });
      if (reply.tutorialId) this.markFalconTutorial(reply.tutorialId, roleAtSend);
      this.renderFalconMessages();
    }, options.fromGuide ? 280 : 420);
  }

  normalizeFalconLivePhotos(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item, index) => {
        if (!item) return null;
        if (typeof item === "string") {
          return { url: item, slot: index };
        }
        const url = item.url || item.URL || item.photoUrl || "";
        if (!url) return null;
        return {
          url,
          slot: typeof item.index === "number" ? item.index : index,
          label: item.label || item.Label || "",
        };
      })
      .filter(Boolean);
  }

  async sendFalconLiveMessage(text) {
    if (this.falconLiveBusy) return;
    const content = String(text || "").trim();
    if (!content) return;

    const q = this.falconLiveQuota || {};
    if (Number(q.sessionRemaining) === 0) {
      this.pushFalconUser(content);
      this.pushFalconBot(
        `⚠️ Batas chat live sesi ini tercapai (${q.sessionUsed || 0}/${q.sessionLimit || 30}). Klik “Reset demo” atau coba lagi besok.`,
      );
      this.renderFalconMessages();
      this.renderFalconChrome();
      return;
    }

    this.falconLiveBusy = true;
    this.renderFalconChrome();
    this.pushFalconUser(content);
    this.pushFalconBot("Falcon mengetik…", { typing: true });
    this.renderFalconMessages();

    try {
      const response = await fetch(`${publicDemoData.baseUrl}/falcon-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          session_id: publicDemoData.sessionId,
          role: this.falconRole,
          message: content,
        }),
      });
      const body = await response.json().catch(() => ({}));
      // Drop typing placeholder
      this.falconMessages = this.falconMessages.filter((m) => !m.typing);
      if (!response.ok) {
        if (response.status === 429 || body.code === "resource_exhausted") {
          // Optimistically mark session as exhausted for UI (server is source of truth).
          this.falconLiveQuota = {
            ...this.falconLiveQuota,
            sessionRemaining: 0,
            sessionUsed:
              Number(this.falconLiveQuota?.sessionLimit) ||
              Number(this.falconLiveQuota?.sessionUsed) ||
              30,
          };
        } else if (
          body.session_used != null ||
          body.session_remaining != null ||
          body.SessionUsed != null
        ) {
          this.applyFalconLiveQuota(body);
        }
        const msg =
          body.message ||
          body.Message ||
          (response.status === 429
            ? "Batas chat live tercapai. Coba lagi nanti atau reset demo."
            : "Falcon live belum dapat merespons. Coba lagi sebentar.");
        this.pushFalconBot(`⚠️ ${msg}`);
        this.renderFalconMessages();
        return;
      }
      this.applyFalconLiveQuota(body);
      const reply = String(body.reply || body.Reply || "").trim();
      const photos = this.normalizeFalconLivePhotos(body.photos || body.Photos || []);
      this.pushFalconBot(
        reply ||
          "Falcon tidak mengembalikan teks. Coba tanyakan ulang dengan detail unit/cabang.",
        photos.length ? { photos } : {},
      );
      this.renderFalconMessages();
    } catch (error) {
      this.falconMessages = this.falconMessages.filter((m) => !m.typing);
      this.pushFalconBot(
        `⚠️ Gagal menghubungi Falcon live (${error?.message || "jaringan"}). Pastikan koneksi stabil lalu coba lagi.`,
      );
      this.renderFalconMessages();
    } finally {
      this.falconLiveBusy = false;
      this.renderFalconChrome();
    }
  }

  resolveDemoUnitId(unit) {
    if (!unit) return "";
    if (unit.id && /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(String(unit.id))) return unit.id;
    const map = {
      serena: "1ba7674e-246d-4bdb-9902-f516cc59ba0e",
      ertiga: "5d746149-b8dc-4b27-997f-04b704fd2037",
      rush: "940611f0-9983-4e17-98a8-74de5917cef4",
      "br-v": "e2aecacc-a138-430f-ae5d-e61bd12022fd",
      brv: "e2aecacc-a138-430f-ae5d-e61bd12022fd",
      xpander: "c15ff159-af47-4f18-8335-ce43770c99c5",
      zenix: "29c03bc8-fa74-4d49-8dd0-bd714b4bae2d",
      innova: "29c03bc8-fa74-4d49-8dd0-bd714b4bae2d",
    };
    const hay = `${unit.brand || ""} ${unit.type || ""}`.toLocaleLowerCase("id");
    for (const [key, id] of Object.entries(map)) {
      if (hay.includes(key)) return id;
    }
    return "";
  }

  unitPhotoUrl(unit, slot = 0) {
    if (!unit) return "";
    const id = this.resolveDemoUnitId(unit);
    if (!id) return unit.photoUrl || "";
    const index = Math.max(0, Number(slot) || 0);
    // Cache-bust per slot so the browser shows distinct frames after seed.
    return `https://mobix.motovax.com/api/public/demo/motovax-ai/units/${id}/cover?i=${index}`;
  }

  /** Pick a single focus unit for Falcon photo flows (story unit → Serena by default). */
  pickFocusUnit(text = "") {
    if (this.falconFocus?.unit) {
      // Keep the same unit across tanya → minta foto → update in one demo session.
      const live =
        this.units.find((u) => u.id === this.falconFocus.unit.id) || this.falconFocus.unit;
      this.falconFocus.unit = live;
      return live;
    }

    // Prefer explicit match from the user message; otherwise the story unit (Serena).
    const matched = this.pickUnitsForChat(text, 4);
    const story = this.falconStoryUnit();
    let unit = null;
    if (matched.length && String(text || "").trim()) {
      // If the user named a model, use the best match; else fall back to story unit.
      const q = String(text).toLocaleLowerCase("id");
      const named = matched.find((u) => {
        const hay = `${u.brand} ${u.type}`.toLocaleLowerCase("id");
        return hay.split(/\s+/).some((tok) => tok.length > 3 && q.includes(tok));
      });
      unit = named || matched[0];
    }
    if (!unit) unit = story || matched[0] || this.units[0] || inventoryDemoSeed[0];

    if (unit) {
      this.falconFocus = { unit, gallery: [] };
      this.ensureFocusGalleryBase();
    }
    return unit;
  }

  ensureFocusGalleryBase() {
    if (!this.falconFocus?.unit) return;
    const unit = this.falconFocus.unit;
    if (this.falconFocus.gallery.length >= 3) return;
    // 3 foto berbeda dari unit yang sama — tanpa label sudut.
    this.falconFocus.gallery = [0, 1, 2].map((slot) => ({
      slot,
      url: this.unitPhotoUrl(unit, slot),
      unitId: unit.id,
      plate: unit.plate,
    }));
    const live = this.units.find((u) => u.id === unit.id);
    if (live && (!live.photos || live.photos < 3)) {
      live.photos = 3;
      live.photoUrl = this.unitPhotoUrl(live, 0);
    }
    if (!unit.photos || unit.photos < 3) {
      unit.photos = 3;
      unit.photoUrl = this.unitPhotoUrl(unit, 0);
    }
  }

  focusGalleryCards(slots) {
    if (!this.falconFocus?.unit) return [];
    const unit = this.falconFocus.unit;
    return slots.map((slot) => {
      const existing = this.falconFocus.gallery.find((g) => g.slot === slot);
      if (existing) return { ...existing, unitId: unit.id, plate: unit.plate };
      return {
        slot,
        url: this.unitPhotoUrl(unit, slot),
        unitId: unit.id,
        plate: unit.plate,
      };
    });
  }

  simulateFalconPhotoUpload(options = {}) {
    const roleAtUpload = this.falconRole;
    const unit = this.pickFocusUnit("");
    if (!unit) {
      this.pushFalconUser("📷 [Foto unit dari galeri]", { photo: true });
      this.renderFalconMessages();
      return;
    }
    this.ensureFocusGalleryBase();

    // Baseline 3 foto → upload +2 foto berbeda unit yang sama → total 5.
    const beforeCount = Math.max(this.falconFocus.gallery.length, Number(unit.photos) || 0, 3);
    const newSlots = [beforeCount, beforeCount + 1];
    const newPhotos = newSlots.map((slot) => {
      const card = {
        slot,
        url: this.unitPhotoUrl(unit, slot),
        unitId: unit.id,
        plate: unit.plate,
      };
      this.falconFocus.gallery.push(card);
      return card;
    });

    const userText =
      `Tolong update unit ${unit.brand} ${unit.type} dengan nopol ${unit.plate || "—"}.\n` +
      `Saya kirim 2 foto tambahan ya.`;
    this.pushFalconUser(userText, { photo: true, photos: newPhotos });
    this.renderFalconMessages();

    window.setTimeout(() => {
      const afterCount = this.falconFocus.gallery.length; // 5
      const live = this.units.find((item) => item.id === unit.id) || unit;
      live.photos = afterCount;
      live.photoUrl = this.unitPhotoUrl(live, 0);
      const idx = this.units.findIndex((item) => item.id === unit.id);
      if (idx >= 0) {
        this.units[idx].photos = afterCount;
        this.units[idx].photoUrl = live.photoUrl;
      }
      unit.photos = afterCount;
      this.render();

      this.pushFalconBot(
        `Siap ✅ Foto untuk ${unit.brand} ${unit.type} (nopol ${unit.plate || "—"}) sudah saya tautkan.\n\n` +
          `Galeri unit ini: ${beforeCount} foto → +${newPhotos.length} baru → sekarang ${afterCount} foto berbeda.\n\n` +
          `Kalau mau, bilang saja untuk simulasi kredit atau jadwal survey.`,
        { photos: this.falconFocus.gallery.slice() },
      );
      this.markFalconTutorial(roleAtUpload === "sales" ? "upload" : "import", roleAtUpload);
      this.renderFalconMessages();
    }, options.fromGuide ? 280 : 400);
  }

  buildFalconReply(raw) {
    const text = raw.toLocaleLowerCase("id");
    const isSales = this.falconRole === "sales";

    // 1) Ringkasan fitur HARUS diproses dulu — jangan tertangkap matcher "sales agent" / role-switch.
    if (
      /fitur|kemampuan|bisa (apa|bantu)|apa saja yang bisa|tampilkan semua fitur|daftar fitur|tutorial fitur/.test(
        text,
      )
    ) {
      if (isSales) {
        if (/management/.test(text) && !/sales/.test(text)) {
          return {
            text: "Daftar fitur Management hanya di mode Management Agent. Ketik “Ganti ke Management Agent” setelah menyelesaikan tutorial Sales, atau coba “tampilkan semua fitur sales” untuk capability role ini.",
          };
        }
        return { tutorialId: "features", text: this.salesFeaturesText() };
      }
      if (/sales/.test(text) && !/management/.test(text)) {
        return {
          text: `Anda di mode Management. Ringkas fitur Sales:\n${this.salesFeaturesText()}\n\nKetik “Kembali ke Sales Agent” untuk demo role Sales, atau “tampilkan semua fitur management” untuk capability penuh Management.`,
        };
      }
      return { tutorialId: "features", text: this.managementFeaturesText() };
    }

    // 2) Ganti role — hanya intent eksplisit (ganti/mode/kembali), bukan frasa "fitur sales agent".
    if (
      /ganti.*management|mode management|jadi management|ke management agent|management agent$/.test(
        text,
      ) ||
      (text.includes("management agent") && /ganti|mode|jadi|switch|ke /.test(text))
    ) {
      if (isSales) return { roleSwitch: "management" };
      return { text: "Anda sudah di mode Management Agent. Coba “tampilkan semua fitur management” atau laporan stok/aging." };
    }
    if (
      /ganti.*sales|kembali.*sales|mode sales|jadi sales|ke sales agent|sales agent$/.test(text) ||
      (text.includes("sales agent") && /ganti|mode|jadi|switch|kembali|ke /.test(text))
    ) {
      if (!isSales) return { roleSwitch: "sales" };
      return { text: "Anda sudah di mode Sales Agent. Coba “tampilkan semua fitur sales” atau tanya unit." };
    }

    // 3) Performa sales sendiri (boleh Sales) vs laporan/analytics management (diblok Sales).
    if (/performa sales|performa saya|kinerja sales|sales performance saya/.test(text)) {
      if (isSales) {
        return {
          tutorialId: "performance",
          text: "Performa sales Anda (demo, analytics:sales_performance terbatas):\n• Lead dicatat minggu ini: 12\n• Follow-up aktif: 5\n• Closing: 2 unit\n• Unit paling sering ditanya: Innova, Xpander\n\nIni metrik milik sales sendiri — bukan laporan aging/GP/tren cabang (itu Management).",
        };
      }
      return {
        tutorialId: "analytics",
        text: "Performa sales (demo Management):\n• Tim: 8 agent aktif\n• Lead total minggu ini: 96\n• Closing rate demo: ~18%\n• Top agent: Rina (5 closing)\n\nDi production data dari analytics:sales_performance + analytics:management.",
      };
    }

    if (
      /laporan|aging|gross profit|margin|gp |analitik|analytics|tren penjualan|insight|rekomendasi stok|analisis inventory|analisis inventori/.test(
        text,
      )
    ) {
      if (isSales) {
        return {
          text: "Maaf, laporan management (aging internal, GP, margin, tren agregat, analisis inventory) tidak tersedia di role Sales Agent.\n\nYang boleh Sales: cek unit, foto, simulasi kredit, lead, handoff, performa sendiri.\n\nKetik “Ganti ke Management Agent” untuk demo laporan, atau “tampilkan semua fitur sales” untuk capability lengkap role ini.",
        };
      }
      return this.buildManagementReport(text);
    }

    // 4) Lokasi / map
    if (/lokasi|showroom|peta|map|alamat cabang|jam buka/.test(text)) {
      return {
        tutorialId: isSales ? "map" : undefined,
        text: "Lokasi showroom (demo):\n• Cinere — Jl. Cinere Raya No. 12 · [MAP: Showroom Cinere | -6.333, 106.783]\n• Pondok Bambu — Jl. Pahlawan Revolusi · [MAP: Showroom PDB | -6.241, 106.901]\n\nDi Motovax, Falcon mengirim token map & jam operasional cabang tenant.",
      };
    }

    // 5) Lead capture
    if (/catat lead|daftar lead|lead baru|customer baru|simpan lead|lapor lead/.test(text)) {
      const nameMatch = raw.match(/(?:lead|customer)\s+([A-Za-zÀ-ÿ.]+)/i);
      const name = nameMatch?.[1] || "Budi";
      return {
        tutorialId: isSales ? "lead" : undefined,
        text: `Lead dicatat (simulasi lead_own) ✅\n• Nama: ${name}\n• HP: 08123456789\n• Minat: Innova / unit demo\n• Assign: ke akun Sales yang chat\n\nDi production Falcon memanggil lead_update_admin; Sales hanya mengelola lead miliknya. Lanjut handoff? Ketik “Hubungkan customer ke admin”.`,
      };
    }

    // 6) Handoff
    if (/handoff|hubungkan.*admin|sambungkan.*admin|hubungi admin|daftar admin|pic agent/.test(text)) {
      return {
        tutorialId: isSales ? "handoff" : undefined,
        text: "Handoff ke admin (demo whatsapp:handoff):\n1. Anggun — Admin · wa.me/628111000001\n2. Rudi — PIC Agent Officer · wa.me/628111000002\n\nPilih nomor/nama admin. Di production Falcon menampilkan daftar PIC lalu memproses handoff tanpa konfirmasi ulang setelah dipilih.",
      };
    }

    // 7) Generate konten / image
    if (/caption|konten|promo|image generation|generate (gambar|image|konten)|buat (caption|konten|copy)/.test(text)) {
      const unit = this.pickUnitsForChat(text, 1)[0];
      const label = unit ? `${unit.brand} ${unit.type} ${unit.year}` : "unit Ready pilihan";
      return {
        tutorialId: isSales ? "content" : undefined,
        text: `Konten promo (demo image_generation) untuk ${label}:\n\n“🔥 Ready stok ${label}! Kilometer rapi, full original, siap survey. DP ringan & proses kredit dibantu sampai approved. Chat sekarang — slot unit terbatas.”\n\nDi Motovax, Falcon bisa bantu draft caption + generate visual sesuai unit tenant.`,
      };
    }

    // 8) Foto — 1 unit, 3 foto berbeda (tanpa label sudut)
    if (/minta foto|kirim foto|foto unit|lihat foto|fotonya/.test(text)) {
      const unit = this.pickFocusUnit(raw);
      if (!unit) {
        return { text: "Unit-nya yang mana dulu, Kak? Misalnya sebut Serena atau nopol-nya." };
      }
      this.ensureFocusGalleryBase();
      const photos = this.focusGalleryCards([0, 1, 2]);
      return {
        tutorialId: isSales ? "photo" : undefined,
        photos,
        text:
          `Siap, Kak. Ini beberapa foto ${unit.brand} ${unit.type} (nopol ${unit.plate || "—"}) ` +
          `— ${this.statusLabel(unit.status)} di ${this.titleCase(unit.branch || "cabang demo")}.\n\n` +
          `Saya kirim 3 foto unit ini. Kalau ada foto tambahan, kirim lewat lampiran 📎 biar saya update galeri stoknya.`,
      };
    }

    // 9) Simulasi kredit
    if (/simulasi|kredit|cicilan|dp |angsuran|asuransi/.test(text)) {
      const unit = this.pickUnitsForChat(text, 1)[0];
      const price = unit?.cashPrice || unit?.cash_price || 250000000;
      const dp = Math.round(price * 0.2);
      const angsuran = Math.round((price - dp) / 48);
      return {
        tutorialId: isSales ? "finance" : undefined,
        text: unit
          ? `Simulasi kredit (demo finance_simulation) ${unit.brand} ${unit.type}:\n• OTR ~ ${this.formatPrice(price)}\n• DP 20% ~ ${this.formatPrice(dp)}\n• Tenor 48 bln → angsuran ~ ${this.formatPrice(angsuran)}/bln\n• Asuransi: bisa dihitung ADDM/ADDB di production\n\nRumus penuh mengikuti KKB tenant Motovax.`
          : "Simulasi kredit aktif. Sebut unit-nya (contoh Innova / Xpander) agar saya hitung DP & angsuran demo.",
      };
    }

    // 10) Edit unit (Management)
    if (/ubah status|edit unit|update unit|jadi booked|jadi ready|unit_edit|ganti harga jual/.test(text)) {
      if (isSales) {
        return {
          text: "Edit unit penuh (whatsapp:unit_edit) hanya untuk Management/Admin. Sales Agent boleh cek stok & minta foto, tapi tidak mengubah status/harga master unit. Ketik “Ganti ke Management Agent” untuk demo edit.",
        };
      }
      const unit = this.pickUnitsForChat(text, 1)[0];
      const label = unit ? `${unit.brand} ${unit.type}` : "unit demo";
      return {
        tutorialId: "unit_edit",
        text: `Edit unit (simulasi unit_edit) ✅\n• Unit: ${label}\n• Status → BOOKED (demo)\n• Catatan: “Di-hold untuk customer survey”\n\nDi production Falcon memvalidasi permission whatsapp:unit_edit sebelum menulis ke inventory.`,
      };
    }

    // 11) Dokumen (Management)
    if (/dokumen|document|stnk|bpkb|upload dokumen|review dokumen/.test(text)) {
      if (isSales) {
        return {
          text: "Upload/review dokumen unit (document_upload / document_review) adalah capability Management. Sales Agent tidak memproses unggahan dokumen legal lewat Falcon. Ganti ke Management Agent untuk demo.",
        };
      }
      return {
        tutorialId: "document",
        text: "Dokumen (simulasi Management) ✅\n• Jenis: STNK + BPKB (mock)\n• Status review: lengkap · 2 file\n• Unit tertaut: inventaris demo\n\nDi production Falcon memandu upload via WA lalu menandai review sesuai permission.",
      };
    }

    // 12) Import
    if (/import|upload data|excel|handover|mrp/.test(text)) {
      if (isSales) {
        return {
          text: "Import Excel inventory / handover / MRP (whatsapp:excel_import) adalah capability Management/Admin. Role Sales Agent tidak memproses import massal lewat Falcon. Ganti ke Management Agent untuk mencoba alur simulasi.",
        };
      }
      return {
        tutorialId: "import",
        text: "Import (simulasi Management / excel_import):\n• File: inventory_demo.xlsx\n• Baris diproses: 48\n• Unit diupdate: 45\n• Warning: 3 baris perlu cek plate\n\nDi production Falcon memvalidasi baris & warning seperti di Upload Data SMI.",
      };
    }

    // 13) Unit query / stok — satu unit fokus biar alur foto nyambung
    if (
      /unit|stok|tanya|halo|ready|innova|xpander|rush|hr-v|mobilio|serena|toyota|honda|mitsubishi|nissan|daihatsu|bmw|mazda/.test(
        text,
      )
    ) {
      const unit = this.pickFocusUnit(raw);
      if (!unit) {
        return {
          text: "Stok demo belum termuat. Coba buka Manajemen Unit dulu atau Reset demo.",
        };
      }
      const price = this.formatCompactPrice(unit.cashPrice || unit.cash_price || 0);
      const km =
        typeof unit.odometer === "number"
          ? `${unit.odometer.toLocaleString("id-ID")} KM`
          : "—";
      return {
        tutorialId: isSales ? "unit" : undefined,
        text:
          `Boleh, Kak. ${unit.brand} ${unit.type} ${unit.year || ""} masih ${this.statusLabel(unit.status)}.\n\n` +
          `• Nopol: ${unit.plate || "—"}\n` +
          `• Warna: ${unit.color || "—"}\n` +
          `• Odometer: ${km}\n` +
          `• Cabang: ${this.titleCase(unit.branch || "-")} · ${unit.position || "Showroom"}\n` +
          `• OTR: ${price}\n\n` +
          `Mau saya kirim fotonya, hitung simulasi kredit, atau langsung catat lead?`,
      };
    }

    return {
      text: isSales
        ? "Saya Falcon (Sales Agent). Coba chip fitur di kiri, “tampilkan semua fitur sales”, tanya unit, minta foto, simulasi kredit, catat lead, handoff, atau “Ganti ke Management Agent”."
        : "Saya Falcon (Management Agent). Coba “tampilkan semua fitur management”, laporan stok/aging, GP, import, edit unit, dokumen, atau “Kembali ke Sales Agent”.",
    };
  }

  salesFeaturesText() {
    return (
      "📦 Fitur Falcon — Sales Agent (dari Motovax / role Salesperson)\n\n" +
      "Yang BISA dilakukan:\n" +
      "1. Cek stok & detail unit — whatsapp:unit_query\n" +
      "   Coba: “Halo, mau tanya Nissan Serena HWS AT dong, masih ready?”\n" +
      "2. Minta foto unit — whatsapp:photo_send\n" +
      "   Coba: “Boleh minta fotonya?” (beberapa foto unit yang sama)\n" +
      "3. Upload foto update stok (via lampiran WA)\n" +
      "   Coba: tekan 📎 — +2 foto unit yang sama + nopol\n" +
      "4. Simulasi kredit & asuransi — whatsapp:finance_simulation\n" +
      "   Coba: “Simulasi kredit Serena DP 20% tenor 48 bulan”\n" +
      "5. Lokasi showroom / map\n" +
      "   Coba: “Lokasi showroom”\n" +
      "6. Catat lead milik sendiri — whatsapp:lead_own\n" +
      "   Coba: “Catat lead Budi 0812… minat Serena”\n" +
      "7. Handoff customer ke admin — whatsapp:handoff\n" +
      "   Coba: “Hubungkan customer ke admin”\n" +
      "8. Generate konten / caption — whatsapp:image_generation\n" +
      "   Coba: “Buat caption promo Serena”\n" +
      "9. Performa sales sendiri — analytics:sales_performance\n" +
      "   Coba: “Performa sales saya”\n\n" +
      "Centang checklist di kiri sambil mencoba tiap fitur. Data demo, bukan production."
    );
  }

  managementFeaturesText() {
    return (
      "📊 Fitur Falcon — Management Agent (dari Motovax / role Management)\n\n" +
      "Termasuk semua kemampuan Sales, plus:\n" +
      "1. Laporan stok per cabang — inventory analysis\n" +
      "   Coba: “Laporan stok per cabang”\n" +
      "2. Laporan aging unit\n" +
      "   Coba: “Laporan aging unit”\n" +
      "3. Insight GP / margin (tanpa guardrail harga internal)\n" +
      "   Coba: “Gross profit margin unit”\n" +
      "4. Import Excel inventory / handover / MRP — whatsapp:excel_import\n" +
      "   Coba: “Import inventory lewat WA”\n" +
      "5. Edit data & status unit — whatsapp:unit_edit\n" +
      "   Coba: “Ubah status unit jadi Booked”\n" +
      "6. Upload & review dokumen — document_upload / document_review\n" +
      "   Coba: “Upload dokumen unit”\n" +
      "7. Analisis inventory & rekomendasi stok\n" +
      "   Coba: “Analisis inventory dan rekomendasi stok”\n" +
      "8. Analytics / tren penjualan — whatsapp:analytics_query, analytics:*\n" +
      "   Coba: “Tren penjualan bulan ini”\n" +
      "9. Media upload & operasional inventory seperti admin\n" +
      "10. Konfigurasi user/role/tenant (sesuai permission penuh)\n\n" +
      "Centang checklist di kiri untuk menyelesaikan tutorial Management. Data mock demo."
    );
  }

  buildManagementReport(text) {
    const rows = this.getBranchSummaries();
    if (/aging/.test(text)) {
      const aged = [...(this.units.length ? this.units : inventoryDemoSeed)]
        .sort((a, b) => (b.aging || 0) - (a.aging || 0))
        .slice(0, 4);
      const lines = aged.map(
        (u) =>
          `• ${u.brand} ${u.type} — ${u.aging || 0} hari · ${this.titleCase(u.branch || "-")}`,
      );
      return {
        tutorialId: "report_aging",
        text: `Laporan aging (demo):\n${lines.join("\n")}\n\nRekomendasi: unit >60 hari diprioritaskan promo / penyesuaian harga. Data mock real-like, bukan production.`,
      };
    }
    if (/gross|margin|gp|profit/.test(text)) {
      return {
        tutorialId: "gp",
        text: "Insight GP/margin (demo Management):\n• Rata-rata GP prediksi demo ~8–12% unit Ready Cinere & Pondok Bambu\n• Unit aging tinggi: margin ditekan — pertimbangkan promo\n\nSales Agent tidak boleh melihat angka ini. Angka di sini ilustratif untuk tutorial.",
      };
    }
    if (/analisis|rekomendasi stok|inventory analysis/.test(text)) {
      return {
        tutorialId: "analysis",
        text: "Analisis inventory (demo Management):\n• Ready tinggi di Cinere — dorong campaign lokal\n• Pondok Bambu: 3 unit aging >90 hari → prioritas diskon/PD form\n• Rasio foto lengkap: ~70% — lengkapi galeri agar Falcon photo_send optimal\n\nRekomendasi: fokus promo MPV Ready + lengkapi foto unit tanpa media.",
      };
    }
    if (/tren|analitik|analytics|penjualan|conversion|performa tim/.test(text)) {
      return {
        tutorialId: "analytics",
        text: "Analytics / tren penjualan (demo):\n• Lead masuk 30 hari: 420 (+12% MoM)\n• Closing: 38 unit · conversion ~9%\n• Channel terkuat: WhatsApp & Walk-in\n• Unit terlaris: Innova, Xpander, HR-V\n\nSumber production: whatsapp:analytics_query + analytics:management / sales_trend.",
      };
    }
    const lines = rows.length
      ? rows.map(
          (r) =>
            `• ${this.titleCase(r.branch)}: Ready ${r.ready}, Booked ${r.booked}, Sold ${r.sold}, total ${r.total}`,
        )
      : ["• Belum ada ringkasan cabang — muat data inventory dulu."];
    return {
      tutorialId: "report_branch",
      reportHtml: `<div class="wa-report">${rows
        .slice(0, 4)
        .map(
          (r) =>
            `<div><b>${this.escapeHtml(this.titleCase(r.branch))}</b><span>R ${r.ready} · B ${r.booked}</span></div>`,
        )
        .join("")}</div>`,
      text: `Laporan stok per cabang (demo):\n${lines.join("\n")}\n\nIni capability Management (inventory analysis). Ketik “laporan aging” atau “tren penjualan” untuk insight lain.`,
    };
  }

  pickUnitsForChat(text, limit = 3) {
    const source = this.units.length ? this.units : inventoryDemoSeed;
    const q = String(text || "").toLocaleLowerCase("id");
    const scored = source.map((unit) => {
      const hay = `${unit.brand} ${unit.type} ${unit.plate || ""}`.toLocaleLowerCase("id");
      let score = 0;
      for (const token of hay.split(/\s+/)) {
        if (token.length > 2 && q.includes(token)) score += 2;
      }
      if (String(unit.status).toUpperCase().includes("READY")) score += 0.5;
      return { unit, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const matched = scored.filter((s) => s.score >= 2).map((s) => s.unit);
    if (matched.length) return matched.slice(0, limit);
    return source.slice(0, limit);
  }

  getBranchSummaries() {
    const map = new Map();
    for (const unit of this.units) {
      const key = (unit.branch || "Lainnya").toLocaleUpperCase("id");
      if (!map.has(key)) {
        map.set(key, {
          branch: key,
          ready: 0,
          booked: 0,
          sold: 0,
          total: 0,
          withPhotos: 0,
          withoutPhotos: 0,
        });
      }
      const row = map.get(key);
      row.total += 1;
      if (unit.status === "UNIT READY") row.ready += 1;
      if (unit.status === "BOOKED") row.booked += 1;
      if (unit.status === "SOLD") row.sold += 1;
      if ((unit.photos || 0) > 0) row.withPhotos += 1;
      else if (unit.status !== "SOLD") row.withoutPhotos += 1;
    }
    return [...map.values()].sort((a, b) => a.branch.localeCompare(b.branch, "id"));
  }

  renderBranchSummary() {
    if (!this.branchTotals || !this.branchGrid) return;
    const rows = this.getBranchSummaries();
    const totals = rows.reduce(
      (acc, row) => {
        acc.stock += row.ready + row.booked;
        acc.ready += row.ready;
        acc.booked += row.booked;
        acc.withPhotos += row.withPhotos;
        acc.withoutPhotos += row.withoutPhotos;
        return acc;
      },
      { stock: 0, ready: 0, booked: 0, withPhotos: 0, withoutPhotos: 0 },
    );

    this.branchTotals.innerHTML = `
      <button type="button" data-ims-branch-filter="ALL" data-ims-status-filter="ALL">
        <small>Stok Cabang</small><b>${totals.stock}</b>
      </button>
      <button type="button" data-ims-branch-filter="ALL" data-ims-status-filter="UNIT READY">
        <small>Ready</small><b>${totals.ready}</b>
      </button>
      <button type="button" data-ims-branch-filter="ALL" data-ims-status-filter="BOOKED">
        <small>Booked</small><b>${totals.booked}</b>
      </button>
      <button type="button" class="sky" data-ims-branch-filter="ALL" data-ims-status-filter="ALL">
        <small>Ada Foto</small><b>${totals.withPhotos}</b>
      </button>
      <button type="button" class="rose" data-ims-branch-filter="ALL" data-ims-status-filter="ALL">
        <small>Tanpa Foto</small><b>${totals.withoutPhotos}</b>
      </button>
    `;

    if (!rows.length) {
      this.branchGrid.innerHTML = `
        <div class="ims-branch-empty">
          <b>Belum ada data cabang</b>
          <p>${this.dataError || "Muat ulang demo untuk mengambil stok tenant."}</p>
        </div>
      `;
      return;
    }

    this.branchGrid.innerHTML = rows
      .map(
        (row) => `
        <article class="ims-branch-card">
          <header>
            <span class="ims-branch-pin" aria-hidden="true">📍</span>
            <div>
              <b>${this.titleCase(row.branch)}</b>
              <span>${row.total} unit tercatat</span>
            </div>
          </header>
          <div class="ims-branch-metrics">
            <button type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="UNIT READY">
              <small>Ready</small><b>${row.ready}</b>
            </button>
            <button type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="BOOKED">
              <small>Booked</small><b>${row.booked}</b>
            </button>
            <button type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="SOLD">
              <small>Sold</small><b>${row.sold}</b>
            </button>
            <button type="button" class="sky" data-ims-branch-filter="${row.branch}" data-ims-status-filter="ALL">
              <small>Foto</small><b>${row.withPhotos}</b>
            </button>
          </div>
          <button class="ims-branch-open" type="button" data-ims-branch-filter="${row.branch}" data-ims-status-filter="ALL">
            Buka di Manajemen Unit →
          </button>
        </article>
      `,
      )
      .join("");
  }

  renderUploadMeta() {
    const withPhotos = this.units.filter((unit) => (unit.photos || 0) > 0).length;
    const withoutPhotos = this.units.filter(
      (unit) => unit.status !== "SOLD" && (unit.photos || 0) === 0,
    ).length;
    const missing = this.root.querySelector("[data-ims-photo-missing]");
    const ready = this.root.querySelector("[data-ims-photo-ready]");
    if (missing) missing.textContent = String(withoutPhotos);
    if (ready) ready.textContent = String(withPhotos);
  }

  getVisibleUnits() {
    const branchFilter = String(this.branch || "ALL").toLocaleUpperCase("id");
    const visible = this.units.filter((unit) => {
      let matchesStatus = true;
      if (this.status === "ACTIVE") {
        matchesStatus = unit.status === "UNIT READY" || unit.status === "BOOKED";
      } else if (this.status !== "ALL") {
        matchesStatus = unit.status === this.status;
      }
      const unitBranch = String(unit.branch || "").toLocaleUpperCase("id");
      const matchesBranch = branchFilter === "ALL" || unitBranch === branchFilter;
      const haystack = `${unit.brand} ${unit.type} ${unit.plate} ${unit.year || ""}`.toLocaleLowerCase("id");
      const matchesQuery = !this.query || haystack.includes(this.query);
      return matchesStatus && matchesBranch && matchesQuery && this.matchesAdvFilters(unit);
    });

    const sorted = visible.sort((left, right) => {
      if (this.sort === "oldest") return right.aging - left.aging;
      if (this.sort === "price-high") return (right.cashPrice || 0) - (left.cashPrice || 0);
      if (this.sort === "price-low") return (left.cashPrice || 0) - (right.cashPrice || 0);
      return (left.aging || 0) - (right.aging || 0);
    });

    // Match motovax-app Ready view secondary sort: branch → location → brand → type → price
    if (this.status === "UNIT READY") {
      sorted.sort((left, right) => {
        const branchCompare = String(left.branch || "").localeCompare(String(right.branch || ""), "id", {
          sensitivity: "base",
        });
        if (branchCompare !== 0) return branchCompare;
        const locationCompare = String(left.position || "").localeCompare(String(right.position || ""), "id", {
          sensitivity: "base",
        });
        if (locationCompare !== 0) return locationCompare;
        const brandCompare = String(left.brand || "").localeCompare(String(right.brand || ""), "id", {
          sensitivity: "base",
        });
        if (brandCompare !== 0) return brandCompare;
        const typeCompare = String(left.type || "").localeCompare(String(right.type || ""), "id", {
          sensitivity: "base",
        });
        if (typeCompare !== 0) return typeCompare;
        return (left.cashPrice || 0) - (right.cashPrice || 0);
      });
    }

    return sorted;
  }

  render() {
    const visibleUnits = this.getVisibleUnits();
    this.renderStats();
    this.renderFilters();
    this.renderAdvPanel();
    this.renderActiveChips();
    this.syncBranchUi();
    this.renderTable(visibleUnits);
    this.renderMobileList(visibleUnits);
    this.renderBranchSummary();
    this.renderUploadMeta();
    if (this.resultCount) {
      this.resultCount.textContent = this.dataError || `${visibleUnits.length} unit`;
    }
    if (this.emptyState) this.emptyState.hidden = visibleUnits.length > 0;
  }

  renderStats() {
    const counts = this.units.reduce(
      (total, unit) => {
        total.all += 1;
        if (unit.status === "UNIT READY") total.ready += 1;
        if (unit.status === "BOOKED") total.booked += 1;
        if (unit.status === "SOLD") total.sold += 1;
        return total;
      },
      { all: 0, ready: 0, booked: 0, sold: 0 },
    );

    const allEl = this.root.querySelector("[data-stat-all]");
    const readyEl = this.root.querySelector("[data-stat-ready]");
    const bookedEl = this.root.querySelector("[data-stat-booked]");
    const soldEl = this.root.querySelector("[data-stat-sold]");
    if (allEl) allEl.textContent = String(counts.all);
    if (readyEl) readyEl.textContent = String(counts.ready);
    if (bookedEl) bookedEl.textContent = String(counts.booked);
    if (soldEl) soldEl.textContent = String(counts.sold);
  }

  renderFilters() {
    for (const button of this.root.querySelectorAll("[data-status-filter]")) {
      button.classList.toggle("active", button.dataset.statusFilter === this.status);
    }
  }

  renderTable(units) {
    if (!this.tableBody) return;
    this.tableBody.innerHTML = units
      .map((unit) => {
        const buyLabel = unit.buyingPrice ? this.formatFullPrice(unit.buyingPrice) : "-";
        const sellMain =
          unit.status === "SOLD" && unit.soldPrice
            ? unit.soldPrice
            : unit.cashPrice && unit.cashPrice > 0
              ? unit.cashPrice
              : unit.creditPrice || null;
        const creditLabel =
          unit.creditPrice && unit.creditPrice > 0
            ? `Crd: ${this.formatFullPrice(unit.creditPrice)}`
            : "Crd: -";
        const meta = [
          unit.color || "Warna -",
          unit.year || "Tahun -",
          unit.transmission || "Trans -",
          `${unit.photos || 0} foto`,
        ]
          .join(" · ")
          .toLocaleUpperCase("id");
        const source = unit.source ? String(unit.source) : "";
        const odo = (unit.odometer || 0).toLocaleString("id-ID");
        return `
          <tr data-unit-id="${unit.id}" tabindex="0" aria-label="Buka detail ${this.escapeHtml(unit.brand)} ${this.escapeHtml(unit.type)}">
            <td>
              <div class="ims-unit-title-cell">
                <b>${this.escapeHtml(unit.brand || "-")} ${this.escapeHtml(unit.type || "")}</b>
                <span>${this.escapeHtml(meta)}</span>
                <em>BUKA DETAIL UNIT</em>
              </div>
            </td>
            <td style="text-align:center"><span class="demo-plate">${this.escapeHtml(unit.plate || "N/A")}</span></td>
            <td><div class="demo-cell-stack"><b>${buyLabel}</b><span>Modal Awal</span></div></td>
            <td><div class="demo-cell-stack"><b class="price">${this.formatFullPrice(sellMain)}</b><span>${creditLabel}</span></div></td>
            <td>
              <div class="demo-cell-stack">
                <span class="ims-odo-line">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  ${odo} KM
                </span>
                <span class="demo-aging ${this.agingClass(unit)}">${this.agingLabel(unit)}</span>
              </div>
            </td>
            <td>
              <div class="ims-branch-cell">
                <b><span class="ims-pin" aria-hidden="true">◎</span> Cabang: ${this.escapeHtml(unit.branch || "-")}</b>
                <span>Lokasi Aktual: ${this.escapeHtml(unit.position || "-")}</span>
                ${source ? `<span class="ims-source" title="${this.escapeHtml(source)}">Source: ${this.escapeHtml(source)}</span>` : ""}
              </div>
            </td>
            <td style="text-align:center"><span class="demo-status ${this.statusClass(unit.status)}">${this.statusLabel(unit.status)}</span></td>
          </tr>
        `;
      })
      .join("");
  }

  renderMobileList(units) {
    if (!this.mobileList) return;
    this.mobileList.innerHTML = units
      .map((unit) => {
        const sellMain =
          unit.cashPrice && unit.cashPrice > 0
            ? unit.cashPrice
            : unit.creditPrice || null;
        const meta = [
          unit.color || "Warna -",
          unit.year || "Tahun -",
          unit.transmission || "Trans -",
          `${unit.photos || 0} foto`,
        ]
          .join(" · ")
          .toLocaleUpperCase("id");
        return `
          <article class="demo-mobile-card" data-unit-id="${unit.id}" tabindex="0" aria-label="Buka detail ${this.escapeHtml(unit.brand)} ${this.escapeHtml(unit.type)}">
            <div class="demo-mobile-card-top">
              <div>
                <h3>${this.escapeHtml(unit.brand || "-")} ${this.escapeHtml(unit.type || "")}</h3>
                <span style="display:block;margin-top:4px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.04em">
                  ${this.escapeHtml(meta)}
                </span>
                <span class="demo-plate" style="margin-top:6px;display:inline-block;background:#f1f5f9;padding:2px 6px;border-radius:4px">${this.escapeHtml(unit.plate || "N/A")}</span>
              </div>
              <span class="demo-status ${this.statusClass(unit.status)}">${this.statusLabel(unit.status)}</span>
            </div>
            <div class="demo-mobile-card-meta">
              <div><small>Harga Beli</small><b>${unit.buyingPrice ? this.formatFullPrice(unit.buyingPrice) : "-"}</b></div>
              <div><small>Harga Jual</small><b>${this.formatFullPrice(sellMain)}</b></div>
              <div><small>Cabang</small><b>${this.escapeHtml(unit.branch || "-")}${unit.position ? ` · ${this.escapeHtml(unit.position)}` : ""}</b></div>
              <div><small>Odo &amp; Aging</small><b>${(unit.odometer || 0).toLocaleString("id-ID")} KM · <span class="demo-aging ${this.agingClass(unit)}">${this.agingLabel(unit)}</span></b></div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  handleUnitActivation(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const target = event.target.closest("[data-unit-id]");
    if (!target) return;
    if (event.type === "keydown") event.preventDefault();
    this.openDetail(target.dataset.unitId);
  }

  openDetail(unitId) {
    const unit = this.units.find((item) => item.id === unitId);
    if (!unit) return;
    this.selectedId = unit.id;
    this.closeGuide();
    this.setUnitDetailTab("detail");
    this.populateDetail(unit);
    this.root.classList.add("is-unit-detail-open");
    this.detailBackdrop.hidden = false;
    this.detailPanel.classList.add("is-open");
    this.detailPanel.setAttribute("aria-hidden", "false");
    this.detailPanel.querySelector("[data-close-demo-detail]")?.focus();
  }

  setUnitDetailTab(tab) {
    const next = ["detail", "gambar", "video", "dokumen", "histori"].includes(tab) ? tab : "detail";
    for (const button of this.root.querySelectorAll("[data-ims-ud-tab]")) {
      const active = button.dataset.imsUdTab === next;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    }
    for (const panel of this.root.querySelectorAll("[data-ims-ud-panel]")) {
      const active = panel.dataset.imsUdPanel === next;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    }
  }

  /** Deterministic demo extras when tenant field missing (keeps layout Mobix-complete). */
  demoDetailExtras(unit) {
    const seed = `${unit.id || unit.plate || "unit"}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    const chassis = unit.chassis || unit.chassis_number || `MHR${String(hash).slice(0, 11).padStart(11, "0")}`;
    const engineNo = unit.engineNumber || unit.engine_number || `L${String(hash).slice(-9).padStart(9, "0")}`;
    const bpkb = unit.bpkbName || unit.bpkb_name || "PEMILIK UNIT DEMO";
    const stnk = unit.stnkExpiry || unit.stnk_expiry || unit.stnk || "2026-12-31";
    const appraiser = unit.appraiser || "APPRAISER DEMO";
    const purchaseDate = unit.purchaseDate || unit.purchase_date || "";
    const reconCommission = unit.reconCommission || 500000;
    const buy = Number(unit.buyingPrice || 0);
    const sell = Number(unit.cashPrice || unit.creditPrice || 0);
    const reconTotal = reconCommission;
    const tns = buy > 0 ? Math.round(buy * 1.0182) : 0;
    const gp = sell > 0 && buy > 0 ? sell - buy - reconTotal : 0;
    const gpPct = sell > 0 && gp ? ((gp / sell) * 100).toFixed(1) : "0.0";
    return {
      chassis,
      engineNo,
      bpkb,
      stnk,
      appraiser,
      purchaseDate,
      reconCommission,
      reconTotal,
      tns,
      gp,
      gpPct,
      buy,
      sell,
    };
  }

  setText(selector, value) {
    const el = this.root.querySelector(selector);
    if (el) el.textContent = value == null || value === "" ? "—" : String(value);
  }

  populateDetail(unit) {
    const x = this.demoDetailExtras(unit);
    const plate = unit.plate || "N/A";
    const name = `${unit.brand || "-"} ${unit.type || ""}`.trim();
    const bodyType = unit.bodyType || unit.category || "—";
    const source = unit.source || "Inventory demo";
    const isSold = unit.status === "SOLD";
    const inStock = unit.status === "UNIT READY" || unit.status === "BOOKED";

    // Header / breadcrumb
    this.setText("[data-detail-plate]", plate);
    this.setText("[data-detail-plate-header]", plate);
    this.setText("[data-detail-plate-foot]", plate);
    this.setText("[data-detail-name]", name);
    this.setText("[data-detail-year]", unit.year || "—");
    this.setText("[data-detail-color]", unit.color || "—");

    const statusEl = this.root.querySelector("[data-detail-status]");
    if (statusEl) {
      statusEl.className = "ims-ud-status";
      if (unit.status === "BOOKED") statusEl.classList.add("is-booked");
      if (unit.status === "SOLD") statusEl.classList.add("is-sold");
      statusEl.textContent = this.statusLabel(unit.status);
    }

    // Identitas
    this.setText("[data-detail-merk-tipe]", name);
    this.setText(
      "[data-detail-year-cat-color]",
      `${unit.year || "—"} | ${bodyType} | ${unit.color || "—"}`,
    );
    this.setText("[data-detail-transmission]", unit.transmission || "—");
    this.setText(
      "[data-detail-odometer]",
      `${(unit.odometer || 0).toLocaleString("id-ID")} KM`,
    );
    this.setText("[data-detail-chassis]", x.chassis);
    this.setText("[data-detail-engine-no]", x.engineNo);

    // Dokumen & governance
    this.setText("[data-detail-stnk]", x.stnk);
    this.setText("[data-detail-bpkb]", x.bpkb);
    this.setText("[data-detail-notes]", unit.notes || "—");
    this.setText("[data-detail-position]", unit.position || "—");
    this.setText("[data-detail-branch]", unit.branch || "—");
    this.setText("[data-detail-appraiser]", x.appraiser);

    // Info pembelian
    const buyLabel = x.buy > 0 ? this.formatFullPrice(x.buy) : "—";
    this.setText(
      "[data-detail-buy-aging]",
      `Harga Beli: ${buyLabel} · Aging: ${unit.aging ?? 0} hari`,
    );
    this.setText("[data-detail-source]", source);
    this.setText(
      "[data-detail-purchase-date]",
      x.purchaseDate || "—",
    );
    this.setText("[data-detail-handover]", unit.handoverDate || unit.handover_date || "—");
    this.setText("[data-detail-stock-count]", inStock ? "1" : "0");
    const stockLabel = this.root.querySelector("[data-detail-stock-label]");
    if (stockLabel) {
      stockLabel.textContent = isSold ? "SOLD" : unit.status === "BOOKED" ? "BOOKED" : "IN STOCK";
      stockLabel.classList.toggle("is-out", isSold);
    }

    // Rekon
    this.setText(
      "[data-detail-recon-total]",
      `TOTAL EST. REKON: ${this.formatFullPrice(x.reconTotal)}`,
    );
    this.setText("[data-detail-recon-commission]", this.formatFullPrice(x.reconCommission));

    // Penjualan
    this.setText("[data-detail-sales]", isSold ? "SALES DEMO" : "—");
    this.setText("[data-detail-source-purchase]", source);
    this.setText("[data-detail-source-sell]", isSold ? "SHOWROOM" : "—");
    this.setText("[data-detail-payment]", isSold ? "CASH / CREDIT" : "—");
    this.setText(
      "[data-detail-deal-price]",
      x.sell > 0 ? this.formatFullPrice(x.sell) : "—",
    );

    // Profitability
    this.setText("[data-detail-gross]", x.sell > 0 ? this.formatFullPrice(x.sell) : "—");
    this.setText(
      "[data-detail-buy-profit]",
      x.buy > 0 ? `− ${this.formatFullPrice(x.buy)}` : "—",
    );
    this.setText(
      "[data-detail-recon-profit]",
      x.reconTotal > 0 ? `− ${this.formatFullPrice(x.reconTotal)}` : "— —",
    );
    this.setText(
      "[data-detail-recon-actual]",
      x.reconTotal > 0 ? `− ${this.formatFullPrice(x.reconTotal)}` : "—",
    );
    this.setText("[data-detail-tns]", x.tns > 0 ? this.formatFullPrice(x.tns) : "—");
    this.setText(
      "[data-detail-gp]",
      x.gp
        ? `${this.formatFullPrice(x.gp)} (${x.gpPct}%)`
        : "—",
    );
    this.setText(
      "[data-detail-gp-gross]",
      x.gp ? this.formatFullPrice(Math.round(x.gp * 1.08)) : "—",
    );

    // Footer meta
    this.setText("[data-detail-id]", unit.id || "—");
    this.setText(
      "[data-detail-doc-source]",
      source ? `DOCUMENT: ${source}` : "DEMO SEED",
    );

    // Gambar tab
    const photoWrap = this.root.querySelector("[data-detail-photo-wrap]");
    const carPhoto = this.root.querySelector("[data-detail-photo]");
    const photoEmpty = this.root.querySelector("[data-detail-photo-empty]");
    if (carPhoto && photoWrap) {
      if (unit.photoUrl) {
        carPhoto.src = unit.photoUrl;
        carPhoto.alt = name;
        photoWrap.hidden = false;
        if (photoEmpty) photoEmpty.hidden = true;
      } else {
        carPhoto.removeAttribute("src");
        photoWrap.hidden = true;
        if (photoEmpty) photoEmpty.hidden = false;
      }
    }
    this.setText("[data-detail-photo-count]", `${unit.photos || 0} foto`);
    this.setText("[data-detail-stnk-doc]", x.stnk);
    this.setText("[data-detail-bpkb-doc]", x.bpkb);

    const history = this.root.querySelector("[data-detail-history]");
    if (history) {
      history.innerHTML = [
        `<li>Unit ${this.escapeHtml(plate)} masuk stok · status ${this.escapeHtml(this.statusLabel(unit.status))}</li>`,
        `<li>Cabang ${this.escapeHtml(unit.branch || "-")} · posisi ${this.escapeHtml(unit.position || "-")}</li>`,
        unit.photos
          ? `<li>${unit.photos} foto tercatat di galeri tenant demo</li>`
          : `<li>Belum ada upload foto di demo</li>`,
      ].join("");
    }
  }

  exportSelectedUnitDetail() {
    const unit = this.units.find((item) => item.id === this.selectedId);
    if (!unit) {
      this.toast.querySelector("b").textContent = "Unit tidak dipilih";
      this.toast.querySelector("p").textContent = "Buka detail unit dulu sebelum export.";
      this.toast.hidden = false;
      return;
    }
    const headers = ["Plate No", "Brand", "Type", "Year", "Color", "Status", "Aging (hr)", "Branch", "Harga Beli", "Harga Jual Cash"];
    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const row = [
      unit.plate,
      unit.brand,
      unit.type,
      unit.year,
      unit.color,
      unit.status,
      unit.aging,
      unit.branch,
      unit.buyingPrice ?? "",
      unit.cashPrice ?? "",
    ];
    const csv = [headers, row].map((r) => r.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `unit-${String(unit.plate || unit.id || "export").replace(/\s+/g, "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  closeDetail() {
    this.root.classList.remove("is-unit-detail-open");
    this.detailPanel.classList.remove("is-open");
    this.detailPanel.setAttribute("aria-hidden", "true");
    this.detailBackdrop.hidden = true;
  }

  statusClass(status) {
    if (status === "BOOKED") return "booked";
    if (status === "SOLD") return "sold";
    return "ready";
  }

  statusLabel(status) {
    if (status === "UNIT READY") return "UNIT READY";
    return status;
  }

  initials(brand) {
    return brand.slice(0, 3).toLocaleUpperCase("id");
  }

  titleCase(value) {
    return value
      .toLocaleLowerCase("id")
      .replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("id"));
  }

  formatPrice(value) {
    return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
  }

  formatCompactPrice(value) {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
    }
    return `Rp ${(value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} jt`;
  }
}

const inventoryDemoMount = document.getElementById("inventoryDemo");
if (inventoryDemoMount) {
  new InventoryProductDemo(inventoryDemoMount);
}

const crmIntentLabels = {
  aware: "Contacted",
  considering: "Interested",
  comparing: "Viewing",
  ready_to_buy: "Negotiation",
  postponed: "Postponed",
};

function crmResolveUnit(unitId) {
  return inventoryDemoSeed.find((u) => u.id === unitId) || null;
}

function crmUnitLabel(unit) {
  if (!unit) return "Unit Motovax";
  return `${unit.brand} ${unit.type} ${unit.year}`;
}

function crmLeadValue(lead) {
  if (typeof lead.value === "number" && lead.value > 0) return lead.value;
  const unit = crmResolveUnit(lead.unitId);
  return unit?.cashPrice || 0;
}

const crmDemoSeed = [
  {
    id: "lead-nadia",
    name: "Nadia Demo",
    unitId: "unit-006",
    stage: "warm",
    score: 62,
    value: null,
    days: 8,
    source: "whatsapp",
    intent: "considering",
    handler: "AI Bot · Dimas",
    ai: true,
    phone: "62812****901",
    summary:
      "Nadia menanyakan cicilan Xpander Ultimate dan sudah menyebut kisaran uang muka. Respons terakhir positif, tetapi belum ada tindak lanjut selama 8 hari.",
    recommendation: "Kirim simulasi cicilan dan tawarkan jadwal test drive.",
    message:
      "Halo Kak Nadia, saya Dimas dari Motovax. Simulasi cicilan Xpander Ultimate (B 1206 MVX) yang Kakak tanyakan sudah siap. Boleh saya kirimkan rinciannya sekaligus bantu jadwalkan test drive minggu ini?",
    events: [
      { icon: "WA", title: "Menanyakan simulasi cicilan", detail: "WhatsApp masuk", time: "8 hari lalu" },
      { icon: "AI", title: "AI mengidentifikasi minat tinggi", detail: "Intent: financing", time: "8 hari lalu" },
      { icon: "D", title: "Dialihkan ke Dimas", detail: "Sales consultant", time: "8 hari lalu" },
    ],
  },
  {
    id: "lead-bayu",
    name: "Bayu Prakoso",
    unitId: "unit-012",
    stage: "cold",
    score: 28,
    value: null,
    days: 2,
    source: "instagram",
    intent: "aware",
    handler: "AI Bot · Rani",
    ai: true,
    phone: "62813****442",
    summary: "Bayu menyimpan konten Raize GR Sport dari Instagram dan baru menanyakan ketersediaan warna.",
    recommendation: "Kirim pilihan warna dan foto unit stok yang tersedia.",
    message:
      "Halo Kak Bayu, warna Toyota Raize GR Sport yang Kakak tanyakan masih tersedia di showroom Cinere. Saya bisa kirim foto unit dan detail harganya di sini.",
    events: [
      { icon: "IG", title: "Membalas Instagram Story", detail: "Instagram DM", time: "2 hari lalu" },
      { icon: "AI", title: "AI menjawab ketersediaan", detail: "Respons otomatis", time: "2 hari lalu" },
    ],
  },
  {
    id: "lead-sinta",
    name: "Sinta Maharani",
    unitId: "unit-010",
    stage: "cold",
    score: 34,
    value: null,
    days: 5,
    source: "facebook",
    intent: "aware",
    handler: "AI Bot",
    ai: true,
    phone: "62821****118",
    summary: "Sinta mengisi formulir iklan BR-V dan tertarik trade-in, tetapi belum memberi detail unit lama.",
    recommendation: "Minta data singkat unit trade-in untuk estimasi awal.",
    message:
      "Halo Kak Sinta, terima kasih sudah tertarik dengan Honda BR-V Prestige. Boleh kirim tipe, tahun, dan foto unit lama agar tim kami bantu estimasi trade-in?",
    events: [
      { icon: "FB", title: "Lead dari Facebook Ads", detail: "Form iklan", time: "5 hari lalu" },
      { icon: "AI", title: "Lead berhasil dikualifikasi", detail: "Minat: trade-in", time: "5 hari lalu" },
    ],
  },
  {
    id: "lead-andi",
    name: "Andi Saputra",
    unitId: "unit-002",
    stage: "warm",
    score: 55,
    value: null,
    days: 4,
    source: "excel_import",
    intent: "considering",
    handler: "Ayu",
    ai: false,
    phone: "62856****773",
    summary: "Andi berasal dari daftar pameran dan sudah menerima katalog harga Rush G AT.",
    recommendation: "Konfirmasi kebutuhan tenor dan target pembelian.",
    message:
      "Halo Pak Andi, saya Ayu dari Motovax. Apakah katalog Toyota Rush sudah sempat dilihat? Saya bisa bantu hitungkan cicilan sesuai tenor yang Bapak inginkan.",
    events: [
      { icon: "XL", title: "Diimpor dari daftar pameran", detail: "Excel Import", time: "6 hari lalu" },
      { icon: "A", title: "Katalog dikirim oleh Ayu", detail: "Aktivitas sales", time: "4 hari lalu" },
    ],
  },
  {
    id: "lead-farhan",
    name: "Farhan Rizki",
    unitId: "unit-004",
    stage: "warm",
    score: 58,
    value: null,
    days: 7,
    source: "whatsapp",
    intent: "comparing",
    handler: "AI Bot · Dimas",
    ai: true,
    phone: "62818****905",
    summary: "Farhan meminta video kondisi interior HR-V dan membandingkan dua pilihan unit.",
    recommendation: "Kirim video walkaround dan tekankan hasil inspeksi.",
    message:
      "Halo Kak Farhan, video interior HR-V S CVT dan ringkasan inspeksinya sudah siap. Saya kirimkan sekarang agar Kakak bisa membandingkan kedua unitnya.",
    events: [
      { icon: "WA", title: "Meminta video unit", detail: "WhatsApp masuk", time: "7 hari lalu" },
      { icon: "AI", title: "Kebutuhan dicatat AI", detail: "Intent: unit comparison", time: "7 hari lalu" },
    ],
  },
  {
    id: "lead-rizky",
    name: "Rizky Ramadhan",
    unitId: "unit-007",
    stage: "hot",
    score: 88,
    value: null,
    days: 1,
    source: "whatsapp",
    intent: "ready_to_buy",
    handler: "Rani",
    ai: false,
    phone: "62877****221",
    summary: "Rizky sudah menyetujui kisaran cicilan Ertiga Hybrid dan ingin melihat unit akhir pekan ini.",
    recommendation: "Kunci jadwal test drive dan siapkan unit di Bekasi.",
    message:
      "Halo Pak Rizky, kami siap jadwalkan test drive Ertiga GX Hybrid akhir pekan ini. Bapak lebih nyaman datang Sabtu atau Minggu?",
    events: [
      { icon: "WA", title: "Menyetujui kisaran cicilan", detail: "WhatsApp", time: "1 hari lalu" },
      { icon: "R", title: "Rani menawarkan test drive", detail: "Aktivitas sales", time: "1 hari lalu" },
    ],
  },
  {
    id: "lead-laras",
    name: "Laras Wulandari",
    unitId: "unit-009",
    stage: "hot",
    score: 79,
    value: null,
    days: 3,
    source: "instagram",
    intent: "ready_to_buy",
    handler: "AI Bot · Ayu",
    ai: true,
    phone: "62896****334",
    summary: "Laras sudah mengirim KTP untuk pengecekan awal Rocky dan menunggu paket pembiayaan.",
    recommendation: "Kirim dua opsi paket pembiayaan terbaik.",
    message:
      "Halo Kak Laras, pengecekan awal sudah selesai. Saya punya dua pilihan paket pembiayaan Rocky yang paling sesuai. Boleh saya kirimkan perbandingannya?",
    events: [
      { icon: "IG", title: "Melanjutkan chat dari Instagram", detail: "Instagram DM", time: "3 hari lalu" },
      { icon: "AI", title: "Dokumen awal diterima", detail: "Dibantu AI", time: "3 hari lalu" },
    ],
  },
  {
    id: "lead-yoga",
    name: "Yoga Permana",
    unitId: "unit-008",
    stage: "prospect",
    score: 91,
    value: null,
    days: 1,
    source: "walk_in",
    intent: "ready_to_buy",
    handler: "Dimas",
    ai: false,
    phone: "62811****667",
    summary: "Yoga sudah test drive Avanza, memilih unit, dan sedang melengkapi dokumen pemesanan.",
    recommendation: "Pastikan kelengkapan dokumen dan konfirmasi metode pembayaran.",
    message:
      "Halo Pak Yoga, terima kasih sudah test drive Avanza. Saya bantu cek kembali kelengkapan dokumen agar proses pemesanannya bisa segera dilanjutkan.",
    events: [
      { icon: "TD", title: "Test drive selesai", detail: "Kunjungan showroom", time: "1 hari lalu" },
      { icon: "D", title: "Dokumen pemesanan diminta", detail: "Dimas", time: "1 hari lalu" },
    ],
  },
  {
    id: "lead-maya",
    name: "Maya Lestari",
    unitId: "unit-001",
    stage: "prospect",
    score: 86,
    value: null,
    days: 2,
    source: "excel_import",
    intent: "comparing",
    handler: "Ayu",
    ai: false,
    phone: "62852****890",
    summary: "Maya telah menerima penawaran final Serena HWS dan meminta waktu untuk persetujuan keluarga.",
    recommendation: "Follow-up singkat dengan masa berlaku penawaran.",
    message:
      "Halo Ibu Maya, saya ingin mengingatkan bahwa penawaran Serena HWS berlaku sampai Jumat. Jika ada bagian yang ingin didiskusikan bersama keluarga, saya siap membantu.",
    events: [
      { icon: "XL", title: "Lead pelanggan lama", detail: "Excel Import", time: "9 hari lalu" },
      { icon: "A", title: "Penawaran final dikirim", detail: "Ayu", time: "2 hari lalu" },
    ],
  },
];

const crmClosedSeed = [
  {
    id: "closed-raka",
    name: "Raka Demo",
    unitId: "unit-011",
    status: "deal",
    value: null,
  },
  {
    id: "closed-putri",
    name: "Putri Demo",
    unitId: "unit-004",
    status: "handover",
    value: null,
  },
];

const crmAutoFollowPrograms = [
  {
    id: "af-nurture",
    name: "New Lead Nurture 24j",
    type: "Nurture",
    channel: "WhatsApp",
    schedule: "Setiap hari 09:00",
    contacts: 42,
    active: true,
  },
  {
    id: "af-warm",
    name: "Warm ≥7 hari",
    type: "Follow-up",
    channel: "WhatsApp",
    schedule: "Sen–Jum 10:00",
    contacts: 18,
    active: true,
  },
  {
    id: "af-hot",
    name: "Hot closing push",
    type: "Hot FU",
    channel: "WA + Call task",
    schedule: "Setiap hari 14:00",
    contacts: 11,
    active: true,
  },
  {
    id: "af-reeng",
    name: "Re-engagement Cold 30h",
    type: "Re-engagement",
    channel: "WhatsApp",
    schedule: "Rabu 11:00",
    contacts: 27,
    active: false,
  },
];

const crmStageConfig = {
  cold: { label: "Cold", probability: 0.1 },
  warm: { label: "Warm", probability: 0.3 },
  hot: { label: "Hot", probability: 0.7 },
  prospect: { label: "Prospect", probability: 0.8 },
};

class AutopilotCRMDemo {
  constructor(root) {
    this.root = root;
    this.leads = this.cloneSeed();
    this.closed = this.cloneClosed();
    this.programs = crmAutoFollowPrograms.map((p) => ({ ...p }));
    this.cycleRun = 0;
    this.source = "all";
    this.query = "";
    this.customerQuery = "";
    this.mobileStage = "cold";
    this.view = "pipeline";
    this.selectedId = null;
    this.lastFocusedElement = null;
    this.guideStepIndex = 0;

    this.board = root.querySelector("[data-crm-board]");
    this.stageTabs = root.querySelector("[data-crm-stage-tabs]");
    this.searchInput = root.querySelector("[data-crm-search]");
    this.customerList = root.querySelector("[data-crm-customer-list]");
    this.customerSearch = root.querySelector("[data-crm-customer-search]");
    this.afList = root.querySelector("[data-crm-af-list]");
    this.detailPanel = root.querySelector(".crm-detail-panel");
    this.detailBackdrop = root.querySelector("[data-crm-detail-backdrop]");
    this.guide = root.querySelector("[data-crm-guide-popover]");
    this.toast = root.querySelector("[data-crm-toast]");
    this.messagePreview = root.querySelector("[data-crm-message-preview]");
    this.prepareButton = root.querySelector("[data-crm-prepare-followup]");
    this.closedList = root.querySelector("[data-crm-closed-list]");

    this.tour = new DemoProductTour(root, {
      ns: "crm",
      anchorAttr: "data-crm-anchor",
      getSteps: () => this.guideSteps(),
      onSwitchView: (view) => this.switchView(view),
      getStepLabel: (step, index, total) => {
        const labels = {
          pipeline: "Pipeline",
          customer: "Customer",
          "auto-follow": "Auto Follow",
          panduan: "Panduan",
        };
        const viewLabel = labels[step.view] || step.label || "Autopilot CRM";
        return total > 1
          ? `${String(viewLabel).toUpperCase()} · LANGKAH ${index} DARI ${total}`
          : String(viewLabel).toUpperCase();
      },
    });

    this.bind();
    this.switchView("pipeline");
    this.render();
  }

  cloneSeed() {
    return crmDemoSeed.map((lead) => ({
      ...lead,
      events: lead.events.map((event) => ({ ...event })),
    }));
  }

  cloneClosed() {
    return crmClosedSeed.map((item) => ({ ...item }));
  }

  guideSteps() {
    const steps = [
      {
        view: "pipeline",
        anchor: "sidebar",
        label: "Autopilot CRM",
        title: "Menu Autopilot CRM",
        body: "Sidebar selaras Motovax: Customer, Pipeline, Auto Follow Customer, dan Panduan. Area sorot = navigasi aktif — pola sama dengan panduan Inventory.",
      },
      {
        view: "pipeline",
        anchor: "kpi-grid",
        label: "Pipeline",
        title: "Pipeline & KPI",
        body: "Lihat nilai pipeline, forecast, dan KPI. Filter Semua / Omnichannel / Excel Import seperti di produk.",
        enter: () => {
          this.source = "all";
          this.render();
        },
      },
      {
        view: "pipeline",
        anchor: "board",
        label: "Pipeline",
        title: "Lead prioritas Nadia",
        body: "Kartu Nadia Demo bertanda “Coba ini” — Warm, stale ≥7 hari, siap follow-up AI. Klik kartu setelah panduan untuk eksplor bebas.",
        enter: () => {
          this.closeDetail();
          this.source = "all";
          this.mobileStage = "warm";
          this.render();
          requestAnimationFrame(() => {
            const card = this.root.querySelector('[data-lead-id="lead-nadia"]');
            card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          });
        },
      },
      {
        view: "pipeline",
        anchor: "unit-card",
        label: "Detail Lead",
        title: "Unit = stok Motovax",
        body: "Detail lead menampilkan unit dari katalog inventory: plate, cabang, status, harga, dan fitur.",
        enter: () => this.openDetail("lead-nadia", { keepGuide: true }),
      },
      {
        view: "pipeline",
        anchor: "ai-summary",
        label: "Detail Lead",
        title: "AI Co-Pilot",
        body: "Baca ringkasan AI dan rekomendasi berikutnya — input untuk follow-up otomatis.",
        enter: () => this.openDetail("lead-nadia", { keepGuide: true }),
      },
      {
        view: "pipeline",
        anchor: "followup",
        label: "Follow-up AI",
        title: "Simulasi follow-up AI",
        body: "Siapkan pesan WhatsApp buatan AI, lalu Kirim simulasi. Stage naik, skor naik — pesan tidak dikirim ke customer.",
        enter: () => {
          this.openDetail("lead-nadia", { keepGuide: true });
          this.prepareFollowup();
        },
      },
      {
        view: "auto-follow",
        anchor: "auto-follow",
        label: "Auto Follow",
        title: "Auto Follow Customer",
        body: "Program follow-up terjadwal (nurture, warm ≥7h, hot push). Ganti menu Campaign di Motovax.",
        enter: () => this.closeDetail(),
      },
      {
        view: "pipeline",
        anchor: "board",
        label: "Pipeline",
        title: "Dampak di pipeline",
        body: "Setelah follow-up, lead pindah kolom dan forecast berubah. Selesai — silakan eksplor bebas seperti di demo Inventory.",
        enter: () => {
          this.closeDetail();
          this.mobileStage = this.leads.find((l) => l.id === "lead-nadia")?.stage || "hot";
          this.render();
        },
      },
    ];
    return steps;
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-crm-demo]")) {
      button.addEventListener("click", (event) => {
        if (button instanceof HTMLAnchorElement) event.preventDefault();
        this.open(button);
      });
    }

    for (const button of this.root.querySelectorAll("[data-close-crm-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-crm-nav]");
      if (nav && this.root.contains(nav)) {
        this.switchView(nav.dataset.crmNav || "pipeline");
      }
    });

    for (const button of this.root.querySelectorAll("[data-crm-source]")) {
      button.addEventListener("click", () => {
        this.source = button.dataset.crmSource || "all";
        this.render();
      });
    }

    this.searchInput?.addEventListener("input", () => {
      this.query = this.searchInput.value.trim().toLocaleLowerCase("id");
      this.render();
    });

    this.customerSearch?.addEventListener("input", () => {
      this.customerQuery = this.customerSearch.value.trim().toLocaleLowerCase("id");
      this.renderCustomers();
    });

    this.board?.addEventListener("click", (event) => this.handleLeadActivation(event));
    this.board?.addEventListener("keydown", (event) => this.handleLeadActivation(event));
    this.customerList?.addEventListener("click", (event) => {
      const row = event.target.closest("[data-lead-id]");
      if (row) this.openDetail(row.dataset.leadId);
    });

    this.stageTabs?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-crm-stage]");
      if (!button) return;
      this.mobileStage = button.dataset.crmStage;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-close-crm-detail]")) {
      button.addEventListener("click", () => this.closeDetail());
    }
    this.detailBackdrop?.addEventListener("click", () => this.closeDetail());

    this.prepareButton?.addEventListener("click", () => this.prepareFollowup());
    this.root.querySelector("[data-crm-send-followup]")?.addEventListener("click", () => this.sendFollowup());
    this.root.querySelector("[data-crm-reset]")?.addEventListener("click", () => this.reset());

    // Panduan: DemoProductTour (bindControls di constructor)

    this.root.querySelector("[data-close-crm-toast]")?.addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.root.querySelector("[data-crm-toggle-closed]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      this.closedList.hidden = isExpanded;
      this.root.querySelector("[data-crm-closed-chevron]").textContent = isExpanded ? "⌄" : "⌃";
    });

    this.root.querySelector("[data-crm-af-run]")?.addEventListener("click", () => this.runAutoFollowCycle());

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (this.tour?.isOpen) {
        this.closeGuide();
      } else if (this.detailPanel.classList.contains("is-open")) {
        this.closeDetail();
      } else {
        this.close();
      }
    });
  }

  switchView(view) {
    const allowed = ["customer", "pipeline", "auto-follow", "panduan"];
    this.view = allowed.includes(view) ? view : "pipeline";
    for (const section of this.root.querySelectorAll("[data-crm-view]")) {
      const active = section.dataset.crmView === this.view;
      section.hidden = !active;
      section.classList.toggle("is-active", active);
    }
    for (const button of this.root.querySelectorAll("[data-crm-nav]")) {
      const active = button.dataset.crmNav === this.view;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    if (this.view === "customer") this.renderCustomers();
    if (this.view === "auto-follow") this.renderAutoFollow();
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.closeDetail();
    this.closeGuide();
    this.switchView("pipeline");
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    // Tunggu modal benar-benar ter-layout agar spotlight dan popover mendapat
    // ukuran anchor yang valid. Panduan selalu dimulai saat demo CRM dibuka.
    requestAnimationFrame(() => {
      if (!this.root.classList.contains("is-open")) return;
      this.openGuide(0);
    });
  }

  close() {
    this.closeDetail();
    this.closeGuide();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    this.tour?.open(startIndex);
  }

  closeGuide() {
    this.tour?.close();
  }

  reset() {
    this.leads = this.cloneSeed();
    this.closed = this.cloneClosed();
    this.programs = crmAutoFollowPrograms.map((p) => ({ ...p }));
    this.cycleRun = 0;
    this.source = "all";
    this.query = "";
    this.customerQuery = "";
    this.mobileStage = "cold";
    this.selectedId = null;
    if (this.searchInput) this.searchInput.value = "";
    if (this.customerSearch) this.customerSearch.value = "";
    this.closedList.hidden = true;
    const closedToggle = this.root.querySelector("[data-crm-toggle-closed]");
    if (closedToggle) {
      closedToggle.setAttribute("aria-expanded", "false");
      this.root.querySelector("[data-crm-closed-chevron]").textContent = "⌄";
    }
    this.closeDetail();
    this.toast.hidden = true;
    this.switchView("pipeline");
    this.render();
  }

  getVisibleLeads() {
    return this.leads.filter((lead) => {
      const unit = crmResolveUnit(lead.unitId);
      const unitLabel = crmUnitLabel(unit);
      const isOmnichannel = ["whatsapp", "instagram", "facebook"].includes(lead.source);
      const matchesSource =
        this.source === "all" ||
        (this.source === "omnichannel" && isOmnichannel) ||
        (this.source === "excel" && lead.source === "excel_import");
      const haystack = `${lead.name} ${unitLabel} ${lead.handler}`.toLocaleLowerCase("id");
      return matchesSource && haystack.includes(this.query);
    });
  }

  render() {
    const visibleLeads = this.getVisibleLeads();
    this.renderSummary();
    this.renderFilters();
    this.renderStageTabs(visibleLeads);
    this.renderBoard(visibleLeads);
    this.renderClosed();
    if (this.view === "customer") this.renderCustomers();
    if (this.view === "auto-follow") this.renderAutoFollow();
  }

  renderSummary() {
    const pipeline = this.leads.reduce((total, lead) => total + crmLeadValue(lead), 0);
    const forecast = this.leads.reduce(
      (total, lead) => total + crmLeadValue(lead) * (crmStageConfig[lead.stage]?.probability || 0),
      0,
    );
    const setText = (sel, value) => {
      const el = this.root.querySelector(sel);
      if (el) el.textContent = value;
    };
    setText("[data-crm-pipeline-value]", this.formatCompactPrice(pipeline));
    setText("[data-crm-forecast]", this.formatCompactPrice(forecast));
    setText("[data-crm-active-count]", String(this.leads.length));
    setText(
      "[data-crm-followup-count]",
      String(this.leads.filter((lead) => lead.days >= 7).length),
    );
    setText(
      "[data-crm-hot-count]",
      String(this.leads.filter((lead) => lead.stage === "hot").length),
    );
    setText(
      "[data-crm-ai-count]",
      String(this.leads.filter((lead) => lead.ai).length),
    );
  }

  renderFilters() {
    for (const button of this.root.querySelectorAll("[data-crm-source]")) {
      button.classList.toggle("active", button.dataset.crmSource === this.source);
    }
  }

  renderStageTabs(leads) {
    if (!this.stageTabs) return;
    this.stageTabs.innerHTML = Object.entries(crmStageConfig)
      .map(([stage, config]) => {
        const count = leads.filter((lead) => lead.stage === stage).length;
        return `<button class="${stage === this.mobileStage ? "active" : ""}" type="button" role="tab" aria-selected="${stage === this.mobileStage}" data-crm-stage="${stage}">${config.label} (${count})</button>`;
      })
      .join("");
  }

  renderBoard(leads) {
    if (!this.board) return;
    this.board.innerHTML = Object.entries(crmStageConfig)
      .map(([stage, config]) => {
        const stageLeads = leads.filter((lead) => lead.stage === stage);
        const stageValue = stageLeads.reduce((total, lead) => total + crmLeadValue(lead), 0);
        const cards = stageLeads.length
          ? stageLeads.map((lead) => this.renderLeadCard(lead)).join("")
          : '<div class="crm-empty">Belum ada lead pada filter ini.</div>';
        return `
          <section class="crm-column ${stage === this.mobileStage ? "is-mobile-active" : ""}" data-crm-column="${stage}">
            <div class="crm-column-head ${stage}">
              <span><i></i><b>${config.label}</b><em>${stageLeads.length}</em></span>
              <small>${this.formatCompactPrice(stageValue)}</small>
            </div>
            <div class="crm-column-list">${cards}</div>
          </section>
        `;
      })
      .join("");
  }

  renderLeadCard(lead) {
    const unit = crmResolveUnit(lead.unitId);
    const unitLabel = crmUnitLabel(unit);
    const value = crmLeadValue(lead);
    const isFeatured = lead.id === "lead-nadia" && !lead.followedUp;
    const intent = lead.intent ? crmIntentLabels[lead.intent] : null;
    return `
      <article class="crm-lead-card ${isFeatured ? "featured" : ""}" data-lead-id="${lead.id}" tabindex="0" aria-label="Buka detail ${lead.name}">
        ${isFeatured ? '<span class="crm-try-badge">Coba ini</span>' : ""}
        <div class="crm-lead-card-head">
          <h3>${lead.name}</h3>
          <span class="crm-score">${lead.score}/100</span>
        </div>
        <p class="crm-lead-unit">${unitLabel}</p>
        <div class="crm-lead-meta">
          <span class="crm-source-badge ${lead.source}">${this.sourceLabel(lead.source)}</span>
          ${intent ? `<span class="crm-intent-chip">${intent}</span>` : ""}
          <b>${this.formatCompactPrice(value)}</b>
        </div>
        <div class="crm-lead-card-footer">
          <span class="crm-handler">${lead.ai ? "AI · " : ""}${lead.handler}</span>
          <span class="crm-stale ${lead.days >= 7 ? "high" : ""}">${lead.days} hari di stage</span>
        </div>
      </article>
    `;
  }

  renderClosed() {
    if (!this.closedList) return;
    let total = 0;
    this.closedList.innerHTML = this.closed
      .map((item) => {
        const unit = crmResolveUnit(item.unitId);
        const value = item.value || unit?.cashPrice || 0;
        total += value;
        const statusClass = item.status === "deal" ? "sold" : "ready";
        const statusLabel = item.status === "deal" ? "DEAL" : "HANDOVER";
        return `<article><span class="demo-status ${statusClass}">${statusLabel}</span><div><b>${item.name}</b><small>${crmUnitLabel(unit)}${unit ? ` · ${unit.plate}` : ""}</small></div><strong>${this.formatCompactPrice(value)}</strong></article>`;
      })
      .join("");
    const summary = this.root.querySelector("[data-crm-closed-summary]");
    if (summary) {
      summary.textContent = `${this.closed.length} transaksi · ${this.formatCompactPrice(total)}`;
    }
  }

  renderCustomers() {
    if (!this.customerList) return;
    const rows = this.leads.filter((lead) => {
      const unit = crmResolveUnit(lead.unitId);
      const haystack = `${lead.name} ${crmUnitLabel(unit)} ${lead.handler}`.toLocaleLowerCase("id");
      return haystack.includes(this.customerQuery);
    });
    this.customerList.innerHTML = rows.length
      ? rows
          .map((lead) => {
            const unit = crmResolveUnit(lead.unitId);
            return `
              <tr data-lead-id="${lead.id}" tabindex="0" role="button" aria-label="Buka detail ${lead.name}">
                <td><b>${lead.name}</b><small class="crm-muted">${lead.phone || "—"}</small></td>
                <td>${crmUnitLabel(unit)}</td>
                <td><span class="crm-stage-badge ${lead.stage}">${crmStageConfig[lead.stage].label}</span></td>
                <td><span class="crm-source-badge ${lead.source}">${this.sourceLabel(lead.source)}</span></td>
                <td>${lead.handler}</td>
                <td><b>${lead.score}</b></td>
              </tr>`;
          })
          .join("")
      : `<tr><td colspan="6" class="crm-empty-cell">Tidak ada customer pada pencarian ini.</td></tr>`;
  }

  renderAutoFollow() {
    const active = this.programs.filter((p) => p.active).length;
    const covered = this.programs.reduce((s, p) => s + p.contacts, 0);
    const week = 34 + this.cycleRun * 6;
    const rate = Math.min(48, 31 + this.cycleRun * 4);
    const setText = (sel, v) => {
      const el = this.root.querySelector(sel);
      if (el) el.textContent = v;
    };
    setText("[data-crm-af-active]", String(active));
    setText("[data-crm-af-covered]", String(covered));
    setText("[data-crm-af-week]", String(week));
    setText("[data-crm-af-rate]", `${rate}%`);

    if (!this.afList) return;
    this.afList.innerHTML = this.programs
      .map(
        (p) => `
        <article class="crm-af-card ${p.active ? "is-active" : ""}">
          <div class="crm-af-card-head">
            <div>
              <span class="crm-af-type">${p.type}</span>
              <h3>${p.name}</h3>
            </div>
            <em class="${p.active ? "on" : "off"}">${p.active ? "Aktif" : "Nonaktif"}</em>
          </div>
          <div class="crm-af-card-meta">
            <span>${p.channel}</span>
            <span>${p.schedule}</span>
            <span>${p.contacts} lead</span>
          </div>
          <p class="crm-af-note">Simulasi tenant demo · tidak mengirim ke channel nyata</p>
        </article>`,
      )
      .join("");
  }

  runAutoFollowCycle() {
    this.cycleRun += 1;
    const stale = this.leads
      .filter((l) => l.days >= 7 && !l.followedUp)
      .sort((a, b) => b.days - a.days)[0];
    if (stale) {
      const nextStage = { cold: "warm", warm: "hot", hot: "prospect", prospect: "prospect" };
      const old = stale.stage;
      stale.stage = nextStage[stale.stage];
      stale.score = Math.min(95, stale.score + 12);
      stale.days = 0;
      stale.followedUp = true;
      stale.events.unshift({
        icon: "AI",
        title: "Auto Follow siklus dijalankan",
        detail: `Program · ${old} → ${stale.stage}`,
        time: "baru saja",
      });
      this.toast.querySelector("b").textContent = `Siklus follow-up: ${stale.name}`;
      this.toast.querySelector("p").textContent =
        `Lead naik ke ${crmStageConfig[stale.stage].label}. Pesan tidak dikirim ke nomor nyata.`;
    } else {
      this.toast.querySelector("b").textContent = "Siklus follow-up selesai";
      this.toast.querySelector("p").textContent =
        "Tidak ada lead stale tersisa. Metrik program diperbarui (simulasi).";
    }
    this.toast.hidden = false;
    this.render();
  }

  handleLeadActivation(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-lead-id]");
    if (!card) return;
    if (event.type === "keydown") event.preventDefault();
    this.openDetail(card.dataset.leadId);
  }

  openDetail(leadId, options = {}) {
    const lead = this.leads.find((item) => item.id === leadId);
    if (!lead) return;
    this.selectedId = lead.id;
    if (!options.keepGuide) this.closeGuide();
    this.populateDetail(lead);
    this.detailBackdrop.hidden = false;
    this.detailPanel.classList.add("is-open");
    this.detailPanel.setAttribute("aria-hidden", "false");
    if (!options.keepGuide) {
      this.detailPanel.querySelector("[data-close-crm-detail]")?.focus();
    }
  }

  populateDetail(lead) {
    const unit = crmResolveUnit(lead.unitId);
    const unitLabel = crmUnitLabel(unit);
    const value = crmLeadValue(lead);

    this.root.querySelector("[data-crm-detail-name]").textContent = lead.name;
    this.root.querySelector("[data-crm-detail-unit]").textContent = unitLabel;

    const stageBadge = this.root.querySelector("[data-crm-detail-stage]");
    stageBadge.className = `crm-stage-badge ${lead.stage}`;
    stageBadge.textContent = crmStageConfig[lead.stage].label;

    const sourceBadge = this.root.querySelector("[data-crm-detail-source]");
    sourceBadge.className = `crm-source-badge ${lead.source}`;
    sourceBadge.textContent = this.sourceLabel(lead.source);

    this.root.querySelector("[data-crm-detail-score]").textContent = `Skor ${lead.score}/100`;

    const intentBadge = this.root.querySelector("[data-crm-detail-intent]");
    if (lead.intent && crmIntentLabels[lead.intent]) {
      intentBadge.hidden = false;
      intentBadge.textContent = crmIntentLabels[lead.intent];
    } else {
      intentBadge.hidden = true;
    }

    this.root.querySelector("[data-crm-detail-value]").textContent = this.formatCompactPrice(value);
    this.root.querySelector("[data-crm-detail-days]").textContent = `${lead.days} hari`;
    this.root.querySelector("[data-crm-detail-handler]").textContent = lead.handler;
    this.root.querySelector("[data-crm-handler-mode]").textContent = lead.ai
      ? "AI Bot (aktif)"
      : "Handler manual";
    this.root.querySelector("[data-crm-handler-icon]").textContent = lead.ai ? "AI" : "MR";
    this.root.querySelector("[data-crm-handler-icon]").className =
      `crm-handler-icon ${lead.ai ? "ai" : "human"}`;

    this.root.querySelector("[data-crm-unit-title]").textContent = unitLabel;
    this.root.querySelector("[data-crm-unit-status]").textContent = unit?.status || "—";
    this.root.querySelector("[data-crm-unit-plate]").textContent = unit?.plate || "—";
    this.root.querySelector("[data-crm-unit-branch]").textContent = unit
      ? `${unit.branch} · ${unit.position}`
      : "—";
    this.root.querySelector("[data-crm-unit-year]").textContent = unit ? String(unit.year) : "—";
    this.root.querySelector("[data-crm-unit-color]").textContent = unit?.color || "—";
    this.root.querySelector("[data-crm-unit-trans]").textContent = unit?.transmission || "—";
    this.root.querySelector("[data-crm-unit-odo]").textContent = unit
      ? `${unit.odometer.toLocaleString("id-ID")} km`
      : "—";
    this.root.querySelector("[data-crm-unit-features]").innerHTML = (unit?.features || [])
      .slice(0, 4)
      .map((f) => `<span>${f}</span>`)
      .join("");

    this.root.querySelector("[data-crm-detail-summary]").textContent = lead.summary;
    this.root.querySelector("[data-crm-detail-recommendation]").textContent = lead.recommendation;
    this.root.querySelector("[data-crm-message]").textContent = lead.message;
    this.root.querySelector("[data-crm-timeline]").innerHTML = lead.events
      .map(
        (event) => `
          <div class="crm-timeline-item">
            <span>${event.icon}</span>
            <div><b>${event.title}</b><small>${event.detail}</small></div>
            <time>${event.time}</time>
          </div>
        `,
      )
      .join("");
    this.messagePreview.hidden = true;
    this.prepareButton.disabled = Boolean(lead.followedUp);
    this.prepareButton.textContent = lead.followedUp
      ? "Follow-up sudah disimulasikan"
      : "Siapkan follow-up AI";
    const sendButton = this.root.querySelector("[data-crm-send-followup]");
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = "Kirim simulasi";
    }
  }

  closeDetail() {
    this.detailPanel.classList.remove("is-open");
    this.detailPanel.setAttribute("aria-hidden", "true");
    this.detailBackdrop.hidden = true;
    this.messagePreview.hidden = true;
  }

  prepareFollowup() {
    const lead = this.leads.find((item) => item.id === this.selectedId);
    if (!lead || lead.followedUp) return;
    this.messagePreview.hidden = false;
    this.root.querySelector("[data-crm-send-followup]")?.focus();
  }

  async sendFollowup() {
    const lead = this.leads.find((item) => item.id === this.selectedId);
    if (!lead || lead.followedUp) return;
    const unit = crmResolveUnit(lead.unitId);
    const sendButton = this.root.querySelector("[data-crm-send-followup]");
    sendButton.disabled = true;
    sendButton.textContent = "Menyimpan ke tenant demo…";
    try {
      await publicDemoData.submit("crm_followup", {
        message: lead.message,
        unit_interest: crmUnitLabel(unit),
      });
    } catch (error) {
      sendButton.disabled = false;
      sendButton.textContent = "Kirim simulasi";
      this.toast.querySelector("b").textContent = "Follow-up belum tersimpan";
      this.toast.querySelector("p").textContent = error.message;
      this.toast.hidden = false;
      return;
    }
    const nextStage = { cold: "warm", warm: "hot", hot: "prospect", prospect: "prospect" };
    const oldScore = lead.score;
    lead.stage = nextStage[lead.stage];
    lead.score = Math.min(95, lead.score + 22);
    lead.days = 0;
    lead.followedUp = true;
    lead.summary =
      "Follow-up simulasi mendapat respons positif. Lead meminta rincian berikutnya dan kini masuk prioritas tinggi.";
    lead.recommendation = "Hubungi secara personal untuk mengunci jadwal test drive.";
    lead.events.unshift(
      {
        icon: "✓",
        title: "Lead merespons positif (simulasi)",
        detail: "Stage dan skor diperbarui",
        time: "baru saja",
      },
      {
        icon: "AI",
        title: "Follow-up AI dicatat",
        detail: "Tersimpan di tenant demo; tidak dikirim ke channel nyata",
        time: "baru saja",
      },
    );
    this.mobileStage = lead.stage;
    this.render();
    this.populateDetail(lead);
    this.toast.querySelector("b").textContent = `Lead naik menjadi ${crmStageConfig[lead.stage].label}`;
    this.toast.querySelector("p").textContent =
      `Skor ${lead.name} berubah ${oldScore} → ${lead.score}; aktivitas tercatat di tenant demo.`;
    this.toast.hidden = false;
  }

  sourceLabel(source) {
    if (source === "excel_import") return "Excel";
    if (source === "walk_in") return "Walk-in";
    if (source === "whatsapp") return "WhatsApp";
    if (source === "instagram") return "Instagram";
    if (source === "facebook") return "Facebook";
    return source;
  }

  formatCompactPrice(value) {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
    }
    return `Rp ${(value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} jt`;
  }
}

const crmDemoMount = document.getElementById("crmDemo");
if (crmDemoMount) {
  new AutopilotCRMDemo(crmDemoMount);
}

const omniPipelineOrder = ["cold", "warm", "hot", "book"];

const omniDemoSeed = () => [
  {
    id: "omni-nadia",
    name: "Nadia Demo",
    phone: "62812****901",
    channel: "whatsapp",
    tag: "hot",
    bucket: "ai",
    aiAgeBucket: "under_12_hours",
    handlerName: "Jasmine AI",
    mrName: "",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "hot",
    preview: "Cari mobil keluarga budget 250 juta",
    time: "10:42",
    location: "BSD",
    unit: "Mitsubishi Xpander Ultimate",
    budget: "Budget ~Rp 250 jt",
    notes: "Keluarga 4 orang, butuh kabin luas",
    messages: [
      { role: "customer", content: "Saya cari mobil keluarga budget sekitar 250 juta. Ada rekomendasi?", time: "10:41" },
      {
        role: "assistant",
        content:
          "Ada dua pilihan dari stok demo: Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Lebih penting kabin luas atau efisiensi cicilan, Kak?",
        time: "10:42",
      },
    ],
    history: [
      { label: "Lead masuk dari WhatsApp", time: "10:40" },
      { label: "AI membalas rekomendasi unit", time: "10:42" },
    ],
  },
  {
    id: "omni-rizky",
    name: "Rizky Ramadhan",
    phone: "62813****112",
    channel: "instagram",
    tag: "warm",
    bucket: "ai",
    aiAgeBucket: "under_3_days",
    handlerName: "Jasmine AI",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "Mau test drive besok sore",
    time: "Kemarin",
    location: "Jakarta Selatan",
    unit: "Suzuki Ertiga Hybrid",
    budget: "Cicilan ringan",
    notes: "",
    messages: [
      { role: "customer", content: "Unit Ertiga Hybrid masih ada? Saya mau test drive besok sore.", time: "10:17" },
      {
        role: "assistant",
        content:
          "Unit tersedia di data demo. Minat test drive saya tandai sebagai WARM→HOT dan siapkan konteks untuk Call Center. Besok sekitar pukul berapa, Kak?",
        time: "10:18",
      },
    ],
    history: [
      { label: "Lead masuk Instagram", time: "10:15" },
      { label: "AI deteksi minat test drive", time: "10:18" },
    ],
  },
  {
    id: "omni-bayu",
    name: "Bayu Prakoso",
    phone: "62821****440",
    channel: "whatsapp",
    tag: "hot",
    bucket: "pending",
    handlerName: "—",
    mrName: "",
    priority: "tinggi",
    escalated: true,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "hot",
    preview: "Minta human agent sekarang",
    time: "09:50",
    location: "Depok",
    unit: "Toyota Raize",
    budget: "Cash / credit",
    notes: "Customer minta human",
    messages: [
      { role: "customer", content: "Tolong sambungkan ke agent manusia, saya mau nego serius.", time: "09:49" },
      {
        role: "assistant",
        content: "Baik Kak, saya eskalasi ke Call Center. Agent akan segera mengambil alih percakapan ini.",
        time: "09:50",
      },
    ],
    history: [
      { label: "AI menangani awal", time: "09:30" },
      { label: "Eskalasi: minta human agent", time: "09:50" },
    ],
  },
  {
    id: "omni-sinta",
    name: "Sinta Maharani",
    phone: "62878****221",
    channel: "messenger",
    tag: "book",
    bucket: "mr",
    handlerName: "MR Dimas",
    mrName: "Dimas Pratama",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: true,
    pinned: false,
    closed: false,
    pipelineStage: "book",
    preview: "Handoff → MR Dimas (belum balas)",
    time: "09:20",
    location: "Tangerang",
    unit: "Honda BR-V",
    budget: "Trade-in",
    notes: "Handoff HOT + booking intent",
    messages: [
      { role: "customer", content: "Kalau beli BR-V bisa trade-in mobil lama?", time: "09:10" },
      { role: "assistant", content: "Bisa dibantu estimasi awal. Saya serahkan ke MR untuk follow-up closing.", time: "09:12" },
      { role: "agent", content: "Call Center: konteks trade-in dicatat. Handoff ke MR Dimas.", time: "09:15" },
      { role: "system", content: "Handoff oleh Agent Demo ke MR Dimas Pratama", time: "09:15" },
    ],
    history: [
      { label: "Takeover Call Center", time: "09:14" },
      { label: "Handoff ke MR Dimas Pratama", time: "09:15" },
      { label: "MR belum membalas", time: "09:20" },
    ],
  },
  {
    id: "omni-laras",
    name: "Laras Wulandari",
    phone: "62856****778",
    channel: "whatsapp",
    tag: "cold",
    bucket: "call_center",
    handlerName: "Agent Demo (Saya)",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: true,
    closed: false,
    pipelineStage: "cold",
    preview: "Follow-up budget Rocky",
    time: "08:47",
    location: "Bekasi",
    unit: "Daihatsu Rocky",
    budget: "Masih bandingkan",
    notes: "Pin — follow-up sore",
    messages: [
      { role: "customer", content: "Ada paket pembiayaan untuk Rocky?", time: "08:40" },
      { role: "assistant", content: "Ada beberapa opsi. Saya hubungkan ke agent untuk hitung cicilan resmi.", time: "08:42" },
      { role: "agent", content: "Halo Kak Laras, saya dari Call Center. Boleh sebutkan target DP dan tenor?", time: "08:47" },
    ],
    history: [
      { label: "AI domain finance", time: "08:42" },
      { label: "Takeover Agent Demo", time: "08:47" },
    ],
  },
  {
    id: "omni-alya",
    name: "Alya Putri",
    phone: "62852****614",
    channel: "instagram",
    tag: "warm",
    bucket: "call_center",
    handlerName: "Agent Demo (Saya)",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "Tanya promo dari Instagram",
    time: "08:32",
    location: "Jakarta Barat",
    unit: "Honda City Hatchback",
    budget: "Cicilan Rp 5–6 jt",
    notes: "Percakapan Instagram ditangani Call Center",
    messages: [
      { role: "customer", content: "Saya lihat promo City Hatchback di Instagram. Cicilannya mulai berapa?", time: "08:25" },
      { role: "assistant", content: "Saya teruskan ke Call Center agar simulasi cicilannya bisa disesuaikan.", time: "08:26" },
      { role: "agent", content: "Halo Kak Alya, saya bantu dari Call Center. Boleh info target DP dan tenor yang diinginkan?", time: "08:32" },
    ],
    history: [
      { label: "Lead masuk dari Instagram", time: "08:25" },
      { label: "Takeover Agent Demo", time: "08:32" },
    ],
  },
  {
    id: "omni-yusuf",
    name: "Yusuf Maulana",
    phone: "62822****735",
    channel: "messenger",
    tag: "hot",
    bucket: "call_center",
    handlerName: "Agent Demo (Saya)",
    mrName: "",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "hot",
    preview: "Follow-up stok dari Facebook",
    time: "08:18",
    location: "Bogor",
    unit: "Toyota Avanza G CVT",
    budget: "Budget Rp 250 jt",
    notes: "Percakapan Facebook ditangani Call Center",
    messages: [
      { role: "customer", content: "Saya chat dari Facebook. Avanza G CVT yang di posting masih tersedia?", time: "08:12" },
      { role: "assistant", content: "Saya eskalasi ke Call Center untuk konfirmasi stok dan lokasi unit.", time: "08:13" },
      { role: "agent", content: "Halo Kak Yusuf, unitnya masih tercatat tersedia. Saya bantu cek cabang terdekat dari Bogor ya.", time: "08:18" },
    ],
    history: [
      { label: "Lead masuk dari Facebook", time: "08:12" },
      { label: "Takeover Agent Demo", time: "08:18" },
    ],
  },
  {
    id: "omni-farhan",
    name: "Farhan Rizki",
    phone: "62811****330",
    channel: "messenger",
    tag: "warm",
    bucket: "ai",
    aiAgeBucket: "over_3_days",
    handlerName: "Jasmine AI",
    mrName: "",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "Bandingkan HR-V dan Xpander",
    time: "4 hari lalu",
    location: "Bandung",
    unit: "HR-V / Xpander",
    budget: "250–300 jt",
    notes: "",
    messages: [
      { role: "customer", content: "Untuk keluarga lebih cocok HR-V atau Xpander?", time: "Kemarin" },
      {
        role: "assistant",
        content:
          "Saya bisa bantu membandingkan dari kebutuhan dan data unit. Berapa jumlah penumpang rutin, Kak?",
        time: "Kemarin",
      },
    ],
    history: [{ label: "Lead masuk Messenger", time: "Kemarin" }],
  },
  {
    id: "omni-maya",
    name: "Maya Lestari",
    phone: "62857****901",
    channel: "instagram",
    tag: "cold",
    bucket: "mr",
    handlerName: "MR Sari",
    mrName: "Sari Wijaya",
    priority: "normal",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "warm",
    preview: "MR sudah balas lokasi showroom",
    time: "Kemarin",
    location: "Bintaro",
    unit: "Showroom visit",
    budget: "—",
    notes: "MR sudah respons",
    messages: [
      { role: "customer", content: "Showroom terdekat dari Bintaro di mana?", time: "Kemarin" },
      { role: "assistant", content: "Saya cek lokasi resmi… menyerahkan ke MR area.", time: "Kemarin" },
      { role: "mr", content: "Halo Kak Maya, saya Sari. Showroom Bintaro buka 09–17, bisa saya bookingkan slot?", time: "Kemarin" },
    ],
    history: [
      { label: "Handoff ke MR Sari", time: "Kemarin" },
      { label: "MR membalas", time: "Kemarin" },
    ],
  },
  {
    id: "omni-andi",
    name: "Andi Saputra",
    phone: "62819****555",
    channel: "whatsapp",
    tag: "book",
    bucket: "call_center",
    handlerName: "Agent Rina",
    mrName: "",
    priority: "tinggi",
    escalated: false,
    mrUnanswered: false,
    pinned: false,
    closed: false,
    pipelineStage: "book",
    preview: "Booking Toyota Rush — agent lain",
    time: "Senin",
    location: "Serpong",
    unit: "Toyota Rush G AT",
    budget: "Siap booking",
    notes: "Ditangani Agent Rina",
    claimedByOther: true,
    messages: [
      { role: "customer", content: "Saya sudah cocok dengan Rush, mau booking.", time: "Senin" },
      { role: "agent", content: "Siap Kak Andi, saya Rina bantu proses booking unit demo.", time: "Senin" },
    ],
    history: [
      { label: "HOT → BOOK", time: "Senin" },
      { label: "Claim Agent Rina", time: "Senin" },
    ],
  },
];

const omniTutorialSteps = [
  {
    title: "Selamat datang — 2 role dalam omnichannel",
    body: "Demo ini meniru Call Center produksi (3 kolom dense). Ada dua role manusia: Call Center (operator inbox) dan MR (sales penutup deal). AI menangani percakapan dulu, lalu bisa di-takeover dan di-handoff.",
    fanel: "ai",
    contactId: "omni-nadia",
    ctxTab: "detail",
  },
  {
    title: "Role 1 — Bucket Call Center",
    body: "Bucket Call Center, Marketing Representative, dan Ditangani AI mengikuti produksi. Klik header atau sub-bucket untuk buka/tutup daftar chat.",
    fanel: "ai",
    contactId: "omni-nadia",
    ctxTab: "detail",
  },
  {
    title: "Ambil alih dari AI",
    body: "Ketik pesan atau aksi takeover memindahkan lead ke bucket Call Center. Banner status berubah; agent bisa pakai Aksi Cepat.",
    fanel: "ai",
    contactId: "omni-nadia",
    ctxTab: "detail",
    action: "takeover",
  },
  {
    title: "Aksi Cepat + Detail / Riwayat / Pipeline",
    body: "Simulasi Kredit, Cek Inventori, Tanya Falcon — sama produksi. Panel kanan: Detail Lead, Pipeline COLD→BOOK, dan tab Riwayat audit.",
    fanel: "mine",
    contactId: "omni-nadia",
    ctxTab: "riwayat",
  },
  {
    title: "Handoff ke MR (sesuai produksi)",
    body: "Tombol Handoff menyerahkan lead ke Marketing Representative. Bucket menjadi MR; badge MR BELUM BALAS muncul sampai MR membalas.",
    fanel: "mine",
    contactId: "omni-nadia",
    ctxTab: "detail",
    action: "handoff",
  },
  {
    title: "Role 2 — UI MR (preview)",
    body: "MR punya workspace Percakapan sendiri (bukan inbox Call Center). Konteks lead terbawa. Di production: sales follow-up & closing. Lihat preview UI MR.",
    fanel: "all",
    contactId: "omni-nadia",
    ctxTab: "detail",
    action: "mr_preview",
  },
  {
    title: "AI Trace (ex AI Lab) + CRM terpisah",
    body: "Tab AI Trace menampilkan router, tool, grounding, dan guardrail (merge AI Lab). Pipeline CRM sales ada di demo Autopilot CRM terpisah di landing — stage lead di Call Center selaras narasi CRM.",
    fanel: "all",
    contactId: "omni-nadia",
    ctxTab: "trace",
  },
];

class OmnichannelAIDemo {
  constructor(root) {
    this.root = root;
    this.contacts = this.cloneSeed();
    this.activeContactId = "omni-nadia";
    this.fanel = "all";
    this.channel = "all";
    this.tagFilter = new Set();
    this.selectedIds = new Set();
    this.mrFilter = "all";
    this.collapsedBuckets = new Set([
      "call_center",
      "mr_pending",
      "mr_done",
      "ai_under_12",
      "ai_under_3",
      "ai_over_3",
    ]);
    this.bucketItems = new Map();
    this.contextOpen = true;
    this.ctxTab = "detail";
    this.lastFocusedElement = null;
    this.tutorialStep = 0;
    this.tutorialActive = false;
    this.hasOpenedGuide = false;
    this.entryContext = "call-center";
    this.lastEntryContext = "";
    this.agentName = "Agent Demo";

    this.contactList = root.querySelector("[data-omni-contact-list]");
    this.chatLog = root.querySelector("[data-omni-chat-log]");
    this.input = root.querySelector("[data-omni-input]");
    this.form = root.querySelector("[data-omni-form]");
    this.toast = root.querySelector("[data-omni-toast]");
    this.searchInput = root.querySelector("[data-omni-search]");

    this.defaultTrace = {
      domain: "query",
      risk: "low",
      effect: "read_only",
      router: "Memilih domain query dari konteks percakapan.",
      tool: "inventory.search · read_only",
      grounding: "Jawaban hanya memakai hasil data demo.",
      evalTitle: "Skenario pencarian stok",
      blocked: false,
      assertions: [
        "Domain routing sesuai",
        "Data source terverifikasi",
        "Tidak ada side effect",
        "Data sensitif tidak bocor",
      ],
    };
    this.trace = { ...this.defaultTrace, assertions: [...this.defaultTrace.assertions] };

    this.tour = new DemoProductTour(root, {
      ns: "omni",
      anchorAttr: "data-omni-anchor",
      getSteps: () => this.guideSteps(),
      getStepLabel: (step, index, total) => {
        const viewLabel = step.label || "Call Center";
        return total > 1
          ? `${String(viewLabel).toUpperCase()} · LANGKAH ${index} DARI ${total}`
          : String(viewLabel).toUpperCase();
      },
    });

    this.bind();
    this.render();
  }

  guideSteps() {
    const entryCopy = {
      omnichannel: {
        label: "Omnichannel",
        title: "Satu inbox untuk seluruh channel",
        body: "WhatsApp, Facebook Messenger, dan Instagram masuk ke workspace yang sama. Filter channel, bucket AI/agent/MR, serta konteks lead tetap tersambung.",
      },
      "customer-support": {
        label: "Customer Support",
        title: "Dari antrian sampai resolusi",
        body: "Mode Customer Support menyorot antrian, takeover, eskalasi, riwayat, dan penyelesaian lead. SLA multi-cabang lanjutan tetap ditandai sebagai pengembangan, bukan fitur penuh demo.",
      },
      "call-center": {
        label: "Call Center",
        title: "Workspace operator omnichannel",
        body: "Demo meniru Call Center produksi (3 kolom): AI menangani baseload, agent takeover, memakai aksi cepat, lalu handoff ke MR tanpa kehilangan konteks.",
      },
    }[this.entryContext] || null;
    const steps = [
      {
        anchor: "queue",
        label: entryCopy?.label || "Call Center",
        title: entryCopy?.title || "Selamat datang — 2 role omnichannel",
        body: entryCopy?.body || "Demo meniru Call Center produksi (3 kolom). Dua role: Call Center (inbox) dan MR (sales). AI menangani dulu, lalu takeover & handoff.",
        enter: () => {
          this.fanel = "ai";
          this.activeContactId = "omni-nadia";
          this.ctxTab = "detail";
          this.render();
        },
      },
      {
        anchor: "buckets",
        label: "Bucket",
        title: "Bucket Call Center produksi",
        body: "Klik header Call Center, Marketing Representative, atau Ditangani AI untuk buka/tutup bucket. Sub-bucket MR dan umur penanganan AI juga interaktif seperti di Motovax.",
        enter: () => {
          this.fanel = "all";
          this.collapsedBuckets.delete("ai");
          this.collapsedBuckets.delete("ai_under_12");
          this.activeContactId = "omni-nadia";
          this.render();
        },
      },
      {
        anchor: "jasmine",
        label: "Jasmine AI",
        title: "AI Sales Consultant dari discovery sampai HOT",
        body: "Jalankan empat tahap Jasmine: gali kebutuhan, cek stok terverifikasi, kualifikasi finance tanpa mengarang angka, lalu siapkan handoff kontekstual ke MR.",
        enter: () => {
          this.fanel = "ai";
          this.activeContactId = "omni-nadia";
          this.ctxTab = "trace";
          this.render();
        },
      },
      {
        anchor: "chat",
        label: "Percakapan",
        title: "Ambil alih dari AI",
        body: "Ketik pesan atau takeover memindahkan lead ke bucket Call Center. Banner status berubah; agent bisa pakai Aksi Cepat.",
        enter: () => {
          this.fanel = "ai";
          this.activeContactId = "omni-nadia";
          this.takeoverContact("omni-nadia");
          this.render();
        },
      },
      {
        anchor: "aksi",
        label: "Aksi Cepat",
        title: "Aksi Cepat + Detail / Riwayat",
        body: "Simulasi Kredit, Cek Inventori, Tanya Falcon — sama produksi. Panel kanan: Detail Lead, Pipeline COLD→BOOK, dan tab Riwayat.",
        enter: () => {
          this.fanel = "mine";
          this.activeContactId = "omni-nadia";
          this.ctxTab = "riwayat";
          this.render();
        },
      },
      {
        anchor: "handoff",
        label: "Handoff MR",
        title: "Handoff ke MR",
        body: "Tombol Handoff menyerahkan lead ke Marketing Representative. Bucket menjadi MR; badge MR BELUM BALAS sampai MR membalas.",
        enter: () => {
          this.fanel = "mine";
          this.activeContactId = "omni-nadia";
          this.ctxTab = "detail";
          const c = this.activeContact();
          if (c && c.bucket !== "mr") {
            const mr = "Dimas Pratama";
            c.bucket = "mr";
            c.mrName = mr;
            c.handlerName = `MR ${mr.split(" ")[0]}`;
            c.mrUnanswered = true;
            c.claimedByOther = false;
            if (c.pipelineStage === "cold" || c.pipelineStage === "warm") {
              c.pipelineStage = "hot";
              c.tag = "hot";
            }
            c.notes = "Tutorial: HOT + test drive";
            c.messages.push({
              role: "system",
              content: `Handoff oleh Agent Demo ke MR ${mr} · alasan: tutorial`,
              time: "baru saja",
            });
            c.history.push({ label: `Handoff ke MR ${mr}`, time: "baru saja" });
            c.preview = `Handoff → MR ${mr.split(" ")[0]}`;
            this.fanel = "all";
            this.collapsedBuckets.delete("mr");
            this.collapsedBuckets.delete("mr_pending");
          }
          this.render();
        },
      },
      {
        anchor: "context",
        label: "Detail Lead",
        title: "Role MR (preview)",
        body: "MR punya workspace Percakapan sendiri. Konteks lead terbawa. Di production: sales follow-up & closing. Buka preview UI MR dari kartu Role MR.",
        enter: () => {
          this.fanel = "all";
          this.activeContactId = "omni-nadia";
          this.ctxTab = "detail";
          this.render();
        },
      },
      {
        anchor: "trace",
        label: "AI Trace",
        title: "AI Trace + CRM terpisah",
        body: "Tab AI Trace menampilkan router, tool, grounding, dan guardrail. Pipeline CRM sales ada di demo Autopilot CRM terpisah. Selesai — eksplor bebas.",
        enter: () => {
          this.fanel = "all";
          this.activeContactId = "omni-nadia";
          this.ctxTab = "trace";
          this.render();
        },
      },
    ];

    if (this.entryContext === "omnichannel") {
      return [steps[0], steps[1], steps[2], steps[3], steps[5]];
    }
    if (this.entryContext === "customer-support") {
      const supportSteps = [steps[0], steps[3], steps[4], steps[5], steps[7]];
      supportSteps[2] = {
        ...supportSteps[2],
        label: "Resolusi",
        title: "Riwayat, status, dan aksi penyelesaian",
        body: "Panel kanan menyimpan Detail Lead dan Riwayat. Agent dapat memakai simulasi kredit/inventori, eskalasi, close lead, serta membaca jejak handoff sebagai dasar monitoring layanan.",
      };
      supportSteps[4] = {
        ...supportSteps[4],
        label: "Performa",
        title: "Performa layanan yang terhubung",
        body: "Data antrian dan hasil percakapan mengalir ke analytics serta Agent Scorecard. Routing SLA multi-cabang yang lebih lanjut tetap ditandai sebagai roadmap.",
        enter: () => {
          this.ctxTab = "riwayat";
          this.contextOpen = true;
          this.render();
        },
      };
      return supportSteps;
    }
    return steps;
  }

  cloneSeed() {
    return omniDemoSeed().map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({ ...m })),
      history: c.history.map((h) => ({ ...h })),
    }));
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-omni-demo]")) {
      button.addEventListener("click", (event) => {
        if (button instanceof HTMLAnchorElement) event.preventDefault();
        this.open(button);
      });
    }
    for (const button of this.root.querySelectorAll("[data-close-omni-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-omni-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-close-omni-toast]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    this.searchInput.addEventListener("input", () => this.render());

    for (const button of this.root.querySelectorAll("[data-omni-channel]")) {
      button.addEventListener("click", () => {
        this.channel = button.dataset.omniChannel || "all";
        this.ensureActiveVisible();
        this.render();
      });
    }

    this.root.querySelector("[data-omni-tag-filter]").addEventListener("click", () => {
      const chips = this.root.querySelector("[data-omni-tag-chips]");
      chips.hidden = !chips.hidden;
      if (!chips.dataset.ready) {
        chips.dataset.ready = "1";
        for (const tag of ["cold", "warm", "hot", "book"]) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = tag.toUpperCase();
          b.dataset.tag = tag;
          b.addEventListener("click", () => {
            if (this.tagFilter.has(tag)) this.tagFilter.delete(tag);
            else this.tagFilter.add(tag);
            b.classList.toggle("on", this.tagFilter.has(tag));
            this.render();
          });
          chips.appendChild(b);
        }
      }
    });

    this.contactList.addEventListener("click", (event) => {
      const bucketToggle = event.target.closest("[data-omni-toggle-bucket]");
      if (bucketToggle) {
        const key = bucketToggle.dataset.omniToggleBucket;
        if (this.collapsedBuckets.has(key)) this.collapsedBuckets.delete(key);
        else this.collapsedBuckets.add(key);
        this.renderContacts();
        return;
      }
      const selectGroup = event.target.closest("[data-omni-select-group]");
      if (selectGroup) {
        event.stopPropagation();
        const items = this.bucketItems.get(selectGroup.dataset.omniSelectGroup) || [];
        for (const contact of items) this.selectedIds.add(contact.id);
        this.render();
        return;
      }
      const claim = event.target.closest("[data-omni-claim]");
      if (claim) {
        event.stopPropagation();
        this.takeoverContact(claim.dataset.omniClaim);
        return;
      }
      const pin = event.target.closest("[data-omni-pin]");
      if (pin) {
        event.stopPropagation();
        const c = this.contacts.find((x) => x.id === pin.dataset.omniPin);
        if (c) c.pinned = !c.pinned;
        this.render();
        return;
      }
      const check = event.target.closest("[data-omni-select]");
      if (check) {
        event.stopPropagation();
        const id = check.dataset.omniSelect;
        if (check.checked) this.selectedIds.add(id);
        else this.selectedIds.delete(id);
        this.renderBulkBar();
        return;
      }
      const row = event.target.closest("[data-omni-contact]");
      if (!row) return;
      this.activeContactId = row.dataset.omniContact;
      this.render();
    });
    this.contactList.addEventListener("change", (event) => {
      const filter = event.target.closest("[data-omni-mr-filter]");
      if (!filter) return;
      this.mrFilter = filter.value || "all";
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-omni-prompt]")) {
      button.addEventListener("click", () => this.runPrompt(button.dataset.omniPrompt || "", { asCustomer: true }));
    }
    for (const button of this.root.querySelectorAll("[data-omni-jasmine]")) {
      button.addEventListener("click", () => this.runJasmineJourney(button.dataset.omniJasmine || "discovery"));
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = this.input.value.trim();
      if (!message) return;
      this.runPrompt(message, { asCustomer: false });
    });

    this.root.querySelector("[data-omni-toggle-context]").addEventListener("click", () => this.toggleContext());
    this.root.querySelector("[data-omni-toggle-context-icon]").addEventListener("click", () => this.toggleContext());

    for (const button of this.root.querySelectorAll("[data-omni-ctx-tab]")) {
      button.addEventListener("click", () => {
        this.ctxTab = button.dataset.omniCtxTab || "detail";
        this.renderContextTabs();
      });
    }

    this.root.querySelector("[data-omni-release]").addEventListener("click", () => this.releaseToAI());
    this.root.querySelector("[data-omni-handoff]").addEventListener("click", () => this.openModal("handoff"));
    this.root.querySelector("[data-omni-handoff-submit]").addEventListener("click", () => this.submitHandoff());
    this.root.querySelector("[data-omni-copy]").addEventListener("click", () => this.copyConversation());
    this.root.querySelector("[data-omni-close-lead]").addEventListener("click", () => this.openModal("close"));
    this.root.querySelector("[data-omni-close-submit]").addEventListener("click", () => this.submitCloseLead());
    this.root.querySelector("[data-omni-escalate]").addEventListener("click", () => this.openModal("escalate"));
    this.root.querySelector("[data-omni-escalate-submit]").addEventListener("click", () => this.submitEscalate());

    this.root.querySelector("[data-omni-qa-credit]").addEventListener("click", () => this.openCredit());
    this.root.querySelector("[data-omni-qa-inventory]").addEventListener("click", () => this.openInventory());
    this.root.querySelector("[data-omni-qa-falcon]").addEventListener("click", () => this.openFalcon());
    // MR modal also has credit/inventory buttons - use delegation
    this.root.addEventListener("click", (event) => {
      if (event.target.closest("[data-omni-qa-credit]") && event.target.closest("[data-omni-mr-modal], .cc-mr-chat")) {
        this.openCredit();
      }
      if (event.target.closest("[data-omni-qa-inventory]") && event.target.closest("[data-omni-mr-modal], .cc-mr-chat")) {
        this.openInventory();
      }
    });

    this.root.querySelector("[data-omni-falcon-use]").addEventListener("click", () => {
      const text = this.root.querySelector("[data-omni-falcon-answer]").textContent;
      this.input.value = text;
      this.closeModal("falcon");
      this.input.focus();
    });

    this.root.querySelector("[data-omni-manual-lead]").addEventListener("click", () => this.openModal("manual"));
    this.root.querySelector("[data-omni-manual-submit]").addEventListener("click", () => this.submitManualLead());
    this.root.querySelector("[data-omni-templates]").addEventListener("click", () => {
      this.showSimple("TEMPLATE SUMBER", "Lead Source Templates", "Di produksi, agent memilih template pesan per sumber lead (WA ads, IG, FB). Di demo ini UI disediakan sebagai simulasi.");
    });
    this.root.querySelector("[data-omni-analytics]").addEventListener("click", () => {
      this.showSimple("ANALYTICS", "Performa Call Center (demo)", "Inbox aktif: " + this.contacts.filter((c) => !c.closed).length + " · Ditangani AI: " + this.contacts.filter((c) => c.bucket === "ai" && !c.closed).length + " · MR: " + this.contacts.filter((c) => c.bucket === "mr" && !c.closed).length + " · Escalated: " + this.contacts.filter((c) => c.escalated && !c.closed).length);
    });

    this.root.querySelector("[data-omni-bulk-close]").addEventListener("click", () => {
      if (!this.selectedIds.size) return;
      for (const id of [...this.selectedIds]) {
        const c = this.contacts.find((x) => x.id === id);
        if (c) {
          c.closed = true;
          c.bucket = "closed";
          c.history.push({ label: "Bulk close (demo)", time: "baru saja" });
        }
      }
      this.selectedIds.clear();
      this.showToast("Bulk close", "Lead terpilih ditutup (simulasi).");
      this.render();
    });
    this.root.querySelector("[data-omni-bulk-cancel]").addEventListener("click", () => {
      this.selectedIds.clear();
      this.render();
    });

    this.root.querySelector("[data-omni-open-mr-preview]").addEventListener("click", () => this.openMrPreview());
    // Tutorial diganti product-tour IMS-style (data-omni-guide via DemoProductTour)
    this.root.querySelector("[data-omni-tutorial]")?.addEventListener("click", () => this.openGuide(0));

    for (const el of this.root.querySelectorAll("[data-close-modal]")) {
      el.addEventListener("click", () => this.closeModal(el.dataset.closeModal));
    }

    // Status banner takeover from MR
    this.root.querySelector("[data-omni-status-banner]").addEventListener("click", (event) => {
      const btn = event.target.closest("[data-omni-takeover-mr]");
      if (!btn) return;
      this.takeoverFromMR();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
        return;
      }
      if (this.tour?.isOpen) {
        this.closeGuide();
        return;
      }
      const openModal = this.root.querySelector(".cc-modal-backdrop:not([hidden])");
      if (openModal) {
        openModal.hidden = true;
        return;
      }
      this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    const requestedFrom = new URLSearchParams(window.location.search).get("from") || "";
    const rawContext = trigger?.dataset?.demoContext || requestedFrom;
    this.entryContext = rawContext === "customer-support" || rawContext === "call-center"
      ? rawContext
      : "omnichannel";
    const title = this.root.querySelector("[data-omni-demo-title]");
    const subtitle = this.root.querySelector("[data-omni-demo-subtitle]");
    const copy = {
      omnichannel: ["AI Omnichannel", "WhatsApp · Facebook · Instagram · satu inbox"],
      "customer-support": ["Customer Support & Ticketing", "Antrian · eskalasi · riwayat · performa layanan"],
      "call-center": ["MotoVax Call Center", "Omnichannel · AI · agent · handoff MR"],
    }[this.entryContext];
    if (title) title.textContent = copy[0];
    if (subtitle) subtitle.textContent = `${copy[1]} · DEMO`;
    this.root.dataset.entryContext = this.entryContext;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-omni-demo]").focus();
    this.render();
    if (!this.hasOpenedGuide || this.lastEntryContext !== this.entryContext) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
      this.lastEntryContext = this.entryContext;
    }
  }

  close() {
    this.closeGuide();
    this.toast.hidden = true;
    for (const modal of this.root.querySelectorAll(".cc-modal-backdrop")) modal.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    this.tour?.open(startIndex);
  }

  closeGuide() {
    this.tour?.close();
  }

  reset() {
    this.contacts = this.cloneSeed();
    this.activeContactId = "omni-nadia";
    this.fanel = "all";
    this.channel = "all";
    this.tagFilter.clear();
    this.selectedIds.clear();
    this.mrFilter = "all";
    this.collapsedBuckets = new Set([
      "call_center",
      "mr_pending",
      "mr_done",
      "ai_under_12",
      "ai_under_3",
      "ai_over_3",
    ]);
    this.contextOpen = true;
    this.ctxTab = "detail";
    this.trace = { ...this.defaultTrace, assertions: [...this.defaultTrace.assertions] };
    this.input.value = "";
    this.root.querySelector("[data-omni-jasmine-outcome]").textContent =
      "Pilih tahap untuk melihat cara Jasmine menangani lead tanpa mengirim pesan nyata.";
    for (const button of this.root.querySelectorAll("[data-omni-jasmine]")) button.classList.remove("active");
    this.toast.hidden = true;
    for (const modal of this.root.querySelectorAll(".cc-modal-backdrop")) modal.hidden = true;
    this.render();
    this.showToast("Reset demo", "Data mock Call Center dikembalikan.");
  }

  activeContact() {
    return this.contacts.find((c) => c.id === this.activeContactId) || this.contacts[0];
  }

  toggleContext() {
    this.contextOpen = !this.contextOpen;
    this.root.querySelector(".cc-shell").classList.toggle("context-hidden", !this.contextOpen);
    this.root.querySelector("[data-omni-context-panel]").classList.toggle("is-hidden", !this.contextOpen);
  }

  openModal(name) {
    const map = {
      handoff: "[data-omni-handoff-modal]",
      credit: "[data-omni-credit-modal]",
      inventory: "[data-omni-inventory-modal]",
      falcon: "[data-omni-falcon-modal]",
      close: "[data-omni-close-modal]",
      escalate: "[data-omni-escalate-modal]",
      manual: "[data-omni-manual-modal]",
      simple: "[data-omni-simple-modal]",
      mr: "[data-omni-mr-modal]",
    };
    const sel = map[name];
    if (!sel) return;
    const el = this.root.querySelector(sel);
    if (el) el.hidden = false;
  }

  closeModal(name) {
    const map = {
      handoff: "[data-omni-handoff-modal]",
      credit: "[data-omni-credit-modal]",
      inventory: "[data-omni-inventory-modal]",
      falcon: "[data-omni-falcon-modal]",
      close: "[data-omni-close-modal]",
      escalate: "[data-omni-escalate-modal]",
      manual: "[data-omni-manual-modal]",
      simple: "[data-omni-simple-modal]",
      mr: "[data-omni-mr-modal]",
    };
    const sel = map[name];
    if (sel) this.root.querySelector(sel).hidden = true;
  }

  showSimple(kicker, title, body) {
    this.root.querySelector("[data-omni-simple-kicker]").textContent = kicker;
    this.root.querySelector("[data-omni-simple-title]").textContent = title;
    this.root.querySelector("[data-omni-simple-body]").textContent = body;
    this.openModal("simple");
  }

  showToast(title, body) {
    this.root.querySelector("[data-omni-toast-title]").textContent = title;
    this.root.querySelector("[data-omni-toast-body]").textContent = body;
    this.toast.hidden = false;
  }

  matchesFilters(c) {
    if (c.closed) return false;
    if (this.channel !== "all" && c.channel !== this.channel) return false;
    if (this.tagFilter.size && !this.tagFilter.has(c.tag)) return false;
    const q = (this.searchInput.value || "").trim().toLowerCase();
    if (q && !(`${c.name} ${c.phone} ${c.preview}`.toLowerCase().includes(q))) return false;
    return true;
  }

  ensureActiveVisible() {
    const visible = this.contacts.filter((c) => this.matchesFilters(c));
    if (!visible.some((c) => c.id === this.activeContactId) && visible[0]) {
      this.activeContactId = visible[0].id;
    }
  }

  render() {
    this.ensureActiveVisible();
    this.renderChannelTabs();
    this.renderContacts();
    this.renderChat();
    this.renderDetail();
    this.renderRiwayat();
    this.renderTrace();
    this.renderContextTabs();
    this.renderBulkBar();
    this.root.querySelector(".cc-shell").classList.toggle("context-hidden", !this.contextOpen);
    this.root.querySelector("[data-omni-context-panel]").classList.toggle("is-hidden", !this.contextOpen);
  }

  renderChannelTabs() {
    const base = this.contacts.filter((c) => !c.closed);
    const count = (ch) => base.filter((c) => ch === "all" || c.channel === ch).length;
    this.root.querySelector("[data-omni-ch-all]").textContent = count("all");
    this.root.querySelector("[data-omni-ch-wa]").textContent = count("whatsapp");
    this.root.querySelector("[data-omni-ch-fb]").textContent = count("messenger");
    this.root.querySelector("[data-omni-ch-ig]").textContent = count("instagram");
    for (const button of this.root.querySelectorAll("[data-omni-channel]")) {
      const isActive = button.dataset.omniChannel === this.channel;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    }
  }

  renderBulkBar() {
    const bar = this.root.querySelector("[data-omni-bulk-bar]");
    bar.hidden = this.selectedIds.size === 0;
    this.root.querySelector("[data-omni-bulk-count]").textContent = `${this.selectedIds.size} dipilih`;
  }

  aiAgeBucket(contact) {
    if (contact.aiAgeBucket) return contact.aiAgeBucket;
    const label = String(contact.time || "").toLowerCase();
    const days = Number(label.match(/(\d+)\s*hari/)?.[1] || 0);
    if (days > 3 || label.includes("minggu")) return "over_3_days";
    if (days || label.includes("kemarin")) return "under_3_days";
    return "under_12_hours";
  }

  bucketIcon(kind) {
    const icons = {
      call_center: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></svg>',
      mr: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
      done: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
      ai: '<svg viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="11" rx="2"/><path d="M9 3h6M12 3v4M9 12h.01M15 12h.01M9 16h6"/></svg>',
      timer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 5v3M12 13l3-2"/></svg>',
      list: '<svg viewBox="0 0 24 24"><path d="m3 6 1.5 1.5L7 5M10 6h11M3 12l1.5 1.5L7 11M10 12h11M3 18l1.5 1.5L7 17M10 18h11"/></svg>',
    };
    return icons[kind] || icons.mr;
  }

  renderBucketHeader({ key, title, tone, icon, items, nested = false }) {
    const collapsed = this.collapsedBuckets.has(key);
    this.bucketItems.set(key, items);
    return `
      <div class="cc-bucket-head ${tone}${nested ? " nested" : ""}">
        <button type="button" class="cc-bucket-toggle" data-omni-toggle-bucket="${key}" aria-expanded="${!collapsed}" aria-controls="cc-bucket-${key}">
          <span class="cc-bucket-icon" aria-hidden="true">${this.bucketIcon(icon)}</span>
          <span class="cc-bucket-title">${title}</span>
          <span class="cc-bucket-count">${items.length}</span>
          <span class="cc-bucket-chevron${collapsed ? "" : " is-open"}" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </span>
        </button>
        <button type="button" class="cc-bucket-select" data-omni-select-group="${key}" aria-label="Pilih chat di bucket ${title}" title="Select bucket">
          ${this.bucketIcon("list")}
        </button>
      </div>`;
  }

  renderContactRows(items) {
    if (!items.length) return '<div class="cc-empty cc-bucket-empty">Tidak ada chat di bucket ini.</div>';
    return items
      .map((c) => {
        const classes = ["cc-row"];
        if (c.id === this.activeContactId) classes.push("active");
        if (c.escalated) classes.push("escalated");
        else if (c.mrUnanswered) classes.push("mr-timeout");
        else if (c.bucket === "pending") classes.push("pending");
        const badges = [];
        if (c.escalated) badges.push('<span class="cc-badge-sm es">ESKALASI</span>');
        if (c.mrUnanswered) badges.push('<span class="cc-badge-sm mr">MR BELUM BALAS</span>');
        if (c.bucket === "pending") {
          badges.push(`<button type="button" class="cc-badge-sm claim" data-omni-claim="${c.id}">Ambil</button>`);
        }
        return `
          <div class="${classes.join(" ")}" data-omni-contact="${c.id}" role="button" tabindex="0">
            <input type="checkbox" data-omni-select="${c.id}" ${this.selectedIds.has(c.id) ? "checked" : ""} aria-label="Pilih ${c.name}" />
            <span class="cc-avatar ${c.channel}">${this.initials(c.name)}<i class="dot ${c.channel}"></i></span>
            <span class="cc-row-main">
              <b>${c.name}<span class="cc-tag ${c.tag}">${c.tag.toUpperCase()}</span></b>
              <div class="meta">${c.preview}</div>
              ${badges.join(" ")}
            </span>
            <span class="cc-row-side">
              <span>${c.time}</span>
              <button type="button" class="cc-pin ${c.pinned ? "on" : ""}" data-omni-pin="${c.id}" title="Pin">📌</button>
            </span>
          </div>`;
      })
      .join("");
  }

  renderContacts() {
    let list = this.contacts.filter((c) => this.matchesFilters(c));
    list = [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    this.bucketItems = new Map();
    if (!list.length) {
      this.contactList.innerHTML = '<div class="cc-empty">Tidak ada percakapan pada filter ini.</div>';
      return;
    }

    const callCenter = list.filter((c) => c.bucket === "call_center" || c.bucket === "pending");
    const allMR = list.filter((c) => c.bucket === "mr");
    const mrNames = [...new Set(allMR.map((c) => c.mrName).filter(Boolean))].sort();
    if (this.mrFilter !== "all" && !mrNames.includes(this.mrFilter)) this.mrFilter = "all";
    const visibleMR = this.mrFilter === "all" ? allMR : allMR.filter((c) => c.mrName === this.mrFilter);
    const mrPending = visibleMR.filter((c) => c.mrUnanswered);
    const mrDone = visibleMR.filter((c) => !c.mrUnanswered);
    const ai = list.filter((c) => c.bucket === "ai");
    const aiUnder12 = ai.filter((c) => this.aiAgeBucket(c) === "under_12_hours");
    const aiUnder3 = ai.filter((c) => this.aiAgeBucket(c) === "under_3_days");
    const aiOver3 = ai.filter((c) => this.aiAgeBucket(c) === "over_3_days");
    const html = [];

    if (callCenter.length) {
      html.push(this.renderBucketHeader({ key: "call_center", title: "Call Center", tone: "call-center", icon: "call_center", items: callCenter }));
      html.push(`<section class="cc-bucket-content" id="cc-bucket-call_center"${this.collapsedBuckets.has("call_center") ? " hidden" : ""}>${this.renderContactRows(callCenter)}</section>`);
    }

    if (allMR.length) {
      html.push(this.renderBucketHeader({ key: "mr", title: "Marketing Representative", tone: "mr", icon: "mr", items: visibleMR }));
      const options = mrNames.map((name) => `<option value="${name}"${name === this.mrFilter ? " selected" : ""}>${name}</option>`).join("");
      html.push(`
        <section class="cc-bucket-content" id="cc-bucket-mr"${this.collapsedBuckets.has("mr") ? " hidden" : ""}>
          <label class="cc-mr-filter">
            <span class="cc-visually-hidden">Filter Marketing Representative</span>
            <select data-omni-mr-filter aria-label="Filter Marketing Representative">
              <option value="all">Semua MR</option>${options}
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
          <div class="cc-bucket-nested">
            ${this.renderBucketHeader({ key: "mr_pending", title: "MR Belum Balas", tone: "mr-pending", icon: "mr", items: mrPending, nested: true })}
            <section class="cc-bucket-content" id="cc-bucket-mr_pending"${this.collapsedBuckets.has("mr_pending") ? " hidden" : ""}>${this.renderContactRows(mrPending)}</section>
            ${this.renderBucketHeader({ key: "mr_done", title: "MR Sudah Balas", tone: "mr-done", icon: "done", items: mrDone, nested: true })}
            <section class="cc-bucket-content" id="cc-bucket-mr_done"${this.collapsedBuckets.has("mr_done") ? " hidden" : ""}>${this.renderContactRows(mrDone)}</section>
          </div>
        </section>`);
    }

    if (ai.length) {
      html.push(this.renderBucketHeader({ key: "ai", title: "Ditangani AI", tone: "ai", icon: "ai", items: ai }));
      html.push(`
        <section class="cc-bucket-content" id="cc-bucket-ai"${this.collapsedBuckets.has("ai") ? " hidden" : ""}>
          <div class="cc-bucket-nested ai">
            ${this.renderBucketHeader({ key: "ai_under_12", title: "Ditangani kurang dari 12 jam", tone: "ai-fresh", icon: "timer", items: aiUnder12, nested: true })}
            <section class="cc-bucket-content" id="cc-bucket-ai_under_12"${this.collapsedBuckets.has("ai_under_12") ? " hidden" : ""}>${this.renderContactRows(aiUnder12)}</section>
            ${this.renderBucketHeader({ key: "ai_under_3", title: "Ditangani kurang dari 3 hari", tone: "ai-aging", icon: "mr", items: aiUnder3, nested: true })}
            <section class="cc-bucket-content" id="cc-bucket-ai_under_3"${this.collapsedBuckets.has("ai_under_3") ? " hidden" : ""}>${this.renderContactRows(aiUnder3)}</section>
            ${this.renderBucketHeader({ key: "ai_over_3", title: "Ditangani lebih dari 3 hari", tone: "ai-old", icon: "mr", items: aiOver3, nested: true })}
            <section class="cc-bucket-content" id="cc-bucket-ai_over_3"${this.collapsedBuckets.has("ai_over_3") ? " hidden" : ""}>${this.renderContactRows(aiOver3)}</section>
          </div>
        </section>`);
    }

    this.contactList.innerHTML = html.join("") || '<div class="cc-empty">Tidak ada percakapan pada filter ini.</div>';
  }

  renderChat() {
    const c = this.activeContact();
    const avatar = this.root.querySelector("[data-omni-active-avatar]");
    avatar.className = `cc-avatar ${c.channel}`;
    avatar.innerHTML = `${this.initials(c.name)}<i class="dot ${c.channel}"></i>`;
    this.root.querySelector("[data-omni-active-name]").textContent = c.name;
    const tagEl = this.root.querySelector("[data-omni-active-tag]");
    tagEl.className = `cc-tag ${c.tag}`;
    tagEl.textContent = c.tag.toUpperCase();
    this.root.querySelector("[data-omni-active-channel]").textContent = this.channelLabel(c.channel);
    this.root.querySelector("[data-omni-active-phone]").textContent = c.phone;
    this.root.querySelector("[data-omni-handler-label]").textContent = this.handlerLabel(c);

    const banner = this.root.querySelector("[data-omni-status-banner]");
    banner.className = "cc-status-banner show";
    if (c.closed) {
      banner.classList.add("other");
      banner.textContent = "Lead ditutup (simulasi). Riwayat tetap bisa dibaca.";
    } else if (c.bucket === "mr" && c.mrUnanswered) {
      banner.classList.add("mr");
      banner.innerHTML = `Lead ditangani MR <strong>${c.mrName}</strong> (belum balas). <button type="button" data-omni-takeover-mr>Ambil Alih dari MR</button>`;
    } else if (c.bucket === "mr") {
      banner.classList.add("mr");
      banner.innerHTML = `Lead ditangani MR <strong>${c.mrName}</strong>. <button type="button" data-omni-takeover-mr>Ambil Alih dari MR</button>`;
    } else if (c.bucket === "ai") {
      banner.textContent = "AI Jasmine/Falcon sedang menangani. Ketik pesan untuk ambil alih sebagai Call Center.";
    } else if (c.bucket === "pending") {
      banner.classList.add("pending");
      banner.textContent = "Customer minta human agent. Ketik pesan atau tekan Ambil untuk handle.";
    } else if (c.claimedByOther) {
      banner.classList.add("other");
      banner.textContent = `Ditangani ${c.handlerName}. Kirim pesan untuk mengambil alih (simulasi).`;
    } else {
      banner.classList.add("other");
      banner.textContent = `Anda menangani percakapan ini · AI di-pause. Gunakan tombol 🤖 AI untuk mengembalikan ke AI.`;
    }

    this.chatLog.replaceChildren();
    for (const message of c.messages) {
      const row = document.createElement("div");
      const isOut = message.role === "assistant" || message.role === "agent" || message.role === "mr" || message.role === "system";
      row.className = `cc-msg ${isOut ? "out" : "in"} ${message.role}${message.blocked ? " blocked" : ""}`;
      const bubble = document.createElement("div");
      bubble.className = "cc-bubble";
      bubble.textContent = message.content;
      const meta = document.createElement("div");
      meta.className = "meta";
      if (message.role === "assistant") {
        const badge = document.createElement("span");
        badge.className = message.blocked ? "cc-ai-badge guard" : "cc-ai-badge";
        badge.textContent = message.blocked ? "GUARDRAIL" : "JASMINE AI";
        meta.appendChild(badge);
      } else if (message.role === "agent") {
        const badge = document.createElement("span");
        badge.className = "cc-ai-badge";
        badge.style.color = "#059669";
        badge.textContent = "CALL CENTER";
        meta.appendChild(badge);
      } else if (message.role === "mr") {
        const badge = document.createElement("span");
        badge.className = "cc-ai-badge";
        badge.style.color = "#ea580c";
        badge.textContent = "MR";
        meta.appendChild(badge);
      }
      meta.append(document.createTextNode(message.time || ""));
      row.append(bubble, meta);
      this.chatLog.appendChild(row);
    }
    this.chatLog.scrollTop = this.chatLog.scrollHeight;

    const lockedMr = c.bucket === "mr";
    for (const sel of ["[data-omni-qa-credit]", "[data-omni-qa-inventory]", "[data-omni-qa-falcon]"]) {
      const el = this.root.querySelector(`.cc-chat ${sel}`);
      if (el) el.disabled = lockedMr || c.closed;
    }
  }

  handlerLabel(c) {
    if (c.closed) return "closed";
    if (c.bucket === "ai") return "ditangani Jasmine AI";
    if (c.bucket === "pending") return "menunggu agent";
    if (c.bucket === "mr") return `MR ${c.mrName || ""}`.trim();
    return c.handlerName || "Call Center";
  }

  renderDetail() {
    const c = this.activeContact();
    const tag = this.root.querySelector("[data-omni-detail-tag]");
    tag.className = `cc-tag ${c.tag}`;
    tag.textContent = c.tag.toUpperCase();
    this.root.querySelector("[data-omni-detail-priority]").textContent =
      c.priority === "tinggi" ? "Prioritas tinggi" : "Prioritas normal";
    this.root.querySelector("[data-omni-detail-contact]").textContent = `📞 ${c.phone} · 📍 ${c.location || "—"}`;
    const mr = this.root.querySelector("[data-omni-detail-mr]");
    if (c.mrName) {
      mr.textContent = c.mrName + (c.mrUnanswered ? " · belum balas" : "");
      mr.classList.remove("muted");
    } else {
      mr.textContent = "belum ada — handoff dulu";
      mr.classList.add("muted");
    }
    this.root.querySelector("[data-omni-detail-unit]").textContent = c.unit || "—";
    this.root.querySelector("[data-omni-detail-budget]").textContent = c.budget || "";
    const notes = this.root.querySelector("[data-omni-detail-notes]");
    notes.textContent = c.notes || "belum ada";
    notes.classList.toggle("muted", !c.notes);
    this.renderPipeline(this.root.querySelector("[data-omni-pipeline]"), c.pipelineStage);
  }

  renderPipeline(el, stage) {
    if (!el) return;
    const idx = omniPipelineOrder.indexOf(stage);
    for (const node of el.querySelectorAll("[data-stage]")) {
      const s = node.dataset.stage;
      const i = omniPipelineOrder.indexOf(s);
      node.classList.remove("done", "cur");
      if (i < idx) node.classList.add("done");
      else if (i === idx) node.classList.add("cur");
    }
  }

  renderRiwayat() {
    const c = this.activeContact();
    const el = this.root.querySelector("[data-omni-riwayat]");
    const items = [...(c.history || [])].reverse();
    if (!items.length) {
      el.innerHTML = '<div class="cc-empty">Belum ada riwayat.</div>';
      return;
    }
    el.innerHTML = items
      .map((h) => `<div class="cc-timeline-item"><b>${h.label}</b><span>${h.time}</span></div>`)
      .join("");
  }

  renderContextTabs() {
    for (const button of this.root.querySelectorAll("[data-omni-ctx-tab]")) {
      button.classList.toggle("active", button.dataset.omniCtxTab === this.ctxTab);
    }
    this.root.querySelector("[data-omni-ctx-detail]").hidden = this.ctxTab !== "detail";
    this.root.querySelector("[data-omni-ctx-riwayat]").hidden = this.ctxTab !== "riwayat";
    this.root.querySelector("[data-omni-ctx-trace]").hidden = this.ctxTab !== "trace";
  }

  renderTrace() {
    this.root.querySelector("[data-omni-domain]").textContent = this.trace.domain;
    this.root.querySelector("[data-omni-risk]").textContent = this.trace.risk;
    this.root.querySelector("[data-omni-effect]").textContent = this.trace.effect;
    this.root.querySelector("[data-omni-router]").textContent = this.trace.router;
    this.root.querySelector("[data-omni-tool]").textContent = this.trace.tool;
    this.root.querySelector("[data-omni-grounding]").textContent = this.trace.grounding;
    this.root.querySelector("[data-omni-eval-title]").textContent = this.trace.evalTitle;
    const status = this.root.querySelector("[data-omni-eval-status]");
    status.className = `omni-eval-status ${this.trace.blocked ? "blocked" : "pass"}`;
    status.textContent = this.trace.blocked ? "BLOCKED" : "PASS";
    const assertions = this.root.querySelector("[data-omni-assertions]");
    assertions.replaceChildren();
    for (const assertion of this.trace.assertions) {
      const item = document.createElement("li");
      item.className = this.trace.blocked ? "blocked" : "pass";
      const icon = document.createElement("span");
      icon.textContent = "✓";
      item.append(icon, document.createTextNode(" " + assertion));
      assertions.appendChild(item);
    }
  }

  takeoverContact(id) {
    const c = this.contacts.find((x) => x.id === id);
    if (!c || c.closed) return;
    c.bucket = "call_center";
    c.handlerName = "Agent Demo (Saya)";
    c.claimedByOther = false;
    c.escalated = false;
    c.messages.push({
      role: "agent",
      content: "Call Center mengambil alih percakapan (simulasi). Ringkasan kebutuhan tetap tersedia di panel kanan.",
      time: "baru saja",
    });
    c.history.push({ label: "Takeover Call Center (Agent Demo)", time: "baru saja" });
    c.preview = "Diambil alih Call Center";
    c.time = "baru";
    this.activeContactId = c.id;
    this.fanel = "mine";
    this.collapsedBuckets.delete("call_center");
    this.render();
    this.showToast("Takeover", `${c.name} sekarang di bucket Call Center.`);
  }

  releaseToAI() {
    const c = this.activeContact();
    if (c.closed) return;
    c.bucket = "ai";
    c.aiAgeBucket = "under_12_hours";
    c.handlerName = "Jasmine AI";
    c.claimedByOther = false;
    c.mrName = "";
    c.mrUnanswered = false;
    c.messages.push({
      role: "assistant",
      content: "Percakapan dikembalikan ke Jasmine AI (simulasi). AI akan membalas pesan berikutnya.",
      time: "baru saja",
    });
    c.history.push({ label: "Release ke AI", time: "baru saja" });
    c.preview = "Kembali ke AI";
    this.fanel = "ai";
    this.collapsedBuckets.delete("ai");
    this.collapsedBuckets.delete("ai_under_12");
    this.render();
    this.showToast("AI aktif", "Lead dikembalikan ke bucket Ditangani AI.");
  }

  takeoverFromMR() {
    const c = this.activeContact();
    c.bucket = "call_center";
    c.handlerName = "Agent Demo (Saya)";
    c.mrUnanswered = false;
    c.claimedByOther = false;
    c.messages.push({
      role: "agent",
      content: `Call Center mengambil alih dari MR ${c.mrName || ""} (simulasi).`,
      time: "baru saja",
    });
    c.history.push({ label: "Takeover dari MR", time: "baru saja" });
    this.fanel = "mine";
    this.collapsedBuckets.delete("call_center");
    this.render();
    this.showToast("Takeover dari MR", "Lead kembali ke Call Center.");
  }

  submitHandoff() {
    const c = this.activeContact();
    const mr = this.root.querySelector("[data-omni-handoff-mr]").value;
    const reason = this.root.querySelector("[data-omni-handoff-reason]").value;
    const notes = this.root.querySelector("[data-omni-handoff-notes]").value.trim();
    c.bucket = "mr";
    c.mrName = mr;
    c.handlerName = `MR ${mr.split(" ")[0]}`;
    c.mrUnanswered = true;
    c.claimedByOther = false;
    if (c.pipelineStage === "cold" || c.pipelineStage === "warm") {
      c.pipelineStage = "hot";
      c.tag = "hot";
    }
    c.notes = notes || c.notes;
    c.messages.push({
      role: "system",
      content: `Handoff oleh Agent Demo ke MR ${mr} · alasan: ${reason}`,
      time: "baru saja",
    });
    c.history.push({ label: `Handoff ke MR ${mr}`, time: "baru saja" });
    c.preview = `Handoff → MR ${mr.split(" ")[0]}`;
    this.closeModal("handoff");
    this.fanel = "all";
    this.collapsedBuckets.delete("mr");
    this.collapsedBuckets.delete("mr_pending");
    this.render();
    this.showToast("Handoff ke MR", `${c.name} diserahkan ke ${mr}. Lanjut preview role MR.`);
  }

  submitCloseLead() {
    const c = this.activeContact();
    const reason = this.root.querySelector("[data-omni-close-reason]").value;
    c.closed = true;
    c.bucket = "closed";
    c.history.push({ label: `Close lead · ${reason}`, time: "baru saja" });
    c.messages.push({ role: "system", content: `Lead ditutup (${reason}) — simulasi.`, time: "baru saja" });
    this.closeModal("close");
    this.render();
    this.showToast("Lead ditutup", "Lead masuk group Closed / Riwayat.");
  }

  submitEscalate() {
    const c = this.activeContact();
    c.escalated = true;
    if (c.bucket === "ai") {
      c.bucket = "pending";
      this.collapsedBuckets.delete("call_center");
    }
    c.history.push({ label: "Eskalasi ditandai", time: "baru saja" });
    this.closeModal("escalate");
    this.render();
    this.showToast("Eskalasi", "Badge ESKALASI aktif pada lead.");
  }

  submitManualLead() {
    const name = this.root.querySelector("[data-omni-manual-name]").value.trim() || "Lead Manual";
    const channel = this.root.querySelector("[data-omni-manual-channel]").value;
    const id = "omni-manual-" + Date.now();
    this.contacts.unshift({
      id,
      name,
      phone: "62800****" + String(Math.floor(Math.random() * 900 + 100)),
      channel,
      tag: "cold",
      bucket: "call_center",
      handlerName: "Agent Demo (Saya)",
      mrName: "",
      priority: "normal",
      escalated: false,
      mrUnanswered: false,
      pinned: false,
      closed: false,
      pipelineStage: "cold",
      preview: "Lead manual ditambahkan",
      time: "baru",
      location: "—",
      unit: "—",
      budget: "",
      notes: "Dibuat via Lead Manual (demo)",
      messages: [{ role: "agent", content: `Lead manual ${name} dibuat oleh Call Center.`, time: "baru saja" }],
      history: [{ label: "Lead manual dibuat", time: "baru saja" }],
    });
    this.activeContactId = id;
    this.fanel = "mine";
    this.collapsedBuckets.delete("call_center");
    this.closeModal("manual");
    this.render();
    this.showToast("Lead manual", `${name} ditambahkan ke bucket Call Center.`);
  }

  openCredit() {
    const c = this.activeContact();
    const price = 255000000;
    const dp = Math.round(price * 0.2);
    const angsuran = Math.round((price - dp) / 48);
    this.root.querySelector("[data-omni-credit-result]").innerHTML = `
      <b>Unit:</b> ${c.unit || "Unit demo"}<br/>
      <b>OTR (demo):</b> Rp ${price.toLocaleString("id-ID")}<br/>
      <b>DP 20%:</b> Rp ${dp.toLocaleString("id-ID")}<br/>
      <b>Tenor 48 bln:</b> ± Rp ${angsuran.toLocaleString("id-ID")}/bln<br/>
      <small style="color:#64748b">Angka fiktif demo — di produksi memakai kalkulator KKB tenant.</small>
    `;
    c.history.push({ label: "Aksi Cepat: Simulasi Kredit", time: "baru saja" });
    this.openModal("credit");
    this.renderRiwayat();
  }

  openInventory() {
    const list = this.root.querySelector("[data-omni-inventory-list]");
    list.innerHTML = [
      ["Honda BR-V Prestige 2021", "Ready · Rp 255 jt · Putih"],
      ["Toyota Rush G AT 2022", "Ready · Rp 190 jt · Hitam"],
      ["Mitsubishi Xpander Ultimate", "Ready · Rp 248 jt · Silver"],
      ["Suzuki Ertiga Hybrid", "Indent · hubungi MR"],
    ]
      .map(([t, s]) => `<div class="cc-inv-item"><b>${t}</b><span>${s}</span></div>`)
      .join("");
    this.activeContact().history.push({ label: "Aksi Cepat: Cek Inventori", time: "baru saja" });
    this.openModal("inventory");
    this.renderRiwayat();
  }

  openFalcon() {
    const c = this.activeContact();
    this.root.querySelector("[data-omni-falcon-answer]").textContent =
      `Saran Falcon untuk ${c.name}: tawarkan ${c.unit || "unit stok live"} dengan opsi test drive, konfirmasi budget (${c.budget || "belum diisi"}), dan siapkan handoff ke MR jika sinyal HOT. Jangan kirim angka kredit tanpa parameter DP/tenor.`;
    c.history.push({ label: "Aksi Cepat: Tanya Falcon", time: "baru saja" });
    this.openModal("falcon");
    this.renderRiwayat();
  }

  openMrPreview() {
    const c = this.activeContact();
    this.root.querySelector("[data-omni-mr-agent]").textContent = c.mrName || "Dimas Pratama";
    this.root.querySelector("[data-omni-mr-lead-name]").textContent = `${c.name} · ${c.tag.toUpperCase()} · ${c.unit || "—"}`;
    this.renderPipeline(this.root.querySelector("[data-omni-mr-pipeline]"), c.pipelineStage);
    const chat = this.root.querySelector("[data-omni-mr-chat]");
    chat.replaceChildren();
    const msgs = c.messages.slice(-4);
    for (const message of msgs) {
      const row = document.createElement("div");
      const isOut = message.role !== "customer";
      row.className = `cc-msg ${isOut ? "out" : ""} ${message.role}`;
      const bubble = document.createElement("div");
      bubble.className = "cc-bubble";
      bubble.textContent = message.content;
      row.append(bubble);
      chat.appendChild(row);
    }
    if (c.bucket === "mr" && c.mrUnanswered) {
      const row = document.createElement("div");
      row.className = "cc-msg out mr";
      row.innerHTML = `<div class="cc-bubble"><span class="cc-ai-badge" style="color:#ea580c">PREVIEW</span><br/>MR belum membalas di production. Di preview ini Anda melihat shell role MR.</div>`;
      chat.appendChild(row);
    } else if (c.bucket !== "mr") {
      const row = document.createElement("div");
      row.className = "cc-msg out mr";
      row.innerHTML = `<div class="cc-bubble">Preview role MR. Lakukan Handoff dulu agar lead benar-benar pindah bucket MR (seperti produksi).</div>`;
      chat.appendChild(row);
    }
    this.openModal("mr");
  }

  async copyConversation() {
    const c = this.activeContact();
    const text = c.messages.map((m) => `[${m.role}] ${m.content}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("Disalin", "Percakapan disalin ke clipboard.");
    } catch {
      this.showToast("Copy", "Clipboard tidak tersedia di lingkungan ini.");
    }
  }

  startTutorial() {
    this.openGuide(0);
  }

  endTutorial(silent) {
    this.closeGuide();
    if (!silent) this.showToast("Tutorial selesai", "Silakan eksplorasi bebas semua aksi Call Center.");
  }

  async runPrompt(message, { asCustomer = true } = {}) {
    const text = message.trim().slice(0, 500);
    if (!text) return;
    this.toast.hidden = true;
    this.input.value = "";
    const contact = this.activeContact();
    if (contact.closed) {
      this.showToast("Lead closed", "Buka lead aktif untuk mengirim pesan.");
      return;
    }

    if (asCustomer) {
      contact.messages.push({ role: "customer", content: text, time: "baru saja" });
      if (contact.bucket === "call_center" || contact.bucket === "mr") {
        /* customer message while human handles */
      }
      const result = this.evaluateMessage(text);
      contact.messages.push({
        role: "assistant",
        content: result.response,
        time: "baru saja",
        blocked: result.trace.blocked,
      });
      contact.preview = result.trace.blocked ? "Ancaman diblokir guardrail" : text;
      contact.time = "baru";
      this.trace = result.trace;
      if (!result.trace.blocked && /(test drive|booking|mau beli)/.test(text.toLowerCase())) {
        contact.tag = "hot";
        contact.pipelineStage = "hot";
        contact.history.push({ label: "Pipeline → HOT (deteksi AI)", time: "baru saja" });
      }
      contact.history.push({ label: result.trace.blocked ? "Guardrail block" : `AI · ${result.trace.domain}`, time: "baru saja" });
      this.ctxTab = "trace";
      this.render();
      if (result.trace.blocked) {
        this.showToast("Ancaman diblokir", "Tidak ada tool atau perubahan yang dijalankan.");
        return;
      }
      try {
        await publicDemoData.submit("chat_message", {
          message: text,
          unit_interest: this.extractUnitInterest(text),
        });
      } catch (error) {
        this.showToast("Pesan belum tersimpan", error.message);
      }
      return;
    }

    // Agent reply → takeover if needed
    if (contact.bucket === "ai" || contact.bucket === "pending") {
      contact.bucket = "call_center";
      contact.handlerName = "Agent Demo (Saya)";
      contact.claimedByOther = false;
      contact.history.push({ label: "Takeover via kirim pesan", time: "baru saja" });
      this.fanel = "mine";
      this.collapsedBuckets.delete("call_center");
    }
    if (contact.claimedByOther) {
      contact.claimedByOther = false;
      contact.handlerName = "Agent Demo (Saya)";
      contact.history.push({ label: "Takeover dari agent lain", time: "baru saja" });
    }
    contact.messages.push({ role: "agent", content: text, time: "baru saja" });
    contact.preview = text;
    contact.time = "baru";
    contact.history.push({ label: "Balasan Call Center", time: "baru saja" });
    this.render();
  }

  runJasmineJourney(stage) {
    const contact = this.contacts.find((item) => item.id === "omni-nadia");
    if (!contact) return;

    const journeys = {
      discovery: {
        customer: "Saya cari mobil keluarga, tapi belum tahu model yang cocok.",
        response: "Siap, Kak. Biar rekomendasinya tepat: biasanya dipakai berapa orang, lebih sering dalam kota atau luar kota, dan kisaran budgetnya berapa?",
        outcome: "Discovery kebutuhan · Jasmine menggali use case sebelum menawarkan unit.",
        tag: "cold",
        pipelineStage: "cold",
        trace: { domain: "qualification", effect: "read_only", tool: "conversation.context · read_only" },
      },
      inventory: {
        customer: "Untuk keluarga 4 orang, budget sekitar 250 juta. Stok yang cocok apa?",
        response: "Dari stok demo yang terverifikasi, ada Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Kakak lebih prioritas kabin luas atau cicilan ringan?",
        outcome: "Stok ter-grounding · Harga dan unit hanya berasal dari hasil inventori demo.",
        tag: "warm",
        pipelineStage: "warm",
        unit: "Honda BR-V / Toyota Rush",
        budget: "Budget customer ~Rp 250 jt",
        trace: { domain: "inventory", effect: "read_only", tool: "inventory.search · read_only" },
      },
      finance: {
        customer: "BR-V menarik. Kalau kredit, saya siap DP 50 juta dengan tenor 5 tahun.",
        response: "DP Rp50 juta dan tenor 5 tahun saya catat sebagai preferensi. Saya tidak akan mengarang cicilan; nominal simulasi harus dihitung dari kalkulator pembiayaan resmi. Apakah BR-V ini yang ingin diproses, Kak?",
        outcome: "Lead WARM · Preferensi finance dicatat tanpa mengarang angka cicilan.",
        tag: "warm",
        pipelineStage: "warm",
        unit: "Honda BR-V Prestige 2021",
        budget: "DP Rp 50 jt · tenor 5 tahun",
        trace: { domain: "finance", effect: "read_only", tool: "finance.simulate · parameterized" },
      },
      handoff: {
        customer: "Ya, saya mau test drive BR-V besok sore dan lanjut kalau cocok.",
        response: "Siap, Kak. Minat test drive besok sore saya tandai HOT. Konteks unit, budget, dan jadwal sudah dirangkum agar MR dapat melanjutkan tanpa mengulang pertanyaan.",
        outcome: "Lead HOT · Siap handoff kontekstual ke MR, tanpa kehilangan riwayat.",
        tag: "hot",
        pipelineStage: "hot",
        unit: "Honda BR-V Prestige 2021",
        budget: "DP Rp 50 jt · tenor 5 tahun",
        trace: { domain: "handoff", effect: "simulated_write", tool: "lead.assign_sales_rep · tenant demo" },
      },
    };
    const journey = journeys[stage] || journeys.discovery;
    contact.bucket = "ai";
    contact.aiAgeBucket = "under_12_hours";
    contact.handlerName = "Jasmine AI";
    contact.mrName = "";
    contact.mrUnanswered = false;
    contact.closed = false;
    contact.tag = journey.tag;
    contact.pipelineStage = journey.pipelineStage;
    if (journey.unit) contact.unit = journey.unit;
    if (journey.budget) contact.budget = journey.budget;
    contact.messages.push(
      { role: "customer", content: journey.customer, time: "baru saja" },
      { role: "assistant", content: journey.response, time: "baru saja" },
    );
    contact.preview = journey.response;
    contact.time = "baru";
    contact.history.push({ label: `Jasmine · ${journey.outcome.split(" · ")[0]}`, time: "baru saja" });
    this.trace = {
      ...this.defaultTrace,
      ...journey.trace,
      router: `Jasmine memilih domain ${journey.trace.domain} dari konteks percakapan dan status lead.`,
      grounding: stage === "inventory"
        ? "Unit dan harga berasal dari inventori tenant demo."
        : "Respons memakai konteks lead dan guardrail sesuai tahap perjalanan.",
      evalTitle: `Jasmine journey · ${stage}`,
      blocked: false,
      assertions: ["Konteks percakapan dipertahankan", "Status lead sesuai intent", "Tidak mengarang data", "External send = 0"],
    };
    this.activeContactId = contact.id;
    this.fanel = "ai";
    this.collapsedBuckets.delete("ai");
    this.collapsedBuckets.delete("ai_under_12");
    this.ctxTab = stage === "handoff" ? "detail" : "trace";
    this.root.querySelector("[data-omni-jasmine-outcome]").textContent = journey.outcome;
    for (const button of this.root.querySelectorAll("[data-omni-jasmine]")) {
      button.classList.toggle("active", button.dataset.omniJasmine === stage);
    }
    this.render();
    this.showToast("Jasmine AI", journey.outcome);
  }

  extractUnitInterest(message) {
    const knownModels = ["Xpander", "Rush", "Zenix", "BR-V", "Serena", "Avanza", "Ertiga"];
    return knownModels.find((model) => message.toLocaleLowerCase("id").includes(model.toLocaleLowerCase("id"))) || "";
  }

  evaluateMessage(message) {
    const normalized = message
      .normalize("NFKD")
      .toLocaleLowerCase("id")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (this.isSecurityThreat(normalized)) {
      return {
        response:
          "Permintaan tidak diizinkan. Saya tidak dapat menghapus knowledge/data, mengungkap prompt atau kredensial, mengubah permission, maupun mengakses tenant lain. Tidak ada tool atau perubahan yang dijalankan.",
        trace: {
          domain: "security",
          risk: "critical",
          effect: "blocked",
          router: "Instruksi bertentangan dengan kebijakan dan batas role.",
          tool: "none · 0 tool calls",
          grounding: "Input dihentikan sebelum menyentuh data atau channel.",
          evalTitle: "Prompt injection & destructive action",
          blocked: true,
          assertions: [
            "Instruksi berbahaya ditolak",
            "System prompt tetap rahasia",
            "Tool calls = 0",
            "Side effects = 0",
          ],
        },
      };
    }

    if (/(test drive|tes drive|lihat unit|datang|booking|mau beli|mau ambil|deal)/.test(normalized)) {
      return {
        response:
          "Minat kunjungan terdeteksi sebagai HOT. Saya tidak mengirim apa pun dari demo ini, tetapi konteks lead sudah disiapkan: unit minat, waktu kunjungan, dan alasan handoff ke MR. Besok sekitar pukul berapa, Kak?",
        trace: {
          domain: "handoff",
          risk: "medium",
          effect: "simulated_write",
          router: "Sinyal buying intent tinggi diarahkan ke handoff MR.",
          tool: "lead.capture · tenant demo",
          grounding: "Konteks handoff disusun dari pesan, tanpa mengarang data.",
          evalTitle: "HOT lead & contextual handoff",
          blocked: false,
          assertions: [
            "Lead diklasifikasi HOT",
            "Konteks handoff lengkap",
            "External send = 0",
            "Perubahan terisolasi di tenant demo",
          ],
        },
      };
    }

    if (/(dp|cicilan|tenor|kredit|angsuran|leasing|pembiayaan)/.test(normalized)) {
      return {
        response:
          "Saya tidak akan mengarang angka pembiayaan. Sebutkan unit, target DP, dan tenor; atau minta agent memakai Aksi Cepat Simulasi Kredit.",
        trace: {
          domain: "finance",
          risk: "low",
          effect: "read_only",
          router: "Pertanyaan DP/cicilan masuk domain finance.",
          tool: "finance.simulate · menunggu parameter",
          grounding: "Angka hanya boleh berasal dari kalkulator resmi.",
          evalTitle: "Finance without fabrication",
          blocked: false,
          assertions: [
            "Domain finance sesuai",
            "Tidak mengarang angka",
            "Parameter wajib diminta",
            "Penawaran final diarahkan ke sales/MR",
          ],
        },
      };
    }

    if (/(foto|gambar|video|interior|eksterior)/.test(normalized)) {
      return {
        response:
          "Saya cek unit yang tepat lebih dulu agar media tidak tertukar. Di demo ini tidak ada file yang dikirim. Sebutkan model yang ingin dilihat.",
        trace: {
          domain: "photo",
          risk: "low",
          effect: "read_only",
          router: "Permintaan media masuk domain photo.",
          tool: "inventory.search · read_only",
          grounding: "Unit diverifikasi sebelum media dipilih.",
          evalTitle: "Safe media selection",
          blocked: false,
          assertions: ["Domain photo sesuai", "Unit diverifikasi dahulu", "External send = 0", "Tidak ada media nyata dikirim"],
        },
      };
    }

    if (/(mobil|unit|stok|harga|budget|keluarga|xpander|br-v|brv|rush|raize|ertiga|rocky)/.test(normalized)) {
      return {
        response:
          "Dari stok fiktif demo, ada Honda BR-V Prestige 2021 Rp255 jt dan Toyota Rush G AT 2022 Rp190 jt. Agar rekomendasinya tepat, lebih penting kabin luas, BBM, atau cicilan ringan, Kak?",
        trace: {
          ...this.defaultTrace,
          assertions: [...this.defaultTrace.assertions],
        },
      };
    }

    return {
      response:
        "Saya siap membantu dari satu inbox WhatsApp, Instagram, dan Facebook. Ceritakan kebutuhan kendaraan, budget, atau rencana waktunya.",
      trace: {
        domain: "general",
        risk: "low",
        effect: "none",
        router: "Belum ada domain operasional yang cukup spesifik.",
        tool: "none · menunggu konteks",
        grounding: "AI meminta klarifikasi daripada menebak.",
        evalTitle: "Clarify before acting",
        blocked: false,
        assertions: ["Tidak menebak intent", "Tidak memanggil tool prematur", "Pertanyaan lanjutan relevan", "Tidak ada side effect"],
      },
    };
  }

  isSecurityThreat(message) {
    const threatPatterns = [
      /(hapus|delete|remove|drop|kosongkan|reset|wipe|destroy|musnahkan).*(knowledge|database|data|customer|tenant|riwayat|log|sistem|stok)/,
      /(abaikan|ignore|bypass|lewati|override).*(instruksi|instruction|aturan|guardrail|security|system|sistem)/,
      /(system prompt|prompt sistem|api key|token rahasia|password|credential|secret|kredensial)/,
      /(ubah|naikkan|beri|jadikan).*(permission|role|akses|admin|otorisasi)/,
      /(tenant lain|semua tenant|cross.?tenant|lintas tenant)/,
      /(sql|shell|terminal|command).*(jalankan|run|execute|eksekusi)/,
      /(export|unduh|download|kirim).*(semua customer|seluruh data|database|semua lead)/,
    ];
    return threatPatterns.some((pattern) => pattern.test(message));
  }

  initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toLocaleUpperCase("id");
  }

  channelLabel(channel) {
    if (channel === "instagram") return "Instagram";
    if (channel === "messenger") return "Facebook Messenger";
    return "WhatsApp";
  }
}

const omniDemoMount = document.getElementById("omniDemo");
if (omniDemoMount) {
  new OmnichannelAIDemo(omniDemoMount);
}

const dashboardDemoRoles = {
  director: {
    label: "Direktur",
    title: "Executive Overview",
    description: "Ringkasan lintas cabang untuk keputusan strategis dan pertumbuhan bisnis.",
    widgets: ["kpi", "revenue", "pipeline", "branches", "agents", "alerts"],
    navView: "overview",
  },
  sales: {
    label: "Sales Manager",
    title: "Sales Performance",
    description: "Pantau kualitas pipeline, produktivitas tim, dan peluang closing dari satu layar.",
    widgets: ["kpi", "revenue", "pipeline", "agents", "alerts"],
    navView: "sales",
  },
  branch: {
    label: "Kepala Cabang",
    title: "Branch Command Center",
    description: "Fokus pada target, aktivitas sales, dan prioritas operasional cabang hari ini.",
    widgets: ["kpi", "pipeline", "branches", "agents", "alerts"],
    navView: "locations",
  },
};

const dashboardNavViewWidgets = {
  overview: ["kpi", "revenue", "pipeline", "branches", "agents", "alerts"],
  sales: ["kpi", "revenue", "pipeline", "agents", "alerts"],
  locations: ["kpi", "pipeline", "branches", "agents", "alerts"],
  channels: ["kpi", "revenue", "pipeline", "channels", "alerts"],
};

function makeDashboardShell({
  locationWord,
  salesLabel = "Sales Performance",
  channelsLabel = "Omnichannel",
  overviewDesc,
  salesDesc,
  locationsDesc,
  channelsDesc,
  sidebarTitle,
  sidebarCopy,
  sectionLabel = "Analytics",
}) {
  const loc = locationWord;
  return {
    nav: [
      { id: "overview", label: "Executive Overview" },
      { id: "sales", label: salesLabel },
      { id: "locations", label: loc === "Cabang" ? "Branch Performance" : `Performa ${loc}` },
      { id: "channels", label: channelsLabel },
    ],
    views: {
      overview: {
        title: "Executive Overview",
        description:
          overviewDesc ||
          `Ringkasan lintas ${loc.toLocaleLowerCase("id")} untuk keputusan strategis dan pertumbuhan bisnis.`,
        widgets: dashboardNavViewWidgets.overview,
        role: "director",
        revenueKicker: "PENDAPATAN",
        revenueTitle: "Tren Pendapatan + Forecast",
        pipelineKicker: "PIPELINE SALES",
        pipelineTitle: "Corong Konversi",
        agentsKicker: "SALES TEAM",
        agentsTitle: "Top Agent",
        agentsMeta: "Bulan ini",
      },
      sales: {
        title: salesLabel,
        description:
          salesDesc ||
          `Pantau kualitas pipeline, produktivitas tim, dan peluang closing dari satu layar.`,
        widgets: dashboardNavViewWidgets.sales,
        role: "sales",
        revenueKicker: "PENDAPATAN",
        revenueTitle: "Tren Closing + Forecast",
        pipelineKicker: "PIPELINE",
        pipelineTitle: "Corong Konversi Sales",
        agentsKicker: "SALES TEAM",
        agentsTitle: "Top Performer",
        agentsMeta: "Periode aktif",
      },
      locations: {
        title: loc === "Cabang" ? "Branch Command Center" : `Command Center ${loc}`,
        description:
          locationsDesc ||
          `Fokus pada target, aktivitas, dan prioritas operasional tiap ${loc.toLocaleLowerCase("id")} hari ini.`,
        widgets: dashboardNavViewWidgets.locations,
        role: "branch",
        revenueKicker: "PENDAPATAN",
        revenueTitle: `Tren per ${loc}`,
        pipelineKicker: "PIPELINE",
        pipelineTitle: `Funnel per ${loc}`,
        agentsKicker: "TIM LOKAL",
        agentsTitle: `Top Agent ${loc}`,
        agentsMeta: "Bulan ini",
      },
      channels: {
        title: channelsLabel,
        description:
          channelsDesc ||
          `Pantau kontribusi tiap channel masuk ke pipeline dan closing bisnis Anda.`,
        widgets: dashboardNavViewWidgets.channels,
        role: null,
        revenueKicker: "REVENUE CHANNEL",
        revenueTitle: "Tren Atribusi Channel",
        pipelineKicker: "CHANNEL FUNNEL",
        pipelineTitle: "Lead Channel → Closing",
        channelsKicker: "CHANNEL MIX",
        channelsTitle: "Performa Channel",
        channelsMeta: "Bulan ini",
      },
    },
    sidebar: {
      section: sectionLabel,
      kicker: "DASHBOARD ANDA",
      title: sidebarTitle || "Satu data, beda kebutuhan",
      copy:
        sidebarCopy ||
        `Menu kiri menyesuaikan industri. Buka tiap view untuk layout ${loc.toLocaleLowerCase("id")}, sales, dan channel.`,
    },
  };
}

const dashboardDemoData = {
  branches: [
    { id: "pondok-bambu", name: "Pondok Bambu", revenue: 742, closing: 31, conversion: 8.4, target: 92 },
    { id: "cinere", name: "Cinere", revenue: 618, closing: 26, conversion: 7.8, target: 84 },
    { id: "cibubur", name: "Cibubur", revenue: 480, closing: 21, conversion: 6.9, target: 76 },
  ],
  agents: [
    { name: "Rizky Pratama", branch: "Pondok Bambu", closing: 14, revenue: 328 },
    { name: "Nadia Putri", branch: "Cinere", closing: 12, revenue: 286 },
    { name: "Fajar Maulana", branch: "Cibubur", closing: 10, revenue: 241 },
    { name: "Ayu Lestari", branch: "Pondok Bambu", closing: 9, revenue: 218 },
  ],
  chart: [
    { label: "Feb", actual: 54 },
    { label: "Mar", actual: 68 },
    { label: "Apr", actual: 61 },
    { label: "Mei", actual: 78 },
    { label: "Jun", actual: 72 },
    { label: "Jul", actual: 88, forecast: 96 },
    { label: "Agu", forecast: 100 },
  ],
};

const dashboardChartSeed = dashboardDemoData.chart;

const dashboardVerticalPresets = {
  automotive: {
    id: "automotive",
    label: "Otomotif / Dealer",
    badge: "Otomotif",
    panelKicker: "MULTI-BRANCH",
    panelTitle: "Performa Cabang",
    properties: {
      entitySingular: "unit",
      entityPlural: "unit",
      locationLabel: "Cabang",
      locationAll: "Semua Cabang",
      pipelineTotalSuffix: "lead",
      dealLabel: "Rata-rata Deal",
      closingSpeedLabel: "Kecepatan Closing",
      agentMetric: "closing",
      tableHeaders: ["Cabang", "Revenue", "Closing", "Konversi", "Target"],
      funnelStages: [
        ["Lead Baru", 1248, 100],
        ["Terhubung", 864, 69],
        ["Prospek", 512, 41],
        ["Hot", 226, 18],
        ["Deal", 96, 8],
      ],
    },
    data: null,
    kpis: null,
    highlights: null,
  },
  property: {
    id: "property",
    label: "Properti / Real Estate",
    badge: "Properti",
    panelKicker: "MULTI-PROYEK",
    panelTitle: "Performa Proyek",
    properties: {
      entitySingular: "unit",
      entityPlural: "unit",
      locationLabel: "Proyek",
      locationAll: "Semua Proyek",
      pipelineTotalSuffix: "prospek",
      dealLabel: "Rata-rata Nilai Booking",
      closingSpeedLabel: "Siklus Closing",
      agentMetric: "booking",
      tableHeaders: ["Proyek", "Revenue", "Booking", "Konversi", "Target"],
      funnelStages: [
        ["Inquiry", 980, 100],
        ["Site Visit", 420, 43],
        ["Negosiasi", 210, 21],
        ["Booking", 96, 10],
        ["Akad / SP3K", 54, 5.5],
      ],
    },
    data: {
      branches: [
        { id: "bsd", name: "BSD City", revenue: 920, closing: 18, conversion: 5.4, target: 88 },
        { id: "cibubur-prop", name: "Cibubur", revenue: 640, closing: 14, conversion: 4.9, target: 79 },
        { id: "bekasi", name: "Bekasi Timur", revenue: 410, closing: 9, conversion: 4.1, target: 71 },
      ],
      agents: [
        { name: "Sari Wulandari", branch: "BSD City", closing: 8, revenue: 410 },
        { name: "Doni Prasetyo", branch: "Cibubur", closing: 6, revenue: 298 },
        { name: "Mega Anggraini", branch: "Bekasi Timur", closing: 5, revenue: 242 },
        { name: "Raka Firmansyah", branch: "BSD City", closing: 4, revenue: 196 },
      ],
      chart: dashboardChartSeed,
    },
    kpis: {
      revenueBase: 1970,
      pipelineBase: 980,
      conversionBase: 5.5,
      avgDeal: "Rp412 jt",
      closingSpeed: "18 hari",
      closingSpeedAlt: "16 hari",
      altBranchId: "bsd",
    },
    highlights: [
      {
        type: "warning",
        icon: "!",
        title: "12 inquiry hot tanpa site visit",
        copy: "{location} · potensi booking Rp2,4 M menunggu follow-up.",
      },
      {
        type: "positive",
        icon: "↑",
        title: "Booking rate naik 14%",
        copy: "Kanal Instagram Ads mengungguli referral minggu ini.",
      },
      {
        type: "info",
        icon: "i",
        title: "Forecast 102% target Q",
        copy: "Prioritaskan SP3K yang jatuh tempo 7 hari ke depan.",
      },
    ],
  },
  fnb: {
    id: "fnb",
    label: "F&B / Restoran",
    badge: "F&B",
    panelKicker: "MULTI-OUTLET",
    panelTitle: "Performa Outlet",
    properties: {
      entitySingular: "trx",
      entityPlural: "trx",
      locationLabel: "Outlet",
      locationAll: "Semua Outlet",
      pipelineTotalSuffix: "pesanan",
      dealLabel: "Rata-rata Ticket",
      closingSpeedLabel: "Waktu Saji",
      agentMetric: "trx",
      tableHeaders: ["Outlet", "Revenue", "Transaksi", "Konversi", "Target"],
      funnelStages: [
        ["Kunjungan", 8400, 100],
        ["Order", 6120, 73],
        ["Upsell", 2840, 34],
        ["Repeat", 1680, 20],
        ["Membership", 620, 7],
      ],
    },
    data: {
      branches: [
        { id: "kemang", name: "Kemang", revenue: 380, closing: 1240, conversion: 18.2, target: 94 },
        { id: "scbd", name: "SCBD", revenue: 420, closing: 1380, conversion: 19.4, target: 97 },
        { id: "pik", name: "PIK Avenue", revenue: 290, closing: 960, conversion: 16.1, target: 81 },
      ],
      agents: [
        { name: "Budi Santoso", branch: "SCBD", closing: 420, revenue: 128 },
        { name: "Lina Marlina", branch: "Kemang", closing: 390, revenue: 112 },
        { name: "Andi Wijaya", branch: "PIK Avenue", closing: 310, revenue: 94 },
        { name: "Sinta Dewi", branch: "SCBD", closing: 280, revenue: 86 },
      ],
      chart: dashboardChartSeed,
    },
    kpis: {
      revenueBase: 1090,
      pipelineBase: 8400,
      conversionBase: 18.1,
      avgDeal: "Rp128 rb",
      closingSpeed: "12 mnt",
      closingSpeedAlt: "9 mnt",
      altBranchId: "scbd",
    },
    highlights: [
      {
        type: "warning",
        icon: "!",
        title: "Antrian peak hour > 18 menit",
        copy: "{location} · risiko churn di jam makan siang.",
      },
      {
        type: "positive",
        icon: "↑",
        title: "Ticket size naik 9%",
        copy: "Bundle dessert + drink mengungguli promo a-la-carte.",
      },
      {
        type: "info",
        icon: "i",
        title: "Repeat rate 22%",
        copy: "Dorong membership loyalty di weekend untuk mengamankan target.",
      },
    ],
  },
  retail: {
    id: "retail",
    label: "Retail / Toko",
    badge: "Retail",
    panelKicker: "MULTI-TOKO",
    panelTitle: "Performa Toko",
    properties: {
      entitySingular: "order",
      entityPlural: "order",
      locationLabel: "Toko",
      locationAll: "Semua Toko",
      pipelineTotalSuffix: "order",
      dealLabel: "Basket Size",
      closingSpeedLabel: "Siklus Order",
      agentMetric: "order",
      tableHeaders: ["Toko", "Revenue", "Order", "Konversi", "Target"],
      funnelStages: [
        ["Traffic", 12400, 100],
        ["Browse", 6200, 50],
        ["Cart", 2480, 20],
        ["Checkout", 1480, 12],
        ["Paid", 1120, 9],
      ],
    },
    data: {
      branches: [
        { id: "mall-tbs", name: "Mall TB Simatupang", revenue: 510, closing: 420, conversion: 9.2, target: 86 },
        { id: "mall-pi", name: "Mall Pondok Indah", revenue: 640, closing: 510, conversion: 10.1, target: 93 },
        { id: "online", name: "Online Store", revenue: 380, closing: 680, conversion: 7.4, target: 78 },
      ],
      agents: [
        { name: "Rina Kusuma", branch: "Mall Pondok Indah", closing: 180, revenue: 210 },
        { name: "Hendra Gunawan", branch: "Mall TB Simatupang", closing: 150, revenue: 168 },
        { name: "Putri Ayu", branch: "Online Store", closing: 240, revenue: 142 },
        { name: "Yoga Pratama", branch: "Mall Pondok Indah", closing: 120, revenue: 118 },
      ],
      chart: dashboardChartSeed,
    },
    kpis: {
      revenueBase: 1530,
      pipelineBase: 2480,
      conversionBase: 9.0,
      avgDeal: "Rp486 rb",
      closingSpeed: "2,4 hari",
      closingSpeedAlt: "1,8 hari",
      altBranchId: "mall-pi",
    },
    highlights: [
      {
        type: "warning",
        icon: "!",
        title: "Cart abandonment 38%",
        copy: "{location} · pulihkan checkout dengan reminder WA 1 jam.",
      },
      {
        type: "positive",
        icon: "↑",
        title: "Sell-through naik 11%",
        copy: "SKU hero kategori fashion memimpin kontribusi margin.",
      },
      {
        type: "info",
        icon: "i",
        title: "Stok kritis 14 SKU",
        copy: "Reorder sebelum weekend campaign untuk hindari stockout.",
      },
    ],
  },
  healthcare: {
    id: "healthcare",
    label: "Klinik / Healthcare",
    badge: "Klinik",
    panelKicker: "MULTI-CABANG",
    panelTitle: "Performa Cabang Klinik",
    properties: {
      entitySingular: "visit",
      entityPlural: "visit",
      locationLabel: "Cabang",
      locationAll: "Semua Cabang",
      pipelineTotalSuffix: "booking",
      dealLabel: "Rata-rata Biaya Visit",
      closingSpeedLabel: "Waktu Tunggu",
      agentMetric: "visit",
      tableHeaders: ["Cabang", "Revenue", "Visit", "Konversi", "Target"],
      funnelStages: [
        ["Inquiry", 1860, 100],
        ["Booking", 1240, 67],
        ["Hadir", 980, 53],
        ["Follow-up", 420, 23],
        ["Paket Lanjutan", 186, 10],
      ],
    },
    data: {
      branches: [
        { id: "klinik-sb", name: "Senayan", revenue: 420, closing: 310, conversion: 14.2, target: 90 },
        { id: "klinik-kb", name: "Kelapa Gading", revenue: 360, closing: 280, conversion: 13.1, target: 84 },
        { id: "klinik-depok", name: "Depok", revenue: 290, closing: 240, conversion: 12.4, target: 77 },
      ],
      agents: [
        { name: "dr. Maya Sari", branch: "Senayan", closing: 98, revenue: 142 },
        { name: "dr. Farhan", branch: "Kelapa Gading", closing: 86, revenue: 118 },
        { name: "Ns. Dinda", branch: "Depok", closing: 74, revenue: 96 },
        { name: "dr. Arief", branch: "Senayan", closing: 68, revenue: 88 },
      ],
      chart: dashboardChartSeed,
    },
    kpis: {
      revenueBase: 1070,
      pipelineBase: 1240,
      conversionBase: 13.4,
      avgDeal: "Rp860 rb",
      closingSpeed: "22 mnt",
      closingSpeedAlt: "16 mnt",
      altBranchId: "klinik-sb",
    },
    highlights: [
      {
        type: "warning",
        icon: "!",
        title: "No-show rate 11%",
        copy: "{location} · kirim reminder H-1 untuk menekan absensi.",
      },
      {
        type: "positive",
        icon: "↑",
        title: "Booking online naik 21%",
        copy: "WhatsApp booking mengungguli call center minggu ini.",
      },
      {
        type: "info",
        icon: "i",
        title: "Slot dokter penuhi 96%",
        copy: "Buka shift sore di cabang terpadat untuk serap demand.",
      },
    ],
  },
  education: {
    id: "education",
    label: "Edukasi / Kursus",
    badge: "Edukasi",
    panelKicker: "MULTI-KAMPUS",
    panelTitle: "Performa Kampus",
    properties: {
      entitySingular: "siswa",
      entityPlural: "siswa",
      locationLabel: "Kampus",
      locationAll: "Semua Kampus",
      pipelineTotalSuffix: "pendaftar",
      dealLabel: "Rata-rata Biaya Program",
      closingSpeedLabel: "Siklus Enrollment",
      agentMetric: "enroll",
      tableHeaders: ["Kampus", "Revenue", "Enrollment", "Konversi", "Target"],
      funnelStages: [
        ["Lead", 3200, 100],
        ["Trial Class", 1280, 40],
        ["Konsultasi", 760, 24],
        ["Daftar", 420, 13],
        ["Bayar Lunas", 310, 10],
      ],
    },
    data: {
      branches: [
        { id: "kampus-jkt", name: "Jakarta Selatan", revenue: 520, closing: 140, conversion: 11.2, target: 88 },
        { id: "kampus-bdg", name: "Bandung", revenue: 380, closing: 110, conversion: 10.4, target: 82 },
        { id: "kampus-sby", name: "Surabaya", revenue: 340, closing: 96, conversion: 9.8, target: 76 },
      ],
      agents: [
        { name: "Citra Ananda", branch: "Jakarta Selatan", closing: 48, revenue: 168 },
        { name: "Bagas Putra", branch: "Bandung", closing: 36, revenue: 124 },
        { name: "Nisa Rahma", branch: "Surabaya", closing: 32, revenue: 110 },
        { name: "Eko Saputra", branch: "Jakarta Selatan", closing: 28, revenue: 98 },
      ],
      chart: dashboardChartSeed,
    },
    kpis: {
      revenueBase: 1240,
      pipelineBase: 3200,
      conversionBase: 10.6,
      avgDeal: "Rp4,8 jt",
      closingSpeed: "9 hari",
      closingSpeedAlt: "7 hari",
      altBranchId: "kampus-jkt",
    },
    highlights: [
      {
        type: "warning",
        icon: "!",
        title: "64 lead trial belum di-follow",
        copy: "{location} · potensi enrollment Rp280 jt menunggu konsultan.",
      },
      {
        type: "positive",
        icon: "↑",
        title: "Conversion trial naik 3,2 pt",
        copy: "Skript demo kelas hybrid meningkatkan closing.",
      },
      {
        type: "info",
        icon: "i",
        title: "Batch baru 2 minggu lagi",
        copy: "Isi kuota early bird sebelum harga normal berlaku.",
      },
    ],
  },
  custom: {
    id: "custom",
    label: "Lainnya",
    badge: "Custom",
    panelKicker: "MULTI-LOKASI",
    panelTitle: "Performa Lokasi",
    properties: {
      entitySingular: "trx",
      entityPlural: "trx",
      locationLabel: "Lokasi",
      locationAll: "Semua Lokasi",
      pipelineTotalSuffix: "prospek",
      dealLabel: "Rata-rata Nilai",
      closingSpeedLabel: "Siklus Closing",
      agentMetric: "closing",
      tableHeaders: ["Lokasi", "Revenue", "Closing", "Konversi", "Target"],
      funnelStages: [
        ["Lead", 1000, 100],
        ["Terhubung", 680, 68],
        ["Kualifikasi", 420, 42],
        ["Proposal", 210, 21],
        ["Deal", 96, 10],
      ],
    },
    data: {
      branches: [
        { id: "lokasi-a", name: "Lokasi A", revenue: 520, closing: 28, conversion: 7.2, target: 85 },
        { id: "lokasi-b", name: "Lokasi B", revenue: 440, closing: 22, conversion: 6.8, target: 78 },
        { id: "lokasi-c", name: "Lokasi C", revenue: 360, closing: 18, conversion: 6.1, target: 72 },
      ],
      agents: [
        { name: "Agent Satu", branch: "Lokasi A", closing: 12, revenue: 180 },
        { name: "Agent Dua", branch: "Lokasi B", closing: 10, revenue: 150 },
        { name: "Agent Tiga", branch: "Lokasi C", closing: 8, revenue: 120 },
        { name: "Agent Empat", branch: "Lokasi A", closing: 7, revenue: 110 },
      ],
      chart: dashboardChartSeed,
    },
    kpis: {
      revenueBase: 1320,
      pipelineBase: 1000,
      conversionBase: 6.8,
      avgDeal: "Rp18,4 jt",
      closingSpeed: "6,2 hari",
      closingSpeedAlt: "5,1 hari",
      altBranchId: "lokasi-a",
    },
    highlights: [
      {
        type: "warning",
        icon: "!",
        title: "9 prospek hot tanpa follow-up",
        copy: "{location} · amankan peluang sebelum cold.",
      },
      {
        type: "positive",
        icon: "↑",
        title: "Pipeline tumbuh 12%",
        copy: "Sumber omnichannel mendorong prospek baru.",
      },
      {
        type: "info",
        icon: "i",
        title: "Sesuaikan highlight board",
        copy: "Edit prioritas di panel personalisasi agar relevan bisnis Anda.",
      },
    ],
  },
};

Object.assign(
  dashboardVerticalPresets.automotive,
  makeDashboardShell({
    locationWord: "Cabang",
    salesLabel: "Sales Performance",
    channelsLabel: "Omnichannel",
    overviewDesc: "Ringkasan lintas cabang untuk keputusan strategis dan pertumbuhan bisnis.",
    salesDesc: "Pantau kualitas pipeline, produktivitas tim, dan peluang closing unit dari satu layar.",
    locationsDesc: "Fokus pada target, aktivitas sales, dan prioritas operasional cabang hari ini.",
    channelsDesc: "WhatsApp, Instagram, Facebook, dan Website — kontribusi lead sampai closing unit.",
    sidebarTitle: "Satu data, beda kebutuhan",
    sidebarCopy: "Direktur, Sales Manager, dan Kepala Cabang melihat layout berbeda dari menu kiri.",
  }),
  {
    channels: [
      { name: "WhatsApp", share: 42, leads: 524, conversion: 9.4, revenue: 620 },
      { name: "Instagram", share: 24, leads: 298, conversion: 7.1, revenue: 310 },
      { name: "Facebook", share: 18, leads: 224, conversion: 6.4, revenue: 240 },
      { name: "Website", share: 16, leads: 202, conversion: 5.8, revenue: 190 },
    ],
  },
);

Object.assign(
  dashboardVerticalPresets.property,
  makeDashboardShell({
    locationWord: "Proyek",
    salesLabel: "Sales Booking",
    channelsLabel: "Channel Leads",
    overviewDesc: "Ringkasan lintas proyek properti: inquiry, site visit, booking, dan SP3K.",
    salesDesc: "Pipeline booking, agent marketing, dan nilai unit yang sedang digarap.",
    locationsDesc: "Komparasi performa tiap proyek/site: booking rate, revenue, dan target.",
    channelsDesc: "IG Ads, portal properti, referral, dan walk-in — sumber inquiry terkuat.",
    sidebarTitle: "Dashboard properti",
    sidebarCopy: "Menu kiri: overview → booking → proyek → channel leads.",
  }),
  {
    channels: [
      { name: "Instagram Ads", share: 34, leads: 334, conversion: 6.2, revenue: 680 },
      { name: "Portal Properti", share: 28, leads: 274, conversion: 5.1, revenue: 520 },
      { name: "Referral", share: 22, leads: 216, conversion: 8.4, revenue: 460 },
      { name: "Walk-in Site", share: 16, leads: 156, conversion: 11.2, revenue: 310 },
    ],
  },
);

Object.assign(
  dashboardVerticalPresets.fnb,
  makeDashboardShell({
    locationWord: "Outlet",
    salesLabel: "Sales Outlet",
    channelsLabel: "Channel Order",
    overviewDesc: "Ringkasan multi-outlet: revenue, ticket size, dan repeat order.",
    salesDesc: "Performa shift, upsell, dan konversi order di seluruh outlet.",
    locationsDesc: "Bandingkan outlet: antrian, transaksi, dan pencapaian target harian.",
    channelsDesc: "Dine-in, GrabFood, Gofood, dan WhatsApp order — bauran channel F&B.",
    sidebarTitle: "Dashboard F&B",
    sidebarCopy: "Menu kiri menyesuaikan restoran multi-outlet dan channel order.",
  }),
  {
    channels: [
      { name: "Dine-in", share: 38, leads: 3190, conversion: 92, revenue: 410 },
      { name: "GrabFood", share: 26, leads: 2180, conversion: 18.4, revenue: 280 },
      { name: "Gofood", share: 22, leads: 1840, conversion: 17.1, revenue: 240 },
      { name: "WhatsApp Order", share: 14, leads: 1190, conversion: 24.6, revenue: 160 },
    ],
  },
);

Object.assign(
  dashboardVerticalPresets.retail,
  makeDashboardShell({
    locationWord: "Toko",
    salesLabel: "Sales Retail",
    channelsLabel: "Channel Commerce",
    overviewDesc: "Ringkasan multi-toko: traffic, basket size, dan sell-through.",
    salesDesc: "Order paid, conversion cart, dan ranking associate per toko.",
    locationsDesc: "Performa tiap toko/mall vs online store dalam satu tampilan.",
    channelsDesc: "Toko fisik, marketplace, website, dan social commerce.",
    sidebarTitle: "Dashboard retail",
    sidebarCopy: "Menu kiri: overview → sales → toko → channel commerce.",
  }),
  {
    channels: [
      { name: "Toko Fisik", share: 40, leads: 4960, conversion: 11.2, revenue: 620 },
      { name: "Marketplace", share: 30, leads: 3720, conversion: 8.1, revenue: 480 },
      { name: "Website", share: 18, leads: 2230, conversion: 6.4, revenue: 260 },
      { name: "Social Commerce", share: 12, leads: 1490, conversion: 9.8, revenue: 170 },
    ],
  },
);

Object.assign(
  dashboardVerticalPresets.healthcare,
  makeDashboardShell({
    locationWord: "Cabang",
    salesLabel: "Booking & Visit",
    channelsLabel: "Channel Booking",
    overviewDesc: "Ringkasan multi-cabang klinik: booking, visit, dan no-show.",
    salesDesc: "Pipeline inquiry → booking → hadir → paket lanjutan.",
    locationsDesc: "Utilisasi slot dan revenue tiap cabang klinik.",
    channelsDesc: "WhatsApp, call center, Google, dan partner asuransi.",
    sidebarTitle: "Dashboard klinik",
    sidebarCopy: "Menu kiri menyesuaikan alur booking pasien multi-cabang.",
    sectionLabel: "Klinik Analytics",
  }),
  {
    channels: [
      { name: "WhatsApp", share: 36, leads: 670, conversion: 16.2, revenue: 360 },
      { name: "Call Center", share: 28, leads: 520, conversion: 14.1, revenue: 290 },
      { name: "Google Business", share: 22, leads: 410, conversion: 11.4, revenue: 220 },
      { name: "Partner Asuransi", share: 14, leads: 260, conversion: 19.8, revenue: 200 },
    ],
  },
);

Object.assign(
  dashboardVerticalPresets.education,
  makeDashboardShell({
    locationWord: "Kampus",
    salesLabel: "Enrollment",
    channelsLabel: "Channel Leads",
    overviewDesc: "Ringkasan multi-kampus: lead, trial, dan enrollment lunas.",
    salesDesc: "Produktivitas konsultan dan funnel trial → bayar.",
    locationsDesc: "Performa enrollment tiap kampus vs target batch.",
    channelsDesc: "Meta Ads, webinar, referral siswa, dan school visit.",
    sidebarTitle: "Dashboard edukasi",
    sidebarCopy: "Menu kiri: overview → enrollment → kampus → channel leads.",
    sectionLabel: "Education Analytics",
  }),
  {
    channels: [
      { name: "Meta Ads", share: 32, leads: 1020, conversion: 9.1, revenue: 380 },
      { name: "Webinar", share: 26, leads: 830, conversion: 14.6, revenue: 340 },
      { name: "Referral Siswa", share: 24, leads: 770, conversion: 18.2, revenue: 310 },
      { name: "School Visit", share: 18, leads: 580, conversion: 12.4, revenue: 210 },
    ],
  },
);

Object.assign(
  dashboardVerticalPresets.custom,
  makeDashboardShell({
    locationWord: "Lokasi",
    salesLabel: "Sales Performance",
    channelsLabel: "Channel Mix",
    overviewDesc: "Ringkasan generik multi-lokasi — sesuaikan highlight untuk bisnis Anda.",
    salesDesc: "Pipeline dan produktivitas tim sales generik.",
    locationsDesc: "Komparasi performa tiap lokasi operasional.",
    channelsDesc: "Bauran channel lead/order generik untuk demo multi-industri.",
    sidebarTitle: "Dashboard custom",
    sidebarCopy: "Layout menu menyesuaikan deskripsi bisnis yang Anda isi di onboarding.",
  }),
  {
    channels: [
      { name: "WhatsApp", share: 35, leads: 350, conversion: 8.2, revenue: 420 },
      { name: "Website", share: 25, leads: 250, conversion: 6.4, revenue: 280 },
      { name: "Marketplace", share: 22, leads: 220, conversion: 5.9, revenue: 240 },
      { name: "Referral", share: 18, leads: 180, conversion: 11.1, revenue: 200 },
    ],
  },
);

class OneDashboardDemo {
  constructor(root) {
    this.root = root;
    this.role = "director";
    this.navView = "overview";
    this.period = "mtd";
    this.branch = "all";
    this.visibleWidgets = new Set(dashboardDemoRoles.director.widgets);
    this.lastFocusedElement = null;
    this.hasOpenedCustomizer = false;
    this.liveMetrics = null;
    this.verticalId = null;
    this.pendingVerticalId = "automotive";
    this.businessDescription = "";
    this.highlightsOverride = null;
    this.highlightsDirty = false;

    this.onboarding = root.querySelector("[data-dashboard-onboarding]");
    this.workspace = root.querySelector("[data-dashboard-workspace]");
    this.customizer = root.querySelector("[data-dashboard-customizer]");
    this.customizerBackdrop = root.querySelector("[data-dashboard-customizer-backdrop]");
    this.toast = root.querySelector("[data-dashboard-toast]");
    this.kpiGrid = root.querySelector("[data-dashboard-widget='kpi']");
    this.chart = root.querySelector("[data-dashboard-chart]");
    this.funnel = root.querySelector("[data-dashboard-funnel]");
    this.branchTable = root.querySelector("[data-dashboard-branch-table]");
    this.agentList = root.querySelector("[data-dashboard-agent-list]");
    this.channelList = root.querySelector("[data-dashboard-channel-list]");
    this.alertList = root.querySelector("[data-dashboard-alert-list]");
    this.branchSelect = root.querySelector("[data-dashboard-branch]");
    this.industryBadge = root.querySelector("[data-dashboard-industry-badge]");
    this.changeBusinessBtn = root.querySelector("[data-dashboard-change-business]");
    this.businessDescInput = root.querySelector("[data-dashboard-business-desc]");
    this.highlightEditors = root.querySelector("[data-dashboard-highlight-editors]");
    this.hasOpenedGuide = false;

    this.tour = new DemoProductTour(root, {
      ns: "dashboard",
      anchorAttr: "data-dashboard-anchor",
      getSteps: () => this.guideSteps(),
      getStepLabel: (step, index, total) => {
        const viewLabel = step.label || "One Dashboard";
        return total > 1
          ? `${String(viewLabel).toUpperCase()} · LANGKAH ${index} DARI ${total}`
          : String(viewLabel).toUpperCase();
      },
    });

    this.bind();
    publicDemoData
      .snapshot()
      .then((snapshot) => {
        this.liveMetrics = snapshot.leads;
        if (this.verticalId) this.render();
      })
      .catch(() => {});
  }

  guideSteps() {
    return [
      {
        anchor: "sidebar",
        label: "One Dashboard",
        title: "Command Center eksekutif",
        body: "Satu dashboard untuk Direktur, Sales Manager, dan Kepala Cabang. Navigasi kiri memilih view — pola panduan sama dengan Inventory Management.",
      },
      {
        anchor: "heading",
        label: "Filter",
        title: "Periode & lokasi",
        body: "Pilih cabang dan periode MTD/QTD/YTD. KPI dan chart langsung menyesuaikan data tenant demo.",
      },
      {
        anchor: "kpi",
        label: "KPI",
        title: "KPI utama",
        body: "Kartu KPI menampilkan revenue, pipeline, conversion, dan metrik prioritas sesuai industri yang dipilih di onboarding.",
      },
      {
        anchor: "revenue",
        label: "Tren",
        title: "Tren pendapatan + forecast",
        body: "Grafik aktual vs forecast membantu melihat momentum bulanan lintas cabang.",
      },
      {
        anchor: "pipeline",
        label: "Pipeline",
        title: "Corong konversi",
        body: "Pipeline sales menunjukkan volume lead di setiap tahap hingga closing.",
      },
      {
        anchor: "customize",
        label: "Personalisasi",
        title: "Sesuaikan dashboard",
        body: "Tombol Sesuaikan membuka panel peran + widget. Selesai — silakan atur layout atau ganti industri lewat Ganti bisnis.",
      },
    ];
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-dashboard-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }

    for (const button of this.root.querySelectorAll("[data-close-dashboard-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-dashboard-reset]").addEventListener("click", () => this.reset());
    this.changeBusinessBtn.addEventListener("click", () => this.showOnboarding(true));
    this.root.querySelector("[data-dashboard-skip-onboarding]").addEventListener("click", () => {
      this.applyVertical("automotive", this.businessDescInput?.value || "");
    });
    this.root.querySelector("[data-dashboard-generate]").addEventListener("click", () => {
      this.applyVertical(this.pendingVerticalId || "automotive", this.businessDescInput?.value || "");
    });

    for (const button of this.root.querySelectorAll("[data-dashboard-vertical]")) {
      button.addEventListener("click", () => {
        this.pendingVerticalId = button.dataset.dashboardVertical || "automotive";
        this.syncVerticalCards();
      });
    }

    this.root.querySelector("[data-dashboard-customize]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-dashboard-customize-banner]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-dashboard-customize-sidebar]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-dashboard-customizer-close]").addEventListener("click", () => this.closeCustomizer());
    this.customizerBackdrop.addEventListener("click", () => this.closeCustomizer());
    this.root.querySelector("[data-dashboard-highlight-reset]").addEventListener("click", () => {
      this.highlightsOverride = null;
      this.highlightsDirty = false;
      this.syncHighlightEditors();
      this.renderAlerts();
    });

    for (const button of this.root.querySelectorAll("[data-dashboard-period]")) {
      button.addEventListener("click", () => {
        this.period = button.dataset.dashboardPeriod || "mtd";
        this.render();
      });
    }

    this.branchSelect.addEventListener("change", () => {
      this.branch = this.branchSelect.value;
      this.render();
    });

    for (const button of this.root.querySelectorAll("[data-dashboard-nav]")) {
      button.addEventListener("click", () => {
        this.setNavView(button.dataset.dashboardNav || "overview");
      });
    }

    for (const button of this.root.querySelectorAll("[data-dashboard-role]")) {
      button.addEventListener("click", () => {
        this.role = button.dataset.dashboardRole || "director";
        const roleNav = dashboardDemoRoles[this.role]?.navView || "overview";
        this.navView = roleNav;
        this.visibleWidgets = new Set(this.getViewConfig().widgets);
        this.syncWidgetInputs();
        this.syncNavButtons();
        this.render();
      });
    }

    for (const input of this.root.querySelectorAll("[data-dashboard-toggle]")) {
      input.addEventListener("change", () => {
        const widget = input.dataset.dashboardToggle;
        if (!widget) return;
        if (input.checked) this.visibleWidgets.add(widget);
        else this.visibleWidgets.delete(widget);
        this.renderWidgets();
      });
    }

    this.root.querySelector("[data-dashboard-save]").addEventListener("click", () => {
      if (this.highlightsDirty) this.readHighlightEditors();
      this.closeCustomizer();
      const preset = this.getPreset();
      const badge = preset.badge || "Demo";
      const desc = this.businessDescription.trim();
      this.root.querySelector("[data-dashboard-toast-copy]").textContent = desc
        ? `Dashboard ${dashboardDemoRoles[this.role].label} · ${badge} siap · “${desc.slice(0, 48)}${desc.length > 48 ? "…" : ""}”`
        : `Dashboard ${dashboardDemoRoles[this.role].label} untuk ${badge} siap digunakan.`;
      this.toast.hidden = false;
      this.toast.querySelector("[data-dashboard-toast-close]").focus();
    });

    this.root.querySelector("[data-dashboard-toast-close]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) {
        this.toast.hidden = true;
      } else if (this.tour?.isOpen) {
        this.closeGuide();
      } else if (this.customizer.classList.contains("is-open")) {
        this.closeCustomizer();
      } else if (this.onboarding && !this.onboarding.hidden && this.verticalId) {
        this.hideOnboarding();
      } else {
        this.close();
      }
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");

    if (!this.verticalId) {
      this.showOnboarding(false);
      this.root.querySelector("[data-close-dashboard-demo]").focus();
      return;
    }

    this.hideOnboarding();
    this.root.querySelector("[data-close-dashboard-demo]").focus();
    if (!this.hasOpenedGuide) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
    }
  }

  close() {
    this.closeGuide();
    this.closeCustomizer();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    this.closeCustomizer();
    this.tour?.open(startIndex);
  }

  closeGuide() {
    this.tour?.close();
  }

  showOnboarding(keepWorkspace) {
    this.closeCustomizer();
    this.toast.hidden = true;
    this.pendingVerticalId = this.verticalId || this.pendingVerticalId || "automotive";
    if (this.businessDescInput) this.businessDescInput.value = this.businessDescription;
    this.syncVerticalCards();
    if (this.onboarding) this.onboarding.hidden = false;
    if (this.workspace && !keepWorkspace) this.workspace.hidden = true;
    if (this.workspace && keepWorkspace) this.workspace.hidden = true;
    this.changeBusinessBtn.hidden = true;
    if (this.industryBadge) this.industryBadge.hidden = true;
  }

  hideOnboarding() {
    if (this.onboarding) this.onboarding.hidden = true;
    if (this.workspace) this.workspace.hidden = false;
    this.changeBusinessBtn.hidden = !this.verticalId;
    if (this.industryBadge) {
      this.industryBadge.hidden = !this.verticalId;
    }
  }

  syncVerticalCards() {
    for (const button of this.root.querySelectorAll("[data-dashboard-vertical]")) {
      const active = button.dataset.dashboardVertical === this.pendingVerticalId;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    }
  }

  applyVertical(id, description) {
    const preset = dashboardVerticalPresets[id] || dashboardVerticalPresets.automotive;
    this.verticalId = preset.id;
    this.pendingVerticalId = preset.id;
    this.businessDescription = (description || "").trim().slice(0, 280);
    this.highlightsOverride = null;
    this.highlightsDirty = false;
    this.role = "director";
    this.navView = "overview";
    this.period = "mtd";
    this.branch = "all";
    this.visibleWidgets = new Set(this.getViewConfig().widgets);
    this.syncWidgetInputs();
    this.renderBranchSelect();
    this.renderSidebarNav();
    this.syncHighlightEditors();
    this.hideOnboarding();
    this.render();

    if (this.industryBadge) {
      this.industryBadge.textContent = preset.badge;
      this.industryBadge.hidden = false;
    }
    this.changeBusinessBtn.hidden = false;

    if (!this.hasOpenedGuide) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
    }
  }

  getPreset() {
    return dashboardVerticalPresets[this.verticalId] || dashboardVerticalPresets.automotive;
  }

  getViewConfig() {
    const preset = this.getPreset();
    const views = preset.views || {};
    return (
      views[this.navView] ||
      views.overview || {
        title: "Executive Overview",
        description: "Ringkasan performa bisnis.",
        widgets: dashboardNavViewWidgets.overview,
        role: "director",
      }
    );
  }

  setNavView(viewId) {
    if (!this.verticalId) return;
    const preset = this.getPreset();
    const next = preset.views?.[viewId] ? viewId : "overview";
    this.navView = next;
    const view = this.getViewConfig();
    if (view.role && dashboardDemoRoles[view.role]) {
      this.role = view.role;
    }
    this.visibleWidgets = new Set(view.widgets || dashboardNavViewWidgets.overview);
    this.syncWidgetInputs();
    this.syncNavButtons();
    this.render();
  }

  renderSidebarNav() {
    const preset = this.getPreset();
    const nav = preset.nav || [];
    const sidebar = preset.sidebar || {};

    const section = this.root.querySelector("[data-dashboard-nav-section]");
    if (section) section.textContent = sidebar.section || "Analytics";

    const kicker = this.root.querySelector("[data-dashboard-sidebar-kicker]");
    const title = this.root.querySelector("[data-dashboard-sidebar-title]");
    const copy = this.root.querySelector("[data-dashboard-sidebar-copy]");
    if (kicker) kicker.textContent = sidebar.kicker || "DASHBOARD ANDA";
    if (title) title.textContent = sidebar.title || "Satu data, beda kebutuhan";
    if (copy) copy.textContent = sidebar.copy || "";

    for (const button of this.root.querySelectorAll("[data-dashboard-nav]")) {
      const id = button.dataset.dashboardNav;
      const item = nav.find((entry) => entry.id === id);
      const label = button.querySelector("[data-dashboard-nav-label]");
      if (label && item) label.textContent = item.label;
    }
    this.syncNavButtons();
  }

  syncNavButtons() {
    for (const button of this.root.querySelectorAll("[data-dashboard-nav]")) {
      const active = button.dataset.dashboardNav === this.navView;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }

  getData() {
    const preset = this.getPreset();
    return preset.data || dashboardDemoData;
  }

  getProperties() {
    return this.getPreset().properties;
  }

  getKpisConfig() {
    const preset = this.getPreset();
    if (preset.kpis) return preset.kpis;
    return {
      revenueBase: 1840,
      pipelineBase: this.liveMetrics?.total || 1248,
      conversionBase: this.liveMetrics?.conversion_rate || 7.7,
      avgDeal: "Rp23,6 jt",
      closingSpeed: "4,8 hari",
      closingSpeedAlt: "4,2 hari",
      altBranchId: "cinere",
      conversionBoostBranchId: "pondok-bambu",
      conversionBoost: 0.7,
      isAutomotive: true,
    };
  }

  openCustomizer() {
    if (!this.verticalId) return;
    this.syncHighlightEditors();
    this.customizer.classList.add("is-open");
    this.customizer.setAttribute("aria-hidden", "false");
    this.customizerBackdrop.hidden = false;
    this.customizer.querySelector("[data-dashboard-customizer-close]").focus();
  }

  closeCustomizer() {
    this.customizer.classList.remove("is-open");
    this.customizer.setAttribute("aria-hidden", "true");
    this.customizerBackdrop.hidden = true;
  }

  reset() {
    this.role = "director";
    this.navView = "overview";
    this.period = "mtd";
    this.branch = "all";
    this.verticalId = null;
    this.pendingVerticalId = "automotive";
    this.businessDescription = "";
    this.highlightsOverride = null;
    this.highlightsDirty = false;
    this.hasOpenedCustomizer = false;
    this.visibleWidgets = new Set(dashboardDemoRoles.director.widgets);
    this.toast.hidden = true;
    this.closeCustomizer();
    if (this.businessDescInput) this.businessDescInput.value = "";
    this.syncWidgetInputs();
    this.syncNavButtons();
    this.showOnboarding(false);
  }

  syncWidgetInputs() {
    for (const input of this.root.querySelectorAll("[data-dashboard-toggle]")) {
      input.checked = this.visibleWidgets.has(input.dataset.dashboardToggle);
    }
  }

  periodMultiplier() {
    if (this.period === "qtd") return 2.56;
    if (this.period === "ytd") return 6.84;
    return 1;
  }

  branchMultiplier() {
    if (this.branch === "all") return 1;
    if (this.verticalId === "automotive") {
      if (this.branch === "pondok-bambu") return 0.4;
      if (this.branch === "cinere") return 0.335;
      if (this.branch === "cibubur") return 0.265;
    }
    const branches = this.getData().branches;
    const total = branches.reduce((sum, item) => sum + item.revenue, 0) || 1;
    const found = branches.find((item) => item.id === this.branch);
    return found ? found.revenue / total : 1;
  }

  scopedBranches() {
    const branches = this.getData().branches;
    if (this.branch === "all") return branches;
    return branches.filter((branch) => branch.id === this.branch);
  }

  getSelectedLocationName() {
    if (!this.branchSelect || this.branchSelect.selectedIndex < 0) {
      return this.getProperties().locationAll;
    }
    return this.branchSelect.options[this.branchSelect.selectedIndex].text;
  }

  renderBranchSelect() {
    const props = this.getProperties();
    const data = this.getData();
    const labelEl = this.root.querySelector("[data-dashboard-location-label]");
    if (labelEl) labelEl.textContent = props.locationLabel;

    const options = [
      `<option value="all">${props.locationAll}</option>`,
      ...data.branches.map((branch) => `<option value="${branch.id}">${branch.name}</option>`),
    ];
    this.branchSelect.innerHTML = options.join("");
    this.branch = "all";
    this.branchSelect.value = "all";
  }

  getActiveHighlights() {
    if (this.highlightsOverride) {
      return this.highlightsOverride.map((item) => ({ ...item }));
    }
    return this.buildDefaultHighlights();
  }

  buildDefaultHighlights() {
    const locationName = this.getSelectedLocationName();
    const preset = this.getPreset();

    if (preset.highlights) {
      return preset.highlights.map((item) => ({
        type: item.type,
        icon: item.icon,
        title: item.title,
        copy: String(item.copy).replaceAll("{location}", locationName),
      }));
    }

    return [
      {
        type: "warning",
        icon: "!",
        title: "7 lead HOT belum ditindaklanjuti",
        copy: `${locationName} · potensi Rp186 jt menunggu respons sales.`,
      },
      {
        type: "positive",
        icon: "↑",
        title: "Konversi naik 18,6%",
        copy: "WhatsApp menjadi sumber dengan pertumbuhan closing tertinggi.",
      },
      {
        type: "info",
        icon: "i",
        title: "Forecast mencapai 108% target",
        copy: "Pertahankan kecepatan follow-up untuk mengamankan proyeksi.",
      },
    ];
  }

  syncHighlightEditors() {
    if (!this.highlightEditors) return;
    const highlights = this.getActiveHighlights();
    this.highlightEditors.innerHTML = highlights
      .map(
        (item, index) => `
          <div class="dashboard-highlight-editor" data-highlight-index="${index}">
            <div class="dashboard-highlight-editor-top">
              <label>
                <span>Tipe</span>
                <select data-highlight-type>
                  <option value="warning"${item.type === "warning" ? " selected" : ""}>Warning</option>
                  <option value="positive"${item.type === "positive" ? " selected" : ""}>Positif</option>
                  <option value="info"${item.type === "info" ? " selected" : ""}>Info</option>
                </select>
              </label>
              <label class="dashboard-highlight-title-field">
                <span>Judul</span>
                <input type="text" data-highlight-title maxlength="80" value="" />
              </label>
            </div>
            <label>
              <span>Copy</span>
              <textarea data-highlight-copy maxlength="160" rows="2"></textarea>
            </label>
          </div>
        `,
      )
      .join("");

    for (const [index, item] of highlights.entries()) {
      const block = this.highlightEditors.querySelector(`[data-highlight-index="${index}"]`);
      if (!block) continue;
      block.querySelector("[data-highlight-title]").value = item.title;
      block.querySelector("[data-highlight-copy]").value = item.copy;
    }

    for (const input of this.highlightEditors.querySelectorAll("input, select, textarea")) {
      input.addEventListener("input", () => {
        this.highlightsDirty = true;
        this.readHighlightEditors();
        this.renderAlerts();
      });
      input.addEventListener("change", () => {
        this.highlightsDirty = true;
        this.readHighlightEditors();
        this.renderAlerts();
      });
    }
  }

  readHighlightEditors() {
    if (!this.highlightEditors) return;
    const blocks = [...this.highlightEditors.querySelectorAll(".dashboard-highlight-editor")];
    if (!blocks.length) return;
    this.highlightsOverride = blocks.map((block) => {
      const type = block.querySelector("[data-highlight-type]")?.value || "info";
      const icon = type === "warning" ? "!" : type === "positive" ? "↑" : "i";
      return {
        type,
        icon,
        title: (block.querySelector("[data-highlight-title]")?.value || "").trim() || "Highlight",
        copy: (block.querySelector("[data-highlight-copy]")?.value || "").trim() || "—",
      };
    });
  }

  renderAlerts() {
    if (!this.alertList) return;
    const alerts = this.getActiveHighlights();
    this.alertList.innerHTML = alerts
      .map(
        (alert) => `
          <div class="dashboard-alert-item ${alert.type}">
            <span>${alert.icon}</span>
            <div><b></b><p></p></div>
          </div>
        `,
      )
      .join("");

    const nodes = this.alertList.querySelectorAll(".dashboard-alert-item");
    alerts.forEach((alert, index) => {
      const node = nodes[index];
      if (!node) return;
      node.querySelector("b").textContent = alert.title;
      node.querySelector("p").textContent = alert.copy;
    });

    const countEl = this.root.querySelector("[data-dashboard-alert-count]");
    if (countEl) countEl.textContent = `${alerts.length} perlu perhatian`;
  }

  render() {
    if (!this.verticalId) return;

    const view = this.getViewConfig();
    const props = this.getProperties();
    const data = this.getData();
    const kpisConfig = this.getKpisConfig();
    const preset = this.getPreset();
    const multiplier = this.periodMultiplier() * this.branchMultiplier();
    const periodLabel = this.period.toLocaleUpperCase("id");
    const isChannelsView = this.navView === "channels";
    const isLocationsView = this.navView === "locations";

    this.syncNavButtons();

    this.root.querySelector("[data-dashboard-title]").textContent = view.title;
    this.root.querySelector("[data-dashboard-description]").textContent = view.description;

    const breadcrumb = this.root.querySelector("[data-dashboard-breadcrumb]");
    if (breadcrumb) {
      const navItem = (preset.nav || []).find((item) => item.id === this.navView);
      breadcrumb.textContent = `Analytics / ${preset.badge || "One Dashboard"} / ${navItem?.label || view.title}`;
    }

    const bannerTitle = this.root.querySelector("[data-dashboard-banner-title]");
    const bannerCopy = this.root.querySelector("[data-dashboard-banner-copy]");
    if (bannerTitle) {
      bannerTitle.textContent = this.businessDescription
        ? `Layout “${view.title}” untuk bisnis Anda`
        : `Layout menu: ${view.title}`;
    }
    if (bannerCopy) {
      bannerCopy.textContent = this.businessDescription
        ? this.businessDescription
        : `Industri ${preset.label} · view ${view.title}. Ganti menu kiri untuk melihat layout ${props.locationLabel.toLocaleLowerCase("id")}, sales, atau channel.`;
    }

    const setText = (selector, value) => {
      const el = this.root.querySelector(selector);
      if (el && value != null) el.textContent = value;
    };

    setText("[data-dashboard-revenue-kicker]", view.revenueKicker || "PENDAPATAN");
    setText("[data-dashboard-revenue-title]", view.revenueTitle || "Tren Pendapatan + Forecast");
    setText("[data-dashboard-pipeline-kicker]", view.pipelineKicker || "PIPELINE SALES");
    setText("[data-dashboard-pipeline-title]", view.pipelineTitle || "Corong Konversi");
    setText("[data-dashboard-agents-kicker]", view.agentsKicker || "SALES TEAM");
    setText("[data-dashboard-agents-title]", view.agentsTitle || "Top Agent");
    setText("[data-dashboard-agents-meta]", view.agentsMeta || "Bulan ini");
    setText("[data-dashboard-channels-kicker]", view.channelsKicker || "CHANNEL MIX");
    setText("[data-dashboard-channels-title]", view.channelsTitle || "Performa Channel");
    setText("[data-dashboard-channels-meta]", view.channelsMeta || "Bulan ini");

    const panelKicker = this.root.querySelector("[data-dashboard-branch-panel-kicker]");
    const panelTitle = this.root.querySelector("[data-dashboard-branch-panel-title]");
    if (panelKicker) {
      panelKicker.textContent = isLocationsView
        ? `${props.locationLabel.toLocaleUpperCase("id")} DETAIL`
        : preset.panelKicker || "MULTI-BRANCH";
    }
    if (panelTitle) {
      panelTitle.textContent = isLocationsView
        ? `Detail ${props.locationLabel}`
        : preset.panelTitle || "Performa Cabang";
    }

    const headRow = this.root.querySelector("[data-dashboard-table-head]");
    if (headRow) {
      headRow.innerHTML = props.tableHeaders.map((header) => `<th>${header}</th>`).join("");
    }

    for (const button of this.root.querySelectorAll("[data-dashboard-period]")) {
      const active = button.dataset.dashboardPeriod === this.period;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    for (const button of this.root.querySelectorAll("[data-dashboard-role]")) {
      const active = button.dataset.dashboardRole === this.role;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const conversionBoost =
      kpisConfig.conversionBoostBranchId && this.branch === kpisConfig.conversionBoostBranchId
        ? kpisConfig.conversionBoost || 0
        : this.branch === "pondok-bambu" && kpisConfig.isAutomotive
          ? 0.7
          : 0;
    const conversionValue = (kpisConfig.conversionBase + conversionBoost).toFixed(1).replace(".", ",");
    const closingSpeed =
      kpisConfig.altBranchId && this.branch === kpisConfig.altBranchId
        ? kpisConfig.closingSpeedAlt || kpisConfig.closingSpeed
        : kpisConfig.closingSpeed;

    const pipelineBase = kpisConfig.pipelineBase;
    const channels = preset.channels || [];
    const topChannel = channels[0];
    const kpis = isChannelsView
      ? [
          {
            label: `Revenue Channel ${periodLabel}`,
            icon: "Rp",
            value: this.formatRupiahCompact(kpisConfig.revenueBase * multiplier),
            change: "18,6%",
            context: "atribusi channel",
          },
          {
            label: "Volume Channel",
            icon: "CH",
            value: `${Math.round(pipelineBase * multiplier).toLocaleString("id-ID")} ${props.pipelineTotalSuffix}`,
            change: "12,4%",
            context: "masuk dari semua channel",
          },
          {
            label: "Konversi Channel",
            icon: "%",
            value: `${conversionValue}%`,
            change: "1,2 pt",
            context: "rata-rata channel",
          },
          {
            label: "Channel Terbaik",
            icon: "★",
            value: topChannel?.name || "—",
            change: topChannel ? `${topChannel.share}%` : "—",
            context: "share volume tertinggi",
          },
          {
            label: "Channel Aktif",
            icon: "#",
            value: `${channels.length || 4}`,
            change: "stabil",
            context: "sumber terpantau",
          },
        ]
      : isLocationsView
        ? [
            {
              label: `Revenue ${props.locationLabel} ${periodLabel}`,
              icon: "Rp",
              value: this.formatRupiahCompact(kpisConfig.revenueBase * multiplier),
              change: "18,6%",
              context: "vs periode lalu",
            },
            {
              label: `${props.locationLabel} Aktif`,
              icon: "LOC",
              value: `${this.scopedBranches().length || data.branches.length}`,
              change: "on track",
              context: this.branch === "all" ? props.locationAll : this.getSelectedLocationName(),
            },
            {
              label: "Tingkat Konversi",
              icon: "%",
              value: `${conversionValue}%`,
              change: "1,2 pt",
              context: `di ${props.locationLabel.toLocaleLowerCase("id")}`,
            },
            {
              label: props.dealLabel,
              icon: "AV",
              value: kpisConfig.avgDeal,
              change: "8,3%",
              context: "nilai per closing",
            },
            {
              label: "Target Tercapai",
              icon: "🎯",
              value: `${Math.round(
                this.scopedBranches().reduce((sum, item) => sum + item.target, 0) /
                  Math.max(1, this.scopedBranches().length),
              )}%`,
              change: "vs target",
              context: "rata-rata lokasi",
            },
          ]
        : [
            {
              label: `Pendapatan ${periodLabel}`,
              icon: "Rp",
              value: this.formatRupiahCompact(kpisConfig.revenueBase * multiplier),
              change: "18,6%",
              context: "vs periode lalu",
            },
            {
              label: "Pipeline Aktif",
              icon: "PL",
              value: `${Math.round(pipelineBase * multiplier).toLocaleString("id-ID")} ${props.pipelineTotalSuffix}`,
              change: "12,4%",
              context: "prospek bertumbuh",
            },
            {
              label: "Tingkat Konversi",
              icon: "%",
              value: `${conversionValue}%`,
              change: "1,2 pt",
              context: "di atas target",
            },
            {
              label: props.dealLabel,
              icon: "AV",
              value: kpisConfig.avgDeal,
              change: "8,3%",
              context: "nilai per closing",
            },
            {
              label: props.closingSpeedLabel,
              icon: "⏱",
              value: closingSpeed,
              change: "0,9 hari",
              context: "lebih cepat",
            },
          ];

    this.kpiGrid.innerHTML = kpis
      .map(
        (kpi) => `
          <article class="dashboard-kpi-card">
            <span>${kpi.label}<i>${kpi.icon}</i></span>
            <b>${kpi.value}</b>
            <small><em>↑ ${kpi.change}</em>${kpi.context}</small>
          </article>
        `,
      )
      .join("");

    const chartScale = Math.min(1.08, 0.76 + this.periodMultiplier() * 0.12);
    const chartData = data.chart || dashboardDemoData.chart;
    this.chart.innerHTML = chartData
      .map((point) => {
        const actual = point.actual
          ? `<i style="height:${Math.min(100, point.actual * chartScale)}%" title="Aktual ${point.label}"></i>`
          : "";
        const forecast = point.forecast
          ? `<i class="forecast" style="height:${Math.min(100, point.forecast * chartScale)}%" title="Forecast ${point.label}"></i>`
          : "";
        return `<div class="dashboard-bar-item">${actual}${forecast}<small>${point.label}</small></div>`;
      })
      .join("");

    this.root.querySelector("[data-dashboard-revenue-total]").textContent =
      this.formatRupiahCompact(kpisConfig.revenueBase * multiplier);
    this.root.querySelector("[data-dashboard-revenue-delta]").textContent =
      `↑ ${this.period === "ytd" ? "24,1" : "18,6"}% vs periode lalu`;

    const pipeline = props.funnelStages;
    const pipelineLeadCount = pipeline[0]?.[1] || pipelineBase;
    this.root.querySelector("[data-dashboard-pipeline-total]").textContent =
      `${Math.round(pipelineLeadCount * multiplier).toLocaleString("id-ID")} ${props.pipelineTotalSuffix}`;
    this.funnel.innerHTML = pipeline
      .map(
        ([label, count, width]) => `
          <div class="dashboard-funnel-row">
            <span>${label}</span>
            <div class="dashboard-funnel-track"><i style="width:${width}%"></i></div>
            <b>${Math.max(1, Math.round(count * multiplier)).toLocaleString("id-ID")}</b>
          </div>
        `,
      )
      .join("");

    this.branchTable.innerHTML = this.scopedBranches()
      .map(
        (branch) => `
          <tr>
            <td>${branch.name}</td>
            <td>${this.formatRupiahCompact(branch.revenue * this.periodMultiplier())}</td>
            <td>${Math.round(branch.closing * this.periodMultiplier()).toLocaleString("id-ID")} ${props.entityPlural}</td>
            <td>${branch.conversion.toFixed(1).replace(".", ",")}%</td>
            <td><span class="dashboard-target-cell"><i style="--progress:${branch.target}%"></i>${branch.target}%</span></td>
          </tr>
        `,
      )
      .join("");

    const locationName =
      this.branch === "all"
        ? null
        : data.branches.find((item) => item.id === this.branch)?.name || null;
    const agents =
      this.branch === "all"
        ? data.agents
        : data.agents.filter((agent) => agent.branch === locationName);
    this.agentList.innerHTML = agents
      .slice(0, 4)
      .map(
        (agent, index) => `
          <div class="dashboard-agent">
            <span>${index + 1}</span>
            <span class="dashboard-agent-avatar">${this.initials(agent.name)}</span>
            <div><b>${agent.name}</b><small>${agent.branch} · ${Math.round(agent.closing * this.periodMultiplier()).toLocaleString("id-ID")} ${props.agentMetric}</small></div>
            <strong>${this.formatRupiahCompact(agent.revenue * this.periodMultiplier())}</strong>
          </div>
        `,
      )
      .join("");

    if (this.channelList) {
      this.channelList.innerHTML = channels
        .slice(0, 4)
        .map(
          (channel, index) => `
            <div class="dashboard-channel">
              <span>${index + 1}</span>
              <span class="dashboard-channel-avatar">${this.initials(channel.name)}</span>
              <div>
                <b>${channel.name}</b>
                <small>${channel.share}% share · ${Math.round(channel.leads * multiplier).toLocaleString("id-ID")} ${props.pipelineTotalSuffix} · ${String(channel.conversion).replace(".", ",")}%</small>
                <i class="dashboard-channel-bar" style="--share:${channel.share}%"></i>
              </div>
              <strong>${this.formatRupiahCompact(channel.revenue * this.periodMultiplier())}</strong>
            </div>
          `,
        )
        .join("");
    }

    this.renderAlerts();
    this.renderWidgets();
  }

  renderWidgets() {
    for (const widget of this.root.querySelectorAll("[data-dashboard-widget]")) {
      widget.hidden = !this.visibleWidgets.has(widget.dataset.dashboardWidget);
    }
  }

  formatRupiahCompact(valueInMillions) {
    if (valueInMillions >= 1000) {
      return `Rp${(valueInMillions / 1000).toFixed(2).replace(".", ",")} M`;
    }
    return `Rp${Math.round(valueInMillions).toLocaleString("id-ID")} jt`;
  }

  initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toLocaleUpperCase("id");
  }
}

const dashboardDemoMount = document.getElementById("dashboardDemo");
if (dashboardDemoMount) {
  new OneDashboardDemo(dashboardDemoMount);
}

const socialDemoVehicles = [
  {
    id: "zenix",
    name: "Toyota Innova Zenix",
    shortName: "Innova Zenix",
    year: "2023",
    specs: "Hybrid · Automatic · 7 Seater",
    price: "Rp468 juta",
    offer: "TDP mulai Rp48 juta",
    color: "#f8fafc",
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "2.0 L Hybrid",
    seats: 7,
    features: ["TNGA Hybrid", "Panoramic Roof", "Captain Seat", "TSS Safety"],
    caption:
      "Naik kelas bersama Toyota Innova Zenix Hybrid 2023. Kabin premium, hemat bahan bakar, dan siap menemani setiap perjalanan keluarga. TDP mulai Rp48 juta. #ZENIXHYBRID #MobixAutos",
  },
  {
    id: "brv",
    name: "Honda BR-V Prestige",
    shortName: "BR-V Prestige",
    year: "2021",
    specs: "CVT · 7 Seater · Sensing",
    price: "Rp255 juta",
    offer: "Cicilan mulai Rp5,8 juta",
    color: "#94a3b8",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Honda Sensing", "LaneWatch", "7 Seater", "Smart Key"],
    caption:
      "Waktunya membawa keluarga menjelajah lebih jauh bersama Honda BR-V Prestige CVT. Nyaman, lega, dan siap pakai. Cicilan mulai Rp5,8 juta. #BRVFAMILY #MobixAutos",
  },
  {
    id: "xpander",
    name: "Mitsubishi Xpander",
    shortName: "Xpander Ultimate",
    year: "2021",
    specs: "Ultimate · Automatic · 7 Seater",
    price: "Rp239 juta",
    offer: "Bonus servis berkala",
    color: "#f1f5f9",
    bodyType: "MPV",
    fuel: "Bensin",
    engine: "1.5 L",
    seats: 7,
    features: ["Head Unit 9\"", "Keyless Push Start", "Cruise Control", "Rear Camera"],
    caption:
      "Mitsubishi Xpander Ultimate—partner andal untuk aktivitas dan liburan keluarga. Unit ready dengan bonus servis berkala. Jadwalkan test drive hari ini. #XPANDERWEEKEND #MobixAutos",
  },
  {
    id: "raize",
    name: "Toyota Raize GR Sport",
    shortName: "Raize GR Sport",
    year: "2022",
    specs: "1.0T · Automatic · 5 Seater",
    price: "Rp228 juta",
    offer: "TDP mulai Rp28 juta",
    color: "#14b8a6",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.0 L Turbo",
    seats: 5,
    features: ["GR Sport Kit", "Turbo Engine", "LED Projector", "Digital Meter"],
    caption:
      "Toyota Raize GR Sport 1.0 Turbo—gaya sporty, lincah di kota, irit di jalanan. TDP mulai Rp28 juta. Unit ready inspeksi lengkap. #RAIZEGR #MobixAutos",
  },
  {
    id: "pajero",
    name: "Mitsubishi Pajero Sport",
    shortName: "Pajero Sport Dakar",
    year: "2020",
    specs: "2.4 Diesel · 7 Seater",
    price: "Rp435 juta",
    offer: "Cashback suku cadang",
    color: "#475569",
    bodyType: "SUV",
    fuel: "Diesel",
    engine: "2.4 L Diesel",
    seats: 7,
    features: ["4WD Select", "Cruise Control", "Rockford Audio", "360 Camera"],
    caption:
      "Mitsubishi Pajero Sport Dakar 4x2—tangguh, lega, siap petualangan. Cashback suku cadang + servis. Jadwalkan test drive. #PAJEROSPORT #MobixAutos",
  },
  {
    id: "ertiga",
    name: "Suzuki Ertiga Hybrid",
    shortName: "Ertiga GX Hybrid",
    year: "2023",
    specs: "Hybrid · Automatic · 7 Seater",
    price: "Rp243 juta",
    offer: "Cicilan mulai Rp4,9 juta",
    color: "#0f172a",
    bodyType: "MPV",
    fuel: "Hybrid",
    engine: "1.5 L Hybrid",
    seats: 7,
    features: ["SHVS Hybrid", "ESP", "Hill Hold", "Smart Key"],
    caption:
      "Suzuki Ertiga GX Hybrid 2023—MPV hemat BBM untuk keluarga modern. Cicilan mulai Rp4,9 juta. Unit ready cabang Bekasi. #ERTIGAHYBRID #MobixAutos",
  },
  {
    id: "crv",
    name: "Honda CR-V Turbo",
    shortName: "CR-V Turbo Prestige",
    year: "2021",
    specs: "1.5T · Prestige · 7 Seater",
    price: "Rp475 juta",
    offer: "Trade-in prioritas",
    color: "#1e293b",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Honda Sensing", "Panoramic Roof", "Power Tailgate", "Leather Seat"],
    caption:
      "Honda CR-V Turbo Prestige—SUV premium dengan Honda Sensing dan panoramic roof. Trade-in prioritas minggu ini. #CRVTURBO #MobixAutos",
  },
  {
    id: "almaz",
    name: "Wuling Almaz RS",
    shortName: "Almaz RS Pro",
    year: "2022",
    specs: "1.5T · ADAS · 7 Seater",
    price: "Rp305 juta",
    offer: "Gratis IoV 1 tahun",
    color: "#b91c1c",
    bodyType: "SUV",
    fuel: "Bensin",
    engine: "1.5 L Turbo",
    seats: 7,
    features: ["Internet of Vehicle", "360 Camera", "ADAS Level 2", "Panoramic Sunroof"],
    caption:
      "Wuling Almaz RS Pro—SUV cerdas dengan ADAS & IoV. Gratis konektivitas 1 tahun. Siap test drive hari ini. #ALMAZRS #MobixAutos",
  },
];

const socialDemoCampaigns = {
  zenix: {
    name: "Meta · Zenix Hybrid Juli",
    utm: "utm_campaign=zenix_hybrid_jul26",
    hashtag: "#ZENIXHYBRID",
    clicks: 1284,
    possible: 214,
    leads: 96,
    conversion: 7.5,
    change: ["18,4%", "22,1%", "16,9%", "1,3 pt"],
    trend: [
      [38, 13], [52, 19], [47, 17], [68, 26], [61, 23], [78, 34], [91, 39],
    ],
  },
  brv: {
    name: "Instagram · BR-V Family Deal",
    utm: "utm_campaign=brv_family_jul26",
    hashtag: "#BRVFAMILY",
    clicks: 864,
    possible: 148,
    leads: 71,
    conversion: 8.2,
    change: ["12,7%", "15,4%", "20,3%", "1,8 pt"],
    trend: [
      [29, 11], [35, 14], [42, 18], [40, 17], [57, 25], [64, 31], [71, 36],
    ],
  },
  xpander: {
    name: "Meta · Xpander Weekend",
    utm: "utm_campaign=xpander_weekend",
    hashtag: "#XPANDERWEEKEND",
    clicks: 642,
    possible: 103,
    leads: 43,
    conversion: 6.7,
    change: ["9,8%", "11,2%", "8,6%", "0,7 pt"],
    trend: [
      [24, 8], [31, 10], [28, 9], [39, 14], [44, 17], [51, 20], [58, 24],
    ],
  },
  raize: {
    name: "Meta · Raize GR Sport",
    utm: "utm_campaign=raize_gr_jul26",
    hashtag: "#RAIZEGR",
    clicks: 712,
    possible: 118,
    leads: 52,
    conversion: 7.3,
    change: ["14,2%", "16,8%", "11,5%", "0,9 pt"],
    trend: [
      [26, 9], [33, 12], [41, 15], [48, 19], [55, 22], [62, 28], [70, 31],
    ],
  },
  pajero: {
    name: "Facebook · Pajero Sport Dakar",
    utm: "utm_campaign=pajero_dakar",
    hashtag: "#PAJEROSPORT",
    clicks: 498,
    possible: 82,
    leads: 31,
    conversion: 6.2,
    change: ["7,4%", "9,1%", "5,8%", "0,5 pt"],
    trend: [
      [18, 6], [22, 7], [27, 9], [31, 11], [36, 13], [42, 16], [48, 18],
    ],
  },
  ertiga: {
    name: "Instagram · Ertiga Hybrid Deal",
    utm: "utm_campaign=ertiga_hybrid",
    hashtag: "#ERTIGAHYBRID",
    clicks: 580,
    possible: 96,
    leads: 44,
    conversion: 7.6,
    change: ["10,3%", "12,6%", "14,1%", "1,1 pt"],
    trend: [
      [21, 8], [28, 11], [34, 13], [39, 16], [46, 19], [53, 23], [61, 27],
    ],
  },
};

class SocialGrowthDemo {
  constructor(root) {
    this.root = root;
    this.view = "studio";
    this.vehicleId = "zenix";
    this.format = "square";
    this.platforms = new Set(["instagram", "facebook"]);
    this.captionVariant = 0;
    this.monthOffset = 0;
    this.lastFocusedElement = null;
    this.posts = this.defaultPosts();
    this.guideStepIndex = 0;
    this.hasOpenedGuide = false;
    this.entryContext = "social";
    this.lastEntryContext = "";
    this.broadcastSegment = "hot";

    this.vehicleOptions = root.querySelector("[data-social-vehicle-options]");
    this.captionInput = root.querySelector("[data-social-caption]");
    this.headlineInput = root.querySelector("[data-social-headline]");
    this.offerInput = root.querySelector("[data-social-offer]");
    this.dateInput = root.querySelector("[data-social-date]");
    this.timeInput = root.querySelector("[data-social-time]");
    this.toast = root.querySelector("[data-social-toast]");
    this.campaignSelect = root.querySelector("[data-social-campaign]");
    this.guide = root.querySelector("[data-social-guide-popover]");

    this.tour = new DemoProductTour(root, {
      ns: "social",
      anchorAttr: "data-social-anchor",
      getSteps: () => this.guideSteps(),
      onSwitchView: (view) => this.switchView(view),
      getStepLabel: (step, index, total) => {
        const labels = {
          studio: "Content Studio",
          calendar: "Kalender",
          insight: "Campaign Insight",
        };
        const viewLabel = labels[step.view] || step.label || "Social Growth";
        return total > 1
          ? `${String(viewLabel).toUpperCase()} · LANGKAH ${index} DARI ${total}`
          : String(viewLabel).toUpperCase();
      },
    });

    this.bind();
    this.reset();
    this.loadTenantPosts();
  }

  async loadTenantPosts(force = false) {
    try {
      const snapshot = await publicDemoData.snapshot(force);
      if (Array.isArray(snapshot.inventory) && snapshot.inventory.length) {
        this.applyInventoryPhotos(
          snapshot.inventory.map((unit) => ({
            id: unit.id,
            brand: unit.brand,
            type: unit.type,
            photoUrl: unit.photo_url || "",
          })),
        );
      }
      if (snapshot.social_posts.length) {
        this.posts = snapshot.social_posts.map((post) => ({
          date: post.scheduled_at.slice(0, 10),
          title: post.title,
          platform: Array.isArray(post.platforms) ? post.platforms[0] || "instagram" : "instagram",
          status: post.status,
        }));
        this.renderCalendar();
      }
    } catch (error) {
      this.root.querySelector("[data-social-toast-copy]").textContent = error.message;
    }
  }

  defaultPosts() {
    return [
      { date: "2026-07-08", title: "BR-V Family Deal", platform: "instagram", status: "published" },
      { date: "2026-07-16", title: "Xpander Weekend", platform: "facebook", status: "published" },
      { date: "2026-07-24", title: "Tips Trade In", platform: "instagram", status: "draft" },
      { date: "2026-07-29", title: "Zenix Hybrid", platform: "instagram", status: "planned" },
    ];
  }

  guideSteps() {
    if (this.entryContext === "broadcast") {
      return [
        {
          view: "broadcast",
          anchor: "broadcast-segment",
          label: "Broadcast",
          title: "Pilih audiens dari CRM",
          body: "Pilih segmen Lead Hot, Customer Service, atau Stock Match. Angka memakai data mock dan hanya kontak eligible yang masuk antrean.",
        },
        {
          view: "broadcast",
          anchor: "broadcast-message",
          label: "Template",
          title: "Pesan personal berbasis data",
          body: "Variabel nama, unit minat, cabang, dan PIC mengambil konteks CRM/inventory. Template dan status approval di demo hanya simulasi.",
        },
        {
          view: "broadcast",
          anchor: "broadcast-result",
          label: "Hasil",
          title: "Delivery sampai lead CRM",
          body: "Jadwalkan broadcast demo untuk melihat queued, delivered, replies, dan lead CRM—tanpa mengirim pesan nyata.",
        },
      ];
    }
    return [
      {
        view: "studio",
        anchor: "vehicles",
        label: "Content Studio",
        title: "Social Growth Studio",
        body: "Demo Social Media & Ads Automation: alur Konten → Jadwal → Insight. Spotlight + tooltip sama seperti panduan Inventory — area sorot adalah kontrol aktif.",
      },
      {
        view: "studio",
        anchor: "vehicles",
        label: "Content Studio",
        title: "Pilih unit dari inventory",
        body: "Unit ready siap jadi materi iklan. Klik kartu unit untuk mengganti preview, harga, dan caption otomatis.",
        enter: () => {
          this.vehicleId = "zenix";
          this.offerInput.value = this.vehicle().offer;
          this.captionInput.value = this.vehicle().caption;
          this.renderStudio();
        },
      },
      {
        view: "studio",
        anchor: "design",
        label: "Content Studio",
        title: "Desain & format konten",
        body: "Pilih format Post 1:1, Feed 4:5, atau Story 9:16. Edit headline dan penawaran—preview langsung berubah.",
        enter: () => {
          this.format = "portrait";
          this.renderStudio();
        },
      },
      {
        view: "studio",
        anchor: "caption",
        label: "Content Studio",
        title: "Platform & generate caption",
        body: "Aktifkan Instagram/Facebook, lalu Generate Ulang untuk 3 varian caption berbasis unit + penawaran.",
      },
      {
        view: "studio",
        anchor: "schedule",
        label: "Content Studio",
        title: "Jadwalkan ke tenant demo",
        body: "Atur tanggal/waktu lalu Jadwalkan. Posting tersimpan di tenant demo (tidak publish ke akun Meta).",
        enter: () => {
          this.root.querySelector(".social-progress span:last-child")?.classList.add("active");
        },
      },
      {
        view: "calendar",
        anchor: "calendar",
        label: "Kalender",
        title: "Kalender konten",
        body: "Lihat draft, terjadwal, dan terbit. Setelah schedule, unit masuk sebagai posting planned di kalender.",
      },
      {
        view: "insight",
        anchor: "insight",
        label: "Campaign Insight",
        title: "Campaign Insight → CRM",
        body: "Ganti campaign untuk melihat klik, lead, UTM, ranking produk, dan lead terbaru yang masuk pipeline CRM. Selesai — eksplor bebas.",
        enter: () => {
          this.campaignSelect.value = "zenix";
          this.renderInsight();
        },
      },
    ];
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-social-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }
    for (const button of this.root.querySelectorAll("[data-close-social-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-social-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-social-toast-close]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    // Panduan: DemoProductTour (bindControls di constructor)

    for (const button of this.root.querySelectorAll("[data-social-nav]")) {
      button.addEventListener("click", () => this.switchView(button.dataset.socialNav || "studio"));
    }

    this.vehicleOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-social-vehicle]");
      if (!button) return;
      this.vehicleId = button.dataset.socialVehicle;
      this.offerInput.value = this.vehicle().offer;
      this.captionInput.value = this.vehicle().caption;
      this.renderStudio();
    });

    for (const button of this.root.querySelectorAll("[data-social-format]")) {
      button.addEventListener("click", () => {
        this.format = button.dataset.socialFormat || "square";
        this.renderStudio();
      });
    }

    for (const button of this.root.querySelectorAll("[data-social-platform]")) {
      button.addEventListener("click", () => {
        const platform = button.dataset.socialPlatform;
        if (!platform) return;
        if (this.platforms.has(platform)) {
          if (this.platforms.size === 1) return;
          this.platforms.delete(platform);
        } else {
          this.platforms.add(platform);
        }
        this.renderStudio();
      });
    }

    this.headlineInput.addEventListener("input", () => this.renderPreviewCopy());
    this.offerInput.addEventListener("input", () => this.renderPreviewCopy());
    this.captionInput.addEventListener("input", () => this.renderPreviewCopy());

    this.root.querySelector("[data-social-generate]").addEventListener("click", () => {
      this.captionVariant += 1;
      const vehicle = this.vehicle();
      const featureLine = (vehicle.features || []).slice(0, 2).join(" · ");
      const variants = [
        vehicle.caption,
        `${vehicle.name} ${vehicle.year} siap menemani cerita baru Anda. ${this.offerInput.value}. ${featureLine ? `Highlight: ${featureLine}. ` : ""}Unit terpilih, inspeksi transparan, dan bisa test drive. ${this.hashtagForVehicle()} #MobixAutos`,
        `Cari ${vehicle.shortName} (${vehicle.fuel || "siap pakai"} · ${vehicle.seats || 7} penumpang)? Penawaran ${this.offerInput.value.toLowerCase()}. ${this.hashtagForVehicle()} #MobilBekasBerkualitas`,
      ];
      this.captionInput.value = variants[this.captionVariant % variants.length];
      this.renderPreviewCopy();
    });

    this.root.querySelector("[data-social-schedule]").addEventListener("click", () => this.schedule());
    this.root.querySelector("[data-social-month-prev]").addEventListener("click", () => {
      this.monthOffset = Math.max(0, this.monthOffset - 1);
      this.renderCalendar();
    });
    this.root.querySelector("[data-social-month-next]").addEventListener("click", () => {
      this.monthOffset = Math.min(1, this.monthOffset + 1);
      this.renderCalendar();
    });
    this.campaignSelect.addEventListener("change", () => this.renderInsight());
    this.root.querySelector("[data-social-view-panel=\"broadcast\"]")?.addEventListener("click", (event) => {
      const segment = event.target.closest("[data-broadcast-segment]");
      if (segment) {
        this.broadcastSegment = segment.dataset.broadcastSegment || "hot";
        this.renderBroadcast();
        return;
      }
      if (event.target.closest("[data-broadcast-send]")) {
        const result = this.root.querySelector("[data-broadcast-result]");
        const date = this.root.querySelector("[data-broadcast-date]")?.value || "";
        const time = this.root.querySelector("[data-broadcast-time]")?.value || "";
        const eligible = this.root.querySelector("[data-broadcast-eligible]")?.textContent || "0";
        if (result) result.hidden = false;
        const copy = this.root.querySelector("[data-broadcast-result-copy]");
        if (copy) copy.textContent = `${eligible} pesan dijadwalkan ${this.formatDate(date)} pukul ${time} WIB di tenant demo.`;
      }
    });
    this.root.querySelector("[data-broadcast-message]")?.addEventListener("input", () => this.renderBroadcast());

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) this.toast.hidden = true;
      else if (this.tour?.isOpen) this.closeGuide();
      else this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    const requestedFrom = new URLSearchParams(window.location.search).get("from") || "";
    const rawContext = trigger?.dataset?.demoContext || requestedFrom;
    this.entryContext = rawContext === "broadcast" ? "broadcast" : "social";
    this.root.dataset.entryContext = this.entryContext;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-social-demo]").focus();
    this.switchView(this.entryContext === "broadcast" ? "broadcast" : "studio");
    this.loadTenantPosts(true);
    if (!this.hasOpenedGuide || this.lastEntryContext !== this.entryContext) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
      this.lastEntryContext = this.entryContext;
    }
  }

  close() {
    this.closeGuide();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    this.tour?.open(startIndex);
  }

  closeGuide() {
    this.tour?.close();
  }

  reset() {
    this.view = "studio";
    this.vehicleId = "zenix";
    this.format = "square";
    this.platforms = new Set(["instagram", "facebook"]);
    this.captionVariant = 0;
    this.monthOffset = 0;
    this.broadcastSegment = "hot";
    this.posts = this.defaultPosts();
    this.headlineInput.value = "Drive Your Dream Today";
    this.offerInput.value = this.vehicle().offer;
    this.captionInput.value = this.vehicle().caption;
    this.dateInput.value = "2026-07-31";
    this.timeInput.value = "09:00";
    this.campaignSelect.value = "zenix";
    this.toast.hidden = true;
    this.closeGuide();
    this.root.querySelector(".social-progress span:last-child").classList.remove("active");
    const broadcastResult = this.root.querySelector("[data-broadcast-result]");
    if (broadcastResult) broadcastResult.hidden = true;
    this.renderAll();
    this.switchView("studio");
  }

  vehicle() {
    return socialDemoVehicles.find((vehicle) => vehicle.id === this.vehicleId) || socialDemoVehicles[0];
  }

  hashtagForVehicle() {
    const map = {
      brv: "#BRVFAMILY",
      xpander: "#XPANDERWEEKEND",
      raize: "#RAIZEGR",
      pajero: "#PAJEROSPORT",
      ertiga: "#ERTIGAHYBRID",
      crv: "#CRVTURBO",
      almaz: "#ALMAZRS",
      zenix: "#ZENIXHYBRID",
    };
    return map[this.vehicleId] || "#MOTOVAX";
  }

  switchView(view) {
    this.view = view;
    const headings = {
      studio: {
        breadcrumb: "Social Media / Content Studio",
        title: "Buat Konten Siap Tayang",
        description: "Pilih unit, sesuaikan desain, lalu jadwalkan ke channel pilihan dalam satu alur.",
      },
      calendar: {
        breadcrumb: "Social Media / Kalender Posting",
        title: "Kalender Konten",
        description: "Lihat seluruh draft, jadwal, dan konten yang sudah terbit dalam satu kalender.",
      },
      insight: {
        breadcrumb: "Social Media / Campaign Insight",
        title: "Campaign Insight",
        description: "Hubungkan setiap klik campaign dengan lead dan status CRM yang dihasilkan.",
      },
      broadcast: {
        breadcrumb: "Campaign / WhatsApp Broadcast",
        title: "WhatsApp Broadcast Terukur",
        description: "Pilih segmen, personalisasi pesan, jadwalkan, lalu lihat alurnya sampai reply dan lead CRM.",
      },
    };
    const heading = headings[view] || headings.studio;

    for (const button of this.root.querySelectorAll("[data-social-nav]")) {
      const active = button.dataset.socialNav === view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    }
    for (const panel of this.root.querySelectorAll("[data-social-view-panel]")) {
      const active = panel.dataset.socialViewPanel === view;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    }
    this.root.querySelector("[data-social-breadcrumb]").textContent = heading.breadcrumb;
    this.root.querySelector("[data-social-page-title]").textContent = heading.title;
    this.root.querySelector("[data-social-page-description]").textContent = heading.description;
    if (view === "calendar") this.renderCalendar();
    if (view === "broadcast") this.renderBroadcast();
    if (view === "insight") this.renderInsight();
    this.root.querySelector(".social-workspace").scrollTop = 0;
  }

  renderAll() {
    this.renderVehicles();
    this.renderStudio();
    this.renderCalendar();
    this.renderBroadcast();
    this.renderInsight();
  }

  renderBroadcast() {
    const configs = {
      hot: { target: 186, eligible: 179, optout: 7, name: "Nadia", unit: "Innova Zenix Hybrid", branch: "Pondok Bambu" },
      service: { target: 94, eligible: 90, optout: 4, name: "Rizky", unit: "jadwal layanan berkala", branch: "Cinere" },
      stock: { target: 128, eligible: 121, optout: 7, name: "Dewi", unit: "Honda BR-V Prestige", branch: "Cibubur" },
    };
    const config = configs[this.broadcastSegment] || configs.hot;
    for (const button of this.root.querySelectorAll("[data-broadcast-segment]")) {
      const active = button.dataset.broadcastSegment === this.broadcastSegment;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", String(active));
    }
    const template = this.root.querySelector("[data-broadcast-message]")?.value || "";
    const preview = template
      .replaceAll("{{nama}}", config.name)
      .replaceAll("{{unit_minat}}", config.unit)
      .replaceAll("{{cabang}}", config.branch)
      .replaceAll("{{sales_pic}}", "Dimas");
    const previewEl = this.root.querySelector("[data-broadcast-preview]");
    if (previewEl) previewEl.textContent = preview;
    this.root.querySelector("[data-broadcast-target]").textContent = String(config.target);
    this.root.querySelector("[data-broadcast-eligible]").textContent = String(config.eligible);
    this.root.querySelector("[data-broadcast-optout]").textContent = String(config.optout);
  }

  applyInventoryPhotos(units) {
    if (!Array.isArray(units) || !units.length) return;
    const tokens = {
      zenix: ["zenix", "innova"],
      brv: ["br-v", "brv"],
      xpander: ["xpander"],
      raize: ["raize"],
      pajero: ["pajero"],
      ertiga: ["ertiga"],
      crv: ["cr-v", "crv"],
      almaz: ["almaz"],
    };
    for (const vehicle of socialDemoVehicles) {
      const keys = tokens[vehicle.id] || [vehicle.shortName.toLowerCase()];
      const match = units.find((unit) => {
        const hay = `${unit.brand || ""} ${unit.type || ""}`.toLowerCase();
        return keys.some((key) => hay.includes(key));
      });
      if (match?.photoUrl) {
        vehicle.photoUrl = match.photoUrl;
        vehicle.unitId = match.id;
      }
    }
    this.renderStudio();
  }

  renderVehicles() {
    const countEl = this.root.querySelector("[data-social-vehicle-count]");
    if (countEl) countEl.textContent = `${socialDemoVehicles.length} unit ready`;

    this.vehicleOptions.innerHTML = socialDemoVehicles
      .map((vehicle) => {
        const featureHint = (vehicle.features || []).slice(0, 2).join(" · ");
        const thumb = vehicle.photoUrl
          ? `<span class="social-vehicle-thumb has-photo" style="--car-color:${vehicle.color}"><img src="${vehicle.photoUrl}" alt="" loading="lazy" /></span>`
          : `<span class="social-vehicle-thumb" style="--car-color:${vehicle.color}"></span>`;
        return `
          <button class="social-vehicle-card ${vehicle.id === this.vehicleId ? "active" : ""}" type="button" data-social-vehicle="${vehicle.id}">
            ${thumb}
            <span>
              <b>${vehicle.shortName}</b>
              <small>${vehicle.year} · ${vehicle.price}</small>
              <small class="social-vehicle-meta">${vehicle.fuel || "—"} · ${vehicle.seats || "—"} penumpang${featureHint ? ` · ${featureHint}` : ""}</small>
            </span>
            <em>✓</em>
          </button>
        `;
      })
      .join("");
  }

  renderStudio() {
    const vehicle = this.vehicle();
    this.renderVehicles();
    for (const button of this.root.querySelectorAll("[data-social-format]")) {
      const active = button.dataset.socialFormat === this.format;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    for (const button of this.root.querySelectorAll("[data-social-platform]")) {
      const active = this.platforms.has(button.dataset.socialPlatform);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const formatLabels = {
      square: "Instagram Post · 1:1",
      portrait: "Facebook / IG Feed · 4:5",
      story: "Instagram Story · 9:16",
    };
    const creative = this.root.querySelector("[data-social-creative]");
    creative.className = `social-creative-frame ${this.format}${vehicle.photoUrl ? " has-photo" : ""}`;
    this.root.querySelector("[data-social-preview-format]").textContent = formatLabels[this.format];
    this.root.querySelector("[data-social-creative-title]").textContent = vehicle.name;
    const featureTag = (vehicle.features || [])[0];
    this.root.querySelector("[data-social-creative-year]").textContent = featureTag
      ? `${vehicle.year} · ${vehicle.specs} · ${featureTag}`
      : `${vehicle.year} · ${vehicle.specs}`;
    const carArt = this.root.querySelector("[data-social-car-art]");
    carArt.style.setProperty("--preview-car", vehicle.color);
    if (vehicle.photoUrl) {
      carArt.style.backgroundImage = `url("${vehicle.photoUrl}")`;
      carArt.classList.add("has-photo");
    } else {
      carArt.style.backgroundImage = "";
      carArt.classList.remove("has-photo");
    }
    const platformCount = this.platforms.size;
    this.root.querySelector("[data-social-platform-count]").textContent =
      `${platformCount} platform`;
    this.renderPreviewCopy();
  }

  renderPreviewCopy() {
    const headline = this.headlineInput.value.trim() || "Drive Your Dream Today";
    const offer = this.offerInput.value.trim() || this.vehicle().offer;
    const caption = this.captionInput.value.trim();
    this.root.querySelector("[data-social-creative-headline]").textContent = headline.toLocaleUpperCase("id");
    this.root.querySelector("[data-social-creative-offer]").textContent = offer;
    this.root.querySelector("[data-social-preview-caption]").textContent = caption;
    this.root.querySelector("[data-social-caption-count]").textContent = `${caption.length}/500`;
  }

  async schedule() {
    const date = this.dateInput.value;
    const time = this.timeInput.value;
    if (!date || !time) return;
    const selectedPlatforms = [...this.platforms];
    const scheduleButton = this.root.querySelector("[data-social-schedule]");
    scheduleButton.disabled = true;
    const originalLabel = scheduleButton.textContent;
    scheduleButton.textContent = "Menyimpan ke tenant demo…";
    try {
      await publicDemoData.submit("social_schedule", {
        title: this.vehicle().shortName,
        caption: this.captionInput.value.trim(),
        platforms: selectedPlatforms,
        scheduled_at: new Date(`${date}T${time}:00+07:00`).toISOString(),
        unit_interest: this.vehicle().name,
      });
    } catch (error) {
      scheduleButton.disabled = false;
      scheduleButton.textContent = originalLabel;
      this.root.querySelector("[data-social-toast-copy]").textContent = error.message;
      this.toast.hidden = false;
      return;
    }
    const existingIndex = this.posts.findIndex((post) => post.isDemoScheduled);
    const post = {
      date,
      title: this.vehicle().shortName,
      platform: selectedPlatforms[0],
      status: "planned",
      isDemoScheduled: true,
    };
    if (existingIndex >= 0) this.posts[existingIndex] = post;
    else this.posts.push(post);
    this.monthOffset = date.startsWith("2026-08") ? 1 : 0;
    this.renderCalendar();
    this.root.querySelector("[data-social-toast-copy]").textContent =
      `${this.vehicle().shortName} tersimpan di tenant demo · ${this.formatDate(date)} pukul ${time} WIB.`;
    this.root.querySelector(".social-progress span:last-child").classList.add("active");
    this.toast.hidden = false;
    this.switchView("calendar");
    scheduleButton.disabled = false;
    scheduleButton.textContent = originalLabel;
  }

  renderCalendar() {
    const year = 2026;
    const month = 6 + this.monthOffset;
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus"];
    this.root.querySelector("[data-social-month-title]").textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(Date.UTC(year, month, 1));
    const mondayOffset = (firstDay.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const daysInPrevious = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const cellCount = mondayOffset + daysInMonth > 35 ? 42 : 35;
    const cells = [];

    for (let index = 0; index < cellCount; index += 1) {
      const day = index - mondayOffset + 1;
      const inMonth = day >= 1 && day <= daysInMonth;
      const displayDay = day < 1 ? daysInPrevious + day : day > daysInMonth ? day - daysInMonth : day;
      const date = inMonth
        ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        : "";
      const dayPosts = date ? this.posts.filter((post) => post.date === date) : [];
      const postMarkup = dayPosts
        .map(
          (post) => `
            <button class="social-calendar-post ${post.status} ${post.platform}" type="button" title="${post.title}">
              <i>${post.platform === "facebook" ? "FB" : "IG"}</i>${post.title}
            </button>
          `,
        )
        .join("");
      cells.push(`<div class="social-calendar-day ${inMonth ? "" : "is-muted"}"><span>${displayDay}</span>${postMarkup}</div>`);
    }
    this.root.querySelector("[data-social-calendar-days]").innerHTML = cells.join("");
    const planned = this.posts.filter((post) => post.status === "planned").length;
    this.root.querySelector("[data-social-total-posts]").textContent = String(this.posts.length);
    this.root.querySelector("[data-social-planned-posts]").textContent = String(planned);
    this.root.querySelector("[data-social-calendar-count]").textContent = String(this.posts.length);
  }

  renderInsight() {
    const campaign = socialDemoCampaigns[this.campaignSelect.value] || socialDemoCampaigns.zenix;
    this.root.querySelector("[data-social-campaign-name]").textContent = campaign.name;
    this.root.querySelector("[data-social-utm]").textContent = campaign.utm;
    this.root.querySelector("[data-social-hashtag]").textContent = campaign.hashtag;

    const metrics = [
      ["↗", "Tracked Clicks", campaign.clicks.toLocaleString("id-ID")],
      ["◷", "Possible Leads", campaign.possible.toLocaleString("id-ID")],
      ["✓", "Confirmed Leads", campaign.leads.toLocaleString("id-ID")],
      ["%", "Conversion Rate", `${campaign.conversion.toFixed(1).replace(".", ",")}%`],
    ];
    this.root.querySelector("[data-social-insight-kpis]").innerHTML = metrics
      .map(
        ([icon, label, value], index) => `
          <article class="social-insight-kpi"><span>${icon}</span><div><small>${label}</small><b>${value}</b><em>↑ ${campaign.change[index]} vs lalu</em></div></article>
        `,
      )
      .join("");

    const maxClicks = Math.max(...campaign.trend.map((point) => point[0]));
    this.root.querySelector("[data-social-trend-chart]").innerHTML = campaign.trend
      .map(
        ([clicks, leads], index) => `
          <div class="social-trend-day">
            <i style="height:${Math.max(8, (clicks / maxClicks) * 100)}%"></i>
            <i style="height:${Math.max(8, (leads / maxClicks) * 100)}%"></i>
            <span>${22 + index} Jul</span>
          </div>
        `,
      )
      .join("");

    const steps = [
      ["UTM", "Tracked Click", campaign.utm, campaign.clicks],
      ["?", "Possible Lead", "Nomor mulai teridentifikasi", campaign.possible],
      ["CRM", "Confirmed Lead", "Customer masuk pipeline", campaign.leads],
    ];
    this.root.querySelector("[data-social-attribution]").innerHTML = steps
      .map(
        ([icon, label, copy, value]) => `
          <div class="social-attribution-step"><span>${icon}</span><div><b>${label}</b><small>${copy}</small></div><strong>${Number(value).toLocaleString("id-ID")}</strong></div>
        `,
      )
      .join("");

    const rankingByCampaign = {
      zenix: [
        ["Toyota Innova Zenix", "498 klik · 42 lead", "8,4%"],
        ["Honda BR-V Prestige", "382 klik · 29 lead", "7,6%"],
        ["Suzuki Ertiga Hybrid", "301 klik · 22 lead", "7,3%"],
        ["Mitsubishi Xpander", "274 klik · 18 lead", "6,6%"],
      ],
      brv: [
        ["Honda BR-V Prestige", "412 klik · 34 lead", "8,3%"],
        ["Toyota Raize GR Sport", "298 klik · 21 lead", "7,0%"],
        ["Honda CR-V Turbo", "256 klik · 17 lead", "6,6%"],
        ["Wuling Almaz RS", "188 klik · 12 lead", "6,4%"],
      ],
      xpander: [
        ["Mitsubishi Xpander", "320 klik · 24 lead", "7,5%"],
        ["Suzuki Ertiga Hybrid", "245 klik · 18 lead", "7,3%"],
        ["Toyota Innova Zenix", "198 klik · 14 lead", "7,1%"],
        ["Daihatsu Xenia ADS", "142 klik · 9 lead", "6,3%"],
      ],
      raize: [
        ["Toyota Raize GR Sport", "356 klik · 28 lead", "7,9%"],
        ["Honda BR-V Prestige", "274 klik · 19 lead", "6,9%"],
        ["Wuling Almaz RS", "210 klik · 14 lead", "6,7%"],
        ["Daihatsu Rocky", "156 klik · 9 lead", "5,8%"],
      ],
      pajero: [
        ["Mitsubishi Pajero Sport", "288 klik · 18 lead", "6,3%"],
        ["Honda CR-V Turbo", "241 klik · 15 lead", "6,2%"],
        ["Toyota Innova Zenix", "198 klik · 12 lead", "6,1%"],
        ["Mitsubishi Xpander", "164 klik · 9 lead", "5,5%"],
      ],
      ertiga: [
        ["Suzuki Ertiga Hybrid", "310 klik · 26 lead", "8,4%"],
        ["Mitsubishi Xpander", "252 klik · 18 lead", "7,1%"],
        ["Toyota Avanza G", "198 klik · 13 lead", "6,6%"],
        ["Honda Mobilio", "141 klik · 8 lead", "5,7%"],
      ],
    };
    const campaignKey = this.campaignSelect.value;
    const ranking = rankingByCampaign[campaignKey] || rankingByCampaign.zenix;
    this.root.querySelector("[data-social-product-ranking]").innerHTML = ranking
      .map(
        ([name, copy, conversion], index) => `
          <div class="social-product-row"><span>${index + 1}</span><span class="social-product-thumb"></span><div><b>${name}</b><small>${copy}</small></div><strong>${conversion}</strong></div>
        `,
      )
      .join("");

    const leads = [
      ["Nadia Putri", "Innova Zenix", "Instagram", "Prospek"],
      ["Raka Aditya", "Honda BR-V", "Facebook", "Follow-up"],
      ["Dewi Maharani", "Innova Zenix", "Instagram", "Test Drive"],
      ["Bima Pratama", "Raize GR Sport", "Instagram", "Prospek"],
      ["Siti Aulia", "Ertiga Hybrid", "Facebook", "Follow-up"],
      ["Andi Wijaya", "Pajero Sport", "Facebook", "Test Drive"],
    ];
    this.root.querySelector("[data-social-leads]").innerHTML = leads
      .map(
        ([customer, product, source, status]) => `
          <tr><td>${customer}</td><td>${product}</td><td>${source}</td><td><span class="social-lead-status">${status}</span></td></tr>
        `,
      )
      .join("");
  }

  formatDate(value) {
    const date = new Date(`${value}T00:00:00Z`);
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  }
}

const socialDemoMount = document.getElementById("socialDemo");
let socialGrowthDemoInstance = null;
if (socialDemoMount) {
  socialGrowthDemoInstance = new SocialGrowthDemo(socialDemoMount);
  window.__motovaxApplyInventoryPhotos = (units) => {
    socialGrowthDemoInstance?.applyInventoryPhotos(units);
  };
}

class CapabilityProductDemo {
  constructor(root) {
    this.root = root;
    this.mode = "whatsapp";
    this.role = "sales";
    this.aiPaused = false;
    this.rule = "followup";
    this.lastFocusedElement = null;
    this.waLogs = [
      { time: "10:42", title: "Health check normal", copy: "Falcon · session connected" },
      { time: "10:39", title: "Meta sync selesai", copy: "Messenger + Instagram aktif" },
      { time: "10:31", title: "Nomor Call Center diperiksa", copy: "2 nomor · multi-branch" },
    ];
    this.automationLogs = [
      { time: "10:34", title: "Auto-follow CRM", copy: "12 lead stale → task MR" },
      { time: "09:00", title: "Email report worker", copy: "Rekap harian terkirim" },
    ];
    this.tour = new DemoProductTour(root, {
      ns: "capability",
      anchorAttr: "data-capability-anchor",
      getSteps: () => this.guideSteps(),
      getStepLabel: (_step, index, total) => `AUTOMASI · LANGKAH ${index} DARI ${total}`,
    });
    this.bind();
    this.render();
  }

  guideSteps() {
    return [
      {
        anchor: "automation-status",
        title: "Mulai dari status automasi",
        body: "Ringkasan ini membedakan automasi yang aktif di produk dari workflow builder visual yang masih berstatus roadmap.",
      },
      {
        anchor: "automation-rules",
        title: "Pilih rule yang ingin diuji",
        body: "Klik salah satu rule aktif. Diagram event di sebelahnya akan berubah mengikuti Auto-follow CRM, routing, report worker, atau photo maintenance.",
      },
      {
        anchor: "automation-simulator",
        title: "Jalankan event demo",
        body: "Tekan “Jalankan event demo” untuk memproses simulasi aman. Hasilnya muncul di panel ini tanpa menghubungi customer atau mengubah data produksi.",
      },
      {
        anchor: "automation-log",
        title: "Periksa jejak eksekusi",
        body: "Setiap simulasi menambahkan event terbaru ke log. Coba rule lain, jalankan kembali, atau gunakan Clear demo untuk mengosongkan jejak.",
      },
    ];
  }

  roleConfigs() {
    return {
      sales: {
        title: "Sales · Falcon",
        avatar: "FA",
        profile: "Motovax Sales AI",
        number: "+62 811-2345-001",
        routing: "Lead sales & inventory",
        tools: "Stok, foto, kredit, handoff",
      },
      "call-center": {
        title: "Call Center · Jasmine",
        avatar: "JA",
        profile: "Motovax Customer AI",
        number: "2 nomor Call Center",
        routing: "Inquiry, komplain, handoff MR",
        tools: "Inbox, kredit, inventori, eskalasi",
      },
      meta: {
        title: "Meta Channels",
        avatar: "ME",
        profile: "Messenger + Instagram",
        number: "Meta Business · Connected",
        routing: "DM ke inbox omnichannel",
        tools: "DM, media, atribusi source",
      },
    };
  }

  automationConfigs() {
    return {
      followup: {
        title: "Auto-follow CRM",
        steps: ["Lead stale terdeteksi", "Cek program & guideline", "Buat reminder / task MR", "Catat aktivitas CRM"],
        result: "12 lead stale diproses; 9 reminder dan 3 task MR dibuat di tenant demo.",
      },
      routing: {
        title: "Jasmine routing",
        steps: ["Intent customer dibaca", "Kualifikasi status HOT", "Pilih MR sesuai routing", "Fallback ke Call Center"],
        result: "Lead HOT diarahkan ke MR Dimas; SLA acknowledgement mulai dihitung.",
      },
      report: {
        title: "Email report worker",
        steps: ["Jadwal report aktif", "Ambil metrik tenant", "Susun rekap per role", "Kirim & simpan log"],
        result: "Laporan performa harian disusun dan dicatat sebagai simulasi pengiriman.",
      },
      photo: {
        title: "Photo maintenance",
        steps: ["Foto unit diunggah", "Validasi identitas unit", "Optimasi media", "Sinkron ke inventory"],
        result: "8 foto tervalidasi dan disinkronkan ke 2 unit pada tenant demo.",
      },
    };
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-whatsapp-demo]")) {
      button.addEventListener("click", (event) => {
        if (button instanceof HTMLAnchorElement) event.preventDefault();
        this.open(button, "whatsapp");
      });
    }
    for (const button of document.querySelectorAll("[data-open-automation-demo]")) {
      button.addEventListener("click", (event) => {
        if (button instanceof HTMLAnchorElement) event.preventDefault();
        this.open(button, "automation");
      });
    }
    this.root.querySelector("[data-close-capability-demo]")?.addEventListener("click", () => this.close());
    this.root.querySelector("[data-capability-reset]")?.addEventListener("click", () => this.reset());
    for (const button of this.root.querySelectorAll("[data-capability-nav]")) {
      button.addEventListener("click", () => this.switchMode(button.dataset.capabilityNav || "whatsapp"));
    }
    this.root.addEventListener("click", (event) => {
      const role = event.target.closest("[data-wa-demo-role]");
      if (role) {
        this.role = role.dataset.waDemoRole || "sales";
        this.renderWhatsApp();
        return;
      }
      const action = event.target.closest("[data-wa-demo-action]");
      if (action) {
        this.handleWhatsAppAction(action.dataset.waDemoAction || "test");
        return;
      }
      if (event.target.closest("[data-wa-demo-refresh]")) {
        this.waLogs.unshift({ time: "baru", title: "Status diperbarui", copy: "Semua session normal" });
        this.renderWhatsApp();
        return;
      }
      const rule = event.target.closest("[data-automation-rule]");
      if (rule) {
        this.rule = rule.dataset.automationRule || "followup";
        const result = this.root.querySelector("[data-automation-result]");
        if (result) result.hidden = true;
        this.renderAutomation();
        return;
      }
      if (event.target.closest("[data-automation-run]")) {
        this.runAutomation();
        return;
      }
      if (event.target.closest("[data-automation-clear]")) {
        this.automationLogs = [];
        this.renderAutomation();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (this.tour.isOpen) this.tour.close();
      else this.close();
    });
  }

  open(trigger, mode) {
    this.lastFocusedElement = trigger;
    this.switchMode(mode);
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    if (this.mode === "automation") this.tour.open(0);
    else this.root.querySelector("[data-close-capability-demo]")?.focus();
  }

  close() {
    this.tour.close();
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    this.lastFocusedElement?.focus();
  }

  reset() {
    this.role = "sales";
    this.aiPaused = false;
    this.rule = "followup";
    this.waLogs = [
      { time: "10:42", title: "Health check normal", copy: "Falcon · session connected" },
      { time: "10:39", title: "Meta sync selesai", copy: "Messenger + Instagram aktif" },
    ];
    this.automationLogs = [{ time: "10:34", title: "Auto-follow CRM", copy: "12 lead stale → task MR" }];
    const result = this.root.querySelector("[data-automation-result]");
    if (result) result.hidden = true;
    this.render();
  }

  switchMode(mode) {
    this.mode = mode === "automation" ? "automation" : "whatsapp";
    if (this.mode !== "automation" && this.tour?.isOpen) this.tour.close();
    const copy = this.mode === "automation"
      ? {
          title: "Automasi Operasional",
          subtitle: "Agent tools · routing · worker · tenant demo",
          breadcrumb: "Operasional / Automasi Aktif",
          heading: "Automation Control Center",
          description: "Pantau automasi yang benar-benar tercermin di produk tanpa menampilkan workflow builder sebagai fitur live.",
        }
      : {
          title: "WhatsApp API & Integration",
          subtitle: "Channel Control Center · tenant demo",
          breadcrumb: "Settings / Integrations / WhatsApp",
          heading: "Channel Control Center",
          description: "Hubungkan channel per role, pantau status session, dan kendalikan AI tenant dari satu workspace.",
        };
    this.root.querySelector("[data-capability-title]").textContent = copy.title;
    this.root.querySelector("[data-capability-subtitle]").textContent = copy.subtitle;
    this.root.querySelector("[data-capability-breadcrumb]").textContent = copy.breadcrumb;
    this.root.querySelector("[data-capability-heading]").textContent = copy.heading;
    this.root.querySelector("[data-capability-description]").textContent = copy.description;
    const guideTrigger = this.root.querySelector("[data-capability-guide-trigger]");
    if (guideTrigger) guideTrigger.hidden = this.mode !== "automation";
    for (const button of this.root.querySelectorAll("[data-capability-nav]")) {
      const active = button.dataset.capabilityNav === this.mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    }
    for (const view of this.root.querySelectorAll("[data-capability-view]")) {
      const active = view.dataset.capabilityView === this.mode;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    }
    this.render();
  }

  handleWhatsAppAction(action) {
    const config = this.roleConfigs()[this.role];
    if (action === "toggle") {
      this.aiPaused = !this.aiPaused;
      this.waLogs.unshift({
        time: "baru",
        title: this.aiPaused ? "AI dipause" : "AI diaktifkan",
        copy: config.title,
      });
    } else if (action === "history") {
      this.waLogs.unshift({ time: "baru", title: "Riwayat session dibuka", copy: `${config.title} · 24 jam terakhir` });
    } else {
      this.waLogs.unshift({ time: "baru", title: "Tes koneksi berhasil", copy: `${config.title} · latency 84 ms` });
      const sync = this.root.querySelector("[data-wa-demo-sync]");
      if (sync) sync.textContent = "sekarang";
    }
    this.renderWhatsApp();
  }

  runAutomation() {
    const config = this.automationConfigs()[this.rule];
    this.automationLogs.unshift({ time: "baru", title: config.title, copy: config.result });
    const result = this.root.querySelector("[data-automation-result]");
    if (result) result.hidden = false;
    this.root.querySelector("[data-automation-result-copy]").textContent = config.result;
    this.renderAutomation();
  }

  render() {
    this.renderWhatsApp();
    this.renderAutomation();
  }

  renderWhatsApp() {
    const config = this.roleConfigs()[this.role] || this.roleConfigs().sales;
    for (const button of this.root.querySelectorAll("[data-wa-demo-role]")) {
      const active = button.dataset.waDemoRole === this.role;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    }
    this.root.querySelector("[data-wa-demo-role-title]").textContent = config.title;
    this.root.querySelector("[data-wa-demo-role-state]").textContent = this.aiPaused ? "AI dipause" : "AI aktif";
    this.root.querySelector("[data-wa-demo-avatar]").textContent = config.avatar;
    this.root.querySelector("[data-wa-demo-profile]").textContent = config.profile;
    this.root.querySelector("[data-wa-demo-number]").textContent = config.number;
    this.root.querySelector("[data-wa-demo-routing]").textContent = config.routing;
    this.root.querySelector("[data-wa-demo-tools]").textContent = config.tools;
    const toggle = this.root.querySelector('[data-wa-demo-action="toggle"]');
    if (toggle) toggle.textContent = this.aiPaused ? "Aktifkan AI" : "Pause AI";
    this.root.querySelector("[data-wa-demo-log]").innerHTML = this.waLogs
      .slice(0, 6)
      .map((item) => `<li><time>${item.time}</time><span><b>${item.title}</b><small>${item.copy}</small></span><i></i></li>`)
      .join("");
  }

  renderAutomation() {
    const config = this.automationConfigs()[this.rule] || this.automationConfigs().followup;
    for (const button of this.root.querySelectorAll("[data-automation-rule]")) {
      const active = button.dataset.automationRule === this.rule;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    }
    this.root.querySelector("[data-automation-title]").textContent = config.title;
    this.root.querySelector("[data-automation-flow]").innerHTML = config.steps
      .map((step, index) => `<div><span>${index + 1}</span><b>${step}</b>${index < config.steps.length - 1 ? "<i>→</i>" : ""}</div>`)
      .join("");
    const log = this.root.querySelector("[data-automation-log]");
    log.innerHTML = this.automationLogs.length
      ? this.automationLogs.slice(0, 6).map((item) => `<li><time>${item.time}</time><span><b>${item.title}</b><small>${item.copy}</small></span><em>Selesai</em></li>`).join("")
      : '<li class="empty">Belum ada event demo.</li>';
  }
}

const capabilityDemoMount = document.getElementById("capabilityDemo");
if (capabilityDemoMount) new CapabilityProductDemo(capabilityDemoMount);

const insightDemoSources = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "WA",
    volume: 562,
    hot: 78,
    response: 1.4,
    conversion: 8.7,
    followup: 34,
    status: "Peluang tinggi",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "IG",
    volume: 318,
    hot: 52,
    response: 2.1,
    conversion: 9.4,
    followup: 17,
    status: "Terbaik",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "FB",
    volume: 246,
    hot: 31,
    response: 3.8,
    conversion: 6.1,
    followup: 22,
    status: "Perlu optimasi",
  },
  {
    id: "website",
    name: "Website",
    icon: "WEB",
    volume: 122,
    hot: 19,
    response: 2.6,
    conversion: 7.2,
    followup: 9,
    status: "Stabil",
  },
];

const insightDemoGoals = {
  conversion: {
    label: "Tingkatkan Konversi",
    title: "Conversion Intelligence",
    description: "Temukan kebocoran funnel dan peluang terbesar untuk meningkatkan closing.",
    focus: "Fokus aktif: tingkatkan konversi dari lead masuk hingga closing.",
    opportunityTitle: "Pulihkan 18 deal potensial",
    opportunityCopy:
      "23 lead Warm belum mendapat follow-up dalam 2 jam. Prioritaskan sekarang untuk menaikkan peluang closing.",
    potentialUplift: 1.4,
    bottleneck: "Warm → Hot kehilangan 42% peluang",
    bestTime: "Selasa–Kamis · 10:00–14:00",
  },
  response: {
    label: "Percepat Respons",
    title: "Response Intelligence",
    description: "Lihat kapan dan di mana lead menunggu terlalu lama sebelum ditangani.",
    focus: "Fokus aktif: pangkas waktu respons dan cegah lead kehilangan momentum.",
    opportunityTitle: "Pangkas respons hingga 1,8 menit",
    opportunityCopy:
      "Volume tertinggi terjadi pukul 10:00–14:00, sementara kapasitas tim turun 21%. Atur ulang prioritas antrian untuk merespons lebih cepat.",
    potentialUplift: 0.9,
    bottleneck: "Connected → Warm melambat saat jam sibuk",
    bestTime: "Senin–Kamis · 09:00–13:00",
  },
  hot: {
    label: "Prioritaskan Lead HOT",
    title: "HOT Lead Intelligence",
    description: "Pisahkan peluang siap closing dan arahkan tindakan tim ke lead bernilai tinggi.",
    focus: "Fokus aktif: amankan lead HOT sebelum melewati SLA follow-up.",
    opportunityTitle: "Amankan 11 lead HOT hari ini",
    opportunityCopy:
      "11 lead HOT belum mendapat tindakan lanjutan. Handoff ke agent dengan kapasitas terbaik dapat mempertahankan peluang closing.",
    potentialUplift: 1.1,
    bottleneck: "11 lead HOT berisiko melewati SLA",
    bestTime: "Hari kerja · 09:00–16:00",
  },
};

class ConversionInsightDemo {
  constructor(root) {
    this.root = root;
    this.sources = insightDemoSources.map((source) => ({ ...source }));
    this.goal = "conversion";
    this.period = "month";
    this.selectedSources = new Set(this.sources.map((source) => source.id));
    this.visibleWidgets = new Set(["kpi", "funnel", "opportunity", "sources", "heatmap", "actions"]);
    this.actionApplied = false;
    this.lastFocusedElement = null;
    this.hasOpened = false;

    this.customizer = root.querySelector("[data-insight-customizer]");
    this.customizerBackdrop = root.querySelector("[data-insight-customizer-backdrop]");
    this.toast = root.querySelector("[data-insight-toast]");
    this.kpiGrid = root.querySelector("[data-insight-widget='kpi']");
    this.funnel = root.querySelector("[data-insight-funnel]");
    this.sourceList = root.querySelector("[data-insight-source-list]");
    this.heatmap = root.querySelector("[data-insight-heatmap]");
    this.actionList = root.querySelector("[data-insight-action-list]");
    this.runActionButton = root.querySelector("[data-insight-run-action]");
    this.hasOpenedGuide = false;

    this.tour = new DemoProductTour(root, {
      ns: "insight",
      anchorAttr: "data-insight-anchor",
      getSteps: () => this.guideSteps(),
      getStepLabel: (step, index, total) => {
        const viewLabel = step.label || "Conversion Insight";
        return total > 1
          ? `${String(viewLabel).toUpperCase()} · LANGKAH ${index} DARI ${total}`
          : String(viewLabel).toUpperCase();
      },
    });

    this.bind();
    this.reset();
    this.loadTenantMetrics();
  }

  guideSteps() {
    return [
      {
        anchor: "sidebar",
        label: "Conversion Insight",
        title: "Conversion Intelligence",
        body: "Modul insight menemukan kebocoran funnel dan peluang closing. Panduan memakai spotlight + tooltip seperti Inventory Management.",
      },
      {
        anchor: "kpi",
        label: "KPI",
        title: "KPI konversi",
        body: "Pantau lead masuk, HOT, response time, dan conversion rate sesuai periode yang dipilih.",
      },
      {
        anchor: "funnel",
        label: "Funnel",
        title: "Diagnostik funnel",
        body: "Corong Lead → Closing menampilkan tahap dengan drop-off terbesar (bottleneck).",
      },
      {
        anchor: "opportunity",
        label: "Opportunity",
        title: "Prioritas berdampak tinggi",
        body: "Kartu opportunity mengestimasi uplift konversi bila rekomendasi dijalankan di tenant demo.",
      },
      {
        anchor: "sources",
        label: "Sumber",
        title: "Performa sumber lead",
        body: "Bandingkan WhatsApp, Instagram, Facebook, dan Website berdasarkan volume dan konversi.",
      },
      {
        anchor: "actions",
        label: "Next Best Action",
        title: "Rekomendasi untuk tim",
        body: "Daftar aksi prioritas. Tombol Jalankan Rekomendasi Demo mencatat aktivitas di tenant demo. Selesai — sesuaikan fokus lewat panel personalisasi.",
      },
    ];
  }

  async loadTenantMetrics(force = false) {
    try {
      const snapshot = await publicDemoData.snapshot(force);
      const sourceByID = new Map(
        snapshot.sources.map((source) => [this.sourceID(source.name), source]),
      );
      this.sources = insightDemoSources.map((source) => {
        const live = sourceByID.get(source.id);
        if (!live) return { ...source, volume: 0, hot: 0, followup: 0, conversion: 0 };
        return {
          ...source,
          volume: live.total,
          hot: live.hot,
          followup: Math.max(0, live.total - live.hot - live.closing),
          conversion: live.conversion,
        };
      });
      this.render();
    } catch (error) {
      this.showToast("Data tenant demo belum dimuat", error.message);
    }
  }

  sourceID(name) {
    const value = String(name).toLocaleLowerCase("id");
    if (value.includes("whatsapp")) return "whatsapp";
    if (value.includes("instagram")) return "instagram";
    if (value.includes("facebook") || value.includes("messenger")) return "facebook";
    return "website";
  }

  bind() {
    for (const button of document.querySelectorAll("[data-open-insight-demo]")) {
      button.addEventListener("click", () => this.open(button));
    }
    for (const button of this.root.querySelectorAll("[data-close-insight-demo]")) {
      button.addEventListener("click", () => this.close());
    }

    this.root.querySelector("[data-insight-reset]").addEventListener("click", () => this.reset());
    this.root.querySelector("[data-insight-customize]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-insight-customize-banner]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-insight-customize-sidebar]").addEventListener("click", () => this.openCustomizer());
    this.root.querySelector("[data-insight-customizer-close]").addEventListener("click", () => this.closeCustomizer());
    this.customizerBackdrop.addEventListener("click", () => this.closeCustomizer());
    this.root.querySelector("[data-insight-toast-close]").addEventListener("click", () => {
      this.toast.hidden = true;
    });

    for (const button of this.root.querySelectorAll("[data-insight-period]")) {
      button.addEventListener("click", () => {
        this.period = button.dataset.insightPeriod || "month";
        this.actionApplied = false;
        this.render();
      });
    }

    for (const button of this.root.querySelectorAll("[data-insight-goal]")) {
      button.addEventListener("click", () => {
        this.goal = button.dataset.insightGoal || "conversion";
        this.actionApplied = false;
        this.render();
      });
    }

    for (const input of this.root.querySelectorAll("[data-insight-source]")) {
      input.addEventListener("change", () => {
        const source = input.value;
        if (!input.checked && this.selectedSources.size === 1) {
          input.checked = true;
          return;
        }
        if (input.checked) this.selectedSources.add(source);
        else this.selectedSources.delete(source);
        this.actionApplied = false;
        this.render();
      });
    }

    for (const input of this.root.querySelectorAll("[data-insight-toggle]")) {
      input.addEventListener("change", () => {
        const widget = input.dataset.insightToggle;
        if (!widget) return;
        if (input.checked) this.visibleWidgets.add(widget);
        else this.visibleWidgets.delete(widget);
        this.renderWidgets();
      });
    }

    this.root.querySelector("[data-insight-save]").addEventListener("click", () => {
      this.closeCustomizer();
      this.showToast(
        "Tampilan insight disimpan",
        `Fokus ${insightDemoGoals[this.goal].label} siap digunakan.`,
      );
    });

    this.runActionButton.addEventListener("click", async () => {
      if (this.actionApplied) return;
      this.runActionButton.disabled = true;
      try {
        await publicDemoData.submit("insight_action", {
          message: `Menjalankan fokus insight: ${insightDemoGoals[this.goal].label}`,
        });
      } catch (error) {
        this.runActionButton.disabled = false;
        this.showToast("Rekomendasi belum tersimpan", error.message);
        return;
      }
      this.actionApplied = true;
      this.render();
      this.showToast(
        "Rekomendasi demo dijalankan",
        "Proyeksi KPI diperbarui dan aktivitas tercatat di tenant demo.",
      );
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.root.classList.contains("is-open")) return;
      if (!this.toast.hidden) this.toast.hidden = true;
      else if (this.tour?.isOpen) this.closeGuide();
      else if (this.customizer.classList.contains("is-open")) this.closeCustomizer();
      else this.close();
    });
  }

  open(trigger) {
    this.lastFocusedElement = trigger;
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
    this.root.querySelector("[data-close-insight-demo]").focus();
    if (!this.hasOpenedGuide) {
      this.openGuide(0);
      this.hasOpenedGuide = true;
    }
  }

  close() {
    this.closeGuide();
    this.closeCustomizer();
    this.toast.hidden = true;
    this.root.classList.remove("is-open");
    this.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    if (this.lastFocusedElement) this.lastFocusedElement.focus();
  }

  openGuide(startIndex = 0) {
    this.closeCustomizer();
    this.tour?.open(startIndex);
  }

  closeGuide() {
    this.tour?.close();
  }

  openCustomizer() {
    this.customizer.classList.add("is-open");
    this.customizer.setAttribute("aria-hidden", "false");
    this.customizerBackdrop.hidden = false;
    this.customizer.querySelector("[data-insight-customizer-close]").focus();
  }

  closeCustomizer() {
    this.customizer.classList.remove("is-open");
    this.customizer.setAttribute("aria-hidden", "true");
    this.customizerBackdrop.hidden = true;
  }

  showToast(title, copy) {
    this.root.querySelector("[data-insight-toast-title]").textContent = title;
    this.root.querySelector("[data-insight-toast-copy]").textContent = copy;
    this.toast.hidden = false;
  }

  reset() {
    this.goal = "conversion";
    this.period = "month";
    this.selectedSources = new Set(this.sources.map((source) => source.id));
    this.visibleWidgets = new Set(["kpi", "funnel", "opportunity", "sources", "heatmap", "actions"]);
    this.actionApplied = false;
    this.toast.hidden = true;
    for (const input of this.root.querySelectorAll("[data-insight-source]")) input.checked = true;
    for (const input of this.root.querySelectorAll("[data-insight-toggle]")) input.checked = true;
    this.render();
  }

  activeSources() {
    return this.sources.filter((source) => this.selectedSources.has(source.id));
  }

  periodMultiplier() {
    if (this.period === "today") return 0.045;
    if (this.period === "week") return 0.24;
    return 1;
  }

  analytics() {
    const sources = this.activeSources();
    const multiplier = this.periodMultiplier();
    const rawLeads = sources.reduce((sum, source) => sum + source.volume, 0);
    const leads = Math.max(1, Math.round(rawLeads * multiplier));
    const rawHot = sources.reduce((sum, source) => sum + source.hot, 0);
    const hot = Math.max(1, Math.round(rawHot * multiplier));
    const response = sources.reduce((sum, source) => sum + source.response * source.volume, 0) / Math.max(1, rawLeads);
    const conversion = sources.reduce((sum, source) => sum + source.conversion * source.volume, 0) / Math.max(1, rawLeads);
    const followup = Math.max(1, Math.round(sources.reduce((sum, source) => sum + source.followup, 0) * multiplier));
    const actionCount = Math.max(1, Math.round((followup * 0.42) + (hot * 0.08)));

    return {
      sources,
      leads,
      hot,
      response: Math.max(0.6, response - (this.actionApplied && this.goal === "response" ? 0.8 : 0)),
      conversion: conversion + (this.actionApplied ? insightDemoGoals[this.goal].potentialUplift : 0),
      baseConversion: conversion,
      followup: this.actionApplied ? Math.max(0, followup - Math.ceil(followup * 0.28)) : followup,
      actionCount: this.actionApplied ? Math.max(0, actionCount - Math.ceil(actionCount * 0.6)) : actionCount,
    };
  }

  render() {
    const goal = insightDemoGoals[this.goal];
    const data = this.analytics();
    const periodLabel = this.period === "today" ? "Hari Ini" : this.period === "week" ? "Minggu Ini" : "Bulan Ini";

    this.root.querySelector("[data-insight-title]").textContent = goal.title;
    this.root.querySelector("[data-insight-description]").textContent = goal.description;
    this.root.querySelector("[data-insight-focus-copy]").textContent = goal.focus;

    for (const button of this.root.querySelectorAll("[data-insight-period]")) {
      const active = button.dataset.insightPeriod === this.period;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    for (const button of this.root.querySelectorAll("[data-insight-goal]")) {
      const active = button.dataset.insightGoal === this.goal;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const kpis = [
      ["LD", `Leads Masuk · ${periodLabel}`, data.leads.toLocaleString("id-ID"), "↑ 14,8%", "vs periode lalu", "leads"],
      ["HOT", "Lead HOT", data.hot.toLocaleString("id-ID"), "↑ 18,2%", "siap ditindaklanjuti", "hot"],
      ["RT", "Rata-rata Respons", `${data.response.toFixed(1).replace(".", ",")} mnt`, "↓ 22,4%", "lebih cepat", "response"],
      ["%", "Tingkat Konversi", `${data.conversion.toFixed(1).replace(".", ",")}%`, `↑ ${(data.conversion - 6.4).toFixed(1).replace(".", ",")} pt`, "dari lead masuk", "conversion"],
      ["FU", "Pending Follow-up", data.followup.toLocaleString("id-ID"), this.actionApplied ? "↓ 28,0%" : "↓ 8,1%", "perlu diselesaikan", "followup"],
      ["!", "Butuh Aksi · SLA", data.actionCount.toLocaleString("id-ID"), this.actionApplied ? "↓ 60,0%" : "↓ 12,3%", "prioritas tim", "action"],
    ];
    const priorityKey = this.goal === "response" ? "response" : this.goal === "hot" ? "hot" : "conversion";
    this.kpiGrid.innerHTML = kpis
      .map(
        ([icon, label, value, delta, copy, key]) => `
          <article class="dashboard-kpi-card ${key === priorityKey ? "is-priority" : ""}">
            <span>${label}<i>${icon}</i></span><b>${value}</b><small><em>${delta}</em>${copy}</small>
          </article>
        `,
      )
      .join("");

    this.renderFunnel(data);
    this.renderOpportunity(data, goal);
    this.renderSources(data);
    this.renderHeatmap(goal);
    this.renderActions(data);
    this.renderWidgets();
  }

  renderFunnel(data) {
    const closing = Math.max(1, Math.round(data.leads * data.conversion / 100));
    const stages = [
      ["Lead Masuk", data.leads, 100],
      ["Terhubung", Math.round(data.leads * 0.72), 72],
      ["Warm", Math.round(data.leads * 0.44), 44],
      ["Hot", data.hot, Math.max(12, (data.hot / data.leads) * 100)],
      ["Closing", closing, Math.max(7, (closing / data.leads) * 100)],
    ];
    this.funnel.innerHTML = stages
      .map(
        ([label, value, width], index) => `
          <div class="insight-funnel-row">
            <span>${label}</span>
            <div class="insight-funnel-track"><i style="width:${Math.min(100, width)}%"></i></div>
            <b>${Number(value).toLocaleString("id-ID")}</b>
            <em>${index === 0 ? "100%" : `${((Number(value) / data.leads) * 100).toFixed(0)}%`}</em>
          </div>
        `,
      )
      .join("");
    this.root.querySelector("[data-insight-funnel-rate]").textContent =
      `${data.conversion.toFixed(1).replace(".", ",")}% end-to-end`;
    this.root.querySelector("[data-insight-bottleneck]").textContent =
      insightDemoGoals[this.goal].bottleneck;
  }

  renderOpportunity(data, goal) {
    const current = data.baseConversion;
    const potential = current + goal.potentialUplift;
    this.root.querySelector("[data-insight-opportunity-title]").textContent =
      this.actionApplied ? "Rekomendasi berhasil disimulasikan" : goal.opportunityTitle;
    this.root.querySelector("[data-insight-opportunity-copy]").textContent =
      this.actionApplied
        ? "Prioritas tim telah diperbarui dalam simulasi. KPI proyeksi menunjukkan dampak jika tindakan yang sama diterapkan."
        : goal.opportunityCopy;
    this.root.querySelector("[data-insight-current-rate]").textContent =
      `${current.toFixed(1).replace(".", ",")}%`;
    this.root.querySelector("[data-insight-potential-rate]").textContent =
      `${potential.toFixed(1).replace(".", ",")}%`;
    this.runActionButton.classList.toggle("is-complete", this.actionApplied);
    this.runActionButton.disabled = this.actionApplied;
    this.runActionButton.innerHTML = this.actionApplied
      ? "<span>✓</span> Rekomendasi Diterapkan di Demo"
      : "<span>▶</span> Jalankan Rekomendasi Demo";
  }

  renderSources(data) {
    const maxVolume = Math.max(...data.sources.map((source) => source.volume), 1);
    const multiplier = this.periodMultiplier();
    const rows = data.sources
      .map((source) => {
        const warning = source.status === "Perlu optimasi";
        return `
          <div class="insight-source-row">
            <div class="insight-source-name"><span class="insight-source-icon ${source.id}">${source.icon}</span>${source.name}</div>
            <div class="insight-source-volume"><i style="--source-width:${(source.volume / maxVolume) * 100}%"></i>${Math.max(1, Math.round(source.volume * multiplier)).toLocaleString("id-ID")}</div>
            <span>${Math.max(1, Math.round(source.hot * multiplier))} HOT</span>
            <span>${source.response.toFixed(1).replace(".", ",")} mnt</span>
            <b class="insight-source-rate">${source.conversion.toFixed(1).replace(".", ",")}%</b>
            <span class="insight-source-status ${warning ? "warning" : ""}">${source.status}</span>
          </div>
        `;
      })
      .join("");
    this.sourceList.innerHTML = `
      <div class="insight-source-head"><span>Sumber</span><span>Volume Lead</span><span>Potensi</span><span>Respons</span><span>Konversi</span><span>Status</span></div>
      ${rows}
    `;
    this.root.querySelector("[data-insight-source-count]").textContent =
      `${data.sources.length} sumber aktif`;
  }

  renderHeatmap(goal) {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum"];
    const times = ["09:00", "10:00", "12:00", "14:00", "16:00"];
    const values = [
      [42, 56, 49, 38, 31],
      [58, 91, 86, 79, 45],
      [61, 94, 88, 83, 48],
      [55, 89, 92, 77, 51],
      [39, 62, 58, 47, 34],
    ];
    const cells = ['<span class="axis"></span>', ...days.map((day) => `<span class="axis">${day}</span>`)];
    times.forEach((time, row) => {
      cells.push(`<span class="axis">${time}</span>`);
      values[row].forEach((value) => cells.push(`<span class="cell" style="--heat:${value}%">${value}</span>`));
    });
    this.heatmap.innerHTML = cells.join("");
    this.root.querySelector("[data-insight-best-time]").textContent = goal.bestTime;
  }

  renderActions(data) {
    const actionSets = {
      conversion: [
        ["!", "critical", `Follow-up ${Math.max(8, data.followup)} lead Warm`, "Lewat 2 jam · potensi closing tinggi", "Sekarang"],
        ["↗", "positive", "Gunakan script Instagram terbaik", "Konversi 9,4% · unggul 1,7 poin", "+6 deal"],
        ["RT", "", "Percepat antrian Facebook", "Respons 3,8 menit · paling lambat", "Hari ini"],
      ],
      response: [
        ["RT", "critical", "Tambah kapasitas pukul 10–14", "Menangani 46% volume harian", "-1,8 mnt"],
        ["!", "", `${data.followup} follow-up menunggu`, "Urutkan berdasarkan SLA terdekat", "Sekarang"],
        ["↗", "positive", "Salin pola respons WhatsApp", "Respons tercepat 1,4 menit", "+12%"],
      ],
      hot: [
        ["!", "critical", `${Math.max(3, data.actionCount)} lead HOT melewati SLA`, "Handoff ke agent yang tersedia", "Mendesak"],
        ["HOT", "", "Prioritaskan intent test drive", "Peluang closing 2,3× lebih tinggi", "+7 deal"],
        ["✓", "positive", "Pertahankan routing Instagram", "Konversi HOT terbaik bulan ini", "9,4%"],
      ],
    };
    const actions = actionSets[this.goal];
    this.actionList.innerHTML = actions
      .map(
        ([icon, tone, title, copy, impact]) => `
          <div class="insight-action-item ${tone}"><span>${icon}</span><div><b>${title}</b><p>${copy}</p></div><em>${impact}</em></div>
        `,
      )
      .join("");
    this.root.querySelector("[data-insight-action-count]").textContent =
      `${actions.length} prioritas`;
  }

  renderWidgets() {
    for (const widget of this.root.querySelectorAll("[data-insight-widget]")) {
      widget.hidden = !this.visibleWidgets.has(widget.dataset.insightWidget);
    }
  }
}

const insightDemoMount = document.getElementById("insightDemo");
if (insightDemoMount) {
  new ConversionInsightDemo(insightDemoMount);
}

class AsciiIndonesiaBackground {
  constructor(container) {
    this.el = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.cellW = 10;
    this.cellH = 16;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.time = 0;
    this.mx = -9999;
    this.my = -9999;
    this.chars = " ..,,,---===+++***###@@@";
    this.bgChars = ".:-+|/\\01";
    this.islands = [
      [[2, 3], [5, 9], [8, 17], [11, 26], [14, 34], [18, 42], [22, 50], [26, 56], [29, 61], [31, 65], [29, 68], [26, 64], [22, 56], [18, 47], [14, 37], [10, 27], [6, 16], [3, 8]],
      [[32, 72], [37, 73], [44, 75], [51, 76], [57, 75], [61, 73], [59, 79], [53, 81], [46, 82], [39, 81], [33, 78]],
      [[33, 12], [40, 7], [49, 5], [57, 7], [63, 14], [67, 24], [69, 35], [68, 45], [64, 52], [57, 54], [49, 50], [43, 42], [38, 32], [35, 22]],
      [[58, 16], [60, 22], [62, 30], [64, 38], [63, 46], [61, 52], [59, 58], [57, 64], [61, 58], [65, 50], [67, 42], [67, 34], [65, 26], [61, 19]],
      [[79, 20], [85, 14], [91, 12], [97, 16], [100, 25], [100, 37], [97, 47], [93, 54], [87, 56], [81, 50], [78, 39], [77, 28]],
      [[61, 80], [65, 78], [67, 82], [63, 86]],
      [[67, 80], [71, 78], [73, 82], [69, 86]],
      [[73, 80], [79, 78], [85, 80], [79, 84]],
      [[85, 82], [91, 80], [96, 82], [91, 87]],
      [[89, 88], [95, 86], [100, 88], [96, 94]],
      [[28, 44], [32, 40], [34, 46], [30, 50]],
      [[35, 48], [39, 44], [41, 50], [37, 54]],
      [[70, 20], [72, 16], [74, 22], [74, 32], [72, 38], [70, 28]],
      [[74, 46], [78, 42], [82, 46], [78, 52]],
      [[70, 38], [74, 34], [76, 40], [72, 44]],
    ];

    this.el.appendChild(this.canvas);
    this.resize();
    this.bind();
    this.loop();
  }

  bind() {
    const move = (event) => {
      const point = event.touches ? event.touches[0] : event;
      const rect = this.canvas.getBoundingClientRect();
      this.mx = point.clientX - rect.left;
      this.my = point.clientY - rect.top;
    };
    const leave = () => {
      this.mx = -9999;
      this.my = -9999;
    };
    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("mousemove", move);
    this.canvas.addEventListener("touchmove", move, { passive: true });
    this.canvas.addEventListener("mouseleave", leave);
    this.canvas.addEventListener("touchend", leave);
  }

  resize() {
    const rect = this.el.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.cols = Math.floor(this.w / this.cellW);
    this.rows = Math.floor(this.h / this.cellH);
    this.buildMask();
  }

  buildMask() {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = this.cols;
    maskCanvas.height = this.rows;
    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.cols, this.rows);
    ctx.fillStyle = "#fff";
    for (const poly of this.islands) {
      ctx.beginPath();
      for (let i = 0; i < poly.length; i += 1) {
        const x = (poly[i][0] / 100) * this.cols;
        const y = (poly[i][1] / 100) * this.rows;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    const img = ctx.getImageData(0, 0, this.cols, this.rows);
    this.mask = new Float32Array(this.cols * this.rows);
    for (let i = 0; i < this.mask.length; i += 1) {
      this.mask[i] = img.data[i * 4] / 255;
    }
  }

  hash(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  noise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = this.hash(ix, iy);
    const b = this.hash(ix + 1, iy);
    const c = this.hash(ix, iy + 1);
    const d = this.hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  fbm(x, y) {
    return this.noise(x, y) * 0.6 + this.noise(x * 2.1, y * 2.1 + 3) * 0.25 + this.noise(x * 4.3 + 7, y * 4.3) * 0.15;
  }

  render() {
    const { ctx, w, h, cols, rows, cellW, cellH, dpr } = this;
    const offX = (w - cols * cellW) / 2;
    const offY = (h - rows * cellH) / 2;
    const spotR2 = 140 * 140;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${cellH - 3}px "SFMono-Regular", Consolas, "Liberation Mono", monospace`;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const px = offX + c * cellW + cellW / 2;
        const py = offY + r * cellH + cellH / 2;
        const m = this.mask[r * cols + c] || 0;
        const n = this.fbm(c * 0.12 + this.time * 0.25, r * 0.12 + this.time * 0.15);
        const routeLine = r % 7 === 0 || c % 19 === 0 || Math.abs(c * 0.62 + this.time * 7 - r) < 0.35;
        const dx = px - this.mx;
        const dy = py - this.my;
        const spot = Math.exp(-(dx * dx + dy * dy) / (2 * spotR2));
        const charSet = m > 0.01 ? this.chars : this.bgChars;
        const index = Math.min(charSet.length - 1, Math.max(0, Math.floor(n * (charSet.length - 1))));
        let alpha = 0.012 + n * 0.018;

        if (m > 0.5) alpha = 0.34 + n * 0.34 + spot * 0.32;
        else if (m > 0.01) alpha = 0.1 + n * 0.16 + spot * 0.18;
        else if (routeLine) alpha = 0.045 + n * 0.035 + spot * 0.08;

        if (alpha < 0.01) continue;

        if (m > 0.5) ctx.fillStyle = `rgba(8,17,31,${Math.min(0.8, alpha)})`;
        else if (m > 0.01) ctx.fillStyle = `rgba(18,103,245,${Math.min(0.36, alpha)})`;
        else {
          const redPulse = routeLine && (c + r + Math.floor(this.time * 12)) % 11 === 0;
          ctx.fillStyle = redPulse ? `rgba(255,77,85,${Math.min(0.18, alpha * 1.8)})` : `rgba(18,103,245,${Math.min(0.12, alpha)})`;
        }

        ctx.fillText(charSet[index], px, py);
      }
    }
  }

  loop() {
    this.time += 0.016;
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}

const asciiIndonesiaMount = document.getElementById("asciiIndonesiaBg");
if (asciiIndonesiaMount) {
  new AsciiIndonesiaBackground(asciiIndonesiaMount);
}

/**
 * Deep-link demo dari halaman detail fitur.
 * Contoh: index.html?demo=omni&from=instagram-api#omniDemo akan membuka modal omnichannel
 * yang sama seperti tombol pada kartu Solusi, termasuk tutorial pertamanya.
 * Hash lama (#omniDemo, #crmDemo, dst.) tetap didukung.
 */
(function openRequestedSharedDemo() {
  const demos = {
    inventory: { hash: "inventoryDemo", selector: "[data-open-inventory-demo]" },
    omni: { hash: "omniDemo", selector: "[data-open-omni-demo]" },
    crm: { hash: "crmDemo", selector: "[data-open-crm-demo]" },
    social: { hash: "socialDemo", selector: "[data-open-social-demo]" },
    dashboard: { hash: "dashboardDemo", selector: "[data-open-dashboard-demo]" },
    insight: { hash: "insightDemo", selector: "[data-open-insight-demo]" },
    falcon: { hash: "falconDemo", selector: "[data-open-falcon-demo]" },
    whatsapp: { hash: "capabilityDemo", selector: "[data-open-whatsapp-demo]" },
    automation: { hash: "capabilityDemo", selector: "[data-open-automation-demo]" },
  };
  const params = new URLSearchParams(window.location.search);
  const requestedByQuery = params.get("demo");
  const requestedByHash = Object.entries(demos).find(
    ([, config]) => window.location.hash === `#${config.hash}`,
  )?.[0];
  const requestedDemo = demos[requestedByQuery] ? requestedByQuery : requestedByHash;
  if (!requestedDemo) return;

  const opener = document.querySelector(demos[requestedDemo].selector);
  if (!(opener instanceof HTMLElement)) return;

  const requestedFrom = params.get("from") || "";
  let context = requestedFrom;
  if (requestedDemo === "omni") {
    context = /customer|service|ticket|sla|scorecard/i.test(requestedFrom)
      ? "customer-support"
      : /call-center/i.test(requestedFrom)
        ? "call-center"
        : "omnichannel";
  } else if (requestedDemo === "social") {
    context = /broadcast|blast|bulk|campaign/i.test(requestedFrom) ? "broadcast" : "social";
  }
  if (context) opener.dataset.demoContext = context;

  window.requestAnimationFrame(() => opener.click());
})();
