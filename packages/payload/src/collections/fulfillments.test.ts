import { describe, it, expect } from "vitest";
import { Fulfillments } from "./fulfillments";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Fulfillments collection", () => {
  it("has slug 'fulfillments'", () => {
    expect(Fulfillments.slug).toBe("fulfillments");
  });

  it("has no custom admin title (defaults to id)", () => {
    expect(Fulfillments.admin).toBeUndefined();
  });

  it("has a required order relationship to orders", () => {
    const f = Fulfillments.fields.find((x) => "name" in x && x.name === "order");
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "orders",
      required: true,
    });
  });

  it("defaults status to assigned", () => {
    const f = Fulfillments.fields.find((x) => "name" in x && x.name === "status");
    expect(f).toMatchObject({ type: "select", defaultValue: "assigned" });
  });

  it("has 7 fields", () => {
    expect(Fulfillments.fields).toHaveLength(7);
  });

  it("applies the standard access rules", () => {
    expect(Fulfillments.access?.read).toBe(isAuthenticated);
    expect(Fulfillments.access?.create).toBe(isAuthenticated);
    expect(Fulfillments.access?.update).toBe(isAuthenticated);
    expect(Fulfillments.access?.delete).toBe(isSuperAdmin);
  });
});
