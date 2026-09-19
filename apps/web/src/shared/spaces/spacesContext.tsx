import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { notifyInfo } from '@/shared/notify';
import { activeSpaceParam } from '@/shared/routes';
import {
	readActiveSpaceId,
	writeActiveSpaceId,
} from '@/shared/spaces/activeSpaceStorage';
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
 * Which space the user is working in. The API does not own it — it is
 * interface state, so two devices of the same person sit wherever each of them
 * was left. Three things can say which space it is, in this order:
 *
 * 1. A link that was shared carrying it, which wins on arrival.
 * 2. What this browser remembers from last time.
 * 3. The first space, which is the personal one.
 *
 * The list itself comes from the server and lives in the query cache. Nothing
 * here navigates: switching space changes no URL, so no screen unmounts and
 * nothing reloads.
 */
export const SpacesProvider = ({ children }: { children: ReactNode }) => {
	const { data } = useQuery(spacesQuery);
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedId, setSelectedId] = useState(readActiveSpaceId);
	const reportedMissing = useRef<string | null>(null);

	const linkedId = searchParams.get(activeSpaceParam);

	// A shared link opens in the space it was made in, and then the parameter
	// leaves the URL: keeping it would oblige every screen to carry it.
	useEffect(() => {
		if (!linkedId) {
			return;
		}

		setSelectedId(linkedId);

		const remaining = new URLSearchParams(searchParams);
		remaining.delete(activeSpaceParam);
		setSearchParams(remaining, { replace: true });
	}, [linkedId, searchParams, setSearchParams]);

	const spaces = useMemo(
		() => (data ?? []).filter((space) => !space.archivedAt),
		[data],
	);

	const selected = spaces.find((space) => space.id === selectedId);
	const activeSpace = selected ?? spaces[0];

	useEffect(() => {
		if (!activeSpace) {
			return;
		}

		writeActiveSpaceId(activeSpace.id);

		// The space that was asked for is gone: archived from another browser, or
		// reached through a link to somewhere this user does not belong. Falling
		// back silently would leave them registering expenses somewhere else.
		if (selectedId && !selected) {
			if (reportedMissing.current !== selectedId) {
				reportedMissing.current = selectedId;
				notifyInfo(
					'Ese espacio ya no está disponible',
					`Estás en ${activeSpace.name}.`,
				);
			}

			// The choice moves with the fallback. Keeping the old id would send the
			// user back there the day somebody unarchives it, without asking.
			setSelectedId(activeSpace.id);
			return;
		}

		reportedMissing.current = null;
	}, [activeSpace, selected, selectedId]);

	const value = useMemo<SpacesValue>(
		() => ({ spaces, activeSpace, selectSpace: setSelectedId }),
		[spaces, activeSpace],
	);

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
