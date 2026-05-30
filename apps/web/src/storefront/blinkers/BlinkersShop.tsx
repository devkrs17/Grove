// Live Blinkers shop / PLP — composes the kit from real products. Mirrors the
// approved mock (apps/web/public/shop-mock.html): plp header (breadcrumb + lime
// "Shop everything." title + count + sort pill), a left filter sidebar
// (Category / Brand / Price — presentational for v1, same as the old Shop), and
// a responsive grid of ALL products via the kit ProductCard. Server component.

import Link from "next/link";
import type { Product } from "../data";
import { imgUrl } from "../data";
import { productHref } from "@/lib/storefront";
import { Announce } from "./Announce";
import { BlinkersNav } from "./BlinkersNav";
import { BlinkersFooter } from "./BlinkersFooter";
import { ProductCard } from "./ProductCard";
import { Button } from "./Button";

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

const NAV_LINKS = [
  { label: "Edibles", href: "/shop" },
  { label: "Concentrates", href: "/shop" },
  { label: "Vapes", href: "/shop" },
  { label: "Lab reports", href: "/lab-reports" },
];

/** Pull a brand label from a product name (the packs are name-prefixed). */
function brandOf(name: string): string {
  if (name.startsWith("Litt")) return "Litt Edibles";
  if (name.startsWith("710 Nomad")) return "710 Nomad Rosin";
  if (name.startsWith("Blinkers Flip")) return "Blinkers Flip";
  return "";
}

/** Map a product `tag` to the matching ProductCard chip tone from the mock. */
function chipFor(tag: string) {
  if (!tag) return undefined;
  const tone =
    tag === "New" ? "pink" : tag === "Solventless" ? "sky" : tag === "1000mg" ? "tang" : "lime";
  return { label: tag, tone } as const;
}

export function BlinkersShop({ products }: { products: Product[] }) {
  const count = products.length;
  const byCategory = (label: string) => products.filter((p) => p.category === label).length;
  const byBrand = (label: string) => products.filter((p) => brandOf(p.name) === label).length;

  return (
    <>
      <Announce>{ANNOUNCEMENT}</Announce>
      <BlinkersNav brandHref="/" links={NAV_LINKS} cartHref="/cart" />

      {/* PLP header: breadcrumb + title + count + sort */}
      <header className="plp-head">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <div className="wrap plp-head__in">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Shop</span>
          </nav>
          <div className="plp-head__row">
            <div>
              <h1 className="plp-title">
                Shop <span className="hl">everything.</span>
              </h1>
              <div className="plp-count">
                <b>{count} products</b> · lab-tested lots, shipped discreet
              </div>
            </div>
            <div className="sortpill">
              <label htmlFor="sort">Sort</label>
              <select id="sort" defaultValue="featured" aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="price">Price: low → high</option>
                <option value="-price">Price: high → low</option>
                <option value="-createdAt">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Shop body: filter sidebar + product grid */}
      <section className="wrap shop">
        {/* Filter sidebar — presentational for v1 (same as the old Shop). */}
        <aside className="filters" aria-label="Filters">
          <div className="filters__top">
            <h2>Filters</h2>
            <span className="filters__clear">Clear all</span>
          </div>

          <div className="fgroup">
            <p className="fgroup__label">
              Category <span className="n">3</span>
            </p>
            <label className="fopt">
              <input type="checkbox" defaultChecked />
              <span className="box">
                <svg viewBox="0 0 12 12">
                  <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ftxt">Edibles</span>
              <span className="ct">{byCategory("Edibles")}</span>
            </label>
            <label className="fopt">
              <input type="checkbox" />
              <span className="box">
                <svg viewBox="0 0 12 12">
                  <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ftxt">Concentrates</span>
              <span className="ct">{byCategory("Concentrates")}</span>
            </label>
            <label className="fopt">
              <input type="checkbox" />
              <span className="box">
                <svg viewBox="0 0 12 12">
                  <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ftxt">Vapes</span>
              <span className="ct">{byCategory("Vapes")}</span>
            </label>
          </div>

          <div className="fgroup">
            <p className="fgroup__label">
              Brand <span className="n">3</span>
            </p>
            <label className="fopt">
              <input type="checkbox" />
              <span className="box">
                <svg viewBox="0 0 12 12">
                  <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ftxt">Litt Edibles</span>
              <span className="ct">{byBrand("Litt Edibles")}</span>
            </label>
            <label className="fopt">
              <input type="checkbox" />
              <span className="box">
                <svg viewBox="0 0 12 12">
                  <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ftxt">710 Nomad Rosin</span>
              <span className="ct">{byBrand("710 Nomad Rosin")}</span>
            </label>
            <label className="fopt">
              <input type="checkbox" />
              <span className="box">
                <svg viewBox="0 0 12 12">
                  <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ftxt">Blinkers Flip</span>
              <span className="ct">{byBrand("Blinkers Flip")}</span>
            </label>
          </div>

          <div className="fgroup">
            <p className="fgroup__label">Price</p>
            <div className="price">
              <span className="price__field">
                <span>$</span>
                <input type="number" inputMode="numeric" defaultValue={40} aria-label="Min price" />
              </span>
              <span className="price__dash">–</span>
              <span className="price__field">
                <span>$</span>
                <input type="number" inputMode="numeric" defaultValue={180} aria-label="Max price" />
              </span>
            </div>
            <div className="pranger">
              <input type="range" min={40} max={180} defaultValue={180} aria-label="Max price slider" />
            </div>
          </div>

          <div className="fgroup">
            <p className="fgroup__label">Strength</p>
            <label className="fopt">
              <input type="radio" name="strength" defaultChecked />
              <span className="box box--round" />
              <span className="ftxt">Any</span>
            </label>
            <label className="fopt">
              <input type="radio" name="strength" />
              <span className="box box--round" />
              <span className="ftxt">Microdose</span>
            </label>
            <label className="fopt">
              <input type="radio" name="strength" />
              <span className="box box--round" />
              <span className="ftxt">Full send</span>
            </label>
          </div>

          <div className="activef">
            <span className="activef__lead">Active:</span>
            <span className="chip chip--lime">
              Edibles <span className="x">×</span>
            </span>
            <span className="chip">
              $40–$180 <span className="x">×</span>
            </span>
          </div>
        </aside>

        {/* Product grid (all products). */}
        <div>
          <p className="results__note">Showing all {count} products</p>
          <div className="results">
            {products.map((p) => (
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

          <div className="plp-more">
            <span>You&apos;ve seen all {count} products</span>
            <Button variant="lime" href="#">
              Back to top ↑
            </Button>
          </div>
        </div>
      </section>

      <BlinkersFooter />
    </>
  );
}
