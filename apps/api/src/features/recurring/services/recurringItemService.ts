import type { RecurringFrequency } from '@walti/shared';
import { BadRequestError } from '../../../shared/errors/badRequestError';

export class RecurringItemService {
	/**
	 * Confirms a recurrent's month matches its frequency: required for
	 * `'yearly'`, absent for `'monthly'` — the same pair the DB check
	 * constraint enforces. Needed because a patch can touch only one of the
	 * two fields, so `UpdateRecurringItemRequest` can't validate this by
	 * itself the way `CreateRecurringItemRequest` does.
	 *
	 * @throws {BadRequestError} If a yearly recurrent has no month, or a
	 * monthly one has one.
	 */
	verifyAnchor(frequency: RecurringFrequency, anchorMonth: number | null): void {
		if (frequency === 'yearly' && anchorMonth === null) {
			throw new BadRequestError(
				'recurring_item_anchor_month_required',
				'Un recurrente anual necesita un mes.',
			);
		}

		if (frequency === 'monthly' && anchorMonth !== null) {
			throw new BadRequestError(
				'recurring_item_anchor_month_not_allowed',
				'Un recurrente mensual no lleva mes.',
			);
		}
	}
}
