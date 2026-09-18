import { eq, sql } from 'drizzle-orm';
import { spaceRoles } from '@walti/shared';
import type { Database } from '../../database/client';
import { spaceMembers, spaces, userSettings } from '../../database/schema';
import type { SpaceMembership, SpaceRepository } from '../spaceRepository';

export class DrizzleSpaceRepository implements SpaceRepository {
	private readonly membershipColumns = {
		id: spaces.id,
		name: spaces.name,
		currency: spaces.currency,
		isDefault: spaces.isDefault,
		archivedAt: spaces.archivedAt,
		role: spaceMembers.role,
		members: sql<number>`(
			SELECT COUNT(*) FROM ${spaceMembers} AS m WHERE m.space_id = ${spaces.id}
		)`,
	};

	constructor(private readonly db: Database) {}

	listForUser(userId: string): Promise<SpaceMembership[]> {
		return this.db
			.select(this.membershipColumns)
			.from(spaces)
			.innerJoin(spaceMembers, eq(spaceMembers.spaceId, spaces.id))
			.where(eq(spaceMembers.userId, userId))
			.orderBy(spaces.createdAt);
	}

	createForOwner(userId: string, name: string): Promise<SpaceMembership> {
		return this.db.transaction(async (tx) => {
			// The currency has a single source: the user's settings. A space never
			// carries one of its own choosing.
			const [settings] = await tx
				.select({ currency: userSettings.currency })
				.from(userSettings)
				.where(eq(userSettings.userId, userId))
				.limit(1);

			const [space] = await tx
				.insert(spaces)
				.values({ name, currency: settings.currency })
				.returning();

			await tx
				.insert(spaceMembers)
				.values({ spaceId: space.id, userId, role: spaceRoles.owner });

			return {
				id: space.id,
				name: space.name,
				currency: space.currency,
				isDefault: space.isDefault,
				archivedAt: space.archivedAt,
				role: spaceRoles.owner,
				members: 1,
			};
		});
	}

	async rename(spaceId: string, name: string): Promise<void> {
		await this.db.update(spaces).set({ name }).where(eq(spaces.id, spaceId));
	}

	async setArchivedAt(
		spaceId: string,
		archivedAt: string | null,
	): Promise<void> {
		await this.db
			.update(spaces)
			.set({ archivedAt })
			.where(eq(spaces.id, spaceId));
	}
}
