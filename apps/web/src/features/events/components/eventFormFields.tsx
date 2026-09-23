import type { Currency } from '@walti/shared';
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
import { sanitizeAmountInput } from '@/lib/format/money';

const currencySymbols: Record<Currency, string> = { PEN: 'S/', USD: '$' };

type EventFormFieldsProps = {
	currency: Currency;
	name: string;
	onNameChange: (value: string) => void;
	nameError: string | null;
	startsOn: string;
	endsOn: string;
	onRangeChange: (startsOn: string, endsOn: string) => void;
	budget: string;
	onBudgetChange: (value: string) => void;
	budgetError: string | null;
};

/** The fields shared by creating and editing an event — everything except
 * the submit action, which each caller owns since create and edit send
 * different request shapes (full vs. partial). */
export const EventFormFields = ({
	currency,
	name,
	onNameChange,
	nameError,
	startsOn,
	endsOn,
	onRangeChange,
	budget,
	onBudgetChange,
	budgetError,
}: EventFormFieldsProps) => {
	const nameFieldId = useId();
	const nameErrorId = useId();
	const rangeFieldId = useId();
	const budgetFieldId = useId();
	const budgetErrorId = useId();
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
							{/* No auto-close on select: react-day-picker's range mode
							    already turns the very first click into a complete
							    one-day range (`addToRange`, min=0), so closing on "to
							    is set" would close after one click and never let a
							    second click extend it. The popover closes the normal
							    way instead — outside click, Escape, or the trigger. */}
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

			<Field>
				<FieldLabel htmlFor={budgetFieldId}>Presupuesto (opcional)</FieldLabel>

				<FieldContent>
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground" aria-hidden="true">
							{currencySymbols[currency]}
						</span>

						<Input
							id={budgetFieldId}
							inputMode="decimal"
							autoComplete="off"
							placeholder="0.00"
							value={budget}
							onChange={(event) =>
								onBudgetChange(sanitizeAmountInput(event.target.value))
							}
							aria-invalid={budgetError ? true : undefined}
							aria-describedby={budgetError ? budgetErrorId : undefined}
						/>
					</div>

					<FieldError id={budgetErrorId}>{budgetError}</FieldError>
				</FieldContent>
			</Field>
		</FieldGroup>
	);
};
