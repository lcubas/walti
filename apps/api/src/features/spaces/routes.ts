import { Hono } from 'hono';
import {
	CreateSpaceRequest,
	RenameSpaceRequest,
	SpaceIdParam,
} from '@walti/shared';
import {
	getSpacesController,
	patchSpaceController,
	postArchiveSpaceController,
	postSpaceController,
	postUnarchiveSpaceController,
} from '../../container';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { RequestContext } from '../../shared/http/requestContext';

const app = new Hono<RequestContext>();

app.get('/', (c) => getSpacesController.handle(c));

app.post('/', validatorHandler.json(CreateSpaceRequest), (c) =>
	postSpaceController.handle(c, c.req.valid('json')),
);

app.patch(
	'/:spaceId',
	validatorHandler.param(SpaceIdParam),
	validatorHandler.json(RenameSpaceRequest),
	(c) =>
		patchSpaceController.handle(c, c.req.valid('param'), c.req.valid('json')),
);

app.post('/:spaceId/archive', validatorHandler.param(SpaceIdParam), (c) =>
	postArchiveSpaceController.handle(c, c.req.valid('param')),
);

app.post('/:spaceId/unarchive', validatorHandler.param(SpaceIdParam), (c) =>
	postUnarchiveSpaceController.handle(c, c.req.valid('param')),
);

export default app;
