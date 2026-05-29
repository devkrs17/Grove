// Announce bar, top nav, and footer — ported from chrome.jsx (cannabis vertical).
// Interactive popovers (search/account dropdowns) are omitted for the static
// shell; links route between the preview surfaces.

import { Icon } from "./Icon";
import { ANNOUNCE, BRAND, FOOT, NAV, TAGLINE } from "../data";

const HOME = "/storefront-preview";
const SHOP = "/storefront-preview/shop";

export function Announce({ message = ANNOUNCE }: { message?: string }) {
  return <div className="announce">{message}</div>;
}

function BrandMark({ name = BRAND }: { name?: string }) {
  return <i style={{ fontStyle: "italic" }}>{name}</i>;
}

export function Nav({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <div className="nav">
      <div className="nav__left">
        <a className="nav__brand" href={HOME}>
          <BrandMark />
        </a>
        <nav className="nav__links">
          {NAV.map((n) => (
            <a key={n.slug} href={SHOP}>
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
        <a className="nav__icon" href={SHOP}>
          <Icon name="shopping-bag" size={18} />
          <span style={{ fontSize: 13 }}>Cart · {cartCount}</span>
        </a>
      </div>
    </div>
  );
}

export function Footer() {
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
                  <a href={SHOP}>{x}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h5>Learn</h5>
            <ul>
              {FOOT.learn.map((x) => (
                <li key={x}>
                  <a href="#">{x}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h5>Help</h5>
            <ul>
              {FOOT.help.map((x) => (
                <li key={x}>
                  <a href="#">{x}</a>
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
