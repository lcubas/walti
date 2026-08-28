import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { env } from '../../../config/env';
import { sessionCookieOptions } from '../../../config/sessionCookie';
import { UnauthorizedError } from '../../../shared/errors/unauthorizedError';
import { ok } from '../../../shared/http/response';
import type { AuthService } from '../services/authService';

export class GetSessionController {
	constructor(private readonly authService: AuthService) {}

	async handle(c: Context) {
		const token = getCookie(c, env.SESSION_NAME);

		// Never having entered is not the same as having been thrown out.
		if (!token) {
			throw new UnauthorizedError(
				'session_missing',
				'No hay una sesión activa.',
			);
		}

		try {
			const { user, renewedToken } =
				await this.authService.resumeSession(token);

			if (renewedToken) {
				setCookie(c, env.SESSION_NAME, renewedToken, sessionCookieOptions);
			}

			return ok(c, user);
		} catch (error) {
			// A cookie this endpoint just rejected has no future: drop it instead of
			// letting the browser resend it on every request until it expires.
			deleteCookie(c, env.SESSION_NAME);
			throw error;
		}
	}
}
