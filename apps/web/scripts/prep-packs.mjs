// One-time prep: optimize the downloaded brand-pack photos into web-sized JPEGs
// and stage them (with their CSV) under packages/payload/seed-assets/packs/, so
// import-packs.mjs has a committed, reproducible source. Run from @grove/web
// (sharp is a dependency):
//
//   node scripts/prep-packs.mjs <dir-with-extracted-zips>
//
// The argument defaults to ../../.tmp-imports (where the three product zips were
// extracted). Re-run if the source packs change, then commit seed-assets/packs/.

import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";
import { readdirSync, mkdirSync, copyFileSync, rmSync, existsSync } from "fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(here, process.argv[2] ?? "../../.tmp-imports");
const outRoot = path.resolve(here, "../../../packages/payload/seed-assets/packs");

// Source layout of each extracted zip → normalized output slug.
const PACKS = [
  { slug: "litt-edibles", dir: "litt_edibles_products_with_photos", csv: "litt_edibles_products_with_photos.csv", photos: "photos" },
  { slug: "710-nomad-rosin", dir: "710_nomad_rosin_products_with_photos", csv: "710_nomad_rosin_products_with_photos.csv", photos: "photos" },
  { slug: "blinkers-flip", dir: "blinkers_flip_products_with_photos/blinkers_flip_csv_with_photos", csv: "blinkers_flip_products_with_photos.csv", photos: "images" },
];

for (const pack of PACKS) {
  const srcDir = path.join(srcRoot, pack.dir);
  if (!existsSync(srcDir)) {
    console.warn(`skip ${pack.slug}: ${srcDir} not found`);
    continue;
  }
  const outDir = path.join(outRoot, pack.slug);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(path.join(outDir, "photos"), { recursive: true });

  copyFileSync(path.join(srcDir, pack.csv), path.join(outDir, "products.csv"));

  const srcPhotos = path.join(srcDir, pack.photos);
  let n = 0;
  for (const file of readdirSync(srcPhotos).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))) {
    const base = file.replace(/\.[^.]+$/, "");
    await sharp(path.join(srcPhotos, file))
      .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(outDir, "photos", `${base}.jpg`));
    n++;
  }
  console.log(`${pack.slug}: optimized ${n} photos`);
}
