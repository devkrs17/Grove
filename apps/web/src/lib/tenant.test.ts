import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { getTenantContext } from "./tenant";
import { headers } from "next/headers";

describe("getTenantContext", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns full context when all headers are set", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("x-grove-tenant-id", "10");
    mockHeaders.set("x-grove-site-id", "1");
    mockHeaders.set("x-grove-tenant-slug", "acme-art");
    mockHeaders.set("x-grove-site-slug", "acme-art");
    vi.mocked(headers).mockResolvedValueOnce(mockHeaders as any);

    const ctx = await getTenantContext();
    expect(ctx).toEqual({
      tenantId: "10",
      siteId: "1",
      tenantSlug: "acme-art",
      siteSlug: "acme-art",
    });
  });

  it("returns nulls when no headers are set", async () => {
    vi.mocked(headers).mockResolvedValueOnce(new Headers() as any);

    const ctx = await getTenantContext();
    expect(ctx).toEqual({
      tenantId: null,
      siteId: null,
      tenantSlug: null,
      siteSlug: null,
    });
  });

  it("returns partial context when some headers are set", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("x-grove-tenant-id", "10");
    mockHeaders.set("x-grove-tenant-slug", "acme-art");
    vi.mocked(headers).mockResolvedValueOnce(mockHeaders as any);

    const ctx = await getTenantContext();
    expect(ctx).toEqual({
      tenantId: "10",
      siteId: null,
      tenantSlug: "acme-art",
      siteSlug: null,
    });
  });
});
