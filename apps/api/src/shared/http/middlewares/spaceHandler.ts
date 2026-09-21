import { createMiddleware } from 'hono/factory';
import { spaceService } from '../../../container';
import type { SpaceContext } from '../requestContext';

export const spaceHandler = createMiddleware<SpaceContext, '/:spaceId'>(
	async (c, next) => {
		c.set(
			'space',
			await spaceService.requireAccess(c.req.param('spaceId'), c.get('userId')),
		);

		return next();
	},
);
