import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateExpenseRequest, UpdateExpenseRequest } from '@walti/shared';
import {
	createExpense,
	deleteExpense,
	updateExpense,
} from '@/features/expenses/expensesApi';
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

export const useUpdateExpense = (spaceId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			expenseId,
			body,
		}: {
			expenseId: string;
			body: UpdateExpenseRequest;
		}) => updateExpense(spaceId, expenseId, body),
		onSuccess: () => {
			notifyDone('Gasto actualizado');
			queryClient.invalidateQueries({ queryKey: ['expenses', spaceId] });
		},
		onError: (error) => notifyFailed('No pudimos actualizar el gasto', error),
	});
};

export const useDeleteExpense = (spaceId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (expenseId: string) => deleteExpense(spaceId, expenseId),
		onSuccess: () => {
			notifyDone('Gasto eliminado');
			queryClient.invalidateQueries({ queryKey: ['expenses', spaceId] });
		},
		onError: (error) => notifyFailed('No pudimos eliminar el gasto', error),
	});
};
