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

test("tombol Konsultasi Harga mengirim WhatsApp ke nomor sales dengan greeting", () => {
  const html = read("harga.html");
  const match = html.match(/Konsultasi Harga[\s\S]{0,40}<\/a>/);
  assert.ok(match, "tombol Konsultasi Harga harus ada");
  const block = html.slice(Math.max(0, html.lastIndexOf("<a", match.index)), match.index + match[0].length);
  assert.match(block, new RegExp(`wa\\.me/${waNumber}`));
  assert.match(block, /data-wa/);
  assert.match(block, /data-wa-text="Halo tim MOTOVAX, saya ingin konsultasi harga paket Motovax/);
  assert.doesNotMatch(block, /hubungi-kami\.html/);
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
