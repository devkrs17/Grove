// Live Blinkers product detail page (PDP) — composes the kit from a real
// product. Mirrors the approved mock (apps/web/public/product-mock.html):
// breadcrumb; left gallery hero + thumbnails + stickers; right buy box (brand,
// title, rating, price, spec bullets, quantity stepper + Add to cart); a
// Description band with a COA panel; an FAQ accordion; and a "More like this"
// grid. Server component — the only client island is <StorefrontBuyBox/>, which
// wraps the shared <AddToCartButton/> (the live CartProvider is mounted by the
// (frontend) layout). Spec/COA values are derived from the Product view-model.

import Link from "next/link";
import type { Product } from "../data";
import { imgUrl } from "../data";
import { productHref } from "@/lib/storefront";
import { Announce } from "./Announce";
import { StorefrontNav } from "./StorefrontNav";
import { StorefrontFooter } from "./StorefrontFooter";
import { storefrontNavLinks } from "./navLinks";
import { ProductCard } from "./ProductCard";
import { Sticker } from "./Sticker";
import { SectionHead } from "./SectionHead";
import { Button } from "./Button";
import { StorefrontBuyBox } from "./StorefrontBuyBox";

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

/** Pull a brand label from a product name (the packs are name-prefixed). */
function brandOf(name: string): string {
  if (name.startsWith("Litt")) return "Litt Edibles";
  if (name.startsWith("710 Nomad")) return "710 Nomad Rosin";
  if (name.startsWith("Blinkers Flip")) return "Blinkers Flip";
  return "";
}

/** Map a product `tag` to the matching ProductCard chip tone (mirrors the kit). */
function chipFor(tag: string) {
  if (!tag) return undefined;
  const tone =
    tag === "New" ? "pink" : tag === "Solventless" ? "sky" : tag === "1000mg" ? "tang" : "lime";
  return { label: tag, tone } as const;
}

