import type { Context } from 'hono';
import type { SpaceIdParam } from '@walti/shared';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { ArchiveSpaceUseCase } from '../useCases/archiveSpaceUseCase';

export class PostArchiveSpaceController {
	constructor(private readonly archiveSpaceUseCase: ArchiveSpaceUseCase) {}

	async handle(c: Context<RequestContext>, { spaceId }: SpaceIdParam) {
		await this.archiveSpaceUseCase.execute(spaceId, c.get('userId'));

		return c.body(null, 204);
	}
}
