import * as v from 'valibot';

export const recurringKinds = ['automatic', 'manual'] as const;

export const RecurringKind = v.picklist(recurringKinds);

export type RecurringKind = v.InferOutput<typeof RecurringKind>;

export const recurringFrequencies = ['monthly', 'yearly'] as const;

export const RecurringFrequency = v.picklist(recurringFrequencies);

export type RecurringFrequency = v.InferOutput<typeof RecurringFrequency>;

export const RecurringItem = v.object({
	id: v.string(),
	categoryId: v.string(),
	name: v.string(),
	kind: RecurringKind,
	frequency: RecurringFrequency,
	anchorDay: v.number(),
	/** Month (1-12) it falls on. Only set when `frequency` is `'yearly'` —
	 * kept in lockstep with it by a DB check constraint. */
	anchorMonth: v.nullable(v.number()),
	expectedAmountCents: v.number(),
	/** Null means active. A paused recurrent stops creating pendientes
	 * (E7.2) but keeps its history. */
	pausedAt: v.nullable(v.string()),
	/** Null means active. An archived recurrent keeps its history. */
	archivedAt: v.nullable(v.string()),
});

export type RecurringItem = v.InferOutput<typeof RecurringItem>;

/** Every recurrent of a space. Paused and archived entries are included. */
export const RecurringItemList = v.array(RecurringItem);

export type RecurringItemList = v.InferOutput<typeof RecurringItemList>;

const id = v.pipe(v.string(), v.uuid());

export const RecurringItemIdParam = v.object({ recurringItemId: id });

export type RecurringItemIdParam = v.InferOutput<typeof RecurringItemIdParam>;

const recurringItemName = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Ponle un nombre al recurrente.'),
	v.maxLength(40, 'El nombre no puede pasar de 40 caracteres.'),
);

const anchorDay = v.pipe(
	v.number(),
	v.integer('El día debe ser un número entero.'),
	v.minValue(1, 'El día debe estar entre 1 y 31.'),
	v.maxValue(31, 'El día debe estar entre 1 y 31.'),
);

const anchorMonth = v.pipe(
	v.number(),
	v.integer('El mes debe ser un número entero.'),
	v.minValue(1, 'El mes debe estar entre 1 y 12.'),
	v.maxValue(12, 'El mes debe estar entre 1 y 12.'),
);

const expectedAmountCents = v.pipe(
	v.number(),
	v.integer('El monto debe ser un número entero de centavos.'),
	v.minValue(1, 'El monto debe ser mayor a cero.'),
);

export const CreateRecurringItemRequest = v.pipe(
	v.object({
		categoryId: id,
		name: recurringItemName,
		kind: RecurringKind,
		frequency: RecurringFrequency,
		anchorDay,
		anchorMonth: v.optional(anchorMonth),
		expectedAmountCents,
	}),
	// A yearly recurrent must carry its month; a monthly one must not carry
	// one — the same pair the DB check constraint enforces.
	v.check(
		(input) =>
			input.frequency === 'yearly'
				? input.anchorMonth !== undefined
				: input.anchorMonth === undefined,
		'Un recurrente anual necesita un mes; uno mensual no lleva mes.',
	),
);

export type CreateRecurringItemRequest = v.InferOutput<
	typeof CreateRecurringItemRequest
>;

/**
 * A partial patch: only the fields that changed are sent, same convention as
 * `UpdateEventRequest`. `anchorMonth` can be `null` to clear it when
 * switching back to monthly, distinct from leaving it out (no change). This
 * can't validate frequency/anchorMonth consistency by itself — a patch may
 * touch only one of them — so `RecurringItemService.verifyAnchor` re-checks
 * the merged result in the use case, same pattern as `EventService.verifyDateRange`.
 */
export const UpdateRecurringItemRequest = v.pipe(
	v.object({
		categoryId: v.optional(id),
		name: v.optional(recurringItemName),
		kind: v.optional(RecurringKind),
		frequency: v.optional(RecurringFrequency),
		anchorDay: v.optional(anchorDay),
		anchorMonth: v.optional(v.nullable(anchorMonth)),
		expectedAmountCents: v.optional(expectedAmountCents),
	}),
	v.check(
		(input) =>
			input.categoryId !== undefined ||
			input.name !== undefined ||
			input.kind !== undefined ||
			input.frequency !== undefined ||
			input.anchorDay !== undefined ||
			input.anchorMonth !== undefined ||
			input.expectedAmountCents !== undefined,
		'No hay nada que cambiar.',
	),
);

export type UpdateRecurringItemRequest = v.InferOutput<
	typeof UpdateRecurringItemRequest
>;

/**
 * What the pause endpoint takes. The value is explicit and not a toggle, so
 * repeating the request leaves the same state — same convention as
 * `ArchiveRequest`.
 */
export const PauseRequest = v.object({
	/** True pauses it, false resumes it. */
	paused: v.boolean(),
});

export type PauseRequest = v.InferOutput<typeof PauseRequest>;
