import { describe, it, expect } from "vitest";
import { AuditLogs } from "./audit-logs";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("AuditLogs collection", () => {
  it("has slug 'audit-logs'", () => {
    expect(AuditLogs.slug).toBe("audit-logs");
  });

  it("uses action as admin title", () => {
    expect(AuditLogs.admin?.useAsTitle).toBe("action");
  });

  it("has a required action field", () => {
    const f = AuditLogs.fields.find((x) => "name" in x && x.name === "action");
    expect(f).toMatchObject({ type: "text", required: true });
  });

  it("defaults actorType to system", () => {
    const f = AuditLogs.fields.find((x) => "name" in x && x.name === "actorType");
    expect(f).toMatchObject({ type: "select", defaultValue: "system" });
  });

  it("has a metadata json field", () => {
    const f = AuditLogs.fields.find((x) => "name" in x && x.name === "metadata");
    expect(f).toMatchObject({ type: "json" });
  });

  it("has 8 fields", () => {
    expect(AuditLogs.fields).toHaveLength(8);
  });

  it("is append-only: read/create open, update/delete super-admin only", () => {
    expect(AuditLogs.access?.read).toBe(isAuthenticated);
    expect(AuditLogs.access?.create).toBe(isAuthenticated);
    expect(AuditLogs.access?.update).toBe(isSuperAdmin);
    expect(AuditLogs.access?.delete).toBe(isSuperAdmin);
  });
});
