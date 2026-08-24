import { Hono } from 'hono';
import { container } from '../../container';

const app = new Hono();

app.post('/google', (c) => container.postGoogleSignInController.handle(c));

export default app;
