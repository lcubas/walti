import { EventsScreenContent } from '@/features/events/components/eventsScreenContent';
import { LoadingState } from '@/shared/components/loadingState';
import { QuerySuspense } from '@/shared/components/querySuspense';
import { useActiveSpace } from '@/shared/spaces/spacesContext';

export const EventsScreen = () => {
	const space = useActiveSpace();

	if (!space) {
		return <LoadingState rows={3} label="Cargando tu espacio" />;
	}

	return (
		<QuerySuspense
			resetKeys={[space.id]}
			loading={<LoadingState rows={3} label="Cargando tus eventos" />}
		>
			<EventsScreenContent space={space} />
		</QuerySuspense>
	);
};
