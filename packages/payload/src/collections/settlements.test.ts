import { describe, it, expect } from "vitest";
import { Settlements } from "./settlements";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Settlements collection", () => {
  it("has slug 'settlements'", () => {
    expect(Settlements.slug).toBe("settlements");
  });

  it("has no custom admin title (defaults to id)", () => {
    expect(Settlements.admin).toBeUndefined();
  });

  it("has a required order relationship to orders", () => {
    const f = Settlements.fields.find((x) => "name" in x && x.name === "order");
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "orders",
      required: true,
    });
  });

  it("has an allocations array field", () => {
    const f = Settlements.fields.find(
      (x) => "name" in x && x.name === "allocations",
    );
    expect(f).toMatchObject({ type: "array" });
  });

  it("defaults status to pending", () => {
    const f = Settlements.fields.find((x) => "name" in x && x.name === "status");
    expect(f).toMatchObject({ type: "select", defaultValue: "pending" });
  });

  it("has 5 fields", () => {
    expect(Settlements.fields).toHaveLength(5);
  });

  it("applies the standard access rules", () => {
    expect(Settlements.access?.read).toBe(isAuthenticated);
    expect(Settlements.access?.create).toBe(isAuthenticated);
    expect(Settlements.access?.update).toBe(isAuthenticated);
    expect(Settlements.access?.delete).toBe(isSuperAdmin);
  });
});
