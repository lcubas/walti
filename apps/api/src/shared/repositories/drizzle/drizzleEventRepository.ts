import { and, desc, eq } from 'drizzle-orm';
import type { Event, EventList } from '@walti/shared';
import type { Database } from '../../database/client';
import { events } from '../../database/schema';
import type { EventRepository } from '../eventRepository';

export class DrizzleEventRepository implements EventRepository {
	private readonly columns = {
		id: events.id,
		name: events.name,
		startsOn: events.startsOn,
		endsOn: events.endsOn,
		budgetCents: events.budgetCents,
		archivedAt: events.archivedAt,
	};

	constructor(private readonly db: Database) {}

	listForSpace(spaceId: string): Promise<EventList> {
		return this.db
			.select(this.columns)
			.from(events)
			.where(eq(events.spaceId, spaceId))
			.orderBy(desc(events.startsOn));
	}

	async findForSpace(spaceId: string, eventId: string): Promise<Event | null> {
		const [event] = await this.db
			.select(this.columns)
			.from(events)
			.where(and(eq(events.id, eventId), eq(events.spaceId, spaceId)));

		return event ?? null;
	}

	async create(
		spaceId: string,
		input: {
			name: string;
			startsOn: string;
			endsOn: string;
			budgetCents?: number;
		},
	): Promise<Event> {
		const [event] = await this.db
			.insert(events)
			.values({
				spaceId,
				name: input.name,
				startsOn: input.startsOn,
				endsOn: input.endsOn,
				budgetCents: input.budgetCents ?? null,
			})
			.returning(this.columns);

		return event;
	}

	async update(
		eventId: string,
		changes: {
			name?: string;
			startsOn?: string;
			endsOn?: string;
			budgetCents?: number | null;
		},
	): Promise<void> {
		await this.db.update(events).set(changes).where(eq(events.id, eventId));
	}

	async setArchivedAt(
		eventId: string,
		archivedAt: string | null,
	): Promise<void> {
		await this.db
			.update(events)
			.set({ archivedAt })
			.where(eq(events.id, eventId));
	}
}
