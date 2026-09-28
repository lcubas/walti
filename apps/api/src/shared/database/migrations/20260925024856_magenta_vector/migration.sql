ALTER TABLE `recurring_items` ADD `anchor_month` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recurring_items` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`frequency` text DEFAULT 'monthly' NOT NULL,
	`anchor_day` integer NOT NULL,
	`anchor_month` integer,
	`expected_amount_cents` integer NOT NULL,
	`paused_at` text,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_recurring_items_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `fk_recurring_items_category_id_space_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `space_categories`(`id`),
	CONSTRAINT "recurring_items_anchor_day_range" CHECK("anchor_day" BETWEEN 1 AND 31),
	CONSTRAINT "recurring_items_anchor_month_matches_frequency" CHECK(("frequency" = 'yearly') = ("anchor_month" IS NOT NULL)),
	CONSTRAINT "recurring_items_anchor_month_range" CHECK("anchor_month" IS NULL OR "anchor_month" BETWEEN 1 AND 12),
	CONSTRAINT "recurring_items_expected_positive" CHECK("expected_amount_cents" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_recurring_items`(`id`, `space_id`, `category_id`, `name`, `kind`, `frequency`, `anchor_day`, `expected_amount_cents`, `paused_at`, `archived_at`, `created_at`, `updated_at`) SELECT `id`, `space_id`, `category_id`, `name`, `kind`, `frequency`, `anchor_day`, `expected_amount_cents`, `paused_at`, `archived_at`, `created_at`, `updated_at` FROM `recurring_items`;--> statement-breakpoint
DROP TABLE `recurring_items`;--> statement-breakpoint
ALTER TABLE `__new_recurring_items` RENAME TO `recurring_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `recurring_items_space_idx` ON `recurring_items` (`space_id`);