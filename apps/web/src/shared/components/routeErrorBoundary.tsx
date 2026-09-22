import { useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/shared/components/errorState';

/**
 * The last line before a white screen. React Router hands it anything a screen
 * threw while rendering, which is the one failure a query's error state cannot
 * cover.
 */
export const RouteErrorBoundary = () => {
	const error = useRouteError();

	return (
		<ErrorState
			error={error}
			action={
				<Button variant="outline" onClick={() => window.location.reload()}>
					Recargar
				</Button>
			}
		/>
	);
};
