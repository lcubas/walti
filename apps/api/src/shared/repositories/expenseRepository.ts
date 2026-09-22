import type { Expense } from '@walti/shared';

export interface ExpenseRepository {
	/**
	 * Records a new expense.
	 *
	 * @param spaceId - Space it belongs to.
	 * @param userId - Who registered it. Internal only; never shown in the UI.
	 * @param input - Category, amount and date of the expense.
	 * @returns The persisted expense.
	 */
	create(
		spaceId: string,
		userId: string,
		input: { categoryId: string; amountCents: number; occurredOn: string },
	): Promise<Expense>;
}
