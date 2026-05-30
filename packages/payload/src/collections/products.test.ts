import { describe, it, expect } from "vitest";
import { Products } from "./products";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Products collection", () => {
  it("has slug 'products'", () => {
    expect(Products.slug).toBe("products");
  });

  it("uses name as admin title", () => {
    expect(Products.admin?.useAsTitle).toBe("name");
  });

  it("has required name text field", () => {
    const name = Products.fields.find(
      (f) => "name" in f && f.name === "name",
    );
    expect(name).toMatchObject({ type: "text", required: true });
  });

  it("has required price number field with min 0", () => {
    const price = Products.fields.find(
      (f) => "name" in f && f.name === "price",
    );
    expect(price).toMatchObject({ type: "number", required: true, min: 0 });
  });

  it("has status select field defaulting to draft", () => {
    const status = Products.fields.find(
      (f) => "name" in f && f.name === "status",
    );
    expect(status).toMatchObject({ type: "select", defaultValue: "draft" });
  });

  it("has draft and published status options", () => {
    const status = Products.fields.find(
      (f) => "name" in f && f.name === "status",
    ) as any;
    expect(status.options).toEqual([
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
    ]);
  });

  it("has exactly 15 fields", () => {
    expect(Products.fields).toHaveLength(15);
  });

  it("has a featuredImage upload field relating to the media library", () => {
    const image = Products.fields.find((f) => "name" in f && f.name === "featuredImage");
    expect(image).toMatchObject({ type: "upload", relationTo: "media" });
  });

  it("has an optional slug text field for storefront URLs", () => {
    const slug = Products.fields.find((f) => "name" in f && f.name === "slug");
    expect(slug).toMatchObject({ type: "text" });
    // slug is optional — derived from name on import when blank.
    expect((slug as { required?: boolean }).required).toBeUndefined();
  });

  it("has a category select scoped to the storefront's verticals", () => {
    const category = Products.fields.find(
      (f) => "name" in f && f.name === "category",
    ) as { type: string; options: { value: string }[] };
    expect(category.type).toBe("select");
    expect(category.options.map((o) => o.value)).toEqual([
      "Flower",
      "Concentrates",
      "Vapes",
      "Pre-rolls",
      "Edibles",
    ]);
  });

  it("has a strainType select of Indica/Sativa/Hybrid", () => {
    const strain = Products.fields.find(
      (f) => "name" in f && f.name === "strainType",
    ) as { type: string; options: { value: string }[] };
    expect(strain.type).toBe("select");
    expect(strain.options.map((o) => o.value)).toEqual(["Indica", "Sativa", "Hybrid"]);
  });

  it("stores effect as the storefront's lowercase id so cards filter without a lookup", () => {
    const effect = Products.fields.find(
      (f) => "name" in f && f.name === "effect",
    ) as { type: string; options: { value: string }[] };
    expect(effect.type).toBe("select");
    expect(effect.options.map((o) => o.value)).toEqual([
      "sleep",
      "chill",
      "euphoric",
      "creative",
      "focus",
    ]);
  });

  it.each(["subtitle", "description", "thcLabel", "lot", "tag", "imageId", "terpenes"])(
    "has a descriptive %s field",
    (fieldName) => {
      const field = Products.fields.find((f) => "name" in f && f.name === fieldName);
      expect(field).toBeDefined();
    },
  );

  it("allows read for authenticated users", () => {
    expect(Products.access?.read).toBe(isAuthenticated);
  });

  it("allows create for authenticated users", () => {
    expect(Products.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(Products.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(Products.access?.delete).toBe(isSuperAdmin);
  });
});
