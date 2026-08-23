import { ChevronsUpDown, Plus, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useSpaces } from '@/shared/spaces/spacesContext';
import { spaceTones } from '@/shared/spaces/spaceTones';
import { paths } from '@/shared/routes';
import { MenuRow, MenuDrawer, menuRowClasses } from '@/app/layout/menuDrawer';

const pillClasses =
	'flex min-h-9 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export const SpaceSwitcher = () => {
	const { spaces, activeSpace, selectSpace } = useSpaces();
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<div className="flex min-w-0 items-center gap-1 overflow-x-auto">
			{spaces.map((space) =>
				space.id === activeSpace.id ? (
					<MenuDrawer
						key={space.id}
						label={`Estás en ${space.name}. Cambiar de espacio`}
						title="Espacios"
						open={open}
						onOpenChange={setOpen}
						triggerClassName={`${pillClasses} ${spaceTones[space.tone].action}`}
						trigger={
							<>
								{space.name}
								<ChevronsUpDown
									className="size-3.5 opacity-70"
									aria-hidden="true"
								/>
							</>
						}
					>
						<p className="px-2 pb-2 text-xs text-muted-foreground">
							Todo lo que ves y todo lo que registres pertenece al espacio
							activo.
						</p>

						<Link to={paths.espacio} onClick={close} className={menuRowClasses}>
							<MenuRow
								icon={<Settings2 className="size-4" aria-hidden="true" />}
								label="Ajustes del espacio"
								description="Miembros, categorías y notificaciones"
							/>
						</Link>

						<button type="button" onClick={close} className={menuRowClasses}>
							<MenuRow
								icon={<Plus className="size-4" aria-hidden="true" />}
								label="Crear espacio"
								description="Disponible en E3"
							/>
						</button>
					</MenuDrawer>
				) : (
					<button
						key={space.id}
						type="button"
						aria-label={`Cambiar a ${space.name}`}
						onClick={() => selectSpace(space.id)}
						className={`${pillClasses} text-muted-foreground hover:bg-accent`}
					>
						{space.name}
					</button>
				),
			)}
		</div>
	);
};
