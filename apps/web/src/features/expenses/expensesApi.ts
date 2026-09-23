import { queryOptions } from '@tanstack/react-query';
import { Expense, ExpenseList, type CreateExpenseRequest } from '@walti/shared';
import { request } from '@/shared/api/httpClient';

export const expensesQueryKey = (spaceId: string, period: string) =>
	['expenses', spaceId, period] as const;

export const expensesQuery = (spaceId: string, period: string) =>
	queryOptions({
		queryKey: expensesQueryKey(spaceId, period),
		queryFn: ({ signal }) =>
			request(`/v1/spaces/${spaceId}/expenses?period=${period}`, ExpenseList, {
				signal,
			}),
	});

export const createExpense = (
	spaceId: string,
	body: CreateExpenseRequest,
): Promise<Expense> =>
	request(`/v1/spaces/${spaceId}/expenses`, Expense, {
		method: 'POST',
		body,
	});
