import * as v from 'valibot';

export const HealthReport = v.object({
	status: v.picklist(['ok', 'degraded']),
	database: v.picklist(['up', 'down']),
});

export type HealthReport = v.InferOutput<typeof HealthReport>;
