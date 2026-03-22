import { describe, it, expect } from "vitest";
import { Products } from "./products";

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

  it("has exactly 3 fields", () => {
    expect(Products.fields).toHaveLength(3);
  });
});
