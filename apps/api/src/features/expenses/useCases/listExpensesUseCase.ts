import type { ExpenseList } from '@walti/shared';
import type { ExpenseRepository } from '../../../shared/repositories/expenseRepository';

export class ListExpensesUseCase {
	constructor(private readonly expenseRepository: ExpenseRepository) {}

	execute(spaceId: string, period: string): Promise<ExpenseList> {
		return this.expenseRepository.listForSpacePeriod(spaceId, period);
	}
}
