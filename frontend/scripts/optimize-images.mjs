#!/usr/bin/env node
/**
 * Recompresión agresiva de imágenes en /public/images.
 * - Re-encodea webp con quality 78 + effort 6
 * - Limita ancho máximo a 1920px (no afecta visual en pantallas normales)
 * - Solo reemplaza el archivo si la versión nueva pesa menos
 * Idempotente: ejecutar varias veces no degrada más allá de la primera pasada.
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public/images');
const MAX_WIDTH = 1920;
const QUALITY = 78;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalBefore = 0, totalAfter = 0, processed = 0, skipped = 0;

for await (const file of walk(ROOT)) {
  if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
  const before = (await stat(file)).size;
  totalBefore += before;
  const tmp = file + '.opt.webp';
  try {
    const img = sharp(file, { failOn: 'none' });
    const meta = await img.metadata();
    const pipeline = img.rotate();
    if (meta.width && meta.width > MAX_WIDTH) pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(tmp);
    const after = (await stat(tmp)).size;
    if (after < before * 0.95) {
      const finalPath = file.replace(/\.(jpe?g|png)$/i, '.webp');
      if (finalPath !== file) await unlink(file);
      await rename(tmp, finalPath);
      totalAfter += after;
      processed++;
      console.log(`✓ ${path.relative(ROOT, file)}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`);
    } else {
      await unlink(tmp);
      totalAfter += before;
      skipped++;
    }
  } catch (e) {
    console.warn(`✗ ${file}: ${e.message}`);
    try { await unlink(tmp); } catch {}
    totalAfter += before;
  }
}

const pct = totalBefore ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : '0';
console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (-${pct}%)`);
console.log(`Procesadas: ${processed}  Sin cambio: ${skipped}`);
