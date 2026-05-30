import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Strip the parenthesized wrappers left by the original CSV import from
  // product names (e.g. "Blinkers Flip ( Gelato Pie & Pineapple Haze )" ->
  // "Blinkers Flip Gelato Pie & Pineapple Haze"). Removes the " ( " before the
  // contents and the " )" after, then trims. Idempotent: only rows still
  // containing "( " are touched, so re-running is a no-op.
  await db.execute(sql`
    UPDATE "products" SET "name" = btrim(replace(replace("name", ' ( ', ' '), ' )', '')) WHERE "name" LIKE '%( %';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op: the original parenthesized names are not reconstructable and the
  // cleanup is purely cosmetic.
}
