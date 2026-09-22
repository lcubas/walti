import { queryOptions } from '@tanstack/react-query';
import {
	Category,
	CategoryGroup,
	CategoryGroupList,
	type CreateCategoryGroupRequest,
	type CreateCategoryRequest,
	type RenameCategoryGroupRequest,
	type UpdateCategoryRequest,
} from '@walti/shared';
import { request, requestNoContent } from '@/shared/api/httpClient';

export const categoriesQueryKey = (spaceId: string) =>
	['categories', spaceId] as const;

export const categoriesQuery = (spaceId: string) =>
	queryOptions({
		queryKey: categoriesQueryKey(spaceId),
		queryFn: ({ signal }) =>
			request(`/v1/spaces/${spaceId}/categories`, CategoryGroupList, {
				signal,
			}),
	});

export const createCategory = (
	spaceId: string,
	body: CreateCategoryRequest,
): Promise<Category> =>
	request(`/v1/spaces/${spaceId}/categories`, Category, {
		method: 'POST',
		body,
	});

export const updateCategory = (
	spaceId: string,
	categoryId: string,
	body: UpdateCategoryRequest,
) =>
	requestNoContent(`/v1/spaces/${spaceId}/categories/${categoryId}`, {
		method: 'PATCH',
		body,
	});

export const setCategoryArchived = (
	spaceId: string,
	categoryId: string,
	archived: boolean,
) =>
	requestNoContent(`/v1/spaces/${spaceId}/categories/${categoryId}/archive`, {
		method: 'PATCH',
		body: { archived },
	});

export const createCategoryGroup = (
	spaceId: string,
	body: CreateCategoryGroupRequest,
) =>
	request(`/v1/spaces/${spaceId}/categories/groups`, CategoryGroup, {
		method: 'POST',
		body,
	});

export const renameCategoryGroup = (
	spaceId: string,
	groupId: string,
	body: RenameCategoryGroupRequest,
) =>
	requestNoContent(`/v1/spaces/${spaceId}/categories/groups/${groupId}`, {
		method: 'PATCH',
		body,
	});
