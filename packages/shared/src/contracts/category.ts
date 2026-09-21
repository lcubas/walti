import * as v from 'valibot';

/**
 * What the user means to do about a category. Null is not indecision made
 * permanent: it means they have not said, and the engine's suggestion applies.
 */
export const CategoryIntent = v.picklist(['protect', 'maintain', 'reduce']);

export type CategoryIntent = v.InferOutput<typeof CategoryIntent>;

export const Category = v.object({
	id: v.string(),
	name: v.string(),
	intent: v.nullable(CategoryIntent),
	/** Null means active. An archived category keeps its history. */
	archivedAt: v.nullable(v.string()),
});

export type Category = v.InferOutput<typeof Category>;

/** The first and only level above a category. */
export const CategoryGroup = v.object({
	id: v.string(),
	name: v.string(),
	archivedAt: v.nullable(v.string()),
	categories: v.array(Category),
});

export type CategoryGroup = v.InferOutput<typeof CategoryGroup>;

/** Every group of a space with its categories, in display order. */
export const CategoryGroupList = v.array(CategoryGroup);

export type CategoryGroupList = v.InferOutput<typeof CategoryGroupList>;

const groupName = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Ponle un nombre al grupo.'),
	v.maxLength(40, 'El nombre no puede pasar de 40 caracteres.'),
);

const categoryName = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Ponle un nombre a la categoría.'),
	v.maxLength(40, 'El nombre no puede pasar de 40 caracteres.'),
);

const id = v.pipe(v.string(), v.uuid());

export const CategoryIdParam = v.object({ categoryId: id });

export type CategoryIdParam = v.InferOutput<typeof CategoryIdParam>;

export const CategoryGroupIdParam = v.object({ groupId: id });

export type CategoryGroupIdParam = v.InferOutput<typeof CategoryGroupIdParam>;

export const CreateCategoryGroupRequest = v.object({ name: groupName });

export type CreateCategoryGroupRequest = v.InferOutput<
	typeof CreateCategoryGroupRequest
>;

export const RenameCategoryGroupRequest = v.object({ name: groupName });

export type RenameCategoryGroupRequest = v.InferOutput<
	typeof RenameCategoryGroupRequest
>;

export const CreateCategoryRequest = v.object({
	groupId: id,
	name: categoryName,
});

export type CreateCategoryRequest = v.InferOutput<typeof CreateCategoryRequest>;

/** Renaming and moving are the same edit; archiving has its own endpoint. */
export const UpdateCategoryRequest = v.pipe(
	v.object({
		name: v.optional(categoryName),
		groupId: v.optional(id),
	}),
	v.check(
		(input) => input.name !== undefined || input.groupId !== undefined,
		'No hay nada que cambiar.',
	),
);

export type UpdateCategoryRequest = v.InferOutput<typeof UpdateCategoryRequest>;
