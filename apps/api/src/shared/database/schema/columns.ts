import { text } from 'drizzle-orm/sqlite-core';
import { uuidv7 } from 'uuidv7';

const nowIso = () => new Date().toISOString();

export const primaryId = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => uuidv7());

export const timestamps = () => ({
	createdAt: text('created_at').notNull().$defaultFn(nowIso),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(nowIso)
		.$onUpdateFn(nowIso),
});
