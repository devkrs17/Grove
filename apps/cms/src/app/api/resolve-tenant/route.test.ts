import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("payload", () => ({
  getPayload: vi.fn(),
}));

vi.mock("@payload-config", () => ({
  default: {},
}));

import { GET } from "./route";
import { getPayload } from "payload";

function makeRequest(url: string) {
  return new Request(url);
}

describe("GET /api/resolve-tenant", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 400 when domain param is missing", async () => {
    const response = await GET(makeRequest("http://localhost/api/resolve-tenant"));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("missing_domain");
  });

  it("returns 404 when no site matches the domain", async () => {
    vi.mocked(getPayload).mockResolvedValueOnce({
      find: vi.fn().mockResolvedValueOnce({ docs: [] }),
    } as any);

    const response = await GET(
      makeRequest("http://localhost/api/resolve-tenant?domain=unknown.localhost")
    );
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("not_found");
  });

  it("returns site and tenant when domain matches", async () => {
    vi.mocked(getPayload).mockResolvedValueOnce({
      find: vi.fn().mockResolvedValueOnce({
        docs: [
          {
            id: 1,
            name: "Acme Art Gallery",
            slug: "acme-art",
            domain: "acme-art.localhost",
            tenant: { id: 10, name: "Acme Art Gallery", slug: "acme-art" },
          },
        ],
      }),
    } as any);

    const response = await GET(
      makeRequest("http://localhost/api/resolve-tenant?domain=acme-art.localhost")
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.site).toEqual({ id: 1, name: "Acme Art Gallery", slug: "acme-art" });
    expect(data.tenant).toEqual({ id: 10, name: "Acme Art Gallery", slug: "acme-art" });
  });

  it("returns 404 when site tenant is not populated", async () => {
    vi.mocked(getPayload).mockResolvedValueOnce({
      find: vi.fn().mockResolvedValueOnce({
        docs: [
          {
            id: 1,
            name: "Orphan Site",
            slug: "orphan",
            domain: "orphan.localhost",
            tenant: null,
          },
        ],
      }),
    } as any);

    const response = await GET(
      makeRequest("http://localhost/api/resolve-tenant?domain=orphan.localhost")
    );
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("not_found");
  });

  it("returns 500 when payload throws", async () => {
    vi.mocked(getPayload).mockRejectedValueOnce(new Error("DB down"));

    const response = await GET(
      makeRequest("http://localhost/api/resolve-tenant?domain=acme-art.localhost")
    );
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("internal_error");
  });
});
