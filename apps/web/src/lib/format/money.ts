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

/** Keeps only what a money amount can contain while typing: digits, and at
 * most one decimal separator (either "." or ",", whichever comes first)
 * followed by at most two digits. Applied on every change, so pasting or
 * autofilling garbage is stripped the same as typing it would be. */
export const sanitizeAmountInput = (raw: string): string => {
	let sawSeparator = false;
	let decimalDigits = 0;
	let result = '';

	for (const char of raw) {
		if (char >= '0' && char <= '9') {
			if (sawSeparator) {
				if (decimalDigits >= 2) {
					continue;
				}
				decimalDigits += 1;
			}
			result += char;
			continue;
		}

		if ((char === '.' || char === ',') && !sawSeparator) {
			sawSeparator = true;
			result += char;
		}
	}

	return result;
};

/** The inverse of parseMoneyInput: cents back into the plain string the
 * amount input expects, to pre-fill it when editing an existing expense. */
export const centsToAmountInput = (amountCents: number): string => {
	const value = amountCents / 100;
	return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

export const parseMoneyInput = (raw: string): number | null => {
	const normalized = raw.trim().replace(',', '.');

	if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
		return null;
	}

	const cents = Math.round(Number.parseFloat(normalized) * 100);

	return cents > 0 ? cents : null;
};
