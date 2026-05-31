// Blinkers announcement bar — ports the mock's .announce (black bg, lime text).

import type { ReactNode } from "react";

export interface AnnounceProps {
  children: ReactNode;
}

export function Announce({ children }: AnnounceProps) {
  return <div className="announce">{children}</div>;
}
