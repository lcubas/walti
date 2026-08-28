import type { Context } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { env } from '../../../config/env';

export class PostSignOutController {
	/**
	 * The session is stateless, so signing out is the cookie and nothing else.
	 * It answers the same way without a session: leaving is always allowed.
	 * 204 says that without inventing a body that carries no information.
	 */
	handle(c: Context) {
		deleteCookie(c, env.SESSION_NAME);

		return c.body(null, 204);
	}
}
