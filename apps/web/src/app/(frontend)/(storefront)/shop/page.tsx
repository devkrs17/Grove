import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { GroveShell } from "@/storefront/components/GroveShell";
import { Shop } from "@/storefront/components/Shop";
import { getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Highgrove — Shop" };

export default async function StorefrontShopPage() {
  const products = await getStorefrontProducts();
  return (
    <GroveShell>
      <Announce />
      <Nav />
      <Shop products={products} />
      <Footer />
    </GroveShell>
  );
}
