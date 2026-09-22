import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTitle,
} from '@/components/ui/drawer';
import { NewExpenseForm } from '@/features/expenses/components/newExpenseForm';
import { SpacePill } from '@/features/expenses/components/spacePill';
import { useNewExpenseDrawer } from '@/shared/expenses/newExpenseDrawerContext';
import { useActiveSpace } from '@/shared/spaces/spacesContext';

export const NewExpenseDrawer = () => {
	const space = useActiveSpace();
	const { open, closeDrawer, openDrawer } = useNewExpenseDrawer();

	return (
		<Drawer
			open={open}
			onOpenChange={(next) => (next ? openDrawer() : closeDrawer())}
			showSwipeHandle
		>
			<DrawerContent className="[--drawer-height:92dvh]">
				{/* Same max-width as <main> in AppLayout. */}
				<div className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col overflow-hidden">
					<div className="flex shrink-0 items-center justify-between px-4 py-3">
						<DrawerClose
							aria-label="Cerrar"
							render={<Button type="button" variant="ghost" size="icon-lg" />}
						>
							<X className="size-4" aria-hidden="true" />
						</DrawerClose>

						<DrawerTitle className="text-base">Nuevo gasto</DrawerTitle>

						<span className="size-11" aria-hidden="true" />
					</div>

					{space ? (
						<div className="flex shrink-0 justify-center px-5 pb-3">
							<SpacePill space={space} />
						</div>
					) : null}

					<div className="flex-1 overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
						{space ? (
							<NewExpenseForm spaceId={space.id} currency={space.currency} />
						) : null}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
