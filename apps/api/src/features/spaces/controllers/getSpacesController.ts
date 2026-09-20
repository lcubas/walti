import type { Context } from 'hono';
import { ok } from '../../../shared/http/response';
import type { RequestContext } from '../../../shared/http/requestContext';
import type { ListSpacesUseCase } from '../useCases/listSpacesUseCase';

export class GetSpacesController {
	constructor(private readonly listSpacesUseCase: ListSpacesUseCase) {}

	async handle(c: Context<RequestContext>) {
		const spaces = await this.listSpacesUseCase.execute(c.get('userId'));

		return ok(c, spaces);
	}
}
