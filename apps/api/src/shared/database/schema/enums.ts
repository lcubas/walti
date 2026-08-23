export const currencies = ['PEN', 'USD'] as const;
export type Currency = (typeof currencies)[number];
