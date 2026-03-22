import { describe, it, expect, afterEach, vi } from "vitest";
import { isAuthenticated, isSuperAdmin } from "./access";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isAuthenticated", () => {
  it("returns true for authenticated user", () => {
    const result = isAuthenticated({ req: { user: { email: "a@b.com" } } } as any);
    expect(result).toBe(true);
  });

  it("returns false when user is null", () => {
    const result = isAuthenticated({ req: { user: null } } as any);
    expect(result).toBe(false);
  });

  it("returns false when user is undefined", () => {
    const result = isAuthenticated({ req: { user: undefined } } as any);
    expect(result).toBe(false);
  });
});

describe("isSuperAdmin", () => {
  it("returns true when email matches SUPER_ADMIN_EMAIL", () => {
    vi.stubEnv("SUPER_ADMIN_EMAIL", "super@test.com");
    const result = isSuperAdmin({
      req: { user: { email: "super@test.com" } },
    } as any);
    expect(result).toBe(true);
  });

  it("returns false when email does not match", () => {
    vi.stubEnv("SUPER_ADMIN_EMAIL", "super@test.com");
    const result = isSuperAdmin({
      req: { user: { email: "other@test.com" } },
    } as any);
    expect(result).toBe(false);
  });

  it("returns false when user is null", () => {
    vi.stubEnv("SUPER_ADMIN_EMAIL", "super@test.com");
    const result = isSuperAdmin({ req: { user: null } } as any);
    expect(result).toBe(false);
  });

  it("returns false when SUPER_ADMIN_EMAIL is not set", () => {
    vi.stubEnv("SUPER_ADMIN_EMAIL", "");
    const result = isSuperAdmin({
      req: { user: { email: "any@test.com" } },
    } as any);
    expect(result).toBe(false);
  });
});
