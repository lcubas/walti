import { useMutation } from '@tanstack/react-query';
import { SessionUser } from '@walti/shared';
import { useNavigate } from 'react-router';
import { request } from '@/shared/api/httpClient';
import { paths } from '@/shared/routes';

export const useSignIn = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (idToken: string) =>
			request('/v1/auth/google', SessionUser, {
				method: 'POST',
				body: { idToken },
			}),
		onSuccess: () => navigate(paths.inicio, { replace: true }),
	});
};
