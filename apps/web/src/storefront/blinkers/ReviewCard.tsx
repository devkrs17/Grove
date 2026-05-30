// Blinkers review card — ports the mock's .review.
// White card with a lime star row, title, body, and an author line with a
// lime "Verified" badge. Server component.

const STAR_MAX = 5;

export interface ReviewCardProps {
  title: string;
  body: string;
  /** Author name shown in the .review__by line. */
  author: string;
  /** Rating 0–5; renders that many filled stars. Defaults to 5 (the mock). */
  rating?: number;
  /** Badge text next to the author. Defaults to "Verified". Pass null to omit. */
  badge?: string | null;
}

export function ReviewCard({ title, body, author, rating = STAR_MAX, badge = "Verified" }: ReviewCardProps) {
  const filled = Math.max(0, Math.min(STAR_MAX, Math.round(rating)));
  return (
    <article className="review">
      <div className="review__stars">{"★".repeat(filled)}</div>
      <h3 className="review__title">{title}</h3>
      <p className="review__body">{body}</p>
      <div className="review__by">
        {author} {badge ? <span className="v">{badge}</span> : null}
      </div>
    </article>
  );
}
