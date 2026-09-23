import type { Context } from 'hono';
import type { AssociateExpensesRequest, EventIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { UnassignExpensesFromEventUseCase } from '../useCases/unassignExpensesFromEventUseCase';

export class DeleteEventExpensesController {
	constructor(
		private readonly unassignExpensesFromEventUseCase: UnassignExpensesFromEventUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ eventId }: EventIdParam,
		{ expenseIds }: AssociateExpensesRequest,
	) {
		await this.unassignExpensesFromEventUseCase.execute(
			c.get('space'),
			eventId,
			expenseIds,
		);

		return c.body(null, 204);
	}
}
