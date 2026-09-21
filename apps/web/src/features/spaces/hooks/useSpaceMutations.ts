import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Space as SpaceContract } from '@walti/shared';
import {
	createSpace,
	spacesQueryKey,
	renameSpace,
	setSpaceArchived,
} from '@/shared/spaces/spacesApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

type SpaceRows = SpaceContract[];

/**
 * Every one of these changes the list the header and the switcher read, so they
 * all end the same way: invalidate it and let the cache refill. The response
 * body is not used — the member count and the tones depend on the list as a
 * whole, so the list is the only thing worth trusting.
 */
const useSpaceMutation = <TVariables, TData>(options: {
	mutationFn: (variables: TVariables) => Promise<TData>;
	done: string;
	failed: string;
	/**
	 * Applied to the cached list before the request leaves, so the row moves
	 * under the finger instead of after the round trip. Rolled back if the
	 * server refuses.
	 */
	optimistic?: (rows: SpaceRows, variables: TVariables) => SpaceRows;
}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: options.mutationFn,
		onMutate: async (variables) => {
			if (!options.optimistic) {
				return undefined;
			}

			// Stop an in-flight refetch from landing on top of the guess.
			await queryClient.cancelQueries({ queryKey: spacesQueryKey });

			const previous = queryClient.getQueryData<SpaceRows>(spacesQueryKey);

			if (previous) {
				queryClient.setQueryData<SpaceRows>(
					spacesQueryKey,
					options.optimistic(previous, variables),
				);
			}

			return { previous };
		},
		onError: (error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(spacesQueryKey, context.previous);
			}

			notifyFailed(options.failed, error);
		},
		onSuccess: () => notifyDone(options.done),
		// Whatever happened, the server is the one that knows. Runs after the
		// rollback so a failed guess is never left on screen.
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: spacesQueryKey }),
	});
};

const setArchivedAt = (
	rows: SpaceRows,
	spaceId: string,
	archivedAt: string | null,
): SpaceRows =>
	rows.map((row) => (row.id === spaceId ? { ...row, archivedAt } : row));

export const useCreateSpace = () =>
	useSpaceMutation({
		mutationFn: (name: string) => createSpace({ name }),
		done: 'Espacio creado',
		failed: 'No pudimos crear el espacio',
	});

export const useRenameSpace = () =>
	useSpaceMutation({
		mutationFn: ({ spaceId, name }: { spaceId: string; name: string }) =>
			renameSpace(spaceId, { name }),
		done: 'Nombre actualizado',
		failed: 'No pudimos cambiar el nombre',
		optimistic: (rows, { spaceId, name }) =>
			rows.map((row) => (row.id === spaceId ? { ...row, name } : row)),
	});

export const useArchiveSpace = () =>
	useSpaceMutation({
		mutationFn: (spaceId: string) => setSpaceArchived(spaceId, true),
		done: 'Espacio archivado',
		failed: 'No pudimos archivar el espacio',
		optimistic: (rows, spaceId) =>
			setArchivedAt(rows, spaceId, new Date().toISOString()),
	});

export const useUnarchiveSpace = () =>
	useSpaceMutation({
		mutationFn: (spaceId: string) => setSpaceArchived(spaceId, false),
		done: 'Espacio recuperado',
		failed: 'No pudimos recuperar el espacio',
		optimistic: (rows, spaceId) => setArchivedAt(rows, spaceId, null),
	});
