import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware, config } from "./middleware";

vi.mock("next/server", () => {
  const nextFn = vi.fn();
  return {
    NextRequest: vi.fn(),
    NextResponse: { next: nextFn },
  };
});

function makeRequest(host: string): NextRequest {
  const headers = new Headers();
  headers.set("host", host);
  return { headers } as unknown as NextRequest;
}

describe("middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.mocked(NextResponse.next).mockReturnValue(
      new Response() as ReturnType<typeof NextResponse.next>
    );
  });

  it("passes through when host header is missing", async () => {
    const request = { headers: new Headers() } as unknown as NextRequest;
    await middleware(request);
    expect(NextResponse.next).toHaveBeenCalledWith();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sets tenant headers on successful resolution", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          site: { id: 1, name: "Acme Art Gallery", slug: "acme-art" },
          tenant: { id: 10, name: "Acme Art Gallery", slug: "acme-art" },
        }),
    } as Response);

    await middleware(makeRequest("acme-art.localhost:3000"));

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3002/api/resolve-tenant?domain=acme-art.localhost"
    );
    expect(NextResponse.next).toHaveBeenCalledWith({
      request: {
        headers: expect.any(Headers),
      },
    });

    const call = vi.mocked(NextResponse.next).mock.calls[0][0] as any;
    const headers: Headers = call.request.headers;
    expect(headers.get("x-grove-tenant-id")).toBe("10");
    expect(headers.get("x-grove-site-id")).toBe("1");
    expect(headers.get("x-grove-tenant-slug")).toBe("acme-art");
    expect(headers.get("x-grove-site-slug")).toBe("acme-art");
  });

  it("passes through when CMS returns 404", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await middleware(makeRequest("unknown.localhost:3000"));
    expect(NextResponse.next).toHaveBeenCalledWith();
  });

  it("passes through when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    await middleware(makeRequest("acme-art.localhost:3000"));
    expect(NextResponse.next).toHaveBeenCalledWith();
  });

  it("strips port from hostname", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await middleware(makeRequest("acme-art.localhost:3000"));
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3002/api/resolve-tenant?domain=acme-art.localhost"
    );
  });

  it("uses CMS_URL env var when set", async () => {
    process.env.CMS_URL = "https://cms.grove.dev";
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await middleware(makeRequest("acme-art.localhost:3000"));
    expect(fetch).toHaveBeenCalledWith(
      "https://cms.grove.dev/api/resolve-tenant?domain=acme-art.localhost"
    );

    delete process.env.CMS_URL;
  });

  it("exports correct matcher config", () => {
    expect(config.matcher).toEqual([
      "/((?!_next/static|_next/image|favicon\\.ico|api/).*)",
    ]);
  });
});
