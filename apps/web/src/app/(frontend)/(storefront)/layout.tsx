// Live storefront layout. Loads the design kit stylesheets and scopes them
// under the kit's `.grove` root with the Highgrove theme — the same wrapper the
// static /storefront-preview uses, so the promoted storefront renders
// identically while reading live Payload data. (Route group adds no URL
// segment: pages here resolve at /, /shop, /products/[slug], /cart.)

import type { ReactNode } from "react";
import "../../../storefront/styles/colors_and_type.css";
import "../../../storefront/styles/storefront.css";
import "../../../storefront/styles/home.css";
import "../../../storefront/styles/cannabis.css";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grove" data-theme="highgrove">
      {children}
    </div>
  );
}
