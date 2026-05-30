import { describe, it, expect } from "vitest";
import type { Product as PayloadProduct } from "@grove/types";
import { mapProduct, mapProducts, productHref } from "./storefront";

function makeDoc(overrides: Partial<PayloadProduct> = {}): PayloadProduct {
  return {
    id: 7,
    name: "Sour Grapes",
    price: 44,
    slug: "sour-grapes",
    subtitle: "Indica · live resin vape · 1g",
    description: "Grape-forward and smooth",
    category: "Vapes",
    strainType: "Indica",
    effect: "chill",
    thcLabel: "82% THCa",
    lot: "0421-A",
    tag: "Best seller",
    imageId: "1603909223429-69bb7101f420",
    terpenes: "Limonene · Myrcene",
    ...overrides,
  } as unknown as PayloadProduct;
}

describe("productHref", () => {
  it("builds the product detail path", () => {
    expect(productHref("sour-grapes")).toBe("/products/sour-grapes");
  });
});

describe("mapProduct", () => {
  it("maps every Payload field to its view-model counterpart", () => {
    expect(mapProduct(makeDoc())).toEqual({
      id: "7",
      slug: "sour-grapes",
      name: "Sour Grapes",
      meta: "Indica · live resin vape · 1g",
      price: 44,
      tag: "Best seller",
      category: "Vapes",
      effect: "chill",
      type: "Indica",
      thc: "82% THCa",
      img: "1603909223429-69bb7101f420",
      lot: "0421-A",
      description: "Grape-forward and smooth",
      terpenes: "Limonene · Myrcene",
    });
  });

  it("falls back to the id as slug when the product has no slug", () => {
    const view = mapProduct(makeDoc({ slug: null }));
    expect(view.slug).toBe("7");
  });

  it("collapses null display fields to empty strings so cards still render", () => {
    const view = mapProduct(
      makeDoc({
        subtitle: null,
        tag: null,
        category: null,
        effect: null,
        strainType: null,
        thcLabel: null,
        imageId: null,
        lot: null,
      }),
    );
    expect(view.meta).toBe("");
    expect(view.tag).toBe("");
    expect(view.category).toBe("");
    expect(view.effect).toBe("");
    expect(view.type).toBe("");
    expect(view.thc).toBe("");
    expect(view.img).toBe("");
    expect(view.lot).toBe("");
  });

  it("leaves optional PDP fields undefined when absent", () => {
    const view = mapProduct(makeDoc({ description: null, terpenes: null }));
    expect(view.description).toBeUndefined();
    expect(view.terpenes).toBeUndefined();
  });

  it("prefers the uploaded Media image URL over imageId", () => {
    const view = mapProduct(
      makeDoc({
        featuredImage: { id: 3, url: "/api/media/file/sour-grapes.jpg" },
        imageId: "1603909223429-69bb7101f420",
      } as Partial<PayloadProduct>),
    );
    expect(view.img).toBe("/api/media/file/sour-grapes.jpg");
  });

  it("falls back to imageId when featuredImage is an unpopulated id (depth 0)", () => {
    const view = mapProduct(
      makeDoc({ featuredImage: 3, imageId: "1603909223429-69bb7101f420" } as Partial<PayloadProduct>),
    );
    expect(view.img).toBe("1603909223429-69bb7101f420");
  });

  it("falls back to imageId when the uploaded image record has no URL", () => {
    const view = mapProduct(
      makeDoc({
        featuredImage: { id: 3, url: null },
        imageId: "1603909223429-69bb7101f420",
      } as Partial<PayloadProduct>),
    );
    expect(view.img).toBe("1603909223429-69bb7101f420");
  });
});

describe("mapProducts", () => {
  it("maps a list preserving order", () => {
    const views = mapProducts([
      makeDoc({ id: 1, name: "A", slug: "a" }),
      makeDoc({ id: 2, name: "B", slug: "b" }),
    ]);
    expect(views.map((v) => v.id)).toEqual(["1", "2"]);
    expect(views.map((v) => v.name)).toEqual(["A", "B"]);
  });

  it("returns an empty array for no docs", () => {
    expect(mapProducts([])).toEqual([]);
  });
});
