import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionUser } from '@walti/shared';
import { useNavigate } from 'react-router';
import { request } from '@/shared/api/httpClient';
import { paths } from '@/shared/routes';
import { sessionQueryKey } from '@/features/auth/sessionApi';

export const useSignIn = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (idToken: string) =>
			request('/v1/auth/google', SessionUser, {
				method: 'POST',
				body: { idToken },
			}),
		onSuccess: (user) => {
			// The API just told us who this is; asking it again would only add a wait.
			queryClient.setQueryData(sessionQueryKey, user);
			navigate(paths.home, { replace: true });
		},
	});
};
