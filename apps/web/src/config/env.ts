import * as v from 'valibot';

const EnvSchema = v.object({
	VITE_API_URL: v.pipe(v.string(), v.url()),
});

export const env = v.parse(EnvSchema, import.meta.env);
