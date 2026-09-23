import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import type { Currency } from '@walti/shared';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditExpenseForm } from '@/features/expenses/components/editExpenseForm';
import type { DisplayExpense } from '@/features/expenses/components/expensesScreenContent';
import { useDeleteExpense } from '@/features/expenses/hooks/useExpenseMutations';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/shared/components/confirmDialog';

const DetailField = ({ label, value }: { label: string; value: string }) => (
	<div className="space-y-0.5">
		<p className="text-xs text-muted-foreground">{label}</p>
		<p className="text-sm font-medium">{value}</p>
	</div>
);

type ExpenseRowProps = {
	spaceId: string;
	expense: DisplayExpense;
	currency: Currency;
	expanded: boolean;
	onToggle: () => void;
};

/** Tapping a row expands its detail inline, right below it, instead of
 * opening a bottom drawer: a handful of fields is a quick glance, not an
 * action, so there's no reason to pull the person's eyes away from the
 * list they're scanning. Editing and deleting (WALTI-36) grow inside the
 * same expanded panel, in place of the read-only fields. */
export const ExpenseRow = ({
	spaceId,
	expense,
	currency,
	expanded,
	onToggle,
}: ExpenseRowProps) => {
	const detailId = `expense-detail-${expense.id}`;
	const [editing, setEditing] = useState(false);
	const deleteExpense = useDeleteExpense(spaceId);

	// Collapsing the row (e.g. to expand a different one) always leaves
	// edit mode, so re-expanding it later starts from the read-only view.
	useEffect(() => {
		if (!expanded) {
			setEditing(false);
		}
	}, [expanded]);

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
				<div id={detailId} role="region" className="border-t border-border p-3">
					{editing ? (
						<EditExpenseForm
							spaceId={spaceId}
							currency={currency}
							expense={expense}
							onCancel={() => setEditing(false)}
							onSaved={() => setEditing(false)}
						/>
					) : (
						<div className="space-y-4">
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

							<div className="flex gap-2 pt-1">
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-1.5"
									onClick={() => setEditing(true)}
								>
									<Pencil className="size-3.5" aria-hidden="true" />
									Editar
								</Button>

								<ConfirmDialog
									title="¿Eliminar este gasto?"
									description={`Vas a eliminar el gasto de ${formatMoney(expense.amountCents, currency)} en ${expense.categoryName} del ${formatCivilDate(expense.occurredOn)}. Esta acción no se puede deshacer.`}
									confirmLabel="Eliminar"
									onConfirm={() => deleteExpense.mutate(expense.id)}
									trigger={
										<Button
											type="button"
											variant="destructive"
											size="sm"
											className="gap-1.5"
											disabled={deleteExpense.isPending}
										>
											<Trash2 className="size-3.5" aria-hidden="true" />
											Eliminar
										</Button>
									}
								/>
							</div>
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};
