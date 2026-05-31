// Shared storefront view-model types (Product, LabReport) consumed by the live
// Payload → view-model mappers (lib/storefront.ts) and every storefront surface,
// the image URL helper, plus the static chrome constants the grove CMS-content
// pages still render (BRAND/NAV/FOOT/ANNOUNCE/TAGLINE, used by Chrome.tsx).

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

// A lab report (COA) view-model for the /lab-reports storefront page. Mirrors
// the Product view-model convention: null/absent CMS fields collapse to empty
// strings so live and demo data render identically.
export type LabReport = {
  id: string;
  productName: string;
  brand: string;
  category: string;
  img: string;
  batchLot: string;
  potency: string;
  testedDate: string;
  lab: string;
  status: string;
  cannabinoids: { name: string; value: string }[];
  safetyScreens: { name: string; result: string }[];
  terpenes: string;
  reportUrl: string;
};

export const BRAND = "Highgrove";
export const TAGLINE =
  "Small-batch THCa from a single farm in the Hudson Valley.";
export const ANNOUNCE =
  "Free shipping over $99 · age-gated checkout · ships discreet from NY";
export const NAV = [
  { label: "Flower", slug: "flower" },
  { label: "Concentrates", slug: "concentrates" },
  { label: "Vapes", slug: "vapes" },
  { label: "Pre-rolls", slug: "prerolls" },
  { label: "Edibles", slug: "edibles" },
  { label: "Lab reports", slug: "coa" },
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

// `http…` (absolute) and `/…` (root-relative, e.g. Payload Media at
// /api/media/file/…) are already real URLs and pass through untouched; anything
// else is treated as an Unsplash photo id and expanded with the requested width.
export const imgUrl = (id: string, w = 900) =>
  id.startsWith("http") || id.startsWith("/")
    ? id
    : `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
