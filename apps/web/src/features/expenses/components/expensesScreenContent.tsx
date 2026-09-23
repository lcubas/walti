import { useSuspenseQuery } from '@tanstack/react-query';
import type { Expense } from '@walti/shared';
import { Receipt } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { categoriesQuery } from '@/features/categories/categoriesApi';
import { ExpenseDayGroup } from '@/features/expenses/components/expenseDayGroup';
import { expensesQuery } from '@/features/expenses/expensesApi';
import { eventsQuery } from '@/features/events/eventsApi';
import { paymentSourcesQuery } from '@/features/paymentSources/paymentSourcesApi';
import { formatMoney } from '@/lib/format/money';
import { EmptyState } from '@/shared/components/emptyState';
import { useNewExpenseDrawer } from '@/shared/expenses/newExpenseDrawerContext';
import type { Space } from '@/shared/spaces/spacesApi';

export type DisplayExpense = Expense & {
	categoryName: string;
	paymentSourceName: string | null;
	eventName: string | null;
};

type ExpensesScreenContentProps = { space: Space; period: string };

export const ExpensesScreenContent = ({
	space,
	period,
}: ExpensesScreenContentProps) => {
	const { data: expenses } = useSuspenseQuery(expensesQuery(space.id, period));
	const { data: groups } = useSuspenseQuery(categoriesQuery(space.id));
	const { data: paymentSources } = useSuspenseQuery(paymentSourcesQuery);
	const { data: events } = useSuspenseQuery(eventsQuery(space.id));
	const { openDrawer } = useNewExpenseDrawer();
	const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(
		null,
	);
	const toggleExpense = (expenseId: string) =>
		setExpandedExpenseId((current) =>
			current === expenseId ? null : expenseId,
		);

	if (expenses.length === 0) {
		return (
			<EmptyState
				icon={Receipt}
				title="Sin gastos este mes"
				description="Todavía no registraste nada en este periodo."
				action={<Button onClick={openDrawer}>Registrar un gasto</Button>}
			/>
		);
	}

	// Categories are archived, never deleted, so every categoryId an expense
	// carries resolves here — active or not.
	const categoryNames = new Map(
		groups.flatMap((group) =>
			group.categories.map((category) => [category.id, category.name] as const),
		),
	);
	const paymentSourceNames = new Map(
		paymentSources.map((source) => [source.id, source.name] as const),
	);
	// Events are archived, never deleted, so a past expense's eventId still
	// resolves here even after its event is archived.
	const eventNames = new Map(
		events.map((event) => [event.id, event.name] as const),
	);

	const displayExpenses: DisplayExpense[] = expenses.map((expense) => ({
		...expense,
		categoryName: categoryNames.get(expense.categoryId) ?? 'Categoría',
		paymentSourceName: expense.paymentSourceId
			? (paymentSourceNames.get(expense.paymentSourceId) ?? null)
			: null,
		eventName: expense.eventId
			? (eventNames.get(expense.eventId) ?? null)
			: null,
	}));

	const total = displayExpenses.reduce(
		(sum, expense) => sum + expense.amountCents,
		0,
	);

	// The API already orders by occurredOn desc; grouping only has to
	// preserve that order, never re-sort it.
	const days: { occurredOn: string; expenses: DisplayExpense[] }[] = [];

	for (const expense of displayExpenses) {
		const currentGroup = days.at(-1);

		if (currentGroup && currentGroup.occurredOn === expense.occurredOn) {
			currentGroup.expenses.push(expense);
		} else {
			days.push({ occurredOn: expense.occurredOn, expenses: [expense] });
		}
	}

	return (
		<div className="space-y-6">
			<p className="text-3xl font-semibold">
				{formatMoney(total, space.currency)}
			</p>

			<div className="space-y-5">
				{days.map((day) => (
					<ExpenseDayGroup
						key={day.occurredOn}
						spaceId={space.id}
						occurredOn={day.occurredOn}
						expenses={day.expenses}
						currency={space.currency}
						expandedExpenseId={expandedExpenseId}
						onToggleExpense={toggleExpense}
					/>
				))}
			</div>
		</div>
	);
};
