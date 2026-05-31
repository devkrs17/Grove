import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the per-tenant lab-report (COA) vertical flag to brand_configs. The
// column defaults false so a generic tenant opts in rather than out; the
// existing regulated tenant (Blinkers) is backfilled to true so its storefront
// is unchanged. Scoped to the Blinkers tenant by slug so no other tenant is
// flipped on implicitly.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // IF NOT EXISTS so the migration is a no-op if the column was already created
  // by a dev-mode schema push (the platform has hit push/dev-mode issues on
  // deploy before — keep this idempotent).
  await db.execute(sql`
    ALTER TABLE "brand_configs" ADD COLUMN IF NOT EXISTS "show_lab_reports" boolean DEFAULT false;
    UPDATE "brand_configs" SET "show_lab_reports" = true
      WHERE "tenant_id" IN (SELECT "id" FROM "tenants" WHERE "slug" = 'blinkers');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "brand_configs" DROP COLUMN IF EXISTS "show_lab_reports";`)
}
