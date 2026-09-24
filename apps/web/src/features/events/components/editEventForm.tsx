import type { Event, UpdateEventRequest } from '@walti/shared';
import { type SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventFormFields } from '@/features/events/components/eventFormFields';
import { useUpdateEvent } from '@/features/events/hooks/useEventMutations';

type EditEventFormProps = {
	spaceId: string;
	event: Event;
	onCancel: () => void;
	onSaved: () => void;
};

export const EditEventForm = ({
	spaceId,
	event,
	onCancel,
	onSaved,
}: EditEventFormProps) => {
	const updateEvent = useUpdateEvent(spaceId);

	const [name, setName] = useState(event.name);
	const [nameError, setNameError] = useState<string | null>(null);
	const [startsOn, setStartsOn] = useState(event.startsOn);
	const [endsOn, setEndsOn] = useState(event.endsOn);

	const submit = (submitEvent: SubmitEvent) => {
		submitEvent.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setNameError('Ponle un nombre al evento.');
			return;
		}

		setNameError(null);

		const changes: UpdateEventRequest = {
			name: trimmedName !== event.name ? trimmedName : undefined,
			startsOn: startsOn !== event.startsOn ? startsOn : undefined,
			endsOn: endsOn !== event.endsOn ? endsOn : undefined,
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
