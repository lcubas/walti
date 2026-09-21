import type { Context } from 'hono';
import type {
	CategoryGroupIdParam,
	RenameCategoryGroupRequest,
} from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { RenameCategoryGroupUseCase } from '../useCases/renameCategoryGroupUseCase';

export class PatchCategoryGroupController {
	constructor(
		private readonly renameCategoryGroupUseCase: RenameCategoryGroupUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ groupId }: CategoryGroupIdParam,
		{ name }: RenameCategoryGroupRequest,
	) {
		await this.renameCategoryGroupUseCase.execute(
			c.get('space'),
			groupId,
			name,
		);

		return c.body(null, 204);
	}
}
