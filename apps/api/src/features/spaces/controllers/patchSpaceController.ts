import type { Context } from 'hono';
import type { RenameSpaceRequest, SpaceIdParam } from '@walti/shared';
import { ok } from '../../../shared/http/response';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { SpaceService } from '../services/spaceService';

export class PatchSpaceController {
	constructor(private readonly spaceService: SpaceService) {}

	async handle(
		c: Context<RequestContext>,
		{ spaceId }: SpaceIdParam,
		{ name }: RenameSpaceRequest,
	) {
		const space = await this.spaceService.renameSpace(
			spaceId,
			c.get('userId'),
			name,
		);

		return ok(c, space);
	}
}
