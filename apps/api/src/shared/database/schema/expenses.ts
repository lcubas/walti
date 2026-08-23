import { sql } from 'drizzle-orm';
import {
	check,
	index,
	integer,
	sqliteTable,
	text,
} from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { isCivilDate } from './predicates';
import { categories } from './categories';
import { paymentSources, spaces } from './spaces';
import { users } from './users';

export const events = sqliteTable(
	'events',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		name: text('name').notNull(),
		startsOn: text('starts_on').notNull(),
		endsOn: text('ends_on').notNull(),
		budgetCents: integer('budget_cents'),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [
		index('events_space_idx').on(t.spaceId),
		check('events_range_valid', sql`${t.endsOn} >= ${t.startsOn}`),
	],
);

export const expenses = sqliteTable(
	'expenses',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		categoryId: text('category_id')
			.notNull()
			.references(() => categories.id),
		amountCents: integer('amount_cents').notNull(),
		occurredOn: text('occurred_on').notNull(),
		eventId: text('event_id').references(() => events.id),
		paymentSourceId: text('payment_source_id').references(
			() => paymentSources.id,
		),
		merchant: text('merchant'),
		note: text('note'),
		/** Internal only. Never shown in the UI; sorts the category picker by recent use. */
		createdByUserId: text('created_by_user_id')
			.notNull()
			.references(() => users.id),
		...timestamps(),
	},
	(t) => [
		index('expenses_space_date_idx').on(t.spaceId, t.occurredOn),
		index('expenses_space_category_date_idx').on(
			t.spaceId,
			t.categoryId,
			t.occurredOn,
		),
		index('expenses_event_idx').on(t.eventId),
		index('expenses_creator_recent_idx').on(t.createdByUserId, t.createdAt),
		check('expenses_occurred_on_format', isCivilDate(t.occurredOn)),
		check('expenses_amount_positive', sql`${t.amountCents} > 0`),
	],
);