export function StorefrontPdp({
  product,
  related,
  showLabReports = false,
}: {
  product: Product;
  related: Product[];
  showLabReports?: boolean;
}) {
  const brand = brandOf(product.name);
  const hero = imgUrl(product.img);

  // Short highlight bullets, derived from the view-model (mock's .specs). The
  // COA-traceability bullet belongs to the regulated vertical, so it is dropped
  // when the tenant hasn't opted in.
  const specs = [
    product.meta,
    product.thc ? `${product.thc}${product.lot ? ` · lot ${product.lot}` : ""}` : "",
    "Third-party lab-tested — every batch",
    showLabReports ? "Lot-traceable — scan to pull the exact COA" : "",
  ].filter(Boolean);

  return (
    <>
      <Announce>{ANNOUNCEMENT}</Announce>
      <StorefrontNav brandHref="/" links={storefrontNavLinks(showLabReports)} cartHref="/cart" />

      {/* ============ BREADCRUMB ============ */}
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/shop">Shop</Link>
          {product.category ? (
            <>
              <span className="sep">/</span>
              <Link href="/shop">{product.category}</Link>
            </>
          ) : null}
          <span className="sep">/</span>
          <span className="now">{product.name}</span>
        </nav>
      </div>

      {/* ============ PRODUCT (gallery + buy box) ============ */}
      <section className="pdp">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <div className="wrap pdp__grid">
          {/* LEFT: gallery */}
          <div className="gallery">
            <div className="gallery__hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt={product.name} />
              {product.type ? <Sticker position="tr">{product.type}</Sticker> : null}
              <Sticker position="bl">every lot lab-tested ✓</Sticker>
            </div>
            <div className="gallery__thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`thumb${i === 0 ? " is-active" : ""}`}
                  aria-label={i === 0 ? "View main image" : "View alternate angle"}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: buy box */}
          <div className="buy">
            {brand ? <div className="buy__brand">{brand}</div> : null}
            <h1 className="buy__title">{product.name}</h1>
            <div className="buy__rate">
              <span className="stars">★★★★★</span> 4.9 <span className="sep">·</span> 128 reviews
            </div>

            <div className="buy__pricerow">
              <span className="buy__price">${product.price}</span>
              {product.meta ? <span className="buy__unit">{product.meta}</span> : null}
            </div>

            {product.description ? <p className="buy__blurb">{product.description}</p> : null}

            <ul className="specs">
              {specs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            {/* Interactive order row (client island): stepper + AddToCartButton. */}
            <StorefrontBuyBox product={product} />
            <Button variant="dark" href="/cart" className="buy__buynow">
              Buy it now
            </Button>

            <div className="trustrow">
              <span>
                <span className="ic" /> Ships discreet
              </span>
              <span className="sep">·</span>
              <span>
                <span className="ic" /> Lab-tested
              </span>
              <span className="sep">·</span>
              <span>
                <span className="ic" /> 21+ age-gated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DESCRIPTION + COA ============ */}
      <section className="section detail" style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="detail__grid">
            {/* description */}
            <div className="prose">
              <h2>The full story</h2>
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>
                  {product.name} is part of the Blinkers shelf — a tight, lab-tested lineup of THCa.
                  Every lot is third-party tested and traceable: scan the pack, pull the exact COA,
                  see what&apos;s in it. No mystery oil, no mystery hardware.
                </p>
              )}
              <p>
                Like everything we stock, this lot is third-party tested and lot-traceable. Flavor
                that actually tastes like the strain on the box, and a clean, full hit from the first
                pull to the last.
              </p>
            </div>

            {/* COA / lab report panel — regulated vertical only */}
            {showLabReports ? (
            <aside className="coa">
              <div className="coa__top">
                <h3>Lab report · COA</h3>
                <span className="coa__badge">Verified ✓</span>
              </div>
              <div className="coa__grid">
                <div className="coa__cell">
                  <div className="coa__k">Potency</div>
                  <div className="coa__v hl">{product.thc || "—"}</div>
                </div>
                <div className="coa__cell">
                  <div className="coa__k">Batch / Lot</div>
                  <div className="coa__v">{product.lot || "—"}</div>
                </div>
                <div className="coa__cell">
                  <div className="coa__k">Tested</div>
                  <div className="coa__v">Apr 2026</div>
                </div>
                <div className="coa__cell">
                  <div className="coa__k">Lab</div>
                  <div className="coa__v">Kaycha Labs</div>
                </div>
                {product.terpenes ? (
                  <div className="coa__cell" style={{ gridColumn: "1 / -1" }}>
                    <div className="coa__k">Terpenes</div>
                    <div className="coa__v">{product.terpenes}</div>
                  </div>
                ) : null}
              </div>
              <Link className="coa__link" href="/lab-reports">
                View full COA (PDF) →
              </Link>
            </aside>
            ) : null}
          </div>

          {/* ============ FAQ ============ */}
          <div className="faq">
            <h2>Good to know</h2>
            <details className="q" open>
              <summary>Is THCa legal?</summary>
              <p className="a">
                THCa hemp products derived from cannabis with under 0.3% delta-9 THC by dry weight are
                federally compliant under the 2018 Farm Bill. State rules vary — a few restrict THCa
                specifically — so we age-gate and ship only where it&apos;s allowed. You must be 21+ to
                order.
              </p>
            </details>
            <details className="q">
              <summary>How should I store it?</summary>
              <p className="a">
                Keep it upright at room temperature, away from direct heat and sunlight. Extreme cold
                can thicken the oil and clog airflow — if that happens, let it warm to room temp and
                take slow, gentle pulls to prime it again.
              </p>
            </details>
            <details className="q">
              <summary>Which states do you ship to?</summary>
              <p className="a">
                We ship discreet (no branding on the box) to most U.S. states where THCa hemp is
                permitted. Restricted states are blocked at checkout automatically based on your
                shipping address. Check the Shipping &amp; states page for the current list.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ============ MORE LIKE THIS (related products) ============ */}
      {related.length ? (
        <section className="section" style={{ paddingTop: 18 }}>
          <div className="wrap">
            <SectionHead
              eyebrow="More like this"
              title="You'll probably want these too."
              seeAll={{ label: "Browse all →", href: "/shop" }}
            />
            <div className="pgrid">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  brand={brandOf(p.name)}
                  price={p.price}
                  image={imgUrl(p.img)}
                  href={productHref(p.slug ?? p.id)}
                  rating={5}
                  chip={chipFor(p.tag)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <StorefrontFooter showLabReports={showLabReports} />
    </>
  );
}
