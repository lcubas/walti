import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CategoryGroupList } from '@walti/shared';
import {
	categoriesQueryKey,
	createCategory,
	createCategoryGroup,
	renameCategoryGroup,
	setCategoryArchived,
	updateCategory,
} from '@/features/categories/categoriesApi';
import { notifyDone, notifyFailed } from '@/shared/notify';

const useCategoryMutation = <TVariables, TData>(
	spaceId: string,
	options: {
		mutationFn: (variables: TVariables) => Promise<TData>;
		done: string | ((variables: TVariables) => string);
		failed: string;
		optimistic?: (
			groups: CategoryGroupList,
			variables: TVariables,
		) => CategoryGroupList;
	},
) => {
	const queryClient = useQueryClient();
	const queryKey = categoriesQueryKey(spaceId);

	return useMutation({
		mutationFn: options.mutationFn,
		onMutate: async (variables) => {
			if (!options.optimistic) {
				return undefined;
			}

			// Stop an in-flight refetch from landing on top of the guess.
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<CategoryGroupList>(queryKey);

			if (previous) {
				queryClient.setQueryData<CategoryGroupList>(
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
		onSuccess: (_data, variables) =>
			notifyDone(
				typeof options.done === 'function'
					? options.done(variables)
					: options.done,
			),
		onSettled: () => queryClient.invalidateQueries({ queryKey }),
	});
};

const mapCategory = (
	groups: CategoryGroupList,
	categoryId: string,
	change: (category: CategoryGroupList[number]['categories'][number]) =>
		CategoryGroupList[number]['categories'][number],
): CategoryGroupList =>
	groups.map((group) => ({
		...group,
		categories: group.categories.map((category) =>
			category.id === categoryId ? change(category) : category,
		),
	}));

export const useCreateCategoryGroup = (spaceId: string) =>
	useCategoryMutation(spaceId, {
		mutationFn: (name: string) => createCategoryGroup(spaceId, { name }),
		done: 'Grupo creado',
		failed: 'No pudimos crear el grupo',
	});

export const useRenameCategoryGroup = (spaceId: string) =>
	useCategoryMutation(spaceId, {
		mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
			renameCategoryGroup(spaceId, groupId, { name }),
		done: 'Grupo renombrado',
		failed: 'No pudimos cambiar el nombre',
		optimistic: (groups, { groupId, name }) =>
			groups.map((group) =>
				group.id === groupId ? { ...group, name } : group,
			),
	});

export const useCreateCategory = (spaceId: string) =>
	useCategoryMutation(spaceId, {
		mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
			createCategory(spaceId, { groupId, name }),
		done: 'Categoría creada',
		failed: 'No pudimos crear la categoría',
	});

export const useRenameCategory = (spaceId: string) =>
	useCategoryMutation(spaceId, {
		mutationFn: ({
			categoryId,
			name,
		}: {
			categoryId: string;
			name: string;
		}) => updateCategory(spaceId, categoryId, { name }),
		done: 'Categoría renombrada',
		failed: 'No pudimos cambiar el nombre',
		optimistic: (groups, { categoryId, name }) =>
			mapCategory(groups, categoryId, (category) => ({ ...category, name })),
	});

// Not optimistic: where it lands inside the new group is the server's call.
export const useMoveCategory = (spaceId: string) =>
	useCategoryMutation(spaceId, {
		mutationFn: ({
			categoryId,
			groupId,
		}: {
			categoryId: string;
			groupId: string;
		}) => updateCategory(spaceId, categoryId, { groupId }),
		done: 'Categoría movida',
		failed: 'No pudimos mover la categoría',
	});

export const useSetCategoryArchived = (spaceId: string) =>
	useCategoryMutation(spaceId, {
		mutationFn: ({
			categoryId,
			archived,
		}: {
			categoryId: string;
			archived: boolean;
		}) => setCategoryArchived(spaceId, categoryId, archived),
		done: ({ archived }) =>
			archived ? 'Categoría archivada' : 'Categoría recuperada',
		failed: 'No pudimos cambiar la categoría',
		optimistic: (groups, { categoryId, archived }) =>
			mapCategory(groups, categoryId, (category) => ({
				...category,
				archivedAt: archived ? new Date().toISOString() : null,
			})),
	});
