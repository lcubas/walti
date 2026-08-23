import {
	check,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { primaryId, timestamps } from './columns';
import { currencies } from './enums';

export const users = sqliteTable(
	'users',
	{
		id: primaryId(),
		googleSub: text('google_sub').notNull(),
		email: text('email').notNull(),
		name: text('name').notNull(),
		avatarUrl: text('avatar_url'),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('users_google_sub_unique').on(t.googleSub),
		uniqueIndex('users_email_unique').on(t.email),
	],
);

export const userSettings = sqliteTable(
	'user_settings',
	{
		id: primaryId(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		currency: text('currency', { enum: currencies }).notNull().default('PEN'),
		planningReminderDay: integer('planning_reminder_day').notNull().default(3),
		planningReminderEnabled: integer('planning_reminder_enabled', {
			mode: 'boolean',
		})
			.notNull()
			.default(true),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('user_settings_user_unique').on(t.userId),
		check(
			'user_settings_day_range',
			sql`${t.planningReminderDay} BETWEEN 1 AND 31`,
		),
	],
);
