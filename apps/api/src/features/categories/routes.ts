import { Hono } from 'hono';
import { getCategoriesController } from '../../container';
import type { RequestContext } from '../../shared/http/requestContext';

const app = new Hono<RequestContext>();

app.get('/', (c) => getCategoriesController.handle(c));

export default app;
