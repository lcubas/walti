import type {
	RecurringFrequency,
	RecurringItem,
	RecurringItemList,
	RecurringKind,
} from '@walti/shared';

export interface RecurringItemRepository {
	/**
	 * The recurrents of a space, most recently created first. Paused and
	 * archived entries are included.
	 *
	 * @param spaceId - Space whose recurrents are read.
	 * @returns One entry per recurrent, empty when the space has none.
	 */
	listForSpace(spaceId: string): Promise<RecurringItemList>;

	/**
	 * Reads a single recurrent, scoped to the space it must belong to.
	 *
	 * @param spaceId - Space it must belong to.
	 * @param recurringItemId - Recurrent to read.
	 * @returns The recurrent, or `null` if it does not exist in this space.
	 */
	findForSpace(
		spaceId: string,
		recurringItemId: string,
	): Promise<RecurringItem | null>;

	/**
	 * Adds a recurrent to a space.
	 *
	 * @param spaceId - Space that owns it.
	 * @param input - Its full definition.
	 * @returns The recurrent as persisted.
	 */
	create(
		spaceId: string,
		input: {
			categoryId: string;
			name: string;
			kind: RecurringKind;
			frequency: RecurringFrequency;
			anchorDay: number;
			anchorMonth?: number;
			expectedAmountCents: number;
		},
	): Promise<RecurringItem>;

	/**
	 * Applies a partial patch. A field left out of `changes` keeps its
	 * current value; `anchorMonth: null` clears it (switching back to
	 * monthly).
	 *
	 * @param recurringItemId - Recurrent to change.
	 * @param changes - Fields to update.
	 */
	update(
		recurringItemId: string,
		changes: {
			categoryId?: string;
			name?: string;
			kind?: RecurringKind;
			frequency?: RecurringFrequency;
			anchorDay?: number;
			anchorMonth?: number | null;
			expectedAmountCents?: number;
		},
	): Promise<void>;

	/**
	 * Sets or clears the instant at which a recurrent was paused. Paused
	 * stops it from creating new pendientes (E7.2) without touching what it
	 * already generated.
	 *
	 * @param recurringItemId - Recurrent to change.
	 * @param pausedAt - UTC instant, or `null` to resume it.
	 */
	setPausedAt(recurringItemId: string, pausedAt: string | null): Promise<void>;

	/**
	 * Sets or clears the instant at which a recurrent was archived. Its
	 * history (past pendientes and the expenses they became) is untouched.
	 *
	 * @param recurringItemId - Recurrent to change.
	 * @param archivedAt - UTC instant, or `null` to bring it back.
	 */
	setArchivedAt(
		recurringItemId: string,
		archivedAt: string | null,
	): Promise<void>;
}
