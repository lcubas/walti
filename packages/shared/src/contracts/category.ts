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

/** A space's whole catalogue, in the order it is meant to be read. */
export const Catalog = v.array(CategoryGroup);

export type Catalog = v.InferOutput<typeof Catalog>;
