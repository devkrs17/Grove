// Highgrove product detail page — the cannabis PDP for the live storefront.
// Presentational: `product` + `related` come from Payload (server.ts); the
// only client island is <AddToCartButton/> (CartProvider is mounted by the
// (storefront) layout). `routes` swaps link targets between surfaces.

import { Btn, Eyebrow, ProductCard } from "./primitives";
import { imgUrl, type Product } from "../data";
import { LIVE_ROUTES, type Routes } from "../routes";
import { AddToCartButton } from "../cart/AddToCartButton";

const capitalize = (effect: string) => effect.charAt(0).toUpperCase() + effect.slice(1);

export function Pdp({ product, related, routes = LIVE_ROUTES }: { product: Product; related: Product[]; routes?: Routes }) {
  const bullets = [
    product.meta,
    `${product.thc} · lot ${product.lot}`,
    "Hand-trimmed, slow-cured 21–30 days",
    "Third-party lab-tested — see COA below",
  ].filter(Boolean);

  return (
    <div className="pdp">
      <div className="pdp__crumbs">
        <a href={routes.shop}>Shop</a> → {product.category}
      </div>

      <div className="pdp__main">
        {/* LEFT — gallery */}
        <div className="pdp__gallery">
          <div className="pdp__thumbs">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className="pdp__thumb"
                style={{ backgroundImage: `url('${imgUrl(product.img, 200)}')` }}
                aria-current={i === 0 ? "true" : undefined}
              />
            ))}
          </div>
          <div className="pdp__hero" style={{ backgroundImage: `url('${imgUrl(product.img, 1200)}')` }} />
        </div>

        {/* RIGHT — buy box */}
        <div className="pdp--cannabis">
          <div className="pdp__badges">
            {product.type ? (
              <span className="pdp__badge pdp__badge--type" data-type={product.type}>
                {product.type}
              </span>
            ) : null}
            {product.effect ? <span className="pdp__badge pdp__badge--effect">{capitalize(product.effect)}</span> : null}
            {product.tag ? <span className="pdp__badge pdp__badge--tag">{product.tag}</span> : null}
          </div>

          <div className="pdp__rating">
            ★★★★★ <span>4.9 · 128 reviews</span>
          </div>

          <h1 className="pdp__name pdp__name--display">{product.name}</h1>
          <div className="pdp__brand">Highgrove · single-farm THCa</div>
          <div className="pdp__price">${product.price}</div>

          <ul className="pdp__bullets">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          {product.description ? <div className="pdp__strain-note">{product.description}</div> : null}

          <div className="pdp__cta">
            <AddToCartButton product={product} />
            <Btn variant="secondary" size="lg">
              Save for later
            </Btn>
          </div>

          <div className="pdp__ship-row">
            <span>Ships discreet</span>
            <span>Age-gated checkout</span>
            <span>Single-farm grown</span>
          </div>
        </div>
      </div>

      {/* COA */}
      <section className="coa">
        <div className="coa__head">
          <div>
            <Eyebrow>Lab verified</Eyebrow>
            <h3>Certificate of analysis</h3>
          </div>
          <span className="coa__download">Download COA →</span>
        </div>
        <div className="coa__grid">
          <div className="coa__cell">
            <span>Potency</span>
            <strong>{product.thc}</strong>
          </div>
          <div className="coa__cell">
            <span>Batch / lot</span>
            <strong>{product.lot}</strong>
          </div>
          <div className="coa__cell">
            <span>Strain</span>
            <strong>{product.type}</strong>
          </div>
          <div className="coa__cell">
            <span>Tested</span>
            <strong>Apr 2026</strong>
          </div>
          <div className="coa__cell coa__cell--terps">
            <span>Terpenes</span>
            <div className="coa__terps">{product.terpenes ?? "Limonene · Myrcene · Caryophyllene"}</div>
          </div>
          <div className="coa__cell coa__cell--lab">
            <span>Lab</span>
            <strong>Hudson Valley Labs</strong>
            <small>ISO 17025 · third-party</small>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="faq__head">
          <Eyebrow>Good to know</Eyebrow>
          <h3>Questions</h3>
        </div>
        <div className="faq__list">
          <details>
            <summary>Is THCa legal?</summary>
            <p>
              Our flower is hemp under the 2018 Farm Bill — under 0.3% Δ9-THC by dry weight — so it ships
              legally in most states. THCa converts to THC when heated, so treat it accordingly.
            </p>
          </details>
          <details>
            <summary>Which states do you ship to?</summary>
            <p>
              We ship to most of the U.S. We currently do not ship to ID, OR, AR, KS, MS, RI, or VT.
              Checkout is age-gated at 21+.
            </p>
          </details>
          <details>
            <summary>How should I store it?</summary>
            <p>
              Keep it in the original airtight jar, out of direct light, somewhere cool and dry. Stored
              well, the flower holds its terpenes and potency for months.
            </p>
          </details>
        </div>
      </section>

      {/* RELATED */}
      {related.length ? (
        <section className="section--tight">
          <div className="container">
            <div className="featured-head">
              <div>
                <Eyebrow>The shop</Eyebrow>
                <h2 className="h2" style={{ marginTop: 10 }}>
                  More from the harvest
                </h2>
              </div>
            </div>
            <div className="featured-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} href={routes.product(p.slug ?? p.id)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
