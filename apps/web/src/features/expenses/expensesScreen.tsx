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
				// This button renders an anchor, so it is not a native button and
				// Base UI has to be told, or it warns and keeps button semantics
				// that the <a> cannot honour.
				<Button
					nativeButton={false}
					render={<Link to={paths.newExpense}>Registrar el primero</Link>}
				/>
			}
		/>

		<Outlet />
	</>
);
