CREATE TABLE `space_categories` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`intent` text,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_space_categories_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `space_categories_group_fk` FOREIGN KEY (`group_id`,`space_id`) REFERENCES `space_category_groups`(`id`,`space_id`)
);
--> statement-breakpoint
CREATE TABLE `user_category_groups` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_user_category_groups_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_space_category_mappings` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`space_category_id` text NOT NULL,
	`user_category_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_user_space_category_mappings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_user_space_category_mappings_space_category_id_space_categories_id_fk` FOREIGN KEY (`space_category_id`) REFERENCES `space_categories`(`id`),
	CONSTRAINT `fk_user_space_category_mappings_user_category_id_user_categories_id_fk` FOREIGN KEY (`user_category_id`) REFERENCES `user_categories`(`id`)
);
--> statement-breakpoint
ALTER TABLE `categories` RENAME TO `space_category_groups`;--> statement-breakpoint
ALTER TABLE `category_groups` RENAME TO `user_categories`;--> statement-breakpoint
ALTER TABLE `user_categories` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `user_categories` ADD `group_id` text NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`category_id` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`occurred_on` text NOT NULL,
	`event_id` text,
	`payment_source_id` text,
	`merchant` text,
	`note` text,
	`created_by_user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_expenses_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `fk_expenses_category_id_space_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `space_categories`(`id`),
	CONSTRAINT `fk_expenses_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`),
	CONSTRAINT `fk_expenses_payment_source_id_payment_sources_id_fk` FOREIGN KEY (`payment_source_id`) REFERENCES `payment_sources`(`id`),
	CONSTRAINT `fk_expenses_created_by_user_id_users_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`),
	CONSTRAINT "expenses_occurred_on_format" CHECK("occurred_on" GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
	CONSTRAINT "expenses_amount_positive" CHECK("amount_cents" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_expenses`(`id`, `space_id`, `category_id`, `amount_cents`, `occurred_on`, `event_id`, `payment_source_id`, `merchant`, `note`, `created_by_user_id`, `created_at`, `updated_at`) SELECT `id`, `space_id`, `category_id`, `amount_cents`, `occurred_on`, `event_id`, `payment_source_id`, `merchant`, `note`, `created_by_user_id`, `created_at`, `updated_at` FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_monthly_plan_allocations` (
	`id` text PRIMARY KEY,
	`monthly_plan_id` text NOT NULL,
	`group_id` text,
	`category_id` text,
	`amount_cents` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_monthly_plan_allocations_monthly_plan_id_monthly_plans_id_fk` FOREIGN KEY (`monthly_plan_id`) REFERENCES `monthly_plans`(`id`),
	CONSTRAINT `fk_monthly_plan_allocations_group_id_space_category_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `space_category_groups`(`id`),
	CONSTRAINT `fk_monthly_plan_allocations_category_id_space_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `space_categories`(`id`),
	CONSTRAINT "monthly_plan_allocations_amount_positive" CHECK("amount_cents" > 0),
	CONSTRAINT "monthly_plan_allocations_group_xor_category" CHECK(("group_id" IS NOT NULL) <> ("category_id" IS NOT NULL))
);
--> statement-breakpoint
INSERT INTO `__new_monthly_plan_allocations`(`id`, `monthly_plan_id`, `group_id`, `category_id`, `amount_cents`, `created_at`, `updated_at`) SELECT `id`, `monthly_plan_id`, `group_id`, `category_id`, `amount_cents`, `created_at`, `updated_at` FROM `monthly_plan_allocations`;--> statement-breakpoint
DROP TABLE `monthly_plan_allocations`;--> statement-breakpoint
ALTER TABLE `__new_monthly_plan_allocations` RENAME TO `monthly_plan_allocations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recurring_items` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`frequency` text DEFAULT 'monthly' NOT NULL,
	`anchor_day` integer NOT NULL,
	`expected_amount_cents` integer NOT NULL,
	`paused_at` text,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_recurring_items_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `fk_recurring_items_category_id_space_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `space_categories`(`id`),
	CONSTRAINT "recurring_items_anchor_day_range" CHECK("anchor_day" BETWEEN 1 AND 31),
	CONSTRAINT "recurring_items_expected_positive" CHECK("expected_amount_cents" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_recurring_items`(`id`, `space_id`, `category_id`, `name`, `kind`, `frequency`, `anchor_day`, `expected_amount_cents`, `paused_at`, `archived_at`, `created_at`, `updated_at`) SELECT `id`, `space_id`, `category_id`, `name`, `kind`, `frequency`, `anchor_day`, `expected_amount_cents`, `paused_at`, `archived_at`, `created_at`, `updated_at` FROM `recurring_items`;--> statement-breakpoint
DROP TABLE `recurring_items`;--> statement-breakpoint
ALTER TABLE `__new_recurring_items` RENAME TO `recurring_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_space_category_groups` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_categories_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_space_category_groups`(`id`, `space_id`, `name`, `sort_order`, `archived_at`, `created_at`, `updated_at`) SELECT `id`, `space_id`, `name`, `sort_order`, `archived_at`, `created_at`, `updated_at` FROM `space_category_groups`;--> statement-breakpoint
DROP TABLE `space_category_groups`;--> statement-breakpoint
ALTER TABLE `__new_space_category_groups` RENAME TO `space_category_groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_categories` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_user_categories_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `user_categories_group_fk` FOREIGN KEY (`group_id`,`user_id`) REFERENCES `user_category_groups`(`id`,`user_id`)
);
--> statement-breakpoint
INSERT INTO `__new_user_categories`(`id`, `name`, `sort_order`, `archived_at`, `created_at`, `updated_at`) SELECT `id`, `name`, `sort_order`, `archived_at`, `created_at`, `updated_at` FROM `user_categories`;--> statement-breakpoint
DROP TABLE `user_categories`;--> statement-breakpoint
ALTER TABLE `__new_user_categories` RENAME TO `user_categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `categories_space_group_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `category_groups_space_idx`;--> statement-breakpoint
CREATE INDEX `expenses_space_date_idx` ON `expenses` (`space_id`,`occurred_on`);--> statement-breakpoint
CREATE INDEX `expenses_space_category_date_idx` ON `expenses` (`space_id`,`category_id`,`occurred_on`);--> statement-breakpoint
CREATE INDEX `expenses_event_idx` ON `expenses` (`event_id`);--> statement-breakpoint
CREATE INDEX `expenses_creator_recent_idx` ON `expenses` (`created_by_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `monthly_plan_allocations_plan_idx` ON `monthly_plan_allocations` (`monthly_plan_id`);--> statement-breakpoint
CREATE INDEX `recurring_items_space_idx` ON `recurring_items` (`space_id`);--> statement-breakpoint
CREATE INDEX `space_category_groups_space_idx` ON `space_category_groups` (`space_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `space_category_groups_id_space_unique` ON `space_category_groups` (`id`,`space_id`);--> statement-breakpoint
CREATE INDEX `user_categories_user_group_idx` ON `user_categories` (`user_id`,`group_id`);--> statement-breakpoint
CREATE INDEX `space_categories_space_group_idx` ON `space_categories` (`space_id`,`group_id`);--> statement-breakpoint
CREATE INDEX `user_category_groups_user_idx` ON `user_category_groups` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_category_groups_id_user_unique` ON `user_category_groups` (`id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_space_category_mappings_unique` ON `user_space_category_mappings` (`user_id`,`space_category_id`);--> statement-breakpoint
CREATE INDEX `user_space_category_mappings_user_category_idx` ON `user_space_category_mappings` (`user_category_id`);