CREATE SEQUENCE "public"."note_order_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1000 CACHE 1;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "order" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "order" SET DEFAULT nextval('note_order_seq');