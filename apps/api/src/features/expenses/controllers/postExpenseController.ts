import type { Context } from 'hono';
import type { CreateExpenseRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { created } from '../../../shared/http/response';
import type { CreateExpenseUseCase } from '../useCases/createExpenseUseCase';

export class PostExpenseController {
	constructor(private readonly createExpenseUseCase: CreateExpenseUseCase) {}

	async handle(c: Context<SpaceContext>, input: CreateExpenseRequest) {
		const expense = await this.createExpenseUseCase.execute(
			c.get('space'),
			c.get('userId'),
			input,
		);

		return created(c, expense);
	}
}
