import type { CategoryGroupList, Event, PaymentSource } from '@walti/shared';
import { ConflictError } from '../../../shared/errors/conflictError';
import { NotFoundError } from '../../../shared/errors/notFoundError';

export class ExpenseService {
	/**
	 * Confirms a category belongs to the space and can still receive expenses.
	 *
	 * @param groups - The space's categories, as read by `CategoryRepository.listForSpace`.
	 * @param categoryId - Category the expense points at.
	 * @throws {NotFoundError} If no such category exists in this space.
	 * @throws {ConflictError} If the category or its group is archived.
	 */
	requireActiveCategory(groups: CategoryGroupList, categoryId: string): void {
		for (const group of groups) {
			const category = group.categories.find(
				(candidate) => candidate.id === categoryId,
			);

			if (!category) {
				continue;
			}

			if (group.archivedAt || category.archivedAt) {
				throw new ConflictError(
					'category_archived',
					'Esa categoría está archivada. Elige otra o recupérala antes de usarla.',
				);
			}

			return;
		}

		throw new NotFoundError(
			'category_not_found',
			'Esa categoría no existe en este espacio.',
		);
	}

	/**
	 * Confirms a payment source can still be picked for a new expense.
	 *
	 * @param source - The payment source, already resolved as the user's own.
	 * @throws {ConflictError} If the payment source is archived.
	 */
	requireActivePaymentSource(source: PaymentSource): void {
		if (source.archivedAt) {
			throw new ConflictError(
				'payment_source_archived',
				'Esa fuente de pago está archivada. Elige otra o recupérala antes de usarla.',
			);
		}
	}

	/**
	 * Confirms an event can still receive a new link to an expense.
	 *
	 * @param event - The event, already scoped to the space.
	 * @throws {NotFoundError} If `event` is null (it doesn't exist in this space).
	 * @throws {ConflictError} If the event is archived.
	 */
	requireActiveEvent(event: Event | null): void {
		if (!event) {
			throw new NotFoundError(
				'event_not_found',
				'Ese evento no existe en este espacio.',
			);
		}

		if (event.archivedAt) {
			throw new ConflictError(
				'event_archived',
				'Ese evento está archivado. Elige otro o recupéralo antes de usarlo.',
			);
		}
	}
}
