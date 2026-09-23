import type { UpdateExpenseRequest } from '@walti/shared';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';
import type { PaymentSourceRepository } from '../../../shared/repositories/paymentSourceRepository';
import type { PaymentSourceService } from '../../paymentSources/services/paymentSourceService';
import type { ExpenseService } from '../services/expenseService';

export class UpdateExpenseUseCase {
	constructor(
		private readonly expenseRepository: ExpenseRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly paymentSourceRepository: PaymentSourceRepository,
		private readonly expenseService: ExpenseService,
		private readonly paymentSourceService: PaymentSourceService,
	) {}

	async execute(
		space: SpaceAccess,
		userId: string,
		expenseId: string,
		input: UpdateExpenseRequest,
	): Promise<void> {
		const expense = await this.expenseRepository.findForSpace(
			space.id,
			expenseId,
		);

		if (!expense) {
			throw new NotFoundError(
				'expense_not_found',
				'Ese gasto no existe en este espacio.',
			);
		}

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

		await this.expenseRepository.update(expenseId, input);
	}
}
