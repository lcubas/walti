import type { PaymentSourceRepository } from '../../../shared/repositories/paymentSourceRepository';
import type { PaymentSourceService } from '../services/paymentSourceService';

export class RenamePaymentSourceUseCase {
	constructor(
		private readonly paymentSourceRepository: PaymentSourceRepository,
		private readonly paymentSourceService: PaymentSourceService,
	) {}

	async execute(
		userId: string,
		paymentSourceId: string,
		name: string,
	): Promise<void> {
		const sources = await this.paymentSourceRepository.listForUser(userId);

		this.paymentSourceService.requirePaymentSource(sources, paymentSourceId);
		this.paymentSourceService.verifyFreeName(sources, name, paymentSourceId);

		await this.paymentSourceRepository.rename(paymentSourceId, name);
	}
}
