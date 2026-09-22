import * as v from 'valibot';

export const Expense = v.object({
	id: v.string(),
	categoryId: v.string(),
	amountCents: v.number(),
	occurredOn: v.string(),
});

export type Expense = v.InferOutput<typeof Expense>;

const amountCents = v.pipe(
	v.number(),
	v.integer('El monto debe ser un número entero de centavos.'),
	v.minValue(1, 'El monto debe ser mayor a cero.'),
);

const occurredOn = v.pipe(
	v.string(),
	v.regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato AAAA-MM-DD.'),
);

const categoryId = v.pipe(v.string(), v.uuid());

export const CreateExpenseRequest = v.object({
	categoryId,
	amountCents,
	occurredOn,
});

export type CreateExpenseRequest = v.InferOutput<typeof CreateExpenseRequest>;
