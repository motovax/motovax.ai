#!/usr/bin/env node
/**
 * Generate responsive WebP variants for product screenshots.
 * The original PNG remains available for the full-size image viewer.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const previewDir = path.join(scriptDir, "..", "assets", "feature-previews");
const widths = [720, 1200];

const files = (await fs.readdir(previewDir)).filter((file) => file.endsWith(".png")).sort();
let originalBytes = 0;
let generatedBytes = 0;

for (const file of files) {
  const input = path.join(previewDir, file);
  const stem = file.replace(/\.png$/i, "");
  const sourceStat = await fs.stat(input);
  originalBytes += sourceStat.size;

  for (const width of widths) {
    const output = path.join(previewDir, `${stem}-${width}.webp`);
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6, smartSubsample: false })
      .toFile(output);
    generatedBytes += (await fs.stat(output)).size;
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(`Generated ${files.length * widths.length} WebP variants from ${files.length} PNG files.`);
console.log(`Original PNG total: ${mb(originalBytes)}; responsive WebP total: ${mb(generatedBytes)}.`);
