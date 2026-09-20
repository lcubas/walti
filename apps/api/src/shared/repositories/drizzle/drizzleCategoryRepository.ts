import { asc, eq } from 'drizzle-orm';
import type { Catalog, CategoryGroup } from '@walti/shared';
import type { Database } from '../../database/client';
import { spaceCategories, spaceCategoryGroups } from '../../database/schema';
import type { CategoryRepository } from '../categoryRepository';

export class DrizzleCategoryRepository implements CategoryRepository {
	constructor(private readonly db: Database) {}

	async listForSpace(spaceId: string): Promise<Catalog> {
		// One query and not one per group: the catalogue is read on every screen
		// that registers an expense, so it is the wrong place to pay for a loop.
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

		const catalog = new Map<string, CategoryGroup>();

		for (const row of rows) {
			const group = catalog.get(row.groupId) ?? {
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

			catalog.set(row.groupId, group);
		}

		return [...catalog.values()];
	}
}
