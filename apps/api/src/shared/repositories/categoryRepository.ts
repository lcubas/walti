import type { Catalog } from '@walti/shared';

export interface CategoryRepository {
	/**
	 * The catalogue of a space, groups with their categories nested, in the
	 * order they are meant to be read. Archived entries are included.
	 *
	 * @param spaceId - Space whose catalogue is read.
	 * @returns catalogs of categories and category groups
	 */
	listForSpace(spaceId: string): Promise<Catalog>;
}
