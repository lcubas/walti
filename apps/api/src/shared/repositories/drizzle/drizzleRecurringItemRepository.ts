import { and, desc, eq } from 'drizzle-orm';
import type { RecurringItem, RecurringItemList } from '@walti/shared';
import type { Database } from '../../database/client';
import { recurringItems } from '../../database/schema';
import type { RecurringItemRepository } from '../recurringItemRepository';

export class DrizzleRecurringItemRepository implements RecurringItemRepository {
	private readonly columns = {
		id: recurringItems.id,
		categoryId: recurringItems.categoryId,
		name: recurringItems.name,
		kind: recurringItems.kind,
		frequency: recurringItems.frequency,
		anchorDay: recurringItems.anchorDay,
		anchorMonth: recurringItems.anchorMonth,
		expectedAmountCents: recurringItems.expectedAmountCents,
		pausedAt: recurringItems.pausedAt,
		archivedAt: recurringItems.archivedAt,
	};

	constructor(private readonly db: Database) {}

	listForSpace(spaceId: string): Promise<RecurringItemList> {
		return this.db
			.select(this.columns)
			.from(recurringItems)
			.where(eq(recurringItems.spaceId, spaceId))
			.orderBy(desc(recurringItems.createdAt));
	}

	async findForSpace(
		spaceId: string,
		recurringItemId: string,
	): Promise<RecurringItem | null> {
		const [item] = await this.db
			.select(this.columns)
			.from(recurringItems)
			.where(
				and(
					eq(recurringItems.id, recurringItemId),
					eq(recurringItems.spaceId, spaceId),
				),
			);

		return item ?? null;
	}

	async create(
		spaceId: string,
		input: {
			categoryId: string;
			name: string;
			kind: RecurringItem['kind'];
			frequency: RecurringItem['frequency'];
			anchorDay: number;
			anchorMonth?: number;
			expectedAmountCents: number;
		},
	): Promise<RecurringItem> {
		const [item] = await this.db
			.insert(recurringItems)
			.values({
				spaceId,
				categoryId: input.categoryId,
				name: input.name,
				kind: input.kind,
				frequency: input.frequency,
				anchorDay: input.anchorDay,
				anchorMonth: input.anchorMonth ?? null,
				expectedAmountCents: input.expectedAmountCents,
			})
			.returning(this.columns);

		return item;
	}

	async update(
		recurringItemId: string,
		changes: {
			categoryId?: string;
			name?: string;
			kind?: RecurringItem['kind'];
			frequency?: RecurringItem['frequency'];
			anchorDay?: number;
			anchorMonth?: number | null;
			expectedAmountCents?: number;
		},
	): Promise<void> {
		await this.db
			.update(recurringItems)
			.set(changes)
			.where(eq(recurringItems.id, recurringItemId));
	}

	async setPausedAt(
		recurringItemId: string,
		pausedAt: string | null,
	): Promise<void> {
		await this.db
			.update(recurringItems)
			.set({ pausedAt })
			.where(eq(recurringItems.id, recurringItemId));
	}

	async setArchivedAt(
		recurringItemId: string,
		archivedAt: string | null,
	): Promise<void> {
		await this.db
			.update(recurringItems)
			.set({ archivedAt })
			.where(eq(recurringItems.id, recurringItemId));
	}
}
