import { sql } from 'drizzle-orm';
import {
	check,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { primaryId, timestamps } from './columns';
import { isMonthPeriod } from './predicates';
import { categories } from './categories';
import { expenses } from './expenses';
import { spaces } from './spaces';
import { users } from './users';

export const recurringKinds = ['automatic', 'manual'] as const;
export type RecurringKind = (typeof recurringKinds)[number];

export const recurringFrequencies = ['monthly', 'yearly'] as const;
export type RecurringFrequency = (typeof recurringFrequencies)[number];

export const recurringItems = sqliteTable(
	'recurring_items',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		categoryId: text('category_id')
			.notNull()
			.references(() => categories.id),
		name: text('name').notNull(),
		kind: text('kind', { enum: recurringKinds }).notNull(),
		frequency: text('frequency', { enum: recurringFrequencies })
			.notNull()
			.default('monthly'),
		anchorDay: integer('anchor_day').notNull(),
		expectedAmountCents: integer('expected_amount_cents').notNull(),
		pausedAt: text('paused_at'),
		archivedAt: text('archived_at'),
		...timestamps(),
	},
	(t) => [
		index('recurring_items_space_idx').on(t.spaceId),
		check(
			'recurring_items_anchor_day_range',
			sql`${t.anchorDay} BETWEEN 1 AND 31`,
		),
		check(
			'recurring_items_expected_positive',
			sql`${t.expectedAmountCents} > 0`,
		),
	],
);

export const recurringPeriodStatuses = [
	'pending',
	'registered',
	'postponed',
	'skipped',
] as const;
export type RecurringPeriodStatus = (typeof recurringPeriodStatuses)[number];

/** An expected payment for one period, not an expense. Only `registered` maps to a real expense. */
export const recurringPeriods = sqliteTable(
	'recurring_periods',
	{
		id: primaryId(),
		recurringItemId: text('recurring_item_id')
			.notNull()
			.references(() => recurringItems.id),
		period: text('period').notNull(),
		dueOn: text('due_on').notNull(),
		expectedAmountCents: integer('expected_amount_cents').notNull(),
		status: text('status', { enum: recurringPeriodStatuses })
			.notNull()
			.default('pending'),
		expenseId: text('expense_id').references(() => expenses.id),
		remindAt: text('remind_at'),
		resolvedByUserId: text('resolved_by_user_id').references(() => users.id),
		resolvedAt: text('resolved_at'),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('recurring_periods_item_period_unique').on(
			t.recurringItemId,
			t.period,
		),
		index('recurring_periods_status_due_idx').on(t.status, t.dueOn),
		check('recurring_periods_period_format', isMonthPeriod(t.period)),
		check(
			'recurring_periods_expense_only_when_registered',
			sql`(${t.status} = 'registered') = (${t.expenseId} IS NOT NULL)`,
		),
	],
);
