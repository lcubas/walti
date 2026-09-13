import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/app/layout/appLayout';
import { SessionBoundary } from '@/app/sessionBoundary';
import { paths } from '@/shared/routes';
import { PendingScreen } from '@/shared/components/pendingScreen';

export const router = createBrowserRouter([
	{
		element: <SessionBoundary />,
		children: [
			{
				element: <AppLayout />,
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
						children: [
							{
								path: 'nuevo',
								lazy: () =>
									import('@/features/expenses/newExpenseDrawer').then((m) => ({
										Component: m.NewExpenseDrawer,
									})),
							},
						],
					},
					{
						path: paths.expense,
						element: <PendingScreen title="Detalle del gasto" />,
					},
					{
						path: paths.event,
						element: <PendingScreen title="Detalle del evento" />,
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
			},
			{
				path: paths.signIn,
				lazy: () =>
					import('@/features/auth/loginScreen').then((m) => ({
						Component: m.LoginScreen,
					})),
			},
		],
	},
]);
