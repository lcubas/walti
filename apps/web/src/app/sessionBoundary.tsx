import { Loader2 } from 'lucide-react';
import { Outlet } from 'react-router';
import { useSession } from '@/features/auth/hooks/useSession';
import { ErrorState } from '@/shared/components/errorState';

const BootScreen = () => (
	<div
		role="status"
		aria-busy="true"
		aria-live="polite"
		className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground"
	>
		<Loader2 className="size-6 animate-spin" aria-hidden="true" />
		<span className="sr-only">Abriendo Walti</span>
	</div>
);

/**
 * Resolves the session before anything renders, so a reload never flashes the
 * login screen at someone who is already signed in.
 */
export const SessionBoundary = () => {
	const session = useSession();

	if (session.isPending) {
		return <BootScreen />;
	}

	// Not reaching the API is the one failure that leaves the app with nothing
	// to show. Not being signed in is not a failure: it resolves to null.
	if (session.isError) {
		return (
			<main className="flex min-h-dvh items-center justify-center bg-background">
				<ErrorState
					error={session.error}
					onRetry={() => {
						void session.refetch();
					}}
				/>
			</main>
		);
	}

	return <Outlet />;
};
