# Blinkers storefront kit

Reusable, type-safe React components + a global stylesheet for the **Blinkers**
storefront design — a young, bold THCa shop. Everything here is a faithful port
of the approved homepage mock at `apps/web/public/homepage-mock.html`, which is
the canonical design system (tokens, classnames, and look).

> **Foundation only.** These components are **not** wired into any route or
> layout yet, and `blinkers.css` is intentionally **not imported anywhere**, so
> the build stays non-breaking. Adopt them deliberately (see below).

## Design tokens

Defined in `blinkers.css` under `:root`:

- Surfaces: `--bg` `#f5f2e9`, `--paper` `#fff`
- Ink: `--ink` `#14130d`, `--ink-2` `#4b4a40`, `--ink-3` `#86847a`
- Accents: `--lime` `#c2f04a`, `--lime-deep` `#a6db2f`, `--grape` `#7b3ff2`,
  `--grape-soft` `#d9c4ff`, `--tang` `#ff7a3d`, `--pink` `#ff5d8f`, `--sky` `#37c2e0`
- Rules: `--rule` `#e6e2d4`, `--rule-strong` `#d6d1bf`
- Type: `--disp` Space Grotesk (display/UI), `--body` Inter (body)

## Fonts

`blinkers.css` `@import`s Space Grotesk + Inter from Google Fonts, so importing
the stylesheet is enough. For best performance, also add the preconnect/link in
the storefront layout `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

## Adoption (when ready)

1. Import the stylesheet **once** in the storefront layout:
   ```ts
   import "@/storefront/blinkers/blinkers.css";
   ```
2. Wrap the storefront tree in an element with `className="blinkers"` so the
   base reset + token defaults apply (the reset is scoped to `.blinkers` so it
   does not affect other pages):
   ```tsx
   <div className="blinkers">{/* ...page... */}</div>
   ```
3. Compose the page from the components below. The mock wraps section content
   in `<div className="wrap">` and most bands in `<section className="section">`.

## Components

All are **server components** (no client JS) and render plain `<a>` / `<img>`.
Import from the barrel:

```ts
import { Hero, ProductCard, Marquee /* ... */ } from "@/storefront/blinkers";
```

| Component        | Purpose                                              | Key props |
|------------------|------------------------------------------------------|-----------|
| `Announce`       | Black/lime top bar                                   | `children` |
| `BlinkersNav`    | Lowercase brand + lime dot, links, dark cart pill    | `brand?`, `links?`, `cartCount?`, `cartHref?` |
| `Hero`           | Blobs, highlighted headline, CTAs, trust, media      | `eyebrow`, `highlight`, `headline`, `subhead`, `primaryCta`, `secondaryCta`, `trust`, `image`, `stickers?` |
| `Marquee`        | Scrolling lime-bulleted strip (auto-duplicated)      | `items` |
| `SectionHead`    | Eyebrow + h2 with optional `seeAll` pill or `aside`  | `eyebrow`, `title`, `seeAll?`, `aside?` |
| `ProductCard`    | White card, lime price pill, grape brand, chip/stars | `name`, `brand`, `price`, `image`, `href?`, `chip?`, `rating?` |
| `Chip`           | Product badge with tone (lime/tang/sky/pink/grape)   | `children`, `tone?` |
| `CategoryTile`   | Image tile with scrim, label, count pill             | `label`, `image`, `href?`, `pill` |
| `ReviewCard`     | White review card with stars + verified badge        | `title`, `body`, `author`, `rating?`, `badge?` |
| `EmailBand`      | Lime newsletter band with form + dark submit         | `heading`, `sub`, `cta`, `action?` |
| `BlinkersFooter` | Dark footer, lime headings, columns, bottom bar      | `brand?`, `blurb?`, `columns?`, `legal?`, `socials?` |
| `Button`         | Pill button (`lime` / `dark` / `ghost`)              | `variant?`, `href?`, `children` |
| `Sticker`        | Floating hero corner sticker (`tr` / `bl`)           | `position`, `children` |

Props default to the mock's content where it made sense (nav links, footer
columns, etc.), so you can render a faithful homepage with minimal wiring and
override per tenant later.

## Images

The kit uses plain `<img>` (no `next/image`) to stay dependency-free, matching
the mock. The `@next/next/no-img-element` lint rule is disabled inline at each
`<img>` for that reason.
