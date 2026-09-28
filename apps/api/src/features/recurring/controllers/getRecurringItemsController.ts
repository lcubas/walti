import type { Context } from 'hono';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListRecurringItemsUseCase } from '../useCases/listRecurringItemsUseCase';

export class GetRecurringItemsController {
	constructor(
		private readonly listRecurringItemsUseCase: ListRecurringItemsUseCase,
	) {}

	async handle(c: Context<SpaceContext>) {
		const items = await this.listRecurringItemsUseCase.execute(
			c.get('space').id,
		);

		return ok(c, items);
	}
}
