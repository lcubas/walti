const dayMonthYear = new Intl.DateTimeFormat('es-PE', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});
const monthYear = new Intl.DateTimeFormat('es-PE', {
	month: 'long',
	year: 'numeric',
});
const monthShort = new Intl.DateTimeFormat('es-PE', { month: 'short' });

export const civilDateToDate = (civilDate: string) => {
	const [year, month, day] = civilDate.split('-').map(Number);
	return new Date(year, month - 1, day);
};

export const dateToCivilDate = (date: Date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const formatCivilDate = (civilDate: string) =>
	dayMonthYear.format(civilDateToDate(civilDate));

export const formatMonthPeriod = (period: string) =>
	monthYear.format(civilDateToDate(`${period}-01`));

/** Short month name ("ene", "feb", ...) for a 1-12 month number. */
export const formatMonthShort = (month: number) =>
	monthShort.format(new Date(2000, month - 1, 1));

/** Today, as a civil date in local time — the day it is for the person, not an instant. */
export const todayCivilDate = () => dateToCivilDate(new Date());

/** A civil date shifted by whole days (negative goes back), still in local time. */
export const civilDateAddDays = (civilDate: string, days: number) => {
	const date = civilDateToDate(civilDate);
	date.setDate(date.getDate() + days);
	return dateToCivilDate(date);
};

/** The month the person is in right now, as "YYYY-MM" in local time. */
export const currentPeriod = () => todayCivilDate().slice(0, 7);

/** A month period shifted by whole months (negative goes back). */
export const periodAddMonths = (period: string, months: number) => {
	const [year, month] = period.split('-').map(Number);
	const date = new Date(year, month - 1 + months, 1);
	const shiftedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
	return `${date.getFullYear()}-${shiftedMonth}`;
};

/** Builds a "YYYY-MM" period from year and month (1-12) parts. */
export const periodOf = (year: number, month: number) =>
	`${year}-${month.toString().padStart(2, '0')}`;
