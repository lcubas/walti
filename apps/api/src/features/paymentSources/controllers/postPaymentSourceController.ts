import type { Context } from 'hono';
import type { CreatePaymentSourceRequest } from '@walti/shared';
import { created } from '../../../shared/http/response';
import type { SessionContext } from '../../../shared/http/requestContext';
import type { CreatePaymentSourceUseCase } from '../useCases/createPaymentSourceUseCase';

export class PostPaymentSourceController {
	constructor(
		private readonly createPaymentSourceUseCase: CreatePaymentSourceUseCase,
	) {}

	async handle(
		c: Context<SessionContext>,
		{ name }: CreatePaymentSourceRequest,
	) {
		const paymentSource = await this.createPaymentSourceUseCase.execute(
			c.get('userId'),
			name,
		);

		return created(c, paymentSource);
	}
}
