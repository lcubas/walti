import type { CreateExpenseRequest, Expense } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { EventRepository } from '../../../shared/repositories/eventRepository';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';
import type { PaymentSourceRepository } from '../../../shared/repositories/paymentSourceRepository';
import type { PaymentSourceService } from '../../paymentSources/services/paymentSourceService';
import type { ExpenseService } from '../services/expenseService';

export class CreateExpenseUseCase {
	constructor(
		private readonly expenseRepository: ExpenseRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly paymentSourceRepository: PaymentSourceRepository,
		private readonly eventRepository: EventRepository,
		private readonly expenseService: ExpenseService,
		private readonly paymentSourceService: PaymentSourceService,
	) {}

	async execute(
		space: SpaceAccess,
		userId: string,
		input: CreateExpenseRequest,
	): Promise<Expense> {
		const groups = await this.categoryRepository.listForSpace(space.id);

		this.expenseService.requireActiveCategory(groups, input.categoryId);

		if (input.paymentSourceId) {
			const sources = await this.paymentSourceRepository.listForUser(userId);
			const source = this.paymentSourceService.requirePaymentSource(
				sources,
				input.paymentSourceId,
			);
			this.expenseService.requireActivePaymentSource(source);
		}

		if (input.eventId) {
			const event = await this.eventRepository.findForSpace(
				space.id,
				input.eventId,
			);
			this.expenseService.requireActiveEvent(event);
		}

		return this.expenseRepository.create(space.id, userId, input);
	}
}
