import type { Catalog } from '@walti/shared';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';

export class ListCategoriesUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	execute(spaceId: string): Promise<Catalog> {
		return this.categoryRepository.listForSpace(spaceId);
	}
}
