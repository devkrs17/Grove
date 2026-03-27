import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return Response.json({ error: "missing_domain" }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "sites",
      where: { domain: { equals: domain } },
      overrideAccess: true,
      limit: 1,
      depth: 1,
    });

    if (result.docs.length === 0) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    const site = result.docs[0];
    const tenant =
      typeof site.tenant === "object" && site.tenant !== null
        ? (site.tenant as { id: number; name: string; slug: string })
        : null;

    if (!tenant) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    return Response.json({
      site: { id: site.id, name: site.name, slug: site.slug },
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
    });
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
