import "@/storefront/kit/kit.css";
import { StorefrontHome } from "@/storefront/kit/StorefrontHome";
import { StorefrontRoot } from "@/storefront/StorefrontRoot";
import { getHomepage, getShowLabReports, getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Blinkers — Loud flavor, clean labs." };

export default async function StorefrontHomePage() {
  const [products, homepage, showLabReports] = await Promise.all([
    getStorefrontProducts(),
    getHomepage(),
    getShowLabReports(),
  ]);
  return (
    <StorefrontRoot>
      <StorefrontHome products={products} homepage={homepage} showLabReports={showLabReports} />
    </StorefrontRoot>
  );
}
