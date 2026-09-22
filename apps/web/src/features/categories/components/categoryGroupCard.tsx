import { CategoryNameRequest, RenameCategoryGroupRequest } from '@walti/shared';
import type { CategoryGroup } from '@walti/shared';
import { ChevronsUpDown, Pencil, Plus, Tag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CategoryRow } from '@/features/categories/components/categoryRow';
import {
	useCreateCategory,
	useRenameCategoryGroup,
} from '@/features/categories/hooks/useCategoryMutations';
import { EmptyState } from '@/shared/components/emptyState';
import { NameForm } from '@/shared/components/nameForm';

const iconButtonClasses =
	'inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';

type CategoryGroupCardProps = {
	spaceId: string;
	group: CategoryGroup;
	/** Active groups of the space, for moving a category out of this one. */
	groups: CategoryGroup[];
	groupNames: string[];
	canEdit: boolean;
	open: boolean;
	onToggle: () => void;
};

export const CategoryGroupCard = ({
	spaceId,
	group,
	groups,
	groupNames,
	canEdit,
	open,
	onToggle,
}: CategoryGroupCardProps) => {
	const [renaming, setRenaming] = useState(false);
	const [adding, setAdding] = useState(false);
	const rename = useRenameCategoryGroup(spaceId);
	const create = useCreateCategory(spaceId);

	const active = group.categories.filter((category) => !category.archivedAt);
	const archived = group.categories.filter((category) => category.archivedAt);
	// Archived ones sink to the bottom: they are history, not choices.
	const ordered = [...active, ...archived];

	if (renaming) {
		return (
			<section className="rounded-xl bg-muted p-3">
				<NameForm
					schema={RenameCategoryGroupRequest}
					label="Nuevo nombre"
					submitLabel="Guardar"
					placeholder="Alimentación"
					initialName={group.name}
					maxLength={40}
					takenNames={groupNames}
					duplicateMessage="Ya tienes un grupo con ese nombre."
					pending={rename.isPending}
					onCancel={() => setRenaming(false)}
					onSubmit={(name) =>
						rename.mutate(
							{ groupId: group.id, name },
							{ onSuccess: () => setRenaming(false) },
						)
					}
				/>
			</section>
		);
	}

	return (
		<Collapsible
			open={open}
			onOpenChange={onToggle}
			render={<section className="rounded-xl bg-muted" />}
		>
			<div className="flex items-center gap-1 p-1">
				<h2 className="min-w-0 flex-1 truncate px-2 text-sm font-medium">
					{group.name}
				</h2>

				{canEdit ? (
					<button
						type="button"
						onClick={() => setRenaming(true)}
						aria-label={`Renombrar ${group.name}`}
						className={iconButtonClasses}
					>
						<Pencil className="size-4" aria-hidden="true" />
					</button>
				) : null}

				{/* The icon stays put. What says the group is open is the panel
				    growing under it, and `aria-expanded`, which Base UI wires up. */}
				<CollapsibleTrigger
					aria-label={`${open ? 'Plegar' : 'Desplegar'} ${group.name}`}
					className={iconButtonClasses}
				>
					<ChevronsUpDown className="size-4" aria-hidden="true" />
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className="overflow-hidden">
				<div className="space-y-2 px-3 pb-3">
					{ordered.length > 0 ? (
						<ul className="space-y-1">
							{ordered.map((category) => (
								<CategoryRow
									key={category.id}
									spaceId={spaceId}
									category={category}
									group={group}
									groups={groups}
									canEdit={canEdit}
									canArchive={active.length > 1}
									siblingNames={group.categories
										.filter((sibling) => sibling.id !== category.id)
										.map((sibling) => sibling.name)}
								/>
							))}
						</ul>
					) : (
						<EmptyState
							icon={Tag}
							title="Sin categorías"
							description={
								canEdit
									? 'Añade la primera para poder usar este grupo al registrar un gasto.'
									: 'Quien administra el espacio aún no ha añadido ninguna.'
							}
						/>
					)}

					{!canEdit ? null : adding ? (
						<div className="rounded-lg bg-background p-3">
							<NameForm
								schema={CategoryNameRequest}
								label={`Nueva categoría en ${group.name}`}
								submitLabel="Añadir"
								placeholder="Supermercado"
								maxLength={40}
								takenNames={group.categories.map((category) => category.name)}
								duplicateMessage={`Ya tienes una categoría con ese nombre en ${group.name}.`}
								pending={create.isPending}
								onCancel={() => setAdding(false)}
								onSubmit={(name) =>
									create.mutate(
										{ groupId: group.id, name },
										{ onSuccess: () => setAdding(false) },
									)
								}
							/>
						</div>
					) : (
						<Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
							<Plus className="size-4" aria-hidden="true" />
							Añadir categoría
						</Button>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
