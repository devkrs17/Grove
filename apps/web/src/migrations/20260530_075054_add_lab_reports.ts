import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lab_reports_status" AS ENUM('pass', 'fail', 'pending');
  CREATE TABLE "lab_reports_cannabinoids" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "lab_reports_safety_screens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"result" varchar
  );
  
  CREATE TABLE "lab_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"product_id" integer NOT NULL,
  	"batch_lot" varchar NOT NULL,
  	"potency" varchar,
  	"tested_date" timestamp(3) with time zone,
  	"lab" varchar,
  	"status" "enum_lab_reports_status" DEFAULT 'pass',
  	"terpenes" varchar,
  	"report_file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lab_reports_id" integer;
  ALTER TABLE "lab_reports_cannabinoids" ADD CONSTRAINT "lab_reports_cannabinoids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lab_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_reports_safety_screens" ADD CONSTRAINT "lab_reports_safety_screens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lab_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_report_file_id_media_id_fk" FOREIGN KEY ("report_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lab_reports_cannabinoids_order_idx" ON "lab_reports_cannabinoids" USING btree ("_order");
  CREATE INDEX "lab_reports_cannabinoids_parent_id_idx" ON "lab_reports_cannabinoids" USING btree ("_parent_id");
  CREATE INDEX "lab_reports_safety_screens_order_idx" ON "lab_reports_safety_screens" USING btree ("_order");
  CREATE INDEX "lab_reports_safety_screens_parent_id_idx" ON "lab_reports_safety_screens" USING btree ("_parent_id");
  CREATE INDEX "lab_reports_tenant_idx" ON "lab_reports" USING btree ("tenant_id");
  CREATE INDEX "lab_reports_product_idx" ON "lab_reports" USING btree ("product_id");
  CREATE INDEX "lab_reports_report_file_idx" ON "lab_reports" USING btree ("report_file_id");
  CREATE INDEX "lab_reports_updated_at_idx" ON "lab_reports" USING btree ("updated_at");
  CREATE INDEX "lab_reports_created_at_idx" ON "lab_reports" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lab_reports_fk" FOREIGN KEY ("lab_reports_id") REFERENCES "public"."lab_reports"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_lab_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("lab_reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lab_reports_cannabinoids" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lab_reports_safety_screens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lab_reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lab_reports_cannabinoids" CASCADE;
  DROP TABLE "lab_reports_safety_screens" CASCADE;
  DROP TABLE "lab_reports" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lab_reports_fk";
  
  DROP INDEX "payload_locked_documents_rels_lab_reports_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lab_reports_id";
  DROP TYPE "public"."enum_lab_reports_status";`)
}
