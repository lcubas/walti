import type { Context } from 'hono';
import type { ExpenseIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { DeleteExpenseUseCase } from '../useCases/deleteExpenseUseCase';

export class DeleteExpenseController {
	constructor(private readonly deleteExpenseUseCase: DeleteExpenseUseCase) {}

	async handle(c: Context<SpaceContext>, { expenseId }: ExpenseIdParam) {
		await this.deleteExpenseUseCase.execute(c.get('space'), expenseId);

		return c.body(null, 204);
	}
}
