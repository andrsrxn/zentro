ALTER TABLE "notes" ALTER COLUMN "order" SET DEFAULT 1000;--> statement-breakpoint
CREATE INDEX "notes_order_idx" ON "notes" USING btree ("order" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_order_unique" UNIQUE("order");--> statement-breakpoint
DROP SEQUENCE "public"."note_order_seq";