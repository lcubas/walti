import { useActiveSpace } from '../../shared/spaces/spacesContext';
import { spaceTones } from '../../shared/spaces/spaceTones';
import { AccountMenu } from './accountMenu';
import { SpaceSwitcher } from './spaceSwitcher';

export const AppHeader = () => {
	const space = useActiveSpace();

	return (
		<header className="sticky top-0 z-10 bg-muted/95 backdrop-blur pt-[env(safe-area-inset-top)]">
			<div className="mx-auto flex max-w-screen-sm items-center justify-between gap-2 px-3 py-2">
				<SpaceSwitcher />
				<AccountMenu />
			</div>

			<div
				className={`h-0.5 ${spaceTones[space.tone].accent}`}
				aria-hidden="true"
			/>
		</header>
	);
};
