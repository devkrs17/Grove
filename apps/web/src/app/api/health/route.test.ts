import { vi, describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns 200 with ok status and uptime", async () => {
    vi.spyOn(process, "uptime").mockReturnValueOnce(42.5);

    const response = GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.uptime).toBe(42.5);
  });
});
