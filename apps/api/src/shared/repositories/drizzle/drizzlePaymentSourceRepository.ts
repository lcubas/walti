import { eq } from 'drizzle-orm';
import type { Database } from '../../database/client';
import { paymentSources } from '../../database/schema';
import type { PaymentSourceRepository } from '../paymentSourceRepository';

export class DrizzlePaymentSourceRepository implements PaymentSourceRepository {
	private readonly columns = {
		id: paymentSources.id,
		name: paymentSources.name,
		archivedAt: paymentSources.archivedAt,
	};

	constructor(private readonly db: Database) {}

	listForUser(userId: string) {
		return this.db
			.select(this.columns)
			.from(paymentSources)
			.where(eq(paymentSources.userId, userId))
			.orderBy(paymentSources.createdAt);
	}

	async create(userId: string, name: string) {
		const [paymentSource] = await this.db
			.insert(paymentSources)
			.values({ userId, name })
			.returning(this.columns);

		return paymentSource;
	}

	async rename(paymentSourceId: string, name: string) {
		await this.db
			.update(paymentSources)
			.set({ name })
			.where(eq(paymentSources.id, paymentSourceId));
	}

	async setArchivedAt(paymentSourceId: string, archivedAt: string | null) {
		await this.db
			.update(paymentSources)
			.set({ archivedAt })
			.where(eq(paymentSources.id, paymentSourceId));
	}
}
