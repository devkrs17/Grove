// Highgrove product listing — ported from plp.jsx (cannabis branch).
// Sort control is a plain uncontrolled <select> in this static shell.

import { Eyebrow, ProductCard } from "./primitives";
import { FACETS, PRODUCTS } from "../data";

const SORT_OPTS = ["Best selling", "Newest drops", "Highest THCa", "Price: low to high", "Price: high to low"];

export function Shop() {
  return (
    <div className="shell">
      <div className="plp">
        <div className="plp__crumbs">Shop → Flower</div>

        <div className="plp__head">
          <div>
            <Eyebrow style={{ marginBottom: 14 }}>Premium THCa</Eyebrow>
            <h1 className="plp__title">Shop THCa flower.</h1>
            <p className="p" style={{ marginTop: 16, maxWidth: "44ch" }}>
              Single-farm, hand-trimmed, slow-cured. Every batch traceable to the lab report.
            </p>
          </div>
          <div className="plp__sort">
            <span className="plp__count">{PRODUCTS.length} strains</span>
            <span style={{ width: 1, height: 16, background: "var(--rule-strong)", marginInline: 12 }} />
            <label htmlFor="sort">Sort</label>
            <select id="sort" defaultValue="Best selling">
              {SORT_OPTS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <aside>
          {FACETS.map((f) => (
            <div className="facet" key={f.name}>
              <h4>{f.name}</h4>
              <ul>
                {f.options.map((o) => (
                  <li key={o}>
                    <label>
                      <input type="checkbox" /> {o}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="facet" style={{ borderBottom: 0 }}>
            <h4>Price</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="field" placeholder="$0" style={{ flex: 1 }} />
              <input className="field" placeholder="$200" style={{ flex: 1 }} />
            </div>
          </div>
          <div className="facet" style={{ borderTop: "1px solid var(--rule)", marginTop: 16, paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
              We don&apos;t ship to ID, OR, AR, KS, MS, RI, VT.
              <br />
              21+ · age verified at checkout.
            </p>
          </div>
        </aside>

        <div className="plp__grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
