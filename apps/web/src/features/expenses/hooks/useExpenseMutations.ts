import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateExpenseRequest } from '@walti/shared';
import { createExpense } from '@/features/expenses/expensesApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

export const useCreateExpense = (spaceId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateExpenseRequest) => createExpense(spaceId, body),
		onSuccess: () => {
			notifyDone('Gasto registrado');
			queryClient.invalidateQueries({ queryKey: ['expenses', spaceId] });
		},
		onError: (error) => notifyFailed('No pudimos registrar el gasto', error),
	});
};
