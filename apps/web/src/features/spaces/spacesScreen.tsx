import { SpacesScreenContent } from '@/features/spaces/components/spacesScreenContent';
import { LoadingState } from '@/shared/components/loadingState';
import { QuerySuspense } from '@/shared/components/querySuspense';

export const SpacesScreen = () => (
	<QuerySuspense
		loading={<LoadingState rows={2} label="Cargando tus espacios" />}
	>
		<SpacesScreenContent />
	</QuerySuspense>
);
