import {
	foreignKey,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { spaceCategories } from './spaceCategories';
import { users } from './users';

export const userCategoryGroups = sqliteTable(
	'user_category_groups',
	{
		id: primaryId(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [
		index('user_category_groups_user_idx').on(t.userId),
		uniqueIndex('user_category_groups_id_user_unique').on(t.id, t.userId),
	],
);

export const userCategories = sqliteTable(
	'user_categories',
	{
		id: primaryId(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		groupId: text('group_id').notNull(),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [
		index('user_categories_user_group_idx').on(t.userId, t.groupId),
		foreignKey({
			name: 'user_categories_group_fk',
			columns: [t.groupId, t.userId],
			foreignColumns: [userCategoryGroups.id, userCategoryGroups.userId],
		}),
	],
);

export const userSpaceCategoryMappings = sqliteTable(
	'user_space_category_mappings',
	{
		id: primaryId(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		spaceCategoryId: text('space_category_id')
			.notNull()
			.references(() => spaceCategories.id),
		userCategoryId: text('user_category_id')
			.notNull()
			.references(() => userCategories.id),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('user_space_category_mappings_unique').on(
			t.userId,
			t.spaceCategoryId,
		),
		index('user_space_category_mappings_user_category_idx').on(
			t.userCategoryId,
		),
	],
);
