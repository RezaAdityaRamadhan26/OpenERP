CREATE TABLE IF NOT EXISTS "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cost_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_migrations_check" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branches" ADD CONSTRAINT "branches_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departments" ADD CONSTRAINT "departments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "branches_company_code_unique_idx" ON "branches" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "branches_company_id_idx" ON "branches" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "branches_is_active_idx" ON "branches" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companies_code_unique_idx" ON "companies" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "companies_is_active_idx" ON "companies" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cost_centers_company_code_unique_idx" ON "cost_centers" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cost_centers_company_id_idx" ON "cost_centers" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cost_centers_is_active_idx" ON "cost_centers" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "departments_company_code_unique_idx" ON "departments" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "departments_company_id_idx" ON "departments" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "departments_is_active_idx" ON "departments" USING btree ("is_active");