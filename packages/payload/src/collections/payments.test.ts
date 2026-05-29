import { describe, it, expect } from "vitest";
import { Payments } from "./payments";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Payments collection", () => {
  it("has slug 'payments'", () => {
    expect(Payments.slug).toBe("payments");
  });

  it("has a required order relationship to orders", () => {
    const f = Payments.fields.find((x) => "name" in x && x.name === "order");
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "orders",
      required: true,
    });
  });

  it("has a required amount number field with min 0", () => {
    const f = Payments.fields.find((x) => "name" in x && x.name === "amount");
    expect(f).toMatchObject({ type: "number", required: true, min: 0 });
  });

  it("defaults status to requires_action", () => {
    const f = Payments.fields.find((x) => "name" in x && x.name === "status");
    expect(f).toMatchObject({ type: "select", defaultValue: "requires_action" });
  });

  it("has 8 fields", () => {
    expect(Payments.fields).toHaveLength(8);
  });

  it("applies the standard access rules", () => {
    expect(Payments.access?.read).toBe(isAuthenticated);
    expect(Payments.access?.create).toBe(isAuthenticated);
    expect(Payments.access?.update).toBe(isAuthenticated);
    expect(Payments.access?.delete).toBe(isSuperAdmin);
  });
});
