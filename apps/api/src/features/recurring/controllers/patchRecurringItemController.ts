import type { Context } from 'hono';
import type {
	RecurringItemIdParam,
	UpdateRecurringItemRequest,
} from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { UpdateRecurringItemUseCase } from '../useCases/updateRecurringItemUseCase';

export class PatchRecurringItemController {
	constructor(
		private readonly updateRecurringItemUseCase: UpdateRecurringItemUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ recurringItemId }: RecurringItemIdParam,
		changes: UpdateRecurringItemRequest,
	) {
		await this.updateRecurringItemUseCase.execute(
			c.get('space'),
			recurringItemId,
			changes,
		);

		return c.body(null, 204);
	}
}
