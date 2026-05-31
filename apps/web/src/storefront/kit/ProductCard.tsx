// Blinkers product card — ports the mock's .pcard.
// White card, 2px ink border, 20px radius, 1:1 image, lime price pill,
// uppercase grape brand label, optional colored chip, optional star row.
// Server component; plain <a> + <img>.

import { Chip, type ChipTone } from "./Chip";

export interface ProductCardChip {
  label: string;
  tone?: ChipTone;
}

export interface ProductCardProps {
  name: string;
  /** Brand label — rendered uppercase in grape (.pcard__brand). */
  brand: string;
  /** Price in dollars; rendered as `$<price>` in the lime pill. */
  price: number;
  /** Image URL for the 1:1 media. */
  image: string;
  href?: string;
  /** Optional badge over the image (e.g. "Best seller", "New", "1000mg"). */
  chip?: ProductCardChip;
  /** Optional rating 0–5; renders that many filled stars (capped at 5). */
  rating?: number;
}

const STAR_MAX = 5;

export function ProductCard({ name, brand, price, image, href = "#", chip, rating }: ProductCardProps) {
  const filled = rating === undefined ? 0 : Math.max(0, Math.min(STAR_MAX, Math.round(rating)));
  return (
    <a className="pcard" href={href}>
      <div className="pcard__media">
        {chip ? <Chip tone={chip.tone}>{chip.label}</Chip> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} />
      </div>
      <div className="pcard__brand">{brand}</div>
      <div className="pcard__row">
        <div className="pcard__name">{name}</div>
        <div className="pcard__price">${price}</div>
      </div>
      {rating === undefined ? null : <div className="pcard__stars">{"★".repeat(filled)}</div>}
    </a>
  );
}
