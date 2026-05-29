import { describe, it, expect } from "vitest";
import { PayoutBatches } from "./payout-batches";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("PayoutBatches collection", () => {
  it("has slug 'payout-batches'", () => {
    expect(PayoutBatches.slug).toBe("payout-batches");
  });

  it("has no custom admin title (defaults to id)", () => {
    expect(PayoutBatches.admin).toBeUndefined();
  });

  it("defaults status to pending", () => {
    const f = PayoutBatches.fields.find((x) => "name" in x && x.name === "status");
    expect(f).toMatchObject({ type: "select", defaultValue: "pending" });
  });

  it("has a totalAmount number field defaulting to 0", () => {
    const f = PayoutBatches.fields.find(
      (x) => "name" in x && x.name === "totalAmount",
    );
    expect(f).toMatchObject({ type: "number", defaultValue: 0, min: 0 });
  });

  it("has 5 fields", () => {
    expect(PayoutBatches.fields).toHaveLength(5);
  });

  it("applies the standard access rules", () => {
    expect(PayoutBatches.access?.read).toBe(isAuthenticated);
    expect(PayoutBatches.access?.create).toBe(isAuthenticated);
    expect(PayoutBatches.access?.update).toBe(isAuthenticated);
    expect(PayoutBatches.access?.delete).toBe(isSuperAdmin);
  });
});
