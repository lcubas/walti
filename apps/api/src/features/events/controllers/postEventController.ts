import type { Context } from 'hono';
import type { CreateEventRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { created } from '../../../shared/http/response';
import type { CreateEventUseCase } from '../useCases/createEventUseCase';

export class PostEventController {
	constructor(private readonly createEventUseCase: CreateEventUseCase) {}

	async handle(c: Context<SpaceContext>, input: CreateEventRequest) {
		const event = await this.createEventUseCase.execute(c.get('space'), input);

		return created(c, event);
	}
}
