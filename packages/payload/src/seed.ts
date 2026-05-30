import path from "path";
import { fileURLToPath } from "url";
import type { Payload } from "payload";

// Committed branded placeholder images (packages/payload/seed-assets/) uploaded
// into the Media collection so a couple of Highgrove products render from the
// CMS rather than a (possibly stale) Unsplash imageId.
const seedAssetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../seed-assets");

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info("Seeding database...");

  // 1. Create super-admin user
  const user = await payload.create({
    collection: "users",
    data: {
      email: "admin@grove.dev",
      password: "admin123",
    },
  });
  payload.logger.info(`Created user: ${user.email}`);

  // 2. Create two test tenants
  const tenantA = await payload.create({
    collection: "tenants",
    data: {
      name: "Acme Art Gallery",
      slug: "acme-art",
      domain: "acme-art.grove.dev",
    },
  });
  payload.logger.info(`Created tenant: ${tenantA.name}`);

  const tenantB = await payload.create({
    collection: "tenants",
    data: {
      name: "Bella Botanicals",
      slug: "bella-botanicals",
      domain: "bella-botanicals.grove.dev",
    },
  });
  payload.logger.info(`Created tenant: ${tenantB.name}`);

  // Highgrove — small-batch THCa operator (regulated-goods demo tenant).
  // Matches the storefront design kit (ui_kits/storefront, "highgrove" theme).
  const tenantC = await payload.create({
    collection: "tenants",
    data: {
      name: "Highgrove",
      slug: "highgrove",
      domain: "highgrove.grove.dev",
    },
  });
  payload.logger.info(`Created tenant: ${tenantC.name}`);

  // 3. Assign user to all tenants
  await payload.update({
    collection: "users",
    id: user.id,
    data: {
      tenants: [
        { tenant: tenantA.id },
        { tenant: tenantB.id },
        { tenant: tenantC.id },
      ],
    },
  });
  payload.logger.info("Assigned user to all tenants");

  // 3b. Create sites for each tenant (used by hostname middleware)
  const siteA = await payload.create({
    collection: "sites",
    data: {
      name: "Acme Art Gallery",
      slug: "acme-art",
      domain: "acme-art.localhost",
      tenant: tenantA.id,
    },
  });
  payload.logger.info(`Created site: ${siteA.name} (${siteA.domain})`);

  const siteB = await payload.create({
    collection: "sites",
    data: {
      name: "Bella Botanicals",
      slug: "bella-botanicals",
      domain: "bella-botanicals.localhost",
      tenant: tenantB.id,
    },
  });
  payload.logger.info(`Created site: ${siteB.name} (${siteB.domain})`);

  const siteC = await payload.create({
    collection: "sites",
    data: {
      name: "Highgrove",
      slug: "highgrove",
      domain: "highgrove.localhost",
      tenant: tenantC.id,
    },
  });
  payload.logger.info(`Created site: ${siteC.name} (${siteC.domain})`);

  // 4. Create products scoped to each tenant
  await payload.create({
    collection: "products",
    data: {
      name: "Abstract Canvas Print",
      price: 250,
      status: "published",
      tenant: tenantA.id,
    },
  });

  await payload.create({
    collection: "products",
    data: {
      name: "Bronze Sculpture",
      price: 1200,
      status: "draft",
      tenant: tenantA.id,
    },
  });

  await payload.create({
    collection: "products",
    data: {
      name: "Lavender Bundle",
      price: 18,
      status: "published",
      tenant: tenantB.id,
    },
  });

  await payload.create({
    collection: "products",
    data: {
      name: "Succulent Planter",
      price: 35,
      status: "published",
      tenant: tenantB.id,
    },
  });

  payload.logger.info("Created 4 products across 2 tenants");

  // Highgrove catalogue — full design data ported from the storefront kit
  // (apps/web/src/storefront/data.ts). slug doubles as the storefront URL.
  type SeedProduct = {
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    tag: string;
    category: "Flower" | "Concentrates" | "Vapes" | "Pre-rolls" | "Edibles";
    effect: "sleep" | "chill" | "euphoric" | "creative" | "focus";
    strainType: "Indica" | "Sativa" | "Hybrid";
    thcLabel: string;
    imageId: string;
    lot: string;
  };

  const terpenesFor: Record<string, string> = {
    Indica: "Myrcene · Linalool · Caryophyllene",
    Sativa: "Limonene · Terpinolene · Pinene",
    Hybrid: "Caryophyllene · Limonene · Humulene",
  };

  const highgroveProducts: SeedProduct[] = [
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
  // Upload a couple of real Media images and key them by product slug so those
  // products render from the CMS (the rest fall back to imageId).
  const imageFileBySlug: Record<string, string> = {
    "sour-grapes": "sour-grapes.jpg",
    "super-boof": "super-boof.jpg",
  };
  const mediaIdBySlug: Record<string, number> = {};
  for (const [slug, file] of Object.entries(imageFileBySlug)) {
    const product = highgroveProducts.find((p) => p.slug === slug);
    const media = await payload.create({
      collection: "media",
      data: {
        alt: `${product?.name ?? slug} — Highgrove`,
        site: siteC.id,
        tenant: tenantC.id,
      },
      filePath: path.join(seedAssetsDir, file),
    });
    mediaIdBySlug[slug] = media.id;
  }
  payload.logger.info(`Uploaded ${Object.keys(mediaIdBySlug).length} Highgrove media images`);

  for (const p of highgroveProducts) {
    await payload.create({
      collection: "products",
      data: {
        ...p,
        status: "published",
        tenant: tenantC.id,
        tag: p.tag || undefined,
        featuredImage: mediaIdBySlug[p.slug],
        terpenes: terpenesFor[p.strainType],
        description: `${p.name} — ${p.subtitle}. Single-farm THCa, hand-trimmed and slow-cured in Columbia County, NY. Lot ${p.lot}, third-party tested.`,
      },
    });
  }
  payload.logger.info(`Created ${highgroveProducts.length} Highgrove products`);

  // 5. Verify tenant scoping
  const allProducts = await payload.find({
    collection: "products",
    limit: 100,
    overrideAccess: true,
  });
  payload.logger.info(`Total products (unscoped): ${allProducts.totalDocs}`);

  const tenantAProducts = await payload.find({
    collection: "products",
    where: { tenant: { equals: tenantA.id } },
    overrideAccess: true,
  });
  payload.logger.info(
    `Tenant A (${tenantA.name}) products: ${tenantAProducts.totalDocs}`,
  );

  const tenantBProducts = await payload.find({
    collection: "products",
    where: { tenant: { equals: tenantB.id } },
    overrideAccess: true,
  });
  payload.logger.info(
    `Tenant B (${tenantB.name}) products: ${tenantBProducts.totalDocs}`,
  );

  // 6. Create brand configs for each site
  await payload.create({
    collection: "brand-configs",
    data: {
      site: siteA.id,
      tenant: tenantA.id,
      primaryColor: "#1a1a2e",
      secondaryColor: "#e94560",
    },
  });

  await payload.create({
    collection: "brand-configs",
    data: {
      site: siteB.id,
      tenant: tenantB.id,
      primaryColor: "#2d5016",
      secondaryColor: "#8fbc5a",
    },
  });

  // Highgrove brand config — forest/sage palette from the design tokens.
  await payload.create({
    collection: "brand-configs",
    data: {
      site: siteC.id,
      tenant: tenantC.id,
      primaryColor: "#2d4a2b",
      secondaryColor: "#7a8c5c",
    },
  });

  payload.logger.info("Created brand configs for all tenants");

  payload.logger.info("Seed complete!");
};
