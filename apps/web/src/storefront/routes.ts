// Route maps so the shared storefront components can serve two surfaces:
// the live Payload-backed storefront ("/", "/shop", "/products/[slug]") and
// the standalone static design reference under /storefront-preview.

import { productHref } from "@/lib/storefront";

export type Routes = {
  home: string;
  shop: string;
  product: (slugOrId: string) => string;
};

export const LIVE_ROUTES: Routes = {
  home: "/",
  shop: "/shop",
  product: productHref,
};

export const PREVIEW_ROUTES: Routes = {
  home: "/storefront-preview",
  shop: "/storefront-preview/shop",
  // The static preview has no PDP surface; cards point back to the shop.
  product: () => "/storefront-preview/shop",
};
