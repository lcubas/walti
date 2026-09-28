import { spaceRoles } from '@walti/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Plus, Repeat } from 'lucide-react';
import { useState } from 'react';
import { NewRecurringItemForm } from '@/features/recurring/components/newRecurringItemForm';
import { RecurringItemRow } from '@/features/recurring/components/recurringItemRow';
import { recurringItemsQuery } from '@/features/recurring/recurringApi';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/shared/components/emptyState';
import type { Space } from '@/shared/spaces/spacesApi';

export const RecurringScreenContent = ({ space }: { space: Space }) => {
	const { data: items } = useSuspenseQuery(recurringItemsQuery(space.id));
	const [creating, setCreating] = useState(false);
	const canEdit = space.role === spaceRoles.owner;
	const main = items.filter((item) => !item.archivedAt);
	const archived = items.filter((item) => item.archivedAt);

	return (
		<section className="space-y-4 py-2">
			<header className="space-y-1">
				<h1 className="text-lg font-semibold">Recurrentes de {space.name}</h1>
				<p className="text-sm text-muted-foreground">
					{canEdit
						? 'Gastos que se repiten cada mes o cada año, como una suscripción o un servicio.'
						: 'Quien administra el espacio crea y edita los recurrentes.'}
				</p>
			</header>

			{canEdit && creating ? (
				<div className="rounded-xl border border-border p-3">
					<NewRecurringItemForm
						spaceId={space.id}
						currency={space.currency}
						onCreated={() => setCreating(false)}
						onCancel={() => setCreating(false)}
					/>
				</div>
			) : canEdit ? (
				<Button onClick={() => setCreating(true)}>
					<Plus className="size-4" aria-hidden="true" />
					Crear recurrente
				</Button>
			) : null}

			{items.length === 0 ? (
				<EmptyState
					icon={Repeat}
					title="Sin recurrentes todavía"
					description="Crea uno para llevar el control de un gasto que se repite cada mes o cada año."
				/>
			) : (
				<>
					{main.length > 0 ? (
						<ul className="space-y-2">
							{main.map((item) => (
								<RecurringItemRow
									key={item.id}
									spaceId={space.id}
									currency={space.currency}
									item={item}
									canEdit={canEdit}
								/>
							))}
						</ul>
					) : null}

					{archived.length > 0 ? (
						<section className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Archivados
							</h3>

							<ul className="space-y-2">
								{archived.map((item) => (
									<RecurringItemRow
										key={item.id}
										spaceId={space.id}
										currency={space.currency}
										item={item}
										canEdit={canEdit}
									/>
								))}
							</ul>
						</section>
					) : null}
				</>
			)}
		</section>
	);
};
