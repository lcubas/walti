import type { Context } from 'hono';
import type { CreateSpaceRequest } from '@walti/shared';
import { created } from '../../../shared/http/response';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { SpaceService } from '../services/spaceService';

export class PostSpaceController {
	constructor(private readonly spaceService: SpaceService) {}

	async handle(c: Context<RequestContext>, { name }: CreateSpaceRequest) {
		const space = await this.spaceService.createSpace(c.get('userId'), name);

		return created(c, space);
	}
}
