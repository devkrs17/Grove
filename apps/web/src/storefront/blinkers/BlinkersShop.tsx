// Live Blinkers shop / PLP — server wrapper. Mirrors the approved mock
// (apps/web/public/shop-mock.html): announce bar, nav, the PLP header (breadcrumb
// + lime "Shop everything." title + count + sort pill), a left filter sidebar
// (Category / Brand / Price), a responsive product grid, and the footer.
//
// This component is a server component: it owns the static chrome (announce / nav
// / footer) and hands the server-fetched `products` to BlinkersShopBody, the
// "use client" component that owns the live filter + sort state and renders the
// header count, sidebar, and grid.

import { Announce } from "./Announce";
import { BlinkersNav } from "./BlinkersNav";
import { BlinkersFooter } from "./BlinkersFooter";
import { BlinkersShopBody } from "./BlinkersShopBody";
import type { Product } from "../data";

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

const NAV_LINKS = [
  { label: "Edibles", href: "/shop" },
  { label: "Concentrates", href: "/shop" },
  { label: "Vapes", href: "/shop" },
  { label: "Lab reports", href: "/lab-reports" },
];

export function BlinkersShop({ products }: { products: Product[] }) {
  return (
    <>
      <Announce>{ANNOUNCEMENT}</Announce>
      <BlinkersNav brandHref="/" links={NAV_LINKS} cartHref="/cart" />
      <BlinkersShopBody products={products} />
      <BlinkersFooter />
    </>
  );
}
