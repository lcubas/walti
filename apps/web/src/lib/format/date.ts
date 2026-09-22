const dayMonthYear = new Intl.DateTimeFormat('es-PE', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});
const monthYear = new Intl.DateTimeFormat('es-PE', {
	month: 'long',
	year: 'numeric',
});

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

/** Today, as a civil date in local time — the day it is for the person, not an instant. */
export const todayCivilDate = () => dateToCivilDate(new Date());

/** A civil date shifted by whole days (negative goes back), still in local time. */
export const civilDateAddDays = (civilDate: string, days: number) => {
	const date = civilDateToDate(civilDate);
	date.setDate(date.getDate() + days);
	return dateToCivilDate(date);
};
