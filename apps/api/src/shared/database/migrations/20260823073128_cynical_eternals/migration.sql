CREATE TABLE `categories` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`intent` text,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_categories_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `fk_categories_group_id_category_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `category_groups`(`id`)
);
--> statement-breakpoint
CREATE TABLE `category_groups` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_category_groups_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`name` text NOT NULL,
	`starts_on` text NOT NULL,
	`ends_on` text NOT NULL,
	`budget_cents` integer,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_events_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT "events_range_valid" CHECK("ends_on" >= "starts_on")
);
--> statement-breakpoint
CREATE TABLE `expenses` (
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
	CONSTRAINT `fk_expenses_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
	CONSTRAINT `fk_expenses_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`),
	CONSTRAINT `fk_expenses_payment_source_id_payment_sources_id_fk` FOREIGN KEY (`payment_source_id`) REFERENCES `payment_sources`(`id`),
	CONSTRAINT `fk_expenses_created_by_user_id_users_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`),
	CONSTRAINT "expenses_occurred_on_format" CHECK("occurred_on" GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
	CONSTRAINT "expenses_amount_positive" CHECK("amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE `notification_prefs` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_notification_prefs_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `fk_notification_prefs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_plan_allocations` (
	`id` text PRIMARY KEY,
	`monthly_plan_id` text NOT NULL,
	`group_id` text,
	`category_id` text,
	`amount_cents` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_monthly_plan_allocations_monthly_plan_id_monthly_plans_id_fk` FOREIGN KEY (`monthly_plan_id`) REFERENCES `monthly_plans`(`id`),
	CONSTRAINT `fk_monthly_plan_allocations_group_id_category_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `category_groups`(`id`),
	CONSTRAINT `fk_monthly_plan_allocations_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
	CONSTRAINT "monthly_plan_allocations_amount_positive" CHECK("amount_cents" > 0),
	CONSTRAINT "monthly_plan_allocations_group_xor_category" CHECK(("group_id" IS NOT NULL) <> ("category_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `monthly_plans` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`period` text NOT NULL,
	`max_limit_cents` integer,
	`accepted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_monthly_plans_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT "monthly_plans_period_format" CHECK("period" GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]')
);
--> statement-breakpoint
CREATE TABLE `recurring_items` (
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
	CONSTRAINT `fk_recurring_items_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
	CONSTRAINT "recurring_items_anchor_day_range" CHECK("anchor_day" BETWEEN 1 AND 31),
	CONSTRAINT "recurring_items_expected_positive" CHECK("expected_amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE `recurring_periods` (
	`id` text PRIMARY KEY,
	`recurring_item_id` text NOT NULL,
	`period` text NOT NULL,
	`due_on` text NOT NULL,
	`expected_amount_cents` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`expense_id` text,
	`remind_at` text,
	`resolved_by_user_id` text,
	`resolved_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_recurring_periods_recurring_item_id_recurring_items_id_fk` FOREIGN KEY (`recurring_item_id`) REFERENCES `recurring_items`(`id`),
	CONSTRAINT `fk_recurring_periods_expense_id_expenses_id_fk` FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`),
	CONSTRAINT `fk_recurring_periods_resolved_by_user_id_users_id_fk` FOREIGN KEY (`resolved_by_user_id`) REFERENCES `users`(`id`),
	CONSTRAINT "recurring_periods_period_format" CHECK("period" GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]'),
	CONSTRAINT "recurring_periods_expense_only_when_registered" CHECK(("status" = 'registered') = ("expense_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `payment_sources` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_payment_sources_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `space_members` (
	`id` text PRIMARY KEY,
	`space_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_space_members_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`),
	CONSTRAINT `fk_space_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `spaces` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "spaces_default_not_archived" CHECK(NOT ("is_default" = 1 AND "archived_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`planning_reminder_day` integer DEFAULT 3 NOT NULL,
	`planning_reminder_enabled` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_user_settings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT "user_settings_day_range" CHECK("planning_reminder_day" BETWEEN 1 AND 31)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`google_sub` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `categories_space_group_idx` ON `categories` (`space_id`,`group_id`);--> statement-breakpoint
CREATE INDEX `category_groups_space_idx` ON `category_groups` (`space_id`);--> statement-breakpoint
CREATE INDEX `events_space_idx` ON `events` (`space_id`);--> statement-breakpoint
CREATE INDEX `expenses_space_date_idx` ON `expenses` (`space_id`,`occurred_on`);--> statement-breakpoint
CREATE INDEX `expenses_space_category_date_idx` ON `expenses` (`space_id`,`category_id`,`occurred_on`);--> statement-breakpoint
CREATE INDEX `expenses_event_idx` ON `expenses` (`event_id`);--> statement-breakpoint
CREATE INDEX `expenses_creator_recent_idx` ON `expenses` (`created_by_user_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `notification_prefs_space_user_kind_unique` ON `notification_prefs` (`space_id`,`user_id`,`kind`);--> statement-breakpoint
CREATE INDEX `monthly_plan_allocations_plan_idx` ON `monthly_plan_allocations` (`monthly_plan_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_plans_space_period_unique` ON `monthly_plans` (`space_id`,`period`);--> statement-breakpoint
CREATE INDEX `recurring_items_space_idx` ON `recurring_items` (`space_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recurring_periods_item_period_unique` ON `recurring_periods` (`recurring_item_id`,`period`);--> statement-breakpoint
CREATE INDEX `recurring_periods_status_due_idx` ON `recurring_periods` (`status`,`due_on`);--> statement-breakpoint
CREATE UNIQUE INDEX `space_members_space_user_unique` ON `space_members` (`space_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `space_members_user_idx` ON `space_members` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_settings_user_unique` ON `user_settings` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_sub_unique` ON `users` (`google_sub`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);