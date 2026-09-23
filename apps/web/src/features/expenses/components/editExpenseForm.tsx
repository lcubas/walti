import type { Currency } from '@walti/shared';
import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExpenseFormFields } from '@/features/expenses/components/expenseFormFields';
import type { DisplayExpense } from '@/features/expenses/components/expensesScreenContent';
import { useUpdateExpense } from '@/features/expenses/hooks/useExpenseMutations';
import { centsToAmountInput, parseMoneyInput } from '@/lib/format/money';

type EditExpenseFormProps = {
	spaceId: string;
	currency: Currency;
	expense: DisplayExpense;
	onCancel: () => void;
	onSaved: () => void;
};

/** Same fields as creating a gasto, pre-filled with its current values —
 * editing resends the full record, there is no per-field diff. */
export const EditExpenseForm = ({
	spaceId,
	currency,
	expense,
	onCancel,
	onSaved,
}: EditExpenseFormProps) => {
	const amountInputRef = useRef<HTMLInputElement>(null);
	const updateExpense = useUpdateExpense(spaceId);

	const [amount, setAmount] = useState(() =>
		centsToAmountInput(expense.amountCents),
	);
	const [amountError, setAmountError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string | null>(
		expense.categoryId,
	);
	const [occurredOn, setOccurredOn] = useState(expense.occurredOn);
	// Opens already expanded when there is existing detail to show — hiding
	// filled-in fields behind a collapsed trigger would look like data loss.
	const [detailsOpen, setDetailsOpen] = useState(
		() =>
			Boolean(expense.merchant) ||
			Boolean(expense.paymentSourceId) ||
			Boolean(expense.note),
	);
	const [merchant, setMerchant] = useState(expense.merchant ?? '');
	const [paymentSourceId, setPaymentSourceId] = useState<string | null>(
		expense.paymentSourceId,
	);
	const [note, setNote] = useState(expense.note ?? '');

	useEffect(() => {
		amountInputRef.current?.focus();
	}, []);

	const submit = (event: SubmitEvent) => {
		event.preventDefault();

		const amountCents = parseMoneyInput(amount);

		if (amountCents === null) {
			setAmountError('Ingresa un monto válido, mayor a cero.');
			return;
		}

		if (!categoryId) {
			return;
		}

		setAmountError(null);

		const trimmedMerchant = merchant.trim();
		const trimmedNote = note.trim();

		updateExpense.mutate(
			{
				expenseId: expense.id,
				body: {
					categoryId,
					amountCents,
					occurredOn,
					paymentSourceId: paymentSourceId ?? undefined,
					merchant: trimmedMerchant.length > 0 ? trimmedMerchant : undefined,
					note: trimmedNote.length > 0 ? trimmedNote : undefined,
				},
			},
			{ onSuccess: onSaved },
		);
	};

	const canSubmit =
		amount.trim().length > 0 && categoryId !== null && !updateExpense.isPending;

	return (
		<form onSubmit={submit} noValidate>
			<ExpenseFormFields
				spaceId={spaceId}
				currency={currency}
				amountInputRef={amountInputRef}
				amount={amount}
				onAmountChange={(value) => {
					setAmount(value);
					setAmountError(null);
				}}
				amountError={amountError}
				categoryId={categoryId}
				onCategoryChange={setCategoryId}
				occurredOn={occurredOn}
				onOccurredOnChange={setOccurredOn}
				detailsOpen={detailsOpen}
				onDetailsOpenChange={setDetailsOpen}
				merchant={merchant}
				onMerchantChange={setMerchant}
				paymentSourceId={paymentSourceId}
				onPaymentSourceChange={setPaymentSourceId}
				note={note}
				onNoteChange={setNote}
			/>

			<div className="mt-6 flex gap-2">
				<Button
					type="button"
					variant="outline"
					className="flex-1"
					disabled={updateExpense.isPending}
					onClick={onCancel}
				>
					Cancelar
				</Button>

				<Button type="submit" className="flex-1" disabled={!canSubmit}>
					{updateExpense.isPending ? 'Guardando…' : 'Guardar cambios'}
				</Button>
			</div>
		</form>
	);
};
