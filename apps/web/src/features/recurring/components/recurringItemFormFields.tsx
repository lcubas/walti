import type { Currency, RecurringFrequency, RecurringKind } from '@walti/shared';
import { useId } from 'react';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryField } from '@/features/expenses/components/categoryField';
import { formatMonthShort } from '@/lib/format/date';
import { sanitizeAmountInput } from '@/lib/format/money';
import { cn } from '@/lib/utils';
import { QuerySuspense } from '@/shared/components/querySuspense';

const currencySymbols: Record<Currency, string> = { PEN: 'S/', USD: '$' };

const days = Array.from({ length: 31 }, (_, index) => index + 1);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const choiceCardSelectedClasses = 'has-data-checked:border-2 has-data-checked:border-foreground';
const radioItemClasses = 'border-muted-foreground focus-visible:ring-2 focus-visible:ring-foreground';
const underlineFieldClasses = 'border-b-muted-foreground focus-visible:border-b-foreground';

type RecurringItemFormFieldsProps = {
	spaceId: string;
	currency: Currency;
	name: string;
	onNameChange: (value: string) => void;
	nameError: string | null;
	categoryId: string | null;
	onCategoryChange: (value: string | null) => void;
	kind: RecurringKind;
	onKindChange: (value: RecurringKind) => void;
	frequency: RecurringFrequency;
	onFrequencyChange: (value: RecurringFrequency) => void;
	anchorDay: number;
	onAnchorDayChange: (value: number) => void;
	anchorMonth: number;
	onAnchorMonthChange: (value: number) => void;
	amount: string;
	onAmountChange: (value: string) => void;
	amountError: string | null;
};

export const RecurringItemFormFields = ({
	spaceId,
	currency,
	name,
	onNameChange,
	nameError,
	categoryId,
	onCategoryChange,
	kind,
	onKindChange,
	frequency,
	onFrequencyChange,
	anchorDay,
	onAnchorDayChange,
	anchorMonth,
	onAnchorMonthChange,
	amount,
	onAmountChange,
	amountError,
}: RecurringItemFormFieldsProps) => {
	const nameFieldId = useId();
	const nameErrorId = useId();
	const amountFieldId = useId();
	const amountErrorId = useId();

	const dayItems = Object.fromEntries(days.map((day) => [String(day), String(day)]));
	const monthItems = Object.fromEntries(
		months.map((month) => [String(month), formatMonthShort(month)]),
	);

	return (
		<FieldGroup className="gap-6">
			<Field>
				<FieldLabel htmlFor={nameFieldId}>Nombre</FieldLabel>

				<FieldContent>
					<Input
						id={nameFieldId}
						value={name}
						onChange={(event) => onNameChange(event.target.value)}
						placeholder="Netflix"
						maxLength={40}
						autoComplete="off"
						autoFocus
						className={underlineFieldClasses}
						aria-invalid={nameError ? true : undefined}
						aria-describedby={nameError ? nameErrorId : undefined}
					/>

					<FieldError id={nameErrorId}>{nameError}</FieldError>
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
				<FieldLabel>Tipo</FieldLabel>

				<FieldContent>
					<RadioGroup
						value={kind}
						onValueChange={(value) => onKindChange(value as RecurringKind)}
						className="sm:grid-cols-2"
					>
						<FieldLabel className={choiceCardSelectedClasses}>
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Cobro automático</FieldTitle>
									<FieldDescription>
										Se carga solo a tu método de pago, como una suscripción.
									</FieldDescription>
								</FieldContent>
								<RadioGroupItem value="automatic" className={radioItemClasses} />
							</Field>
						</FieldLabel>

						<FieldLabel className={choiceCardSelectedClasses}>
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Pago manual</FieldTitle>
									<FieldDescription>
										Tú lo pagas cada vez; te lo recordamos cuando toca.
									</FieldDescription>
								</FieldContent>
								<RadioGroupItem value="manual" className={radioItemClasses} />
							</Field>
						</FieldLabel>
					</RadioGroup>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel>Frecuencia</FieldLabel>

				<FieldContent>
					<RadioGroup
						value={frequency}
						onValueChange={(value) =>
							onFrequencyChange(value as RecurringFrequency)
						}
						className="sm:grid-cols-2"
					>
						<FieldLabel className={choiceCardSelectedClasses}>
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Mensual</FieldTitle>
								</FieldContent>
								<RadioGroupItem value="monthly" className={radioItemClasses} />
							</Field>
						</FieldLabel>

						<FieldLabel className={choiceCardSelectedClasses}>
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Anual</FieldTitle>
								</FieldContent>
								<RadioGroupItem value="yearly" className={radioItemClasses} />
							</Field>
						</FieldLabel>
					</RadioGroup>
				</FieldContent>
			</Field>

			<div className={cn('grid gap-4', frequency === 'yearly' && 'grid-cols-2')}>
				<Field>
					<FieldLabel>Día</FieldLabel>

					<FieldContent>
						<Select
							items={dayItems}
							value={String(anchorDay)}
							onValueChange={(value) => onAnchorDayChange(Number(value))}
						>
							<SelectTrigger className={cn('h-11 w-full', underlineFieldClasses)}>
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								{days.map((day) => (
									<SelectItem key={day} value={String(day)}>
										{day}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FieldContent>
				</Field>

				{frequency === 'yearly' ? (
					<Field>
						<FieldLabel>Mes</FieldLabel>

						<FieldContent>
							<Select
								items={monthItems}
								value={String(anchorMonth)}
								onValueChange={(value) => onAnchorMonthChange(Number(value))}
							>
								<SelectTrigger className={cn('h-11 w-full', underlineFieldClasses)}>
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{months.map((month) => (
										<SelectItem key={month} value={String(month)}>
											{formatMonthShort(month)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FieldContent>
					</Field>
				) : null}
			</div>

			<Field>
				<FieldLabel htmlFor={amountFieldId}>Monto esperado</FieldLabel>

				<FieldContent>
					<div className="relative">
						<span
							className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-muted-foreground"
							aria-hidden="true"
						>
							{currencySymbols[currency]}
						</span>

						<Input
							id={amountFieldId}
							inputMode="decimal"
							autoComplete="off"
							placeholder="0.00"
							value={amount}
							onChange={(event) =>
								onAmountChange(sanitizeAmountInput(event.target.value))
							}
							className={cn('pl-8', underlineFieldClasses)}
							aria-invalid={amountError ? true : undefined}
							aria-describedby={amountError ? amountErrorId : undefined}
						/>
					</div>

					<FieldError id={amountErrorId}>{amountError}</FieldError>
					<FieldDescription>
						Una estimación editable, no un monto fijo: cada mes puedes ajustarlo
						al registrar el gasto real.
					</FieldDescription>
				</FieldContent>
			</Field>
		</FieldGroup>
	);
};
