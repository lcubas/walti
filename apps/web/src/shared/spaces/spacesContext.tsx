import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Currency } from '@walti/shared';
import type { SpaceTone } from '@/shared/spaces/spaceTones';

export type Space = {
	id: string;
	name: string;
	currency: Currency;
	members: number;
	tone: SpaceTone;
};

const seed: Space[] = [
	{
		id: 'personal',
		name: 'Personal',
		currency: 'PEN',
		members: 1,
		tone: 'emerald',
	},
];

type SpacesValue = {
	spaces: Space[];
	activeSpace: Space;
	selectSpace: (id: string) => void;
};

const SpacesContext = createContext<SpacesValue | null>(null);

export const SpacesProvider = ({ children }: { children: ReactNode }) => {
	const [spaces] = useState<Space[]>(seed);
	const [activeId, setActiveId] = useState<string>(seed[0].id);

	const value = useMemo<SpacesValue>(
		() => ({
			spaces,
			activeSpace: spaces.find((space) => space.id === activeId) ?? spaces[0],
			selectSpace: setActiveId,
		}),
		[spaces, activeId],
	);

	return (
		<SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
	);
};

/**
 * Scope every screen belongs to. E3 replaces the seed with the spaces the user belongs to.
 */
export const useSpaces = () => {
	const value = useContext(SpacesContext);

	if (!value) {
		throw new Error('useSpaces must be used inside SpacesProvider');
	}

	return value;
};

export const useActiveSpace = () => useSpaces().activeSpace;

export const isShared = (space: Space) => space.members > 1;
