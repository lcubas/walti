import type { NotFoundHandler } from 'hono';

export const notFoundHandler: NotFoundHandler = (c) =>
	c.json({ code: 'not_found', message: 'Resource not found.' }, 404);
