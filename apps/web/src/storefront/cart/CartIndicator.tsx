"use client";

import Link from "next/link";
import { Icon } from "@/storefront/components/Icon";
import { useCart } from "./CartProvider";

// Live nav cart badge — reactive unit count, links to the cart page.

export function CartIndicator() {
  const { count } = useCart();
  return (
    <Link className="nav__icon" href="/cart">
      <Icon name="shopping-bag" size={18} />
      <span style={{ fontSize: 13 }}>Cart · {count}</span>
    </Link>
  );
}
