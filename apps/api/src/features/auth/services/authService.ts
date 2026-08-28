import type { SessionUser } from '@walti/shared';
import { env } from '../../../config/env';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';
import { UnauthorizedError } from '../../../shared/errors/unauthorizedError';
import type {
	User,
	UserRepository,
} from '../../../shared/repositories/userRepository';
import type {
	GoogleIdentity,
	GoogleIdentityService,
} from './googleIdentityService';
import type { SessionService } from './sessionService';

export class AuthService {
	constructor(
		private readonly googleIdentityService: GoogleIdentityService,
		private readonly sessionService: SessionService,
		private readonly userRepository: UserRepository,
	) {}

	async signInWithGoogle(
		idToken: string,
	): Promise<{ user: SessionUser; sessionToken: string }> {
		const identity = await this.googleIdentityService.verifyIdToken(idToken);
		const existing = await this.userRepository.findByGoogleSub(
			identity.googleSub,
		);
		const user = existing ?? (await this.register(identity));
		const sessionToken = await this.sessionService.createToken(user.id);

		return { user: this.toSessionUser(user), sessionToken };
	}

	/** Renews the token only when it was close enough to expiring. */
	async resumeSession(
		sessionToken: string,
	): Promise<{ user: SessionUser; renewedToken: string | null }> {
		const session = await this.sessionService.verifyToken(sessionToken);
		const user = await this.userRepository.findById(session.userId);

		// A signed token for a user that no longer exists is not a session.
		if (!user) {
			throw new UnauthorizedError(
				'session_expired',
				'Tu sesión caducó. Vuelve a entrar para continuar.',
			);
		}

		const renewedToken = this.sessionService.needsRenewal(session)
			? await this.sessionService.createToken(user.id)
			: null;

		return { user: this.toSessionUser(user), renewedToken };
	}

	private register(identity: GoogleIdentity) {
		// only invited emails may register
		if (!env.ALLOWED_EMAILS.includes(identity.email)) {
			throw new ForbiddenError(
				'email_not_invited',
				'Esta cuenta no tiene acceso a Walti.',
			);
		}

		return this.userRepository.create(identity);
	}

	private toSessionUser({ id, email, name, avatarUrl }: User): SessionUser {
		return { id, email, name, avatarUrl };
	}
}
