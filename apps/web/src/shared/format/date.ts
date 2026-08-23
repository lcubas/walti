const dayMonthYear = new Intl.DateTimeFormat('es-PE', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});
const monthYear = new Intl.DateTimeFormat('es-PE', {
	month: 'long',
	year: 'numeric',
});

/** Civil dates carry no timezone, so they are built in local time to avoid shifting a day. */
const toLocalDate = (civilDate: string) => {
	const [year, month, day] = civilDate.split('-').map(Number);
	return new Date(year, month - 1, day);
};

export const formatCivilDate = (civilDate: string) =>
	dayMonthYear.format(toLocalDate(civilDate));

export const formatMonthPeriod = (period: string) =>
	monthYear.format(toLocalDate(`${period}-01`));
