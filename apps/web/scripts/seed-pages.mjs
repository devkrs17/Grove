// Seeds the Highgrove site's marketing/content pages into the Payload `pages`
// collection (MVP requirement: the marketing site renders pages from Payload).
// Idempotent: upsert by (site + slug). Slugs match the storefront footer links
// (slugify of the label) so Learn/Help resolve to these pages.
//
//   pnpm --filter @grove/web seed:pages

import { readFileSync } from "fs";

// Load .env (same approach as scripts/seed-highgrove.mjs).
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  if (key && !process.env[key]) process.env[key] = rest.join("=");
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Minimal lexical richText: a list of paragraphs.
function textNode(text) {
  return { type: "text", detail: 0, format: 0, mode: "normal", style: "", text, version: 1 };
}
function lexical(paragraphs) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        children: [textNode(text)],
      })),
    },
  };
}

// Titles mirror the storefront footer (data.ts FOOT.learn / FOOT.help).
const PAGES = [
  { title: "About THCa", body: [
    "Highgrove is small-batch THCa grown on a single farm in Columbia County, New York. Every batch is hand-trimmed and slow-cured before it ships.",
    "THCa is the raw, non-intoxicating acid form of THC found in the hemp plant. It converts to THC when heated, so treat it accordingly.",
  ] },
  { title: "Lab reports", body: [
    "Every batch is third-party lab-tested and traceable to its lot number. Certificates of analysis (COAs) cover potency and contaminants.",
    "Ask for the COA on any lot — it is printed on the jar and available on request.",
  ] },
  { title: "Journal", body: [
    "Notes from the farm: harvest updates, new drops, and the occasional deep dive on terpenes and curing.",
  ] },
  { title: "Wholesale", body: [
    "Interested in carrying Highgrove? We work with a small number of retail partners. Reach out and we will send current availability and pricing.",
  ] },
  { title: "Shipping & states", body: [
    "We ship discreetly to most of the U.S. We currently do not ship to ID, OR, AR, KS, MS, RI, or VT.",
    "Orders over $99 ship free. Checkout is age-gated at 21+.",
  ] },
  { title: "Returns", body: [
    "Because these are consumable hemp products, we cannot accept returns once a seal is broken. If something arrives damaged or incorrect, contact us within 14 days and we will make it right.",
  ] },
  { title: "Age verification", body: [
    "You must be 21 or older to shop Highgrove. Age is verified at checkout. Keep all products away from children and pets.",
  ] },
  { title: "Contact", body: [
    "By appointment · 2231 Route 23B, Hudson, NY.",
    "Questions about an order or a lot report? Email hello@highgrove.example and we will get back to you.",
  ] },
];

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../src/payload.config.ts");
const payload = await getPayload({ config: await configPromise });

async function findOne(collection, where) {
  const { docs } = await payload.find({ collection, where, limit: 1, overrideAccess: true, draft: true });
  return docs[0] ?? null;
}

const tenant = await findOne("tenants", { slug: { equals: "highgrove" } });
const site = await findOne("sites", { slug: { equals: "highgrove" } });
if (!site || !tenant) {
  console.error("Highgrove site/tenant not found — run seed:highgrove first.");
  process.exit(1);
}

let created = 0;
let updated = 0;
for (const p of PAGES) {
  const slug = slugify(p.title);
  const data = {
    title: p.title,
    slug,
    site: site.id,
    tenant: tenant.id,
    status: "published",
    _status: "published",
    content: lexical(p.body),
  };
  const existing = await findOne("pages", {
    and: [{ site: { equals: site.id } }, { slug: { equals: slug } }],
  });
  if (existing) {
    await payload.update({ collection: "pages", id: existing.id, data, overrideAccess: true });
    updated++;
  } else {
    await payload.create({ collection: "pages", data, overrideAccess: true });
    created++;
  }
}

console.log(`Highgrove pages seeded: ${created} created, ${updated} updated.`);
process.exit(0);
