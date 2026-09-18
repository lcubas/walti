import { eq } from 'drizzle-orm';
import { spaceRoles } from '@walti/shared';
import type { Database } from '../../database/client';
import {
	spaceMembers,
	spaces,
	userSettings,
	users,
} from '../../database/schema';
import type { NewUser, User, UserRepository } from '../userRepository';

export class DrizzleUserRepository implements UserRepository {
	constructor(private readonly db: Database) {}

	async findById(id: string): Promise<User | null> {
		const [found] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);

		return found ?? null;
	}

	async findByGoogleSub(googleSub: string): Promise<User | null> {
		const [found] = await this.db
			.select()
			.from(users)
			.where(eq(users.googleSub, googleSub))
			.limit(1);

		return found ?? null;
	}

	async createWithPersonalSpace(
		user: NewUser,
		spaceName: string,
	): Promise<User> {
		return this.db.transaction(async (tx) => {
			const [created] = await tx.insert(users).values(user).returning();

			// The currency has a single source: the column that carries the default.
			const [settings] = await tx
				.insert(userSettings)
				.values({ userId: created.id })
				.returning({ currency: userSettings.currency });

			const [space] = await tx
				.insert(spaces)
				.values({
					name: spaceName,
					currency: settings.currency,
					isDefault: true,
				})
				.returning({ id: spaces.id });

			await tx.insert(spaceMembers).values({
				spaceId: space.id,
				userId: created.id,
				role: spaceRoles.owner,
			});

			return created;
		});
	}
}
