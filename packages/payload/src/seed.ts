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

  // 3. Assign user to both tenants
  await payload.update({
    collection: "users",
    id: user.id,
    data: {
      tenants: [{ tenant: tenantA.id }, { tenant: tenantB.id }],
    },
  });
  payload.logger.info("Assigned user to both tenants");

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

  payload.logger.info("Seed complete!");
};
