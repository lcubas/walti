import { createBrowserRouter } from 'react-router';
import { AppLayout } from './layout/appLayout';
import { paths } from '../shared/routes';
import { ExpensesScreen } from '../features/expenses/expensesScreen';
import { NewExpenseDrawer } from '../features/expenses/newExpenseDrawer';
import { PendingScreen } from '../shared/components/pendingScreen';

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: paths.inicio,
				element: <PendingScreen title="Inicio" />,
			},
			{
				path: paths.gastos,
				element: <ExpensesScreen />,
				children: [{ path: 'nuevo', element: <NewExpenseDrawer /> }],
			},
			{
				path: paths.gasto,
				element: <PendingScreen title="Detalle del gasto" />,
			},
			{
				path: paths.evento,
				element: <PendingScreen title="Detalle del evento" />,
			},
			{
				path: paths.plan,
				element: <PendingScreen title="Plan del mes" />,
			},
			{
				path: paths.recurrentes,
				element: <PendingScreen title="Gastos recurrentes" />,
			},
			{
				path: paths.analisis,
				element: <PendingScreen title="Análisis" />,
			},
			{
				path: paths.analisisMios,
				element: <PendingScreen title="Análisis · Míos" />,
			},
			{
				path: paths.espacio,
				element: <PendingScreen title="Ajustes del espacio" />,
			},
			{
				path: paths.cuenta,
				element: <PendingScreen title="Tu cuenta" />,
			},
			{
				path: '*',
				element: <PendingScreen title="Página no encontrada" />,
			},
		],
	},
	{
		path: paths.entrar,
		element: <PendingScreen title="Acceso" />,
	},
]);
