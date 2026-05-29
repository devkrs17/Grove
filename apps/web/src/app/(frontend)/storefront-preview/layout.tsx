// Standalone preview of the Highgrove storefront design (design handoff:
// ui_kits/storefront, "highgrove" theme). Lives on its own route so it does
// not touch the concurrently-developed (frontend)/page.tsx.
//
// Imports the kit's stylesheets and scopes them under `.grove` (the kit's
// opt-in root class). data-theme is cosmetic here — the base tokens already
// match the Highgrove aesthetic.

import type { ReactNode } from "react";
import "../../../storefront/styles/colors_and_type.css";
import "../../../storefront/styles/storefront.css";
import "../../../storefront/styles/home.css";
import "../../../storefront/styles/cannabis.css";

export default function StorefrontPreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grove" data-theme="highgrove">
      {children}
    </div>
  );
}
