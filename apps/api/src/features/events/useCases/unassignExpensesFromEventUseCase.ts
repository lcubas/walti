import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { EventRepository } from '../../../shared/repositories/eventRepository';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';

export class UnassignExpensesFromEventUseCase {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly expenseRepository: ExpenseRepository,
	) {}

	async execute(
		space: SpaceAccess,
		eventId: string,
		expenseIds: string[],
	): Promise<void> {
		const event = await this.eventRepository.findForSpace(space.id, eventId);

		if (!event) {
			throw new NotFoundError(
				'event_not_found',
				'Ese evento no existe en este espacio.',
			);
		}

		// Removing a link is always allowed, even from an archived event: it
		// only fixes a mistake, it never creates a new association.
		await this.expenseRepository.unassignEvent(space.id, eventId, expenseIds);
	}
}
