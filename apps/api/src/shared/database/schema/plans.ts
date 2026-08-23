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
import { categories, categoryGroups } from './categories';
import { spaces } from './spaces';

export const monthlyPlans = sqliteTable(
	'monthly_plans',
	{
		id: primaryId(),
		spaceId: text('space_id')
			.notNull()
			.references(() => spaces.id),
		period: text('period').notNull(),
		maxLimitCents: integer('max_limit_cents'),
		acceptedAt: text('accepted_at'),
		...timestamps(),
	},
	(t) => [
		uniqueIndex('monthly_plans_space_period_unique').on(t.spaceId, t.period),
		check('monthly_plans_period_format', isMonthPeriod(t.period)),
	],
);

export const monthlyPlanAllocations = sqliteTable(
	'monthly_plan_allocations',
	{
		id: primaryId(),
		monthlyPlanId: text('monthly_plan_id')
			.notNull()
			.references(() => monthlyPlans.id),
		groupId: text('group_id').references(() => categoryGroups.id),
		categoryId: text('category_id').references(() => categories.id),
		amountCents: integer('amount_cents').notNull(),
		...timestamps(),
	},
	(t) => [
		index('monthly_plan_allocations_plan_idx').on(t.monthlyPlanId),
		check(
			'monthly_plan_allocations_amount_positive',
			sql`${t.amountCents} > 0`,
		),
		check(
			'monthly_plan_allocations_group_xor_category',
			sql`(${t.groupId} IS NOT NULL) <> (${t.categoryId} IS NOT NULL)`,
		),
	],
);
