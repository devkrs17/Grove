import { notFound } from "next/navigation";
import "@/storefront/blinkers/blinkers.css";
import "@/storefront/blinkers/pdp.css";
import { BlinkersPdp } from "@/storefront/blinkers/BlinkersPdp";
import { getStorefrontProductBySlug, getStorefrontProducts } from "@/storefront/server";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) notFound();

  const all = await getStorefrontProducts();
  const related = all
    .filter((p) => (p.slug ?? p.id) !== slug && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="blinkers">
      <BlinkersPdp product={product} related={related} />
    </div>
  );
}
