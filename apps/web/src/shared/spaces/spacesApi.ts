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

/**
 * Every space the user belongs to, archived ones included. The switcher filters
 * them; the management screen needs all of them.
 *
 * It lives in `shared/` and not in the feature because the header reads it on
 * every screen, and `shared/` cannot import from a feature.
 */
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

// These three answer 204: the list is refetched anyway, because the member
// count and the tones of the other spaces are decided by the whole list.
export const renameSpace = (spaceId: string, body: RenameSpaceRequest) =>
	requestNoContent(`/v1/spaces/${spaceId}`, { method: 'PATCH', body });

export const archiveSpace = (spaceId: string) =>
	requestNoContent(`/v1/spaces/${spaceId}/archive`, { method: 'POST' });

export const unarchiveSpace = (spaceId: string) =>
	requestNoContent(`/v1/spaces/${spaceId}/unarchive`, { method: 'POST' });
