import type { Context } from 'hono';
import type { RenameSpaceRequest, SpaceIdParam } from '@walti/shared';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { RenameSpaceUseCase } from '../useCases/renameSpaceUseCase';

export class PatchSpaceController {
	constructor(private readonly renameSpaceUseCase: RenameSpaceUseCase) {}

	async handle(
		c: Context<RequestContext>,
		{ spaceId }: SpaceIdParam,
		{ name }: RenameSpaceRequest,
	) {
		await this.renameSpaceUseCase.execute(spaceId, c.get('userId'), name);

		return c.body(null, 204);
	}
}
