import { Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTitle,
} from '@/components/ui/drawer';
import { SpaceAvatar } from '@/features/spaces/components/spaceAvatar';
import { NewExpenseForm } from '@/features/expenses/components/newExpenseForm';
import { useNewExpenseDrawer } from '@/shared/expenses/newExpenseDrawerContext';
import { isShared, useActiveSpace } from '@/shared/spaces/spacesContext';
import type { Space } from '@/shared/spaces/spacesApi';

/**
 * Same shape and language as the header's own space pill (`SpaceSwitcher`):
 * avatar, name, and — only when the space is shared — a member-count badge,
 * the same icon+count pattern used in `SpaceRow`. No framing sentence: the
 * pill alone says where this expense lands, and it says it whether the
 * space is personal or shared, closing the gap the header's pill leaves
 * once its own screen is behind the drawer's backdrop. It never opens
 * anything — switching spaces mid-form would drop an already-picked
 * category, which belongs to the space you were in.
 */
const SpacePill = ({ space }: { space: Space }) => (
	<span className="flex min-h-9 max-w-full shrink items-center gap-2 rounded-full bg-muted py-1 pr-3 pl-1 text-sm font-medium">
		<SpaceAvatar space={space} className="size-7 rounded-full" />

		<span className="truncate">{space.name}</span>

		{isShared(space) ? (
			<span className="flex items-center gap-1 rounded-full bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
				<Users className="size-3" aria-hidden="true" />
				{space.members}
			</span>
		) : null}
	</span>
);

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
