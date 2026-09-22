import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/shared/components/emptyState';
import { useNewExpenseDrawer } from '@/shared/expenses/newExpenseDrawerContext';

export const ExpensesScreen = () => {
	const { openDrawer } = useNewExpenseDrawer();

	return (
		<>
			<h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>

			<EmptyState
				icon={Receipt}
				title="Todavía no hay gastos"
				description="Aquí verás todo lo que registres en este espacio, con sus categorías y filtros."
				action={<Button onClick={openDrawer}>Registrar el primero</Button>}
			/>
		</>
	);
};
