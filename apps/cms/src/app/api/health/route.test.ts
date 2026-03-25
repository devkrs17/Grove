import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("payload", () => ({
  getPayload: vi.fn(),
}));

vi.mock("@payload-config", () => ({
  default: {},
}));

import { GET } from "./route";
import { getPayload } from "payload";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 with ok status when DB is reachable", async () => {
    vi.mocked(getPayload).mockResolvedValueOnce({
      count: vi.fn().mockResolvedValueOnce({ totalDocs: 0 }),
    } as any);

    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.db).toBe("ok");
    expect(typeof data.uptime).toBe("number");
  });

  it("returns 503 when getPayload throws", async () => {
    vi.mocked(getPayload).mockRejectedValueOnce(new Error("DB connection failed"));

    const response = await GET();
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.status).toBe("error");
    expect(data.db).toBe("unreachable");
    expect(typeof data.uptime).toBe("number");
  });

  it("returns 503 when count throws", async () => {
    vi.mocked(getPayload).mockResolvedValueOnce({
      count: vi.fn().mockRejectedValueOnce(new Error("Query failed")),
    } as any);

    const response = await GET();
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.status).toBe("error");
    expect(data.db).toBe("unreachable");
    expect(typeof data.uptime).toBe("number");
  });
});
