import { describe, it, expect } from "vitest";
import { Customers } from "./customers";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Customers collection", () => {
  it("has slug 'customers'", () => {
    expect(Customers.slug).toBe("customers");
  });

  it("uses email as admin title", () => {
    expect(Customers.admin?.useAsTitle).toBe("email");
  });

  it("has required unique email field", () => {
    const field = Customers.fields.find(
      (f) => "name" in f && f.name === "email",
    );
    expect(field).toMatchObject({
      type: "email",
      required: true,
      unique: true,
    });
  });

  it("has firstName text field", () => {
    const field = Customers.fields.find(
      (f) => "name" in f && f.name === "firstName",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has lastName text field", () => {
    const field = Customers.fields.find(
      (f) => "name" in f && f.name === "lastName",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has required site relationship field", () => {
    const field = Customers.fields.find(
      (f) => "name" in f && f.name === "site",
    );
    expect(field).toMatchObject({
      type: "relationship",
      relationTo: "sites",
      required: true,
    });
  });

  it("has exactly 4 fields", () => {
    expect(Customers.fields).toHaveLength(4);
  });

  it("allows read for authenticated users", () => {
    expect(Customers.access?.read).toBe(isAuthenticated);
  });

  it("allows create for authenticated users", () => {
    expect(Customers.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(Customers.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(Customers.access?.delete).toBe(isSuperAdmin);
  });
});
