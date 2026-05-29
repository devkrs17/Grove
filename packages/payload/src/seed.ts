import type { Payload } from "payload";

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

  // Highgrove catalogue (prices in dollars, matching the seed convention above).
  const highgroveProducts = [
    { name: "Sour Grapes", price: 44 },
    { name: "Super Boof", price: 38 },
    { name: "Guava Cake", price: 49 },
    { name: "Dulce de Papaya", price: 89 },
    { name: "Maui Fruit", price: 49 },
    { name: "Jelly Donuts", price: 65 },
    { name: "Tropaya", price: 24 },
    { name: "Sour Diesel", price: 45 },
    { name: "Zlushiez Smalls", price: 89 },
    { name: "Cool Cocol Push", price: 28 },
    { name: "Hudson Haze", price: 54 },
  ];
  for (const p of highgroveProducts) {
    await payload.create({
      collection: "products",
      data: { name: p.name, price: p.price, status: "published", tenant: tenantC.id },
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
