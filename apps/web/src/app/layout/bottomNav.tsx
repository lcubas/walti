import { ChartNoAxesColumn, House, Plus, Receipt, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { useActiveSpace } from '../../shared/spaces/spacesContext';
import { spaceTones } from '../../shared/spaces/spaceTones';
import { paths } from '../../shared/routes';

type NavItem = { to: string; label: string; icon: LucideIcon };

const items: NavItem[] = [
	{ to: paths.inicio, label: 'Inicio', icon: House },
	{ to: paths.gastos, label: 'Gastos', icon: Receipt },
	{ to: paths.plan, label: 'Plan', icon: Target },
	{ to: paths.analisis, label: 'Análisis', icon: ChartNoAxesColumn },
];

const linkClasses = [
	'flex flex-1 flex-col items-center justify-center gap-1 rounded-md py-2',
	'text-xs text-muted-foreground transition-colors',
	'hover:text-foreground',
	'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
	'aria-[current=page]:text-foreground aria-[current=page]:font-medium',
].join(' ');

const NavItemLink = ({ item }: { item: NavItem }) => {
	const Icon = item.icon;

	return (
		<li className="flex flex-1">
			<NavLink
				to={item.to}
				end={item.to === paths.inicio}
				className={linkClasses}
			>
				<Icon className="size-5" aria-hidden="true" />
				{item.label}
			</NavLink>
		</li>
	);
};

export const BottomNav = () => {
	const space = useActiveSpace();

	return (
		<nav
			aria-label="Navegación principal"
			className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-muted/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
		>
			<ul className="mx-auto flex max-w-screen-sm items-stretch gap-1 px-2">
				{items.slice(0, 2).map((item) => (
					<NavItemLink key={item.to} item={item} />
				))}

				<li className="flex items-center justify-center px-1">
					<NavLink
						to={paths.nuevoGasto}
						aria-label={`Registrar gasto en ${space.name}`}
						className={`-mt-5 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${spaceTones[space.tone].action}`}
					>
						<Plus className="size-6" aria-hidden="true" />
					</NavLink>
				</li>

				{items.slice(2).map((item) => (
					<NavItemLink key={item.to} item={item} />
				))}
			</ul>
		</nav>
	);
};
