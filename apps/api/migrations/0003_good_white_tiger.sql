CREATE TABLE "notes" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"content" text NOT NULL,
	"color" varchar(7) NOT NULL,
	"position_x" integer,
	"position_y" integer,
	"user_id" text NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TYPE "public"."auth_provider";--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('google', 'github');--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;