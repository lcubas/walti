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
