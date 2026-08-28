import { SessionUser } from '@walti/shared';
import { ApiError } from '@/shared/api/apiError';
import { request, requestNoContent } from '@/shared/api/httpClient';

export const sessionQueryKey = ['session'] as const;

/**
 * Not being signed in is an answer, not a failure: the API says so with a 401
 * and this resolves to null, so no screen has to render an error for it.
 */
export const fetchSession = async (
	signal?: AbortSignal,
): Promise<SessionUser | null> => {
	try {
		return await request('/v1/auth/me', SessionUser, { signal });
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) {
			return null;
		}

		throw error;
	}
};

export const signOut = (): Promise<void> =>
	requestNoContent('/v1/auth/logout', { method: 'POST' });
