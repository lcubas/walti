import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	assignExpensesToEvent,
	eventExpenseCandidatesQueryKey,
	eventExpensesQueryKey,
} from '@/features/events/eventExpensesApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

const useEventExpensesMutation = (
	spaceId: string,
	eventId: string,
	options: {
		mutationFn: (expenseIds: string[]) => Promise<void>;
		done: string;
		failed: string;
	},
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: options.mutationFn,
		onSuccess: () => {
			notifyDone(options.done);
			queryClient.invalidateQueries({
				queryKey: eventExpensesQueryKey(spaceId, eventId),
			});
			queryClient.invalidateQueries({
				queryKey: eventExpenseCandidatesQueryKey(spaceId, eventId),
			});
			queryClient.invalidateQueries({ queryKey: ['expenses', spaceId] });
		},
		onError: (error) => notifyFailed(options.failed, error),
	});
};

export const useAssignExpensesToEvent = (spaceId: string, eventId: string) =>
	useEventExpensesMutation(spaceId, eventId, {
		mutationFn: (expenseIds) =>
			assignExpensesToEvent(spaceId, eventId, expenseIds),
		done: 'Gastos añadidos al evento',
		failed: 'No pudimos añadir los gastos al evento',
	});
