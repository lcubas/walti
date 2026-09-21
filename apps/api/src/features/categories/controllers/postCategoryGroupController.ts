import type { Context } from 'hono';
import type { CreateCategoryGroupRequest } from '@walti/shared';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { created } from '../../../shared/http/response';
import type { CreateCategoryGroupUseCase } from '../useCases/createCategoryGroupUseCase';

export class PostCategoryGroupController {
	constructor(
		private readonly createCategoryGroupUseCase: CreateCategoryGroupUseCase,
	) {}

	async handle(c: Context<SpaceContext>, { name }: CreateCategoryGroupRequest) {
		const group = await this.createCategoryGroupUseCase.execute(
			c.get('space'),
			name,
		);

		return created(c, group);
	}
}
