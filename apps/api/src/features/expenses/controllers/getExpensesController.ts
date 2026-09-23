import type { Context } from 'hono';
import type { ListExpensesQuery } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListExpensesUseCase } from '../useCases/listExpensesUseCase';

export class GetExpensesController {
	constructor(private readonly listExpensesUseCase: ListExpensesUseCase) {}

	async handle(c: Context<SpaceContext>, query: ListExpensesQuery) {
		const expenses = await this.listExpensesUseCase.execute(
			c.get('space').id,
			query.period,
		);

		return ok(c, expenses);
	}
}
