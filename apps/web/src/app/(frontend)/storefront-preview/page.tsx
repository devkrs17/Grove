import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Home } from "@/storefront/components/Home";

export const metadata = { title: "Highgrove — Storefront" };

export default function StorefrontPreviewPage() {
  return (
    <>
      <Announce />
      <Nav cartCount={2} />
      <Home />
      <Footer />
    </>
  );
}
