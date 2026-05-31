// Live Blinkers lab-reports page (the COA / Certificate-of-Analysis library
// linked from the nav + footer "Lab reports"). Faithfully ports the approved
// mock (apps/web/public/lab-reports-mock.html), integrated onto the shared kit:
// announce + nav + footer chrome and the design tokens come from the Blinkers
// kit, not the mock's inline copy. Server component — the only client island is
// <LabReportTable/> (search + category filter). Sections: header (breadcrumb,
// title, intro, trust stats); a static "What we test for" band; the searchable
// report table; a featured "Sample COA" panel; and an FAQ accordion. The table
// and Sample COA are driven by the LabReport[] view-model; the educational copy
// (test tiles, FAQ) is static, exactly as in the mock.

import Link from "next/link";
import type { LabReport } from "../data";
import { Announce } from "./Announce";
import { StorefrontNav } from "./StorefrontNav";
import { StorefrontFooter } from "./StorefrontFooter";
import { storefrontNavLinks } from "./navLinks";
import { Button } from "./Button";
import { LabReportTable } from "./LabReportTable";
import { StatusBadge } from "./StatusBadge";

const ANNOUNCEMENT = "Free shipping over $99 · 21+ · ships discreet, no labels";

// This page only renders when the COA vertical is enabled (the /lab-reports
// route guards on it), so its chrome always shows the lab-report links.
const NAV_LINKS = storefrontNavLinks(true);

// Batch/lot of the lot featured in the Sample COA panel (the PDP mock's lot);
// falls back to the first report if that lot isn't in the set.
const FEATURED_LOT = "BF-GP24";

// Trust stats under the title. The first three are computed from the report
// set; "Screens / lot" is the size of the safety panel every lot is run against
// (static educational figure, as in the mock).
const SCREENS_PER_LOT = "6";

// Static educational content — the safety panels every lot is screened against.
// Hard-coded in the mock; kept verbatim here.
const TESTS: { name: string; note: string }[] = [
  {
    name: "Cannabinoid potency",
    note: "Full cannabinoid profile — THCa, Δ9-THC, CBD, CBG — quantified by HPLC so the label matches the lot.",
  },
  {
    name: "Pesticides",
    note: "Screened against the full state pesticide panel. Anything over action limits never reaches the shelf.",
  },
  {
    name: "Heavy metals",
    note: "Arsenic, cadmium, lead and mercury measured by ICP-MS, well under tolerance.",
  },
  {
    name: "Residual solvents",
    note: "Confirms no leftover processing solvents — and verifies our rosin is genuinely solventless.",
  },
  {
    name: "Microbials",
    note: "Pathogen screen — E. coli, Salmonella, total yeast & mold — on every batch.",
  },
  {
    name: "Mycotoxins",
    note: "Aflatoxins and ochratoxin A tested to rule out mold-derived toxins.",
  },
];

// Static FAQ copy — verbatim from the mock.
const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I read a COA?",
    a: "A Certificate of Analysis lists the cannabinoid potency (THCa, Δ9-THC, CBD and more) plus a set of pass/fail safety screens. Match the batch / lot number on your device or package to the one on the report — that's how you confirm the COA belongs to the exact lot in your hand.",
  },
  {
    q: "Which labs do you use?",
    a: "We rotate between three ISO-accredited, third-party labs — Kaycha Labs, ACS Laboratory and Green Scientific Labs. They have no stake in the result, which is the point: independent testing keeps the numbers honest.",
  },
  {
    q: "How often is each product tested?",
    a: "Every single batch, before it's listed. A new lot means a new COA — we don't carry forward an old report onto fresh production. If a lot doesn't pass every screen, it never reaches the shelf.",
  },
  {
    q: "What does the batch / lot number mean?",
    a: "It's the traceability key. Each production run gets its own lot code (for example BF-GP24), printed on the package and tied to one COA. Search that code above to pull the matching report.",
  },
];

/** Count of distinct, non-empty labs across the report set (the "Accredited labs" stat). */
function distinctLabs(reports: LabReport[]): number {
  return new Set(reports.map((r) => r.lab).filter(Boolean)).size;
}

/** Percentage of reports whose status is "pass", rounded (the "Passed screening" stat). */
function passRate(reports: LabReport[]): number {
  if (reports.length === 0) return 0;
  const passed = reports.filter((r) => r.status === "pass").length;
  return Math.round((passed / reports.length) * 100);
}

/**
 * Bar width (as a percent) for an analyte row, or null when no proportional bar
 * applies. The mock draws a visual bar for the inhalable panel, where values are
 * percentages ("86.4%" → 86); "<0.3%" parses to 0.3 → a thin sliver. Edible
 * panels report milligrams ("1000mg"), which aren't a fraction of anything, so
 * they return null and the row renders without a (misleading, maxed-out) bar.
 */
function barWidth(value: string): number | null {
  if (!value.includes("%")) return null;
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(n)) return null;
  return Math.max(2, Math.min(100, Math.round(n)));
}

