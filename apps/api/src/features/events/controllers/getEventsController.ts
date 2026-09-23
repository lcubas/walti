import type { Context } from 'hono';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListEventsUseCase } from '../useCases/listEventsUseCase';

export class GetEventsController {
	constructor(private readonly listEventsUseCase: ListEventsUseCase) {}

	async handle(c: Context<SpaceContext>) {
		const events = await this.listEventsUseCase.execute(c.get('space').id);

		return ok(c, events);
	}
}
