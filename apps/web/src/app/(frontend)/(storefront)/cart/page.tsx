import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Cart } from "@/storefront/components/Cart";

export const metadata = { title: "Highgrove — Cart" };

export default function CartPage() {
  return (
    <>
      <Announce />
      <Nav />
      <Cart />
      <Footer />
    </>
  );
}
