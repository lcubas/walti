import type { Context } from 'hono';
import type { RequestContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { GetSessionUseCase } from '../useCases/getSessionUseCase';

export class GetSessionController {
	constructor(private readonly getSessionUseCase: GetSessionUseCase) {}

	async handle(c: Context<RequestContext>) {
		const user = await this.getSessionUseCase.execute(c.get('userId'));

		return ok(c, user);
	}
}
