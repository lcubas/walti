export type User = {
	id: string;
	googleSub: string;
	email: string;
	name: string;
	avatarUrl: string | null;
};

export type NewUser = Omit<User, 'id'>;

export interface UserRepository {
	findById(id: string): Promise<User | null>;
	findByGoogleSub(googleSub: string): Promise<User | null>;
	/**
	 * Creates the user and their settings, personal space and their membership, as one atomic act.
	 */
	createWithPersonalSpace(user: NewUser, spaceName: string): Promise<User>;
}
