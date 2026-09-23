import type { Expense } from '@walti/shared';

export interface ExpenseRepository {
	/**
	 * Records a new expense.
	 *
	 * @param spaceId - Space it belongs to.
	 * @param userId - Who registered it. Internal only; never shown in the UI.
	 * @param input - Category, amount, date and the optional detail of the expense.
	 * @returns The persisted expense.
	 */
	create(
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
	): Promise<Expense>;

	/**
	 * Lists a space's expenses for one calendar month.
	 *
	 * @param spaceId - Space to list from.
	 * @param period - Month to list, as "YYYY-MM".
	 * @returns The expenses, most recent first.
	 */
	listForSpacePeriod(spaceId: string, period: string): Promise<Expense[]>;

	/**
	 * Finds one expense, scoped to a space.
	 *
	 * @param spaceId - Space it must belong to.
	 * @param expenseId - Expense to find.
	 * @returns The expense, or null if it does not exist in that space.
	 */
	findForSpace(spaceId: string, expenseId: string): Promise<Expense | null>;

	/**
	 * Replaces every editable field of an expense. There is no partial-patch
	 * optional fields no send-it replace with null
	 *
	 * @param expenseId - Expense to update.
	 * @param input - The full, new state of the expense's editable fields.
	 * @returns The expense as persisted.
	 */
	update(
		expenseId: string,
		input: {
			categoryId: string;
			amountCents: number;
			occurredOn: string;
			paymentSourceId?: string;
			merchant?: string;
			note?: string;
		},
	): Promise<Expense>;

	/**
	 * Permanently deletes an expense.
	 *
	 * @param expenseId - Expense to delete. Callers verify it belongs to the
	 * acting space first, with {@link findForSpace}.
	 */
	delete(expenseId: string): Promise<void>;
}
