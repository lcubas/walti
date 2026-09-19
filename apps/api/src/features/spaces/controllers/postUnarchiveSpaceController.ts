import type { Context } from 'hono';
import type { SpaceIdParam } from '@walti/shared';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { SpaceService } from '../services/spaceService';

export class PostUnarchiveSpaceController {
	constructor(private readonly spaceService: SpaceService) {}

	async handle(c: Context<RequestContext>, { spaceId }: SpaceIdParam) {
		await this.spaceService.unarchiveSpace(spaceId, c.get('userId'));

		return c.body(null, 204);
	}
}
