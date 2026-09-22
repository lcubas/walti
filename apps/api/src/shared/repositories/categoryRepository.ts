import type { Category, CategoryGroup, CategoryGroupList } from '@walti/shared';

export interface CategoryRepository {
	/**
	 * The list of groups of a space, groups with their categories nested, in the
	 * order they are meant to be read. Archived entries are included.
	 *
	 * @param spaceId - Space whose list of groups is read.
	 * @returns Its groups, each with its categories.
	 */
	listForSpace(spaceId: string): Promise<CategoryGroupList>;

	/**
	 * Adds a group to a space.
	 *
	 * @param spaceId - Space that owns it.
	 * @param name - Name of the group.
	 * @param sortOrder - Position in the list.
	 * @returns The group as persisted, with no categories yet.
	 */
	createGroup(
		spaceId: string,
		name: string,
		sortOrder: number,
	): Promise<CategoryGroup>;

	/**
	 * Changes the name of a group.
	 *
	 * @param groupId - Group to rename.
	 * @param name - New name.
	 */
	renameGroup(groupId: string, name: string): Promise<void>;

	/**
	 * Adds a category to a group.
	 *
	 * @param spaceId - Space that owns it.
	 * @param groupId - Group it belongs to, of the same space.
	 * @param name - Name of the category.
	 * @param sortOrder - Position within the group.
	 * @returns The category as persisted, with no intent yet.
	 */
	createCategory(
		spaceId: string,
		groupId: string,
		name: string,
		sortOrder: number,
	): Promise<Category>;

	/**
	 * Renames a category, moves it to another group, or both. Renaming reaches
	 * the whole history on its own: an expense points at the category, never at
	 * its name.
	 *
	 * @param categoryId - Category to change.
	 * @param changes - New name, new group, new position, or a combination.
	 */
	updateCategory(
		categoryId: string,
		changes: { name?: string; groupId?: string; sortOrder?: number },
	): Promise<void>;

	/**
	 * Sets or clears the instant at which a category was archived. Its expenses
	 * are untouched and keep counting in every report.
	 *
	 * @param categoryId - Category to change.
	 * @param archivedAt - UTC instant, or `null` to bring it back.
	 */
	setCategoryArchivedAt(
		categoryId: string,
		archivedAt: string | null,
	): Promise<void>;
}
