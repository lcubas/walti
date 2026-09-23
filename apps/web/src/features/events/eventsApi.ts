import { queryOptions } from '@tanstack/react-query';
import {
	type CreateEventRequest,
	Event,
	EventList,
	type UpdateEventRequest,
} from '@walti/shared';
import { request, requestNoContent } from '@/shared/api/httpClient';

export const eventsQueryKey = (spaceId: string) => ['events', spaceId] as const;

export const eventsQuery = (spaceId: string) =>
	queryOptions({
		queryKey: eventsQueryKey(spaceId),
		queryFn: ({ signal }) =>
			request(`/v1/spaces/${spaceId}/events`, EventList, { signal }),
	});

export const createEvent = (
	spaceId: string,
	body: CreateEventRequest,
): Promise<Event> =>
	request(`/v1/spaces/${spaceId}/events`, Event, { method: 'POST', body });

export const updateEvent = (
	spaceId: string,
	eventId: string,
	body: UpdateEventRequest,
) =>
	requestNoContent(`/v1/spaces/${spaceId}/events/${eventId}`, {
		method: 'PATCH',
		body,
	});

export const setEventArchived = (
	spaceId: string,
	eventId: string,
	archived: boolean,
) =>
	requestNoContent(`/v1/spaces/${spaceId}/events/${eventId}/archive`, {
		method: 'PATCH',
		body: { archived },
	});
