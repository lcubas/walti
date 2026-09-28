import type { Context } from 'hono';
import type { CreateRecurringItemRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { created } from '../../../shared/http/response';
import type { CreateRecurringItemUseCase } from '../useCases/createRecurringItemUseCase';

export class PostRecurringItemController {
	constructor(
		private readonly createRecurringItemUseCase: CreateRecurringItemUseCase,
	) {}

	async handle(c: Context<SpaceContext>, input: CreateRecurringItemRequest) {
		const item = await this.createRecurringItemUseCase.execute(
			c.get('space'),
			input,
		);

		return created(c, item);
	}
}
