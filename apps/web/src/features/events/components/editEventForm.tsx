import type { Currency, Event, UpdateEventRequest } from '@walti/shared';
import { type SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventFormFields } from '@/features/events/components/eventFormFields';
import { useUpdateEvent } from '@/features/events/hooks/useEventMutations';
import { centsToAmountInput, parseMoneyInput } from '@/lib/format/money';

type EditEventFormProps = {
	spaceId: string;
	currency: Currency;
	event: Event;
	onCancel: () => void;
	onSaved: () => void;
};

/** Unlike editing a gasto, this is a partial patch: only the fields that
 * actually changed are sent, since `UpdateEventRequest` requires at least
 * one of them and Drizzle would otherwise happily "update" a column to the
 * value it already has. */
export const EditEventForm = ({
	spaceId,
	currency,
	event,
	onCancel,
	onSaved,
}: EditEventFormProps) => {
	const updateEvent = useUpdateEvent(spaceId);

	const [name, setName] = useState(event.name);
	const [nameError, setNameError] = useState<string | null>(null);
	const [startsOn, setStartsOn] = useState(event.startsOn);
	const [endsOn, setEndsOn] = useState(event.endsOn);
	const [budget, setBudget] = useState(() =>
		event.budgetCents !== null ? centsToAmountInput(event.budgetCents) : '',
	);
	const [budgetError, setBudgetError] = useState<string | null>(null);

	const submit = (submitEvent: SubmitEvent) => {
		submitEvent.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setNameError('Ponle un nombre al evento.');
			return;
		}

		// null clears an existing budget; undefined means "leave it as is",
		// which the schema needs to tell apart from an explicit clear.
		let budgetCents: number | null | undefined;

		if (budget.trim().length === 0) {
			budgetCents = event.budgetCents !== null ? null : undefined;
		} else {
			const parsed = parseMoneyInput(budget);

			if (parsed === null) {
				setBudgetError('Ingresa un presupuesto válido, mayor a cero.');
				return;
			}

			budgetCents = parsed !== event.budgetCents ? parsed : undefined;
		}

		setNameError(null);
		setBudgetError(null);

		const changes: UpdateEventRequest = {
			name: trimmedName !== event.name ? trimmedName : undefined,
			startsOn: startsOn !== event.startsOn ? startsOn : undefined,
			endsOn: endsOn !== event.endsOn ? endsOn : undefined,
			budgetCents,
		};

		const hasChanges = Object.values(changes).some(
			(value) => value !== undefined,
		);

		if (!hasChanges) {
			onSaved();
			return;
		}

		updateEvent.mutate(
			{ eventId: event.id, body: changes },
			{ onSuccess: onSaved },
		);
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
				<Button
					type="button"
					variant="outline"
					className="flex-1"
					disabled={updateEvent.isPending}
					onClick={onCancel}
				>
					Cancelar
				</Button>

				<Button
					type="submit"
					className="flex-1"
					disabled={updateEvent.isPending}
				>
					{updateEvent.isPending ? 'Guardando…' : 'Guardar cambios'}
				</Button>
			</div>
		</form>
	);
};
