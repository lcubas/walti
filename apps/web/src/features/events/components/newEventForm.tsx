import type { CreateEventRequest } from '@walti/shared';
import { type SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventFormFields } from '@/features/events/components/eventFormFields';
import { useCreateEvent } from '@/features/events/hooks/useEventMutations';
import { todayCivilDate } from '@/lib/format/date';

type NewEventFormProps = {
	spaceId: string;
	onCreated: () => void;
	onCancel: () => void;
};

export const NewEventForm = ({
	spaceId,
	onCreated,
	onCancel,
}: NewEventFormProps) => {
	const createEvent = useCreateEvent(spaceId);
	const today = todayCivilDate();

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState<string | null>(null);
	const [startsOn, setStartsOn] = useState(today);
	const [endsOn, setEndsOn] = useState(today);

	const submit = (event: SubmitEvent) => {
		event.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setNameError('Ponle un nombre al evento.');
			return;
		}

		setNameError(null);

		const body: CreateEventRequest = {
			name: trimmedName,
			startsOn,
			endsOn,
		};

		createEvent.mutate(body, { onSuccess: onCreated });
	};

	return (
		<form onSubmit={submit} noValidate>
			<EventFormFields
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
