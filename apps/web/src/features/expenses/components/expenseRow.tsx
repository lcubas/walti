import { ChevronDown } from 'lucide-react';
import type { Currency } from '@walti/shared';
import type { DisplayExpense } from '@/features/expenses/components/expensesScreenContent';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { cn } from '@/lib/utils';

const DetailField = ({ label, value }: { label: string; value: string }) => (
	<div className="space-y-0.5">
		<p className="text-xs text-muted-foreground">{label}</p>
		<p className="text-sm font-medium">{value}</p>
	</div>
);

type ExpenseRowProps = {
	expense: DisplayExpense;
	currency: Currency;
	expanded: boolean;
	onToggle: () => void;
};

export const ExpenseRow = ({
	expense,
	currency,
	expanded,
	onToggle,
}: ExpenseRowProps) => {
	const detailId = `expense-detail-${expense.id}`;

	return (
		<div
			className={cn(
				'overflow-hidden rounded-xl border border-border transition-colors',
				expanded && 'bg-accent/40',
			)}
		>
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={expanded}
				aria-controls={detailId}
				className="flex min-h-11 w-full items-center gap-3 p-3 text-left"
			>
				<span className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-sm font-medium">
						{expense.categoryName}
					</span>

					{expense.merchant ? (
						<span className="truncate text-xs text-muted-foreground">
							{expense.merchant}
						</span>
					) : null}
				</span>

				<span className="shrink-0 text-sm font-semibold tabular-nums">
					{formatMoney(expense.amountCents, currency)}
				</span>

				<ChevronDown
					className={cn(
						'size-4 shrink-0 text-muted-foreground transition-transform',
						expanded && 'rotate-180',
					)}
					aria-hidden="true"
				/>
			</button>

			{expanded ? (
				<section
					id={detailId}
					role="region"
					className="space-y-4 border-t border-border px-3 pt-3 pb-4"
				>
					<div className="grid grid-cols-2 gap-4">
						<DetailField
							label="Fecha"
							value={formatCivilDate(expense.occurredOn)}
						/>

						{expense.paymentSourceName ? (
							<DetailField
								label="Fuente de pago"
								value={expense.paymentSourceName}
							/>
						) : null}
					</div>

					{expense.note ? (
						<DetailField label="Nota" value={expense.note} />
					) : null}
				</section>
			) : null}
		</div>
	);
};
