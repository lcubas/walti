import { createRemoteJWKSet, jwtVerify } from 'jose';
import * as v from 'valibot';
import { env } from '../../../config/env';
import { UnauthorizedError } from '../../../shared/errors/unauthorizedError';

const googleKeys = createRemoteJWKSet(
	new URL('https://www.googleapis.com/oauth2/v3/certs'),
);

const GoogleClaims = v.object({
	sub: v.pipe(v.string(), v.nonEmpty()),
	email: v.pipe(v.string(), v.email()),
	email_verified: v.literal(true),
	name: v.optional(v.string()),
	picture: v.optional(v.string()),
});

export type GoogleIdentity = {
	googleSub: string;
	email: string;
	name: string;
	avatarUrl: string | null;
};

export class GoogleTokenService {
	async verify(idToken: string): Promise<GoogleIdentity> {
		const claims = await this.readClaims(idToken);

		return {
			googleSub: claims.sub,
			email: claims.email.toLowerCase(),
			name: claims.name ?? claims.email,
			avatarUrl: claims.picture ?? null,
		};
	}

	private async readClaims(idToken: string) {
		try {
			const { payload } = await jwtVerify(idToken, googleKeys, {
				issuer: ['https://accounts.google.com', 'accounts.google.com'],
				audience: env.GOOGLE_CLIENT_ID,
			});

			return v.parse(GoogleClaims, payload);
		} catch {
			throw new UnauthorizedError(
				'invalid_google_token',
				'No pudimos validar tu cuenta de Google.',
			);
		}
	}
}
