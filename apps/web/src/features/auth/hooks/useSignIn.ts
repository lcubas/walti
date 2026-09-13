import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionUser } from '@walti/shared';
import { sessionQueryKey } from '@/features/auth/sessionApi';
import { request } from '@/shared/api/httpClient';

export const useSignIn = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (idToken: string) =>
			request('/v1/auth/google', SessionUser, {
				method: 'POST',
				body: { idToken },
			}),
		onSuccess: (user) => {
			// The API just told us who this is; asking it again would only add a
			// wait. Setting it is also the whole navigation: RedirectSignedIn is
			// mounted on this very route and takes the user from here.
			queryClient.setQueryData(sessionQueryKey, user);
		},
	});
};
