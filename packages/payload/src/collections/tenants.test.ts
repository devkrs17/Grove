import { describe, it, expect } from "vitest";
import { Tenants } from "./tenants";

describe("Tenants collection", () => {
  it("has slug 'tenants'", () => {
    expect(Tenants.slug).toBe("tenants");
  });

  it("uses name as admin title", () => {
    expect(Tenants.admin?.useAsTitle).toBe("name");
  });

  it("has required name field", () => {
    const name = Tenants.fields.find((f) => "name" in f && f.name === "name");
    expect(name).toMatchObject({ type: "text", required: true });
  });

  it("has required unique slug field", () => {
    const slug = Tenants.fields.find((f) => "name" in f && f.name === "slug");
    expect(slug).toMatchObject({ type: "text", required: true, unique: true });
  });

  it("has optional domain field", () => {
    const domain = Tenants.fields.find(
      (f) => "name" in f && f.name === "domain",
    );
    expect(domain).toMatchObject({ type: "text" });
  });

  it("has exactly 3 fields", () => {
    expect(Tenants.fields).toHaveLength(3);
  });
});
