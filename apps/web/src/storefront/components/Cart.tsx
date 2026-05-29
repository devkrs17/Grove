"use client";

import { useCart } from "@/storefront/cart/CartProvider";
import { imgUrl } from "@/storefront/data";
import { LIVE_ROUTES } from "@/storefront/routes";
import { Btn } from "./primitives";

export function Cart() {
  const { items, remove, setQty, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div>
          <h1 className="cart-page__title">Your cart</h1>
          <p className="p">Your cart is empty.</p>
          <Btn variant="primary" href={LIVE_ROUTES.shop}>
            Shop the harvest →
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div>
        <h1 className="cart-page__title">Your cart</h1>
        {items.map((item) => (
          <div className="cart-line" key={item.id}>
            <div
              className="cart-line__media"
              style={{ backgroundImage: `url('${imgUrl(item.img)}')` }}
            />
            <div>
              <div className="cart-line__name">{item.name}</div>
              <div className="cart-line__meta">{item.meta}</div>
              <div className="qty">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(item.id, item.qty - 1)}
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-line__right">
              <div className="cart-line__price">${item.price * item.qty}</div>
              <button
                type="button"
                className="cart-line__remove"
                onClick={() => remove(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="summary">
        <h3>Order summary</h3>
        <div className="summary__row">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="summary__row">
          <span>Shipping</span>
          <span>{subtotal >= 99 ? "Free" : "$8"}</span>
        </div>
        <div className="summary__row summary__row--total">
          <span>Total</span>
          <span>${subtotal >= 99 ? subtotal : subtotal + 8}</span>
        </div>
        <Btn variant="primary" block style={{ marginTop: 16 }}>
          Proceed to checkout
        </Btn>
        <p className="summary__hint">
          Age-verified checkout (21+) — coming soon.
        </p>
      </aside>
    </div>
  );
}
