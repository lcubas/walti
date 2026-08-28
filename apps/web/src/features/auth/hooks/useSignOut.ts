import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { notifyFailed } from '@/shared/notify';
import { paths } from '@/shared/routes';
import { sessionQueryKey, signOut } from '@/features/auth/sessionApi';

export const useSignOut = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signOut,
		onSuccess: () => {
			// Dropping the cookie is not enough: whatever was already fetched stays
			// in memory, and the next person on this phone would see it.
			queryClient.clear();
			queryClient.setQueryData(sessionQueryKey, null);
			navigate(paths.signIn, { replace: true });
		},
		// A sign out that never reached the server left the cookie alive. Saying so
		// beats a login screen that waves the same person straight back in.
		onError: (error) => notifyFailed('No pudimos cerrar tu sesión', error),
	});
};
