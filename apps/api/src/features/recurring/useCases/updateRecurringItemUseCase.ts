import type { UpdateRecurringItemRequest } from '@walti/shared';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { RecurringItemRepository } from '../../../shared/repositories/recurringItemRepository';
import type { ExpenseService } from '../../expenses/services/expenseService';
import type { RecurringItemService } from '../services/recurringItemService';

export class UpdateRecurringItemUseCase {
	constructor(
		private readonly recurringItemRepository: RecurringItemRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly expenseService: ExpenseService,
		private readonly recurringItemService: RecurringItemService,
	) {}

	async execute(
		space: SpaceAccess,
		recurringItemId: string,
		changes: UpdateRecurringItemRequest,
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

		if (changes.categoryId) {
			const groups = await this.categoryRepository.listForSpace(space.id);
			this.expenseService.requireActiveCategory(groups, changes.categoryId);
		}

		// Merge onto the current values: a patch that only touches one of the
		// two fields still has to respect their pairing against whichever one
		// didn't change — same reasoning as an event's date range.
		this.recurringItemService.verifyAnchor(
			changes.frequency ?? item.frequency,
			changes.anchorMonth !== undefined
				? changes.anchorMonth
				: item.anchorMonth,
		);

		await this.recurringItemRepository.update(recurringItemId, changes);
	}
}
