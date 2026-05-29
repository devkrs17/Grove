import { getPayload } from "payload";
import type { Where } from "payload";
import config from "@payload-config";
import { getTenantContext } from "@/lib/tenant";

export default async function Home() {
  const payload = await getPayload({ config });
  const { tenantId, tenantSlug } = await getTenantContext();

  const where: Where = tenantId
    ? { and: [{ status: { equals: "published" } }, { tenant: { equals: Number(tenantId) } }] }
    : { status: { equals: "published" } };

  const { docs: products } = await payload.find({
    collection: "products",
    where,
    overrideAccess: true,
    depth: 1,
  });

  const siteName = tenantSlug
    ? products[0] && typeof products[0].tenant === "object" && products[0].tenant !== null
      ? products[0].tenant.name
      : tenantSlug
    : "Grove";

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>{siteName}</h1>
        {!tenantId && (
          <p className="text-sm text-gray-400 mt-1">
            Showing all tenants — visit via a tenant domain to scope results
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-5 flex flex-col gap-2 hover:border-gray-400 transition-colors">
            {!tenantId && typeof product.tenant === "object" && product.tenant !== null && (
              <span className="text-xs uppercase tracking-wide text-gray-400">
                {product.tenant.name}
              </span>
            )}
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-2xl font-bold mt-auto">${product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-400">No published products found.</p>
      )}
    </main>
  );
}
