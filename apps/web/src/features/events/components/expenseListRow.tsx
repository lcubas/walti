import type { Expense } from '@walti/shared';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { cn } from '@/lib/utils';
import type { Space } from '@/shared/spaces/spacesApi';

const DetailField = ({ label, value }: { label: string; value: string }) => (
	<div className="space-y-0.5">
		<p className="text-xs text-muted-foreground">{label}</p>
		<p className="text-sm font-medium">{value}</p>
	</div>
);

export const ExpenseListRow = ({
	expense,
	title,
	subtitle,
	currency,
	selected,
	detail,
}: {
	expense: Expense;
	title: string;
	subtitle: string | null;
	currency: Space['currency'];
	selected?: { checked: boolean; onToggle: () => void };
	detail?: {
		expanded: boolean;
		onToggle: () => void;
		paymentSourceName: string | null;
	};
}) => {
	const detailId = `event-expense-detail-${expense.id}`;

	const info = (
		<span className="flex min-w-0 flex-1 flex-col">
			<span className="truncate text-sm font-medium">{title}</span>
			<span className="truncate text-xs text-muted-foreground">
				{formatCivilDate(expense.occurredOn)}
				{subtitle ? ` · ${subtitle}` : ''}
			</span>
		</span>
	);

	const amount = (
		<span className="shrink-0 text-sm font-semibold tabular-nums">
			{formatMoney(expense.amountCents, currency)}
		</span>
	);

	return (
		<li className="overflow-hidden rounded-xl border border-border">
			<div className="flex items-center gap-3 p-3">
				{selected ? (
					<Checkbox
						checked={selected.checked}
						onCheckedChange={() => selected.onToggle()}
						aria-label={`Seleccionar gasto de ${title}`}
					/>
				) : null}

				{detail ? (
					<button
						type="button"
						onClick={detail.onToggle}
						aria-expanded={detail.expanded}
						aria-controls={detailId}
						className="flex min-w-0 flex-1 items-center gap-3 text-left"
					>
						{info}
						{amount}
						<ChevronDown
							className={cn(
								'size-4 shrink-0 text-muted-foreground transition-transform',
								detail.expanded && 'rotate-180',
							)}
							aria-hidden="true"
						/>
					</button>
				) : (
					<>
						{info}
						{amount}
					</>
				)}
			</div>

			{detail?.expanded ? (
				<section
					id={detailId}
					role="region"
					className="space-y-4 border-t border-border p-3"
				>
					<div className="grid grid-cols-2 gap-4">
						<DetailField
							label="Fecha"
							value={formatCivilDate(expense.occurredOn)}
						/>

						{detail.paymentSourceName ? (
							<DetailField
								label="Fuente de pago"
								value={detail.paymentSourceName}
							/>
						) : null}
					</div>

					{expense.note ? (
						<DetailField label="Nota" value={expense.note} />
					) : null}
				</section>
			) : null}
		</li>
	);
};
