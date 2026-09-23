import type { CategoryGroup } from '@walti/shared';
import { Check, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { menuRowClasses } from '@/shared/components/menuRow';

type MoveCategoryDrawerProps = {
	trigger: ReactElement;
	categoryName: string;
	currentGroupId: string;
	groups: CategoryGroup[];
	onMove: (groupId: string) => void;
};

export const MoveCategoryDrawer = ({
	trigger,
	categoryName,
	currentGroupId,
	groups,
	onMove,
}: MoveCategoryDrawerProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
			<DrawerTrigger render={trigger} />

			<DrawerContent>
				<div className="flex shrink-0 items-center justify-between px-4 py-3">
					<DrawerClose
						aria-label="Cerrar"
						render={<Button type="button" variant="ghost" size="icon-lg" />}
					>
						<X className="size-4" aria-hidden="true" />
					</DrawerClose>

					<DrawerTitle className="text-base">Mover {categoryName}</DrawerTitle>

					<span className="size-11" aria-hidden="true" />
				</div>

				<ul className="px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
					{groups.map((group) => {
						const isCurrent = group.id === currentGroupId;

						return (
							<li key={group.id}>
								<button
									type="button"
									disabled={isCurrent}
									aria-current={isCurrent ? 'true' : undefined}
									onClick={() => {
										onMove(group.id);
										setOpen(false);
									}}
									className={`${menuRowClasses} disabled:opacity-60`}
								>
									<span className="text-sm">{group.name}</span>

									{isCurrent ? (
										<span className="flex items-center gap-1 text-xs text-muted-foreground">
											<Check className="size-4" aria-hidden="true" />
											Aquí está
										</span>
									) : null}
								</button>
							</li>
						);
					})}
				</ul>
			</DrawerContent>
		</Drawer>
	);
};
