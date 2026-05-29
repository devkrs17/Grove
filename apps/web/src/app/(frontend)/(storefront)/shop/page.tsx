import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Shop } from "@/storefront/components/Shop";
import { getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Highgrove — Shop" };

export default async function StorefrontShopPage() {
  const products = await getStorefrontProducts();
  return (
    <>
      <Announce />
      <Nav />
      <Shop products={products} />
      <Footer />
    </>
  );
}
