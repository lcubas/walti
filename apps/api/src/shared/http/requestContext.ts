import type { SpaceRole } from '@walti/shared';

export type SessionContext = {
	Variables: {
		userId: string;
	};
};

export type SpaceAccess = {
	id: string;
	role: SpaceRole;
};

export type SpaceContext = SessionContext & {
	Variables: {
		space: SpaceAccess;
	};
};
