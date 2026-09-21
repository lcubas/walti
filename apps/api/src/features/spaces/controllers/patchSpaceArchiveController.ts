import type { Context } from 'hono';
import type { ArchiveRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { SetSpaceArchivedUseCase } from '../useCases/setSpaceArchivedUseCase';

export class PatchSpaceArchiveController {
	constructor(
		private readonly setSpaceArchivedUseCase: SetSpaceArchivedUseCase,
	) {}

	async handle(c: Context<SpaceContext>, { archived }: ArchiveRequest) {
		await this.setSpaceArchivedUseCase.execute(
			c.get('space'),
			c.get('userId'),
			archived,
		);

		return c.body(null, 204);
	}
}
