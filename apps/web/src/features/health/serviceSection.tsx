import { useHealth } from '@/features/health/hooks/useHealth';

export const ServiceSection = () => {
	const { data } = useHealth();

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
