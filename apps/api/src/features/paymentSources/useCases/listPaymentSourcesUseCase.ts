import type { PaymentSource } from '@walti/shared';
import type { PaymentSourceRepository } from '../../../shared/repositories/paymentSourceRepository';

export class ListPaymentSourcesUseCase {
	constructor(
		private readonly paymentSourceRepository: PaymentSourceRepository,
	) {}

	execute(userId: string): Promise<PaymentSource[]> {
		return this.paymentSourceRepository.listForUser(userId);
	}
}
