import { useSuspenseQuery } from '@tanstack/react-query';
import type { Currency } from '@walti/shared';
import { CalendarDays } from 'lucide-react';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { categoriesQuery } from '@/features/categories/categoriesApi';
import { CategoryCombobox } from '@/features/expenses/components/categoryCombobox';
import { useCreateExpense } from '@/features/expenses/hooks/useExpenseMutations';
import {
	civilDateToDate,
	dateToCivilDate,
	formatCivilDate,
	todayCivilDate,
} from '@/lib/format/date';
import { parseMoneyInput, sanitizeAmountInput } from '@/lib/format/money';
import { QuerySuspense } from '@/shared/components/querySuspense';

const currencySymbols: Record<Currency, string> = { PEN: 'S/', USD: '$' };

type NewExpenseFormProps = { spaceId: string; currency: Currency };

type CategoryFieldProps = {
	spaceId: string;
	value: string | null;
	onChange: (categoryId: string | null) => void;
};

/**
 * Split out so it alone suspends: the rest of the form (amount, date,
 * submit) renders immediately and never waits on the categories request.
 */
const CategoryField = ({ spaceId, value, onChange }: CategoryFieldProps) => {
	const { data: groups } = useSuspenseQuery(categoriesQuery(spaceId));
	const hasCategories = groups.some(
		(group) => !group.archivedAt && group.categories.some((c) => !c.archivedAt),
	);

	if (!hasCategories) {
		return (
			<FieldDescription>
				Este espacio todavía no tiene categorías activas. Créalas en
				Categorías antes de registrar un gasto.
			</FieldDescription>
		);
	}

	return <CategoryCombobox groups={groups} value={value} onChange={onChange} />;
};

export const NewExpenseForm = ({ spaceId, currency }: NewExpenseFormProps) => {
	const amountFieldId = useId();
	const amountErrorId = useId();
	const dateFieldId = useId();
	const amountInputRef = useRef<HTMLInputElement>(null);

	const createExpense = useCreateExpense(spaceId);

	const [amount, setAmount] = useState('');
	const [amountError, setAmountError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string | null>(null);
	// Today by default: the common case (logging an expense as it happens)
	// needs zero taps on the date field at all.
	const [occurredOn, setOccurredOn] = useState(todayCivilDate);
	const [calendarOpen, setCalendarOpen] = useState(false);

	// The sheet has just finished sliding in: send focus to the field the
	// person fills first, with the numeric keyboard already up.
	useEffect(() => {
		amountInputRef.current?.focus();
	}, []);

	const today = todayCivilDate();

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

		createExpense.mutate(
			{ categoryId, amountCents, occurredOn },
			{
				onSuccess: () => {
					// Cleared, not closed: the next expense starts right here, with
					// no navigation and no reopening the sheet.
					setAmount('');
					setCategoryId(null);
					setOccurredOn(todayCivilDate());
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
			<FieldGroup className="gap-6">
				<Field>
					<FieldLabel htmlFor={amountFieldId}>Monto</FieldLabel>

					<FieldContent>
						<div className="flex items-baseline gap-2">
							<span
								className="text-2xl font-semibold text-muted-foreground"
								aria-hidden="true"
							>
								{currencySymbols[currency]}
							</span>

							<input
								ref={amountInputRef}
								id={amountFieldId}
								inputMode="decimal"
								autoComplete="off"
								placeholder="0.00"
								value={amount}
								onChange={(event) => {
									setAmount(sanitizeAmountInput(event.target.value));
									setAmountError(null);
								}}
								aria-invalid={amountError ? true : undefined}
								aria-describedby={amountError ? amountErrorId : undefined}
								className="h-12 w-full min-w-0 border-0 bg-transparent text-4xl font-semibold outline-none placeholder:text-muted-foreground/40"
							/>
						</div>

						<FieldError id={amountErrorId}>{amountError}</FieldError>
					</FieldContent>
				</Field>

				<Field>
					<FieldLabel>Categoría</FieldLabel>

					<FieldContent>
						<QuerySuspense
							resetKeys={[spaceId]}
							loading={<Skeleton className="h-11 w-full" />}
						>
							<CategoryField
								spaceId={spaceId}
								value={categoryId}
								onChange={setCategoryId}
							/>
						</QuerySuspense>
					</FieldContent>
				</Field>

				<Field>
					<FieldLabel htmlFor={dateFieldId}>Fecha</FieldLabel>

					<FieldContent>
						<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
							<PopoverTrigger
								id={dateFieldId}
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
								{formatCivilDate(occurredOn)}
							</PopoverTrigger>

							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									autoFocus
									selected={civilDateToDate(occurredOn)}
									disabled={{ after: civilDateToDate(today) }}
									onSelect={(date) => {
										if (date) {
											setOccurredOn(dateToCivilDate(date));
											setCalendarOpen(false);
										}
									}}
								/>
							</PopoverContent>
						</Popover>
					</FieldContent>
				</Field>

				<Button type="submit" disabled={!canSubmit} className="w-full">
					{createExpense.isPending ? 'Guardando…' : 'Guardar'}
				</Button>
			</FieldGroup>
		</form>
	);
};
