import { useSuspenseQuery } from '@tanstack/react-query';
import { CreateCategoryGroupRequest, spaceRoles } from '@walti/shared';
import { ChevronsDownUp, ChevronsUpDown, FolderPlus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { categoriesQuery } from '@/features/categories/categoriesApi';
import { CategoryGroupCard } from '@/features/categories/components/categoryGroupCard';
import { useCreateCategoryGroup } from '@/features/categories/hooks/useCategoryMutations';
import { EmptyState } from '@/shared/components/emptyState';
import { LoadingState } from '@/shared/components/loadingState';
import { NameForm } from '@/shared/components/nameForm';
import { QuerySuspense } from '@/shared/components/querySuspense';
import type { Space } from '@/shared/spaces/spacesApi';
import { useActiveSpace } from '@/shared/spaces/spacesContext';

export const CategoriesScreen = () => {
	const space = useActiveSpace();

	if (!space) {
		return <LoadingState rows={3} label="Cargando tu espacio" />;
	}

	return (
		<QuerySuspense
			resetKeys={[space.id]}
			loading={<LoadingState rows={3} label="Cargando tus categorías" />}
		>
			<CategoriesScreenContent space={space} />
		</QuerySuspense>
	);
};

const CategoriesScreenContent = ({ space }: { space: Space }) => {
	const [creating, setCreating] = useState(false);
	// Which groups are unfolded. Lifted here so one control can fold them all.
	const [openGroups, setOpenGroups] = useState<ReadonlySet<string>>(new Set());
	const { data: groups } = useSuspenseQuery(categoriesQuery(space.id));
	const create = useCreateCategoryGroup(space.id);

	const canEdit = space.role === spaceRoles.owner;

	const groupNames = groups.map((group) => group.name);
	const activeGroups = groups.filter((group) => !group.archivedAt);
	const anyOpen = openGroups.size > 0;

	const toggleGroup = (groupId: string) =>
		setOpenGroups((current) => {
			const next = new Set(current);

			if (!next.delete(groupId)) {
				next.add(groupId);
			}

			return next;
		});

	// One tap always lands somewhere clean: everything closed, or everything
	// open.
	const toggleAll = () =>
		setOpenGroups(anyOpen ? new Set() : new Set(groups.map((group) => group.id)));

	return (
		<section className="space-y-4 py-2">
			<header className="space-y-1">
				<h1 className="text-lg font-semibold">Categorías de {space.name}</h1>
				<p className="text-sm text-muted-foreground">
					{canEdit
						? 'Ajústalas a cómo gastas de verdad. Archivar nunca borra el histórico.'
						: 'Quien administra el espacio decide su estructura.'}
				</p>
			</header>

			{canEdit && creating ? (
				<div className="rounded-xl border border-border p-3">
					<NameForm
						schema={CreateCategoryGroupRequest}
						label="Nombre del grupo"
						submitLabel="Crear grupo"
						placeholder="Alimentación"
						maxLength={40}
						takenNames={groupNames}
						duplicateMessage="Ya tienes un grupo con ese nombre."
						pending={create.isPending}
						onCancel={() => setCreating(false)}
						onSubmit={(name) =>
							create.mutate(name, { onSuccess: () => setCreating(false) })
						}
					/>
				</div>
			) : (
				<div className="flex flex-wrap items-center gap-2">
					{canEdit ? (
						<Button onClick={() => setCreating(true)}>
							<Plus className="size-4" aria-hidden="true" />
							Crear grupo
						</Button>
					) : null}

					{groups.length > 0 ? (
						<Button variant="ghost" onClick={toggleAll}>
							{anyOpen ? (
								<ChevronsDownUp className="size-4" aria-hidden="true" />
							) : (
								<ChevronsUpDown className="size-4" aria-hidden="true" />
							)}
							{anyOpen ? 'Plegar todo' : 'Desplegar todo'}
						</Button>
					) : null}
				</div>
			)}

			{groups.length > 0 ? (
				<div className="space-y-3">
					{groups.map((group) => (
						<CategoryGroupCard
							key={group.id}
							spaceId={space.id}
							group={group}
							groups={activeGroups}
							groupNames={groupNames.filter((name) => name !== group.name)}
							canEdit={canEdit}
							open={openGroups.has(group.id)}
							onToggle={() => toggleGroup(group.id)}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon={FolderPlus}
					title="Sin categorías todavía"
					description="Crea un grupo para empezar a ordenar tus gastos."
				/>
			)}
		</section>
	);
};
