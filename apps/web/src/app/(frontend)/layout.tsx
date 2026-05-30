import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { getTenantContext } from "@/lib/tenant";
import { CartProvider } from "@/storefront/cart/CartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grove",
  description: "White-label multi-tenant platform",
};

// Tenant is resolved per-request from the hostname and content comes from
// Payload, so this must render dynamically (never prerendered at build time).
export const dynamic = "force-dynamic";

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { siteId } = await getTenantContext();

  // Highgrove palette defaults (matches the seed BrandConfig) so the storefront
  // is themed even before a tenant resolves from the host.
  let primaryColor = "#2d4a2b";
  let secondaryColor = "#7a8c5c";

  if (siteId) {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "brand-configs",
      where: { site: { equals: Number(siteId) } },
      overrideAccess: true,
      limit: 1,
    });
    if (docs[0]) {
      primaryColor = docs[0].primaryColor ?? primaryColor;
      secondaryColor = docs[0].secondaryColor ?? secondaryColor;
    }
  }

  const cssVars = {
    "--color-primary": primaryColor,
    "--color-secondary": secondaryColor,
  } as React.CSSProperties;

  return (
    <html lang="en" style={cssVars}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
