import type { Expense } from '@walti/shared';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { EventRepository } from '../../../shared/repositories/eventRepository';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';

export class ListEventExpensesUseCase {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly expenseRepository: ExpenseRepository,
	) {}

	async execute(space: SpaceAccess, eventId: string): Promise<Expense[]> {
		const event = await this.eventRepository.findForSpace(space.id, eventId);

		if (!event) {
			throw new NotFoundError(
				'event_not_found',
				'Ese evento no existe en este espacio.',
			);
		}

		return this.expenseRepository.listForEvent(space.id, eventId);
	}
}
