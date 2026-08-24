import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const waNumber = "6281999197186";
const displayNumber = "+62 819-9919-7186";

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

test("tombol Hitung Paket Saya mengirim WhatsApp ke nomor sales dengan konteks harga", () => {
  const html = read("harga.html");
  const match = html.match(/Hitung Paket Saya[\s\S]{0,40}<\/a>/);
  assert.ok(match, "tombol Hitung Paket Saya harus ada");
  const block = html.slice(Math.max(0, html.lastIndexOf("<a", match.index)), match.index + match[0].length);
  assert.match(block, new RegExp(`wa\\.me/${waNumber}`));
  assert.match(block, /data-wa/);
  assert.match(block, /data-wa-text="Halo tim MOTOVAX, saya ingin konsultasi harga paket Motovax/);
  assert.doesNotMatch(block, /hubungi-kami\.html/);
});

test("halaman harga menjelaskan Core wajib dan menampilkan nominal katalog", () => {
  const html = read("harga.html");
  assert.match(html, /Fondasi setiap paket/);
  assert.match(html, /Wajib di setiap paket/);
  assert.match(html, /Core Platform <span>Integrasi Agentic AI<\/span>/);
  assert.match(html, /Rp1,5 juta/);
  assert.match(html, /Rp2 juta/);
  assert.match(html, /Rp1 juta/);
  assert.doesNotMatch(html, /Hubungi Kami<!-- Rp/);
});

test("setiap modul harga memiliki CTA WhatsApp dengan konteks modul", () => {
  const html = read("harga.html");
  const pricing = html.slice(html.indexOf('<div class="price-grid">'), html.indexOf('<div class="api-note">'));
  assert.equal((pricing.match(/class="price-card/g) || []).length, 5);
  assert.equal((pricing.match(/class="card-cta"/g) || []).length, 5);
  assert.equal((pricing.match(/data-wa-text=/g) || []).length, 5);
});

test("footer Hubungi Kami di harga.html memakai nomor WhatsApp sales", () => {
  const html = read("harga.html");
  const footer = html.slice(html.indexOf("<footer"));
  assert.match(footer, new RegExp(`<h3>Hubungi Kami</h3>[\\s\\S]*${displayNumber.replace("+", "\\+")}`));
  assert.match(footer, new RegExp(`wa\\.me/${waNumber}`));
  assert.doesNotMatch(footer, /\+62 21 1234 5678/);
});

test("halaman Hubungi Kami menampilkan nomor WhatsApp sales", () => {
  const html = read("hubungi-kami.html");
  assert.match(html, new RegExp(displayNumber.replace("+", "\\+")));
  assert.match(html, new RegExp(`wa\\.me/${waNumber}`));
});
