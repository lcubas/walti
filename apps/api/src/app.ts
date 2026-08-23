import { Hono } from 'hono';
import routes from './routes';
import { errorHandler } from './shared/http/middlewares/errorHandler';
import { notFoundHandler } from './shared/http/middlewares/notFoundHandler';
import { cors } from 'hono/cors';
import { env } from './config/env';

const app = new Hono();

app.use('/*', cors({ origin: env.ALLOWED_ORIGINS, credentials: true }));
app.onError(errorHandler);
app.notFound(notFoundHandler);

app.route('/', routes);

export default app;
