import type { Context } from 'hono';
import type { EventIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListEventExpensesUseCase } from '../useCases/listEventExpensesUseCase';

export class GetEventExpensesController {
	constructor(
		private readonly listEventExpensesUseCase: ListEventExpensesUseCase,
	) {}

	async handle(c: Context<SpaceContext>, { eventId }: EventIdParam) {
		const expenses = await this.listEventExpensesUseCase.execute(
			c.get('space'),
			eventId,
		);

		return ok(c, expenses);
	}
}
