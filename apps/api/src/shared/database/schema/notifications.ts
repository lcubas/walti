import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { spaces } from './spaces';
import { users } from './users';

export const notificationKinds = ['recurring_due'] as const;
export type NotificationKind = (typeof notificationKinds)[number];

export const notificationPrefs = sqliteTable(
	'notification_prefs',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		kind: text('kind', { enum: notificationKinds }).notNull(),
		enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('notification_prefs_space_user_kind_unique').on(
			t.spaceId,
			t.userId,
			t.kind,
		),
	],
);
