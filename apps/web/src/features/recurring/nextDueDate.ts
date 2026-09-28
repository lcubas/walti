import type { RecurringItem } from '@walti/shared';
import { dateToCivilDate } from '@/lib/format/date';

const lastDayOfMonth = (year: number, month: number) =>
	// Day 0 of the following month is the last day of this one. `month` can
	// run past 11 (or below 0) on purpose — `Date` normalizes the overflow
	// into the right year, which is exactly the rollover this needs.
	new Date(year, month + 1, 0).getDate();

const dateOnAnchor = (year: number, month: number, anchorDay: number): Date =>
	new Date(year, month, Math.min(anchorDay, lastDayOfMonth(year, month)));

const startOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const nextDueDate = (
	item: Pick<RecurringItem, 'frequency' | 'anchorDay' | 'anchorMonth'>,
	today: Date,
): string => {
	const year = today.getFullYear();
	const from = startOfDay(today);

	if (item.frequency === 'monthly') {
		const thisMonth = dateOnAnchor(year, today.getMonth(), item.anchorDay);

		return dateToCivilDate(
			thisMonth >= from
				? thisMonth
				: dateOnAnchor(year, today.getMonth() + 1, item.anchorDay),
		);
	}

	// Yearly: anchorMonth is 1-12, Date wants a 0-11 index.
	const month = (item.anchorMonth ?? 1) - 1;
	const thisYear = dateOnAnchor(year, month, item.anchorDay);

	return dateToCivilDate(
		thisYear >= from ? thisYear : dateOnAnchor(year + 1, month, item.anchorDay),
	);
};
