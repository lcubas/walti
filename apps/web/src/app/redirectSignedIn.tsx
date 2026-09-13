import { Navigate, Outlet, useLocation } from 'react-router';
import { useSession } from '@/features/auth/hooks/useSession';
import { paths } from '@/shared/routes';

/**
 * The other side of the gate: nobody already inside should see the door. It is
 * also what lands the user after signing in — the sign-in screen only marks the
 * session, and this reads the destination RequireSession left behind. One place
 * decides where a signed-in user goes.
 */
export const RedirectSignedIn = () => {
	const { data: user } = useSession();
	const { from } = useLocation().state ?? {};

	return user ? <Navigate to={from ?? paths.home} replace /> : <Outlet />;
};
