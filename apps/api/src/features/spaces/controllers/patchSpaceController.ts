import type { Context } from 'hono';
import type { RenameSpaceRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { RenameSpaceUseCase } from '../useCases/renameSpaceUseCase';

export class PatchSpaceController {
	constructor(private readonly renameSpaceUseCase: RenameSpaceUseCase) {}

	async handle(c: Context<SpaceContext>, { name }: RenameSpaceRequest) {
		await this.renameSpaceUseCase.execute(c.get('space'), name);

		return c.body(null, 204);
	}
}
