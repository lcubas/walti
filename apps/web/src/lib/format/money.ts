import type { Currency } from '@walti/shared';

const locales: Record<Currency, string> = { PEN: 'es-PE', USD: 'en-US' };

const formatters = new Map<Currency, Intl.NumberFormat>();

const formatterFor = (currency: Currency) => {
	const cached = formatters.get(currency);

	if (cached) {
		return cached;
	}

	const formatter = new Intl.NumberFormat(locales[currency], {
		style: 'currency',
		currency,
	});
	formatters.set(currency, formatter);

	return formatter;
};

export const formatMoney = (amountCents: number, currency: Currency) =>
	formatterFor(currency).format(amountCents / 100);
