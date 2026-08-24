import * as v from 'valibot';

const EnvSchema = v.object({
	TURSO_DATABASE_URL: v.pipe(v.string(), v.nonEmpty()),
	TURSO_AUTH_TOKEN: v.pipe(v.string(), v.nonEmpty()),
	APP_ENV: v.optional(v.picklist(['development', 'production']), 'development'),
	GOOGLE_CLIENT_ID: v.pipe(v.string(), v.nonEmpty()),
	SESSION_SECRET: v.pipe(v.string(), v.minLength(32)),
	ALLOWED_EMAILS: v.pipe(
		v.string(),
		v.nonEmpty(),
		v.transform((value) =>
			value
				.split(',')
				.map((email) => email.trim().toLowerCase())
				.filter(Boolean),
		),
	),
	ALLOWED_ORIGINS: v.pipe(
		v.string(),
		v.nonEmpty(),
		v.transform((value) =>
			value
				.split(',')
				.map((origin) => origin.trim())
				.filter(Boolean),
		),
	),
});

export type Env = v.InferOutput<typeof EnvSchema>;

export const env = v.parse(EnvSchema, process.env);
