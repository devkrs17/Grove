import { describe, it, expect } from "vitest";
import { ServiceRequests } from "./service-requests";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("ServiceRequests collection", () => {
  it("has slug 'service-requests'", () => {
    expect(ServiceRequests.slug).toBe("service-requests");
  });

  it("uses title as admin title", () => {
    expect(ServiceRequests.admin?.useAsTitle).toBe("title");
  });

  it("has required title field", () => {
    const field = ServiceRequests.fields.find(
      (f) => "name" in f && f.name === "title",
    );
    expect(field).toMatchObject({ type: "text", required: true });
  });

  it("has required description field", () => {
    const field = ServiceRequests.fields.find(
      (f) => "name" in f && f.name === "description",
    );
    expect(field).toMatchObject({ type: "textarea", required: true });
  });

  it("has optional site relationship field", () => {
    const field = ServiceRequests.fields.find(
      (f) => "name" in f && f.name === "site",
    );
    expect(field).toMatchObject({ type: "relationship", relationTo: "sites" });
  });

  it("has status select field defaulting to pending", () => {
    const field = ServiceRequests.fields.find(
      (f) => "name" in f && f.name === "status",
    ) as any;
    expect(field).toMatchObject({ type: "select", defaultValue: "pending" });
    expect(field.options).toHaveLength(4);
  });

  it("has priority select field defaulting to medium", () => {
    const field = ServiceRequests.fields.find(
      (f) => "name" in f && f.name === "priority",
    ) as any;
    expect(field).toMatchObject({ type: "select", defaultValue: "medium" });
    expect(field.options).toHaveLength(3);
  });

  it("has requestedBy relationship to users", () => {
    const field = ServiceRequests.fields.find(
      (f) => "name" in f && f.name === "requestedBy",
    );
    expect(field).toMatchObject({ type: "relationship", relationTo: "users" });
  });

  it("has exactly 6 fields", () => {
    expect(ServiceRequests.fields).toHaveLength(6);
  });

  it("allows read for authenticated users", () => {
    expect(ServiceRequests.access?.read).toBe(isAuthenticated);
  });

  it("allows create for authenticated users", () => {
    expect(ServiceRequests.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(ServiceRequests.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(ServiceRequests.access?.delete).toBe(isSuperAdmin);
  });
});
