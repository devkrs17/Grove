import { describe, it, expect } from "vitest";
import { Partners } from "./partners";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Partners collection", () => {
  it("has slug 'partners'", () => {
    expect(Partners.slug).toBe("partners");
  });

  it("uses name as admin title", () => {
    expect(Partners.admin?.useAsTitle).toBe("name");
  });

  it("has a required name field", () => {
    const f = Partners.fields.find((x) => "name" in x && x.name === "name");
    expect(f).toMatchObject({ type: "text", required: true });
  });

  it("defaults type to fulfillment", () => {
    const f = Partners.fields.find((x) => "name" in x && x.name === "type");
    expect(f).toMatchObject({ type: "select", defaultValue: "fulfillment" });
  });

  it("has a credentials array field", () => {
    const f = Partners.fields.find((x) => "name" in x && x.name === "credentials");
    expect(f).toMatchObject({ type: "array" });
  });

  it("has 6 fields", () => {
    expect(Partners.fields).toHaveLength(6);
  });

  it("applies the standard access rules", () => {
    expect(Partners.access?.read).toBe(isAuthenticated);
    expect(Partners.access?.create).toBe(isAuthenticated);
    expect(Partners.access?.update).toBe(isAuthenticated);
    expect(Partners.access?.delete).toBe(isSuperAdmin);
  });
});
