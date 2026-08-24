import { ErrorState } from '@/shared/components/errorState';
import { LoadingState } from '@/shared/components/loadingState';
import { useHealth } from '@/features/health/useHealth';

export const ServiceSection = () => {
	const { data, error, isPending, refetch } = useHealth();

	if (isPending) {
		return <LoadingState rows={1} label="Comprobando el servicio" />;
	}

	if (error) {
		return <ErrorState error={error} onRetry={() => refetch()} />;
	}

	const healthy = data.status === 'ok';

	return (
		<p className="flex items-center gap-2 text-sm text-muted-foreground">
			<span
				className={`inline-block size-2 rounded-full ${healthy ? 'bg-emerald-600' : 'bg-amber-600'}`}
				aria-hidden="true"
			/>
			{healthy
				? 'Servicio operativo'
				: `Servicio degradado · base de datos ${data.database}`}
		</p>
	);
};
