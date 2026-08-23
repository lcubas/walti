export type SpaceTone = 'emerald' | 'sky' | 'amber' | 'violet';

type ToneClasses = { badge: string; accent: string; action: string };

export const spaceTones: Record<SpaceTone, ToneClasses> = {
	emerald: {
		badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
		accent: 'bg-emerald-500',
		action: 'bg-emerald-600 text-white hover:bg-emerald-700',
	},
	sky: {
		badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
		accent: 'bg-sky-500',
		action: 'bg-sky-600 text-white hover:bg-sky-700',
	},
	amber: {
		badge: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
		accent: 'bg-amber-500',
		action: 'bg-amber-600 text-white hover:bg-amber-700',
	},
	violet: {
		badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
		accent: 'bg-violet-500',
		action: 'bg-violet-600 text-white hover:bg-violet-700',
	},
};
