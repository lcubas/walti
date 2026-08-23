import { Outlet } from 'react-router';
import { PendingScreen } from '../../shared/components/pendingScreen';

export const ExpensesScreen = () => (
	<>
		<PendingScreen title="Gastos" />
		<Outlet />
	</>
);
