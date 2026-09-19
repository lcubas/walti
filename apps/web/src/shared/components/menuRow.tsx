import type { ReactNode } from 'react';

type MenuRowProps = { icon: ReactNode; label: string; description?: string };

export const MenuRow = ({ icon, label, description }: MenuRowProps) => (
	<span className="flex items-center gap-3">
		<span className="text-muted-foreground">{icon}</span>

		<span className="flex flex-col text-left">
			<span className="text-sm">{label}</span>
			{description ? (
				<span className="text-xs text-muted-foreground">{description}</span>
			) : null}
		</span>
	</span>
);

export const menuRowClasses =
	'flex w-full items-center justify-between rounded-lg px-2 py-3 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';
