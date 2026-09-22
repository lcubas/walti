import { Hono } from 'hono';
import { authRoutes } from './features/auth/routes';
import { categoryRoutes } from './features/categories/routes';
import { expenseRoutes } from './features/expenses/routes';
import { healthRoutes } from './features/health/routes';
import { paymentSourceRoutes } from './features/paymentSources/routes';
import { spaceRoutes } from './features/spaces/routes';
import type { SessionContext } from './shared/http/requestContext';

const v1 = new Hono<SessionContext>();

v1.route('/auth', authRoutes);
v1.route('/spaces', spaceRoutes);
v1.route('/spaces/:spaceId/categories', categoryRoutes);
v1.route('/spaces/:spaceId/expenses', expenseRoutes);
v1.route('/payment-sources', paymentSourceRoutes);

const app = new Hono<SessionContext>();

app.route('/health', healthRoutes);
app.route('/v1', v1);

export default app;
