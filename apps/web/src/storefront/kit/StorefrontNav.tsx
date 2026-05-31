// Blinkers top nav — ports the mock's .nav.
// Lowercase "blinkers" brand + lime dot on the left (with category links),
// search / account / dark cart pill on the right. Server component.

export interface NavLink {
  label: string;
  href: string;
}

export interface StorefrontNavProps {
  /** Brand wordmark. Defaults to "blinkers" (rendered lowercase in the mock). */
  brand?: string;
  /** Link to the brand/home. */
  brandHref?: string;
  /** Category links shown next to the brand. */
  links?: NavLink[];
  /** Number of items in the cart, shown in the dark pill. */
  cartCount?: number;
  /** Href for the cart pill. */
  cartHref?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Edibles", href: "#" },
  { label: "Concentrates", href: "#" },
  { label: "Vapes", href: "#" },
  { label: "Lab reports", href: "#" },
];

export function StorefrontNav({
  brand = "blinkers",
  brandHref = "#",
  links = DEFAULT_LINKS,
  cartCount = 0,
  cartHref = "#",
}: StorefrontNavProps) {
  return (
    <nav className="nav">
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <a className="brand" href={brandHref}>
          <span className="dot" />
          {brand}
        </a>
        <div className="nav__links">
          {links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="nav__right">
        <span>Search</span>
        <span>Account</span>
        <a className="cartpill" href={cartHref}>
          Cart · {cartCount}
        </a>
      </div>
    </nav>
  );
}
