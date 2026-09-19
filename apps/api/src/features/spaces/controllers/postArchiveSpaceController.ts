import type { Context } from 'hono';
import type { SpaceIdParam } from '@walti/shared';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { SpaceService } from '../services/spaceService';

export class PostArchiveSpaceController {
	constructor(private readonly spaceService: SpaceService) {}

	async handle(c: Context<RequestContext>, { spaceId }: SpaceIdParam) {
		await this.spaceService.archiveSpace(spaceId, c.get('userId'));

		return c.body(null, 204);
	}
}
