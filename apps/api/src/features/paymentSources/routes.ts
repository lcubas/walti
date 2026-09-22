import { Hono } from 'hono';
import {
	ArchiveRequest,
	CreatePaymentSourceRequest,
	PaymentSourceIdParam,
	RenamePaymentSourceRequest,
} from '@walti/shared';
import {
	getPaymentSourcesController,
	patchPaymentSourceArchiveController,
	patchPaymentSourceController,
	postPaymentSourceController,
} from '../../container';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SessionContext } from '../../shared/http/requestContext';

export const paymentSourceRoutes = new Hono<SessionContext>();

paymentSourceRoutes.get('/', (c) => getPaymentSourcesController.handle(c));
paymentSourceRoutes.post(
	'/',
	validatorHandler.json(CreatePaymentSourceRequest),
	(c) => postPaymentSourceController.handle(c, c.req.valid('json')),
);
paymentSourceRoutes.patch(
	'/:paymentSourceId',
	validatorHandler.param(PaymentSourceIdParam),
	validatorHandler.json(RenamePaymentSourceRequest),
	(c) =>
		patchPaymentSourceController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
paymentSourceRoutes.patch(
	'/:paymentSourceId/archive',
	validatorHandler.param(PaymentSourceIdParam),
	validatorHandler.json(ArchiveRequest),
	(c) =>
		patchPaymentSourceArchiveController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
