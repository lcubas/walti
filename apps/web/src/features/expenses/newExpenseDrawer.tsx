import { Drawer } from '@base-ui/react/drawer';
import { useNavigate } from 'react-router';
import { isShared, useActiveSpace } from '../../shared/spaces/spacesContext';
import { spaceTones } from '../../shared/spaces/spaceTones';
import { paths } from '../../shared/routes';

export const NewExpenseDrawer = () => {
	const navigate = useNavigate();
	const space = useActiveSpace();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate(paths.gastos);
		}
	};

	return (
		<Drawer.Root open onOpenChange={handleOpenChange}>
			<Drawer.Portal>
				<Drawer.Backdrop className="fixed inset-0 z-20 bg-black/40" />

				<Drawer.Viewport className="fixed inset-x-0 bottom-0 z-30">
					<Drawer.Popup className="mx-auto flex h-[92dvh] max-w-screen-sm flex-col overflow-hidden rounded-t-2xl bg-background">
						<div
							className={`h-0.5 shrink-0 ${spaceTones[space.tone].accent}`}
							aria-hidden="true"
						/>

						<div
							className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border"
							aria-hidden="true"
						/>

						<div className="flex shrink-0 items-center justify-between px-4 py-3">
							<Drawer.Close className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
								Cancelar
							</Drawer.Close>

							<Drawer.Title className="text-base font-semibold">
								Nuevo gasto
							</Drawer.Title>

							<span className="w-16" aria-hidden="true" />
						</div>

						{isShared(space) ? (
							<p className="shrink-0 px-5 pb-3 text-xs text-muted-foreground">
								Se registra en{' '}
								<span className="font-medium text-foreground">
									{space.name}
								</span>
								, compartido con {space.members - 1} persona
								{space.members > 2 ? 's' : ''}.
							</p>
						) : null}

						<div className="flex-1 overflow-y-auto px-5 pb-[env(safe-area-inset-bottom)]">
							<p className="text-sm text-muted-foreground">
								El formulario se construye en E5 · Gastos.
							</p>
						</div>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
};
