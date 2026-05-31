// Blinkers footer — ports the mock's .footer.
// Dark background, lime column headings, brand block with lime dot + blurb,
// link columns, and a bottom bar with legal text + socials. Server component.

export interface FooterColumn {
  heading: string;
  links: string[];
}

export interface StorefrontFooterProps {
  /** Brand wordmark (lowercase in the mock). */
  brand?: string;
  /** Short blurb under the brand. */
  blurb?: string;
  /** Link columns (Shop / Learn / Help in the mock). When omitted, the default
   *  columns are built from `showLabReports`. */
  columns?: FooterColumn[];
  /** Whether the regulated-goods (COA) vertical is on: gates the "Lab reports"
   *  entry in the default Learn column. Ignored when `columns` is provided. */
  showLabReports?: boolean;
  /** Legal / copyright line in the bottom bar. */
  legal?: string;
  /** Social labels in the bottom bar. */
  socials?: string[];
}

const DEFAULT_SOCIALS = ["Instagram", "TikTok", "X"];

/** Footer columns; the Learn column includes "Lab reports" only when the COA
 *  vertical is enabled (kept in its original position, after "About THCa"). */
function defaultColumns(showLabReports: boolean): FooterColumn[] {
  const learn = ["About THCa", "Journal", "Wholesale"];
  if (showLabReports) learn.splice(1, 0, "Lab reports");
  return [
    { heading: "Shop", links: ["Edibles", "Concentrates", "Vapes", "All products"] },
    { heading: "Learn", links: learn },
    { heading: "Help", links: ["Shipping & states", "Returns", "Age verification", "Contact"] },
  ];
}

export function StorefrontFooter({
  brand = "blinkers",
  blurb = "A tight, lab-tested shelf of THCa. 21+ only.",
  columns,
  showLabReports = false,
  legal = "© 2026 Blinkers · 21+ only · keep away from children & pets",
  socials = DEFAULT_SOCIALS,
}: StorefrontFooterProps) {
  const cols = columns ?? defaultColumns(showLabReports);
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
          {cols.map((col) => (
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
