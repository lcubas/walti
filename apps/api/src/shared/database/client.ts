import { drizzle } from 'drizzle-orm/libsql/node';
import { env } from '../../config/env';

export const db = drizzle({
	connection: {
		url: env.TURSO_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
});

export type Database = typeof db;
