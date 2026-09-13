import { Hono } from 'hono';
import auth from './features/auth/routes';
import health from './features/health/routes';
import type { RequestContext } from './shared/http/requestContext';

const v1 = new Hono<RequestContext>();

v1.route('/auth', auth);

const app = new Hono<RequestContext>();

app.route('/health', health);
app.route('/v1', v1);

export default app;
