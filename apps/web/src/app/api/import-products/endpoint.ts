import { addDataAndFileToRequest } from "payload";
import type { Endpoint, PayloadRequest } from "payload";
import type { Product, User } from "@grove/types";

/**
 * Parses a CSV string into an array of row objects.
 * Handles simple comma-separated values; strips whitespace from headers/values.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0]!.split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i]!.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = cells[idx] ?? "";
    });
    rows.push(row);
  }

  return rows;
}

/** Converts a product name into a URL-safe slug (lowercase, hyphenated). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Optional product columns mapped 1:1 from CSV header → Payload field.
 * Empty cells are skipped so selects aren't sent invalid empty values.
 */
const OPTIONAL_FIELDS = [
  "subtitle",
  "description",
  "category",
  "strainType",
  "effect",
  "thcLabel",
  "lot",
  "tag",
  "imageId",
  "terpenes",
] as const;

/** Collects the optional product fields that are present (non-empty) in a row. */
function optionalFields(row: Record<string, string>): Partial<Product> {
  const out: Record<string, string> = {};
  for (const field of OPTIONAL_FIELDS) {
    const value = row[field]?.trim();
    if (value) {
      out[field] = value;
    }
  }
  // CSV cells are free-form text; Payload validates select options at write time.
  return out as Partial<Product>;
}

export const importProductsEndpoint: Endpoint = {
  path: "/import-products",
  method: "post",
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await addDataAndFileToRequest(req);

    if (!req.file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const user = req.user as User;
    const tenantEntry = user.tenants?.[0];
    const tenantId =
      tenantEntry &&
      (typeof tenantEntry.tenant === "object"
        ? tenantEntry.tenant.id
        : tenantEntry.tenant);

    if (!tenantId) {
      return Response.json({ error: "User has no tenant" }, { status: 400 });
    }

    const csvText = Buffer.from(req.file.data).toString("utf-8");
    const rows = parseCsv(csvText);

    let created = 0;
    const errors: { row: number; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const rowNum = i + 2; // 1-based line number (row 1 = header)

      const name = row["name"]?.trim();
      const priceRaw = row["price"]?.trim();
      const statusRaw = row["status"]?.trim().toLowerCase();

      if (!name) {
        errors.push({ row: rowNum, reason: "Missing name" });
        continue;
      }

      const price = Number(priceRaw);
      if (!priceRaw || isNaN(price) || price < 0) {
        errors.push({ row: rowNum, reason: "Invalid price" });
        continue;
      }

      const status =
        statusRaw === "published" || statusRaw === "draft"
          ? statusRaw
          : "draft";

      await req.payload.create({
        collection: "products",
        data: {
          name,
          price,
          status,
          tenant: tenantId,
          slug: row["slug"]?.trim() || slugify(name),
          ...optionalFields(row),
        },
        user: req.user,
        overrideAccess: false,
        req,
      });

      created++;
    }

    return Response.json({ created, errors });
  },
};
