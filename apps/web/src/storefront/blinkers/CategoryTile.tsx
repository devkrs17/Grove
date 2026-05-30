// Blinkers category tile — ports the mock's .cat.
// Full-bleed image with a dark scrim, a label (h3) and a lime count pill
// pinned to the bottom. Server component; plain <a> + <img>.

export interface CategoryTileProps {
  label: string;
  /** Background image URL. */
  image: string;
  href?: string;
  /** Text inside the lime pill, e.g. "6 →". */
  pill: string;
}

export function CategoryTile({ label, image, href = "#", pill }: CategoryTileProps) {
  return (
    <a className="cat" href={href}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={label} />
      <span className="cat__scrim" />
      <span className="cat__label">
        <h3>{label}</h3>
        <span className="cat__pill">{pill}</span>
      </span>
    </a>
  );
}
