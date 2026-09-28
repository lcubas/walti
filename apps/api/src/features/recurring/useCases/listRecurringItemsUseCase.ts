import type { RecurringItemList } from '@walti/shared';
import type { RecurringItemRepository } from '../../../shared/repositories/recurringItemRepository';

export class ListRecurringItemsUseCase {
	constructor(
		private readonly recurringItemRepository: RecurringItemRepository,
	) {}

	execute(spaceId: string): Promise<RecurringItemList> {
		return this.recurringItemRepository.listForSpace(spaceId);
	}
}
