import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Cart } from "@/storefront/components/Cart";
import { GroveShell } from "@/storefront/components/GroveShell";

export const metadata = { title: "Highgrove — Cart" };

export default function CartPage() {
  return (
    <GroveShell>
      <Announce />
      <Nav />
      <Cart />
      <Footer />
    </GroveShell>
  );
}
