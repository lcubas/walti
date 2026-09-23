import type { Context } from 'hono';
import type { EventIdParam, UpdateEventRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { UpdateEventUseCase } from '../useCases/updateEventUseCase';

export class PatchEventController {
	constructor(private readonly updateEventUseCase: UpdateEventUseCase) {}

	async handle(
		c: Context<SpaceContext>,
		{ eventId }: EventIdParam,
		changes: UpdateEventRequest,
	) {
		await this.updateEventUseCase.execute(c.get('space'), eventId, changes);

		return c.body(null, 204);
	}
}
