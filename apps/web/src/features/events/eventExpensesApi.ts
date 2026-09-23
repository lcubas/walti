import { queryOptions } from '@tanstack/react-query';
import { ExpenseList } from '@walti/shared';
import { request, requestNoContent } from '@/shared/api/httpClient';

export const eventExpensesQueryKey = (spaceId: string, eventId: string) =>
	['events', spaceId, eventId, 'expenses'] as const;

export const eventExpensesQuery = (spaceId: string, eventId: string) =>
	queryOptions({
		queryKey: eventExpensesQueryKey(spaceId, eventId),
		queryFn: ({ signal }) =>
			request(`/v1/spaces/${spaceId}/events/${eventId}/expenses`, ExpenseList, {
				signal,
			}),
	});

export const eventExpenseCandidatesQueryKey = (
	spaceId: string,
	eventId: string,
) => ['events', spaceId, eventId, 'expenses', 'candidates'] as const;

export const eventExpenseCandidatesQuery = (spaceId: string, eventId: string) =>
	queryOptions({
		queryKey: eventExpenseCandidatesQueryKey(spaceId, eventId),
		queryFn: ({ signal }) =>
			request(
				`/v1/spaces/${spaceId}/events/${eventId}/expenses/candidates`,
				ExpenseList,
				{ signal },
			),
	});

export const assignExpensesToEvent = (
	spaceId: string,
	eventId: string,
	expenseIds: string[],
) =>
	requestNoContent(`/v1/spaces/${spaceId}/events/${eventId}/expenses`, {
		method: 'POST',
		body: { expenseIds },
	});

export const unassignExpensesFromEvent = (
	spaceId: string,
	eventId: string,
	expenseIds: string[],
) =>
	requestNoContent(`/v1/spaces/${spaceId}/events/${eventId}/expenses`, {
		method: 'DELETE',
		body: { expenseIds },
	});
