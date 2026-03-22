import { describe, it, expect } from "vitest";
import { Users } from "./users";

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
});
