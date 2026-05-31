import type { ReactNode } from "react";

// Each storefront page loads its own design system so the two stylesheets stay
// isolated per route: the storefront pages (home, shop, PDP, cart) import the
// storefront kit (kit.css + page CSS) and wrap their markup in
// <StorefrontRoot> (.storefront scope + BrandConfig-driven theme vars); the
// remaining legacy content pages ([slug]) wrap their markup in <GroveShell>
// (grove theme CSS). This layout is therefore a pass-through.
// (Route group adds no URL segment: pages resolve at /, /shop, /products/[slug],
// /cart, and /<page-slug>.)
export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
