import { Hono } from 'hono';
import routes from './routes';
import { errorHandler } from './shared/http/middlewares/errorHandler';
import { notFoundHandler } from './shared/http/middlewares/notFoundHandler';

const app = new Hono();

app.onError(errorHandler);
app.notFound(notFoundHandler);

app.route('/', routes);

export default app;
