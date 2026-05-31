// Blinkers scrolling marquee — ports the mock's .marquee strip.
// The CSS animation translates the track by -50%, so the item list must be
// rendered twice for a seamless loop. We take `items` once and duplicate it.

import { Fragment } from "react";

export interface MarqueeProps {
  /** Phrases shown between lime bullets, e.g. ["New drop", "Lab-tested lots"]. */
  items: string[];
}

function Run({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          <b>✦</b> {item}{" "}
        </Fragment>
      ))}
    </>
  );
}

export function Marquee({ items }: MarqueeProps) {
  return (
    <div className="marquee">
      <div className="marquee__track">
        <span>
          {/* Duplicated run so the -50% scroll loops seamlessly. */}
          <Run items={items} />
          <Run items={items} />
        </span>
      </div>
    </div>
  );
}
