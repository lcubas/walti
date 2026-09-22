import type { PaymentSourceRepository } from '../../../shared/repositories/paymentSourceRepository';
import type { PaymentSourceService } from '../services/paymentSourceService';

export class SetPaymentSourceArchivedUseCase {
	constructor(
		private readonly paymentSourceRepository: PaymentSourceRepository,
		private readonly paymentSourceService: PaymentSourceService,
	) {}

	async execute(
		userId: string,
		paymentSourceId: string,
		archived: boolean,
	): Promise<void> {
		const sources = await this.paymentSourceRepository.listForUser(userId);

		this.paymentSourceService.requirePaymentSource(sources, paymentSourceId);

		await this.paymentSourceRepository.setArchivedAt(
			paymentSourceId,
			archived ? new Date().toISOString() : null,
		);
	}
}
