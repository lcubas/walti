import { CategoryNameRequest } from '@walti/shared';
import type { Category, CategoryGroup } from '@walti/shared';
import { Archive, ArchiveRestore, FolderInput, Pencil } from 'lucide-react';
import { useState } from 'react';
import { MoveCategoryDrawer } from '@/features/categories/components/moveCategoryDrawer';
import {
	useMoveCategory,
	useRenameCategory,
	useSetCategoryArchived,
} from '@/features/categories/hooks/useCategoryMutations';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/shared/components/confirmDialog';
import { NameForm } from '@/shared/components/nameForm';

const actionClasses =
	'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:opacity-40';

type CategoryRowProps = {
	spaceId: string;
	category: Category;
	group: CategoryGroup;
	/** Active groups of the space, so the category can be sent to another. */
	groups: CategoryGroup[];
	canArchive: boolean;
	canEdit: boolean;
	siblingNames: string[];
};

export const CategoryRow = ({
	spaceId,
	category,
	group,
	groups,
	canArchive,
	canEdit,
	siblingNames,
}: CategoryRowProps) => {
	const [renaming, setRenaming] = useState(false);
	const rename = useRenameCategory(spaceId);
	const move = useMoveCategory(spaceId);
	const setArchived = useSetCategoryArchived(spaceId);

	if (renaming) {
		return (
			<li className="rounded-lg bg-background p-3">
				<NameForm
					schema={CategoryNameRequest}
					label="Nuevo nombre"
					submitLabel="Guardar"
					placeholder="Supermercado"
					initialName={category.name}
					maxLength={40}
					takenNames={siblingNames}
					duplicateMessage={`Ya tienes una categoría con ese nombre en ${group.name}.`}
					pending={rename.isPending}
					onCancel={() => setRenaming(false)}
					onSubmit={(name) =>
						rename.mutate(
							{ categoryId: category.id, name },
							{ onSuccess: () => setRenaming(false) },
						)
					}
				/>
			</li>
		);
	}

	return (
		<li className="flex items-center gap-2 rounded-lg bg-background px-3 py-1">
			<span
				className={cn(
					'min-w-0 flex-1 truncate text-sm',
					category.archivedAt && 'text-muted-foreground',
				)}
			>
				{category.name}
				{category.archivedAt ? (
					<span className="ml-2 text-xs text-muted-foreground">Archivada</span>
				) : null}
			</span>

			{!canEdit ? null : category.archivedAt ? (
				<button
					type="button"
					onClick={() =>
						setArchived.mutate({ categoryId: category.id, archived: false })
					}
					disabled={setArchived.isPending}
					aria-label={`Recuperar ${category.name}`}
					className={actionClasses}
				>
					<ArchiveRestore className="size-4" aria-hidden="true" />
				</button>
			) : (
				<>
					<button
						type="button"
						onClick={() => setRenaming(true)}
						aria-label={`Renombrar ${category.name}`}
						className={actionClasses}
					>
						<Pencil className="size-4" aria-hidden="true" />
					</button>

					<MoveCategoryDrawer
						categoryName={category.name}
						currentGroupId={group.id}
						groups={groups}
						onMove={(groupId) =>
							move.mutate({ categoryId: category.id, groupId })
						}
						trigger={
							<button
								type="button"
								disabled={groups.length < 2 || move.isPending}
								aria-label={`Mover ${category.name}`}
								title={
									groups.length < 2
										? 'Necesitas otro grupo para poder moverla'
										: undefined
								}
								className={actionClasses}
							>
								<FolderInput className="size-4" aria-hidden="true" />
							</button>
						}
					/>

					<ConfirmDialog
						title={`¿Archivar ${category.name}?`}
						description="Desaparece del registro de gastos, pero su histórico se conserva y sigue contando en los análisis."
						confirmLabel="Archivar"
						onConfirm={() =>
							setArchived.mutate({ categoryId: category.id, archived: true })
						}
						trigger={
							<button
								type="button"
								disabled={!canArchive || setArchived.isPending}
								aria-label={`Archivar ${category.name}`}
								title={
									canArchive
										? undefined
										: `Es la única categoría activa de ${group.name}`
								}
								className={actionClasses}
							>
								<Archive className="size-4" aria-hidden="true" />
							</button>
						}
					/>
				</>
			)}
		</li>
	);
};
