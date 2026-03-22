import { describe, it, expect } from "vitest";
import { Users } from "./users";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Users collection", () => {
  it("has slug 'users'", () => {
    expect(Users.slug).toBe("users");
  });

  it("has auth enabled", () => {
    expect(Users.auth).toBe(true);
  });

  it("uses email as admin title", () => {
    expect(Users.admin?.useAsTitle).toBe("email");
  });

  it("has no custom fields", () => {
    expect(Users.fields).toHaveLength(0);
  });

  it("allows read for authenticated users", () => {
    expect(Users.access?.read).toBe(isAuthenticated);
  });

  it("restricts create to super admin", () => {
    expect(Users.access?.create).toBe(isSuperAdmin);
  });

  it("allows update for authenticated users", () => {
    expect(Users.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(Users.access?.delete).toBe(isSuperAdmin);
  });
});
