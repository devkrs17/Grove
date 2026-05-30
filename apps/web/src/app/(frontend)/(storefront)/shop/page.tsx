import "@/storefront/blinkers/blinkers.css";
import "@/storefront/blinkers/shop.css";
import { BlinkersShop } from "@/storefront/blinkers/BlinkersShop";
import { getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Blinkers — Shop everything." };

export default async function StorefrontShopPage() {
  const products = await getStorefrontProducts();
  return (
    <div className="blinkers">
      <BlinkersShop products={products} />
    </div>
  );
}
