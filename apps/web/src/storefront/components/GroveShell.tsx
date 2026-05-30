import type { ReactNode } from "react";
import "../styles/colors_and_type.css";
import "../styles/storefront.css";
import "../styles/home.css";
import "../styles/cannabis.css";

// Wraps the legacy "grove"-themed storefront pages (shop, PDP, cart, content
// pages) with their stylesheets + theme root. The home route uses the Blinkers
// kit (blinkers.css) instead, so the grove CSS lives on the pages that need it
// rather than the shared layout — keeping the two design systems isolated per
// route (no class-name collisions).
export function GroveShell({ children }: { children: ReactNode }) {
  return (
    <div className="grove" data-theme="highgrove">
      {children}
    </div>
  );
}
