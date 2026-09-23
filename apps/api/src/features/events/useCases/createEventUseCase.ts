import type { CreateEventRequest, Event } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { EventRepository } from '../../../shared/repositories/eventRepository';

export class CreateEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	execute(space: SpaceAccess, input: CreateEventRequest): Promise<Event> {
		// The date range is already checked at the schema level here
		return this.eventRepository.create(space.id, input);
	}
}
