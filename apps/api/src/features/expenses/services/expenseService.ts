import type { CategoryGroupList } from '@walti/shared';
import { ConflictError } from '../../../shared/errors/conflictError';
import { NotFoundError } from '../../../shared/errors/notFoundError';

export class ExpenseService {
	/**
	 * Confirms a category belongs to the space and can still receive expenses.
	 *
	 * @param groups - The space's categories, as read by `CategoryRepository.listForSpace`.
	 * @param categoryId - Category the expense points at.
	 * @throws {NotFoundError} If no such category exists in this space.
	 * @throws {ConflictError} If the category or its group is archived.
	 */
	requireActiveCategory(groups: CategoryGroupList, categoryId: string): void {
		for (const group of groups) {
			const category = group.categories.find(
				(candidate) => candidate.id === categoryId,
			);

			if (!category) {
				continue;
			}

			if (group.archivedAt || category.archivedAt) {
				throw new ConflictError(
					'category_archived',
					'Esa categoría está archivada. Elige otra o recupérala antes de usarla.',
				);
			}

			return;
		}

		throw new NotFoundError(
			'category_not_found',
			'Esa categoría no existe en este espacio.',
		);
	}
}
