// Route map for the live Payload-backed storefront, consumed by the shared grove
// chrome (Chrome.tsx) on the CMS content pages.

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
