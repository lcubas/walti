import type { EventList } from '@walti/shared';
import type { EventRepository } from '../../../shared/repositories/eventRepository';

export class ListEventsUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	execute(spaceId: string): Promise<EventList> {
		return this.eventRepository.listForSpace(spaceId);
	}
}
