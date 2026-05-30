// Live Blinkers homepage — composes the kit from real products + the per-tenant
// `homepage` Payload doc (falls back to sensible defaults so it renders before
// the doc is seeded). Server component.

import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Homepage } from "@grove/types";
import type { Product } from "../data";
import { imgUrl } from "../data";
import { productHref } from "@/lib/storefront";
import { Announce } from "./Announce";
import { BlinkersNav } from "./BlinkersNav";
import { BlinkersFooter } from "./BlinkersFooter";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { ProductCard } from "./ProductCard";
import { CategoryTile } from "./CategoryTile";
import { SectionHead } from "./SectionHead";
import { ReviewCard } from "./ReviewCard";
import { EmailBand } from "./EmailBand";

const NAV_LINKS = [
  { label: "Edibles", href: "/shop" },
  { label: "Concentrates", href: "/shop" },
  { label: "Vapes", href: "/shop" },
  { label: "Lab reports", href: "/lab-reports" },
];

const CATEGORIES = ["Edibles", "Concentrates", "Vapes"];

const DEFAULTS = {
  announcement: "Free shipping over $99 · 21+ · ships discreet, no labels",
  heroEyebrow: "Small-batch THCa · since 2021",
  heroHighlight: "Loud flavor.",
  heroHeadline: "Clean labs.",
  heroSubhead:
    "A tight shelf of THCa edibles, rosin, and vapes — lab-tested, traceable, shipped discreet. Picked because we actually use them.",
  heroRating: "4.9 · 15,000+ reviews · free shipping $99+",
  heroImage: "/packs/blinkers_flip_gelato_pie_pineapple_haze.jpg",
  marqueeItems: [
    "New drop",
    "Lab-tested lots",
    "Solventless rosin",
    "Ships discreet",
    "21+ only",
    "Loud flavor",
    "Free ship $99+",
  ],
  featuredHeading: "This week's favorites.",
  storyHeading: "A shelf we'd actually shop.",
  story: [
    "Blinkers started with a simple gripe: good hemp shouldn't feel like a trip to the dispensary — over-serious, overpriced, kinda boring.",
    "So we built the shelf we wanted. Litt's loud-flavored edibles, 710 Nomad's solventless rosin, and our own Blinkers Flip vapes. Every lot third-party tested and traceable.",
    "If we wouldn't hand it to a friend, it doesn't make the cut.",
  ],
  storyImage: "/packs/blinkers_flip_gushers_banana_mochi.jpg",
  reviewsHeading: "Loved by the group chat.",
  reviews: [
    { title: "Honestly obsessed", body: "The Blinkers Flip carts actually taste like the flavor on the box, and they last forever.", author: "Maya T." },
    { title: "No more dispo runs", body: "Switched from the dispensary and never looked back. COA on everything, ships fast and discreet.", author: "Devon R." },
    { title: "Litt edibles >>>", body: "Treasure Trove is dangerous lol. Real dosing, real flavor, none of that nasty aftertaste.", author: "Priya K." },
  ],
  emailHeading: "Get first dibs on drops.",
  emailSub: "New batches sell out. Subscribers get a heads-up — and 10% off the first order.",
  emailCta: "Sign me up",
};

/** Pull a label from a product name (the packs are name-prefixed by brand). */
function brandOf(name: string): string {
  if (name.startsWith("Litt")) return "Litt Edibles";
  if (name.startsWith("710 Nomad")) return "710 Nomad Rosin";
  if (name.startsWith("Blinkers Flip")) return "Blinkers Flip";
  return "";
}

/** A populated upload relationship resolves to a Media object with a url. */
function mediaUrl(value: Homepage["heroImage"]): string | null {
  return value && typeof value === "object" ? (value.url ?? null) : null;
}

