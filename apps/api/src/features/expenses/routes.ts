import { Hono } from 'hono';
import { CreateExpenseRequest, SpaceIdParam } from '@walti/shared';
import { postExpenseController } from '../../container';
import { spaceHandler } from '../../shared/http/middlewares/spaceHandler';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SpaceContext } from '../../shared/http/requestContext';

export const expenseRoutes = new Hono<SpaceContext>();

expenseRoutes.use('/*', validatorHandler.param(SpaceIdParam), spaceHandler);

expenseRoutes.post('/', validatorHandler.json(CreateExpenseRequest), (c) =>
	postExpenseController.handle(c, c.req.valid('json')),
);
