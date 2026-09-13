import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from './config/env';
import routes from './routes';
import type { RequestContext } from './shared/http/requestContext';
import { authHandler } from './shared/http/middlewares/authHandler';
import { errorHandler } from './shared/http/middlewares/errorHandler';
import { notFoundHandler } from './shared/http/middlewares/notFoundHandler';

const app = new Hono<RequestContext>();

app.use('/*', cors({ origin: env.ALLOWED_ORIGINS, credentials: true }));
app.onError(errorHandler);
app.notFound(notFoundHandler);

app.use('/*', authHandler);

app.route('/', routes);

export default app;
