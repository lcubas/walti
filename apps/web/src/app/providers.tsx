import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { router } from '@/app/router';
import { Toaster } from '@/components/ui/toast';
import { sessionQueryKey } from '@/features/auth/sessionApi';
import { ApiError } from '@/shared/api/apiError';
import { notifyFailed } from '@/shared/notify';
import { paths } from '@/shared/routes';
import { SpacesProvider } from '@/shared/spaces/spacesContext';

/**
 * A 401 means the API stopped recognising us. Handled once here so no screen
 * has to remember to check. Booting without a session never lands here:
 * fetchSession turns that 401 into null instead of an error.
 */
const handleUnauthorized = (error: unknown) => {
	if (!(error instanceof ApiError) || error.status !== 401) {
		return;
	}

	// Nobody was signed in, so nothing expired.
	if (!queryClient.getQueryData(sessionQueryKey)) {
		return;
	}

	// Dropping the cookie is not enough: whatever was already fetched stays in
	// memory, and the next person on this phone would see it.
	queryClient.clear();
	queryClient.setQueryData(sessionQueryKey, null);
	notifyFailed('Tu sesión caducó');
	void router.navigate(paths.signIn, { replace: true });
};

const queryClient = new QueryClient({
	queryCache: new QueryCache({ onError: handleUnauthorized }),
	mutationCache: new MutationCache({ onError: handleUnauthorized }),
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				const isClientError =
					error instanceof ApiError &&
					error.status >= 400 &&
					error.status < 500;
				return isClientError ? false : failureCount < 1;
			},
		},
	},
});

export const Providers = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<SpacesProvider>
			{children}
			<Toaster />
		</SpacesProvider>
	</QueryClientProvider>
);
