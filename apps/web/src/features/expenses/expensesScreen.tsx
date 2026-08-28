import { Receipt } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/shared/components/emptyState';
import { paths } from '@/shared/routes';

export const ExpensesScreen = () => (
	<>
		<h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>

		<EmptyState
			icon={Receipt}
			title="Todavía no hay gastos"
			description="Aquí verás todo lo que registres en este espacio, con sus categorías y filtros."
			action={
				<Button
					render={<Link to={paths.newExpense}>Registrar el primero</Link>}
				/>
			}
		/>

		<Outlet />
	</>
);
