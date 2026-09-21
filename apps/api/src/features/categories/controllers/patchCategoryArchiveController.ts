import type { Context } from 'hono';
import type { ArchiveRequest, CategoryIdParam } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { SetCategoryArchivedUseCase } from '../useCases/setCategoryArchivedUseCase';

export class PatchCategoryArchiveController {
	constructor(
		private readonly setCategoryArchivedUseCase: SetCategoryArchivedUseCase,
	) {}

	async handle(
		c: Context<SpaceContext>,
		{ categoryId }: CategoryIdParam,
		{ archived }: ArchiveRequest,
	) {
		await this.setCategoryArchivedUseCase.execute(
			c.get('space'),
			categoryId,
			archived,
		);

		return c.body(null, 204);
	}
}
