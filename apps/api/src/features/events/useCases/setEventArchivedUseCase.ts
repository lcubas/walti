import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { EventRepository } from '../../../shared/repositories/eventRepository';

export class SetEventArchivedUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(
		space: SpaceAccess,
		eventId: string,
		archived: boolean,
	): Promise<void> {
		const event = await this.eventRepository.findForSpace(space.id, eventId);

		if (!event) {
			throw new NotFoundError(
				'event_not_found',
				'Ese evento no existe en este espacio.',
			);
		}

		await this.eventRepository.setArchivedAt(
			eventId,
			archived ? new Date().toISOString() : null,
		);
	}
}
