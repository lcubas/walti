import type { SessionUser } from '@walti/shared';
import { env } from '../../../config/env';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';
import type { UserRepository } from '../../../shared/repositories/userRepository';
import type { GoogleIdentity, GoogleTokenService } from './googleTokenService';
import type { SessionService } from './sessionService';

export type SignInResult = { user: SessionUser; sessionToken: string };

export class AuthService {
	constructor(
		private readonly googleTokens: GoogleTokenService,
		private readonly sessionService: SessionService,
		private readonly users: UserRepository,
	) {}

	async signInWithGoogle(idToken: string): Promise<SignInResult> {
		const identity = await this.googleTokens.verify(idToken);
		const existing = await this.users.findByGoogleSub(identity.googleSub);
		const user = existing ?? (await this.register(identity));
		const sessionToken = await this.sessionService.issue(user.id);

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				avatarUrl: user.avatarUrl,
			},
			sessionToken,
		};
	}

	private register(identity: GoogleIdentity) {
		// only invited emails may register
		if (!env.ALLOWED_EMAILS.includes(identity.email)) {
			throw new ForbiddenError(
				'email_not_invited',
				'Esta cuenta no tiene acceso a Walti.',
			);
		}

		return this.users.create(identity);
	}
}
