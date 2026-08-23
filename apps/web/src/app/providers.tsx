import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ApiError } from '../shared/api/apiError';
import { SpacesProvider } from '../shared/spaces/spacesContext';

const queryClient = new QueryClient({
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
		<SpacesProvider>{children}</SpacesProvider>
	</QueryClientProvider>
);
