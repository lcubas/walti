import type { Currency } from '@walti/shared';
import { CalendarDays, Plus } from 'lucide-react';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CategoryField } from '@/features/expenses/components/categoryField';
import { PaymentSourceField } from '@/features/expenses/components/paymentSourceField';
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

export const NewExpenseForm = ({ spaceId, currency }: NewExpenseFormProps) => {
	const amountFieldId = useId();
	const amountErrorId = useId();
	const dateFieldId = useId();
	const merchantFieldId = useId();
	const noteFieldId = useId();
	const amountInputRef = useRef<HTMLInputElement>(null);

	const createExpense = useCreateExpense(spaceId);

	const [amount, setAmount] = useState('');
	const [amountError, setAmountError] = useState<string | null>(null);
	const [categoryId, setCategoryId] = useState<string | null>(null);
	const [occurredOn, setOccurredOn] = useState(todayCivilDate);
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [merchant, setMerchant] = useState('');
	const [paymentSourceId, setPaymentSourceId] = useState<string | null>(null);
	const [note, setNote] = useState('');

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

		const trimmedMerchant = merchant.trim();
		const trimmedNote = note.trim();

		createExpense.mutate(
			{
				categoryId,
				amountCents,
				occurredOn,
				paymentSourceId: paymentSourceId ?? undefined,
				merchant: trimmedMerchant.length > 0 ? trimmedMerchant : undefined,
				note: trimmedNote.length > 0 ? trimmedNote : undefined,
			},
			{
				onSuccess: () => {
					// Cleared, not closed: the next expense starts right here, with
					// no navigation and no reopening the sheet.
					setAmount('');
					setCategoryId(null);
					setOccurredOn(todayCivilDate());
					setDetailsOpen(false);
					setMerchant('');
					setPaymentSourceId(null);
					setNote('');
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

				<Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
					<CollapsibleTrigger
						render={
							<Button
								type="button"
								variant="ghost"
								className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
							/>
						}
					>
						<Plus className="size-4" aria-hidden="true" />
						Añadir más detalles
					</CollapsibleTrigger>

					<CollapsibleContent className="overflow-hidden">
						<FieldGroup className="gap-6 pt-4">
							<Field>
								<FieldLabel htmlFor={merchantFieldId}>
									Comercio o concepto
								</FieldLabel>

								<FieldContent>
									<Input
										id={merchantFieldId}
										value={merchant}
										onChange={(event) => setMerchant(event.target.value)}
										placeholder="Plaza Vea"
										maxLength={60}
										autoComplete="off"
									/>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel>Fuente de pago</FieldLabel>

								<FieldContent>
									<QuerySuspense loading={<Skeleton className="h-11 w-full" />}>
										<PaymentSourceField
											value={paymentSourceId}
											onChange={setPaymentSourceId}
										/>
									</QuerySuspense>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor={noteFieldId}>Nota</FieldLabel>

								<FieldContent>
									<Textarea
										id={noteFieldId}
										value={note}
										onChange={(event) => setNote(event.target.value)}
										placeholder="Detalle corto, opcional"
										maxLength={200}
									/>
								</FieldContent>
							</Field>
						</FieldGroup>
					</CollapsibleContent>
				</Collapsible>

				<Button type="submit" disabled={!canSubmit} className="w-full">
					{createExpense.isPending ? 'Guardando…' : 'Guardar'}
				</Button>
			</FieldGroup>
		</form>
	);
};
