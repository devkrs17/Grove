import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_memberships_role" AS ENUM('owner', 'manager', 'worker');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_service_requests_status" AS ENUM('pending', 'in-progress', 'completed', 'rejected');
  CREATE TYPE "public"."enum_service_requests_priority" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'confirmed', 'routed', 'fulfilling', 'delivered', 'completed', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('unpaid', 'authorized', 'paid', 'refunded', 'failed');
  CREATE TYPE "public"."enum_orders_fulfillment_status" AS ENUM('unfulfilled', 'assigned', 'in_transit', 'delivered', 'failed');
  CREATE TYPE "public"."enum_payments_method" AS ENUM('ach', 'rtp', 'card', 'pay_by_bank');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('requires_action', 'authorized', 'captured', 'failed', 'refunded');
  CREATE TYPE "public"."enum_partners_credentials_status" AS ENUM('pending', 'verified', 'expired', 'rejected');
  CREATE TYPE "public"."enum_partners_type" AS ENUM('supplier', 'fulfillment', 'hybrid');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('pending', 'active', 'suspended');
  CREATE TYPE "public"."enum_fulfillments_status" AS ENUM('assigned', 'accepted', 'picked_up', 'in_transit', 'delivered', 'failed');
  CREATE TYPE "public"."enum_ledger_accounts_type" AS ENUM('platform_fee', 'customer_funds', 'partner_payable', 'supplier_payable', 'refunds_payable');
  CREATE TYPE "public"."enum_ledger_accounts_owner_type" AS ENUM('platform', 'partner', 'supplier', 'customer');
  CREATE TYPE "public"."enum_ledger_entries_direction" AS ENUM('debit', 'credit');
  CREATE TYPE "public"."enum_ledger_entries_ref_type" AS ENUM('order', 'settlement', 'payout', 'refund', 'adjustment');
  CREATE TYPE "public"."enum_settlements_allocations_payee_type" AS ENUM('platform', 'supplier', 'partner');
  CREATE TYPE "public"."enum_settlements_status" AS ENUM('pending', 'allocated', 'posted', 'reconciled');
  CREATE TYPE "public"."enum_payout_batches_status" AS ENUM('pending', 'processing', 'paid', 'failed');
  CREATE TYPE "public"."enum_payouts_status" AS ENUM('pending', 'processing', 'paid', 'failed', 'reversed');
  CREATE TYPE "public"."enum_payouts_method" AS ENUM('ach', 'rtp', 'card', 'pay_by_bank');
  CREATE TYPE "public"."enum_compliance_checks_subject_type" AS ENUM('customer', 'partner', 'order');
  CREATE TYPE "public"."enum_compliance_checks_check_type" AS ENUM('identity_kyc', 'aml', 'eligibility', 'credential_verification');
  CREATE TYPE "public"."enum_compliance_checks_status" AS ENUM('pending', 'passed', 'failed', 'expired');
  CREATE TYPE "public"."enum_audit_logs_actor_type" AS ENUM('user', 'partner', 'system');
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"domain" varchar,
  	"auth0_org_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"status" "enum_products_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"domain" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_memberships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"user_id" integer NOT NULL,
  	"site_id" integer NOT NULL,
  	"role" "enum_site_memberships_role" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brand_configs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"site_id" integer NOT NULL,
  	"logo_id" integer,
  	"primary_color" varchar,
  	"secondary_color" varchar,
  	"typography" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar,
  	"slug" varchar,
  	"site_id" integer,
  	"content" jsonb,
  	"status" "enum_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"alt" varchar NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"email" varchar NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"site_id" integer,
  	"status" "enum_service_requests_status" DEFAULT 'pending',
  	"priority" "enum_service_requests_priority" DEFAULT 'medium',
  	"requested_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"line_total" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"order_number" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"site_id" integer NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"fees" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending',
  	"payment_status" "enum_orders_payment_status" DEFAULT 'unpaid',
  	"fulfillment_status" "enum_orders_fulfillment_status" DEFAULT 'unfulfilled',
  	"shipping_address_line1" varchar,
  	"shipping_address_line2" varchar,
  	"shipping_address_city" varchar,
  	"shipping_address_region" varchar,
  	"shipping_address_postal_code" varchar,
  	"shipping_address_country" varchar,
  	"placed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"order_id" integer NOT NULL,
  	"provider" varchar NOT NULL,
  	"provider_intent_ref" varchar,
  	"method" "enum_payments_method" DEFAULT 'card',
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'requires_action',
  	"captured_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" varchar,
  	"identifier" varchar,
  	"status" "enum_partners_credentials_status" DEFAULT 'pending',
  	"expires_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"type" "enum_partners_type" DEFAULT 'fulfillment',
  	"status" "enum_partners_status" DEFAULT 'pending',
  	"contact_email" varchar,
  	"payout_method_provider" varchar,
  	"payout_method_account_ref" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partner_locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"partner_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"address_city" varchar,
  	"address_region" varchar,
  	"address_postal_code" varchar,
  	"address_country" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"service_radius_km" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inventory_levels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"product_id" integer NOT NULL,
  	"partner_location_id" integer NOT NULL,
  	"quantity_available" numeric DEFAULT 0,
  	"quantity_reserved" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "fulfillments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"order_id" integer NOT NULL,
  	"partner_id" integer NOT NULL,
  	"partner_location_id" integer,
  	"status" "enum_fulfillments_status" DEFAULT 'assigned',
  	"assigned_at" timestamp(3) with time zone,
  	"delivered_at" timestamp(3) with time zone,
  	"tracking_ref" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ledger_accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"type" "enum_ledger_accounts_type" NOT NULL,
  	"owner_type" "enum_ledger_accounts_owner_type" DEFAULT 'platform',
  	"owner_ref" varchar,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ledger_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"transaction_id" varchar NOT NULL,
  	"account_id" integer NOT NULL,
  	"direction" "enum_ledger_entries_direction" NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"ref_type" "enum_ledger_entries_ref_type",
  	"ref_id" varchar,
  	"posted_at" timestamp(3) with time zone,
  	"memo" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "settlements_allocations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"payee_type" "enum_settlements_allocations_payee_type",
  	"payee_ref" varchar,
  	"amount" numeric,
  	"basis" varchar
  );
  
  CREATE TABLE "settlements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"order_id" integer NOT NULL,
  	"status" "enum_settlements_status" DEFAULT 'pending',
  	"computed_at" timestamp(3) with time zone,
  	"posted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payout_batches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"scheduled_for" timestamp(3) with time zone,
  	"status" "enum_payout_batches_status" DEFAULT 'pending',
  	"provider" varchar,
  	"total_amount" numeric DEFAULT 0,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payouts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"batch_id" integer NOT NULL,
  	"payee_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"status" "enum_payouts_status" DEFAULT 'pending',
  	"provider_ref" varchar,
  	"method" "enum_payouts_method" DEFAULT 'ach',
  	"settled_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "compliance_checks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"subject_type" "enum_compliance_checks_subject_type" NOT NULL,
  	"subject_ref" varchar,
  	"check_type" "enum_compliance_checks_check_type" NOT NULL,
  	"status" "enum_compliance_checks_status" DEFAULT 'pending',
  	"provider" varchar,
  	"result" jsonb,
  	"checked_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"actor_type" "enum_audit_logs_actor_type" DEFAULT 'system',
  	"actor_ref" varchar,
  	"action" varchar NOT NULL,
  	"entity_type" varchar,
  	"entity_id" varchar,
  	"ip_address" varchar,
  	"device_id" varchar,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"tenants_id" integer,
  	"products_id" integer,
  	"sites_id" integer,
  	"site_memberships_id" integer,
  	"brand_configs_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"customers_id" integer,
  	"service_requests_id" integer,
  	"orders_id" integer,
  	"payments_id" integer,
  	"partners_id" integer,
  	"partner_locations_id" integer,
  	"inventory_levels_id" integer,
  	"fulfillments_id" integer,
  	"ledger_accounts_id" integer,
  	"ledger_entries_id" integer,
  	"settlements_id" integer,
  	"payout_batches_id" integer,
  	"payouts_id" integer,
  	"compliance_checks_id" integer,
  	"audit_logs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_memberships" ADD CONSTRAINT "site_memberships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_memberships" ADD CONSTRAINT "site_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_memberships" ADD CONSTRAINT "site_memberships_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand_configs" ADD CONSTRAINT "brand_configs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand_configs" ADD CONSTRAINT "brand_configs_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand_configs" ADD CONSTRAINT "brand_configs_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_credentials" ADD CONSTRAINT "partners_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_partner_location_id_partner_locations_id_fk" FOREIGN KEY ("partner_location_id") REFERENCES "public"."partner_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_partner_location_id_partner_locations_id_fk" FOREIGN KEY ("partner_location_id") REFERENCES "public"."partner_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_account_id_ledger_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."ledger_accounts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settlements_allocations" ADD CONSTRAINT "settlements_allocations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settlements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settlements" ADD CONSTRAINT "settlements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settlements" ADD CONSTRAINT "settlements_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payout_batches" ADD CONSTRAINT "payout_batches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payouts" ADD CONSTRAINT "payouts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payouts" ADD CONSTRAINT "payouts_batch_id_payout_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."payout_batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payouts" ADD CONSTRAINT "payouts_payee_id_partners_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "compliance_checks" ADD CONSTRAINT "compliance_checks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_memberships_fk" FOREIGN KEY ("site_memberships_id") REFERENCES "public"."site_memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_configs_fk" FOREIGN KEY ("brand_configs_id") REFERENCES "public"."brand_configs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_requests_fk" FOREIGN KEY ("service_requests_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partner_locations_fk" FOREIGN KEY ("partner_locations_id") REFERENCES "public"."partner_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inventory_levels_fk" FOREIGN KEY ("inventory_levels_id") REFERENCES "public"."inventory_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fulfillments_fk" FOREIGN KEY ("fulfillments_id") REFERENCES "public"."fulfillments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ledger_accounts_fk" FOREIGN KEY ("ledger_accounts_id") REFERENCES "public"."ledger_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ledger_entries_fk" FOREIGN KEY ("ledger_entries_id") REFERENCES "public"."ledger_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_settlements_fk" FOREIGN KEY ("settlements_id") REFERENCES "public"."settlements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payout_batches_fk" FOREIGN KEY ("payout_batches_id") REFERENCES "public"."payout_batches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payouts_fk" FOREIGN KEY ("payouts_id") REFERENCES "public"."payouts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_compliance_checks_fk" FOREIGN KEY ("compliance_checks_id") REFERENCES "public"."compliance_checks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "products_tenant_idx" ON "products" USING btree ("tenant_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "sites_tenant_idx" ON "sites" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "sites_slug_idx" ON "sites" USING btree ("slug");
  CREATE INDEX "sites_updated_at_idx" ON "sites" USING btree ("updated_at");
  CREATE INDEX "sites_created_at_idx" ON "sites" USING btree ("created_at");
  CREATE INDEX "site_memberships_tenant_idx" ON "site_memberships" USING btree ("tenant_id");
  CREATE INDEX "site_memberships_user_idx" ON "site_memberships" USING btree ("user_id");
  CREATE INDEX "site_memberships_site_idx" ON "site_memberships" USING btree ("site_id");
  CREATE INDEX "site_memberships_updated_at_idx" ON "site_memberships" USING btree ("updated_at");
  CREATE INDEX "site_memberships_created_at_idx" ON "site_memberships" USING btree ("created_at");
  CREATE UNIQUE INDEX "brand_configs_tenant_idx" ON "brand_configs" USING btree ("tenant_id");
  CREATE INDEX "brand_configs_site_idx" ON "brand_configs" USING btree ("site_id");
  CREATE INDEX "brand_configs_logo_idx" ON "brand_configs" USING btree ("logo_id");
  CREATE INDEX "brand_configs_updated_at_idx" ON "brand_configs" USING btree ("updated_at");
  CREATE INDEX "brand_configs_created_at_idx" ON "brand_configs" USING btree ("created_at");
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "pages_site_idx" ON "pages" USING btree ("site_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_tenant_idx" ON "_pages_v" USING btree ("version_tenant_id");
  CREATE INDEX "_pages_v_version_version_site_idx" ON "_pages_v" USING btree ("version_site_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "media_site_idx" ON "media" USING btree ("site_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "customers_tenant_idx" ON "customers" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "customers_site_idx" ON "customers" USING btree ("site_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE INDEX "service_requests_tenant_idx" ON "service_requests" USING btree ("tenant_id");
  CREATE INDEX "service_requests_site_idx" ON "service_requests" USING btree ("site_id");
  CREATE INDEX "service_requests_requested_by_idx" ON "service_requests" USING btree ("requested_by_id");
  CREATE INDEX "service_requests_updated_at_idx" ON "service_requests" USING btree ("updated_at");
  CREATE INDEX "service_requests_created_at_idx" ON "service_requests" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_tenant_idx" ON "orders" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_site_idx" ON "orders" USING btree ("site_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "payments_tenant_idx" ON "payments" USING btree ("tenant_id");
  CREATE INDEX "payments_order_idx" ON "payments" USING btree ("order_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "partners_credentials_order_idx" ON "partners_credentials" USING btree ("_order");
  CREATE INDEX "partners_credentials_parent_id_idx" ON "partners_credentials" USING btree ("_parent_id");
  CREATE INDEX "partners_tenant_idx" ON "partners" USING btree ("tenant_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partner_locations_tenant_idx" ON "partner_locations" USING btree ("tenant_id");
  CREATE INDEX "partner_locations_partner_idx" ON "partner_locations" USING btree ("partner_id");
  CREATE INDEX "partner_locations_updated_at_idx" ON "partner_locations" USING btree ("updated_at");
  CREATE INDEX "partner_locations_created_at_idx" ON "partner_locations" USING btree ("created_at");
  CREATE INDEX "inventory_levels_tenant_idx" ON "inventory_levels" USING btree ("tenant_id");
  CREATE INDEX "inventory_levels_product_idx" ON "inventory_levels" USING btree ("product_id");
  CREATE INDEX "inventory_levels_partner_location_idx" ON "inventory_levels" USING btree ("partner_location_id");
  CREATE INDEX "inventory_levels_updated_at_idx" ON "inventory_levels" USING btree ("updated_at");
  CREATE INDEX "inventory_levels_created_at_idx" ON "inventory_levels" USING btree ("created_at");
  CREATE INDEX "fulfillments_tenant_idx" ON "fulfillments" USING btree ("tenant_id");
  CREATE INDEX "fulfillments_order_idx" ON "fulfillments" USING btree ("order_id");
  CREATE INDEX "fulfillments_partner_idx" ON "fulfillments" USING btree ("partner_id");
  CREATE INDEX "fulfillments_partner_location_idx" ON "fulfillments" USING btree ("partner_location_id");
  CREATE INDEX "fulfillments_updated_at_idx" ON "fulfillments" USING btree ("updated_at");
  CREATE INDEX "fulfillments_created_at_idx" ON "fulfillments" USING btree ("created_at");
  CREATE INDEX "ledger_accounts_tenant_idx" ON "ledger_accounts" USING btree ("tenant_id");
  CREATE INDEX "ledger_accounts_updated_at_idx" ON "ledger_accounts" USING btree ("updated_at");
  CREATE INDEX "ledger_accounts_created_at_idx" ON "ledger_accounts" USING btree ("created_at");
  CREATE INDEX "ledger_entries_tenant_idx" ON "ledger_entries" USING btree ("tenant_id");
  CREATE INDEX "ledger_entries_account_idx" ON "ledger_entries" USING btree ("account_id");
  CREATE INDEX "ledger_entries_updated_at_idx" ON "ledger_entries" USING btree ("updated_at");
  CREATE INDEX "ledger_entries_created_at_idx" ON "ledger_entries" USING btree ("created_at");
  CREATE INDEX "settlements_allocations_order_idx" ON "settlements_allocations" USING btree ("_order");
  CREATE INDEX "settlements_allocations_parent_id_idx" ON "settlements_allocations" USING btree ("_parent_id");
  CREATE INDEX "settlements_tenant_idx" ON "settlements" USING btree ("tenant_id");
  CREATE INDEX "settlements_order_idx" ON "settlements" USING btree ("order_id");
  CREATE INDEX "settlements_updated_at_idx" ON "settlements" USING btree ("updated_at");
  CREATE INDEX "settlements_created_at_idx" ON "settlements" USING btree ("created_at");
  CREATE INDEX "payout_batches_tenant_idx" ON "payout_batches" USING btree ("tenant_id");
  CREATE INDEX "payout_batches_updated_at_idx" ON "payout_batches" USING btree ("updated_at");
  CREATE INDEX "payout_batches_created_at_idx" ON "payout_batches" USING btree ("created_at");
  CREATE INDEX "payouts_tenant_idx" ON "payouts" USING btree ("tenant_id");
  CREATE INDEX "payouts_batch_idx" ON "payouts" USING btree ("batch_id");
  CREATE INDEX "payouts_payee_idx" ON "payouts" USING btree ("payee_id");
  CREATE INDEX "payouts_updated_at_idx" ON "payouts" USING btree ("updated_at");
  CREATE INDEX "payouts_created_at_idx" ON "payouts" USING btree ("created_at");
  CREATE INDEX "compliance_checks_tenant_idx" ON "compliance_checks" USING btree ("tenant_id");
  CREATE INDEX "compliance_checks_updated_at_idx" ON "compliance_checks" USING btree ("updated_at");
  CREATE INDEX "compliance_checks_created_at_idx" ON "compliance_checks" USING btree ("created_at");
  CREATE INDEX "audit_logs_tenant_idx" ON "audit_logs" USING btree ("tenant_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_sites_id_idx" ON "payload_locked_documents_rels" USING btree ("sites_id");
  CREATE INDEX "payload_locked_documents_rels_site_memberships_id_idx" ON "payload_locked_documents_rels" USING btree ("site_memberships_id");
  CREATE INDEX "payload_locked_documents_rels_brand_configs_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_configs_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_service_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("service_requests_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_partner_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("partner_locations_id");
  CREATE INDEX "payload_locked_documents_rels_inventory_levels_id_idx" ON "payload_locked_documents_rels" USING btree ("inventory_levels_id");
  CREATE INDEX "payload_locked_documents_rels_fulfillments_id_idx" ON "payload_locked_documents_rels" USING btree ("fulfillments_id");
  CREATE INDEX "payload_locked_documents_rels_ledger_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("ledger_accounts_id");
  CREATE INDEX "payload_locked_documents_rels_ledger_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("ledger_entries_id");
  CREATE INDEX "payload_locked_documents_rels_settlements_id_idx" ON "payload_locked_documents_rels" USING btree ("settlements_id");
  CREATE INDEX "payload_locked_documents_rels_payout_batches_id_idx" ON "payload_locked_documents_rels" USING btree ("payout_batches_id");
  CREATE INDEX "payload_locked_documents_rels_payouts_id_idx" ON "payload_locked_documents_rels" USING btree ("payouts_id");
  CREATE INDEX "payload_locked_documents_rels_compliance_checks_id_idx" ON "payload_locked_documents_rels" USING btree ("compliance_checks_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "sites" CASCADE;
  DROP TABLE "site_memberships" CASCADE;
  DROP TABLE "brand_configs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "service_requests" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "partners_credentials" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partner_locations" CASCADE;
  DROP TABLE "inventory_levels" CASCADE;
  DROP TABLE "fulfillments" CASCADE;
  DROP TABLE "ledger_accounts" CASCADE;
  DROP TABLE "ledger_entries" CASCADE;
  DROP TABLE "settlements_allocations" CASCADE;
  DROP TABLE "settlements" CASCADE;
  DROP TABLE "payout_batches" CASCADE;
  DROP TABLE "payouts" CASCADE;
  DROP TABLE "compliance_checks" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_site_memberships_role";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_service_requests_status";
  DROP TYPE "public"."enum_service_requests_priority";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_fulfillment_status";
  DROP TYPE "public"."enum_payments_method";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_partners_credentials_status";
  DROP TYPE "public"."enum_partners_type";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum_fulfillments_status";
  DROP TYPE "public"."enum_ledger_accounts_type";
  DROP TYPE "public"."enum_ledger_accounts_owner_type";
  DROP TYPE "public"."enum_ledger_entries_direction";
  DROP TYPE "public"."enum_ledger_entries_ref_type";
  DROP TYPE "public"."enum_settlements_allocations_payee_type";
  DROP TYPE "public"."enum_settlements_status";
  DROP TYPE "public"."enum_payout_batches_status";
  DROP TYPE "public"."enum_payouts_status";
  DROP TYPE "public"."enum_payouts_method";
  DROP TYPE "public"."enum_compliance_checks_subject_type";
  DROP TYPE "public"."enum_compliance_checks_check_type";
  DROP TYPE "public"."enum_compliance_checks_status";
  DROP TYPE "public"."enum_audit_logs_actor_type";`)
}
