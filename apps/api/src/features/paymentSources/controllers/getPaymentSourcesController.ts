import type { Context } from 'hono';
import { ok } from '../../../shared/http/response';
import type { SessionContext } from '../../../shared/http/requestContext';
import type { ListPaymentSourcesUseCase } from '../useCases/listPaymentSourcesUseCase';

export class GetPaymentSourcesController {
	constructor(
		private readonly listPaymentSourcesUseCase: ListPaymentSourcesUseCase,
	) {}

	async handle(c: Context<SessionContext>) {
		const paymentSources = await this.listPaymentSourcesUseCase.execute(
			c.get('userId'),
		);

		return ok(c, paymentSources);
	}
}
