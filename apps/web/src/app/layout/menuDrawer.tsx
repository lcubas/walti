import { Drawer } from '@base-ui/react/drawer';
import type { ReactNode } from 'react';

type MenuDrawerProps = {
	label: string;
	title: string;
	trigger: ReactNode;
	triggerClassName?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
};

export const MenuDrawer = ({
	label,
	title,
	trigger,
	triggerClassName,
	open,
	onOpenChange,
	children,
}: MenuDrawerProps) => (
	<Drawer.Root open={open} onOpenChange={onOpenChange}>
		<Drawer.Trigger aria-label={label} className={triggerClassName}>
			{trigger}
		</Drawer.Trigger>

		<Drawer.Portal>
			<Drawer.Backdrop className="fixed inset-0 z-20 bg-black/40" />

			<Drawer.Viewport className="fixed inset-x-0 bottom-0 z-30">
				<Drawer.Popup className="mx-auto max-w-screen-sm rounded-t-2xl border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
					<div
						className="mx-auto mt-3 h-1 w-10 rounded-full bg-border"
						aria-hidden="true"
					/>

					<Drawer.Title className="px-5 pt-4 text-base font-semibold">
						{title}
					</Drawer.Title>

					<div className="px-3 pt-2 pb-4">{children}</div>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
);

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