export function BlinkersHome({ products, homepage }: { products: Product[]; homepage: Homepage | null }) {
  const hp = homepage;
  const featured = products.slice(0, 8);
  const catTiles = CATEGORIES.map((label) => {
    const items = products.filter((p) => p.category === label);
    return { label, image: items[0] ? imgUrl(items[0].img) : "", count: items.length };
  }).filter((t) => t.image);

  const marqueeFromHp = hp?.marqueeItems?.map((i) => i.text ?? "").filter((t) => t.length > 0) ?? [];
  const marqueeItems = marqueeFromHp.length ? marqueeFromHp : DEFAULTS.marqueeItems;

  const reviewsSrc = hp?.reviews?.length ? hp.reviews : DEFAULTS.reviews;
  const reviews = reviewsSrc.map((r) => ({
    title: r.title ?? "",
    body: r.body ?? "",
    author: r.author ?? "",
    badge: "badge" in r && r.badge != null ? r.badge : "Verified",
  }));

  return (
    <>
      <Announce>{hp?.announcement ?? DEFAULTS.announcement}</Announce>
      <BlinkersNav brandHref="/" links={NAV_LINKS} cartHref="/cart" />

      <Hero
        eyebrow={hp?.heroEyebrow ?? DEFAULTS.heroEyebrow}
        highlight={hp?.heroHighlight ?? DEFAULTS.heroHighlight}
        headline={hp?.heroHeadline ?? DEFAULTS.heroHeadline}
        subhead={hp?.heroSubhead ?? DEFAULTS.heroSubhead}
        primaryCta={{ label: hp?.heroCtaPrimaryLabel ?? "Shop the drop →", href: hp?.heroCtaPrimaryHref ?? "/shop" }}
        secondaryCta={{ label: hp?.heroCtaSecondaryLabel ?? "See the lab reports", href: hp?.heroCtaSecondaryHref ?? "/lab-reports" }}
        trust={hp?.heroRating ?? DEFAULTS.heroRating}
        image={mediaUrl(hp?.heroImage ?? null) ?? DEFAULTS.heroImage}
        stickers={[
          { label: "2g · dual flavor", position: "tr" },
          { label: "every lot lab-tested ✓", position: "bl" },
        ]}
      />

      <Marquee items={marqueeItems} />

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="The lineup"
            title={hp?.featuredHeading ?? DEFAULTS.featuredHeading}
            seeAll={{ label: `Browse all ${products.length} →`, href: "/shop" }}
          />
          <div className="pgrid">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                brand={brandOf(p.name)}
                price={p.price}
                image={imgUrl(p.img)}
                href={productHref(p.slug ?? p.id)}
                rating={5}
                chip={p.tag ? { label: p.tag, tone: "lime" } : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead eyebrow="Browse" title="Pick your lane." />
          <div className="cats">
            {catTiles.map((t) => (
              <CategoryTile key={t.label} label={t.label} image={t.image} pill={`${t.count} →`} href="/shop" />
            ))}
          </div>
        </div>
      </section>

      <section className="story">
        <div className="story__grid">
          <div>
            <div className="eyebrow">Why we exist</div>
            <h2>{hp?.storyHeading ?? DEFAULTS.storyHeading}</h2>
            {hp?.storyBody ? (
              <RichText data={hp.storyBody} />
            ) : (
              DEFAULTS.story.map((para) => <p key={para}>{para}</p>)
            )}
          </div>
          <div className="story__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(hp?.storyImage ?? null) ?? DEFAULTS.storyImage} alt="" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Don't take our word"
            title={hp?.reviewsHeading ?? DEFAULTS.reviewsHeading}
            aside={
              <div style={{ fontFamily: "var(--disp)", fontWeight: 600, color: "var(--ink-2)" }}>
                ★ 4.9 / 5 · 15,000+ reviews
              </div>
            }
          />
          <div className="reviews__grid">
            {reviews.map((r) => (
              <ReviewCard key={r.title} title={r.title} body={r.body} author={r.author} badge={r.badge} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 8 }}>
        <EmailBand
          heading={hp?.emailHeading ?? DEFAULTS.emailHeading}
          sub={hp?.emailSub ?? DEFAULTS.emailSub}
          cta={hp?.emailCta ?? DEFAULTS.emailCta}
        />
      </section>

      <BlinkersFooter />
    </>
  );
}
