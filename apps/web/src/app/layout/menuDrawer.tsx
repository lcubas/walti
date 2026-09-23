import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
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
			<div className="flex shrink-0 items-center justify-between px-4 py-3">
				<DrawerClose
					aria-label="Cerrar"
					render={<Button type="button" variant="ghost" size="icon-lg" />}
				>
					<X className="size-4" aria-hidden="true" />
				</DrawerClose>

				<DrawerTitle className="text-base">{title}</DrawerTitle>

				<span className="size-11" aria-hidden="true" />
			</div>

			<div className="px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
				{children}
			</div>
		</DrawerContent>
	</Drawer>
);
