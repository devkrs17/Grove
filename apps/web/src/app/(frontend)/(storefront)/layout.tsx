import type { ReactNode } from "react";

// Each storefront page loads its own design system so the two stylesheets stay
// isolated per route: legacy pages (shop, PDP, cart, content pages) wrap their
// markup in <GroveShell> (the grove theme CSS); the home route imports the
// Blinkers kit (blinkers.css). This layout is therefore a pass-through.
// (Route group adds no URL segment: pages resolve at /, /shop, /products/[slug],
// /cart, and /<page-slug>.)
export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
