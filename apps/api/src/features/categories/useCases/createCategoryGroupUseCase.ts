import type { CategoryGroup } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { CategoryService } from '../services/categoryService';

export class CreateCategoryGroupUseCase {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly categoryService: CategoryService,
	) {}

	async execute(space: SpaceAccess, name: string): Promise<CategoryGroup> {
		const groups = await this.categoryRepository.listForSpace(space.id);

		this.categoryService.verifyFreeGroupName(groups, name);

		return this.categoryRepository.createGroup(space.id, name, groups.length);
	}
}
