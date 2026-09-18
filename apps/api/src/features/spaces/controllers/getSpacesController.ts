import type { Context } from 'hono';
import { ok } from '../../../shared/http/response';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { SpaceService } from '../services/spaceService';

export class GetSpacesController {
	constructor(private readonly spaceService: SpaceService) {}

	async handle(c: Context<RequestContext>) {
		const spaces = await this.spaceService.listSpaces(c.get('userId'));

		return ok(c, spaces);
	}
}
