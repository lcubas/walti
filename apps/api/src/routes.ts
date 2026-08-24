import { Hono } from 'hono';
import auth from './features/auth/routes';
import health from './features/health/routes';

const v1 = new Hono();

v1.route('/auth', auth);

const app = new Hono();

app.route('/health', health);
app.route('/v1', v1);

export default app;
