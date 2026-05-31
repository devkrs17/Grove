import "@/storefront/kit/kit.css";
import "@/storefront/kit/shop.css";
import { StorefrontShop } from "@/storefront/kit/StorefrontShop";
import { StorefrontRoot } from "@/storefront/StorefrontRoot";
import { getShowLabReports, getStorefrontProducts } from "@/storefront/server";

export const metadata = { title: "Blinkers — Shop everything." };

export default async function StorefrontShopPage() {
  const [products, showLabReports] = await Promise.all([
    getStorefrontProducts(),
    getShowLabReports(),
  ]);
  return (
    <StorefrontRoot>
      <StorefrontShop products={products} showLabReports={showLabReports} />
    </StorefrontRoot>
  );
}
