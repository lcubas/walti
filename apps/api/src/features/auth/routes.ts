import { Hono } from 'hono';
import { GoogleSignInRequest } from '@walti/shared';
import {
	getSessionController,
	postGoogleSignInController,
	postSignOutController,
} from '../../container';
import type { RequestContext } from '../../shared/http/requestContext';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';

const app = new Hono<RequestContext>();

app.post('/google', validatorHandler.json(GoogleSignInRequest), (c) =>
	postGoogleSignInController.handle(c, c.req.valid('json')),
);

app.get('/me', (c) => getSessionController.handle(c));

app.post('/logout', (c) => postSignOutController.handle(c));

export default app;
