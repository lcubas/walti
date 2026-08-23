import type { ReactNode } from 'react';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';

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
	<Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
		<DrawerTrigger aria-label={label} className={triggerClassName}>
			{trigger}
		</DrawerTrigger>

		<DrawerContent>
			<DrawerHeader>
				<DrawerTitle>{title}</DrawerTitle>
			</DrawerHeader>

			<div className="px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
				{children}
			</div>
		</DrawerContent>
	</Drawer>
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
