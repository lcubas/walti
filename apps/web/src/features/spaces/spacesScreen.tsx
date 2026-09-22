import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { CreateSpaceRequest } from '@walti/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateSpace } from '@/features/spaces/hooks/useSpaceMutations';
import { NameForm } from '@/shared/components/nameForm';
import { ErrorState } from '@/shared/components/errorState';
import { LoadingState } from '@/shared/components/loadingState';
import { spacesQuery } from '@/shared/spaces/spacesApi';
import { SpaceRow } from '@/features/spaces/components/spaceRow';

export const SpacesScreen = () => {
	const spaces = useQuery(spacesQuery);
	const [creating, setCreating] = useState(false);
	const create = useCreateSpace();

	if (spaces.isPending) {
		return <LoadingState rows={2} label="Cargando tus espacios" />;
	}

	if (spaces.isError) {
		return <ErrorState error={spaces.error} onRetry={() => spaces.refetch()} />;
	}

	// Archived ones count: freeing the name would only move the clash to the
	// moment the space comes back.
	const otherNames = (spaceId: string) =>
		spaces.data
			.filter((space) => space.id !== spaceId)
			.map((space) => space.name);

	const active = spaces.data.filter((space) => !space.archivedAt);
	const archived = spaces.data.filter((space) => space.archivedAt);

	return (
		<section className="space-y-6 py-2">
			<header className="space-y-1">
				<h1 className="text-lg font-semibold">Tus espacios</h1>
				<p className="text-sm text-muted-foreground">
					Cada espacio guarda sus propios gastos, su plan y su análisis.
				</p>
			</header>

			{creating ? (
				<div className="rounded-xl border border-border p-3">
					<NameForm
						schema={CreateSpaceRequest}
						placeholder="Hogar"
						duplicateMessage="Ya tienes un espacio con ese nombre."
						label="Nombre del espacio"
						submitLabel="Crear espacio"
						takenNames={spaces.data.map((space) => space.name)}
						pending={create.isPending}
						onCancel={() => setCreating(false)}
						onSubmit={(name) =>
							create.mutate(name, { onSuccess: () => setCreating(false) })
						}
					/>
				</div>
			) : (
				<Button onClick={() => setCreating(true)}>
					<Plus className="size-4" aria-hidden="true" />
					Crear espacio
				</Button>
			)}

			<ul className="space-y-2">
				{active.map((space) => (
					<SpaceRow
						key={space.id}
						space={space}
						canArchive={!space.isDefault && active.length > 1}
						takenNames={otherNames(space.id)}
					/>
				))}
			</ul>

			{archived.length > 0 ? (
				<section className="space-y-2">
					<h2 className="text-sm font-medium text-muted-foreground">
						Archivados
					</h2>

					<ul className="space-y-2">
						{archived.map((space) => (
							<SpaceRow
								key={space.id}
								space={space}
								canArchive={false}
								takenNames={otherNames(space.id)}
							/>
						))}
					</ul>
				</section>
			) : null}
		</section>
	);
};
