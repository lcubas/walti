import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { RecurringItemRepository } from '../../../shared/repositories/recurringItemRepository';

export class SetRecurringItemArchivedUseCase {
	constructor(
		private readonly recurringItemRepository: RecurringItemRepository,
	) {}

	async execute(
		space: SpaceAccess,
		recurringItemId: string,
		archived: boolean,
	): Promise<void> {
		const item = await this.recurringItemRepository.findForSpace(
			space.id,
			recurringItemId,
		);

		if (!item) {
			throw new NotFoundError(
				'recurring_item_not_found',
				'Ese recurrente no existe en este espacio.',
			);
		}

		await this.recurringItemRepository.setArchivedAt(
			recurringItemId,
			archived ? new Date().toISOString() : null,
		);
	}
}
