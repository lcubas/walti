import type { Currency, SpaceRole } from '@walti/shared';

export type SpaceMembership = {
	id: string;
	name: string;
	currency: Currency;
	isDefault: boolean;
	archivedAt: string | null;
	/** The role of the user the query was scoped to. */
	role: SpaceRole;
	/** How many people belong to the space. */
	members: number;
};

export interface SpaceRepository {
	/**
	 * Lists the spaces the user belongs to, archived ones included, oldest
	 * first.
	 *
	 * @param userId - User whose memberships are read.
	 * @returns One entry per membership, empty when the user has none.
	 */
	listForUser(userId: string): Promise<SpaceMembership[]>;

	/**
	 * Reads a single space the user belongs to.
	 *
	 * @param spaceId - Space to read.
	 * @param userId - User whose membership scopes the read.
	 * @returns The space with this user's role, or `null`.
	 */
	findForUser(spaceId: string, userId: string): Promise<SpaceMembership | null>;

	/**
	 * Inserts a space, the membership that makes the user its owner, and the
	 * catalogue materialised from their taxonomy, in a single transaction. The
	 * currency is copied from the user's settings.
	 *
	 * @param userId - User who creates the space and becomes its owner.
	 * @param name - Name given to the space.
	 * @returns The space as persisted, scoped to its owner.
	 * @throws If the user has no settings row, or if any step fails. Nothing is
	 * written in that case.
	 */
	createForOwner(userId: string, name: string): Promise<SpaceMembership>;

	/**
	 * Changes the name of a space. Unscoped: the caller has already established
	 * that it may write to this space.
	 *
	 * @param spaceId - Space to rename.
	 * @param name - New name.
	 */
	rename(spaceId: string, name: string): Promise<void>;

	/**
	 * Sets or clears the instant at which a space was archived. Unscoped, for
	 * the same reason as rename.
	 *
	 * @param spaceId - Space to change.
	 * @param archivedAt - UTC instant, or `null` to bring the space back.
	 */
	setArchivedAt(spaceId: string, archivedAt: string | null): Promise<void>;
}
