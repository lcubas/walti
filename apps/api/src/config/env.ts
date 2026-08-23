import * as v from 'valibot';

const EnvSchema = v.object({
	TURSO_DATABASE_URL: v.pipe(v.string(), v.nonEmpty()),
	TURSO_AUTH_TOKEN: v.pipe(v.string(), v.nonEmpty()),
	APP_ENV: v.optional(v.picklist(['development', 'production']), 'development'),
});

export type Env = v.InferOutput<typeof EnvSchema>;

export const env = v.parse(EnvSchema, process.env);
