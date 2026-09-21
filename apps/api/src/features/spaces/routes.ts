import { Hono } from 'hono';
import {
	ArchiveRequest,
	CreateSpaceRequest,
	RenameSpaceRequest,
	SpaceIdParam,
} from '@walti/shared';
import {
	getSpacesController,
	patchSpaceArchiveController,
	patchSpaceController,
	postSpaceController,
} from '../../container';
import { spaceHandler } from '../../shared/http/middlewares/spaceHandler';
import { spaceOwnerHandler } from '../../shared/http/middlewares/spaceOwnerHandler';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SessionContext } from '../../shared/http/requestContext';

export const spaceRoutes = new Hono<SessionContext>();

spaceRoutes.get('/', (c) => getSpacesController.handle(c));

spaceRoutes.post('/', validatorHandler.json(CreateSpaceRequest), (c) =>
	postSpaceController.handle(c, c.req.valid('json')),
);

// On the route and not on a wildcard: a wildcard here would also cover
// /spaces/:spaceId/categories and resolve the space a second time.
spaceRoutes.patch(
	'/:spaceId',
	validatorHandler.param(SpaceIdParam),
	spaceHandler,
	spaceOwnerHandler,
	validatorHandler.json(RenameSpaceRequest),
	(c) => patchSpaceController.handle(c, c.req.valid('json')),
);

spaceRoutes.patch(
	'/:spaceId/archive',
	validatorHandler.param(SpaceIdParam),
	spaceHandler,
	spaceOwnerHandler,
	validatorHandler.json(ArchiveRequest),
	(c) => patchSpaceArchiveController.handle(c, c.req.valid('json')),
);
