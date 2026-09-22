import type { PaymentSource } from '@walti/shared';
import type { PaymentSourceRepository } from '../../../shared/repositories/paymentSourceRepository';
import type { PaymentSourceService } from '../services/paymentSourceService';

export class CreatePaymentSourceUseCase {
	constructor(
		private readonly paymentSourceRepository: PaymentSourceRepository,
		private readonly paymentSourceService: PaymentSourceService,
	) {}

	async execute(userId: string, name: string): Promise<PaymentSource> {
		const sources = await this.paymentSourceRepository.listForUser(userId);

		this.paymentSourceService.verifyFreeName(sources, name);

		return this.paymentSourceRepository.create(userId, name);
	}
}
