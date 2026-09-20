import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import type { InferOutput } from 'valibot';
import type { GoogleSignInRequest } from '@walti/shared';
import { env } from '../../../config/env';
import { sessionCookieOptions } from '../../../config/sessionCookie';
import { ok } from '../../../shared/http/response';
import type { SignInWithGoogleUseCase } from '../useCases/signInWithGoogleUseCase';

type GoogleSignInInput = InferOutput<typeof GoogleSignInRequest>;

export class PostGoogleSignInController {
	constructor(
		private readonly signInWithGoogleUseCase: SignInWithGoogleUseCase,
	) {}

	async handle(c: Context, { idToken }: GoogleSignInInput) {
		const { user, sessionToken } =
			await this.signInWithGoogleUseCase.execute(idToken);

		setCookie(c, env.SESSION_NAME, sessionToken, sessionCookieOptions);

		return ok(c, user);
	}
}
