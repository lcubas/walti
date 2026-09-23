import type { Event, EventList } from '@walti/shared';

export interface EventRepository {
	/**
	 * The events of a space, most recently started first. Archived entries
	 * are included.
	 *
	 * @param spaceId - Space whose events are read.
	 * @returns One entry per event, empty when the space has none.
	 */
	listForSpace(spaceId: string): Promise<EventList>;

	/**
	 * Reads a single event, scoped to the space it must belong to.
	 *
	 * @param spaceId - Space it must belong to.
	 * @param eventId - Event to read.
	 * @returns The event, or `null` if it does not exist in this space.
	 */
	findForSpace(spaceId: string, eventId: string): Promise<Event | null>;

	/**
	 * Adds an event to a space.
	 *
	 * @param spaceId - Space that owns it.
	 * @param input - Name, date range, and an optional budget.
	 * @returns The event as persisted.
	 */
	create(
		spaceId: string,
		input: {
			name: string;
			startsOn: string;
			endsOn: string;
			budgetCents?: number;
		},
	): Promise<Event>;

	/**
	 * Applies a partial patch. A field left out of `changes` keeps its
	 * current value; `budgetCents: null` clears an existing budget.
	 *
	 * @param eventId - Event to change.
	 * @param changes - Fields to update.
	 */
	update(
		eventId: string,
		changes: {
			name?: string;
			startsOn?: string;
			endsOn?: string;
			budgetCents?: number | null;
		},
	): Promise<void>;

	/**
	 * Sets or clears the instant at which an event was archived. Its
	 * expenses are untouched and keep counting in every report.
	 *
	 * @param eventId - Event to change.
	 * @param archivedAt - UTC instant, or `null` to bring it back.
	 */
	setArchivedAt(eventId: string, archivedAt: string | null): Promise<void>;
}
