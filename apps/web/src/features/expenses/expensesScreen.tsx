import { useState } from 'react';
import { ExpensesScreenContent } from '@/features/expenses/components/expensesScreenContent';
import { MonthNav } from '@/features/expenses/components/monthNav';
import { currentPeriod } from '@/lib/format/date';
import { LoadingState } from '@/shared/components/loadingState';
import { QuerySuspense } from '@/shared/components/querySuspense';
import { useActiveSpace } from '@/shared/spaces/spacesContext';

export const ExpensesScreen = () => {
	const space = useActiveSpace();
	const [period, setPeriod] = useState(currentPeriod);

	if (!space) {
		return <LoadingState rows={3} label="Cargando tu espacio" />;
	}

	return (
		<div className="space-y-4 py-2">
			<MonthNav period={period} onChange={setPeriod} />

			<QuerySuspense
				resetKeys={[space.id, period]}
				loading={<LoadingState rows={4} label="Cargando tus gastos" />}
			>
				<ExpensesScreenContent space={space} period={period} />
			</QuerySuspense>
		</div>
	);
};
