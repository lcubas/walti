import { Hono } from 'hono';
import { container } from '../../container';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import { GoogleSignInRequest } from '@walti/shared';

const app = new Hono();

app.post('/google', validatorHandler.json(GoogleSignInRequest), (c) =>
	container.postGoogleSignInController.handle(c, c.req.valid('json')),
);

export default app;
