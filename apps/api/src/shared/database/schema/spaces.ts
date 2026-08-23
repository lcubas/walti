import { sql } from 'drizzle-orm';
import {
	check,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { users } from './users';

export const spaces = sqliteTable(
	'spaces',
	{
		id: primaryId(),
		name: text('name').notNull(),
		isDefault: integer('is_default', { mode: 'boolean' })
			.notNull()
			.default(false),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [
		check(
			'spaces_default_not_archived',
			sql`NOT (${t.isDefault} = 1 AND ${t.archivedAt} IS NOT NULL)`,
		),
	],
);

export const spaceRoles = ['owner', 'member'] as const;
export type SpaceRole = (typeof spaceRoles)[number];

export const spaceMembers = sqliteTable(
	'space_members',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		role: text('role', { enum: spaceRoles }).notNull(),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('space_members_space_user_unique').on(t.spaceId, t.userId),
		index('space_members_user_idx').on(t.userId),
	],
);

export const paymentSources = sqliteTable('payment_sources', {
	id: primaryId(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	archivedAt: text('archived_at'),
	...timestamps(),
});
