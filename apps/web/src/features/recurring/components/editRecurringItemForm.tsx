import type {
	Currency,
	RecurringItem,
	UpdateRecurringItemRequest,
} from '@walti/shared';
import { type SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RecurringItemFormFields } from '@/features/recurring/components/recurringItemFormFields';
import { useUpdateRecurringItem } from '@/features/recurring/hooks/useRecurringMutations';
import { centsToAmountInput, parseMoneyInput } from '@/lib/format/money';

type EditRecurringItemFormProps = {
	spaceId: string;
	currency: Currency;
	item: RecurringItem;
	onCancel: () => void;
	onSaved: () => void;
};

export const EditRecurringItemForm = ({
	spaceId,
	currency,
	item,
	onCancel,
	onSaved,
}: EditRecurringItemFormProps) => {
	const updateRecurringItem = useUpdateRecurringItem(spaceId);

	const [name, setName] = useState(item.name);
	const [nameError, setNameError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string | null>(item.categoryId);
	const [kind, setKind] = useState(item.kind);
	const [frequency, setFrequency] = useState(item.frequency);
	const [anchorDay, setAnchorDay] = useState(item.anchorDay);
	// Defaults to January so the "Mes" select always has something to show
	// if the person switches to "Anual" — it only reaches the request body
	// when frequency actually ends up yearly (see `submit` below).
	const [anchorMonth, setAnchorMonth] = useState(item.anchorMonth ?? 1);
	const [amount, setAmount] = useState(() =>
		centsToAmountInput(item.expectedAmountCents),
	);
	const [amountError, setAmountError] = useState<string | null>(null);

	const submit = (submitEvent: SubmitEvent) => {
		submitEvent.preventDefault();

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

		// anchorMonth only travels when it actually changed, with one
		// exception: switching frequency away from "yearly" must explicitly
		// clear it (`null`), since the server pairs the two fields — leaving
		// it out would mean "no change" and keep a stale month.
		const anchorMonthChange =
			frequency === 'yearly'
				? anchorMonth !== item.anchorMonth
					? anchorMonth
					: undefined
				: item.anchorMonth !== null
					? null
					: undefined;

		const changes: UpdateRecurringItemRequest = {
			categoryId: categoryId !== item.categoryId ? categoryId : undefined,
			name: trimmedName !== item.name ? trimmedName : undefined,
			kind: kind !== item.kind ? kind : undefined,
			frequency: frequency !== item.frequency ? frequency : undefined,
			anchorDay: anchorDay !== item.anchorDay ? anchorDay : undefined,
			anchorMonth: anchorMonthChange,
			expectedAmountCents:
				expectedAmountCents !== item.expectedAmountCents
					? expectedAmountCents
					: undefined,
		};

		const hasChanges = Object.values(changes).some(
			(value) => value !== undefined,
		);

		if (!hasChanges) {
			onSaved();
			return;
		}

		updateRecurringItem.mutate(
			{ recurringItemId: item.id, body: changes },
			{ onSuccess: onSaved },
		);
	};

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
				<Button
					type="button"
					variant="outline"
					className="flex-1"
					disabled={updateRecurringItem.isPending}
					onClick={onCancel}
				>
					Cancelar
				</Button>

				<Button
					type="submit"
					className="flex-1"
					disabled={updateRecurringItem.isPending}
				>
					{updateRecurringItem.isPending ? 'Guardando…' : 'Guardar cambios'}
				</Button>
			</div>
		</form>
	);
};
