import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import {
  Tenants,
  Users,
  Products,
  Sites,
  SiteMemberships,
  BrandConfigs,
  Pages,
  Media,
  Customers,
  ServiceRequests,
  Orders,
  Payments,
  Partners,
  PartnerLocations,
  InventoryLevels,
  Fulfillments,
  LedgerAccounts,
  LedgerEntries,
  Settlements,
  PayoutBatches,
  Payouts,
  ComplianceChecks,
  AuditLogs,
  seed,
} from "@grove/payload";
import { importProductsEndpoint } from "./app/api/import-products/endpoint";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  editor: lexicalEditor(),
  db: postgresAdapter({
    // Set PAYLOAD_DB_PUSH=true to let Payload create/sync the schema on boot
    // (handy for the first deploy). Leave unset to use committed migrations.
    push: process.env.PAYLOAD_DB_PUSH === "true" ? true : undefined,
    pool: {
      // Accept our own var or the names the Vercel/Neon integration injects.
      connectionString:
        process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    },
  }),
  collections: [
    Users,
    Tenants,
    Products,
    Sites,
    SiteMemberships,
    BrandConfigs,
    Pages,
    Media,
    Customers,
    ServiceRequests,
    Orders,
    Payments,
    Partners,
    PartnerLocations,
    InventoryLevels,
    Fulfillments,
    LedgerAccounts,
    LedgerEntries,
    Settlements,
    PayoutBatches,
    Payouts,
    ComplianceChecks,
    AuditLogs,
  ],
  endpoints: [importProductsEndpoint],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  plugins: [
    multiTenantPlugin({
      collections: {
        products: {},
        sites: {},
        "site-memberships": {},
        "brand-configs": { isGlobal: true },
        pages: {},
        media: {},
        customers: {},
        "service-requests": {},
        orders: {},
        payments: {},
        partners: {},
        "partner-locations": {},
        "inventory-levels": {},
        fulfillments: {},
        "ledger-accounts": {},
        "ledger-entries": {},
        settlements: {},
        "payout-batches": {},
        payouts: {},
        "compliance-checks": {},
        "audit-logs": {},
      },
      tenantsSlug: "tenants",
      userHasAccessToAllTenants: (user) =>
        Boolean(user?.email === process.env.SUPER_ADMIN_EMAIL),
      debug: process.env.NODE_ENV !== "production",
    }),
    // Cloud media storage for serverless hosts (Vercel's filesystem is ephemeral).
    // Enabled only when a blob token is present; local dev keeps using disk.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    const existingUsers = await payload.find({
      collection: "users",
      limit: 1,
    });
    if (existingUsers.totalDocs === 0) {
      await seed(payload);
    }
  },
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "../../../packages/types/src/payload-types.ts"),
  },
});
