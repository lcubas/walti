import type { Context } from 'hono';
import type { ArchiveRequest, RecurringItemIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { SetRecurringItemArchivedUseCase } from '../useCases/setRecurringItemArchivedUseCase';

export class PatchRecurringItemArchiveController {
	constructor(
		private readonly setRecurringItemArchivedUseCase: SetRecurringItemArchivedUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ recurringItemId }: RecurringItemIdParam,
		{ archived }: ArchiveRequest,
	) {
		await this.setRecurringItemArchivedUseCase.execute(
			c.get('space'),
			recurringItemId,
			archived,
		);

		return c.body(null, 204);
	}
}
