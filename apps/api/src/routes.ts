import { Hono } from 'hono';
import health from './features/health/routes';

const app = new Hono();

app.route('/health', health);

export default app;
