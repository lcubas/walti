import { asc, eq } from 'drizzle-orm';
import type { CategoryGroupList, Category, CategoryGroup } from '@walti/shared';
import type { Database } from '../../database/client';
import { spaceCategories, spaceCategoryGroups } from '../../database/schema';
import type { CategoryRepository } from '../categoryRepository';

export class DrizzleCategoryRepository implements CategoryRepository {
	constructor(private readonly db: Database) {}

	async listForSpace(spaceId: string): Promise<CategoryGroupList> {
		// One query and not one per group: this is read on every expense screen.
		const rows = await this.db
			.select({
				groupId: spaceCategoryGroups.id,
				groupName: spaceCategoryGroups.name,
				groupArchivedAt: spaceCategoryGroups.archivedAt,
				id: spaceCategories.id,
				name: spaceCategories.name,
				intent: spaceCategories.intent,
				archivedAt: spaceCategories.archivedAt,
			})
			.from(spaceCategoryGroups)
			.leftJoin(
				spaceCategories,
				eq(spaceCategories.groupId, spaceCategoryGroups.id),
			)
			.where(eq(spaceCategoryGroups.spaceId, spaceId))
			.orderBy(
				asc(spaceCategoryGroups.sortOrder),
				asc(spaceCategories.sortOrder),
			);

		const groups = new Map<string, CategoryGroup>();

		for (const row of rows) {
			const group = groups.get(row.groupId) ?? {
				id: row.groupId,
				name: row.groupName,
				archivedAt: row.groupArchivedAt,
				categories: [],
			};

			// The left join yields one row with nulls for a group with no
			// categories, which is what an emptied group looks like.
			if (row.id && row.name) {
				group.categories.push({
					id: row.id,
					name: row.name,
					intent: row.intent ?? null,
					archivedAt: row.archivedAt,
				});
			}

			groups.set(row.groupId, group);
		}

		return [...groups.values()];
	}

	async createGroup(
		spaceId: string,
		name: string,
		sortOrder: number,
	): Promise<CategoryGroup> {
		const [group] = await this.db
			.insert(spaceCategoryGroups)
			.values({ spaceId, name, sortOrder })
			.returning({
				id: spaceCategoryGroups.id,
				name: spaceCategoryGroups.name,
				archivedAt: spaceCategoryGroups.archivedAt,
			});

		return { ...group, categories: [] };
	}

	async renameGroup(groupId: string, name: string): Promise<void> {
		await this.db
			.update(spaceCategoryGroups)
			.set({ name })
			.where(eq(spaceCategoryGroups.id, groupId));
	}

	async createCategory(
		spaceId: string,
		groupId: string,
		name: string,
		sortOrder: number,
	): Promise<Category> {
		const [category] = await this.db
			.insert(spaceCategories)
			.values({ spaceId, groupId, name, sortOrder })
			.returning({
				id: spaceCategories.id,
				name: spaceCategories.name,
				intent: spaceCategories.intent,
				archivedAt: spaceCategories.archivedAt,
			});

		return { ...category, intent: category.intent ?? null };
	}

	async updateCategory(
		categoryId: string,
		changes: { name?: string; groupId?: string; sortOrder?: number },
	): Promise<void> {
		await this.db
			.update(spaceCategories)
			.set(changes)
			.where(eq(spaceCategories.id, categoryId));
	}

	async setCategoryArchivedAt(
		categoryId: string,
		archivedAt: string | null,
	): Promise<void> {
		await this.db
			.update(spaceCategories)
			.set({ archivedAt })
			.where(eq(spaceCategories.id, categoryId));
	}
}
