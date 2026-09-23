import type { CreateEventRequest, Currency } from '@walti/shared';
import { type SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventFormFields } from '@/features/events/components/eventFormFields';
import { useCreateEvent } from '@/features/events/hooks/useEventMutations';
import { todayCivilDate } from '@/lib/format/date';
import { parseMoneyInput } from '@/lib/format/money';

type NewEventFormProps = {
	spaceId: string;
	currency: Currency;
	onCreated: () => void;
	onCancel: () => void;
};

export const NewEventForm = ({
	spaceId,
	currency,
	onCreated,
	onCancel,
}: NewEventFormProps) => {
	const createEvent = useCreateEvent(spaceId);
	const today = todayCivilDate();

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState<string | null>(null);
	const [startsOn, setStartsOn] = useState(today);
	const [endsOn, setEndsOn] = useState(today);
	const [budget, setBudget] = useState('');
	const [budgetError, setBudgetError] = useState<string | null>(null);

	const submit = (event: SubmitEvent) => {
		event.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setNameError('Ponle un nombre al evento.');
			return;
		}

		let budgetCents: number | undefined;

		if (budget.trim().length > 0) {
			const parsed = parseMoneyInput(budget);

			if (parsed === null) {
				setBudgetError('Ingresa un presupuesto válido, mayor a cero.');
				return;
			}

			budgetCents = parsed;
		}

		setNameError(null);
		setBudgetError(null);

		const body: CreateEventRequest = {
			name: trimmedName,
			startsOn,
			endsOn,
			budgetCents,
		};

		createEvent.mutate(body, { onSuccess: onCreated });
	};

	return (
		<form onSubmit={submit} noValidate>
			<EventFormFields
				currency={currency}
				name={name}
				onNameChange={(value) => {
					setName(value);
					setNameError(null);
				}}
				nameError={nameError}
				startsOn={startsOn}
				endsOn={endsOn}
				onRangeChange={(nextStart, nextEnd) => {
					setStartsOn(nextStart);
					setEndsOn(nextEnd);
				}}
				budget={budget}
				onBudgetChange={(value) => {
					setBudget(value);
					setBudgetError(null);
				}}
				budgetError={budgetError}
			/>

			<div className="mt-6 flex gap-2">
				<Button type="submit" disabled={createEvent.isPending}>
					{createEvent.isPending ? 'Creando…' : 'Crear evento'}
				</Button>

				<Button
					type="button"
					variant="ghost"
					disabled={createEvent.isPending}
					onClick={onCancel}
				>
					Cancelar
				</Button>
			</div>
		</form>
	);
};
