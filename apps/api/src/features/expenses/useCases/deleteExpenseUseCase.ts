import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';

export class DeleteExpenseUseCase {
	constructor(private readonly expenseRepository: ExpenseRepository) {}

	async execute(space: SpaceAccess, expenseId: string): Promise<void> {
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

		await this.expenseRepository.delete(expenseId);
	}
}
