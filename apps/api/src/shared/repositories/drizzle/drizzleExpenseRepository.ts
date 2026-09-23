import { and, desc, eq, gte, lt } from 'drizzle-orm';
import type { Database } from '../../database/client';
import { expenses } from '../../database/schema';
import type { ExpenseRepository } from '../expenseRepository';

export class DrizzleExpenseRepository implements ExpenseRepository {
	private readonly columns = {
		id: expenses.id,
		categoryId: expenses.categoryId,
		amountCents: expenses.amountCents,
		occurredOn: expenses.occurredOn,
		paymentSourceId: expenses.paymentSourceId,
		merchant: expenses.merchant,
		note: expenses.note,
	};

	constructor(private readonly db: Database) {}

	async create(
		spaceId: string,
		userId: string,
		input: {
			categoryId: string;
			amountCents: number;
			occurredOn: string;
			paymentSourceId?: string;
			merchant?: string;
			note?: string;
		},
	) {
		const [expense] = await this.db
			.insert(expenses)
			.values({
				spaceId,
				categoryId: input.categoryId,
				amountCents: input.amountCents,
				occurredOn: input.occurredOn,
				paymentSourceId: input.paymentSourceId,
				merchant: input.merchant,
				note: input.note,
				createdByUserId: userId,
			})
			.returning(this.columns);

		return expense;
	}

	listForSpacePeriod(spaceId: string, period: string) {
		const start = `${period}-01`;
		const end = `${this.nextPeriod(period)}-01`;

		return this.db
			.select(this.columns)
			.from(expenses)
			.where(
				and(
					eq(expenses.spaceId, spaceId),
					gte(expenses.occurredOn, start),
					lt(expenses.occurredOn, end),
				),
			)
			.orderBy(desc(expenses.occurredOn), desc(expenses.createdAt));
	}

	async findForSpace(spaceId: string, expenseId: string) {
		const [expense] = await this.db
			.select(this.columns)
			.from(expenses)
			.where(and(eq(expenses.id, expenseId), eq(expenses.spaceId, spaceId)));

		return expense ?? null;
	}

	async update(
		expenseId: string,
		input: {
			categoryId: string;
			amountCents: number;
			occurredOn: string;
			paymentSourceId?: string;
			merchant?: string;
			note?: string;
		},
	) {
		const [expense] = await this.db
			.update(expenses)
			.set({
				categoryId: input.categoryId,
				amountCents: input.amountCents,
				occurredOn: input.occurredOn,
				// Explicit null, not undefined: the edit form resends every
				// field, so an absent optional one means "cleared", and
				// Drizzle would otherwise skip an undefined key in `.set()`
				// and leave the old value in place.
				paymentSourceId: input.paymentSourceId ?? null,
				merchant: input.merchant ?? null,
				note: input.note ?? null,
			})
			.where(eq(expenses.id, expenseId))
			.returning(this.columns);

		return expense;
	}

	async delete(expenseId: string) {
		await this.db.delete(expenses).where(eq(expenses.id, expenseId));
	}

	private nextPeriod(period: string): string {
		const [year, month] = period.split('-').map(Number);
		const next = new Date(Date.UTC(year, month, 1));
		return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`;
	}
}
