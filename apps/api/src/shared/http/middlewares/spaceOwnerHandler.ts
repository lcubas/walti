import { createMiddleware } from 'hono/factory';
import { spaceService } from '../../../container';
import type { SpaceContext } from '../requestContext';

export const spaceOwnerHandler = createMiddleware<SpaceContext>(
	async (c, next) => {
		spaceService.verifyOwnership(c.get('space').role);

		return next();
	},
);
