// Regenerates the committed Highgrove seed images in
// packages/payload/seed-assets/. These are branded placeholder product shots
// (generated, not photography) used by the seed scripts to demonstrate
// CMS-managed Media images on the storefront. Run from this app (sharp is a
// @grove/web dependency):
//
//   pnpm --filter @grove/web seed:images
//
// Re-run after editing CARDS, then commit the resulting .jpg files.

import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../packages/payload/seed-assets",
);

const CARDS = [
  { file: "sour-grapes.jpg", name: "Sour Grapes", meta: "Indica · live resin vape · 1g", from: "#5b2a6b", to: "#241033" },
  { file: "super-boof.jpg", name: "Super Boof", meta: "Hybrid · pre-roll 5pk · 0.5g", from: "#2d4a2b", to: "#11200f" },
];

const W = 1200;
const H = 1600;

const svg = ({ name, meta, from, to }) => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="${W * 0.78}" cy="${H * 0.22}" r="220" fill="#ffffff" opacity="0.06"/>
  <circle cx="${W * 0.2}" cy="${H * 0.8}" r="320" fill="#ffffff" opacity="0.05"/>
  <text x="80" y="150" fill="#f3ead9" opacity="0.85" font-family="Georgia, serif" font-size="40" letter-spacing="8">HIGHGROVE</text>
  <text x="80" y="${H - 220}" fill="#ffffff" font-family="Georgia, serif" font-size="96" font-weight="700">${name}</text>
  <text x="80" y="${H - 150}" fill="#f3ead9" opacity="0.8" font-family="Helvetica, Arial, sans-serif" font-size="40">${meta}</text>
</svg>`;

for (const card of CARDS) {
  await sharp(Buffer.from(svg(card)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, card.file));
  console.log("wrote", card.file);
}
