import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Shop } from "@/storefront/components/Shop";

export const metadata = { title: "Highgrove — Shop" };

export default function StorefrontShopPage() {
  return (
    <>
      <Announce />
      <Nav cartCount={2} />
      <Shop />
      <Footer />
    </>
  );
}
