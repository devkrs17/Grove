import type { Payload } from "payload";

// Seeds a FRESH database with the complete Blinkers storefront. Runs from
// payload.config.ts `onInit` (when no users exist) on local boot AND on a fresh
// Vercel/Neon deploy. Serverless-safe: embeds all data as constants (no fs
// reads) and uploads no media — product/hero/story images are static files
// served from apps/web/public/packs (referenced by URL, not the Media library).

/** URL-slugify a name, matching the storefront's product href derivation. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Lexical rich text ------------------------------------------------------
// Minimal lexical richText document: a list of paragraphs. Mirrors the helper
// the old seed-pages.mjs / BlinkersHome used so page + story copy renders.

function textNode(text: string) {
  return { type: "text", detail: 0, format: 0, mode: "normal", style: "", text, version: 1 };
}

function lexical(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
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

// --- Products ---------------------------------------------------------------
// The 21 real brand-pack products (formerly imported from seed-assets CSVs).
// `image` is the basename of a static photo in apps/web/public/packs; seeded
// onto `imageId` as "/packs/<image>.jpg" (the storefront's imgUrl() passes
// "/"-prefixed URLs through and mapProduct falls back to imageId).

type SeedProduct = {
  name: string;
  category: "Edibles" | "Concentrates" | "Vapes";
  price: number;
  subtitle?: string;
  description: string;
  image: string;
};

const LITT_DESCRIPTION =
  "Litt 1000mg edibles per package · 10 pieces per package · Made with pure THCA oil";
const NOMAD_DESCRIPTION = "2 grams per jar · 100% rosin";
const BLINKERS_DESCRIPTION = "2 gram dual flavor disposables · Liquid diamonds.";

const PRODUCTS: SeedProduct[] = [
  // Litt Edibles — Edibles, $40, subtitle = Flavor.
  { name: "Litt Edible Treasure Trove", category: "Edibles", price: 40, subtitle: "Treasure Trove", description: LITT_DESCRIPTION, image: "treasure_trove" },
  { name: "Litt Edible Candy Vibes", category: "Edibles", price: 40, subtitle: "Candy Vibes", description: LITT_DESCRIPTION, image: "candy_vibes" },
  { name: "Litt Edible Rainbow Ribbons", category: "Edibles", price: 40, subtitle: "Rainbow Ribbons", description: LITT_DESCRIPTION, image: "rainbow_ribbons" },
  { name: "Litt Edible Forest Forage Gummies", category: "Edibles", price: 40, subtitle: "Forest Forage Gummies", description: LITT_DESCRIPTION, image: "forest_forage_gummies" },
  { name: "Litt Edible Cyber Chews", category: "Edibles", price: 40, subtitle: "Cyber Chews", description: LITT_DESCRIPTION, image: "cyber_chews" },
  { name: "Litt Edible Galactic Gummy Blast", category: "Edibles", price: 40, subtitle: "Galactic Gummy Blast", description: LITT_DESCRIPTION, image: "galactic_gummy_blast" },

  // 710 Nomad Rosin — Concentrates, $180, subtitle = Strain.
  { name: "710 Nomad Rosin Moroccan Peaches Jar", category: "Concentrates", price: 180, subtitle: "Moroccan Peaches", description: NOMAD_DESCRIPTION, image: "710_nomad_moroccan_peaches" },
  { name: "710 Nomad Rosin Mad Honey Jar", category: "Concentrates", price: 180, subtitle: "Mad Honey", description: NOMAD_DESCRIPTION, image: "710_nomad_mad_honey" },
  { name: "710 Nomad Rosin Rainbow Guava Jar", category: "Concentrates", price: 180, subtitle: "Rainbow Guava", description: NOMAD_DESCRIPTION, image: "710_nomad_rainbow_guava" },
  { name: "710 Nomad Rosin Zoap Jar", category: "Concentrates", price: 180, subtitle: "Zoap", description: NOMAD_DESCRIPTION, image: "710_nomad_zoap" },
  { name: "710 Nomad Rosin Maad Fruit Jar", category: "Concentrates", price: 180, subtitle: "Maad Fruit", description: NOMAD_DESCRIPTION, image: "710_nomad_maad_fruit" },
  { name: "710 Nomad Rosin Red Rings Jar", category: "Concentrates", price: 180, subtitle: "Red Rings", description: NOMAD_DESCRIPTION, image: "710_nomad_red_rings" },

  // Blinkers Flip — Vapes, $80, no subtitle.
  { name: "Blinkers Flip Gelato Pie & Pineapple Haze", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_gelato_pie_pineapple_haze" },
  { name: "Blinkers Flip Green Apple Diesel & Blue Nerdz", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_green_apple_diesel_blue_nerdz" },
  { name: "Blinkers Flip Pink Champagne & Superglue", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_pink_champagne_superglue" },
  { name: "Blinkers Flip Mango Tango & Lemon Heads", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_mango_tango_lemon_heads" },
  { name: "Blinkers Flip Forbidden Fruit & Pink Runtz", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_forbidden_fruit_pink_runtz" },
  { name: "Blinkers Flip Gushers & Banana Mochi", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_gushers_banana_mochi" },
  { name: "Blinkers Flip Lemon Slushie & Strawberry Cough", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_lemon_slushie_strawberry_cough" },
  { name: "Blinkers Flip Watermelon Z & Lemon Cherry Gelato", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_watermelon_z_lemon_cherry_gelato" },
  { name: "Blinkers Flip Tropical Grape & Melon Burst", category: "Vapes", price: 80, description: BLINKERS_DESCRIPTION, image: "blinkers_flip_tropical_grape_melon_burst" },
];

// --- Lab reports ------------------------------------------------------------
// One COA (Certificate of Analysis) per product, parallel to PRODUCTS[] (same
// order) so each report links to the product captured at the same index. Values
// mirror apps/web/public/lab-reports-mock.html: batch/lot codes, headline
// potency, tested dates, and the per-lab mapping (Litt Edibles → Green
// Scientific Labs, 710 Nomad Rosin → ACS Laboratory, Blinkers Flip → Kaycha
// Labs). Every lot passes every screen. Deterministic — no Date.now/random.

type Analyte = { name: string; value: string };

type SeedLabReport = {
  batchLot: string;
  potency: string;
  testedDate: string;
  lab: string;
  cannabinoids: Analyte[];
  terpenes: string;
};

// The six safety screens every lot is checked against (mock "Sample COA"),
// shared by every report — all results "Pass".
const SAFETY_SCREENS: { name: string; result: string }[] = [
  { name: "Pesticides", result: "Pass" },
  { name: "Heavy metals", result: "Pass" },
  { name: "Residual solvents", result: "Pass" },
  { name: "Microbials", result: "Pass" },
  { name: "Mycotoxins", result: "Pass" },
  { name: "Water activity", result: "Pass" },
];

// Cannabinoid panel for an inhalable lot (vapes/concentrates), keyed off the
// headline THCa %. Δ9-THC stays compliant; Total runs a touch above THCa.
function inhalablePanel(thcaPct: number, totalPct: number): Analyte[] {
  return [
    { name: "THCa", value: `${thcaPct.toFixed(1)}%` },
    { name: "Δ9-THC", value: "<0.3%" },
    { name: "CBG", value: "0.6%" },
    { name: "CBD", value: "0.1%" },
    { name: "Total", value: `${totalPct.toFixed(1)}%` },
  ];
}

// Cannabinoid panel for a 1000mg edible package (10 × 100mg pieces).
function ediblePanel(): Analyte[] {
  return [
    { name: "THCa", value: "1000mg" },
    { name: "Δ9-THC", value: "<1mg" },
    { name: "CBG", value: "8mg" },
    { name: "CBD", value: "5mg" },
    { name: "Total", value: "1013mg" },
  ];
}

const LAB_REPORTS: SeedLabReport[] = [
  // Litt Edibles — Green Scientific Labs, 1000mg total.
  { batchLot: "LE-TT24", potency: "1000mg total", testedDate: "2026-04-09", lab: "Green Scientific Labs", cannabinoids: ediblePanel(), terpenes: "Limonene · Myrcene · Linalool" },
  { batchLot: "LE-CV24", potency: "1000mg total", testedDate: "2026-04-04", lab: "Green Scientific Labs", cannabinoids: ediblePanel(), terpenes: "Limonene · Terpinolene · Pinene" },
  { batchLot: "LE-RR24", potency: "1000mg total", testedDate: "2026-03-06", lab: "Green Scientific Labs", cannabinoids: ediblePanel(), terpenes: "Myrcene · Caryophyllene · Limonene" },
  { batchLot: "LE-FF24", potency: "1000mg total", testedDate: "2026-03-03", lab: "Green Scientific Labs", cannabinoids: ediblePanel(), terpenes: "Pinene · Myrcene · Humulene" },
  { batchLot: "LE-CC24", potency: "1000mg total", testedDate: "2026-02-04", lab: "Green Scientific Labs", cannabinoids: ediblePanel(), terpenes: "Limonene · Linalool · Caryophyllene" },
  { batchLot: "LE-GB24", potency: "1000mg total", testedDate: "2026-01-15", lab: "Green Scientific Labs", cannabinoids: ediblePanel(), terpenes: "Terpinolene · Limonene · Myrcene" },

  // 710 Nomad Rosin — ACS Laboratory, solventless concentrate.
  { batchLot: "RN-MP24", potency: "79.4% THCa", testedDate: "2026-04-11", lab: "ACS Laboratory", cannabinoids: inhalablePanel(79.4, 81.0), terpenes: "Caryophyllene · Limonene · Linalool" },
  { batchLot: "RN-MH24", potency: "81.6% THCa", testedDate: "2026-03-14", lab: "ACS Laboratory", cannabinoids: inhalablePanel(81.6, 83.3), terpenes: "Myrcene · Pinene · Caryophyllene" },
  { batchLot: "RN-RG24", potency: "77.8% THCa", testedDate: "2026-03-10", lab: "ACS Laboratory", cannabinoids: inhalablePanel(77.8, 79.5), terpenes: "Limonene · Terpinolene · Myrcene" },
  { batchLot: "RN-ZP24", potency: "82.9% THCa", testedDate: "2026-02-12", lab: "ACS Laboratory", cannabinoids: inhalablePanel(82.9, 84.6), terpenes: "Caryophyllene · Limonene · Humulene" },
  { batchLot: "RN-MF24", potency: "76.5% THCa", testedDate: "2026-02-07", lab: "ACS Laboratory", cannabinoids: inhalablePanel(76.5, 78.2), terpenes: "Myrcene · Limonene · Pinene" },
  { batchLot: "RN-RR24", potency: "80.2% THCa", testedDate: "2026-01-21", lab: "ACS Laboratory", cannabinoids: inhalablePanel(80.2, 81.9), terpenes: "Limonene · Caryophyllene · Linalool" },

  // Blinkers Flip — Kaycha Labs, 2g liquid-diamond disposable. Gelato Pie uses
  // the mock's exact "Sample COA" panel (86.4% THCa / 88.1% total).
  { batchLot: "BF-GP24", potency: "86.4% THCa", testedDate: "2026-04-22", lab: "Kaycha Labs", cannabinoids: inhalablePanel(86.4, 88.1), terpenes: "Limonene · Caryophyllene · Linalool" },
  { batchLot: "BF-GA24", potency: "84.1% THCa", testedDate: "2026-04-18", lab: "Kaycha Labs", cannabinoids: inhalablePanel(84.1, 85.8), terpenes: "Terpinolene · Myrcene · Limonene" },
  { batchLot: "BF-PC24", potency: "87.2% THCa", testedDate: "2026-03-28", lab: "Kaycha Labs", cannabinoids: inhalablePanel(87.2, 88.9), terpenes: "Limonene · Linalool · Caryophyllene" },
  { batchLot: "BF-MT24", potency: "85.0% THCa", testedDate: "2026-03-24", lab: "Kaycha Labs", cannabinoids: inhalablePanel(85.0, 86.7), terpenes: "Myrcene · Limonene · Pinene" },
  { batchLot: "BF-FF24", potency: "88.3% THCa", testedDate: "2026-03-19", lab: "Kaycha Labs", cannabinoids: inhalablePanel(88.3, 90.0), terpenes: "Caryophyllene · Limonene · Humulene" },
  { batchLot: "BF-GU24", potency: "83.6% THCa", testedDate: "2026-02-25", lab: "Kaycha Labs", cannabinoids: inhalablePanel(83.6, 85.3), terpenes: "Limonene · Myrcene · Linalool" },
  { batchLot: "BF-LS24", potency: "85.9% THCa", testedDate: "2026-02-20", lab: "Kaycha Labs", cannabinoids: inhalablePanel(85.9, 87.6), terpenes: "Terpinolene · Limonene · Caryophyllene" },
  { batchLot: "BF-WZ24", potency: "86.8% THCa", testedDate: "2026-02-17", lab: "Kaycha Labs", cannabinoids: inhalablePanel(86.8, 88.5), terpenes: "Limonene · Caryophyllene · Myrcene" },
  { batchLot: "BF-TG24", potency: "84.7% THCa", testedDate: "2026-01-28", lab: "Kaycha Labs", cannabinoids: inhalablePanel(84.7, 86.4), terpenes: "Myrcene · Terpinolene · Limonene" },
];

// --- Pages ------------------------------------------------------------------
// The 8 marketing pages. Slugs (slugify of the title) match the storefront
// footer links (Chrome.tsx) so Learn/Help resolve to these docs.

const PAGES: { title: string; body: string[] }[] = [
  {
    title: "About THCa",
    body: [
      "Highgrove is small-batch THCa grown on a single farm in Columbia County, New York. Every batch is hand-trimmed and slow-cured before it ships.",
      "THCa is the raw, non-intoxicating acid form of THC found in the hemp plant. It converts to THC when heated, so treat it accordingly.",
    ],
  },
  {
    title: "Lab reports",
    body: [
      "Every batch is third-party lab-tested and traceable to its lot number. Certificates of analysis (COAs) cover potency and contaminants.",
      "Ask for the COA on any lot — it is printed on the jar and available on request.",
    ],
  },
  {
    title: "Journal",
    body: [
      "Notes from the farm: harvest updates, new drops, and the occasional deep dive on terpenes and curing.",
    ],
  },
  {
    title: "Wholesale",
    body: [
      "Interested in carrying Highgrove? We work with a small number of retail partners. Reach out and we will send current availability and pricing.",
    ],
  },
  {
    title: "Shipping & states",
    body: [
      "We ship discreetly to most of the U.S. We currently do not ship to ID, OR, AR, KS, MS, RI, or VT.",
      "Orders over $99 ship free. Checkout is age-gated at 21+.",
    ],
  },
  {
    title: "Returns",
    body: [
      "Because these are consumable hemp products, we cannot accept returns once a seal is broken. If something arrives damaged or incorrect, contact us within 14 days and we will make it right.",
    ],
  },
  {
    title: "Age verification",
    body: [
      "You must be 21 or older to shop Highgrove. Age is verified at checkout. Keep all products away from children and pets.",
    ],
  },
  {
    title: "Contact",
    body: [
      "By appointment · 2231 Route 23B, Hudson, NY.",
      "Questions about an order or a lot report? Email hello@highgrove.example and we will get back to you.",
    ],
  },
];

// --- Homepage ---------------------------------------------------------------
// Text content for the per-tenant homepage doc, mirroring BlinkersHome's
// DEFAULTS. Upload fields (heroImage/storyImage/categoryTiles) are intentionally
// left unset — the component falls back to the static /packs images.

const HOMEPAGE = {
  announcement: "Free shipping over $99 · 21+ · ships discreet, no labels",
  heroEyebrow: "Small-batch THCa · since 2021",
  heroHeadline: "Clean labs.",
  heroHighlight: "Loud flavor.",
  heroSubhead:
    "A tight shelf of THCa edibles, rosin, and vapes — lab-tested, traceable, shipped discreet. Picked because we actually use them.",
  heroRating: "4.9 · 15,000+ reviews · free shipping $99+",
  heroCtaPrimaryLabel: "Shop the drop →",
  heroCtaPrimaryHref: "/shop",
  heroCtaSecondaryLabel: "See the lab reports",
  heroCtaSecondaryHref: "/lab-reports",
  marqueeItems: [
    "New drop",
    "Lab-tested lots",
    "Solventless rosin",
    "Ships discreet",
    "21+ only",
    "Loud flavor",
    "Free ship $99+",
  ],
  featuredHeading: "This week's favorites.",
  storyHeading: "A shelf we'd actually shop.",
  story: [
    "Blinkers started with a simple gripe: good hemp shouldn't feel like a trip to the dispensary — over-serious, overpriced, kinda boring.",
    "So we built the shelf we wanted. Litt's loud-flavored edibles, 710 Nomad's solventless rosin, and our own Blinkers Flip vapes. Every lot third-party tested and traceable.",
    "If we wouldn't hand it to a friend, it doesn't make the cut.",
  ],
  reviewsHeading: "Loved by the group chat.",
  reviews: [
    { title: "Honestly obsessed", body: "The Blinkers Flip carts actually taste like the flavor on the box, and they last forever.", author: "Maya T." },
    { title: "No more dispo runs", body: "Switched from the dispensary and never looked back. COA on everything, ships fast and discreet.", author: "Devon R." },
    { title: "Litt edibles >>>", body: "Treasure Trove is dangerous lol. Real dosing, real flavor, none of that nasty aftertaste.", author: "Priya K." },
  ],
  emailHeading: "Get first dibs on drops.",
  emailSub: "New batches sell out. Subscribers get a heads-up — and 10% off the first order.",
  emailCta: "Sign me up",
};

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info("Seeding Blinkers storefront...");

  // 1. Super-admin user.
  const user = await payload.create({
    collection: "users",
    data: {
      email: "admin@grove.dev",
      password: "admin123",
    },
  });
  payload.logger.info(`Created user: ${user.email}`);

  // 2. Tenant.
  const tenant = await payload.create({
    collection: "tenants",
    data: {
      name: "Blinkers",
      slug: "blinkers",
      domain: "blinkers.grove.dev",
    },
  });
  payload.logger.info(`Created tenant: ${tenant.name}`);

  // Assign the admin to the tenant.
  await payload.update({
    collection: "users",
    id: user.id,
    data: { tenants: [{ tenant: tenant.id }] },
  });

  // 3. Site.
  const site = await payload.create({
    collection: "sites",
    data: {
      name: "Blinkers",
      slug: "blinkers",
      domain: "blinkers.localhost",
      tenant: tenant.id,
    },
  });
  payload.logger.info(`Created site: ${site.name} (${site.domain})`);

  // 4. Brand config.
  await payload.create({
    collection: "brand-configs",
    data: {
      site: site.id,
      tenant: tenant.id,
      primaryColor: "#14130d",
      secondaryColor: "#c2f04a",
    },
  });
  payload.logger.info("Created brand config");

  // 5. Products. Capture ids in creation order so the homepage can feature the
  // first 8.
  const productIds: number[] = [];
  for (const p of PRODUCTS) {
    const doc = await payload.create({
      collection: "products",
      data: {
        name: p.name,
        slug: slugify(p.name),
        price: p.price,
        status: "published",
        tenant: tenant.id,
        category: p.category,
        subtitle: p.subtitle,
        description: p.description,
        imageId: `/packs/${p.image}.jpg`,
      },
    });
    productIds.push(doc.id);
  }
  payload.logger.info(`Created ${productIds.length} products`);

  // 5b. Lab reports. One COA per product, in the same order as PRODUCTS[] so
  // each report links to the product captured at the matching index.
  let labReportCount = 0;
  for (let i = 0; i < LAB_REPORTS.length; i++) {
    const r = LAB_REPORTS[i];
    await payload.create({
      collection: "lab-reports",
      data: {
        product: productIds[i],
        tenant: tenant.id,
        batchLot: r.batchLot,
        potency: r.potency,
        testedDate: r.testedDate,
        lab: r.lab,
        status: "pass",
        cannabinoids: r.cannabinoids,
        safetyScreens: SAFETY_SCREENS,
        terpenes: r.terpenes,
      },
    });
    labReportCount++;
  }
  payload.logger.info(`Created ${labReportCount} lab reports`);

  // 6. Pages.
  for (const p of PAGES) {
    await payload.create({
      collection: "pages",
      data: {
        title: p.title,
        slug: slugify(p.title),
        site: site.id,
        tenant: tenant.id,
        status: "published",
        _status: "published",
        content: lexical(p.body),
      },
    });
  }
  payload.logger.info(`Created ${PAGES.length} pages`);

  // 7. Homepage. Text fields from BlinkersHome DEFAULTS + the first 8 products.
  await payload.create({
    collection: "homepage",
    data: {
      tenant: tenant.id,
      announcement: HOMEPAGE.announcement,
      heroEyebrow: HOMEPAGE.heroEyebrow,
      heroHeadline: HOMEPAGE.heroHeadline,
      heroHighlight: HOMEPAGE.heroHighlight,
      heroSubhead: HOMEPAGE.heroSubhead,
      heroRating: HOMEPAGE.heroRating,
      heroCtaPrimaryLabel: HOMEPAGE.heroCtaPrimaryLabel,
      heroCtaPrimaryHref: HOMEPAGE.heroCtaPrimaryHref,
      heroCtaSecondaryLabel: HOMEPAGE.heroCtaSecondaryLabel,
      heroCtaSecondaryHref: HOMEPAGE.heroCtaSecondaryHref,
      marqueeItems: HOMEPAGE.marqueeItems.map((text) => ({ text })),
      featuredHeading: HOMEPAGE.featuredHeading,
      featuredProducts: productIds.slice(0, 8),
      storyHeading: HOMEPAGE.storyHeading,
      storyBody: lexical(HOMEPAGE.story),
      reviewsHeading: HOMEPAGE.reviewsHeading,
      reviews: HOMEPAGE.reviews.map((r) => ({ ...r, badge: "Verified" })),
      emailHeading: HOMEPAGE.emailHeading,
      emailSub: HOMEPAGE.emailSub,
      emailCta: HOMEPAGE.emailCta,
    },
  });
  payload.logger.info("Created homepage");

  payload.logger.info("Seed complete!");
};
