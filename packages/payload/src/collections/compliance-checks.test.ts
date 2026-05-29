import { describe, it, expect } from "vitest";
import { ComplianceChecks } from "./compliance-checks";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("ComplianceChecks collection", () => {
  it("has slug 'compliance-checks'", () => {
    expect(ComplianceChecks.slug).toBe("compliance-checks");
  });

  it("has no custom admin title (defaults to id)", () => {
    expect(ComplianceChecks.admin).toBeUndefined();
  });

  it("has a required subjectType select field", () => {
    const f = ComplianceChecks.fields.find(
      (x) => "name" in x && x.name === "subjectType",
    );
    expect(f).toMatchObject({ type: "select", required: true });
  });

  it("has a required checkType select field", () => {
    const f = ComplianceChecks.fields.find(
      (x) => "name" in x && x.name === "checkType",
    );
    expect(f).toMatchObject({ type: "select", required: true });
  });

  it("has a result json field", () => {
    const f = ComplianceChecks.fields.find(
      (x) => "name" in x && x.name === "result",
    );
    expect(f).toMatchObject({ type: "json" });
  });

  it("has 8 fields", () => {
    expect(ComplianceChecks.fields).toHaveLength(8);
  });

  it("applies the standard access rules", () => {
    expect(ComplianceChecks.access?.read).toBe(isAuthenticated);
    expect(ComplianceChecks.access?.create).toBe(isAuthenticated);
    expect(ComplianceChecks.access?.update).toBe(isAuthenticated);
    expect(ComplianceChecks.access?.delete).toBe(isSuperAdmin);
  });
});
