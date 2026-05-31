// Blinkers product chip — ports the mock's .pcard__chip badge.
// The mock colors chips inline per tone (lime / tang / sky / pink / grape).
// We expose a typed `tone` that reproduces those exact inline overrides so
// the look matches without inventing new CSS classes.

import type { CSSProperties, ReactNode } from "react";

export type ChipTone = "lime" | "tang" | "sky" | "pink" | "grape" | "ink";

const TONE_STYLE: Record<ChipTone, CSSProperties> = {
  // "Best seller" badge in the mock: lime fill, ink text + ink border (default).
  lime: { background: "var(--lime)", color: "var(--ink)", borderColor: "var(--ink)" },
  tang: { background: "var(--tang)", color: "#fff", borderColor: "var(--tang)" },
  sky: { background: "var(--sky)", color: "#fff", borderColor: "var(--sky)" },
  pink: { background: "var(--pink)", color: "#fff", borderColor: "var(--pink)" },
  grape: { background: "var(--grape)", color: "#fff", borderColor: "var(--grape)" },
  ink: { background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" },
};

export interface ChipProps {
  children: ReactNode;
  /** Color tone. Defaults to lime (the mock's "Best seller" badge). */
  tone?: ChipTone;
  /** Extra classes appended after `.pcard__chip`. */
  className?: string;
}

export function Chip({ children, tone = "lime", className }: ChipProps) {
  const cls = `pcard__chip${className ? ` ${className}` : ""}`;
  return (
    <span className={cls} style={TONE_STYLE[tone]}>
      {children}
    </span>
  );
}
