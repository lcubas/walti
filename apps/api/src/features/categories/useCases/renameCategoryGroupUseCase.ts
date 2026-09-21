import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { CategoryService } from '../services/categoryService';

export class RenameCategoryGroupUseCase {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly categoryService: CategoryService,
	) {}

	async execute(
		space: SpaceAccess,
		groupId: string,
		name: string,
	): Promise<void> {
		const groups = await this.categoryRepository.listForSpace(space.id);

		this.categoryService.requireGroup(groups, groupId);
		this.categoryService.verifyFreeGroupName(groups, name, groupId);

		await this.categoryRepository.renameGroup(groupId, name);
	}
}
