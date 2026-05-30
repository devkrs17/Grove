import "@/storefront/blinkers/blinkers.css";
import "@/storefront/blinkers/cart.css";
import { Announce } from "@/storefront/blinkers/Announce";
import { BlinkersNav } from "@/storefront/blinkers/BlinkersNav";
import { BlinkersFooter } from "@/storefront/blinkers/BlinkersFooter";
import { BlinkersCart } from "@/storefront/blinkers/BlinkersCart";

export const metadata = { title: "Blinkers — Your cart" };

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

const NAV_LINKS = [
  { label: "Edibles", href: "/shop" },
  { label: "Concentrates", href: "/shop" },
  { label: "Vapes", href: "/shop" },
  { label: "Lab reports", href: "/lab-reports" },
];

export default function StorefrontCartPage() {
  return (
    <div className="blinkers">
      <Announce>{ANNOUNCEMENT}</Announce>
      <BlinkersNav brandHref="/" links={NAV_LINKS} cartHref="/cart" />
      <BlinkersCart />
      <BlinkersFooter />
    </div>
  );
}
