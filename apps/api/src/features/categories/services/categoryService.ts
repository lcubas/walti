import type { CategoryGroupList, Category, CategoryGroup } from '@walti/shared';
import { ConflictError } from '../../../shared/errors/conflictError';
import { NotFoundError } from '../../../shared/errors/notFoundError';

export class CategoryService {
	private sameName(left: string, right: string): boolean {
		return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
	}

	requireGroup(groups: CategoryGroupList, groupId: string): CategoryGroup {
		const group = groups.find((candidate) => candidate.id === groupId);

		if (!group) {
			throw new NotFoundError(
				'category_group_not_found',
				'Ese grupo no existe en este espacio.',
			);
		}

		return group;
	}

	requireCategory(
		groups: CategoryGroupList,
		categoryId: string,
	): { group: CategoryGroup; category: Category } {
		for (const group of groups) {
			const category = group.categories.find(
				(candidate) => candidate.id === categoryId,
			);

			if (category) {
				return { group, category };
			}
		}

		throw new NotFoundError(
			'category_not_found',
			'Esa categoría no existe en este espacio.',
		);
	}

	verifyFreeGroupName(
		groups: CategoryGroupList,
		name: string,
		exceptId?: string,
	): void {
		const taken = groups.some(
			(group) => group.id !== exceptId && this.sameName(group.name, name),
		);

		if (taken) {
			throw new ConflictError(
				'category_group_name_taken',
				'Ya tienes un grupo con ese nombre.',
			);
		}
	}

	verifyFreeCategoryName(
		group: CategoryGroup,
		name: string,
		exceptId?: string,
	): void {
		const taken = group.categories.some(
			(category) =>
				category.id !== exceptId && this.sameName(category.name, name),
		);

		if (taken) {
			throw new ConflictError(
				'category_name_taken',
				`Ya tienes una categoría con ese nombre en ${group.name}.`,
			);
		}
	}

	verifyGroupIsActive(group: CategoryGroup): void {
		if (group.archivedAt) {
			throw new ConflictError(
				'category_group_archived',
				'Ese grupo está archivado. Recupéralo antes de usarlo.',
			);
		}
	}

	verifyCanArchive(group: CategoryGroup, category: Category): void {
		const active = group.categories.filter(
			(candidate) => !candidate.archivedAt,
		);

		if (!category.archivedAt && active.length <= 1) {
			throw new ConflictError(
				'last_active_category',
				`Es la única categoría activa de ${group.name}. Crea otra antes de archivarla.`,
			);
		}
	}
}
