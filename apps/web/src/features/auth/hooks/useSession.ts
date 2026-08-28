import { useQuery } from '@tanstack/react-query';
import { fetchSession, sessionQueryKey } from '@/features/auth/sessionApi';

/**
 * Who is using the app. SessionBoundary resolves it once before anything
 * renders, so every later caller reads it straight from the cache. React Query
 * is the store; there is no separate context wrapping it.
 */
export const useSession = () =>
	useQuery({
		queryKey: sessionQueryKey,
		queryFn: ({ signal }) => fetchSession(signal),
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
	});
