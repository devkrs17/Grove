// Blinkers footer — ports the mock's .footer.
// Dark background, lime column headings, brand block with lime dot + blurb,
// link columns, and a bottom bar with legal text + socials. Server component.

export interface FooterColumn {
  heading: string;
  links: string[];
}

export interface BlinkersFooterProps {
  /** Brand wordmark (lowercase in the mock). */
  brand?: string;
  /** Short blurb under the brand. */
  blurb?: string;
  /** Link columns (Shop / Learn / Help in the mock). */
  columns?: FooterColumn[];
  /** Legal / copyright line in the bottom bar. */
  legal?: string;
  /** Social labels in the bottom bar. */
  socials?: string[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { heading: "Shop", links: ["Edibles", "Concentrates", "Vapes", "All products"] },
  { heading: "Learn", links: ["About THCa", "Lab reports", "Journal", "Wholesale"] },
  { heading: "Help", links: ["Shipping & states", "Returns", "Age verification", "Contact"] },
];

const DEFAULT_SOCIALS = ["Instagram", "TikTok", "X"];

export function BlinkersFooter({
  brand = "blinkers",
  blurb = "A tight, lab-tested shelf of THCa. 21+ only.",
  columns = DEFAULT_COLUMNS,
  legal = "© 2026 Blinkers · 21+ only · keep away from children & pets",
  socials = DEFAULT_SOCIALS,
}: BlinkersFooterProps) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="footer__brand">
              <span className="dot" style={{ width: 12, height: 12, background: "var(--lime)", borderRadius: "50%" }} />
              {brand}
            </div>
            <p style={{ marginTop: 12, maxWidth: "34ch", color: "#9b9a8c" }}>{blurb}</p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h5>{col.heading}</h5>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <span>{legal}</span>
          <span className="footer__social">{socials.join(" · ")}</span>
        </div>
      </div>
    </footer>
  );
}
