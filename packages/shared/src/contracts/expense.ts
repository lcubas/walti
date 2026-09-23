import * as v from 'valibot';

export const Expense = v.object({
	id: v.string(),
	categoryId: v.string(),
	amountCents: v.number(),
	occurredOn: v.string(),
	/** Null when the expense carries no payment source. */
	paymentSourceId: v.nullable(v.string()),
	/** Null when the expense carries no merchant or concept. */
	merchant: v.nullable(v.string()),
	/** Null when the expense carries no note. */
	note: v.nullable(v.string()),
});

export type Expense = v.InferOutput<typeof Expense>;

/** Every expense of a space for one month, most recent first. */
export const ExpenseList = v.array(Expense);

export type ExpenseList = v.InferOutput<typeof ExpenseList>;

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

const paymentSourceId = v.pipe(v.string(), v.uuid());

const merchant = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('El comercio o concepto no puede estar vacío.'),
	v.maxLength(60, 'El comercio o concepto no puede pasar de 60 caracteres.'),
);

const note = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('La nota no puede estar vacía.'),
	v.maxLength(200, 'La nota no puede pasar de 200 caracteres.'),
);

export const CreateExpenseRequest = v.object({
	categoryId,
	amountCents,
	occurredOn,
	paymentSourceId: v.optional(paymentSourceId),
	merchant: v.optional(merchant),
	note: v.optional(note),
});

export type CreateExpenseRequest = v.InferOutput<typeof CreateExpenseRequest>;

/** Editing a gasto resends every field, same shape as creating one: the
 * edit form is always pre-filled with the current values, so there is no
 * partial-patch case to represent. */
export const UpdateExpenseRequest = CreateExpenseRequest;

export type UpdateExpenseRequest = v.InferOutput<typeof UpdateExpenseRequest>;

const expenseId = v.pipe(v.string(), v.uuid());

export const ExpenseIdParam = v.object({ expenseId });

export type ExpenseIdParam = v.InferOutput<typeof ExpenseIdParam>;

const period = v.pipe(
	v.string(),
	v.regex(/^\d{4}-\d{2}$/, 'El periodo debe tener el formato AAAA-MM.'),
);

export const ListExpensesQuery = v.object({ period });

export type ListExpensesQuery = v.InferOutput<typeof ListExpensesQuery>;
