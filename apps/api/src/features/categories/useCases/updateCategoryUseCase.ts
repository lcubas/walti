import type { UpdateCategoryRequest } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { CategoryService } from '../services/categoryService';

export class UpdateCategoryUseCase {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly categoryService: CategoryService,
	) {}

	async execute(
		space: SpaceAccess,
		categoryId: string,
		{ name, groupId }: UpdateCategoryRequest,
	): Promise<void> {
		const groups = await this.categoryRepository.listForSpace(space.id);
		const { group, category } = this.categoryService.requireCategory(
			groups,
			categoryId,
		);

		const moving = groupId !== undefined && groupId !== group.id;
		const target = moving
			? this.categoryService.requireGroup(groups, groupId)
			: group;

		if (moving) {
			this.categoryService.verifyGroupIsActive(target);
		}

		if (name !== undefined) {
			this.categoryService.verifyFreeCategoryName(target, name, categoryId);
		}

		// Expenses point at the category, never at its name or group, so the
		// history follows on its own.
		await this.categoryRepository.updateCategory(category.id, {
			name,
			groupId: moving ? target.id : undefined,
			sortOrder: moving ? target.categories.length : undefined,
		});
	}
}
