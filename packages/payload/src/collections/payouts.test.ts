import { describe, it, expect } from "vitest";
import { Payouts } from "./payouts";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Payouts collection", () => {
  it("has slug 'payouts'", () => {
    expect(Payouts.slug).toBe("payouts");
  });

  it("has no custom admin title (defaults to id)", () => {
    expect(Payouts.admin).toBeUndefined();
  });

  it("has a required batch relationship to payout-batches", () => {
    const f = Payouts.fields.find((x) => "name" in x && x.name === "batch");
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "payout-batches",
      required: true,
    });
  });

  it("has a required payee relationship to partners", () => {
    const f = Payouts.fields.find((x) => "name" in x && x.name === "payee");
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "partners",
      required: true,
    });
  });

  it("defaults method to ach", () => {
    const f = Payouts.fields.find((x) => "name" in x && x.name === "method");
    expect(f).toMatchObject({ type: "select", defaultValue: "ach" });
  });

  it("has 8 fields", () => {
    expect(Payouts.fields).toHaveLength(8);
  });

  it("applies the standard access rules", () => {
    expect(Payouts.access?.read).toBe(isAuthenticated);
    expect(Payouts.access?.create).toBe(isAuthenticated);
    expect(Payouts.access?.update).toBe(isAuthenticated);
    expect(Payouts.access?.delete).toBe(isSuperAdmin);
  });
});
