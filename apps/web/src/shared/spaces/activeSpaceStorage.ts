const storageKey = 'walti.activeSpace';

/**
 * Which space to open when nothing else says. It is the only thing about the
 * active space that outlives the tab, and it is deliberately a hint and not a
 * source of truth: the list from the API decides whether it is still valid.
 *
 * Every access is guarded because storage is not always there — Safari in
 * private browsing throws on write, and a browser can have it disabled
 * altogether. Losing the hint is not a reason to break the app.
 */
export const readActiveSpaceId = (): string | null => {
	try {
		return localStorage.getItem(storageKey);
	} catch {
		return null;
	}
};

export const writeActiveSpaceId = (spaceId: string): void => {
	try {
		localStorage.setItem(storageKey, spaceId);
	} catch {
		// Nothing to do: the user simply starts on their first space next time.
	}
};
