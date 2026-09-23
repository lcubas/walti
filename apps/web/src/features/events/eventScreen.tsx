import { useParams } from 'react-router';
import { EventScreenContent } from '@/features/events/components/eventScreenContent';
import { LoadingState } from '@/shared/components/loadingState';
import { QuerySuspense } from '@/shared/components/querySuspense';
import { useActiveSpace } from '@/shared/spaces/spacesContext';

export const EventScreen = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const space = useActiveSpace();

	if (!space || !eventId) {
		return <LoadingState rows={3} label="Cargando el evento" />;
	}

	return (
		<QuerySuspense
			resetKeys={[space.id, eventId]}
			loading={<LoadingState rows={3} label="Cargando el evento" />}
		>
			<EventScreenContent space={space} eventId={eventId} />
		</QuerySuspense>
	);
};
