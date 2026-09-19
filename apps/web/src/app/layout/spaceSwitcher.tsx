import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { MenuDrawer } from '@/app/layout/menuDrawer';
import { SpacesMenu } from '@/features/spaces/components/spacesMenu';
import { useSpaces } from '@/shared/spaces/spacesContext';

/**
 * The header already is the space, so the pill stops repeating the colour and
 * lifts off it instead: white at low opacity reads as raised on all four tones
 * without needing one class per tone.
 */
const pillClasses =
	'flex min-h-9 max-w-[60vw] shrink items-center gap-1 rounded-full bg-white/15 px-3 text-sm font-medium text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/**
 * One pill, always. Which space you are in is the only thing the header says
 * about scope; everything you can do with spaces is one tap away inside.
 */
export const SpaceSwitcher = () => {
	const { spaces, activeSpace } = useSpaces();
	const [open, setOpen] = useState(false);

	// Nothing to name until the list lands. The account menu holds the height.
	if (!activeSpace) {
		return <div className="min-h-9" aria-hidden="true" />;
	}

	const canSwitch = spaces.length > 1;

	return (
		<MenuDrawer
			label={
				canSwitch
					? `Estás en ${activeSpace.name}. Cambiar de espacio`
					: `Estás en ${activeSpace.name}. Abrir menú del espacio`
			}
			title="Espacios"
			open={open}
			onOpenChange={setOpen}
			triggerClassName={pillClasses}
			trigger={
				<>
					<span className="truncate">{activeSpace.name}</span>

					{canSwitch ? (
						<ChevronsUpDown
							className="size-3.5 shrink-0 opacity-70"
							aria-hidden="true"
						/>
					) : null}
				</>
			}
		>
			<SpacesMenu onClose={() => setOpen(false)} />
		</MenuDrawer>
	);
};
