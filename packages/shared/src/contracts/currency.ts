import * as v from 'valibot';

export const Currency = v.picklist(['PEN', 'USD']);

export type Currency = v.InferOutput<typeof Currency>;
