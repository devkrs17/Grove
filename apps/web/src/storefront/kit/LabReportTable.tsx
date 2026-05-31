"use client";

// Blinkers lab-report library — the one interactive island on the /lab-reports
// page. Ports the static mock's table + toolbar (search + category pills) and
// its inline applyFilter()/setCat() script into React state. Receives the full
// LabReport[] and filters client-side: search matches product name or batch /
// lot; the category pills narrow by product category. Shows the live count and
// an empty state, mirroring the mock. Presentation only — no data fetching.

import { useMemo, useState } from "react";
import type { LabReport } from "../data";
import { imgUrl } from "../data";
import { StatusBadge } from "./StatusBadge";

const CATEGORIES = ["all", "Edibles", "Concentrates", "Vapes"] as const;
type Category = (typeof CATEGORIES)[number];

export function LabReportTable({ reports }: { reports: LabReport[] }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category>("all");

  const q = query.trim().toLowerCase();

  const shown = useMemo(
    () =>
      reports.filter((r) => {
        const matchText =
          !q ||
          r.productName.toLowerCase().includes(q) ||
          r.batchLot.toLowerCase().includes(q);
        const matchCat = activeCat === "all" || r.category === activeCat;
        return matchText && matchCat;
      }),
    [reports, q, activeCat],
  );

  const isDefault = activeCat === "all" && !q;

  return (
    <>
      {/* toolbar: search + category pills */}
      <div className="toolbar">
        <label className="search">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#14130d" strokeWidth="2" />
            <path d="M13 13l3 3" stroke="#14130d" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by product or batch / lot…"
            aria-label="Search lab reports"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="pills" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill${cat === activeCat ? " is-active" : ""}`}
              aria-pressed={cat === activeCat}
              onClick={() => setActiveCat(cat)}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="libcard">
        <div className="libcard__scroll">
          <table className="lib" aria-label="Lab report library">
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch / Lot</th>
                <th>Category</th>
                <th>Potency</th>
                <th>Tested</th>
                <th>Lab</th>
                <th>Result</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="lib__prod">
                      <span className="lib__thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl(r.img)} alt="" />
                      </span>
                      <span>
                        <span className="lib__name">{r.productName}</span>
                        {r.brand ? <span className="lib__brand">{r.brand}</span> : null}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="lib__lot">{r.batchLot}</span>
                  </td>
                  <td>
                    {r.category ? <span className="lib__cat">{r.category}</span> : null}
                  </td>
                  <td>
                    <span className="lib__pot">{r.potency}</span>
                  </td>
                  <td className="lib__muted">{r.testedDate}</td>
                  <td className="lib__muted">{r.lab}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    {r.reportUrl ? (
                      <a className="lib__coa" href={r.reportUrl} target="_blank" rel="noreferrer">
                        COA ↗
                      </a>
                    ) : (
                      <span className="lib__muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shown.length === 0 ? (
          <div className="lib__empty">
            No reports match that search. Try a product name or a batch / lot like “BF-GP24”.
          </div>
        ) : null}
      </div>

      <p className="lib__count">
        <b>{shown.length}</b> {shown.length === 1 ? "report" : "reports"}
        {isDefault ? " · newest first" : " shown"}
      </p>
    </>
  );
}
