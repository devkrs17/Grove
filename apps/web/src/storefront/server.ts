// Server-only storefront data access. Kept out of src/lib (which is
// coverage-gated for pure logic); the Payload I/O here is exercised by the
// running app and browser verification, while the pure transform it delegates
// to (src/lib/storefront.ts) is unit-tested to 100%.

import { getPayload, type Payload, type Where } from "payload";
import config from "@payload-config";
import type { Page, Homepage } from "@grove/types";
import { getTenantContext } from "@/lib/tenant";
import { mapProduct, mapProducts } from "@/lib/storefront";
import type { Product } from "./data";

// When no tenant resolves from the host (e.g. plain localhost), the storefront
// falls back to the Highgrove demo tenant so the finished design is visible.
const DEFAULT_TENANT_SLUG = "highgrove";

async function resolveTenantId(payload: Payload, tenantId: string | null): Promise<number | null> {
  if (tenantId) {
    return Number(tenantId);
  }
  const { docs } = await payload.find({
    collection: "tenants",
    where: { slug: { equals: DEFAULT_TENANT_SLUG } },
    limit: 1,
    overrideAccess: true,
  });
  return docs[0] ? Number(docs[0].id) : null;
}

async function resolveSiteId(payload: Payload, siteId: string | null): Promise<number | null> {
  if (siteId) {
    return Number(siteId);
  }
  const { docs } = await payload.find({
    collection: "sites",
    where: { slug: { equals: DEFAULT_TENANT_SLUG } },
    limit: 1,
    overrideAccess: true,
  });
  return docs[0] ? Number(docs[0].id) : null;
}

function publishedWhere(tenantId: number | null): Where {
  return tenantId
    ? { and: [{ status: { equals: "published" } }, { tenant: { equals: tenantId } }] }
    : { status: { equals: "published" } };
}

/** All published products for the resolved (or default) tenant, as view-models. */
export async function getStorefrontProducts(): Promise<Product[]> {
  const payload = await getPayload({ config });
  const { tenantId } = await getTenantContext();
  const effective = await resolveTenantId(payload, tenantId);
  const { docs } = await payload.find({
    collection: "products",
    where: publishedWhere(effective),
    overrideAccess: true,
    depth: 1, // populate the `image` upload relationship so its URL is available
    limit: 200,
  });
  return mapProducts(docs);
}

/** A single published product by slug for the resolved tenant, or null. */
export async function getStorefrontProductBySlug(slug: string): Promise<Product | null> {
  const payload = await getPayload({ config });
  const { tenantId } = await getTenantContext();
  const effective = await resolveTenantId(payload, tenantId);
  const base = publishedWhere(effective);
  const where: Where = { and: [...(base.and ?? [base]), { slug: { equals: slug } }] };
  const { docs } = await payload.find({
    collection: "products",
    where,
    overrideAccess: true,
    depth: 1, // populate the `image` upload relationship so its URL is available
    limit: 1,
  });
  return docs[0] ? mapProduct(docs[0]) : null;
}

/** A single published marketing page by slug for the resolved (or default) site, or null. */
export async function getStorefrontPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getPayload({ config });
  const { siteId } = await getTenantContext();
  const effective = await resolveSiteId(payload, siteId);
  if (!effective) {
    return null;
  }
  const { docs } = await payload.find({
    collection: "pages",
    where: {
      and: [
        { site: { equals: effective } },
        { slug: { equals: slug } },
        { status: { equals: "published" } },
      ],
    },
    overrideAccess: true,
    depth: 0,
    limit: 1,
  });
  return docs[0] ?? null;
}

/** The per-tenant homepage document for the resolved (or default) tenant, or null. */
export async function getHomepage(): Promise<Homepage | null> {
  const payload = await getPayload({ config });
  const { tenantId } = await getTenantContext();
  const effective = await resolveTenantId(payload, tenantId);
  if (!effective) {
    return null;
  }
  const { docs } = await payload.find({
    collection: "homepage",
    where: { tenant: { equals: effective } },
    overrideAccess: true,
    depth: 1,
    limit: 1,
  });
  return docs[0] ?? null;
}
