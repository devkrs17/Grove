import { notFound } from "next/navigation";
import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { Pdp } from "@/storefront/components/Pdp";
import { getStorefrontProductBySlug, getStorefrontProducts } from "@/storefront/server";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) notFound();
  const all = await getStorefrontProducts();
  const related = all.filter((p) => (p.slug ?? p.id) !== slug && p.category === product.category).slice(0, 4);
  return (
    <>
      <Announce />
      <Nav />
      <Pdp product={product} related={related} />
      <Footer />
    </>
  );
}
