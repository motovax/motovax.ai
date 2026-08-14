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
    if (entry.isDirectory()) {
      directories.push(...libraryDirectories(path.join(root, entry.name)));
    }
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
      oauthSuccessUrl: "http://127.0.0.1/onboarding.html",
      googleClientId: "",
      googleClientSecret: "",
      googleRedirectUri: "http://127.0.0.1/api/auth/google/callback",
      sessionSecret: "",
      databaseUrl: "",
      trustProxy: false,
    },
  });
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
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
    args: useAlpineChromium
      ? ["--disable-gpu", "--disable-gpu-compositing"]
      : [],
    env: useAlpineChromium
      ? {
          ...process.env,
          LD_LIBRARY_PATH: libraryPath,
          FONTCONFIG_PATH: path.join(chromiumRoot, "etc/fonts"),
          FONTCONFIG_FILE: path.join(chromiumRoot, "etc/fonts/fonts.conf"),
          FONTCONFIG_SYSROOT: chromiumRoot,
          XDG_DATA_DIRS: path.join(chromiumRoot, "usr/share"),
        }
      : process.env,
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

const slides = [
  { index: 0, id: "pelanggan", heading: "Pelanggan menanyakan produk" },
  { index: 1, id: "sales", heading: "Sales membutuhkan data produk" },
  { index: 2, id: "management", heading: "Management membutuhkan laporan finansial" },
  { index: 3, id: "admin", heading: "Admin input data via WhatsApp" },
  { index: 4, id: "layanan", heading: "Tim layanan mengalihkan percakapan" },
];

async function measure(page) {
  return page.evaluate(() => {
    const slider = document.querySelector("[data-flow-slider]");
    const viewport = document.querySelector("[data-flow-viewport]");
    const e2e = document.querySelector(".e2e-flow");
    const e2eStages = [...document.querySelectorAll(".e2e-stage")];
    const active = document.querySelector(".native-flow.is-active");
    const dots = [...document.querySelectorAll("[data-flow-dot]")];
    const activeDot = document.querySelector("[data-flow-dot].is-active");
    const trigger = active?.querySelector(".native-node.trigger b");
    const triggerCard = active?.querySelector(".native-node.trigger");
    const branch = active?.querySelector(".branch .native-node");
    const visibleSlides = [...document.querySelectorAll("[data-flow-slide]")]
      .filter((el) => !el.hidden && el.getBoundingClientRect().height > 0)
      .map((el) => el.getAttribute("data-flow-slide"));
    return {
      slide: active?.getAttribute("data-flow-slide"),
      heading: active?.querySelector(".native-flow-pov b")?.textContent?.trim(),
      trigger: trigger?.textContent?.trim(),
      activeDot: activeDot?.getAttribute("data-flow-dot"),
      dots: dots.length,
      visibleSlides,
      minDot: Math.min(...dots.map((dot) => Math.min(dot.getBoundingClientRect().width, dot.getBoundingClientRect().height))),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      viewportWidth: viewport?.getBoundingClientRect().width || 0,
      sliderWidth: slider?.getBoundingClientRect().width || 0,
      triggerWidth: triggerCard?.getBoundingClientRect().width || 0,
      branchWidth: branch?.getBoundingClientRect().width || 0,
      e2eWidth: e2e?.getBoundingClientRect().width || 0,
      e2eStageCount: e2eStages.length,
      e2eMinStageWidth: Math.min(...e2eStages.map((el) => el.getBoundingClientRect().width)),
      e2eMinStageHeight: Math.min(...e2eStages.map((el) => el.getBoundingClientRect().height)),
    };
  });
}

