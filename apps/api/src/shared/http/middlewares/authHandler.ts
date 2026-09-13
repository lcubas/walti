import type { MiddlewareHandler } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { env } from '../../../config/env';
import { sessionCookieOptions } from '../../../config/sessionCookie';
import { sessionService } from '../../../container';
import type { Session } from '../../../features/auth/services/sessionService';
import { UnauthorizedError } from '../../errors/unauthorizedError';
import type { RequestContext } from '../requestContext';

const publicPaths = new Set(['/health', '/v1/auth/google', '/v1/auth/logout']);

export const authHandler: MiddlewareHandler<RequestContext> = async (
	c,
	next,
) => {
	if (publicPaths.has(c.req.path)) {
		return next();
	}

	const token = getCookie(c, env.SESSION_NAME);

	if (!token) {
		throw new UnauthorizedError('session_missing', 'No hay una sesión activa.');
	}

	let session: Session;

	try {
		session = await sessionService.verifyToken(token);
	} catch (error) {
		// A cookie the API just rejected has no future: drop it instead of
		// letting the browser resend it on every request until it expires.
		deleteCookie(c, env.SESSION_NAME);
		throw error;
	}

	// Renewing here and not in one endpoint means any authenticated request
	// keeps the session alive, which is what a daily user actually does.
	if (sessionService.needsRenewal(session)) {
		const renewedToken = await sessionService.createToken(session.userId);
		setCookie(c, env.SESSION_NAME, renewedToken, sessionCookieOptions);
	}

	c.set('userId', session.userId);

	return next();
};
