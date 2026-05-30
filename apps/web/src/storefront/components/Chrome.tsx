// Announce bar, top nav, and footer — ported from chrome.jsx (cannabis vertical).
// Shared by the live storefront and the static preview: `routes` swaps the link
// targets, and `cartCount` selects a static badge (preview) vs. the live,
// reactive cart indicator.

import { Icon } from "./Icon";
import { ANNOUNCE, BRAND, FOOT, NAV, TAGLINE } from "../data";
import { LIVE_ROUTES, type Routes } from "../routes";
import { CartIndicator } from "../cart/CartIndicator";

export function Announce({ message = ANNOUNCE }: { message?: string }) {
  return <div className="announce">{message}</div>;
}

// Footer Learn/Help labels map to CMS pages by slug (matches the page slugs seeded in packages/payload/src/seed.ts).
const pageHref = (label: string) =>
  `/${label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;

function BrandMark({ name = BRAND }: { name?: string }) {
  return <i style={{ fontStyle: "italic" }}>{name}</i>;
}

export function Nav({
  cartCount,
  routes = LIVE_ROUTES,
}: {
  cartCount?: number;
  routes?: Routes;
}) {
  return (
    <div className="nav">
      <div className="nav__left">
        <a className="nav__brand" href={routes.home}>
          <BrandMark />
        </a>
        <nav className="nav__links">
          {NAV.map((n) => (
            <a key={n.slug} href={routes.shop}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="nav__right">
        <span className="nav__icon nav__icon--btn">
          <Icon name="search" size={18} />
        </span>
        <span className="nav__icon nav__icon--btn">
          <Icon name="user" size={18} />
        </span>
        {typeof cartCount === "number" ? (
          <a className="nav__icon" href={routes.shop}>
            <Icon name="shopping-bag" size={18} />
            <span style={{ fontSize: 13 }}>Cart · {cartCount}</span>
          </a>
        ) : (
          <CartIndicator />
        )}
      </div>
    </div>
  );
}

export function Footer({ routes = LIVE_ROUTES }: { routes?: Routes }) {
  return (
    <>
      <aside className="legal-band">
        <div className="legal-band__inner">
          <span className="legal-band__badge">21+</span>
          <p>{FOOT.legal}</p>
        </div>
      </aside>
      <footer className="footer">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <BrandMark />
            </div>
            <p style={{ marginTop: 14, fontSize: 14, opacity: 0.75, maxWidth: "38ch" }}>{TAGLINE}</p>
            <p style={{ marginTop: 14, fontSize: 12, opacity: 0.55 }}>{FOOT.address}</p>
          </div>
          <div className="footer__col">
            <h5>Shop</h5>
            <ul>
              {FOOT.shop.map((x) => (
                <li key={x}>
                  <a href={routes.shop}>{x}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h5>Learn</h5>
            <ul>
              {FOOT.learn.map((x) => (
                <li key={x}>
                  <a href={pageHref(x)}>{x}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h5>Help</h5>
            <ul>
              {FOOT.help.map((x) => (
                <li key={x}>
                  <a href={pageHref(x)}>{x}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 {BRAND}</span>
          <span>21+ only · drug-free workplaces beware</span>
        </div>
      </footer>
    </>
  );
}
