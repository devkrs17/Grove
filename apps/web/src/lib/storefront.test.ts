import { describe, it, expect } from "vitest";
import type { Product as PayloadProduct, LabReport as PayloadLabReport } from "@grove/types";
import {
  mapProduct,
  mapProducts,
  productHref,
  mapLabReport,
  mapLabReports,
  brandFromName,
  flavorFromName,
  formatLabDate,
  brandConfigToCssVars,
} from "./storefront";

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

function makeProduct(overrides: Partial<PayloadProduct> = {}): PayloadProduct {
  return {
    id: 12,
    name: "Blinkers Flip ( Gelato Pie & Pineapple Haze )",
    subtitle: null,
    category: "Flower",
    imageId: "/packs/flip-gelato.jpg",
    ...overrides,
  } as unknown as PayloadProduct;
}

function makeLabDoc(overrides: Partial<PayloadLabReport> = {}): PayloadLabReport {
  return {
    id: 31,
    product: makeProduct(),
    batchLot: "BLK-0422-A",
    potency: "86.4% THCa",
    testedDate: "2026-04-22T00:00:00.000Z",
    lab: "Kaycha Labs",
    status: "pass",
    cannabinoids: [
      { name: "THCa", value: "86.4%" },
      { name: "CBD", value: "0.1%" },
    ],
    safetyScreens: [
      { name: "Pesticides", result: "Pass" },
      { name: "Heavy metals", result: "Pass" },
    ],
    terpenes: "Limonene · Caryophyllene",
    reportFile: null,
    ...overrides,
  } as unknown as PayloadLabReport;
}

describe("brandFromName", () => {
  it("maps each known product family to its brand line", () => {
    expect(brandFromName("Litt 1000mg Watermelon")).toBe("Litt Edibles");
    expect(brandFromName("710 Nomad Rosin Live Hash")).toBe("710 Nomad Rosin");
    expect(brandFromName("Blinkers Flip ( Gelato Pie & Pineapple Haze )")).toBe(
      "Blinkers Flip",
    );
  });

  it("returns an empty string for an unrecognized name", () => {
    expect(brandFromName("Mystery Strain")).toBe("");
  });
});

describe("flavorFromName", () => {
  it("strips the brand prefix and surrounding parens and renders a blend with ×", () => {
    expect(flavorFromName("Blinkers Flip ( Gelato Pie & Pineapple Haze )")).toBe(
      "Gelato Pie × Pineapple Haze",
    );
  });

  it("returns a single flavor inside parens unchanged", () => {
    expect(flavorFromName("Blinkers Flip ( Blue Dream )")).toBe("Blue Dream");
  });

  it("falls back to the brand-stripped name when there are no parens", () => {
    expect(flavorFromName("710 Nomad Rosin Live Hash")).toBe("Live Hash");
  });

  it("returns the whole name when no brand matches and there are no parens", () => {
    expect(flavorFromName("Mystery Strain")).toBe("Mystery Strain");
  });
});

describe("formatLabDate", () => {
  it("formats an ISO date as MMM DD, YYYY from UTC parts", () => {
    expect(formatLabDate("2026-04-22T00:00:00.000Z")).toBe("Apr 22, 2026");
  });

  it("zero-pads single-digit days", () => {
    expect(formatLabDate("2026-01-05T00:00:00.000Z")).toBe("Jan 05, 2026");
  });

  it("returns an empty string for a null/absent date", () => {
    expect(formatLabDate(null)).toBe("");
    expect(formatLabDate(undefined)).toBe("");
    expect(formatLabDate("")).toBe("");
  });

  it("returns an empty string for an unparseable date", () => {
    expect(formatLabDate("not-a-date")).toBe("");
  });
});

