// Blinkers hero — ports the mock's <section class="hero">.
// Blurred lime/grape blobs, a pill eyebrow with a lime dot, a headline whose
// leading phrase gets the lime highlight mark, subhead, primary/ghost CTAs,
// a star trust line, and a bordered 4:5 media image with corner stickers.
// Server component.

import { Button } from "./Button";
import { Sticker, type StickerPosition } from "./Sticker";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSticker {
  label: string;
  position: StickerPosition;
}

export interface HeroProps {
  /** Small pill label above the headline (e.g. "Small-batch THCa · since 2021"). */
  eyebrow: string;
  /** Leading phrase that receives the lime highlight mark. */
  highlight: string;
  /** Remaining headline text, rendered on the next line after the highlight. */
  headline: string;
  subhead: string;
  /** Primary CTA — lime pill. */
  primaryCta: HeroCta;
  /** Secondary CTA — ghost pill. Omitted (no ghost button) when undefined. */
  secondaryCta?: HeroCta;
  /** Trust line to the right of the stars, e.g. "4.9 · 15,000+ reviews · free shipping $99+". */
  trust: string;
  /** Hero image URL (4:5). */
  image: string;
  /** Optional corner stickers overlapping the image. */
  stickers?: HeroSticker[];
}

export function Hero({
  eyebrow,
  highlight,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  trust,
  image,
  stickers = [],
}: HeroProps) {
  return (
    <section className="hero">
      <span className="blob blob--1" />
      <span className="blob blob--2" />
      <div className="wrap hero__grid">
        <div>
          <span className="hero__eyebrow eyebrow">
            <span
              className="dot"
              style={{ width: 8, height: 8, background: "var(--lime)", borderRadius: "50%", display: "inline-block" }}
            />{" "}
            {eyebrow}
          </span>
          <h1 className="hero__title">
            <span className="hl">{highlight}</span>
            <br />
            {headline}
          </h1>
          <p className="hero__sub">{subhead}</p>
          <div className="hero__cta">
            <Button variant="lime" href={primaryCta.href}>
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button variant="ghost" href={secondaryCta.href}>
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
          <div className="hero__trust">
            <span className="stars">★★★★★</span> {trust}
          </div>
        </div>
        <div className="hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" />
          {stickers.map((s) => (
            <Sticker key={s.position} position={s.position}>
              {s.label}
            </Sticker>
          ))}
        </div>
      </div>
    </section>
  );
}
