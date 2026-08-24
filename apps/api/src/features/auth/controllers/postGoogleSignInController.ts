import { GoogleSignInRequest } from '@walti/shared';
import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import * as v from 'valibot';
import { env } from '../../../config/env';
import { ok } from '../../../shared/http/response';
import type { AuthService } from '../services/authService';
import {
	sessionCookieName,
	sessionMaxAgeSeconds,
} from '../services/sessionService';

export class PostGoogleSignInController {
	constructor(private readonly service: AuthService) {}

	async handle(c: Context) {
		const { idToken } = v.parse(GoogleSignInRequest, await c.req.json());
		const { user, sessionToken } = await this.service.signInWithGoogle(idToken);

		setCookie(c, sessionCookieName, sessionToken, {
			path: '/',
			sameSite: 'Lax',
			httpOnly: true,
			maxAge: sessionMaxAgeSeconds,
			secure: env.APP_ENV === 'production',
		});

		return ok(c, user);
	}
}
