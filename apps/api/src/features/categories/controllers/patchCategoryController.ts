import type { Context } from 'hono';
import type { CategoryIdParam, UpdateCategoryRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import type { UpdateCategoryUseCase } from '../useCases/updateCategoryUseCase';

export class PatchCategoryController {
	constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {}

	async handle(
		c: Context<SpaceContext>,
		{ categoryId }: CategoryIdParam,
		changes: UpdateCategoryRequest,
	) {
		await this.updateCategoryUseCase.execute(
			c.get('space'),
			categoryId,
			changes,
		);

		return c.body(null, 204);
	}
}
