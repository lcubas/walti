import type { Currency } from '@walti/shared';
import { CalendarDays, Plus } from 'lucide-react';
import { type RefObject, useId, useState } from 'react';
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
import {
	civilDateToDate,
	dateToCivilDate,
	formatCivilDate,
	todayCivilDate,
} from '@/lib/format/date';
import { sanitizeAmountInput } from '@/lib/format/money';
import { QuerySuspense } from '@/shared/components/querySuspense';

const currencySymbols: Record<Currency, string> = { PEN: 'S/', USD: '$' };

type ExpenseFormFieldsProps = {
	spaceId: string;
	currency: Currency;
	amountInputRef: RefObject<HTMLInputElement | null>;
	amount: string;
	onAmountChange: (value: string) => void;
	amountError: string | null;
	categoryId: string | null;
	onCategoryChange: (value: string | null) => void;
	occurredOn: string;
	onOccurredOnChange: (value: string) => void;
	detailsOpen: boolean;
	onDetailsOpenChange: (open: boolean) => void;
	merchant: string;
	onMerchantChange: (value: string) => void;
	paymentSourceId: string | null;
	onPaymentSourceChange: (value: string | null) => void;
	note: string;
	onNoteChange: (value: string) => void;
};

/** The fields shared by creating and editing a gasto — everything except the
 * submit action, which each caller owns since "guardar" and "guardar
 * cambios" behave differently (reset-and-stay vs. exit edit mode). */
export const ExpenseFormFields = ({
	spaceId,
	currency,
	amountInputRef,
	amount,
	onAmountChange,
	amountError,
	categoryId,
	onCategoryChange,
	occurredOn,
	onOccurredOnChange,
	detailsOpen,
	onDetailsOpenChange,
	merchant,
	onMerchantChange,
	paymentSourceId,
	onPaymentSourceChange,
	note,
	onNoteChange,
}: ExpenseFormFieldsProps) => {
	const amountFieldId = useId();
	const amountErrorId = useId();
	const dateFieldId = useId();
	const merchantFieldId = useId();
	const noteFieldId = useId();
	const [calendarOpen, setCalendarOpen] = useState(false);

	const today = todayCivilDate();

	return (
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
							onChange={(event) =>
								onAmountChange(sanitizeAmountInput(event.target.value))
							}
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
							onChange={onCategoryChange}
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
										onOccurredOnChange(dateToCivilDate(date));
										setCalendarOpen(false);
									}
								}}
							/>
						</PopoverContent>
					</Popover>
				</FieldContent>
			</Field>

			<Collapsible open={detailsOpen} onOpenChange={onDetailsOpenChange}>
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
									onChange={(event) => onMerchantChange(event.target.value)}
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
										onChange={onPaymentSourceChange}
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
									onChange={(event) => onNoteChange(event.target.value)}
									placeholder="Detalle corto, opcional"
									maxLength={200}
								/>
							</FieldContent>
						</Field>
					</FieldGroup>
				</CollapsibleContent>
			</Collapsible>
		</FieldGroup>
	);
};
