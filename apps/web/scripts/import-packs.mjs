// Imports the committed brand packs (packages/payload/seed-assets/packs/) into
// the Highgrove tenant: uploads each product photo into Media and upserts the
// product with featuredImage set. Idempotent — find-or-create media by alt and
// upsert products by (tenant + name); create/update only, never delete.
//
//   pnpm --filter @grove/web import:packs
//
// Source packs are produced from the downloaded zips by scripts/prep-packs.mjs.

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env (same approach as scripts/seed-highgrove.mjs).
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  if (key && !process.env[key]) process.env[key] = rest.join("=");
}

const PACKS_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../packages/payload/seed-assets/packs",
);

// Per-pack mapping into the Products schema. `variantCol` (Flavor/Strain) feeds
// the storefront subtitle; `imageCol` is the CSV column holding the photo file.
const PACKS = [
  { slug: "litt-edibles", category: "Edibles", imageCol: "Image", variantCol: "Flavor" },
  { slug: "710-nomad-rosin", category: "Concentrates", imageCol: "Image", variantCol: "Strain" },
  { slug: "blinkers-flip", category: "Vapes", imageCol: "Photo", variantCol: null },
];

/** Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas/newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const nonEmpty = rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  const headers = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (cells[idx] ?? "").trim(); });
    return obj;
  });
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../src/payload.config.ts");
const payload = await getPayload({ config: await configPromise });

async function findOne(collection, where) {
  const { docs } = await payload.find({ collection, where, limit: 1, overrideAccess: true });
  return docs[0] ?? null;
}

const tenant = await findOne("tenants", { slug: { equals: "highgrove" } });
if (!tenant) {
  console.error("Highgrove tenant not found — run the Highgrove seed first.");
  process.exit(1);
}
const site = await findOne("sites", { slug: { equals: "highgrove" } });

let created = 0;
let updated = 0;
let photos = 0;

for (const pack of PACKS) {
  const dir = path.join(PACKS_ROOT, pack.slug);
  const csvPath = path.join(dir, "products.csv");
  if (!existsSync(csvPath)) {
    console.warn(`skip ${pack.slug}: ${csvPath} not found (run prep-packs.mjs)`);
    continue;
  }
  const rows = parseCsv(readFileSync(csvPath, "utf-8"));

  for (const row of rows) {
    const name = row.Title?.trim();
    const price = Number(row.Price);
    if (!name || Number.isNaN(price)) {
      console.warn(`skip row in ${pack.slug}: bad name/price (${row.Title})`);
      continue;
    }

    // Upload the photo into Media (idempotent by alt within the tenant).
    const photoFile = path.basename(row[pack.imageCol] ?? "").replace(/\.[^.]+$/, ".jpg");
    const photoPath = path.join(dir, "photos", photoFile);
    let media = await findOne("media", {
      and: [{ tenant: { equals: tenant.id } }, { alt: { equals: name } }],
    });
    if (!media && existsSync(photoPath)) {
      media = await payload.create({
        collection: "media",
        data: { alt: name, site: site?.id, tenant: tenant.id },
        filePath: photoPath,
        overrideAccess: true,
      });
      photos++;
    } else if (!existsSync(photoPath)) {
      console.warn(`no photo for ${name}: ${photoPath}`);
    }

    const data = {
      name,
      slug: slugify(name),
      price,
      status: "published",
      tenant: tenant.id,
      category: pack.category,
      subtitle: pack.variantCol ? row[pack.variantCol] || undefined : undefined,
      description: row.Description || undefined,
      featuredImage: media?.id,
    };

    const existing = await findOne("products", {
      and: [{ tenant: { equals: tenant.id } }, { name: { equals: name } }],
    });
    if (existing) {
      await payload.update({ collection: "products", id: existing.id, data, overrideAccess: true });
      updated++;
    } else {
      await payload.create({ collection: "products", data, overrideAccess: true });
      created++;
    }
  }
  console.log(`${pack.slug}: done`);
}

console.log(`Packs imported into Highgrove: ${created} created, ${updated} updated, ${photos} photos uploaded.`);
process.exit(0);
