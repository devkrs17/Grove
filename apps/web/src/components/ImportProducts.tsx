"use client";

// Payload admin dashboard widget for the CSV product import (KRI-94).
// Renders via admin.components.beforeDashboard and POSTs to the existing
// /api/import-products endpoint, then shows the { created, errors } result.
// The import lands in the signed-in user's primary tenant.

import { useState } from "react";

type ImportResult = {
  created: number;
  errors: { row: number; reason: string }[];
};

const COLUMNS =
  "name, price, status, slug, subtitle, description, category, strainType, effect, thcLabel, lot, tag, imageId, terpenes";

export function ImportProducts() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setResult(null);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/import-products", {
        method: "POST",
        body,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? `Import failed (${res.status})`);
      } else {
        setResult(json as ImportResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid var(--theme-elevation-150, #e1e1e4)",
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 32,
        background: "var(--theme-elevation-50, #fafafa)",
      }}
    >
      <h3 style={{ margin: "0 0 4px" }}>Import products (CSV)</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.75 }}>
        Upload a CSV to bulk-create products in your primary tenant. Recognised columns:{" "}
        <code style={{ fontSize: 12 }}>{COLUMNS}</code>. <code>name</code> and <code>price</code> are
        required; unknown <code>status</code> defaults to draft; blank cells are skipped.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setResult(null);
            setError(null);
          }}
        />
        <button type="submit" className="btn btn--style-primary" disabled={!file || busy}>
          {busy ? "Importing…" : "Import"}
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 16, color: "var(--theme-error-500, #c0392b)", fontSize: 14 }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 16, fontSize: 14 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
            Imported {result.created} product{result.created === 1 ? "" : "s"}.
          </p>
          {result.errors.length > 0 ? (
            <details open>
              <summary style={{ cursor: "pointer", color: "var(--theme-warning-600, #b58a3a)" }}>
                {result.errors.length} row{result.errors.length === 1 ? "" : "s"} skipped
              </summary>
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                {result.errors.map((err) => (
                  <li key={err.row}>
                    Row {err.row}: {err.reason}
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <p style={{ margin: 0, opacity: 0.7 }}>No errors.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ImportProducts;
