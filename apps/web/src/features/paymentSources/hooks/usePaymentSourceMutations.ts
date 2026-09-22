import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaymentSource } from '@walti/shared';
import {
	createPaymentSource,
	paymentSourcesQueryKey,
	renamePaymentSource,
	setPaymentSourceArchived,
} from '@/features/paymentSources/paymentSourcesApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

type PaymentSourceRows = PaymentSource[];

/**
 * Every one of these changes the list the account screen reads, so they all
 * end the same way: invalidate it and let the cache refill.
 */
const usePaymentSourceMutation = <TVariables, TData>(options: {
	mutationFn: (variables: TVariables) => Promise<TData>;
	done: string;
	failed: string;
	/**
	 * Applied to the cached list before the request leaves, so the row moves
	 * under the finger instead of after the round trip. Rolled back if the
	 * server refuses.
	 */
	optimistic?: (
		rows: PaymentSourceRows,
		variables: TVariables,
	) => PaymentSourceRows;
}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: options.mutationFn,
		onMutate: async (variables) => {
			if (!options.optimistic) {
				return undefined;
			}

			await queryClient.cancelQueries({ queryKey: paymentSourcesQueryKey });

			const previous = queryClient.getQueryData<PaymentSourceRows>(
				paymentSourcesQueryKey,
			);

			if (previous) {
				queryClient.setQueryData<PaymentSourceRows>(
					paymentSourcesQueryKey,
					options.optimistic(previous, variables),
				);
			}

			return { previous };
		},
		onError: (error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(paymentSourcesQueryKey, context.previous);
			}

			notifyFailed(options.failed, error);
		},
		onSuccess: () => notifyDone(options.done),
		// Whatever happened, the server is the one that knows. Runs after the
		// rollback so a failed guess is never left on screen.
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: paymentSourcesQueryKey }),
	});
};

const setArchivedAt = (
	rows: PaymentSourceRows,
	paymentSourceId: string,
	archivedAt: string | null,
): PaymentSourceRows =>
	rows.map((row) =>
		row.id === paymentSourceId ? { ...row, archivedAt } : row,
	);

export const useCreatePaymentSource = () =>
	usePaymentSourceMutation({
		mutationFn: (name: string) => createPaymentSource({ name }),
		done: 'Fuente de pago creada',
		failed: 'No pudimos crear la fuente de pago',
	});

export const useRenamePaymentSource = () =>
	usePaymentSourceMutation({
		mutationFn: ({
			paymentSourceId,
			name,
		}: {
			paymentSourceId: string;
			name: string;
		}) => renamePaymentSource(paymentSourceId, { name }),
		done: 'Nombre actualizado',
		failed: 'No pudimos cambiar el nombre',
		optimistic: (rows, { paymentSourceId, name }) =>
			rows.map((row) => (row.id === paymentSourceId ? { ...row, name } : row)),
	});

export const useArchivePaymentSource = () =>
	usePaymentSourceMutation({
		mutationFn: (paymentSourceId: string) =>
			setPaymentSourceArchived(paymentSourceId, true),
		done: 'Fuente de pago archivada',
		failed: 'No pudimos archivar la fuente de pago',
		optimistic: (rows, paymentSourceId) =>
			setArchivedAt(rows, paymentSourceId, new Date().toISOString()),
	});

export const useUnarchivePaymentSource = () =>
	usePaymentSourceMutation({
		mutationFn: (paymentSourceId: string) =>
			setPaymentSourceArchived(paymentSourceId, false),
		done: 'Fuente de pago recuperada',
		failed: 'No pudimos recuperar la fuente de pago',
		optimistic: (rows, paymentSourceId) =>
			setArchivedAt(rows, paymentSourceId, null),
	});
