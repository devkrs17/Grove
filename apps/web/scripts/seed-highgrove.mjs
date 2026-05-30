// Idempotent provisioning of the Highgrove tenant for an existing dev DB:
// find-or-create tenant / site / brand-config, grant the admin access, and
// remove the retired design-kit demo catalogue (the original 12 placeholder
// THCa products + their generated images) so the storefront shows only the real
// brand packs. Booting getPayload also pushes any new columns (dev adapter).
//
//   pnpm --filter @grove/web seed:highgrove   # tenant setup + demo cleanup
//   pnpm --filter @grove/web import:packs      # populate the real products
//
// Products come from import:packs (Litt Edibles, 710 Nomad Rosin, Blinkers
// Flip) — this script intentionally creates none.

import { readFileSync } from "fs";

// Slugs / media filenames of the retired design-kit demo, removed if present.
const LEGACY_DEMO_SLUGS = [
  "sour-grapes", "super-boof", "guava-cake", "papaya", "maui-fruit",
  "jelly-donuts", "tropaya", "sour-diesel", "zlushiez", "cool-cocol",
  "papaya-bomb", "hudson-haze",
];
const LEGACY_DEMO_MEDIA = ["sour-grapes.jpg", "super-boof.jpg"];

// Load .env (same approach as scripts/generate-types.mjs).
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  if (key && !process.env[key]) process.env[key] = rest.join("=");
}

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../src/payload.config.ts");
const config = await configPromise;

const payload = await getPayload({ config });

async function findOne(collection, where) {
  const { docs } = await payload.find({ collection, where, limit: 1, overrideAccess: true });
  return docs[0] ?? null;
}

// 1. Tenant
let tenant = await findOne("tenants", { slug: { equals: "highgrove" } });
if (!tenant) {
  tenant = await payload.create({
    collection: "tenants",
    data: { name: "Highgrove", slug: "highgrove", domain: "highgrove.grove.dev" },
    overrideAccess: true,
  });
  console.log("Created Highgrove tenant.");
}

// 2. Grant the seeded admin user access to the tenant (idempotent).
const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@grove.dev";
const admin = (await findOne("users", { email: { equals: adminEmail } })) ?? (await findOne("users", {}));
if (admin) {
  const current = (admin.tenants ?? []).map((t) => (typeof t.tenant === "object" ? t.tenant.id : t.tenant));
  if (!current.includes(tenant.id)) {
    await payload.update({
      collection: "users",
      id: admin.id,
      data: { tenants: [{ tenant: tenant.id }, ...(admin.tenants ?? [])] },
      overrideAccess: true,
    });
    console.log(`Granted ${admin.email} access to Highgrove (set as primary tenant).`);
  }
}

// 3. Site
let site = await findOne("sites", { slug: { equals: "highgrove" } });
if (!site) {
  site = await payload.create({
    collection: "sites",
    data: { name: "Highgrove", slug: "highgrove", domain: "highgrove.localhost", tenant: tenant.id },
    overrideAccess: true,
  });
  console.log("Created Highgrove site.");
}

// 4. Brand config
const brand = await findOne("brand-configs", { site: { equals: site.id } });
if (!brand) {
  await payload.create({
    collection: "brand-configs",
    data: { site: site.id, tenant: tenant.id, primaryColor: "#2d4a2b", secondaryColor: "#7a8c5c" },
    overrideAccess: true,
  });
  console.log("Created Highgrove brand config.");
}

// 5. Remove the retired demo catalogue (products first, then their media so the
// featuredImage foreign keys are already gone).
let removedProducts = 0;
for (const slug of LEGACY_DEMO_SLUGS) {
  const { docs } = await payload.find({
    collection: "products",
    where: { and: [{ tenant: { equals: tenant.id } }, { slug: { equals: slug } }] },
    limit: 100,
    overrideAccess: true,
  });
  for (const doc of docs) {
    await payload.delete({ collection: "products", id: doc.id, overrideAccess: true });
    removedProducts++;
  }
}
let removedMedia = 0;
for (const filename of LEGACY_DEMO_MEDIA) {
  const { docs } = await payload.find({
    collection: "media",
    where: { and: [{ tenant: { equals: tenant.id } }, { filename: { equals: filename } }] },
    limit: 100,
    overrideAccess: true,
  });
  for (const doc of docs) {
    await payload.delete({ collection: "media", id: doc.id, overrideAccess: true });
    removedMedia++;
  }
}
if (removedProducts || removedMedia) {
  console.log(`Removed retired demo data: ${removedProducts} products, ${removedMedia} media.`);
}

console.log("Highgrove tenant ready. Run `pnpm --filter @grove/web import:packs` to populate products.");
process.exit(0);
