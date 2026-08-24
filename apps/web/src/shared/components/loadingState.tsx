/** biome-ignore-all lint/suspicious/noArrayIndexKey: Skeleton rows are static placeholders and have no persistent identity. */
import { Skeleton } from '@/components/ui/skeleton';

type LoadingStateProps = { rows?: number; label?: string };

export const LoadingState = ({
	rows = 3,
	label = 'Cargando',
}: LoadingStateProps) => (
	<div
		role="status"
		aria-busy="true"
		aria-live="polite"
		className="space-y-3 py-2"
	>
		<span className="sr-only">{label}</span>

		{Array.from({ length: rows }, (_, index) => (
			<div
				key={`row-${index}`}
				className="flex items-center gap-3"
				aria-hidden="true"
			>
				<Skeleton className="size-10 shrink-0 rounded-full" />

				<div className="flex-1 space-y-2">
					<Skeleton className="h-3.5 w-2/5 rounded" />
					<Skeleton className="h-3 w-3/5 rounded" />
				</div>

				<Skeleton className="h-4 w-16 shrink-0 rounded" />
			</div>
		))}
	</div>
);
