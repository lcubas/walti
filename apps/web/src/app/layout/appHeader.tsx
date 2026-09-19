import { AccountMenu } from '@/app/layout/accountMenu';
import { SpaceSwitcher } from '@/app/layout/spaceSwitcher';
import { cn } from '@/lib/utils';
import { spaceTones } from '@/shared/spaces/spaceTones';
import { useActiveSpace } from '@/shared/spaces/spacesContext';

/**
 * The header belongs to the space, and says so by being its colour. A tint on
 * grey chrome was not readable in light mode, and a 2px line is not something
 * anybody notices changing: the bar itself has to be the signal.
 *
 * It runs into the safe area on purpose, so on a phone the space reaches the
 * top edge of the screen. Colour is never alone — the name sits in the pill.
 */
export const AppHeader = () => {
	const space = useActiveSpace();

	return (
		<header
			className={cn(
				'sticky top-0 z-10 pt-[env(safe-area-inset-top)] transition-colors duration-300',
				// Neutral until the list lands, so the bar never flashes a colour
				// that is not yours.
				space ? spaceTones[space.tone].solid : 'bg-muted',
			)}
		>
			<div className="mx-auto flex max-w-screen-sm items-center justify-between gap-2 px-3 py-2">
				<SpaceSwitcher />
				<AccountMenu />
			</div>
		</header>
	);
};
