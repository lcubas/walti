import { Hono } from 'hono';
import { container } from '../../container';

const app = new Hono();

app.get('/', (c) => container.getCheckHealthController.handle(c));

export default app;
