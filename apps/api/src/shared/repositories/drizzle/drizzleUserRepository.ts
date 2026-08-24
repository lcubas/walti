import { eq } from 'drizzle-orm';
import type { Database } from '../../database/client';
import { users } from '../../database/schema';
import type { NewUser, User, UserRepository } from '../userRepository';

const columns = {
	id: users.id,
	googleSub: users.googleSub,
	email: users.email,
	name: users.name,
	avatarUrl: users.avatarUrl,
};

export class DrizzleUserRepository implements UserRepository {
	constructor(private readonly db: Database) {}

	async findByGoogleSub(googleSub: string): Promise<User | null> {
		const [found] = await this.db
			.select(columns)
			.from(users)
			.where(eq(users.googleSub, googleSub))
			.limit(1);

		return found ?? null;
	}

	async create(user: NewUser): Promise<User> {
		const [created] = await this.db
			.insert(users)
			.values(user)
			.returning(columns);

		return created;
	}
}
