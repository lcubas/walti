import * as v from 'valibot';

export const Event = v.object({
	id: v.string(),
	name: v.string(),
	startsOn: v.string(),
	endsOn: v.string(),
	/** Null when the event carries no budget. */
	budgetCents: v.nullable(v.number()),
	/** Null means active. An archived event keeps its history. */
	archivedAt: v.nullable(v.string()),
});

export type Event = v.InferOutput<typeof Event>;

/** Every event of a space, in display order. Archived entries are included. */
export const EventList = v.array(Event);

export type EventList = v.InferOutput<typeof EventList>;

const eventName = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Ponle un nombre al evento.'),
	v.maxLength(40, 'El nombre no puede pasar de 40 caracteres.'),
);

const eventDate = v.pipe(
	v.string(),
	v.regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato AAAA-MM-DD.'),
);

const budgetCents = v.pipe(
	v.number(),
	v.integer('El presupuesto debe ser un número entero de centavos.'),
	v.minValue(1, 'El presupuesto debe ser mayor a cero.'),
);

const id = v.pipe(v.string(), v.uuid());

export const EventIdParam = v.object({ eventId: id });

export type EventIdParam = v.InferOutput<typeof EventIdParam>;

export const CreateEventRequest = v.pipe(
	v.object({
		name: eventName,
		startsOn: eventDate,
		endsOn: eventDate,
		budgetCents: v.optional(budgetCents),
	}),
	v.check(
		(input) => input.endsOn >= input.startsOn,
		'La fecha de fin no puede ser anterior a la de inicio.',
	),
);

export type CreateEventRequest = v.InferOutput<typeof CreateEventRequest>;

/**
 * A partial patch: only the fields that changed are sent. `budgetCents` can
 * be `null` to clear a budget the event already had, distinct from leaving
 * it out to mean "no change".
 */
export const UpdateEventRequest = v.pipe(
	v.object({
		name: v.optional(eventName),
		startsOn: v.optional(eventDate),
		endsOn: v.optional(eventDate),
		budgetCents: v.optional(v.nullable(budgetCents)),
	}),
	v.check(
		(input) =>
			input.name !== undefined ||
			input.startsOn !== undefined ||
			input.endsOn !== undefined ||
			input.budgetCents !== undefined,
		'No hay nada que cambiar.',
	),
);

export type UpdateEventRequest = v.InferOutput<typeof UpdateEventRequest>;

const expenseIds = v.pipe(
	v.array(v.pipe(v.string(), v.uuid())),
	v.minLength(1, 'Selecciona al menos un gasto.'),
);

/** Body for bulk-linking or bulk-unlinking expenses from an event, from the
 * event's own view ("gastos que se escaparon"). Same shape both ways. */
export const AssociateExpensesRequest = v.object({ expenseIds });

export type AssociateExpensesRequest = v.InferOutput<
	typeof AssociateExpensesRequest
>;
