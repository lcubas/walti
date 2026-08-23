import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { spaces } from './spaces';

export const categoryGroups = sqliteTable(
	'category_groups',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [index('category_groups_space_idx').on(t.spaceId)],
);

export const categoryIntents = ['protect', 'maintain', 'reduce'] as const;
export type CategoryIntent = (typeof categoryIntents)[number];

export const categories = sqliteTable(
	'categories',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		groupId: text('group_id')
			.notNull()
			.references(() => categoryGroups.id),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		/** Null means the user has not decided; the engine's suggestion applies. */
		intent: text('intent', { enum: categoryIntents }),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [index('categories_space_group_idx').on(t.spaceId, t.groupId)],
);
