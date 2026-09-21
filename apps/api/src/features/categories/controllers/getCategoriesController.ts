import type { Context } from 'hono';
import type { SpaceContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListCategoriesUseCase } from '../useCases/listCategoriesUseCase';

export class GetCategoriesController {
	constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

	async handle(c: Context<SpaceContext>) {
		const groups = await this.listCategoriesUseCase.execute(c.get('space').id);

		return ok(c, groups);
	}
}
