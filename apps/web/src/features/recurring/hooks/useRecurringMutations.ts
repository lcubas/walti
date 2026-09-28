import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
	CreateRecurringItemRequest,
	RecurringItemList,
	UpdateRecurringItemRequest,
} from '@walti/shared';
import {
	createRecurringItem,
	recurringItemsQueryKey,
	setRecurringItemArchived,
	setRecurringItemPaused,
	updateRecurringItem,
} from '@/features/recurring/recurringApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

const useRecurringItemMutation = <TVariables, TData>(
	spaceId: string,
	options: {
		mutationFn: (variables: TVariables) => Promise<TData>;
		done: string;
		failed: string;
		optimistic?: (
			items: RecurringItemList,
			variables: TVariables,
		) => RecurringItemList;
	},
) => {
	const queryClient = useQueryClient();
	const queryKey = recurringItemsQueryKey(spaceId);

	return useMutation({
		mutationFn: options.mutationFn,
		onMutate: async (variables) => {
			if (!options.optimistic) {
				return undefined;
			}

			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<RecurringItemList>(queryKey);

			if (previous) {
				queryClient.setQueryData<RecurringItemList>(
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
		onSettled: () => queryClient.invalidateQueries({ queryKey }),
	});
};

export const useCreateRecurringItem = (spaceId: string) =>
	useRecurringItemMutation(spaceId, {
		mutationFn: (body: CreateRecurringItemRequest) =>
			createRecurringItem(spaceId, body),
		done: 'Recurrente creado',
		failed: 'No pudimos crear el recurrente',
	});

export const useUpdateRecurringItem = (spaceId: string) =>
	useRecurringItemMutation(spaceId, {
		mutationFn: ({
			recurringItemId,
			body,
		}: {
			recurringItemId: string;
			body: UpdateRecurringItemRequest;
		}) => updateRecurringItem(spaceId, recurringItemId, body),
		done: 'Recurrente actualizado',
		failed: 'No pudimos actualizar el recurrente',
		optimistic: (items, { recurringItemId, body }) =>
			items.map((item) =>
				item.id === recurringItemId
					? {
							...item,
							categoryId: body.categoryId ?? item.categoryId,
							name: body.name ?? item.name,
							kind: body.kind ?? item.kind,
							frequency: body.frequency ?? item.frequency,
							anchorDay: body.anchorDay ?? item.anchorDay,
							anchorMonth:
								body.anchorMonth !== undefined
									? body.anchorMonth
									: item.anchorMonth,
							expectedAmountCents:
								body.expectedAmountCents ?? item.expectedAmountCents,
						}
					: item,
			),
	});

export const usePauseRecurringItem = (spaceId: string) =>
	useRecurringItemMutation(spaceId, {
		mutationFn: (recurringItemId: string) =>
			setRecurringItemPaused(spaceId, recurringItemId, true),
		done: 'Recurrente pausado',
		failed: 'No pudimos pausar el recurrente',
		optimistic: (items, recurringItemId) =>
			items.map((item) =>
				item.id === recurringItemId
					? { ...item, pausedAt: new Date().toISOString() }
					: item,
			),
	});

export const useResumeRecurringItem = (spaceId: string) =>
	useRecurringItemMutation(spaceId, {
		mutationFn: (recurringItemId: string) =>
			setRecurringItemPaused(spaceId, recurringItemId, false),
		done: 'Recurrente reanudado',
		failed: 'No pudimos reanudar el recurrente',
		optimistic: (items, recurringItemId) =>
			items.map((item) =>
				item.id === recurringItemId ? { ...item, pausedAt: null } : item,
			),
	});

export const useArchiveRecurringItem = (spaceId: string) =>
	useRecurringItemMutation(spaceId, {
		mutationFn: (recurringItemId: string) =>
			setRecurringItemArchived(spaceId, recurringItemId, true),
		done: 'Recurrente eliminado',
		failed: 'No pudimos eliminar el recurrente',
		optimistic: (items, recurringItemId) =>
			items.map((item) =>
				item.id === recurringItemId
					? { ...item, archivedAt: new Date().toISOString() }
					: item,
			),
	});

export const useUnarchiveRecurringItem = (spaceId: string) =>
	useRecurringItemMutation(spaceId, {
		mutationFn: (recurringItemId: string) =>
			setRecurringItemArchived(spaceId, recurringItemId, false),
		done: 'Recurrente recuperado',
		failed: 'No pudimos recuperar el recurrente',
		optimistic: (items, recurringItemId) =>
			items.map((item) =>
				item.id === recurringItemId ? { ...item, archivedAt: null } : item,
			),
	});
