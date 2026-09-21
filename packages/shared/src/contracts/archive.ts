import * as v from 'valibot';

/**
 * What the archive endpoints take. The value is explicit and not a toggle, so
 * repeating the request leaves the same state.
 */
export const ArchiveRequest = v.object({
	/** True archives it, false brings it back. */
	archived: v.boolean(),
});

export type ArchiveRequest = v.InferOutput<typeof ArchiveRequest>;
