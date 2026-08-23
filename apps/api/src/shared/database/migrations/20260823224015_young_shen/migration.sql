ALTER TABLE `spaces` ADD `currency` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_settings` ADD `currency` text DEFAULT 'PEN' NOT NULL;