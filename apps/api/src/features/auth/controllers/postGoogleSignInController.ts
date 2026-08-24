import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { env } from '../../../config/env';
import { ok } from '../../../shared/http/response';
import type { AuthService } from '../services/authService';
import type { InferOutput } from 'valibot';
import type { GoogleSignInRequest } from '@walti/shared';

type GoogleSignInInput = InferOutput<typeof GoogleSignInRequest>;

export class PostGoogleSignInController {
	constructor(private readonly authService: AuthService) {}

	async handle(c: Context, { idToken }: GoogleSignInInput) {
		const { user, sessionToken } =
			await this.authService.signInWithGoogle(idToken);

		setCookie(c, env.SESSION_NAME, sessionToken, {
			path: '/',
			sameSite: 'Lax',
			httpOnly: true,
			maxAge: env.SESSION_MAX_AGE_IN_SECONDS,
			secure: env.APP_ENV === 'production',
		});

		return ok(c, user);
	}
}
