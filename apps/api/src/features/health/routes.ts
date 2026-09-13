import { Hono } from 'hono';
import { getCheckHealthController } from '../../container';
import type { RequestContext } from '../../shared/http/requestContext';

const app = new Hono<RequestContext>();

app.get('/', (c) => getCheckHealthController.handle(c));

export default app;
