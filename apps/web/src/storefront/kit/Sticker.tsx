// Blinkers floating sticker — ports the mock's .sticker / --tr / --bl badges
// that overlap the hero image. Server component.

import type { ReactNode } from "react";

/** Corner placement. `tr` = top-right (pink), `bl` = bottom-left (lime). */
export type StickerPosition = "tr" | "bl";

export interface StickerProps {
  children: ReactNode;
  position: StickerPosition;
  /** Extra classes appended after the sticker classes. */
  className?: string;
}

export function Sticker({ children, position, className }: StickerProps) {
  const cls = `sticker sticker--${position}${className ? ` ${className}` : ""}`;
  return <span className={cls}>{children}</span>;
}
