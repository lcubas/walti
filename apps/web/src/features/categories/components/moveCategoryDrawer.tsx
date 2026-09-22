import type { CategoryGroup } from '@walti/shared';
import { Check } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
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
				<DrawerHeader>
					<DrawerTitle>Mover {categoryName}</DrawerTitle>
				</DrawerHeader>

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
