// Blinkers pill button — ports the mock's .btn / .btn--lime / --dark / --ghost.
// Server component (no interactivity); renders a plain <a>.

import type { ReactNode } from "react";

export type ButtonVariant = "lime" | "dark" | "ghost";

export interface ButtonProps {
  /** Visual style. Maps to .btn--lime / .btn--dark / .btn--ghost. */
  variant?: ButtonVariant;
  children: ReactNode;
  href?: string;
  /** Extra classes appended after the base button classes. */
  className?: string;
}

export function Button({ variant = "lime", children, href = "#", className }: ButtonProps) {
  const cls = `btn btn--${variant}${className ? ` ${className}` : ""}`;
  return (
    <a className={cls} href={href}>
      {children}
    </a>
  );
}