describe("mapLabReport", () => {
  it("maps every field for a fully populated report, deriving the Flip flavor", () => {
    expect(mapLabReport(makeLabDoc())).toEqual({
      id: "31",
      productName: "Gelato Pie × Pineapple Haze",
      brand: "Blinkers Flip",
      category: "Flower",
      img: "/packs/flip-gelato.jpg",
      batchLot: "BLK-0422-A",
      potency: "86.4% THCa",
      testedDate: "Apr 22, 2026",
      lab: "Kaycha Labs",
      status: "pass",
      cannabinoids: [
        { name: "THCa", value: "86.4%" },
        { name: "CBD", value: "0.1%" },
      ],
      safetyScreens: [
        { name: "Pesticides", result: "Pass" },
        { name: "Heavy metals", result: "Pass" },
      ],
      terpenes: "Limonene · Caryophyllene",
      reportUrl: "",
    });
  });

  it("prefers the product subtitle over the derived flavor when set", () => {
    const view = mapLabReport(
      makeLabDoc({
        product: makeProduct({
          name: "Litt 1000mg Watermelon",
          subtitle: "Watermelon · 1000mg gummies",
        }),
      }),
    );
    expect(view.productName).toBe("Watermelon · 1000mg gummies");
    expect(view.brand).toBe("Litt Edibles");
  });

  it("derives the 710 Nomad Rosin brand and flavor", () => {
    const view = mapLabReport(
      makeLabDoc({
        product: makeProduct({ name: "710 Nomad Rosin Live Hash", subtitle: null }),
      }),
    );
    expect(view.brand).toBe("710 Nomad Rosin");
    expect(view.productName).toBe("Live Hash");
  });

  it("prefers the populated featuredImage URL over the product imageId", () => {
    const view = mapLabReport(
      makeLabDoc({
        product: makeProduct({
          featuredImage: { id: 9, url: "/api/media/file/flip.jpg" },
        } as Partial<PayloadProduct>),
      }),
    );
    expect(view.img).toBe("/api/media/file/flip.jpg");
  });

  it("collapses product-derived fields to empty strings when the product is unpopulated", () => {
    const view = mapLabReport(makeLabDoc({ product: 12 }));
    expect(view.productName).toBe("");
    expect(view.brand).toBe("");
    expect(view.category).toBe("");
    expect(view.img).toBe("");
  });

  it("collapses null cannabinoids, safetyScreens, and report fields to empty defaults", () => {
    const view = mapLabReport(
      makeLabDoc({
        product: makeProduct({ category: null, imageId: null }),
        potency: null,
        testedDate: null,
        lab: null,
        status: null,
        cannabinoids: null,
        safetyScreens: null,
        terpenes: null,
        reportFile: null,
      }),
    );
    expect(view.category).toBe("");
    expect(view.img).toBe("");
    expect(view.potency).toBe("");
    expect(view.testedDate).toBe("");
    expect(view.lab).toBe("");
    expect(view.status).toBe("");
    expect(view.cannabinoids).toEqual([]);
    expect(view.safetyScreens).toEqual([]);
    expect(view.terpenes).toBe("");
    expect(view.reportUrl).toBe("");
  });

  it("defaults missing names/values/results inside the arrays to empty strings", () => {
    const view = mapLabReport(
      makeLabDoc({
        cannabinoids: [{ value: "5%" }, { name: "CBG" }],
        safetyScreens: [{ result: "Pass" }, { name: "Mycotoxins" }],
      } as Partial<PayloadLabReport>),
    );
    expect(view.cannabinoids).toEqual([
      { name: "", value: "5%" },
      { name: "CBG", value: "" },
    ]);
    expect(view.safetyScreens).toEqual([
      { name: "", result: "Pass" },
      { name: "Mycotoxins", result: "" },
    ]);
  });

  it("uses the populated report file URL when a COA PDF is attached", () => {
    const view = mapLabReport(
      makeLabDoc({ reportFile: { id: 5, url: "/api/media/file/coa.pdf" } } as Partial<PayloadLabReport>),
    );
    expect(view.reportUrl).toBe("/api/media/file/coa.pdf");
  });

  it("falls back to empty when the populated report file has no URL", () => {
    const view = mapLabReport(
      makeLabDoc({ reportFile: { id: 5, url: null } } as Partial<PayloadLabReport>),
    );
    expect(view.reportUrl).toBe("");
  });
});

describe("mapLabReports", () => {
  it("maps a list preserving order", () => {
    const views = mapLabReports([
      makeLabDoc({ id: 1 }),
      makeLabDoc({ id: 2 }),
    ]);
    expect(views.map((v) => v.id)).toEqual(["1", "2"]);
  });

  it("returns an empty array for no docs", () => {
    expect(mapLabReports([])).toEqual([]);
  });
});

describe("brandConfigToCssVars", () => {
  it("returns no overrides for a null BrandConfig (defaults render)", () => {
    expect(brandConfigToCssVars(null)).toEqual({});
  });

  it("returns no overrides when colors are unset", () => {
    expect(brandConfigToCssVars({ primaryColor: null, secondaryColor: null })).toEqual({});
  });

  // Encodes the seed's mapping contract: primaryColor themes the dominant --ink
  // and secondaryColor themes the --lime accent. If the storefront ever remaps
  // these slots, this assertion must change with it — a tenant's saved colors
  // would otherwise silently land on the wrong elements.
  it("maps primaryColor to --ink and secondaryColor to --lime", () => {
    expect(
      brandConfigToCssVars({ primaryColor: "#14130d", secondaryColor: "#c2f04a" }),
    ).toEqual({ "--ink": "#14130d", "--lime": "#c2f04a" });
  });

  it("emits only the colors that are set", () => {
    expect(brandConfigToCssVars({ primaryColor: "#222", secondaryColor: null })).toEqual({
      "--ink": "#222",
    });
    expect(brandConfigToCssVars({ primaryColor: null, secondaryColor: "#0f0" })).toEqual({
      "--lime": "#0f0",
    });
  });
});
