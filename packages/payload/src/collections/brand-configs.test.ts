import { describe, it, expect } from "vitest";
import { BrandConfigs } from "./brand-configs";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("BrandConfigs collection", () => {
  it("has slug 'brand-configs'", () => {
    expect(BrandConfigs.slug).toBe("brand-configs");
  });

  it("has required site relationship field", () => {
    const field = BrandConfigs.fields.find(
      (f) => "name" in f && f.name === "site",
    );
    expect(field).toMatchObject({
      type: "relationship",
      relationTo: "sites",
      required: true,
    });
  });

  it("has logo upload field", () => {
    const field = BrandConfigs.fields.find(
      (f) => "name" in f && f.name === "logo",
    );
    expect(field).toMatchObject({ type: "upload", relationTo: "media" });
  });

  it("has primaryColor text field", () => {
    const field = BrandConfigs.fields.find(
      (f) => "name" in f && f.name === "primaryColor",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has secondaryColor text field", () => {
    const field = BrandConfigs.fields.find(
      (f) => "name" in f && f.name === "secondaryColor",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has typography json field", () => {
    const field = BrandConfigs.fields.find(
      (f) => "name" in f && f.name === "typography",
    );
    expect(field).toMatchObject({ type: "json" });
  });

  // Gates the regulated-goods (COA/lab-report) vertical in the storefront.
  // Defaults off so a generic tenant opts in rather than having to opt out.
  it("has showLabReports checkbox field defaulting off", () => {
    const field = BrandConfigs.fields.find(
      (f) => "name" in f && f.name === "showLabReports",
    );
    expect(field).toMatchObject({ type: "checkbox", defaultValue: false });
  });

  it("has exactly 6 fields", () => {
    expect(BrandConfigs.fields).toHaveLength(6);
  });

  it("allows read for authenticated users", () => {
    expect(BrandConfigs.access?.read).toBe(isAuthenticated);
  });

  it("allows create for authenticated users", () => {
    expect(BrandConfigs.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(BrandConfigs.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(BrandConfigs.access?.delete).toBe(isSuperAdmin);
  });
});
