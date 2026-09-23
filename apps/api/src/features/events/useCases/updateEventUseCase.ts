import type { UpdateEventRequest } from '@walti/shared';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { EventRepository } from '../../../shared/repositories/eventRepository';
import type { EventService } from '../services/eventService';

export class UpdateEventUseCase {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly eventService: EventService,
	) {}

	async execute(
		space: SpaceAccess,
		eventId: string,
		changes: UpdateEventRequest,
	): Promise<void> {
		const event = await this.eventRepository.findForSpace(space.id, eventId);

		if (!event) {
			throw new NotFoundError(
				'event_not_found',
				'Ese evento no existe en este espacio.',
			);
		}

		// Merge onto the current values: a patch that only touches one date
		// still has to respect the range against whichever date didn't change.
		this.eventService.verifyDateRange(
			changes.startsOn ?? event.startsOn,
			changes.endsOn ?? event.endsOn,
		);

		await this.eventRepository.update(eventId, changes);
	}
}
