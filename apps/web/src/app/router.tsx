import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/app/layout/appLayout';
import { RedirectSignedIn } from '@/app/redirectSignedIn';
import { RequireSession } from '@/app/requireSession';
import { SessionBoundary } from '@/app/sessionBoundary';
import { PendingScreen } from '@/shared/components/pendingScreen';
import { RouteErrorBoundary } from '@/shared/components/routeErrorBoundary';
import { paths } from '@/shared/routes';
import { SpacesProvider } from '@/shared/spaces/spacesContext';

const screens = {
	errorElement: <RouteErrorBoundary />,
	children: [
		{
			path: paths.home,
			element: <PendingScreen title="Inicio" />,
		},
		{
			path: paths.expenses,
			lazy: () =>
				import('@/features/expenses/expensesScreen').then((m) => ({
					Component: m.ExpensesScreen,
				})),
		},
		{
			path: paths.expense,
			element: <PendingScreen title="Detalle del gasto" />,
		},
		{
			path: paths.events,
			lazy: () =>
				import('@/features/events/eventsScreen').then((m) => ({
					Component: m.EventsScreen,
				})),
		},
		{
			path: paths.event,
			lazy: () =>
				import('@/features/events/eventScreen').then((m) => ({
					Component: m.EventScreen,
				})),
		},
		{
			path: paths.plan,
			element: <PendingScreen title="Plan del mes" />,
		},
		{
			path: paths.recurring,
			element: <PendingScreen title="Gastos recurrentes" />,
		},
		{
			path: paths.analysis,
			element: <PendingScreen title="Análisis" />,
		},
		{
			path: paths.myAnalysis,
			element: <PendingScreen title="Análisis · Míos" />,
		},
		{
			path: paths.space,
			element: <PendingScreen title="Ajustes del espacio" />,
		},
		{
			path: paths.categories,
			lazy: () =>
				import('@/features/categories/categoriesScreen').then((m) => ({
					Component: m.CategoriesScreen,
				})),
		},
		{
			path: paths.spaces,
			lazy: () =>
				import('@/features/spaces/spacesScreen').then((m) => ({
					Component: m.SpacesScreen,
				})),
		},
		{
			path: paths.account,
			lazy: () =>
				import('@/features/account/accountScreen').then((m) => ({
					Component: m.AccountScreen,
				})),
		},
		{
			path: '*',
			element: <PendingScreen title="Página no encontrada" />,
		},
	],
};

export const router = createBrowserRouter([
	{
		element: <SessionBoundary />,
		// Nothing below rendered yet: there is no chrome to keep, so this one
		// takes the whole page.
		errorElement: <RouteErrorBoundary />,
		children: [
			{
				// Everything under here is behind the session by construction: a
				// screen added below is protected without anyone remembering to.
				element: <RequireSession />,
				children: [
					{
						// Inside the session on purpose: spaces belong to whoever is
						// signed in, so asking for them on the sign-in screen would only
						// earn a 401.
						element: (
							<SpacesProvider>
								<AppLayout />
							</SpacesProvider>
						),
						children: [screens],
					},
				],
			},
			{
				// The door is only a door for whoever is outside.
				element: <RedirectSignedIn />,
				children: [
					{
						path: paths.signIn,
						lazy: () =>
							import('@/features/auth/loginScreen').then((m) => ({
								Component: m.LoginScreen,
							})),
					},
				],
			},
		],
	},
]);
