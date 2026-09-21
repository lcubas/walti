import type { Category, CreateCategoryRequest } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { CategoryService } from '../services/categoryService';

export class CreateCategoryUseCase {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly categoryService: CategoryService,
	) {}

	async execute(
		space: SpaceAccess,
		{ groupId, name }: CreateCategoryRequest,
	): Promise<Category> {
		const groups = await this.categoryRepository.listForSpace(space.id);
		const group = this.categoryService.requireGroup(groups, groupId);

		this.categoryService.verifyGroupIsActive(group);
		this.categoryService.verifyFreeCategoryName(group, name);

		return this.categoryRepository.createCategory(
			space.id,
			groupId,
			name,
			group.categories.length,
		);
	}
}
