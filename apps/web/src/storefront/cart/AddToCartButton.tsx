"use client";

import type { ReactNode } from "react";
import type { Product } from "@/storefront/data";
import { useCart } from "./CartProvider";

// Adds a product to the cart. Used on the PDP (and anywhere a live add-to-cart
// control is needed). Defaults to the kit's primary button styling.

export function AddToCartButton({
  product,
  qty = 1,
  className = "btn btn--primary btn--lg",
  children = "Add to cart",
}: {
  product: Product;
  qty?: number;
  className?: string;
  children?: ReactNode;
}) {
  const { add } = useCart();
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        add(
          {
            id: product.id,
            slug: product.slug ?? product.id,
            name: product.name,
            price: product.price,
            meta: product.meta,
            img: product.img,
          },
          qty,
        )
      }
    >
      {children}
    </button>
  );
}
