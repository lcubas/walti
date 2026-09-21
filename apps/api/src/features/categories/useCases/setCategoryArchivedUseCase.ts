import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { CategoryService } from '../services/categoryService';

export class SetCategoryArchivedUseCase {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly categoryService: CategoryService,
	) {}

	async execute(
		space: SpaceAccess,
		categoryId: string,
		archived: boolean,
	): Promise<void> {
		const groups = await this.categoryRepository.listForSpace(space.id);
		const { group, category } = this.categoryService.requireCategory(
			groups,
			categoryId,
		);

		if (archived) {
			this.categoryService.verifyCanArchive(group, category);
		} else {
			this.categoryService.verifyGroupIsActive(group);
		}

		await this.categoryRepository.setCategoryArchivedAt(
			category.id,
			archived ? new Date().toISOString() : null,
		);
	}
}
