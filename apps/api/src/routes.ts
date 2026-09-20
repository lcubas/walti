import { Hono } from 'hono';
import auth from './features/auth/routes';
import categories from './features/categories/routes';
import health from './features/health/routes';
import spaces from './features/spaces/routes';
import { spaceHandler } from './shared/http/middlewares/spaceHandler';
import type { RequestContext } from './shared/http/requestContext';

const v1 = new Hono<RequestContext>();

const spaceScoped = new Hono<RequestContext>();

spaceScoped.use('/*', spaceHandler);
spaceScoped.route('/categories', categories);

v1.route('/auth', auth);
v1.route('/spaces', spaces);
v1.route('/spaces/:spaceId', spaceScoped);

const app = new Hono<RequestContext>();

app.route('/health', health);
app.route('/v1', v1);

export default app;
