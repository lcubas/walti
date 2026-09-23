import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FieldDescription } from '@/components/ui/field';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { eventsQuery } from '@/features/events/eventsApi';

type EventFieldProps = {
	spaceId: string;
	value: string | null;
	onChange: (eventId: string | null) => void;
	occurredOn: string;
	suggest: boolean;
};

/** Whether `occurredOn` falls inside the event's own date window. */
const isWithinRange = (
	event: { startsOn: string; endsOn: string },
	occurredOn: string,
) => event.startsOn <= occurredOn && occurredOn <= event.endsOn;

export const EventField = ({
	spaceId,
	value,
	onChange,
	occurredOn,
	suggest,
}: EventFieldProps) => {
	const { data: events } = useSuspenseQuery(eventsQuery(spaceId));
	// Once the person has touched the picker themselves — including to
	// clear a suggestion back to "Sin evento" — the suggestion has done its
	// job and stops fighting their choice for the rest of this form.
	const [touched, setTouched] = useState(false);

	const matches =
		suggest && !touched
			? events.filter(
					(event) => !event.archivedAt && isWithinRange(event, occurredOn),
				)
			: [];

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only a date change should retrigger the suggestion — re-running it
	useEffect(() => {
		if (!suggest || touched) {
			return;
		}

		onChange(matches.length === 1 ? matches[0].id : null);
		// Only a date change should retrigger the suggestion — re-running it
		// because `events` or the derived `matches` changed reference would
		// fight a choice the person already made this render.
	}, [occurredOn, touched, suggest]);

	// The current selection stays choosable even if archived since — unlike
	// categoryCombobox/paymentSourceField, which accepted that gap as a
	// pre-existing limitation — nothing here depends on it yet.
	const active = events.filter(
		(event) => !event.archivedAt || event.id === value,
	);

	if (active.length === 0) {
		return (
			<FieldDescription>
				Todavía no hay eventos en este espacio.
			</FieldDescription>
		);
	}

	const items = Object.fromEntries(
		active.map((event) => [event.id, event.name]),
	);

	return (
		<div className="space-y-1.5">
			<Select
				items={items}
				value={value}
				onValueChange={(next) => {
					setTouched(true);
					onChange(next);
				}}
			>
				<SelectTrigger className="h-11 w-full">
					<SelectValue placeholder="Sin evento" />
				</SelectTrigger>

				<SelectContent>
					<SelectItem value={null}>Sin evento</SelectItem>

					{active.map((event) => (
						<SelectItem key={event.id} value={event.id}>
							{event.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{matches.length > 1 ? (
				<FieldDescription>
					{matches.length} eventos coinciden con esta fecha. Elige uno.
				</FieldDescription>
			) : null}
		</div>
	);
};
