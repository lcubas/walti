import { queryOptions } from '@tanstack/react-query';
import {
	type CreateRecurringItemRequest,
	RecurringItem,
	RecurringItemList,
	type UpdateRecurringItemRequest,
} from '@walti/shared';
import { request, requestNoContent } from '@/shared/api/httpClient';

export const recurringItemsQueryKey = (spaceId: string) =>
	['recurringItems', spaceId] as const;

export const recurringItemsQuery = (spaceId: string) =>
	queryOptions({
		queryKey: recurringItemsQueryKey(spaceId),
		queryFn: ({ signal }) =>
			request(`/v1/spaces/${spaceId}/recurring-items`, RecurringItemList, {
				signal,
			}),
	});

export const createRecurringItem = (
	spaceId: string,
	body: CreateRecurringItemRequest,
): Promise<RecurringItem> =>
	request(`/v1/spaces/${spaceId}/recurring-items`, RecurringItem, {
		method: 'POST',
		body,
	});

export const updateRecurringItem = (
	spaceId: string,
	recurringItemId: string,
	body: UpdateRecurringItemRequest,
) =>
	requestNoContent(
		`/v1/spaces/${spaceId}/recurring-items/${recurringItemId}`,
		{ method: 'PATCH', body },
	);

export const setRecurringItemPaused = (
	spaceId: string,
	recurringItemId: string,
	paused: boolean,
) =>
	requestNoContent(
		`/v1/spaces/${spaceId}/recurring-items/${recurringItemId}/pause`,
		{ method: 'PATCH', body: { paused } },
	);

export const setRecurringItemArchived = (
	spaceId: string,
	recurringItemId: string,
	archived: boolean,
) =>
	requestNoContent(
		`/v1/spaces/${spaceId}/recurring-items/${recurringItemId}/archive`,
		{ method: 'PATCH', body: { archived } },
	);
