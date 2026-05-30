"use client";

// Client body for the Blinkers shop / PLP. Owns the filter + sort state and
// renders everything that depends on it: the PLP header count + sort pill, the
// filter sidebar, and the product grid. The server wrapper (BlinkersShop) fetches
// `products` and passes them down; all narrowing happens here in the browser
// (instant, no reload). Markup/classNames/SVGs mirror the approved mock verbatim
// (apps/web/public/shop-mock.html) — only the wiring is new.

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "../data";
import { imgUrl } from "../data";
import { productHref } from "@/lib/storefront";
import { ProductCard } from "./ProductCard";
import { Button } from "./Button";

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

const CATEGORY_OPTIONS = ["Edibles", "Concentrates", "Vapes"] as const;
const BRAND_OPTIONS = ["Litt Edibles", "710 Nomad Rosin", "Blinkers Flip"] as const;

// Sort modes. "Newest" is intentionally omitted: the Product view-model has no
// date field (see ../data.ts), so there is nothing to sort by — a dead option
// is worse than no option.
type SortMode = "featured" | "price" | "-price";

export function BlinkersShopBody({ products }: { products: Product[] }) {
  // Price bounds come from the real data so the slider spans the actual range
  // and the default (full-range) filter shows everything.
  const [minBound, maxBound] = useMemo(() => {
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(minBound);
  const [maxPrice, setMaxPrice] = useState(maxBound);
  const [sort, setSort] = useState<SortMode>("featured");

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const priceActive = minPrice > minBound || maxPrice < maxBound;

  const visible = useMemo(() => {
    const filtered = products.filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(brandOf(p.name))) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
    // "Featured" preserves the server order; clone before sorting so we never
    // mutate the source array.
    if (sort === "price") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "-price") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, selectedCategories, selectedBrands, minPrice, maxPrice, sort]);

  const total = products.length;
  const shown = visible.length;
  const byCategory = (label: string) => products.filter((p) => p.category === label).length;
  const byBrand = (label: string) => products.filter((p) => brandOf(p.name) === label).length;

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice(minBound);
    setMaxPrice(maxBound);
    setSort("featured");
  };

  return (
    <>
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
                <b>
                  {shown} of {total} products
                </b>{" "}
                · lab-tested lots, shipped discreet
              </div>
            </div>
            <div className="sortpill">
              <label htmlFor="sort">Sort</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price">Price: low → high</option>
                <option value="-price">Price: high → low</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Shop body: filter sidebar + product grid */}
      <section className="wrap shop">
        {/* Filter sidebar. */}
        <aside className="filters" aria-label="Filters">
          <div className="filters__top">
            <h2>Filters</h2>
            <span className="filters__clear" onClick={clearAll}>
              Clear all
            </span>
          </div>

          <div className="fgroup">
            <p className="fgroup__label">
              Category <span className="n">3</span>
            </p>
            {CATEGORY_OPTIONS.map((label) => (
              <label className="fopt" key={label}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(label)}
                  onChange={() => setSelectedCategories((prev) => toggle(prev, label))}
                />
                <span className="box">
                  <svg viewBox="0 0 12 12">
                    <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="ftxt">{label}</span>
                <span className="ct">{byCategory(label)}</span>
              </label>
            ))}
          </div>

          <div className="fgroup">
            <p className="fgroup__label">
              Brand <span className="n">3</span>
            </p>
            {BRAND_OPTIONS.map((label) => (
              <label className="fopt" key={label}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(label)}
                  onChange={() => setSelectedBrands((prev) => toggle(prev, label))}
                />
                <span className="box">
                  <svg viewBox="0 0 12 12">
                    <path d="M1 6l3.2 3.4L11 2" stroke="#14130d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="ftxt">{label}</span>
                <span className="ct">{byBrand(label)}</span>
              </label>
            ))}
          </div>

          <div className="fgroup">
            <p className="fgroup__label">Price</p>
            <div className="price">
              <span className="price__field">
                <span>$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  aria-label="Min price"
                />
              </span>
              <span className="price__dash">–</span>
              <span className="price__field">
                <span>$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Max price"
                />
              </span>
            </div>
            <div className="pranger">
              <input
                type="range"
                min={minBound}
                max={maxBound}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Max price slider"
              />
            </div>
          </div>

          {/* Strength: no backing field on Product, so these radios are inert
              (presentational only) — kept to match the approved mock's layout. */}
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
            {selectedCategories.map((label) => (
              <span
                className="chip chip--lime"
                key={`cat-${label}`}
                onClick={() => setSelectedCategories((prev) => toggle(prev, label))}
              >
                {label} <span className="x">×</span>
              </span>
            ))}
            {selectedBrands.map((label) => (
              <span
                className="chip"
                key={`brand-${label}`}
                onClick={() => setSelectedBrands((prev) => toggle(prev, label))}
              >
                {label} <span className="x">×</span>
              </span>
            ))}
            {priceActive ? (
              <span
                className="chip"
                onClick={() => {
                  setMinPrice(minBound);
                  setMaxPrice(maxBound);
                }}
              >
                ${minPrice}–${maxPrice} <span className="x">×</span>
              </span>
            ) : null}
          </div>
        </aside>

        {/* Product grid (filtered). */}
        <div>
          <p className="results__note">
            Showing {shown} of {total} products
          </p>
          <div className="results">
            {visible.map((p) => (
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
            <span>
              You&apos;ve seen all {shown} products
            </span>
            <Button variant="lime" href="#">
              Back to top ↑
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
