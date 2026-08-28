import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import type { InferOutput } from 'valibot';
import type { GoogleSignInRequest } from '@walti/shared';
import { env } from '../../../config/env';
import { sessionCookieOptions } from '../../../config/sessionCookie';
import { ok } from '../../../shared/http/response';
import type { AuthService } from '../services/authService';

type GoogleSignInInput = InferOutput<typeof GoogleSignInRequest>;

export class PostGoogleSignInController {
	constructor(private readonly authService: AuthService) {}

	async handle(c: Context, { idToken }: GoogleSignInInput) {
		const { user, sessionToken } =
			await this.authService.signInWithGoogle(idToken);

		setCookie(c, env.SESSION_NAME, sessionToken, sessionCookieOptions);

		return ok(c, user);
	}
}
