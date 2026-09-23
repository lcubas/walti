import type { Context } from 'hono';
import type { EventIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListEventExpenseCandidatesUseCase } from '../useCases/listEventExpenseCandidatesUseCase';

export class GetEventExpenseCandidatesController {
	constructor(
		private readonly listEventExpenseCandidatesUseCase: ListEventExpenseCandidatesUseCase,
	) {}

	async handle(c: Context<SpaceContext>, { eventId }: EventIdParam) {
		const expenses = await this.listEventExpenseCandidatesUseCase.execute(
			c.get('space'),
			eventId,
		);

		return ok(c, expenses);
	}
}
