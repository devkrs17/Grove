import { vi, describe, it, expect, beforeEach } from "vitest";
import { parseCsv, importProductsEndpoint } from "./endpoint";

// ── helpers ────────────────────────────────────────────────────────────────

function makeFile(csvContent: string) {
  return {
    data: Buffer.from(csvContent),
    name: "products.csv",
    mimetype: "text/csv",
    size: csvContent.length,
  };
}

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    user: {
      id: 1,
      email: "staff@example.com",
      tenants: [{ tenant: 42 }],
      collection: "users",
    },
    payload: {
      create: vi.fn().mockResolvedValue({ id: 99 }),
      logger: { error: vi.fn() },
    },
    file: undefined as ReturnType<typeof makeFile> | undefined,
    ...overrides,
  };
}

// addDataAndFileToRequest is a Payload helper that mutates req — mock it so it
// does nothing (the test sets req.file directly).
vi.mock("payload", () => ({
  addDataAndFileToRequest: vi.fn(),
}));

// ── parseCsv unit tests ────────────────────────────────────────────────────

describe("parseCsv", () => {
  it("returns empty array for header-only input", () => {
    expect(parseCsv("name,price,status")).toEqual([]);
  });

  it("returns empty array for blank input", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("parses rows into objects keyed by header", () => {
    const csv = "name,price,status\nWidget,9.99,published";
    expect(parseCsv(csv)).toEqual([{ name: "Widget", price: "9.99", status: "published" }]);
  });

  it("trims whitespace from headers and values", () => {
    const csv = " name , price \nWidget , 9.99 ";
    expect(parseCsv(csv)).toEqual([{ name: "Widget", price: "9.99" }]);
  });

  it("handles CRLF line endings", () => {
    const csv = "name,price\r\nGadget,5.00";
    expect(parseCsv(csv)).toEqual([{ name: "Gadget", price: "5.00" }]);
  });
});

// ── endpoint handler tests ─────────────────────────────────────────────────

describe("importProductsEndpoint handler", () => {
  // Cast through unknown to avoid type-checking the minimal mock against the full PayloadRequest shape.
  // The test's mock satisfies everything the handler actually uses at runtime.
  const handler = importProductsEndpoint.handler as unknown as (
    req: ReturnType<typeof makeReq>
  ) => Promise<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    const req = makeReq({ user: null });
    const res = await handler(req as never);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 when no file is provided", async () => {
    const req = makeReq({ file: undefined });
    const res = await handler(req as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("No file uploaded");
  });

  it("returns 400 when user has no tenant", async () => {
    const req = makeReq({
      file: makeFile("name,price,status\nWidget,9.99,published"),
      user: {
        id: 1,
        email: "orphan@example.com",
        tenants: [],
        collection: "users",
      },
    });
    const res = await handler(req as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("User has no tenant");
  });

  it("happy path: creates valid rows and returns { created, errors }", async () => {
    const csv = [
      "name,price,status,description",
      "Widget,9.99,published,A great widget",
      "Gadget,14.50,draft,Optional desc",
    ].join("\n");

    const req = makeReq({ file: makeFile(csv) });
    const res = await handler(req as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.created).toBe(2);
    expect(body.errors).toHaveLength(0);
    expect(req.payload.create).toHaveBeenCalledTimes(2);
    expect(req.payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "products",
        data: expect.objectContaining({ name: "Widget", price: 9.99, status: "published" }),
        overrideAccess: false,
      })
    );
  });

  it("skips rows with missing name and records error", async () => {
    const csv = "name,price,status\n,5.00,draft\nGadget,10.00,published";
    const req = makeReq({ file: makeFile(csv) });
    const res = await handler(req as never);
    const body = await res.json();
    expect(body.created).toBe(1);
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0]).toMatchObject({ row: 2, reason: "Missing name" });
    expect(req.payload.create).toHaveBeenCalledTimes(1);
  });

  it("skips rows with invalid price and records error", async () => {
    const csv = "name,price,status\nWidget,notanumber,published\nGadget,10,draft";
    const req = makeReq({ file: makeFile(csv) });
    const res = await handler(req as never);
    const body = await res.json();
    expect(body.created).toBe(1);
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0]).toMatchObject({ row: 2, reason: "Invalid price" });
  });

  it("skips rows with negative price", async () => {
    const csv = "name,price,status\nWidget,-1,published";
    const req = makeReq({ file: makeFile(csv) });
    const res = await handler(req as never);
    const body = await res.json();
    expect(body.created).toBe(0);
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0]).toMatchObject({ row: 2, reason: "Invalid price" });
  });

  it("defaults unknown status to draft", async () => {
    const csv = "name,price,status\nWidget,5.00,unknown";
    const req = makeReq({ file: makeFile(csv) });
    await handler(req as never);
    expect(req.payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "draft" }),
      })
    );
  });

  it("resolves tenant id from relationship object", async () => {
    const csv = "name,price,status\nWidget,5.00,draft";
    const req = makeReq({
      file: makeFile(csv),
      user: {
        id: 1,
        email: "staff@example.com",
        tenants: [{ tenant: { id: 99, name: "Acme", slug: "acme" } }],
        collection: "users",
      },
    });
    await handler(req as never);
    expect(req.payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenant: 99 }),
      })
    );
  });

  it("returns created:0 and no errors for empty CSV", async () => {
    const csv = "name,price,status\n";
    const req = makeReq({ file: makeFile(csv) });
    const res = await handler(req as never);
    const body = await res.json();
    expect(body.created).toBe(0);
    expect(body.errors).toHaveLength(0);
    expect(req.payload.create).not.toHaveBeenCalled();
  });
});
