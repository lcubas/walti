import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/shared/api/apiError';

type ErrorCopy = { title: string; hint: string; canRetry: boolean };

const describe = (error: unknown): ErrorCopy => {
	if (!(error instanceof ApiError)) {
		return {
			title: 'Algo se rompió en la app',
			hint: 'Recarga la página para continuar.',
			canRetry: false,
		};
	}

	if (error.code === 'network_error') {
		return {
			title: 'Sin conexión con el servidor',
			hint: 'Revisa tu conexión e inténtalo otra vez.',
			canRetry: true,
		};
	}

	if (error.code === 'contract_violation') {
		return {
			title: 'La app y el servidor no se entienden',
			hint: 'Recarga la página para actualizar la app.',
			canRetry: false,
		};
	}

	if (error.status === 401) {
		return {
			title: 'Tu sesión caducó',
			hint: 'Vuelve a entrar para continuar.',
			canRetry: false,
		};
	}

	if (error.status === 403) {
		return {
			title: 'No tienes acceso a esto',
			hint: 'Pídeselo a quien administra el espacio.',
			canRetry: false,
		};
	}

	if (error.status === 404) {
		return {
			title: 'No encontramos lo que buscabas',
			hint: 'Puede que se haya eliminado.',
			canRetry: false,
		};
	}

	if (error.status >= 500) {
		return {
			title: 'El servidor tuvo un problema',
			hint: 'Inténtalo de nuevo en unos segundos.',
			canRetry: true,
		};
	}

	return {
		title: error.message,
		hint: 'Revisa los datos e inténtalo otra vez.',
		canRetry: true,
	};
};

type ErrorStateProps = { error: unknown; onRetry?: () => void };

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
	const { title, hint, canRetry } = describe(error);
	const details = error instanceof ApiError ? error.details : [];

	return (
		<div
			role="alert"
			className="flex flex-col items-center px-6 py-12 text-center"
		>
			<span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
				<TriangleAlert className="size-6" aria-hidden="true" />
			</span>

			<h2 className="mt-4 text-base font-medium">{title}</h2>
			<p className="mt-1 max-w-xs text-sm text-balance text-muted-foreground">
				{hint}
			</p>

			{details.length > 0 ? (
				<ul className="mt-3 space-y-1 text-left text-xs text-muted-foreground">
					{details.map((detail) => (
						<li key={`${detail.field}-${detail.message}`}>
							<span className="font-medium text-foreground">
								{detail.field}
							</span>
							: {detail.message}
						</li>
					))}
				</ul>
			) : null}

			{canRetry && onRetry ? (
				<Button variant="outline" onClick={onRetry} className="mt-5">
					Reintentar
				</Button>
			) : null}
		</div>
	);
};
