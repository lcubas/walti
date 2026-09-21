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
import type { CategorySeeder } from './categorySeeder';

export class DrizzleUserRepository implements UserRepository {
	constructor(
		private readonly db: Database,
		private readonly categorySeeder: CategorySeeder,
	) {}

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

			await this.categorySeeder.seedUserCategories(tx, created.id);
			await this.categorySeeder.seedSpaceCategories(tx, space.id, created.id);

			return created;
		});
	}
}
