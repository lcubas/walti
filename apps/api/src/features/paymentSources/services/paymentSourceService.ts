import type { PaymentSource } from '@walti/shared';
import { ConflictError } from '../../../shared/errors/conflictError';
import { NotFoundError } from '../../../shared/errors/notFoundError';

export class PaymentSourceService {
	private sameName(left: string, right: string): boolean {
		return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
	}

	requirePaymentSource(
		sources: PaymentSource[],
		paymentSourceId: string,
	): PaymentSource {
		const source = sources.find(
			(candidate) => candidate.id === paymentSourceId,
		);

		if (!source) {
			throw new NotFoundError(
				'payment_source_not_found',
				'Esa fuente de pago no existe o no es tuya.',
			);
		}

		return source;
	}

	verifyFreeName(
		sources: PaymentSource[],
		name: string,
		exceptId?: string,
	): void {
		const taken = sources.some(
			(source) => source.id !== exceptId && this.sameName(source.name, name),
		);

		if (taken) {
			throw new ConflictError(
				'payment_source_name_taken',
				'Ya tienes una fuente de pago con ese nombre.',
			);
		}
	}
}