for (const viewport of viewports) {
  test(`slider skema POV berubah pada ${viewport.name}`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
    await page.locator("[data-flow-slider]").scrollIntoViewIfNeeded();

    const first = await measure(page);
    const sectionCopy = await page.evaluate(() => ({
      title: document.querySelector("#cara-kerja h2")?.textContent?.replace(/\s+/g, " ").trim(),
      eyebrow: document.querySelector("#cara-kerja .section-label")?.textContent?.trim() || "",
      stages: [...document.querySelectorAll(".e2e-stage-head h3")].map((el) => el.textContent.trim()),
      labels: [...document.querySelectorAll(".e2e-stage-head small")].map((el) => el.textContent.trim()),
    }));
    assert.match(sectionCopy.title || "", /Dari minat sampai closing/i);
    assert.equal(sectionCopy.eyebrow, "", "label ALUR END-TO-END harus dihapus");
    assert.deepEqual(sectionCopy.stages, ["Attract", "Convert", "Retain & Close"]);
    assert.deepEqual(sectionCopy.labels, ["SORA AI", "JASMINE AI", "AUTOPILOT CRM"]);
    assert.equal(first.slide, "pelanggan");
    assert.equal(first.heading, "Pelanggan menanyakan produk");
    assert.equal(first.dots, 5);
    assert.deepEqual(first.visibleSlides, ["pelanggan"]);
    assert.ok(first.minDot >= 44, `target sentuh dots terlalu kecil di ${viewport.name}: ${first.minDot}`);
    assert.equal(first.overflow, false, `halaman overflow horizontal di ${viewport.name}`);
    assert.ok(first.viewportWidth > 200);
    assert.equal(first.e2eStageCount, 3);
    assert.ok(first.e2eWidth > 280, `diagram e2e tidak terlihat di ${viewport.name}`);
    assert.ok(first.e2eMinStageHeight > 180, `kartu tahap e2e terlalu pendek di ${viewport.name}: ${first.e2eMinStageHeight}`);
    if (viewport.width < 1100) {
      assert.ok(first.e2eMinStageWidth >= 280, `kartu tahap e2e terlalu sempit di ${viewport.name}: ${first.e2eMinStageWidth}`);
    }
    if (viewport.width >= 1440) {
      assert.ok(first.triggerWidth >= 360, `kartu pemicu terlalu sempit di desktop: ${first.triggerWidth}`);
      assert.ok(first.branchWidth >= 360, `kartu cabang terlalu sempit di desktop: ${first.branchWidth}`);
    }
    await page.screenshot({ path: `/tmp/motovax-flow-slider-${viewport.name}-start.png`, fullPage: false });

    for (const item of slides) {
      await page.click(`[data-flow-dot="${item.index}"]`);
      await page.waitForFunction(
        (id) => document.querySelector(".native-flow.is-active")?.getAttribute("data-flow-slide") === id,
        item.id,
      );
      const state = await measure(page);
      assert.equal(state.slide, item.id);
      assert.equal(state.heading, item.heading);
      assert.equal(state.activeDot, String(item.index));
      assert.deepEqual(state.visibleSlides, [item.id]);
      assert.match(state.trigger || "", new RegExp(item.id === "layanan" ? "takeover|alih" : item.heading.split(" ")[0], "i"));
      assert.equal(state.overflow, false);
    }

    await page.locator("[data-flow-viewport]").focus();
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(
      () => document.querySelector(".native-flow.is-active")?.getAttribute("data-flow-slide") === "admin",
    );
    const afterKey = await measure(page);
    assert.equal(afterKey.slide, "admin");
    assert.deepEqual(afterKey.visibleSlides, ["admin"]);

    await page.screenshot({ path: `/tmp/motovax-flow-slider-${viewport.name}.png`, fullPage: false });
    await context.close();
  });
}

test("geser kiri memindahkan slide aktif", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, (route) => route.abort());
  await page.goto(`${baseUrl}/index.html`, { waitUntil: "load" });
  await page.locator("[data-flow-slider]").scrollIntoViewIfNeeded();

  await page.evaluate(() => {
    const viewport = document.querySelector("[data-flow-viewport]");
    if (!(viewport instanceof HTMLElement)) return;
    const rect = viewport.getBoundingClientRect();
    const startX = rect.left + rect.width * 0.82;
    const endX = rect.left + rect.width * 0.18;
    const y = rect.top + Math.min(120, rect.height / 3);
    const fire = (type, clientX) => {
      viewport.dispatchEvent(new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "touch",
        clientX,
        clientY: y,
      }));
    };
    fire("pointerdown", startX);
    fire("pointermove", startX - 50);
    fire("pointerup", endX);
  });
  await page.waitForFunction(
    () => document.querySelector(".native-flow.is-active")?.getAttribute("data-flow-slide") === "sales",
  );
  const state = await measure(page);
  assert.equal(state.slide, "sales");
  assert.equal(state.heading, "Sales membutuhkan data produk");
  await context.close();
});
