import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Announce, Footer, Nav } from "@/storefront/components/Chrome";
import { getStorefrontPageBySlug } from "@/storefront/server";

// Renders a CMS-managed marketing page (About, Lab reports, Contact, …) for the
// resolved tenant's site. Explicit routes (/shop, /products, /cart) take
// precedence; any other single-segment path resolves to a published Page here.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getStorefrontPageBySlug(slug);
  return { title: page ? `${page.title} — Highgrove` : "Page not found" };
}

export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getStorefrontPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <Announce />
      <Nav />
      <div className="shell">
        <article style={{ maxWidth: "68ch", margin: "0 auto", padding: "56px 0 88px" }}>
          <h1 className="h2" style={{ marginBottom: 24 }}>
            {page.title}
          </h1>
          <div style={{ display: "grid", gap: 16, lineHeight: 1.7, color: "var(--ink-2)", fontSize: 16 }}>
            {page.content ? <RichText data={page.content} /> : null}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}
