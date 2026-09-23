import type { Currency } from '@walti/shared';
import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExpenseFormFields } from '@/features/expenses/components/expenseFormFields';
import { useCreateExpense } from '@/features/expenses/hooks/useExpenseMutations';
import { todayCivilDate } from '@/lib/format/date';
import { parseMoneyInput } from '@/lib/format/money';

type NewExpenseFormProps = { spaceId: string; currency: Currency };

export const NewExpenseForm = ({ spaceId, currency }: NewExpenseFormProps) => {
	const amountInputRef = useRef<HTMLInputElement>(null);

	const createExpense = useCreateExpense(spaceId);

	const [amount, setAmount] = useState('');
	const [amountError, setAmountError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string | null>(null);
	const [occurredOn, setOccurredOn] = useState(todayCivilDate);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [eventId, setEventId] = useState<string | null>(null);
	const [merchant, setMerchant] = useState('');
	const [paymentSourceId, setPaymentSourceId] = useState<string | null>(null);
	const [note, setNote] = useState('');

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

		createExpense.mutate(
			{
				categoryId,
				amountCents,
				occurredOn,
				paymentSourceId: paymentSourceId ?? undefined,
				eventId: eventId ?? undefined,
				merchant: trimmedMerchant.length > 0 ? trimmedMerchant : undefined,
				note: trimmedNote.length > 0 ? trimmedNote : undefined,
			},
			{
				onSuccess: () => {
					// Cleared, not closed: the next expense starts right here, with
					// no navigation and no reopening the sheet.
					setAmount('');
					setCategoryId(null);
					setOccurredOn(todayCivilDate());
					setEventId(null);
					setDetailsOpen(false);
					setMerchant('');
					setPaymentSourceId(null);
					setNote('');
					amountInputRef.current?.focus();
				},
				// On failure the fields are left exactly as they were, so retrying
				// is pressing the button again, not retyping everything.
			},
		);
	};

	const canSubmit =
		amount.trim().length > 0 && categoryId !== null && !createExpense.isPending;

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
				eventId={eventId}
				onEventChange={setEventId}
				suggestEvent
				detailsOpen={detailsOpen}
				onDetailsOpenChange={setDetailsOpen}
				merchant={merchant}
				onMerchantChange={setMerchant}
				paymentSourceId={paymentSourceId}
				onPaymentSourceChange={setPaymentSourceId}
				note={note}
				onNoteChange={setNote}
			/>

			<Button type="submit" disabled={!canSubmit} className="mt-6 w-full">
				{createExpense.isPending ? 'Guardando…' : 'Guardar'}
			</Button>
		</form>
	);
};
