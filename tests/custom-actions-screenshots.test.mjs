import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const featurePage = readFileSync(new URL("../fitur/feature-page.js", import.meta.url), "utf8");
const dedicatedPage = readFileSync(new URL("../fitur/custom-aksi-cepat.html", import.meta.url), "utf8");

test("Custom Aksi Cepat memakai state produk yang sesuai untuk fitur 01–03", () => {
  const mappings = [
    ["omnichannel-quick-inventory-public.png", "Aksi Cepat · Cek Inventori"],
    ["omnichannel-quick-credit-public.png", "Aksi Cepat · Simulasi Kredit"],
    ["omnichannel-quick-handoff-public.png", "Aksi Lanjutan · Handoff ke MR"],
  ];

  for (const [file, label] of mappings) {
    assert.match(featurePage, new RegExp(file.replaceAll(".", "\\.")));
    assert.ok(featurePage.includes(label));
    assert.ok(featurePage.includes(`${file}?v=20260824-quick-actions-1`));
  }

  assert.doesNotMatch(
    featurePage.match(/slug === "custom-aksi-cepat"[\s\S]*?slug === "auto-routing-faneling"/)?.[0] || "",
    /manajemen-kontak-customer-public|omnichannel-faneling-public/,
  );
  assert.match(dedicatedPage, /feature-page\.js\?v=custom-aksi-cepat-20260824-v1/);
});
