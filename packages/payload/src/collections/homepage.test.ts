import { describe, it, expect } from "vitest";
import { Homepage } from "./homepage";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Homepage collection", () => {
  it("has slug 'homepage'", () => {
    expect(Homepage.slug).toBe("homepage");
  });

  it("uses heroHeadline as admin title", () => {
    expect(Homepage.admin?.useAsTitle).toBe("heroHeadline");
  });

  it("has announcement text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "announcement",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroEyebrow text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroEyebrow",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has required heroHeadline text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroHeadline",
    );
    expect(field).toMatchObject({ type: "text", required: true });
  });

  it("has heroHighlight text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroHighlight",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroSubhead textarea field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroSubhead",
    );
    expect(field).toMatchObject({ type: "textarea" });
  });

  it("has heroImage upload field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroImage",
    );
    expect(field).toMatchObject({ type: "upload", relationTo: "media" });
  });

  it("has heroRating text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroRating",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroCtaPrimaryLabel text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroCtaPrimaryLabel",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroCtaPrimaryHref text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroCtaPrimaryHref",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroCtaSecondaryLabel text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroCtaSecondaryLabel",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroCtaSecondaryHref text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroCtaSecondaryHref",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has heroStickers array of { text }", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "heroStickers",
    ) as any;
    expect(field).toMatchObject({ type: "array" });
    expect(field.fields).toEqual([{ name: "text", type: "text" }]);
  });

  it("has marqueeItems array of { text }", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "marqueeItems",
    ) as any;
    expect(field).toMatchObject({ type: "array" });
    expect(field.fields).toEqual([{ name: "text", type: "text" }]);
  });

  it("has featuredHeading text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "featuredHeading",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has featuredProducts hasMany relationship to products", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "featuredProducts",
    );
    expect(field).toMatchObject({
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    });
  });

  it("has categoryTiles array with label, category select, image upload", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "categoryTiles",
    ) as any;
    expect(field).toMatchObject({ type: "array" });

    const label = field.fields.find((f: any) => f.name === "label");
    expect(label).toMatchObject({ type: "text" });

    const category = field.fields.find((f: any) => f.name === "category");
    expect(category).toMatchObject({ type: "select" });
    expect(category.options).toEqual([
      { label: "Flower", value: "Flower" },
      { label: "Concentrates", value: "Concentrates" },
      { label: "Vapes", value: "Vapes" },
      { label: "Pre-rolls", value: "Pre-rolls" },
      { label: "Edibles", value: "Edibles" },
    ]);

    const image = field.fields.find((f: any) => f.name === "image");
    expect(image).toMatchObject({ type: "upload", relationTo: "media" });
  });

  it("category tile options match the products.category options", async () => {
    const { Products } = await import("./products");
    const tiles = Homepage.fields.find(
      (f) => "name" in f && f.name === "categoryTiles",
    ) as any;
    const tileCategory = tiles.fields.find(
      (f: any) => f.name === "category",
    );
    const productCategory = Products.fields.find(
      (f) => "name" in f && f.name === "category",
    ) as any;
    expect(tileCategory.options).toEqual(productCategory.options);
  });

  it("has storyHeading text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "storyHeading",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has storyBody richText field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "storyBody",
    );
    expect(field).toMatchObject({ type: "richText" });
  });

  it("has storyImage upload field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "storyImage",
    );
    expect(field).toMatchObject({ type: "upload", relationTo: "media" });
  });

  it("has reviewsHeading text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "reviewsHeading",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has reviews array of { title, body, author, badge }", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "reviews",
    ) as any;
    expect(field).toMatchObject({ type: "array" });
    expect(field.fields).toEqual([
      { name: "title", type: "text" },
      { name: "body", type: "textarea" },
      { name: "author", type: "text" },
      { name: "badge", type: "text" },
    ]);
  });

  it("has emailHeading text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "emailHeading",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has emailSub text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "emailSub",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has emailCta text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "emailCta",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has metaTitle text field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "metaTitle",
    );
    expect(field).toMatchObject({ type: "text" });
  });

  it("has metaDescription textarea field", () => {
    const field = Homepage.fields.find(
      (f) => "name" in f && f.name === "metaDescription",
    );
    expect(field).toMatchObject({ type: "textarea" });
  });

  it("allows read for authenticated users", () => {
    expect(Homepage.access?.read).toBe(isAuthenticated);
  });

  it("allows create for authenticated users", () => {
    expect(Homepage.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(Homepage.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(Homepage.access?.delete).toBe(isSuperAdmin);
  });
});
