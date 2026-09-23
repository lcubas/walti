import { BadRequestError } from '../../../shared/errors/badRequestError';

export class EventService {
	/**
	 * Confirms the end date does not precede the start date
	 *
	 * @throws {BadRequestError} If `endsOn` comes before `startsOn`.
	 */
	verifyDateRange(startsOn: string, endsOn: string): void {
		if (endsOn < startsOn) {
			throw new BadRequestError(
				'event_date_range_invalid',
				'La fecha de fin no puede ser anterior a la de inicio.',
			);
		}
	}
}
