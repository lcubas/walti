export type User = {
	id: string;
	googleSub: string;
	email: string;
	name: string;
	avatarUrl: string | null;
};

export type NewUser = Omit<User, 'id'>;

export interface UserRepository {
	/**
	 * Finds a user by id.
	 *
	 * @param id - UUIDv7 of the user.
	 * @returns The user, or `null` when no row carries that id.
	 */
	findById(id: string): Promise<User | null>;

	/**
	 * Finds a user by the identity Google gave them.
	 *
	 * @param googleSub - The `sub` claim of a verified Google ID token.
	 * @returns The user, or `null` when no row is linked to that `sub`.
	 */
	findByGoogleSub(googleSub: string): Promise<User | null>;

	/**
	 * Inserts the user together with their settings, their personal space and
	 * their membership in it, in a single transaction. The space takes its
	 * currency from the settings row created in the same transaction.
	 *
	 * @param user - Identity to insert. Uniqueness of `googleSub` is left to the
	 * database, not checked here.
	 * @param spaceName - Name given to the personal space.
	 * @returns The user as persisted, id included.
	 * @throws If any step fails. Nothing is written in that case.
	 */
	createWithPersonalSpace(user: NewUser, spaceName: string): Promise<User>;
}
