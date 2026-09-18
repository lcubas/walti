import * as v from 'valibot';
import { Currency } from './currency';

const spaceName = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Ponle un nombre al espacio.'),
	v.maxLength(50, 'El nombre no puede pasar de 50 caracteres.'),
);

export const spaceRoles = { owner: 'owner', member: 'member' } as const;

export const SpaceRole = v.picklist([spaceRoles.owner, spaceRoles.member]);

export type SpaceRole = v.InferOutput<typeof SpaceRole>;

export const Space = v.object({
	id: v.string(),
	name: v.string(),
	currency: Currency,
	/** The space created on first sign-in. It cannot be archived. */
	isDefault: v.boolean(),
	/** Null means active. */
	archivedAt: v.nullable(v.string()),
	role: SpaceRole,
	/** How many people are in it. One means private. */
	members: v.number(),
});

export type Space = v.InferOutput<typeof Space>;

export const SpaceList = v.array(Space);

export type SpaceList = v.InferOutput<typeof SpaceList>;

export const SpaceIdParam = v.object({
	spaceId: v.pipe(v.string(), v.uuid()),
});

export type SpaceIdParam = v.InferOutput<typeof SpaceIdParam>;

export const CreateSpaceRequest = v.object({ name: spaceName });

export type CreateSpaceRequest = v.InferOutput<typeof CreateSpaceRequest>;

export const RenameSpaceRequest = v.object({ name: spaceName });

export type RenameSpaceRequest = v.InferOutput<typeof RenameSpaceRequest>;
