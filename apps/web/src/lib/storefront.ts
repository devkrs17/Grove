// Pure storefront helpers. Lives in src/lib (coverage-gated to 100%) so the
// Payload → view-model transform that every storefront surface depends on is
// fully tested. Async Payload data-access lives in src/storefront/server.ts
// (a server-only module), keeping this file pure and importable anywhere.

import type { Product as PayloadProduct } from "@grove/types";
import type { Product } from "@/storefront/data";

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
