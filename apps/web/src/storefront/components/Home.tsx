// Highgrove homepage — ported from home.jsx (HomeCannabis).

import { Btn, Eyebrow, ProductCard } from "./primitives";
import { Icon } from "./Icon";
import { COMPARE_ROWS, EFFECTS, PRODUCTS, imgUrl } from "../data";

const SHOP = "/storefront-preview/shop";
const bgImg = (id: string, w = 1200) => ({ backgroundImage: `url('${imgUrl(id, w)}')` });

const REVIEWS = [
  { name: "Daniel R.", loc: "Verified buyer", title: "Smooth.", body: "The rosin hits smoother than anything else I've tried. Pure fire.", strain: "Cherry Kush · Live Rosin" },
  { name: "Marisa T.", loc: "Verified buyer", title: "Real quality.", body: "Finally a hemp brand I actually trust. COAs, flavor, and effect are all on point.", strain: "Greenhouse THCa Flower" },
  { name: "Eli M.", loc: "Verified buyer", title: "Better than dispo.", body: "I switched from dispensary carts to Highgrove. Better taste, and I feel the difference.", strain: "Lemon Cherry THCa" },
];

export function Home() {
  const bestSellers = PRODUCTS.slice(4, 8);

  return (
    <div className="shell">
      {/* HERO */}
      <section className="hero hero--cannabis">
        <div className="hero__inner hero__inner--cannabis">
          <div className="hero__rating">
            Hudson Valley · est. 2021 <span>· four years on a single farm</span>
          </div>
          <h1 className="hero__title hero__title--display">
            Small-batch <em>THCa,</em> grown in one place.
          </h1>
          <p className="hero__sub">
            Hand-trimmed flower, solventless concentrates, and live-resin vapes from a single farm in
            Columbia County. Every batch carries a lot number you can trace to the lab report.
          </p>
          <div className="hero__cta">
            <Btn variant="primary" size="lg" href={SHOP}>
              Shop the harvest →
            </Btn>
            <Btn variant="ghost" size="lg" href={SHOP}>
              Browse by effect
            </Btn>
          </div>
          <div className="hero__lot">LOT 0421-A · COLUMBIA COUNTY · NY</div>
        </div>
        <div className="hero__bg" />
      </section>

      {/* SHOP BY EFFECT */}
      <section className="section--tight">
        <div className="container">
          <div className="effect-index">
            <div className="effect-index__head">
              <Eyebrow>The almanac</Eyebrow>
              <h2 className="effect-index__title">
                How do you
                <br />
                want to <em>land?</em>
              </h2>
              <p className="effect-index__lede">
                Same plant, five different arrivals. Hover a row to peek at the strains we&apos;d pour you
                that night.
              </p>
            </div>
            <ol className="effect-index__list">
              {EFFECTS.map((e, i) => {
                const matches = PRODUCTS.filter((p) => p.effect === e.id).slice(0, 3);
                const count = PRODUCTS.filter((p) => p.effect === e.id).length;
                return (
                  <li key={e.id} className="effect-row">
                    <span className="effect-row__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="effect-row__name">
                      {e.label}
                      <span className="effect-row__desc">{e.desc}</span>
                    </span>
                    <span className="effect-row__thumbs">
                      {matches.map((m) => (
                        <span key={m.id} className="effect-row__thumb" style={bgImg(m.img, 200)} title={m.name} />
                      ))}
                    </span>
                    <span className="effect-row__count">{count} strains</span>
                    <span className="effect-row__arrow">→</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="section--tight">
        <div className="container">
          <div className="commit">
            <figure className="commit__image">
              <img src={imgUrl("1603909223429-69bb7101f420", 1400)} alt="Hand-trimmed flower" />
            </figure>
            <div className="commit__head">
              <Eyebrow>Three commitments</Eyebrow>
              <h2 className="commit__title">
                One farm. One harvest at a time. <em>No shortcuts.</em>
              </h2>
            </div>
            <ol className="commit__list">
              <li className="commit__item">
                <span className="commit__num">I.</span>
                <h3 className="commit__h">
                  Indoor-grown
                  <br />
                  flower.
                </h3>
                <p className="commit__p">
                  Hand-trimmed, slow-cured 21–30 days, never fan-leaf-mixed. Each lot is small enough that
                  we can actually tell you who hung it.
                </p>
                <a className="commit__cta" href={SHOP}>
                  Shop flower →
                </a>
              </li>
              <li className="commit__item">
                <span className="commit__num">II.</span>
                <h3 className="commit__h">
                  Solventless
                  <br />
                  concentrates.
                </h3>
                <p className="commit__p">
                  Ice and pressure. No butane, no chemistry. The cleanest expression of the plant we know
                  how to make — washed, pressed, jarred.
                </p>
                <a className="commit__cta" href={SHOP}>
                  Shop concentrates →
                </a>
              </li>
              <li className="commit__item">
                <span className="commit__num">III.</span>
                <h3 className="commit__h">
                  Lot-traceable
                  <br />
                  lab reports.
                </h3>
                <p className="commit__p">
                  Every batch, third-party tested for cannabinoids, terpenes, pesticides, heavy metals,
                  microbials. The COA is on the jar and in your inbox.
                </p>
                <a className="commit__cta" href="#">
                  Read the reports →
                </a>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section--tight">
        <div className="container">
          <div className="featured-head">
            <div>
              <Eyebrow>The shop</Eyebrow>
              <h2 className="h2" style={{ marginTop: 10 }}>
                Best sellers.
              </h2>
            </div>
            <a style={{ fontSize: 14, color: "var(--ink-2)" }} href={SHOP}>
              Browse all 47 →
            </a>
          </div>
          <div className="featured-grid">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} href={SHOP} />
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="trust">
        <div className="container trust__inner">
          <div className="trust__head">
            <Eyebrow>Why Highgrove</Eyebrow>
            <h2 className="h2">Look no further.</h2>
            <p className="p">
              Most THCa online comes from the same six farms in the Carolinas, repackaged. We grow ours one
              place — here.
            </p>
          </div>
          <table className="compare">
            <thead>
              <tr>
                <th />
                <th className="compare__us">Highgrove</th>
                <th>Most others</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r, i) => (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td className="compare__us">{r[1] ? "✓" : "—"}</td>
                  <td>{r[2] ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CONFIDENCE STRIP */}
      <section className="confidence">
        <div className="container confidence__inner">
          <div className="confidence__item">
            <Icon name="package" size={28} />
            <div>
              <strong>Discreet shipping</strong>
              <span>Plain box, no labels</span>
            </div>
          </div>
          <div className="confidence__item">
            <Icon name="leaf" size={28} />
            <div>
              <strong>Single-farm grown</strong>
              <span>Columbia County, NY</span>
            </div>
          </div>
          <div className="confidence__item">
            <Icon name="droplet" size={28} />
            <div>
              <strong>Lot-traceable COA</strong>
              <span>Scan the QR on the jar</span>
            </div>
          </div>
          <div className="confidence__item">
            <Icon name="heart" size={28} />
            <div>
              <strong>Quality guarantee</strong>
              <span>30-day return on unopened</span>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews">
        <div className="container reviews__inner">
          <div className="reviews__head">
            <Eyebrow>Customer feedback</Eyebrow>
            <h2 className="h2">Trusted by thousands.</h2>
            <div className="reviews__stars">
              ★★★★★ <span>4.9 / 5 · 4,266 reviews</span>
            </div>
          </div>
          <div className="reviews__grid">
            {REVIEWS.map((r, i) => (
              <article key={i} className="review">
                <div className="review__stars">★★★★★</div>
                <div className="review__head">
                  <strong>{r.name}</strong>
                  <span>· {r.loc}</span>
                </div>
                <h4 className="review__title">{r.title}</h4>
                <p className="review__body">{r.body}</p>
                <div className="review__strain">{r.strain}</div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Btn variant="secondary" size="md">
              Read all 4,266 reviews →
            </Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
