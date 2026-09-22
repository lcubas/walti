import type { Context } from 'hono';
import type {
	PaymentSourceIdParam,
	RenamePaymentSourceRequest,
} from '@walti/shared';
import type { SessionContext } from '../../../shared/http/requestContext';
import type { RenamePaymentSourceUseCase } from '../useCases/renamePaymentSourceUseCase';

export class PatchPaymentSourceController {
	constructor(
		private readonly renamePaymentSourceUseCase: RenamePaymentSourceUseCase,
	) {}

	async handle(
		c: Context<SessionContext>,
		{ paymentSourceId }: PaymentSourceIdParam,
		{ name }: RenamePaymentSourceRequest,
	) {
		await this.renamePaymentSourceUseCase.execute(
			c.get('userId'),
			paymentSourceId,
			name,
		);

		return c.body(null, 204);
	}
}
