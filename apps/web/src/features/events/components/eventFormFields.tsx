import { CalendarDays } from 'lucide-react';
import { useId, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	civilDateToDate,
	dateToCivilDate,
	formatCivilDate,
} from '@/lib/format/date';

type EventFormFieldsProps = {
	name: string;
	onNameChange: (value: string) => void;
	nameError: string | null;
	startsOn: string;
	endsOn: string;
	onRangeChange: (startsOn: string, endsOn: string) => void;
};

export const EventFormFields = ({
	name,
	onNameChange,
	nameError,
	startsOn,
	endsOn,
	onRangeChange,
}: EventFormFieldsProps) => {
	const nameFieldId = useId();
	const nameErrorId = useId();
	const rangeFieldId = useId();
	const [rangeOpen, setRangeOpen] = useState(false);

	const range: DateRange = {
		from: civilDateToDate(startsOn),
		to: civilDateToDate(endsOn),
	};

	return (
		<FieldGroup className="gap-6">
			<Field>
				<FieldLabel htmlFor={nameFieldId}>Nombre</FieldLabel>

				<FieldContent>
					<Input
						id={nameFieldId}
						value={name}
						onChange={(event) => onNameChange(event.target.value)}
						placeholder="Viaje a Cusco"
						maxLength={40}
						autoComplete="off"
						aria-invalid={nameError ? true : undefined}
						aria-describedby={nameError ? nameErrorId : undefined}
					/>

					<FieldError id={nameErrorId}>{nameError}</FieldError>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel htmlFor={rangeFieldId}>Fechas</FieldLabel>

				<FieldContent>
					<Popover open={rangeOpen} onOpenChange={setRangeOpen}>
						<PopoverTrigger
							id={rangeFieldId}
							render={
								<Button
									type="button"
									variant="outline"
									size="lg"
									className="w-full justify-start gap-2 normal-case"
								/>
							}
						>
							<CalendarDays
								className="size-4 text-muted-foreground"
								aria-hidden="true"
							/>
							{startsOn === endsOn
								? formatCivilDate(startsOn)
								: `${formatCivilDate(startsOn)} – ${formatCivilDate(endsOn)}`}
						</PopoverTrigger>

						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="range"
								autoFocus
								selected={range}
								onSelect={(next) => {
									if (!next?.from) {
										return;
									}

									const nextStart = dateToCivilDate(next.from);
									const nextEnd = next.to
										? dateToCivilDate(next.to)
										: nextStart;

									onRangeChange(nextStart, nextEnd);
								}}
							/>
						</PopoverContent>
					</Popover>
				</FieldContent>
			</Field>
		</FieldGroup>
	);
};
