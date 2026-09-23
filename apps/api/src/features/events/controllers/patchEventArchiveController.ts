import type { Context } from 'hono';
import type { ArchiveRequest, EventIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { SetEventArchivedUseCase } from '../useCases/setEventArchivedUseCase';

export class PatchEventArchiveController {
	constructor(
		private readonly setEventArchivedUseCase: SetEventArchivedUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ eventId }: EventIdParam,
		{ archived }: ArchiveRequest,
	) {
		await this.setEventArchivedUseCase.execute(
			c.get('space'),
			eventId,
			archived,
		);

		return c.body(null, 204);
	}
}
