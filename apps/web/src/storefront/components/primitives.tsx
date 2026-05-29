// Shared UI atoms — ported from the kit's primitives.jsx.

import type { CSSProperties, ReactNode } from "react";
import { imgUrl, type Product } from "../data";

export function Btn({
  variant = "primary",
  size = "md",
  children,
  href = "#",
  block,
  style,
}: {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  href?: string;
  block?: boolean;
  style?: CSSProperties;
}) {
  const cls = `btn btn--${variant}${size === "lg" ? " btn--lg" : size === "sm" ? " btn--sm" : ""}${block ? " btn--block" : ""}`;
  return (
    <a className={cls} href={href} style={style}>
      {children}
    </a>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="eyebrow" style={style}>
      {children}
    </div>
  );
}

export function ProductCard({ product, href = "#" }: { product: Product; href?: string }) {
  const bg = product.img ? { backgroundImage: `url('${imgUrl(product.img)}')` } : undefined;
  return (
    <a className="pcard" href={href} role="button">
      <div className="pcard__media" style={bg}>
        {product.tag ? <div className="pcard__chip">{product.tag}</div> : null}
      </div>
      <div>
        <div className="pcard__row">
          <div className="pcard__name">{product.name}</div>
          <div className="pcard__price">${product.price}</div>
        </div>
        <div className="pcard__meta">{product.meta}</div>
      </div>
    </a>
  );
}
