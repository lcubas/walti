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
			eventId?: string;
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
			eventId?: string;
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

	/**
	 * Lists a space's expenses currently linked to one event.
	 *
	 * @param spaceId - Space to scope the search to.
	 * @param eventId - Event the expenses must be linked to.
	 * @returns The linked expenses, most recent first.
	 */
	listForEvent(spaceId: string, eventId: string): Promise<Expense[]>;

	/**
	 * Lists a space's expenses that fall within a date range and carry no
	 * event yet.
	 *
	 * @param spaceId - Space to scope the search to.
	 * @param startsOn - Range start (inclusive), "YYYY-MM-DD".
	 * @param endsOn - Range end (inclusive), "YYYY-MM-DD".
	 * @returns The unlinked expenses in range, most recent first.
	 */
	listUnassignedInRange(
		spaceId: string,
		startsOn: string,
		endsOn: string,
	): Promise<Expense[]>;

	/**
	 * Bulk-links a set of expenses to an event.
	 *
	 * @param spaceId - Space every expense must belong to.
	 * @param eventId - Event to link them to.
	 * @param expenseIds - Expenses to link.
	 */
	assignEvent(
		spaceId: string,
		eventId: string,
		expenseIds: string[],
	): Promise<void>;

	/**
	 * Bulk-clears the event from a set of expenses, only for the ones
	 * currently linked to that exact event.
	 *
	 * @param spaceId - Space every expense must belong to.
	 * @param eventId - Event they must currently be linked to.
	 * @param expenseIds - Expenses to unlink.
	 */
	unassignEvent(
		spaceId: string,
		eventId: string,
		expenseIds: string[],
	): Promise<void>;
}
