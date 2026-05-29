// Idempotent provisioning of the Highgrove demo tenant (KRI-95) for an existing
// dev DB. `onInit` only seeds an empty database, so after adding the Highgrove
// tenant + product fields this script back-fills everything without wiping
// anything: find-or-create tenant / site / brand-config and upsert the 12
// products by (tenant + name). Create/update only — never delete.
// Booting getPayload also pushes any new columns (dev adapter, push mode).
//
//   pnpm --filter @grove/web seed:highgrove
//
// Catalogue mirrors packages/payload/src/seed.ts (kept in sync by hand).

import { readFileSync } from "fs";

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

const terpenesFor = {
  Indica: "Myrcene · Linalool · Caryophyllene",
  Sativa: "Limonene · Terpinolene · Pinene",
  Hybrid: "Caryophyllene · Limonene · Humulene",
};

const CATALOGUE = [
  { slug: "sour-grapes", name: "Sour Grapes", subtitle: "Indica · live resin vape · 1g", price: 44, tag: "Best seller", category: "Vapes", effect: "chill", strainType: "Indica", thcLabel: "82% THCa", imageId: "1603909223429-69bb7101f420", lot: "0421-A" },
  { slug: "super-boof", name: "Super Boof", subtitle: "Hybrid · pre-roll 5pk · 0.5g", price: 38, tag: "", category: "Pre-rolls", effect: "euphoric", strainType: "Hybrid", thcLabel: "27% THCa", imageId: "1620912189858-7c6e6e6e9e1a", lot: "0419-B" },
  { slug: "guava-cake", name: "Guava Cake", subtitle: "Indica · 3.5g flower", price: 49, tag: "", category: "Flower", effect: "chill", strainType: "Indica", thcLabel: "29% THCa", imageId: "1603909223429-69bb7101f420", lot: "0418-A" },
  { slug: "papaya", name: "Dulce de Papaya", subtitle: "Sativa · 7g flower", price: 89, tag: "Limited", category: "Flower", effect: "creative", strainType: "Sativa", thcLabel: "26% THCa", imageId: "1604908554027-9d12c4be4cf7", lot: "0418-B" },
  { slug: "maui-fruit", name: "Maui Fruit", subtitle: "Sativa · live resin cart · 1g", price: 49, tag: "", category: "Vapes", effect: "euphoric", strainType: "Sativa", thcLabel: "84% THCa", imageId: "1605283176567-0c98c0f57f50", lot: "0417-A" },
  { slug: "jelly-donuts", name: "Jelly Donuts", subtitle: "Hybrid · live rosin · 1g", price: 65, tag: "Solventless", category: "Concentrates", effect: "euphoric", strainType: "Hybrid", thcLabel: "78% THCa", imageId: "1603909223429-69bb7101f420", lot: "0416-A" },
  { slug: "tropaya", name: "Tropaya", subtitle: "Sativa · pre-roll 2pk · 1g", price: 24, tag: "", category: "Pre-rolls", effect: "creative", strainType: "Sativa", thcLabel: "28% THCa", imageId: "1620912189858-7c6e6e6e9e1a", lot: "0415-A" },
  { slug: "sour-diesel", name: "Sour Diesel", subtitle: "Sativa · 3.5g flower", price: 45, tag: "", category: "Flower", effect: "focus", strainType: "Sativa", thcLabel: "31% THCa", imageId: "1604908554027-9d12c4be4cf7", lot: "0414-A" },
  { slug: "zlushiez", name: "Zlushiez Smalls", subtitle: "Hybrid · 14g · smalls", price: 89, tag: "Value", category: "Flower", effect: "chill", strainType: "Hybrid", thcLabel: "24% THCa", imageId: "1603909223429-69bb7101f420", lot: "0413-A" },
  { slug: "cool-cocol", name: "Cool Cocol Push", subtitle: "Indica · rosin gummies · 100mg", price: 28, tag: "", category: "Edibles", effect: "sleep", strainType: "Indica", thcLabel: "10mg/pc", imageId: "1582719201953-1419caa3b91b", lot: "0412-A" },
  { slug: "papaya-bomb", name: "Papaya Bomb", subtitle: "Hybrid · distillate vape · 1g", price: 39, tag: "", category: "Vapes", effect: "chill", strainType: "Hybrid", thcLabel: "88% THC", imageId: "1605283176567-0c98c0f57f50", lot: "0411-A" },
  { slug: "hudson-haze", name: "Hudson Haze", subtitle: "Sativa · 3.5g · house strain", price: 54, tag: "House", category: "Flower", effect: "focus", strainType: "Sativa", thcLabel: "30% THCa", imageId: "1604908554027-9d12c4be4cf7", lot: "0410-A" },
];

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

// 5. Products (upsert by tenant + name)
let created = 0;
let updated = 0;
for (const p of CATALOGUE) {
  const data = {
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    status: "published",
    tenant: tenant.id,
    category: p.category,
    effect: p.effect,
    strainType: p.strainType,
    thcLabel: p.thcLabel,
    imageId: p.imageId,
    lot: p.lot,
    tag: p.tag || undefined,
    terpenes: terpenesFor[p.strainType],
    description: `${p.name} — ${p.subtitle}. Single-farm THCa, hand-trimmed and slow-cured in Columbia County, NY. Lot ${p.lot}, third-party tested.`,
  };

  const existing = await findOne("products", {
    and: [{ tenant: { equals: tenant.id } }, { name: { equals: p.name } }],
  });

  if (existing) {
    await payload.update({ collection: "products", id: existing.id, data, overrideAccess: true });
    updated++;
  } else {
    await payload.create({ collection: "products", data, overrideAccess: true });
    created++;
  }
}

console.log(`Highgrove catalogue reseeded: ${created} created, ${updated} updated.`);
process.exit(0);
