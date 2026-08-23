import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/shared/config/env';

export default defineConfig({
	dialect: 'turso',
	schema: './src/shared/database/schema/index.ts',
	out: './src/shared/database/migrations',
	dbCredentials: {
		url: env.TURSO_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
});
