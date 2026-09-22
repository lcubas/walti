import type { Database } from '../../database/client';
import { expenses } from '../../database/schema';
import type { ExpenseRepository } from '../expenseRepository';

export class DrizzleExpenseRepository implements ExpenseRepository {
	private readonly columns = {
		id: expenses.id,
		categoryId: expenses.categoryId,
		amountCents: expenses.amountCents,
		occurredOn: expenses.occurredOn,
	};

	constructor(private readonly db: Database) {}

	async create(
		spaceId: string,
		userId: string,
		input: { categoryId: string; amountCents: number; occurredOn: string },
	) {
		const [expense] = await this.db
			.insert(expenses)
			.values({
				spaceId,
				categoryId: input.categoryId,
				amountCents: input.amountCents,
				occurredOn: input.occurredOn,
				createdByUserId: userId,
			})
			.returning(this.columns);

		return expense;
	}
}
