import { useSuspenseQuery } from '@tanstack/react-query';
import { CalendarRange } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { EventDetail } from '@/features/events/components/eventDetail';
import { eventsQuery } from '@/features/events/eventsApi';
import { EmptyState } from '@/shared/components/emptyState';
import { paths } from '@/shared/routes';
import type { Space } from '@/shared/spaces/spacesApi';

type EventScreenContentProps = { space: Space; eventId: string };

export const EventScreenContent = ({
	space,
	eventId,
}: EventScreenContentProps) => {
	const { data: events } = useSuspenseQuery(eventsQuery(space.id));
	const event = events.find((candidate) => candidate.id === eventId);

	if (!event) {
		return (
			<EmptyState
				icon={CalendarRange}
				title="Evento no encontrado"
				description="Puede que ya no exista o que el enlace esté mal escrito."
				action={
					<Button variant="outline" render={<Link to={paths.events} />}>
						Volver a eventos
					</Button>
				}
			/>
		);
	}

	return <EventDetail space={space} event={event} />;
};
