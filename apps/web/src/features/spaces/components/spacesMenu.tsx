import {
	CalendarRange,
	Check,
	LayoutGrid,
	Settings2,
	Tags,
	Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { MenuRow, menuRowClasses } from '@/shared/components/menuRow';
import { SpaceAvatar } from '@/features/spaces/components/spaceAvatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { notifyDone } from '@/shared/notify';
import { paths } from '@/shared/routes';
import { spaceTones } from '@/shared/spaces/spaceTones';
import { useSpaces } from '@/shared/spaces/spacesContext';

export const SpacesMenu = ({ onClose }: { onClose: () => void }) => {
	const { spaces, activeSpace, selectSpace } = useSpaces();

	return (
		<>
			<p className="px-2 pb-2 text-xs text-muted-foreground">
				Todo lo que ves y todo lo que registres pertenece al espacio activo.
			</p>

			{/* With a single space the list does not appear at all. */}
			{spaces.length > 1 ? (
				<ul className="pb-2">
					{spaces.map((space) => {
						const isActive = space.id === activeSpace?.id;

						return (
							<li key={space.id}>
								<button
									type="button"
									aria-current={isActive ? 'true' : undefined}
									onClick={() => {
										if (!isActive) {
											selectSpace(space.id);
											// A tint says which space you are in; only an event
											// says that you just changed. It is also the only
											// signal a screen reader gets.
											notifyDone(`Cambiaste a ${space.name}`);
										}

										onClose();
									}}
									className={menuRowClasses}
								>
									<span className="flex min-w-0 items-center gap-3">
										<SpaceAvatar space={space} />

										<span className="flex min-w-0 flex-col text-left">
											<span
												className={cn(
													'truncate text-sm',
													isActive && 'font-medium',
												)}
											>
												{space.name}
											</span>

											<span className="flex items-center gap-1 text-xs text-muted-foreground">
												{space.members > 1 ? (
													<>
														<Users className="size-3" aria-hidden="true" />
														{space.members} personas
													</>
												) : (
													'Solo tú'
												)}
											</span>
										</span>
									</span>

									{isActive ? (
										<Check
											className={cn(
												'size-4 shrink-0',
												spaceTones[space.tone].icon,
											)}
											aria-hidden="true"
										/>
									) : null}
								</button>
							</li>
						);
					})}
				</ul>
			) : null}

			<Separator className="mb-2" />

			<Link to={paths.space} onClick={onClose} className={menuRowClasses}>
				<MenuRow
					icon={<Settings2 className="size-4" aria-hidden="true" />}
					label="Ajustes del espacio"
					description="Miembros, categorías y notificaciones"
				/>
			</Link>

			<Link to={paths.categories} onClick={onClose} className={menuRowClasses}>
				<MenuRow
					icon={<Tags className="size-4" aria-hidden="true" />}
					label="Categorías"
					description="Crear, renombrar, mover y archivar"
				/>
			</Link>

			<Link to={paths.events} onClick={onClose} className={menuRowClasses}>
				<MenuRow
					icon={<CalendarRange className="size-4" aria-hidden="true" />}
					label="Eventos"
					description="Agrupa los gastos de una ocasión con fecha propia"
				/>
			</Link>

			<Link to={paths.spaces} onClick={onClose} className={menuRowClasses}>
				<MenuRow
					icon={<LayoutGrid className="size-4" aria-hidden="true" />}
					label="Gestionar espacios"
					description="Crear, renombrar y archivar"
				/>
			</Link>
		</>
	);
};
