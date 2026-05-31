import type { CSSProperties, ReactNode } from "react";
import { getBrandConfig } from "./server";
import { brandConfigToCssVars } from "@/lib/storefront";

// The storefront's themeable root. Wraps each storefront page in the
// `.storefront` scope the design system is written against, and injects the
// resolved tenant's BrandConfig colors as CSS custom properties so the store is
// reskinned from data, not code. With no BrandConfig (or values matching the
// defaults, as the Blinkers tenant is seeded), nothing is overridden and the
// default palette in kit.css renders unchanged.
export async function StorefrontRoot({ children }: { children: ReactNode }) {
  const brand = await getBrandConfig();
  const style = brandConfigToCssVars(brand) as CSSProperties;
  return (
    <div className="storefront" style={style}>
      {children}
    </div>
  );
}
