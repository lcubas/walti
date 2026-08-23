import { sql } from 'drizzle-orm';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';

/** SQLite has no built-in REGEXP, so GLOB is used to pin down date formats. */
export const isCivilDate = (column: SQLiteColumn) =>
	sql`${column} GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'`;

export const isMonthPeriod = (column: SQLiteColumn) =>
	sql`${column} GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]'`;
