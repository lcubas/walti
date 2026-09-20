import type { Context } from 'hono';
import type { SpaceIdParam } from '@walti/shared';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { UnarchiveSpaceUseCase } from '../useCases/unarchiveSpaceUseCase';

export class PostUnarchiveSpaceController {
	constructor(private readonly unarchiveSpaceUseCase: UnarchiveSpaceUseCase) {}

	async handle(c: Context<RequestContext>, { spaceId }: SpaceIdParam) {
		await this.unarchiveSpaceUseCase.execute(spaceId, c.get('userId'));

		return c.body(null, 204);
	}
}
