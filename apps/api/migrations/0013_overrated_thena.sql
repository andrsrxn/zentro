ALTER TABLE "notes" ALTER COLUMN "order" SET DATA TYPE numeric(100, 20);--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "order" SET DEFAULT 1000;