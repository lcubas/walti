import { Hono } from 'hono';
import {
	ArchiveRequest,
	AssociateExpensesRequest,
	CreateEventRequest,
	EventIdParam,
	SpaceIdParam,
	UpdateEventRequest,
} from '@walti/shared';
import {
	getEventExpenseCandidatesController,
	getEventExpensesController,
	getEventsController,
	patchEventArchiveController,
	patchEventController,
	postEventController,
	postEventExpensesController,
} from '../../container';
import { spaceHandler } from '../../shared/http/middlewares/spaceHandler';
import { spaceOwnerHandler } from '../../shared/http/middlewares/spaceOwnerHandler';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SpaceContext } from '../../shared/http/requestContext';

export const eventRoutes = new Hono<SpaceContext>();

eventRoutes.use('/*', validatorHandler.param(SpaceIdParam), spaceHandler);

eventRoutes.on(['POST', 'PATCH', 'DELETE'], '/*', spaceOwnerHandler);

eventRoutes.get('/', (c) => getEventsController.handle(c));
eventRoutes.post('/', validatorHandler.json(CreateEventRequest), (c) =>
	postEventController.handle(c, c.req.valid('json')),
);
eventRoutes.patch(
	'/:eventId',
	validatorHandler.param(EventIdParam),
	validatorHandler.json(UpdateEventRequest),
	(c) =>
		patchEventController.handle(c, c.req.valid('param'), c.req.valid('json')),
);
eventRoutes.patch(
	'/:eventId/archive',
	validatorHandler.param(EventIdParam),
	validatorHandler.json(ArchiveRequest),
	(c) =>
		patchEventArchiveController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
eventRoutes.get(
	'/:eventId/expenses',
	validatorHandler.param(EventIdParam),
	(c) => getEventExpensesController.handle(c, c.req.valid('param')),
);
eventRoutes.get(
	'/:eventId/expenses/candidates',
	validatorHandler.param(EventIdParam),
	(c) => getEventExpenseCandidatesController.handle(c, c.req.valid('param')),
);
eventRoutes.post(
	'/:eventId/expenses',
	validatorHandler.param(EventIdParam),
	validatorHandler.json(AssociateExpensesRequest),
	(c) =>
		postEventExpensesController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
