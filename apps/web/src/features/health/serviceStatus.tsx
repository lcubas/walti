import { ApiError } from '../../shared/api/apiError';
import { useHealth } from './useHealth';

const StatusLine = ({ tone, label }: { tone: string; label: string }) => (
	<p className="flex items-center gap-2 text-sm text-muted-foreground">
		<span
			className={`inline-block size-2 rounded-full ${tone}`}
			aria-hidden="true"
		/>
		{label}
	</p>
);

export const ServiceStatus = () => {
	const { data, error, isPending } = useHealth();

	if (isPending) {
		return (
			<StatusLine tone="bg-muted-foreground" label="Comprobando el servicio…" />
		);
	}

	if (error) {
		const message =
			error instanceof ApiError ? error.message : 'Error desconocido.';
		return <StatusLine tone="bg-destructive" label={message} />;
	}

	const healthy = data.status === 'ok';

	return (
		<StatusLine
			tone={healthy ? 'bg-emerald-500' : 'bg-amber-500'}
			label={
				healthy
					? 'Servicio operativo'
					: `Servicio degradado · base de datos ${data.database}`
			}
		/>
	);
};
