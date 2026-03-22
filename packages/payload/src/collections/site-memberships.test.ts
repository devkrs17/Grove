import { describe, it, expect } from "vitest";
import { SiteMemberships } from "./site-memberships";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("SiteMemberships collection", () => {
  it("has slug 'site-memberships'", () => {
    expect(SiteMemberships.slug).toBe("site-memberships");
  });

  it("uses role as admin title", () => {
    expect(SiteMemberships.admin?.useAsTitle).toBe("role");
  });

  it("has required user relationship field", () => {
    const field = SiteMemberships.fields.find(
      (f) => "name" in f && f.name === "user",
    );
    expect(field).toMatchObject({
      type: "relationship",
      relationTo: "users",
      required: true,
    });
  });

  it("has required site relationship field", () => {
    const field = SiteMemberships.fields.find(
      (f) => "name" in f && f.name === "site",
    );
    expect(field).toMatchObject({
      type: "relationship",
      relationTo: "sites",
      required: true,
    });
  });

  it("has required role select field with 3 options", () => {
    const field = SiteMemberships.fields.find(
      (f) => "name" in f && f.name === "role",
    ) as any;
    expect(field).toMatchObject({ type: "select", required: true });
    expect(field.options).toHaveLength(3);
    expect(field.options.map((o: any) => o.value)).toEqual([
      "owner",
      "manager",
      "worker",
    ]);
  });

  it("has exactly 3 fields", () => {
    expect(SiteMemberships.fields).toHaveLength(3);
  });

  it("allows read for authenticated users", () => {
    expect(SiteMemberships.access?.read).toBe(isAuthenticated);
  });

  it("restricts create to super admin", () => {
    expect(SiteMemberships.access?.create).toBe(isSuperAdmin);
  });

  it("restricts update to super admin", () => {
    expect(SiteMemberships.access?.update).toBe(isSuperAdmin);
  });

  it("restricts delete to super admin", () => {
    expect(SiteMemberships.access?.delete).toBe(isSuperAdmin);
  });
});
