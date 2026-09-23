import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { EventRepository } from '../../../shared/repositories/eventRepository';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';
import type { ExpenseService } from '../../expenses/services/expenseService';

export class AssignExpensesToEventUseCase {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly expenseRepository: ExpenseRepository,
		private readonly expenseService: ExpenseService,
	) {}

	async execute(
		space: SpaceAccess,
		eventId: string,
		expenseIds: string[],
	): Promise<void> {
		const event = await this.eventRepository.findForSpace(space.id, eventId);

		this.expenseService.requireActiveEvent(event);

		await this.expenseRepository.assignEvent(space.id, eventId, expenseIds);
	}
}
