// Highgrove storefront demo data — ported from the design handoff
// (ui_kits/storefront/data.jsx, "highgrove" theme). This is the small-batch
// THCa operator: Grove's first regulated-goods tenant.
//
// Standalone on purpose: the preview route renders from this so it does NOT
// depend on the Payload Local API (which is being wired in (frontend)/page.tsx
// concurrently). Swapping this for live `payload.find(...)` data is the
// follow-up handoff.

export type Product = {
  id: string;
  name: string;
  meta: string;
  price: number;
  tag: string;
  category: string;
  effect: string;
  type: string;
  thc: string;
  img: string;
  lot: string;
  // Optional, populated from Payload for the live storefront (PDP, cart links).
  slug?: string;
  description?: string;
  terpenes?: string;
};

export type Effect = { id: string; label: string; desc: string; img: string };
export type Facet = { name: string; options: string[] };

export const BRAND = "Highgrove";
export const TAGLINE =
  "Small-batch THCa from a single farm in the Hudson Valley.";
export const ANNOUNCE =
  "Free shipping over $99 · age-gated checkout · ships discreet from NY";
export const EYEBROW = "Single-farm THCa · est. 2021";

export const NAV = [
  { label: "Flower", slug: "flower" },
  { label: "Concentrates", slug: "concentrates" },
  { label: "Vapes", slug: "vapes" },
  { label: "Pre-rolls", slug: "prerolls" },
  { label: "Edibles", slug: "edibles" },
  { label: "Lab reports", slug: "coa" },
];

export const EFFECTS: Effect[] = [
  { id: "sleep", label: "Sleep", desc: "Heavy, body-leaning", img: "1532635224-cf024e66cd76" },
  { id: "chill", label: "Chill", desc: "Mellow, end of day", img: "1490750967868-88aa4486c946" },
  { id: "euphoric", label: "Euphoric", desc: "Bright, social", img: "1518495973542-4542c06a5843" },
  { id: "creative", label: "Creative", desc: "Lucid, head-forward", img: "1499209974431-9dddcece7f88" },
  { id: "focus", label: "Focus", desc: "Clean, low body load", img: "1494790108377-be9c29b29330" },
];

export const PRODUCTS: Product[] = [
  { id: "sour-grapes", name: "Sour Grapes", meta: "Indica · live resin vape · 1g", price: 44, tag: "Best seller", category: "Vapes", effect: "chill", type: "Indica", thc: "82% THCa", img: "1603909223429-69bb7101f420", lot: "0421-A" },
  { id: "super-boof", name: "Super Boof", meta: "Hybrid · pre-roll 5pk · 0.5g", price: 38, tag: "", category: "Pre-rolls", effect: "euphoric", type: "Hybrid", thc: "27% THCa", img: "1620912189858-7c6e6e6e9e1a", lot: "0419-B" },
  { id: "guava-cake", name: "Guava Cake", meta: "Indica · 3.5g flower", price: 49, tag: "", category: "Flower", effect: "chill", type: "Indica", thc: "29% THCa", img: "1603909223429-69bb7101f420", lot: "0418-A" },
  { id: "papaya", name: "Dulce de Papaya", meta: "Sativa · 7g flower", price: 89, tag: "Limited", category: "Flower", effect: "creative", type: "Sativa", thc: "26% THCa", img: "1604908554027-9d12c4be4cf7", lot: "0418-B" },
  { id: "maui-fruit", name: "Maui Fruit", meta: "Sativa · live resin cart · 1g", price: 49, tag: "", category: "Vapes", effect: "euphoric", type: "Sativa", thc: "84% THCa", img: "1605283176567-0c98c0f57f50", lot: "0417-A" },
  { id: "jelly-donuts", name: "Jelly Donuts", meta: "Hybrid · live rosin · 1g", price: 65, tag: "Solventless", category: "Concentrates", effect: "euphoric", type: "Hybrid", thc: "78% THCa", img: "1603909223429-69bb7101f420", lot: "0416-A" },
  { id: "tropaya", name: "Tropaya", meta: "Sativa · pre-roll 2pk · 1g", price: 24, tag: "", category: "Pre-rolls", effect: "creative", type: "Sativa", thc: "28% THCa", img: "1620912189858-7c6e6e6e9e1a", lot: "0415-A" },
  { id: "sour-diesel", name: "Sour Diesel", meta: "Sativa · 3.5g flower", price: 45, tag: "", category: "Flower", effect: "focus", type: "Sativa", thc: "31% THCa", img: "1604908554027-9d12c4be4cf7", lot: "0414-A" },
  { id: "zlushiez", name: "Zlushiez Smalls", meta: "Hybrid · 14g · smalls", price: 89, tag: "Value", category: "Flower", effect: "chill", type: "Hybrid", thc: "24% THCa", img: "1603909223429-69bb7101f420", lot: "0413-A" },
  { id: "cool-cocol", name: "Cool Cocol Push", meta: "Indica · rosin gummies · 100mg", price: 28, tag: "", category: "Edibles", effect: "sleep", type: "Indica", thc: "10mg/pc", img: "1582719201953-1419caa3b91b", lot: "0412-A" },
  { id: "papaya-bomb", name: "Papaya Bomb", meta: "Hybrid · distillate vape · 1g", price: 39, tag: "", category: "Vapes", effect: "chill", type: "Hybrid", thc: "88% THC", img: "1605283176567-0c98c0f57f50", lot: "0411-A" },
  { id: "hudson-haze", name: "Hudson Haze", meta: "Sativa · 3.5g · house strain", price: 54, tag: "House", category: "Flower", effect: "focus", type: "Sativa", thc: "30% THCa", img: "1604908554027-9d12c4be4cf7", lot: "0410-A" },
];

export const FACETS: Facet[] = [
  { name: "Category", options: ["Flower", "Concentrates", "Vapes", "Pre-rolls", "Edibles"] },
  { name: "Strain", options: ["Indica", "Sativa", "Hybrid"] },
  { name: "Effect", options: ["Sleep", "Chill", "Euphoric", "Creative", "Focus"] },
  { name: "Potency", options: ["Under 20%", "20–25%", "25–30%", "30%+"] },
  { name: "Format", options: ["Solventless", "Live resin", "Distillate", "Flower"] },
];

export const COMPARE_ROWS: [string, boolean, boolean][] = [
  ["Single-farm grown", true, false],
  ["Hand-trimmed", true, false],
  ["Cured 21+ days", true, false],
  ["Lot-traceable COA", true, true],
  ["Solventless options", true, false],
  ["Discreet shipping", true, true],
];

export const FOOT = {
  blurb: "A small farm in Columbia County, NY, growing federally compliant hemp under license.",
  address: "By appointment · 2231 Route 23B, Hudson, NY",
  shop: ["Flower", "Concentrates", "Vapes", "Pre-rolls", "Edibles", "Gift cards"],
  learn: ["About THCa", "Lab reports", "Journal", "Wholesale"],
  help: ["Shipping & states", "Returns", "Age verification", "Contact"],
  legal:
    "Hemp under the 2018 Farm Bill · less than 0.3% Δ9 by dry weight. Not for use by anyone under 21. Keep away from children and pets. Do not drive or operate machinery.",
};

export const imgUrl = (id: string, w = 900) =>
  id.startsWith("http")
    ? id
    : `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
