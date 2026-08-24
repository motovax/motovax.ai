import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const featureData = readFileSync(new URL("../fitur/features-data.js", import.meta.url), "utf8");
const featurePage = readFileSync(new URL("../fitur/feature-page.js", import.meta.url), "utf8");
const dedicatedPage = readFileSync(new URL("../fitur/ai-500-credit.html", import.meta.url), "utf8");

test("AI 500 Credit memakai state Billing yang membuktikan saldo per paket", () => {
  const mappings = [
    ["ai-credit-balance-public.png", "Billing · Saldo Kredit AI"],
    ["ai-credit-packages-public.png", "Billing · Kredit per Suite"],
    ["ai-credit-exhausted-public.png", "Billing · Batas Kredit AI"],
  ];

  const aiCreditMapping = featurePage.match(
    /slug === "ai-500-credit"[\s\S]*?slug === "falcon-ai-search"/,
  )?.[0] || "";

  for (const [file, label] of mappings) {
    assert.ok(aiCreditMapping.includes(`${file}?v=20260824-ai-credit-1`));
    assert.ok(aiCreditMapping.includes(label));
  }

  assert.doesNotMatch(
    aiCreditMapping,
    /omnichannel-faneling-public|core-platform-native-ai-tools-public|core-platform-role-permission-public/,
  );
  assert.match(featureData, /Satu aksi AI yang berhasil memakai satu kredit/);
  assert.match(featureData, /aksi gagal dan proses latar tidak mengurangi saldo/);
  assert.match(
    featurePage,
    /id === "ai-500-credit"[\s\S]*?ai-credit-balance-public\.png\?v=20260824-ai-credit-1/,
  );
  assert.match(dedicatedPage, /feature-page\.js\?v=ai-500-credit-20260824-v1/);
});
