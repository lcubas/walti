import type { CreateRecurringItemRequest, RecurringItem } from '@walti/shared';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { CategoryRepository } from '../../../shared/repositories/categoryRepository';
import type { RecurringItemRepository } from '../../../shared/repositories/recurringItemRepository';
import type { ExpenseService } from '../../expenses/services/expenseService';

export class CreateRecurringItemUseCase {
	constructor(
		private readonly recurringItemRepository: RecurringItemRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly expenseService: ExpenseService,
	) {}

	async execute(
		space: SpaceAccess,
		input: CreateRecurringItemRequest,
	): Promise<RecurringItem> {
		const groups = await this.categoryRepository.listForSpace(space.id);

		// Reused as-is: a recurrent needs exactly the same category guarantee
		// an expense does (exists in this space, not archived).
		this.expenseService.requireActiveCategory(groups, input.categoryId);

		// anchorMonth/frequency consistency is already checked at the schema
		// level here (CreateRecurringItemRequest), same as an event's date range.
		return this.recurringItemRepository.create(space.id, input);
	}
}
