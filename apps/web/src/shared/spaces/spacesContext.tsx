import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { type Space, spacesQuery } from '@/shared/spaces/spacesApi';

type SpacesValue = {
	/** Only the ones still in use: an archived space is out of every selector. */
	spaces: Space[];
	/** Undefined only while the list is on its way. Everyone has at least one. */
	activeSpace: Space | undefined;
	selectSpace: (id: string) => void;
};

const SpacesContext = createContext<SpacesValue | null>(null);

/**
 * The active space is the one piece of this that the API does not own: it is
 * interface state, so two devices of the same person can sit in different
 * spaces. The list itself comes from the server and lives in the query cache.
 */
export const SpacesProvider = ({ children }: { children: ReactNode }) => {
	const { data } = useQuery(spacesQuery);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const value = useMemo<SpacesValue>(() => {
		const spaces = (data ?? []).filter((space) => !space.archivedAt);
		// Falling back to the first one covers both the first render and a space
		// that was archived while it was the one in use.
		const selected = spaces.find((space) => space.id === selectedId);

		return {
			spaces,
			activeSpace: selected ?? spaces[0],
			selectSpace: setSelectedId,
		};
	}, [data, selectedId]);

	return (
		<SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
	);
};

export const useSpaces = () => {
	const value = useContext(SpacesContext);

	if (!value) {
		throw new Error('useSpaces must be used inside SpacesProvider');
	}

	return value;
};

export const useActiveSpace = () => useSpaces().activeSpace;

export const isShared = (space: Space) => space.members > 1;
