import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Home } from "@/storefront/components/Home";
import { PRODUCTS } from "@/storefront/data";
import { PREVIEW_ROUTES } from "@/storefront/routes";

export const metadata = { title: "Highgrove — Storefront (preview)" };

// Standalone static design reference — renders from the demo data in data.ts
// and stays self-contained under /storefront-preview. The live, Payload-backed
// storefront lives at / (see app/(frontend)/(storefront)).
export default function StorefrontPreviewPage() {
  return (
    <>
      <Announce />
      <Nav cartCount={2} routes={PREVIEW_ROUTES} />
      <Home products={PRODUCTS} routes={PREVIEW_ROUTES} />
      <Footer routes={PREVIEW_ROUTES} />
    </>
  );
}
