import type { PaymentSource } from '@walti/shared';

export interface PaymentSourceRepository {
	/**
	 * The payment sources of a user, archived ones included, oldest first.
	 *
	 * @param userId - User whose payment sources are read.
	 * @returns One entry per payment source, empty when the user has none.
	 */
	listForUser(userId: string): Promise<PaymentSource[]>;

	/**
	 * Adds a payment source to a user.
	 *
	 * @param userId - User who owns it.
	 * @param name - Name of the payment source.
	 * @returns The payment source as persisted.
	 */
	create(userId: string, name: string): Promise<PaymentSource>;

	/**
	 * Changes the name of a payment source.
	 *
	 * @param paymentSourceId - Payment source to rename.
	 * @param name - New name.
	 */
	rename(paymentSourceId: string, name: string): Promise<void>;

	/**
	 * Sets or clears the instant at which a payment source was archived.
	 *
	 * @param paymentSourceId - Payment source to change.
	 * @param archivedAt - UTC instant, or `null` to bring it back.
	 */
	setArchivedAt(
		paymentSourceId: string,
		archivedAt: string | null,
	): Promise<void>;
}
