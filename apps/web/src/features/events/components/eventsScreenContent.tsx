import { spaceRoles } from '@walti/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CalendarRange, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventRow } from '@/features/events/components/eventRow';
import { NewEventForm } from '@/features/events/components/newEventForm';
import { eventsQuery } from '@/features/events/eventsApi';
import { todayCivilDate } from '@/lib/format/date';
import { EmptyState } from '@/shared/components/emptyState';
import type { Space } from '@/shared/spaces/spacesApi';

export const EventsScreenContent = ({ space }: { space: Space }) => {
	const { data: events } = useSuspenseQuery(eventsQuery(space.id));
	const [creating, setCreating] = useState(false);

	const canEdit = space.role === spaceRoles.owner;
	const today = todayCivilDate();
	const active = events.filter((event) => !event.archivedAt);
	const current = active.filter((event) => event.endsOn >= today);
	const past = active.filter((event) => event.endsOn < today);
	const archived = events.filter((event) => event.archivedAt);

	return (
		<section className="space-y-4 py-2">
			<header className="space-y-1">
				<h1 className="text-lg font-semibold">Eventos de {space.name}</h1>
				<p className="text-sm text-muted-foreground">
					{canEdit
						? 'Agrupa los gastos de un viaje, una celebración o cualquier ocasión con fecha propia.'
						: 'Quien administra el espacio crea y edita los eventos.'}
				</p>
			</header>

			{canEdit && creating ? (
				<div className="rounded-xl border border-border p-3">
					<NewEventForm
						spaceId={space.id}
						onCreated={() => setCreating(false)}
						onCancel={() => setCreating(false)}
					/>
				</div>
			) : canEdit ? (
				<Button onClick={() => setCreating(true)}>
					<Plus className="size-4" aria-hidden="true" />
					Crear evento
				</Button>
			) : null}

			{events.length === 0 ? (
				<EmptyState
					icon={CalendarRange}
					title="Sin eventos todavía"
					description="Crea uno para agrupar los gastos de una ocasión con fecha propia."
				/>
			) : (
				<div className="space-y-4">
					{current.length > 0 ? (
						<section className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Vigentes
							</h3>

							<ul className="space-y-2">
								{current.map((event) => (
									<EventRow
										key={event.id}
										spaceId={space.id}
										event={event}
										canEdit={canEdit}
									/>
								))}
							</ul>
						</section>
					) : null}

					{past.length > 0 ? (
						<section className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Pasados
							</h3>

							<ul className="space-y-2">
								{past.map((event) => (
									<EventRow
										key={event.id}
										spaceId={space.id}
										event={event}
										canEdit={canEdit}
									/>
								))}
							</ul>
						</section>
					) : null}

					{archived.length > 0 ? (
						<section className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Archivados
							</h3>

							<ul className="space-y-2">
								{archived.map((event) => (
									<EventRow
										key={event.id}
										spaceId={space.id}
										event={event}
										canEdit={canEdit}
									/>
								))}
							</ul>
						</section>
					) : null}
				</div>
			)}
		</section>
	);
};
