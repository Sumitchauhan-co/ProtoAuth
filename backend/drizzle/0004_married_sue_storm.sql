ALTER TABLE "auth_codes" ADD COLUMN "scope" text DEFAULT 'openid' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_codes" ADD COLUMN "nonce" varchar(255);--> statement-breakpoint
ALTER TABLE "auth_codes" ADD COLUMN "code_challenge" text;--> statement-breakpoint
ALTER TABLE "auth_codes" ADD COLUMN "code_challenge_method" varchar(50) DEFAULT 'plain';