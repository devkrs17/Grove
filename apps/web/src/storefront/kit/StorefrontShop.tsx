// Live Blinkers shop / PLP — server wrapper. Mirrors the approved mock
// (apps/web/public/shop-mock.html): announce bar, nav, the PLP header (breadcrumb
// + lime "Shop everything." title + count + sort pill), a left filter sidebar
// (Category / Brand / Price), a responsive product grid, and the footer.
//
// This component is a server component: it owns the static chrome (announce / nav
// / footer) and hands the server-fetched `products` to StorefrontShopBody, the
// "use client" component that owns the live filter + sort state and renders the
// header count, sidebar, and grid.

import { Announce } from "./Announce";
import { StorefrontNav } from "./StorefrontNav";
import { StorefrontFooter } from "./StorefrontFooter";
import { storefrontNavLinks } from "./navLinks";
import { StorefrontShopBody } from "./StorefrontShopBody";
import type { Product } from "../data";

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

export function StorefrontShop({
  products,
  showLabReports = false,
}: {
  products: Product[];
  showLabReports?: boolean;
}) {
  return (
    <>
      <Announce>{ANNOUNCEMENT}</Announce>
      <StorefrontNav brandHref="/" links={storefrontNavLinks(showLabReports)} cartHref="/cart" />
      <StorefrontShopBody products={products} />
      <StorefrontFooter showLabReports={showLabReports} />
    </>
  );
}
