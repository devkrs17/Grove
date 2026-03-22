import { describe, it, expect } from "vitest";
import { Sites } from "./sites";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Sites collection", () => {
  it("has slug 'sites'", () => {
    expect(Sites.slug).toBe("sites");
  });

  it("uses name as admin title", () => {
    expect(Sites.admin?.useAsTitle).toBe("name");
  });

  it("has required name field", () => {
    const field = Sites.fields.find((f) => "name" in f && f.name === "name");
    expect(field).toMatchObject({ type: "text", required: true });
  });

  it("has required unique slug field", () => {
    const field = Sites.fields.find((f) => "name" in f && f.name === "slug");
    expect(field).toMatchObject({ type: "text", required: true, unique: true });
  });

  it("has optional domain field", () => {
    const field = Sites.fields.find((f) => "name" in f && f.name === "domain");
    expect(field).toMatchObject({ type: "text" });
  });

  it("has description textarea field", () => {
    const field = Sites.fields.find(
      (f) => "name" in f && f.name === "description",
    );
    expect(field).toMatchObject({ type: "textarea" });
  });

  it("has exactly 4 fields", () => {
    expect(Sites.fields).toHaveLength(4);
  });

  it("allows read for authenticated users", () => {
    expect(Sites.access?.read).toBe(isAuthenticated);
  });

  it("restricts create to super admin", () => {
    expect(Sites.access?.create).toBe(isSuperAdmin);
  });

  it("restricts update to super admin", () => {
    expect(Sites.access?.update).toBe(isSuperAdmin);
  });

  it("restricts delete to super admin", () => {
    expect(Sites.access?.delete).toBe(isSuperAdmin);
  });
});
