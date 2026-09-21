import { Hono } from 'hono';
import { GoogleSignInRequest } from '@walti/shared';
import {
	getSessionController,
	postGoogleSignInController,
	postSignOutController,
} from '../../container';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SessionContext } from '../../shared/http/requestContext';

export const authRoutes = new Hono<SessionContext>();

authRoutes.post('/google', validatorHandler.json(GoogleSignInRequest), (c) =>
	postGoogleSignInController.handle(c, c.req.valid('json')),
);
authRoutes.get('/me', (c) => getSessionController.handle(c));
authRoutes.post('/logout', (c) => postSignOutController.handle(c));
