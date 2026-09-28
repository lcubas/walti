import type { Currency, CreateRecurringItemRequest } from '@walti/shared';
import { type SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RecurringItemFormFields } from '@/features/recurring/components/recurringItemFormFields';
import { useCreateRecurringItem } from '@/features/recurring/hooks/useRecurringMutations';
import { parseMoneyInput } from '@/lib/format/money';

type NewRecurringItemFormProps = {
	spaceId: string;
	currency: Currency;
	onCreated: () => void;
	onCancel: () => void;
};

export const NewRecurringItemForm = ({
	spaceId,
	currency,
	onCreated,
	onCancel,
}: NewRecurringItemFormProps) => {
	const createRecurringItem = useCreateRecurringItem(spaceId);

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string | null>(null);
	const [kind, setKind] = useState<CreateRecurringItemRequest['kind']>(
		'automatic',
	);
	const [frequency, setFrequency] = useState<
		CreateRecurringItemRequest['frequency']
	>('monthly');
	const [anchorDay, setAnchorDay] = useState(1);
	const [anchorMonth, setAnchorMonth] = useState(1);
	const [amount, setAmount] = useState('');
	const [amountError, setAmountError] = useState<string | null>(null);

	const submit = (event: SubmitEvent) => {
		event.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setNameError('Ponle un nombre al recurrente.');
			return;
		}

		const expectedAmountCents = parseMoneyInput(amount);

		if (expectedAmountCents === null) {
			setAmountError('Ingresa un monto válido, mayor a cero.');
			return;
		}

		if (!categoryId) {
			return;
		}

		setNameError(null);
		setAmountError(null);

		const body: CreateRecurringItemRequest = {
			categoryId,
			name: trimmedName,
			kind,
			frequency,
			anchorDay,
			anchorMonth: frequency === 'yearly' ? anchorMonth : undefined,
			expectedAmountCents,
		};

		createRecurringItem.mutate(body, { onSuccess: onCreated });
	};

	const canSubmit =
		name.trim().length > 0 &&
		categoryId !== null &&
		amount.trim().length > 0 &&
		!createRecurringItem.isPending;

	return (
		<form onSubmit={submit} noValidate>
			<RecurringItemFormFields
				spaceId={spaceId}
				currency={currency}
				name={name}
				onNameChange={(value) => {
					setName(value);
					setNameError(null);
				}}
				nameError={nameError}
				categoryId={categoryId}
				onCategoryChange={setCategoryId}
				kind={kind}
				onKindChange={setKind}
				frequency={frequency}
				onFrequencyChange={setFrequency}
				anchorDay={anchorDay}
				onAnchorDayChange={setAnchorDay}
				anchorMonth={anchorMonth}
				onAnchorMonthChange={setAnchorMonth}
				amount={amount}
				onAmountChange={(value) => {
					setAmount(value);
					setAmountError(null);
				}}
				amountError={amountError}
			/>

			<div className="mt-6 flex gap-2">
				<Button type="submit" disabled={!canSubmit}>
					{createRecurringItem.isPending ? 'Creando…' : 'Crear recurrente'}
				</Button>

				<Button
					type="button"
					variant="ghost"
					disabled={createRecurringItem.isPending}
					onClick={onCancel}
				>
					Cancelar
				</Button>
			</div>
		</form>
	);
};
