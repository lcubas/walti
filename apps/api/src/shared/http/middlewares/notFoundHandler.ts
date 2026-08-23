import type { NotFoundHandler } from 'hono';
import { errorBody } from '../response';

export const notFoundHandler: NotFoundHandler = (c) =>
	c.json(errorBody('not_found', 'Resource not found.'), 404);
