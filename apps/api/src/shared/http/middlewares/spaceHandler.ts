import type { MiddlewareHandler } from 'hono';
import { NotFoundError } from '../../errors/notFoundError';
import type { RequestContext } from '../requestContext';

export const spaceHandler: MiddlewareHandler<RequestContext> = async (
	c,
	next,
) => {
	const spaceId = c.req.param('spaceId');

	if (!spaceId) {
		throw new NotFoundError(
			'space_not_found',
			'Ese espacio no existe o no es tuyo.',
		);
	}

	// TODO: Implements validation for existings space in db

	c.set('spaceId', spaceId);

	return next();
};
