ALTER TYPE "public"."auth_provider" ADD VALUE 'anonymous';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_anonymous" boolean;