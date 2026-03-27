import { NextRequest, NextResponse } from "next/server";

interface TenantData {
  site: { id: number; name: string; slug: string };
  tenant: { id: number; name: string; slug: string };
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host) {
    return NextResponse.next();
  }

  const hostname = host.split(":")[0];
  const cmsUrl = process.env.CMS_URL ?? "http://localhost:3002";

  try {
    const response = await fetch(
      `${cmsUrl}/api/resolve-tenant?domain=${encodeURIComponent(hostname)}`
    );

    if (!response.ok) {
      return NextResponse.next();
    }

    const data: TenantData = await response.json();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-grove-tenant-id", String(data.tenant.id));
    requestHeaders.set("x-grove-site-id", String(data.site.id));
    requestHeaders.set("x-grove-tenant-slug", data.tenant.slug);
    requestHeaders.set("x-grove-site-slug", data.site.slug);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/).*)"],
};
