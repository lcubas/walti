import type { Context } from 'hono';
import type { CreateCategoryRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { created } from '../../../shared/http/response';
import type { CreateCategoryUseCase } from '../useCases/createCategoryUseCase';

export class PostCategoryController {
	constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

	async handle(c: Context<SpaceContext>, input: CreateCategoryRequest) {
		const category = await this.createCategoryUseCase.execute(
			c.get('space'),
			input,
		);

		return created(c, category);
	}
}
