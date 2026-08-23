export type ThemePreference = 'light' | 'dark' | 'system';

const storageKey = 'walti.theme';

const isPreference = (value: string | null): value is ThemePreference =>
	value === 'light' || value === 'dark' || value === 'system';

const prefersDark = () =>
	window.matchMedia('(prefers-color-scheme: dark)').matches;

const paint = (preference: ThemePreference) => {
	const dark =
		preference === 'dark' || (preference === 'system' && prefersDark());
	document.documentElement.classList.toggle('dark', dark);
};

export const readThemePreference = (): ThemePreference => {
	const stored = localStorage.getItem(storageKey);
	return isPreference(stored) ? stored : 'system';
};

export const setThemePreference = (preference: ThemePreference) => {
	localStorage.setItem(storageKey, preference);
	paint(preference);
};

/** Keeps the document in sync while the preference is 'system'. */
export const watchSystemTheme = () => {
	const query = window.matchMedia('(prefers-color-scheme: dark)');

	const onChange = () => {
		if (readThemePreference() === 'system') {
			paint('system');
		}
	};

	query.addEventListener('change', onChange);

	return () => query.removeEventListener('change', onChange);
};
