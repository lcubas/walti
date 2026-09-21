import { queryOptions } from '@tanstack/react-query';
import {
	type CreateSpaceRequest,
	type RenameSpaceRequest,
	Space as SpaceContract,
	SpaceList,
} from '@walti/shared';
import { request, requestNoContent } from '@/shared/api/httpClient';
import { type SpaceTone, toneForPosition } from '@/shared/spaces/spaceTones';

/**
 * A space as the interface uses it: what the API returns plus the tone that
 * its position in the list gives it.
 */
export type Space = SpaceContract & { tone: SpaceTone };

export const spacesQueryKey = ['spaces'] as const;

export const spacesQuery = queryOptions({
	queryKey: spacesQueryKey,
	queryFn: ({ signal }) => request('/v1/spaces', SpaceList, { signal }),
	select: (spaces): Space[] =>
		spaces.map((space, position) => ({
			...space,
			tone: toneForPosition(position),
		})),
});

export const createSpace = (body: CreateSpaceRequest) =>
	request('/v1/spaces', SpaceContract, { method: 'POST', body });

export const renameSpace = (spaceId: string, body: RenameSpaceRequest) =>
	requestNoContent(`/v1/spaces/${spaceId}`, { method: 'PATCH', body });

export const setSpaceArchived = (spaceId: string, archived: boolean) =>
	requestNoContent(`/v1/spaces/${spaceId}/archive`, {
		method: 'PATCH',
		body: { archived },
	});
