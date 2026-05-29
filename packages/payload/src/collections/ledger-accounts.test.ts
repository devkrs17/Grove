import { describe, it, expect } from "vitest";
import { LedgerAccounts } from "./ledger-accounts";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("LedgerAccounts collection", () => {
  it("has slug 'ledger-accounts'", () => {
    expect(LedgerAccounts.slug).toBe("ledger-accounts");
  });

  it("uses name as admin title", () => {
    expect(LedgerAccounts.admin?.useAsTitle).toBe("name");
  });

  it("has a required type select field", () => {
    const f = LedgerAccounts.fields.find((x) => "name" in x && x.name === "type");
    expect(f).toMatchObject({ type: "select", required: true });
  });

  it("defaults ownerType to platform", () => {
    const f = LedgerAccounts.fields.find(
      (x) => "name" in x && x.name === "ownerType",
    );
    expect(f).toMatchObject({ type: "select", defaultValue: "platform" });
  });

  it("has 5 fields", () => {
    expect(LedgerAccounts.fields).toHaveLength(5);
  });

  it("applies the standard access rules", () => {
    expect(LedgerAccounts.access?.read).toBe(isAuthenticated);
    expect(LedgerAccounts.access?.create).toBe(isAuthenticated);
    expect(LedgerAccounts.access?.update).toBe(isAuthenticated);
    expect(LedgerAccounts.access?.delete).toBe(isSuperAdmin);
  });
});
