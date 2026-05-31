// Pure storefront helpers. Lives in src/lib (coverage-gated to 100%) so the
// Payload → view-model transform that every storefront surface depends on is
// fully tested. Async Payload data-access lives in src/storefront/server.ts
// (a server-only module), keeping this file pure and importable anywhere.

import type {
  Product as PayloadProduct,
  LabReport as PayloadLabReport,
  Media,
  BrandConfig,
} from "@grove/types";
import type { Product, LabReport } from "@/storefront/data";

/**
 * Maps a tenant's BrandConfig to the storefront's themeable CSS custom
 * properties. The storefront stylesheet (kit.css) ships a complete default
 * palette in `:root`; these overrides are layered on the `.storefront` root so a
 * tenant reskins the store from the admin without touching code. Only fields the
 * tenant actually set are emitted, so an empty/partial BrandConfig leaves the
 * defaults intact (the Blinkers tenant's seeded values equal those defaults, so
 * its rendering is unchanged).
 *
 * Mapping follows the seed's convention (packages/payload seed brand-config):
 *   primaryColor   → --ink  (dominant brand color: text, borders, dark buttons)
 *   secondaryColor → --lime (accent: highlights, price pills, CTAs)
 */
export function brandConfigToCssVars(
  brand: Pick<BrandConfig, "primaryColor" | "secondaryColor"> | null,
): Record<string, string> {
  const vars: Record<string, string> = {};
  if (!brand) return vars;
  if (brand.primaryColor) vars["--ink"] = brand.primaryColor;
  if (brand.secondaryColor) vars["--lime"] = brand.secondaryColor;
  return vars;
}

/** Storefront route helper: path to a product detail page. */
export function productHref(slugOrId: string): string {
  return `/products/${slugOrId}`;
}

/**
 * Maps a Payload product document to the storefront view-model the design
 * components consume. Null/absent CMS fields collapse to the empty-string
 * shape the static design data uses, so live and demo data render identically.
 */
export function mapProduct(doc: PayloadProduct): Product {
  // Prefer the uploaded Media image (a populated relationship when fetched with
  // depth >= 1) over the legacy imageId (full URL or Unsplash id). A bare id
  // (depth 0) or an unpopulated relationship collapses to the imageId fallback.
  const uploaded =
    doc.featuredImage && typeof doc.featuredImage === "object" ? doc.featuredImage : null;
  return {
    id: String(doc.id),
    slug: doc.slug ?? String(doc.id),
    name: doc.name,
    meta: doc.subtitle ?? "",
    price: doc.price,
    tag: doc.tag ?? "",
    category: doc.category ?? "",
    effect: doc.effect ?? "",
    type: doc.strainType ?? "",
    thc: doc.thcLabel ?? "",
    img: uploaded?.url ?? doc.imageId ?? "",
    lot: doc.lot ?? "",
    description: doc.description ?? undefined,
    terpenes: doc.terpenes ?? undefined,
  };
}

/** Maps a list of Payload product documents to storefront view-models. */
export function mapProducts(docs: PayloadProduct[]): Product[] {
  return docs.map(mapProduct);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * Derives the brand line from a product name. The seed encodes the line as a
 * prefix on the name; these are the three Blinkers product families. Anything
 * else collapses to "" so the COA card omits the brand.
 */
export function brandFromName(name: string): string {
  if (name.startsWith("Litt")) return "Litt Edibles";
  if (name.startsWith("710 Nomad Rosin")) return "710 Nomad Rosin";
  if (name.startsWith("Blinkers Flip")) return "Blinkers Flip";
  return "";
}

/**
 * Extracts the flavor label from a product name by stripping the brand prefix
 * and surrounding "( … )", then rendering a blend's "&" as "×". E.g.
 * "Blinkers Flip ( Gelato Pie & Pineapple Haze )" → "Gelato Pie × Pineapple Haze".
 * Falls back to the brand-stripped (or whole) name when no parens are present.
 */
export function flavorFromName(name: string): string {
  const brand = brandFromName(name);
  const withoutBrand = brand ? name.slice(brand.length).trim() : name.trim();
  const parenMatch = withoutBrand.match(/^\((.*)\)$/);
  const inner = (parenMatch ? parenMatch[1] : withoutBrand).trim();
  return inner.replace(/ & /g, " × ");
}

/**
 * Formats an ISO date string as "MMM DD, YYYY" (e.g. "Apr 22, 2026") from its
 * UTC parts, so the output is deterministic and locale-independent. Returns ""
 * when the date is absent or unparseable.
 */
export function formatLabDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = MONTHS[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month} ${day}, ${date.getUTCFullYear()}`;
}

/**
 * Maps a Payload lab-report document to the storefront COA view-model. Mirrors
 * mapProduct's null-collapsing convention. Expects depth >= 2 so `product` (and
 * its `featuredImage`) are populated; an unpopulated product id collapses the
 * product-derived fields to "".
 */
export function mapLabReport(doc: PayloadLabReport): LabReport {
  const product =
    doc.product && typeof doc.product === "object" ? doc.product : null;
  const uploaded =
    product?.featuredImage && typeof product.featuredImage === "object"
      ? product.featuredImage
      : null;
  const reportFile =
    doc.reportFile && typeof doc.reportFile === "object"
      ? (doc.reportFile as Media)
      : null;
  return {
    id: String(doc.id),
    productName: product ? (product.subtitle ?? flavorFromName(product.name)) : "",
    brand: product ? brandFromName(product.name) : "",
    category: product?.category ?? "",
    img: uploaded?.url ?? product?.imageId ?? "",
    batchLot: doc.batchLot ?? "",
    potency: doc.potency ?? "",
    testedDate: formatLabDate(doc.testedDate),
    lab: doc.lab ?? "",
    status: doc.status ?? "",
    cannabinoids: (doc.cannabinoids ?? []).map((c) => ({
      name: c.name ?? "",
      value: c.value ?? "",
    })),
    safetyScreens: (doc.safetyScreens ?? []).map((s) => ({
      name: s.name ?? "",
      result: s.result ?? "",
    })),
    terpenes: doc.terpenes ?? "",
    reportUrl: reportFile?.url ?? "",
  };
}

/** Maps a list of Payload lab-report documents to storefront view-models. */
export function mapLabReports(docs: PayloadLabReport[]): LabReport[] {
  return docs.map(mapLabReport);
}
