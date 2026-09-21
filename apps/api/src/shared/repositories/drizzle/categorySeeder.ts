import { asc, eq } from 'drizzle-orm';
import { categoryTemplate } from '../../../config/categoryTemplate';
import type { Transaction } from '../../database/client';
import {
	spaceCategories,
	spaceCategoryGroups,
	userCategories,
	userCategoryGroups,
	userSpaceCategoryMappings,
} from '../../database/schema';

export class CategorySeeder {
	async seedUserCategories(tx: Transaction, userId: string): Promise<void> {
		for (const [groupIndex, group] of categoryTemplate.entries()) {
			const [created] = await tx
				.insert(userCategoryGroups)
				.values({ userId, name: group.name, sortOrder: groupIndex })
				.returning({ id: userCategoryGroups.id });

			await tx.insert(userCategories).values(
				group.categories.map((name, index) => ({
					userId,
					groupId: created.id,
					name,
					sortOrder: index,
				})),
			);
		}
	}

	async seedSpaceCategories(
		tx: Transaction,
		spaceId: string,
		userId: string,
	): Promise<void> {
		const groups = await tx
			.select({ id: userCategoryGroups.id, name: userCategoryGroups.name })
			.from(userCategoryGroups)
			.where(eq(userCategoryGroups.userId, userId))
			.orderBy(asc(userCategoryGroups.sortOrder));

		for (const [groupIndex, group] of groups.entries()) {
			const [createdGroup] = await tx
				.insert(spaceCategoryGroups)
				.values({ spaceId, name: group.name, sortOrder: groupIndex })
				.returning({ id: spaceCategoryGroups.id });

			const source = await tx
				.select({ id: userCategories.id, name: userCategories.name })
				.from(userCategories)
				.where(eq(userCategories.groupId, group.id))
				.orderBy(asc(userCategories.sortOrder));

			for (const [index, category] of source.entries()) {
				const [copy] = await tx
					.insert(spaceCategories)
					.values({
						spaceId,
						groupId: createdGroup.id,
						name: category.name,
						sortOrder: index,
					})
					.returning({ id: spaceCategories.id });

				await tx.insert(userSpaceCategoryMappings).values({
					userId,
					spaceCategoryId: copy.id,
					userCategoryId: category.id,
				});
			}
		}
	}
}
