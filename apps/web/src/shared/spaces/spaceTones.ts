export type SpaceTone = 'emerald' | 'gold' | 'sapphire' | 'amethyst';

type ToneClasses = {
	accent: string;
	action: string;
	icon: string;
	/** The same fill without hover: for marks that identify, not for controls. */
	solid: string;
	/** A tint, not a fill: says which space you are in without competing with it. */
	wash: string;
};

/**
 * Four things worth money, because a space is where a person keeps theirs: the
 * stone, the metal, the bank and the purple that used to cost a fortune to dye.
 *
 * Red is deliberately absent. In an app about spending, red means over budget,
 * and a space that is permanently red would be a permanent false alarm.
 *
 * Hue matters before meaning, though: the tone's job is to tell one space from
 * another, so the four sit far apart on the wheel. Shades are pinned by
 * contrast, not by taste — white on -700 clears AA in the four, and -700 on
 * light chrome and -300 on dark clear 3:1, which is what WCAG 1.4.11 asks of a
 * graphic that carries meaning.
 */
export const spaceTones: Record<SpaceTone, ToneClasses> = {
	/** Esmeralda: the green of money. */
	emerald: {
		accent: 'bg-emerald-700 dark:bg-emerald-300',
		action: 'bg-emerald-700 text-white hover:bg-emerald-800',
		icon: 'text-emerald-700 dark:text-emerald-300',
		solid: 'bg-emerald-700 text-white',
		wash: 'bg-emerald-700/12 dark:bg-emerald-300/12',
	},
	/** Oro. */
	gold: {
		accent: 'bg-amber-700 dark:bg-amber-300',
		action: 'bg-amber-700 text-white hover:bg-amber-800',
		icon: 'text-amber-700 dark:text-amber-300',
		solid: 'bg-amber-700 text-white',
		wash: 'bg-amber-700/12 dark:bg-amber-300/12',
	},
	/** Zafiro: el azul de la banca. */
	sapphire: {
		accent: 'bg-blue-700 dark:bg-blue-300',
		action: 'bg-blue-700 text-white hover:bg-blue-800',
		icon: 'text-blue-700 dark:text-blue-300',
		solid: 'bg-blue-700 text-white',
		wash: 'bg-blue-700/12 dark:bg-blue-300/12',
	},
	/** Amatista: la púrpura que costaba una fortuna teñir. */
	amethyst: {
		accent: 'bg-violet-700 dark:bg-violet-300',
		action: 'bg-violet-700 text-white hover:bg-violet-800',
		icon: 'text-violet-700 dark:text-violet-300',
		solid: 'bg-violet-700 text-white',
		wash: 'bg-violet-700/12 dark:bg-violet-300/12',
	},
};

/**
 * The order tones are handed out in. A space has no colour of its own in the
 * database — it takes the one its position gives it, so the assignment is the
 * same on every device and survives a reload without being stored anywhere.
 *
 * The personal space is created first, so it is always the green one.
 */
const toneOrder: SpaceTone[] = ['emerald', 'sapphire', 'gold', 'amethyst'];

export const toneForPosition = (position: number): SpaceTone =>
	toneOrder[position % toneOrder.length];
