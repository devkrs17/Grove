import { notFound } from "next/navigation";
import "@/storefront/kit/kit.css";
import "@/storefront/kit/pdp.css";
import { StorefrontPdp } from "@/storefront/kit/StorefrontPdp";
import { StorefrontRoot } from "@/storefront/StorefrontRoot";
import {
  getShowLabReports,
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "@/storefront/server";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) notFound();

  const [all, showLabReports] = await Promise.all([
    getStorefrontProducts(),
    getShowLabReports(),
  ]);
  const related = all
    .filter((p) => (p.slug ?? p.id) !== slug && p.category === product.category)
    .slice(0, 4);

  return (
    <StorefrontRoot>
      <StorefrontPdp product={product} related={related} showLabReports={showLabReports} />
    </StorefrontRoot>
  );
}
