import type { Context } from 'hono';
import type { AssociateExpensesRequest, EventIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { AssignExpensesToEventUseCase } from '../useCases/assignExpensesToEventUseCase';

export class PostEventExpensesController {
	constructor(
		private readonly assignExpensesToEventUseCase: AssignExpensesToEventUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ eventId }: EventIdParam,
		{ expenseIds }: AssociateExpensesRequest,
	) {
		await this.assignExpensesToEventUseCase.execute(
			c.get('space'),
			eventId,
			expenseIds,
		);

		return c.body(null, 204);
	}
}
