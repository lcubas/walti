import { sql } from 'drizzle-orm';
import type { Database } from '../../database/client';
import type { HealthRepository } from '../healthRepository';

export class DrizzleHealthRepository implements HealthRepository {
	constructor(private readonly db: Database) {}

	async ping(): Promise<void> {
		await this.db.get(sql`select 1`);
	}
}
