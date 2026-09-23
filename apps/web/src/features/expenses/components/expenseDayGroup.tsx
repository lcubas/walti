import type { Currency } from '@walti/shared';
import { ExpenseRow } from '@/features/expenses/components/expenseRow';
import type { DisplayExpense } from '@/features/expenses/components/expensesScreenContent';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';

type ExpenseDayGroupProps = {
	occurredOn: string;
	expenses: DisplayExpense[];
	currency: Currency;
	expandedExpenseId: string | null;
	onToggleExpense: (expenseId: string) => void;
};

export const ExpenseDayGroup = ({
	occurredOn,
	expenses,
	currency,
	expandedExpenseId,
	onToggleExpense,
}: ExpenseDayGroupProps) => {
	const subtotal = expenses.reduce(
		(sum, expense) => sum + expense.amountCents,
		0,
	);

	return (
		<section className="space-y-2">
			<header className="flex items-baseline justify-between px-1">
				<h3 className="text-sm font-medium text-muted-foreground">
					{formatCivilDate(occurredOn)}
				</h3>

				<span className="text-sm font-medium text-muted-foreground tabular-nums">
					{formatMoney(subtotal, currency)}
				</span>
			</header>

			<div className="space-y-2">
				{expenses.map((expense) => (
					<ExpenseRow
						key={expense.id}
						expense={expense}
						currency={currency}
						expanded={expandedExpenseId === expense.id}
						onToggle={() => onToggleExpense(expense.id)}
					/>
				))}
			</div>
		</section>
	);
};
