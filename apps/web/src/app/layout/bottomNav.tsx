import { ChartNoAxesColumn, House, Plus, Receipt, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/shared/routes';
import { useNewExpenseDrawer } from '@/shared/expenses/newExpenseDrawerContext';
import { useActiveSpace } from '@/shared/spaces/spacesContext';
import { spaceTones } from '@/shared/spaces/spaceTones';

type NavItem = { to: string; label: string; icon: LucideIcon };

const items: NavItem[] = [
	{ to: paths.home, label: 'Inicio', icon: House },
	{ to: paths.expenses, label: 'Gastos', icon: Receipt },
	{ to: paths.plan, label: 'Plan', icon: Target },
	{ to: paths.analysis, label: 'Análisis', icon: ChartNoAxesColumn },
];

const linkClasses = [
	'flex flex-1 flex-col items-center justify-center gap-1 rounded-md py-2',
	'text-xs text-muted-foreground transition-colors',
	'hover:text-foreground',
	'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
].join(' ');

type NavItemLinkProps = { item: NavItem; iconClassName: string };

const NavItemLink = ({ item, iconClassName }: NavItemLinkProps) => {
	const Icon = item.icon;

	return (
		<li className="flex flex-1">
			<NavLink
				to={item.to}
				end={item.to === paths.home}
				className={({ isActive, isPending }) =>
					cn(
						linkClasses,
						isActive && 'font-medium text-foreground',
						isPending && 'pointer-events-none opacity-50',
					)
				}
			>
				{({ isActive }) => (
					<>
						<Icon
							className={cn(
								'size-5 transition-colors',
								isActive && iconClassName,
							)}
							aria-hidden="true"
						/>
						{item.label}
					</>
				)}
			</NavLink>
		</li>
	);
};

export const BottomNav = () => {
	const space = useActiveSpace();
	const tone = space ? spaceTones[space.tone] : null;
	const { openDrawer } = useNewExpenseDrawer();

	return (
		<nav
			aria-label="Navegación principal"
			className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-muted/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
		>
			{/* The space owns the chrome at both ends of the screen, so a switch
			    changes the frame around everything and not a single hairline. */}
			{tone ? (
				<span
					className={cn(
						'pointer-events-none absolute inset-0 transition-colors duration-300',
						tone.wash,
					)}
					aria-hidden="true"
				/>
			) : null}

			<ul className="relative mx-auto flex max-w-screen-sm items-stretch gap-1 px-2">
				{items.slice(0, 2).map((item) => (
					<NavItemLink
						key={item.to}
						item={item}
						iconClassName={tone?.icon ?? ''}
					/>
				))}

				<li className="flex items-center justify-center px-1">
					{/* Not a route: opening the sheet is not going anywhere, so a
					    plain button that flips shared state, not a link, is what
					    belongs here. */}
					<button
						type="button"
						onClick={openDrawer}
						aria-label={
							space ? `Registrar gasto en ${space.name}` : 'Registrar gasto'
						}
						className={cn(
							'-mt-5 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
							// Neutral for the instant before the spaces land, so the
							// button is never invisible.
							tone ? tone.action : 'bg-muted-foreground/30 text-background',
						)}
					>
						<Plus className="size-6" aria-hidden="true" />
					</button>
				</li>

				{items.slice(2).map((item) => (
					<NavItemLink
						key={item.to}
						item={item}
						iconClassName={tone?.icon ?? ''}
					/>
				))}
			</ul>
		</nav>
	);
};
