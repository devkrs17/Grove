import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    await payload.count({ collection: "users", overrideAccess: true });
    return Response.json({ status: "ok", db: "ok", uptime: process.uptime() });
  } catch {
    return Response.json(
      { status: "error", db: "unreachable", uptime: process.uptime() },
      { status: 503 }
    );
  }
}
