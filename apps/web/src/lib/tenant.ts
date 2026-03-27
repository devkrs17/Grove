import { headers } from "next/headers";

export interface TenantContext {
  tenantId: string | null;
  siteId: string | null;
  tenantSlug: string | null;
  siteSlug: string | null;
}

export async function getTenantContext(): Promise<TenantContext> {
  const h = await headers();
  return {
    tenantId: h.get("x-grove-tenant-id"),
    siteId: h.get("x-grove-site-id"),
    tenantSlug: h.get("x-grove-tenant-slug"),
    siteSlug: h.get("x-grove-site-slug"),
  };
}
