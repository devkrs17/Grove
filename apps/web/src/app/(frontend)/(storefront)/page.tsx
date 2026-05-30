import "@/storefront/blinkers/blinkers.css";
import { BlinkersHome } from "@/storefront/blinkers/BlinkersHome";
import { getHomepage, getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Blinkers — Loud flavor, clean labs." };

export default async function StorefrontHomePage() {
  const [products, homepage] = await Promise.all([getStorefrontProducts(), getHomepage()]);
  return (
    <div className="blinkers">
      <BlinkersHome products={products} homepage={homepage} />
    </div>
  );
}
