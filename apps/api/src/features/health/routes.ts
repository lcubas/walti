import { Hono } from 'hono';
import { getCheckHealthController } from '../../container';

export const healthRoutes = new Hono();

healthRoutes.get('/', (c) => getCheckHealthController.handle(c));
