import type { Context } from 'hono';
import type { RequestContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { ListCategoriesUseCase } from '../useCases/listCategoriesUseCase';

export class GetCategoriesController {
	constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

	async handle(c: Context<RequestContext>) {
		const categories = await this.listCategoriesUseCase.execute(
			c.get('spaceId'),
		);

		return ok(c, categories);
	}
}
