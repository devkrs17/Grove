// Lab-report result badge — ports the mock's `.pass` pill, driven by the
// LabReport `status` value ("pass" | "fail" | "pending" | ""). The mock only
// shows passing lots, but the frozen view-model allows other states, so the
// badge reflects the real status instead of hard-coding "Pass": passing lots
// get the lime check pill (identical to the mock); fail/pending/unknown reuse
// the same pill shape with a status-specific tone (see lab-reports.css). No
// hooks — safe to render from both the server page and the client table.

import type { CSSProperties } from "react";

const VARIANT: Record<string, { className: string; tick: string; label: string }> = {
  pass: { className: "pass", tick: "✓", label: "Pass" },
  fail: { className: "pass pass--fail", tick: "✕", label: "Fail" },
  pending: { className: "pass pass--pending", tick: "•", label: "Pending" },
};

export interface StatusBadgeProps {
  /** Raw status from the view-model: "pass" | "fail" | "pending" | "". */
  status: string;
  /** Override the label text (e.g. the Sample COA's "Passed all screens"). */
  label?: string;
  style?: CSSProperties;
}

export function StatusBadge({ status, label, style }: StatusBadgeProps) {
  const v = VARIANT[status] ?? VARIANT.pending;
  return (
    <span className={v.className} style={style}>
      <span className="tick">{v.tick}</span> {label ?? v.label}
    </span>
  );
}
