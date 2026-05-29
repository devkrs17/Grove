import { describe, it, expect } from "vitest";
import { PartnerLocations } from "./partner-locations";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("PartnerLocations collection", () => {
  it("has slug 'partner-locations'", () => {
    expect(PartnerLocations.slug).toBe("partner-locations");
  });

  it("uses label as admin title", () => {
    expect(PartnerLocations.admin?.useAsTitle).toBe("label");
  });

  it("has a required partner relationship to partners", () => {
    const f = PartnerLocations.fields.find(
      (x) => "name" in x && x.name === "partner",
    );
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "partners",
      required: true,
    });
  });

  it("has a serviceRadiusKm number field defaulting to 0", () => {
    const f = PartnerLocations.fields.find(
      (x) => "name" in x && x.name === "serviceRadiusKm",
    );
    expect(f).toMatchObject({ type: "number", defaultValue: 0, min: 0 });
  });

  it("has an active checkbox defaulting to true", () => {
    const f = PartnerLocations.fields.find(
      (x) => "name" in x && x.name === "active",
    );
    expect(f).toMatchObject({ type: "checkbox", defaultValue: true });
  });

  it("has 7 fields", () => {
    expect(PartnerLocations.fields).toHaveLength(7);
  });

  it("applies the standard access rules", () => {
    expect(PartnerLocations.access?.read).toBe(isAuthenticated);
    expect(PartnerLocations.access?.create).toBe(isAuthenticated);
    expect(PartnerLocations.access?.update).toBe(isAuthenticated);
    expect(PartnerLocations.access?.delete).toBe(isSuperAdmin);
  });
});
