import { Navigate, Outlet, useLocation } from 'react-router';
import { useSession } from '@/features/auth/hooks/useSession';
import { paths } from '@/shared/routes';

/**
 * The gate for everything that is not the sign-in screen. SessionBoundary has
 * already resolved the session above, so this only reads it, and leaves behind
 * where the user was heading.
 */
export const RequireSession = () => {
	const { data: user } = useSession();
	const location = useLocation();

	if (!user) {
		const from = `${location.pathname}${location.search}`;

		return <Navigate to={paths.signIn} replace state={{ from }} />;
	}

	return <Outlet />;
};
