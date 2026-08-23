import { useNavigate } from 'react-router';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTitle,
} from '@/components/ui/drawer';
import { paths } from '@/shared/routes';
import { isShared, useActiveSpace } from '@/shared/spaces/spacesContext';
import { spaceTones } from '@/shared/spaces/spaceTones';

export const NewExpenseDrawer = () => {
	const navigate = useNavigate();
	const space = useActiveSpace();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate(paths.gastos);
		}
	};

	return (
		<Drawer open onOpenChange={handleOpenChange} showSwipeHandle>
			<DrawerContent className="[--drawer-height:92dvh]">
				<div
					className={`h-0.5 shrink-0 ${spaceTones[space.tone].accent}`}
					aria-hidden="true"
				/>

				<div className="flex shrink-0 items-center justify-between px-4 py-3">
					<DrawerClose className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
						Cancelar
					</DrawerClose>

					<DrawerTitle className="text-base">Nuevo gasto</DrawerTitle>

					<span className="w-16" aria-hidden="true" />
				</div>

				{isShared(space) ? (
					<p className="shrink-0 px-5 pb-3 text-xs text-muted-foreground">
						Se registra en{' '}
						<span className="font-medium text-foreground">{space.name}</span>,
						compartido con {space.members - 1} persona
						{space.members > 2 ? 's' : ''}.
					</p>
				) : null}

				<div className="flex-1 overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
					<p className="text-sm text-muted-foreground">
						El formulario se construye en E5 · Gastos.
					</p>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
