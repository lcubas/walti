import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
	CreateEventRequest,
	EventList,
	UpdateEventRequest,
} from '@walti/shared';
import {
	createEvent,
	eventsQueryKey,
	setEventArchived,
	updateEvent,
} from '@/features/events/eventsApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

/**
 * Every one of these changes the list `eventsQuery` reads, so they all end
 * the same way: invalidate it and let the cache refill. `optimistic` writes
 * the guess into the cache before the request leaves, so a row updates
 * under the finger instead of after the round trip — same shape as
 * `useCategoryMutation`/`usePaymentSourceMutation`, which solved the same
 * "queda pegado" feeling for archivar/desarchivar there.
 */
const useEventMutation = <TVariables, TData>(
	spaceId: string,
	options: {
		mutationFn: (variables: TVariables) => Promise<TData>;
		done: string;
		failed: string;
		optimistic?: (events: EventList, variables: TVariables) => EventList;
	},
) => {
	const queryClient = useQueryClient();
	const queryKey = eventsQueryKey(spaceId);

	return useMutation({
		mutationFn: options.mutationFn,
		onMutate: async (variables) => {
			if (!options.optimistic) {
				return undefined;
			}

			// Stop an in-flight refetch from landing on top of the guess.
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<EventList>(queryKey);

			if (previous) {
				queryClient.setQueryData<EventList>(
					queryKey,
					options.optimistic(previous, variables),
				);
			}

			return { previous };
		},
		onError: (error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}

			notifyFailed(options.failed, error);
		},
		onSuccess: () => notifyDone(options.done),
		// Whatever happened, the server is the one that knows. Runs after the
		// rollback so a failed guess is never left on screen.
		onSettled: () => queryClient.invalidateQueries({ queryKey }),
	});
};

export const useCreateEvent = (spaceId: string) =>
	useEventMutation(spaceId, {
		mutationFn: (body: CreateEventRequest) => createEvent(spaceId, body),
		done: 'Evento creado',
		failed: 'No pudimos crear el evento',
	});

export const useUpdateEvent = (spaceId: string) =>
	useEventMutation(spaceId, {
		mutationFn: ({
			eventId,
			body,
		}: {
			eventId: string;
			body: UpdateEventRequest;
		}) => updateEvent(spaceId, eventId, body),
		done: 'Evento actualizado',
		failed: 'No pudimos actualizar el evento',
		optimistic: (events, { eventId, body }) =>
			events.map((event) =>
				event.id === eventId
					? {
							...event,
							name: body.name ?? event.name,
							startsOn: body.startsOn ?? event.startsOn,
							endsOn: body.endsOn ?? event.endsOn,
							budgetCents:
								body.budgetCents !== undefined
									? body.budgetCents
									: event.budgetCents,
						}
					: event,
			),
	});

export const useArchiveEvent = (spaceId: string) =>
	useEventMutation(spaceId, {
		mutationFn: (eventId: string) => setEventArchived(spaceId, eventId, true),
		done: 'Evento archivado',
		failed: 'No pudimos archivar el evento',
		optimistic: (events, eventId) =>
			events.map((event) =>
				event.id === eventId
					? { ...event, archivedAt: new Date().toISOString() }
					: event,
			),
	});

export const useUnarchiveEvent = (spaceId: string) =>
	useEventMutation(spaceId, {
		mutationFn: (eventId: string) => setEventArchived(spaceId, eventId, false),
		done: 'Evento recuperado',
		failed: 'No pudimos recuperar el evento',
		optimistic: (events, eventId) =>
			events.map((event) =>
				event.id === eventId ? { ...event, archivedAt: null } : event,
			),
	});
