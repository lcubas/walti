import type { Context } from 'hono';
import type { ArchiveRequest, PaymentSourceIdParam } from '@walti/shared';
import type { SessionContext } from '../../../shared/http/requestContext';
import type { SetPaymentSourceArchivedUseCase } from '../useCases/setPaymentSourceArchivedUseCase';

export class PatchPaymentSourceArchiveController {
	constructor(
		private readonly setPaymentSourceArchivedUseCase: SetPaymentSourceArchivedUseCase,
	) {}

	async handle(
		c: Context<SessionContext>,
		{ paymentSourceId }: PaymentSourceIdParam,
		{ archived }: ArchiveRequest,
	) {
		await this.setPaymentSourceArchivedUseCase.execute(
			c.get('userId'),
			paymentSourceId,
			archived,
		);

		return c.body(null, 204);
	}
}
