import type { Context } from 'hono';
import type { PauseRequest, RecurringItemIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { SetRecurringItemPausedUseCase } from '../useCases/setRecurringItemPausedUseCase';

export class PatchRecurringItemPauseController {
	constructor(
		private readonly setRecurringItemPausedUseCase: SetRecurringItemPausedUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ recurringItemId }: RecurringItemIdParam,
		{ paused }: PauseRequest,
	) {
		await this.setRecurringItemPausedUseCase.execute(
			c.get('space'),
			recurringItemId,
			paused,
		);

		return c.body(null, 204);
	}
}
