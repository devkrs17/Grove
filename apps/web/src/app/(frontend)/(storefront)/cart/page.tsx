import "@/storefront/kit/kit.css";
import "@/storefront/kit/cart.css";
import { Announce } from "@/storefront/kit/Announce";
import { StorefrontNav } from "@/storefront/kit/StorefrontNav";
import { StorefrontFooter } from "@/storefront/kit/StorefrontFooter";
import { StorefrontCart } from "@/storefront/kit/StorefrontCart";
import { storefrontNavLinks } from "@/storefront/kit/navLinks";
import { StorefrontRoot } from "@/storefront/StorefrontRoot";
import { getShowLabReports } from "@/storefront/server";

export const metadata = { title: "Blinkers — Your cart" };

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

export default async function StorefrontCartPage() {
  const showLabReports = await getShowLabReports();
  return (
    <StorefrontRoot>
      <Announce>{ANNOUNCEMENT}</Announce>
      <StorefrontNav brandHref="/" links={storefrontNavLinks(showLabReports)} cartHref="/cart" />
      <StorefrontCart />
      <StorefrontFooter showLabReports={showLabReports} />
    </StorefrontRoot>
  );
}
