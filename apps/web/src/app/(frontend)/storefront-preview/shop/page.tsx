import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Shop } from "@/storefront/components/Shop";
import { PRODUCTS } from "@/storefront/data";
import { PREVIEW_ROUTES } from "@/storefront/routes";

export const metadata = { title: "Highgrove — Shop (preview)" };

export default function StorefrontShopPreviewPage() {
  return (
    <>
      <Announce />
      <Nav cartCount={2} routes={PREVIEW_ROUTES} />
      <Shop products={PRODUCTS} routes={PREVIEW_ROUTES} />
      <Footer routes={PREVIEW_ROUTES} />
    </>
  );
}
