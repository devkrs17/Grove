import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
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
  seed,
} from "@grove/payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
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
  ],
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
      },
      tenantsSlug: "tenants",
      userHasAccessToAllTenants: (user) =>
        Boolean(user?.email === process.env.SUPER_ADMIN_EMAIL),
      debug: process.env.NODE_ENV !== "production",
    }),
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
