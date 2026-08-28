import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/app/layout/appLayout';
import { SessionBoundary } from '@/app/sessionBoundary';
import { AccountScreen } from '@/features/account/accountScreen';
import { LoginScreen } from '@/features/auth/loginScreen';
import { paths } from '@/shared/routes';
import { ExpensesScreen } from '@/features/expenses/expensesScreen';
import { NewExpenseDrawer } from '@/features/expenses/newExpenseDrawer';
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
						element: <ExpensesScreen />,
						children: [{ path: 'nuevo', element: <NewExpenseDrawer /> }],
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
						element: <AccountScreen />,
					},
					{
						path: '*',
						element: <PendingScreen title="Página no encontrada" />,
					},
				],
			},
			{
				path: paths.signIn,
				element: <LoginScreen />,
			},
		],
	},
]);
