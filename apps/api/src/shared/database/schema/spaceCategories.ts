import {
	foreignKey,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { spaces } from './spaces';

export const spaceCategoryGroups = sqliteTable(
	'space_category_groups',
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
	(t) => [
		index('space_category_groups_space_idx').on(t.spaceId),
		uniqueIndex('space_category_groups_id_space_unique').on(t.id, t.spaceId),
	],
);

export const categoryIntents = ['protect', 'maintain', 'reduce'] as const;
export type CategoryIntent = (typeof categoryIntents)[number];

export const spaceCategories = sqliteTable(
	'space_categories',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		groupId: text('group_id').notNull(),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		intent: text('intent', { enum: categoryIntents }),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [
		index('space_categories_space_group_idx').on(t.spaceId, t.groupId),
		foreignKey({
			name: 'space_categories_group_fk',
			columns: [t.groupId, t.spaceId],
			foreignColumns: [spaceCategoryGroups.id, spaceCategoryGroups.spaceId],
		}),
	],
);
