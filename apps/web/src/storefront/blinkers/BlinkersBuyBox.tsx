"use client";

// Blinkers PDP buy-box order row — the one interactive island on the PDP.
// Holds local quantity state for the mock's stepper and hands it to the shared
// cart island <AddToCartButton/> (qty prop), so the live CartProvider stays the
// single source of cart truth. No cart logic lives here — it only reskins the
// mock's stepper + add-to-cart control (.buy__order) and reuses AddToCartButton.

import { useState } from "react";
import type { Product } from "../data";
import { AddToCartButton } from "@/storefront/cart/AddToCartButton";

export function BlinkersBuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const dec = () => setQty((n) => Math.max(1, n - 1));
  const inc = () => setQty((n) => n + 1);

  return (
    <div className="buy__order">
      <div className="stepper" role="group" aria-label="Quantity">
        <button type="button" onClick={dec} aria-label="Decrease quantity">
          −
        </button>
        <span className="qty">{qty}</span>
        <button type="button" onClick={inc} aria-label="Increase quantity">
          +
        </button>
      </div>
      <AddToCartButton product={product} qty={qty} className="btn btn--lime buy__add">
        Add to cart · ${product.price * qty}
      </AddToCartButton>
    </div>
  );
}
