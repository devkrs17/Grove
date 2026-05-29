import { describe, it, expect } from "vitest";
import { LedgerEntries } from "./ledger-entries";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("LedgerEntries collection", () => {
  it("has slug 'ledger-entries'", () => {
    expect(LedgerEntries.slug).toBe("ledger-entries");
  });

  it("has a required transactionId field", () => {
    const f = LedgerEntries.fields.find(
      (x) => "name" in x && x.name === "transactionId",
    );
    expect(f).toMatchObject({ type: "text", required: true });
  });

  it("has a required direction select (debit/credit)", () => {
    const f = LedgerEntries.fields.find(
      (x) => "name" in x && x.name === "direction",
    ) as { options: unknown };
    expect(f.options).toEqual([
      { label: "Debit", value: "debit" },
      { label: "Credit", value: "credit" },
    ]);
  });

  it("has a required amount number with min 0", () => {
    const f = LedgerEntries.fields.find((x) => "name" in x && x.name === "amount");
    expect(f).toMatchObject({ type: "number", required: true, min: 0 });
  });

  it("has 9 fields", () => {
    expect(LedgerEntries.fields).toHaveLength(9);
  });

  it("is immutable: read/create open, update/delete super-admin only", () => {
    expect(LedgerEntries.access?.read).toBe(isAuthenticated);
    expect(LedgerEntries.access?.create).toBe(isAuthenticated);
    expect(LedgerEntries.access?.update).toBe(isSuperAdmin);
    expect(LedgerEntries.access?.delete).toBe(isSuperAdmin);
  });
});
