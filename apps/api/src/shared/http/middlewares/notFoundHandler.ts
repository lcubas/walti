import type { NotFoundHandler } from 'hono';
import { buildErrorBody } from './errorHandler';

export const notFoundHandler: NotFoundHandler = (c) =>
	c.json(buildErrorBody('not_found', 'Resource not found.'), 404);
