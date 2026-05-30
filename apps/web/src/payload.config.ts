import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type CollectionConfig } from "payload";
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
  Homepage,
  LabReports,
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

// --- Temporary MVP admin simplification (reversible) ---
// The platform defines ~24 collections, but the MVP storefront/admin only needs
// a handful. Rather than delete the others (their schemas, data, code, and tests
// stay intact for the longer-term platform), we just hide them from the admin
// nav by setting `admin.hidden: true`. To un-hide a collection, remove its slug
// from HIDDEN below. This keeps the change in one app file so the shared
// @grove/payload package and its 100%-coverage tests are untouched.
const HIDDEN = new Set([
  "customers",
  "site-memberships",
  "service-requests",
  "orders",
  "payments",
  "partners",
  "partner-locations",
  "inventory-levels",
  "fulfillments",
  "ledger-accounts",
  "ledger-entries",
  "settlements",
  "payout-batches",
  "payouts",
  "compliance-checks",
  "audit-logs",
]);

const withAdminHidden = (c: CollectionConfig): CollectionConfig =>
  HIDDEN.has(c.slug) ? { ...c, admin: { ...(c.admin ?? {}), hidden: true } } : c;

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  editor: lexicalEditor(),
  db: postgresAdapter({
    // Set PAYLOAD_DB_PUSH=true to let Payload create/sync the schema on boot
    // (handy for the first deploy). Leave unset to use committed migrations.
    push: process.env.PAYLOAD_DB_PUSH === "true" ? true : undefined,
    pool: {
      // Accept our own var or the names the Vercel/Neon integration injects.
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
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
    Homepage,
    LabReports,
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
  ].map(withAdminHidden),
  endpoints: [importProductsEndpoint],
  admin: {
    user: Users.slug,
    components: {
      // CSV product import widget, rendered on the admin dashboard (KRI-94).
      beforeDashboard: ["/components/ImportProducts#ImportProducts"],
    },
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
        homepage: { isGlobal: true },
        "lab-reports": {},
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
