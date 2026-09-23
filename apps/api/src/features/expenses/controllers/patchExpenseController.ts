import type { Context } from 'hono';
import type { ExpenseIdParam, UpdateExpenseRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { UpdateExpenseUseCase } from '../useCases/updateExpenseUseCase';

export class PatchExpenseController {
	constructor(private readonly updateExpenseUseCase: UpdateExpenseUseCase) {}

	async handle(
		c: Context<SpaceContext>,
		{ expenseId }: ExpenseIdParam,
		input: UpdateExpenseRequest,
	) {
		await this.updateExpenseUseCase.execute(
			c.get('space'),
			c.get('userId'),
			expenseId,
			input,
		);

		return c.body(null, 204);
	}
}
