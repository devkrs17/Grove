import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Home } from "@/storefront/components/Home";
import { getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Highgrove — Small-batch THCa" };

export default async function StorefrontHomePage() {
  const products = await getStorefrontProducts();
  return (
    <>
      <Announce />
      <Nav />
      <Home products={products} />
      <Footer />
    </>
  );
}
