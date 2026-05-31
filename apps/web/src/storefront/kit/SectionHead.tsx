// Blinkers section header — ports the mock's .section__head.
// Left: eyebrow + h2. Right (optional): either a ".seeall" pill link or an
// arbitrary aside node (the mock uses plain text for the reviews rating).
// Server component.

import type { ReactNode } from "react";

export interface SectionHeadLink {
  label: string;
  href: string;
}

export interface SectionHeadProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** The h2 title. */
  title: string;
  /** Optional pill link on the right (e.g. "Browse all 21 →"). */
  seeAll?: SectionHeadLink;
  /** Optional arbitrary right-side content (used instead of `seeAll`). */
  aside?: ReactNode;
}

export function SectionHead({ eyebrow, title, seeAll, aside }: SectionHeadProps) {
  return (
    <div className="section__head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 style={{ marginTop: 8 }}>{title}</h2>
      </div>
      {seeAll ? (
        <a className="seeall" href={seeAll.href}>
          {seeAll.label}
        </a>
      ) : null}
      {aside ?? null}
    </div>
  );
}
