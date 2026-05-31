"use client";

// Live Blinkers cart — reskins the existing cart behaviour (components/Cart.tsx)
// into the approved cart mock (apps/web/public/cart-mock.html), reusing the kit.
// Cart state is client-side via useCart(); this component only renders/reskins it.

import Link from "next/link";
import { imgUrl } from "../data";
import { productHref } from "@/lib/storefront";
import { useCart } from "@/storefront/cart/CartProvider";
import { Button } from "./Button";
import { ProductCard } from "./ProductCard";
import { SectionHead } from "./SectionHead";

// Free-shipping threshold and flat fee — same figures as components/Cart.tsx.
const FREE_SHIP_THRESHOLD = 99;
const FLAT_SHIPPING = 8;
const UPSELL_LIMIT = 3;

/** Pull a brand label from a product name (packs are name-prefixed by brand). */
function brandOf(name: string): string {
  if (name.startsWith("Litt")) return "Litt Edibles";
  if (name.startsWith("710 Nomad")) return "710 Nomad Rosin";
  if (name.startsWith("Blinkers Flip")) return "Blinkers Flip";
  return "";
}

export function StorefrontCart() {
  const { items, remove, setQty, subtotal, count } = useCart();

  // Empty cart — Blinkers-styled version of the existing empty state.
  if (items.length === 0) {
    return (
      <section className="hero">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="cart__head">
            <h1 className="cart__title">
              <span className="hl">Your cart</span>
            </h1>
            <div className="cart__count">Your bag is empty.</div>
          </div>
          <div style={{ paddingBottom: 40 }}>
            <Link className="btn btn--lime" href="/shop">
              Shop the drop →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const freeShipUnlocked = subtotal >= FREE_SHIP_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));

  const upsell = items.slice(0, UPSELL_LIMIT);

  return (
    <>
      <section className="hero">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="cart__head">
            <h1 className="cart__title">
              <span className="hl">Your cart</span>
            </h1>
            <div className="cart__count">
              {items.length} {items.length === 1 ? "item" : "items"} · {count} in the bag
            </div>
          </div>

          <div className="cart__grid">
            {/* LEFT: line items */}
            <div className="items">
              {items.map((item) => {
                const brand = brandOf(item.name);
                return (
                  <div className="item" key={item.id}>
                    <Link className="item__media" href={productHref(item.slug)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl(item.img)} alt={item.name} />
                    </Link>
                    <div>
                      {brand ? <div className="item__brand">{brand}</div> : null}
                      <h3 className="item__name">{item.name}</h3>
                      <div className="item__meta">
                        {item.meta ? <span className="item__cat">{item.meta}</span> : null}
                        <span className="item__unit">${item.price} each</span>
                      </div>
                    </div>
                    <div className="item__right">
                      <div className="item__total">${item.price * item.qty}</div>
                      <div className="item__controls">
                        <div className="stepper">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.id, item.qty - 1)}
                          >
                            −
                          </button>
                          <span className="qty">{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="item__remove"
                          aria-label="Remove item"
                          title="Remove"
                          onClick={() => remove(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: sticky order summary */}
            <aside className="summary">
              <h2>Order summary</h2>

              <div className="ship">
                <div className="ship__msg">
                  {freeShipUnlocked ? (
                    <>
                      You unlocked free shipping <span>🎉</span>
                    </>
                  ) : (
                    <>
                      ${remaining} away from free shipping <span>🚚</span>
                    </>
                  )}
                </div>
                <div className="ship__bar">
                  <span className="ship__fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="sumrow">
                Subtotal <span className="v">${subtotal}</span>
              </div>
              <div className={`sumrow${freeShipUnlocked ? " sumrow--free" : ""}`}>
                Shipping <span className="v">{freeShipUnlocked ? "Free" : `$${shipping}`}</span>
              </div>
              <hr className="sumrule" />
              <div className="sumrow sumrow--total">
                Total <span className="v">${total}</span>
              </div>

              <Button variant="lime">Checkout →</Button>
              <Link className="summary__continue" href="/shop">
                ← Continue shopping
              </Link>

              <div className="trust">
                <span>Ships discreet</span>
                <span className="sep">·</span>
                <span>21+ age-gated</span>
                <span className="sep">·</span>
                <span>Secure checkout</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* UPSELL: you might also like — built from cart contents (kept simple). */}
      <section className="section" style={{ paddingTop: 18 }}>
        <div className="wrap">
          <SectionHead
            eyebrow="Before you go"
            title="You might also like."
            seeAll={{ label: "Browse all →", href: "/shop" }}
          />
          <div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {upsell.map((item) => (
              <ProductCard
                key={item.id}
                name={item.name}
                brand={brandOf(item.name)}
                price={item.price}
                image={imgUrl(item.img)}
                href={productHref(item.slug)}
                rating={5}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
