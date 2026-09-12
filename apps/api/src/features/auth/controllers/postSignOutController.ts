import type { Context } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { env } from '../../../config/env';

export class PostSignOutController {
	handle(c: Context) {
		deleteCookie(c, env.SESSION_NAME);

		return c.body(null, 204);
	}
}
