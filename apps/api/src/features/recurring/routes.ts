import { Hono } from 'hono';
import {
	ArchiveRequest,
	CreateRecurringItemRequest,
	PauseRequest,
	RecurringItemIdParam,
	SpaceIdParam,
	UpdateRecurringItemRequest,
} from '@walti/shared';
import {
	getRecurringItemsController,
	patchRecurringItemArchiveController,
	patchRecurringItemController,
	patchRecurringItemPauseController,
	postRecurringItemController,
} from '../../container';
import { spaceHandler } from '../../shared/http/middlewares/spaceHandler';
import { spaceOwnerHandler } from '../../shared/http/middlewares/spaceOwnerHandler';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SpaceContext } from '../../shared/http/requestContext';

export const recurringItemRoutes = new Hono<SpaceContext>();

recurringItemRoutes.use('/*', validatorHandler.param(SpaceIdParam), spaceHandler);

// Reading the space's recurrents is open to any member, same as events;
// only the Owner configures them (creating, editing, pausing, archiving).
recurringItemRoutes.on(['POST', 'PATCH'], '/*', spaceOwnerHandler);

recurringItemRoutes.get('/', (c) => getRecurringItemsController.handle(c));
recurringItemRoutes.post(
	'/',
	validatorHandler.json(CreateRecurringItemRequest),
	(c) => postRecurringItemController.handle(c, c.req.valid('json')),
);

recurringItemRoutes.patch(
	'/:recurringItemId',
	validatorHandler.param(RecurringItemIdParam),
	validatorHandler.json(UpdateRecurringItemRequest),
	(c) =>
		patchRecurringItemController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
recurringItemRoutes.patch(
	'/:recurringItemId/pause',
	validatorHandler.param(RecurringItemIdParam),
	validatorHandler.json(PauseRequest),
	(c) =>
		patchRecurringItemPauseController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
recurringItemRoutes.patch(
	'/:recurringItemId/archive',
	validatorHandler.param(RecurringItemIdParam),
	validatorHandler.json(ArchiveRequest),
	(c) =>
		patchRecurringItemArchiveController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
