import type { CreateExpenseRequest, Expense } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';
import type { ExpenseService } from '../services/expenseService';

export class CreateExpenseUseCase {
	constructor(
		private readonly expenseRepository: ExpenseRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly expenseService: ExpenseService,
	) {}

	async execute(
		space: SpaceAccess,
		userId: string,
		input: CreateExpenseRequest,
	): Promise<Expense> {
		const groups = await this.categoryRepository.listForSpace(space.id);

		this.expenseService.requireActiveCategory(groups, input.categoryId);

		return this.expenseRepository.create(space.id, userId, input);
	}
}