export function StorefrontLabReports({ reports }: { reports: LabReport[] }) {
  const featured = reports.find((r) => r.batchLot === FEATURED_LOT) ?? reports[0];

  // The Sample COA renders the cannabinoid rows from the featured report. If the
  // view-model appends a "Total cannabinoids" row (name matching /total/i), it
  // is pulled out and rendered as the emphasized total row; otherwise every row
  // is an ordinary analyte row.
  const cannabinoids = featured?.cannabinoids ?? [];
  const totalRow = cannabinoids.find((c) => /total/i.test(c.name));
  const analyteRows = cannabinoids.filter((c) => c !== totalRow);

  return (
    <>
      <Announce>{ANNOUNCEMENT}</Announce>
      <StorefrontNav brandHref="/" links={NAV_LINKS} cartHref="/cart" />

      {/* ============ PAGE HEADER: breadcrumb + title + trust stats ============ */}
      <header className="plp-head">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <div className="wrap plp-head__in">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Lab reports</span>
          </nav>
          <div className="plp-head__row">
            <div>
              <h1 className="plp-title">
                Lab <span className="hl">reports.</span>
              </h1>
              <p className="plp-lead">
                Every lot on the Blinkers shelf is third-party tested before it ships — potency,
                pesticides, heavy metals, solvents and microbials. Pull the exact COA for any batch
                below.
              </p>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="stat__n">{reports.length}</div>
              <div className="stat__l">Lots tested</div>
            </div>
            <div className="stat">
              <div className="stat__n">{distinctLabs(reports)}</div>
              <div className="stat__l">Accredited labs</div>
            </div>
            <div className="stat">
              <div className="stat__n">{passRate(reports)}%</div>
              <div className="stat__l">Passed screening</div>
            </div>
            <div className="stat">
              <div className="stat__n">{SCREENS_PER_LOT}</div>
              <div className="stat__l">Screens / lot</div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ WHAT WE TEST FOR ============ */}
      <section className="section" style={{ padding: "48px 0 8px" }}>
        <div className="wrap">
          <div className="section__head">
            <div>
              <div className="eyebrow">Every lot, every time</div>
              <h2 style={{ marginTop: 8, fontSize: 38 }}>What we test for.</h2>
            </div>
          </div>
          <div className="tests">
            {TESTS.map((t) => (
              <div className="test" key={t.name}>
                <div className="test__top">
                  <span className="test__name">{t.name}</span>
                  <span className="pass">
                    <span className="tick">✓</span> Pass
                  </span>
                </div>
                <p className="test__note">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REPORT LIBRARY: search + filter + table ============ */}
      <section className="section" style={{ padding: "36px 0 8px" }}>
        <div className="wrap">
          <div className="section__head" style={{ marginBottom: 18 }}>
            <div>
              <div className="eyebrow">COA library</div>
              <h2 style={{ marginTop: 8, fontSize: 38 }}>Find a report.</h2>
            </div>
          </div>
          <LabReportTable reports={reports} />
        </div>
      </section>

      {/* ============ SAMPLE / EXPANDED COA ============ */}
      {featured ? (
        <section className="section" style={{ padding: "42px 0 8px" }}>
          <div className="wrap">
            <div className="section__head" style={{ marginBottom: 16 }}>
              <div>
                <div className="eyebrow">What&apos;s inside a report</div>
                <h2 style={{ marginTop: 8, fontSize: 38 }}>Sample COA.</h2>
              </div>
            </div>

            <div className="report">
              <div className="report__head">
                <div>
                  <h3 className="report__title">{featured.productName}</h3>
                  <div className="report__sub">
                    <b>Batch {featured.batchLot}</b>
                    {featured.brand ? (
                      <>
                        <span className="sep">·</span>
                        {featured.brand}
                      </>
                    ) : null}
                    <span className="sep">·</span>Tested {featured.testedDate}
                    {featured.lab ? (
                      <>
                        <span className="sep">·</span>
                        {featured.lab}
                      </>
                    ) : null}
                  </div>
                </div>
                <StatusBadge
                  status={featured.status}
                  label={featured.status === "pass" ? "Passed all screens" : undefined}
                  style={{ fontSize: 13, padding: "7px 14px" }}
                />
              </div>

              <div className="report__grid">
                {/* cannabinoid profile */}
                <div className="report__col">
                  <h4>Cannabinoid profile</h4>
                  <div className="ana">
                    {analyteRows.map((c) => {
                      const width = barWidth(c.value);
                      return (
                        <div className="ana__row" key={c.name}>
                          <span className="ana__k">{c.name}</span>
                          <span className="ana__v">{c.value}</span>
                          {width !== null ? (
                            <span className="ana__bar">
                              <span className="ana__fill" style={{ width: `${width}%` }} />
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                    {totalRow ? (
                      <div className="ana__row ana__row--tot">
                        <span className="ana__k">{totalRow.name}</span>
                        <span className="ana__v">{totalRow.value}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* safety screens + terpenes */}
                <div className="report__col">
                  <h4>Safety screens</h4>
                  <ul className="screens">
                    {featured.safetyScreens.map((s) => (
                      <li key={s.name}>
                        <span className="name">
                          <span className="ic">✓</span> {s.name}
                        </span>
                        <span className="pass">
                          <span className="tick">✓</span> {s.result}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {featured.terpenes ? (
                    <div className="terps">
                      <h4 style={{ marginBottom: 4 }}>Dominant terpenes</h4>
                      <p className="terps__list">{featured.terpenes}</p>
                    </div>
                  ) : null}
                  {featured.reportUrl ? (
                    <div className="report__cta">
                      <Button variant="dark" href={featured.reportUrl}>
                        View full COA (PDF) →
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ FAQ ============ */}
      <section className="section" style={{ padding: "30px 0 8px" }}>
        <div className="wrap">
          <div className="faq">
            <h2>How testing works</h2>
            {FAQS.map((f, i) => (
              <details className="q" key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p className="a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StorefrontFooter showLabReports />
    </>
  );
}
