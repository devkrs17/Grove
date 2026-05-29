import { describe, it, expect } from "vitest";
import { InventoryLevels } from "./inventory-levels";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("InventoryLevels collection", () => {
  it("has slug 'inventory-levels'", () => {
    expect(InventoryLevels.slug).toBe("inventory-levels");
  });

  it("has no custom admin title (defaults to id)", () => {
    expect(InventoryLevels.admin).toBeUndefined();
  });

  it("has a required product relationship to products", () => {
    const f = InventoryLevels.fields.find(
      (x) => "name" in x && x.name === "product",
    );
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "products",
      required: true,
    });
  });

  it("has a required partnerLocation relationship", () => {
    const f = InventoryLevels.fields.find(
      (x) => "name" in x && x.name === "partnerLocation",
    );
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "partner-locations",
      required: true,
    });
  });

  it("has quantity fields defaulting to 0", () => {
    const avail = InventoryLevels.fields.find(
      (x) => "name" in x && x.name === "quantityAvailable",
    );
    expect(avail).toMatchObject({ type: "number", defaultValue: 0, min: 0 });
  });

  it("has 4 fields", () => {
    expect(InventoryLevels.fields).toHaveLength(4);
  });

  it("applies the standard access rules", () => {
    expect(InventoryLevels.access?.read).toBe(isAuthenticated);
    expect(InventoryLevels.access?.create).toBe(isAuthenticated);
    expect(InventoryLevels.access?.update).toBe(isAuthenticated);
    expect(InventoryLevels.access?.delete).toBe(isSuperAdmin);
  });
});
