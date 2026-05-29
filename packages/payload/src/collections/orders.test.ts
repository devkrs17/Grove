import { describe, it, expect } from "vitest";
import { Orders } from "./orders";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Orders collection", () => {
  it("has slug 'orders'", () => {
    expect(Orders.slug).toBe("orders");
  });

  it("uses orderNumber as admin title", () => {
    expect(Orders.admin?.useAsTitle).toBe("orderNumber");
  });

  it("has a required unique orderNumber field", () => {
    const f = Orders.fields.find((x) => "name" in x && x.name === "orderNumber");
    expect(f).toMatchObject({ type: "text", required: true, unique: true });
  });

  it("has an items array field", () => {
    const f = Orders.fields.find((x) => "name" in x && x.name === "items");
    expect(f).toMatchObject({ type: "array" });
  });

  it("has a required total number field with min 0", () => {
    const f = Orders.fields.find((x) => "name" in x && x.name === "total");
    expect(f).toMatchObject({ type: "number", required: true, min: 0 });
  });

  it("defaults status to pending", () => {
    const f = Orders.fields.find((x) => "name" in x && x.name === "status");
    expect(f).toMatchObject({ type: "select", defaultValue: "pending" });
  });

  it("has 13 fields", () => {
    expect(Orders.fields).toHaveLength(13);
  });

  it("applies the standard access rules", () => {
    expect(Orders.access?.read).toBe(isAuthenticated);
    expect(Orders.access?.create).toBe(isAuthenticated);
    expect(Orders.access?.update).toBe(isAuthenticated);
    expect(Orders.access?.delete).toBe(isSuperAdmin);
  });
});
