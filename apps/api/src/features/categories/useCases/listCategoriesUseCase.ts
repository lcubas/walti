import type { CategoryGroupList } from '@walti/shared';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';

export class ListCategoriesUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	execute(spaceId: string): Promise<CategoryGroupList> {
		return this.categoryRepository.listForSpace(spaceId);
	}
}
