export type SpaceTone = 'emerald' | 'sky' | 'amber' | 'violet';

type ToneClasses = { accent: string; action: string; icon: string };

/**
 * Shades are pinned by contrast, not by taste: white on -700 clears AA in the four tones,
 * and the accent line needs -700 on light chrome and -300 on dark to clear 3:1. The icon
 * shade rides on the same pair, which is what WCAG 1.4.11 asks of a graphic that carries meaning.
 */
export const spaceTones: Record<SpaceTone, ToneClasses> = {
	emerald: {
		accent: 'bg-emerald-700 dark:bg-emerald-300',
		action: 'bg-emerald-700 text-white hover:bg-emerald-800',
		icon: 'text-emerald-700 dark:text-emerald-300',
	},
	sky: {
		accent: 'bg-sky-700 dark:bg-sky-300',
		action: 'bg-sky-700 text-white hover:bg-sky-800',
		icon: 'text-sky-700 dark:text-sky-300',
	},
	amber: {
		accent: 'bg-amber-700 dark:bg-amber-300',
		action: 'bg-amber-700 text-white hover:bg-amber-800',
		icon: 'text-amber-700 dark:text-amber-300',
	},
	violet: {
		accent: 'bg-violet-700 dark:bg-violet-300',
		action: 'bg-violet-700 text-white hover:bg-violet-800',
		icon: 'text-violet-700 dark:text-violet-300',
	},
};
