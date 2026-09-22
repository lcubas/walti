import { Expense, type CreateExpenseRequest } from '@walti/shared';
import { request } from '@/shared/api/httpClient';

export const createExpense = (
	spaceId: string,
	body: CreateExpenseRequest,
): Promise<Expense> =>
	request(`/v1/spaces/${spaceId}/expenses`, Expense, {
		method: 'POST',
		body,
	});
