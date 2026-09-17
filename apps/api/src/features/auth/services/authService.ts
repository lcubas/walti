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
	private readonly defaultPersonalSpaceName = 'Personal';

	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionService: SessionService,
		private readonly googleIdentityService: GoogleIdentityService,
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

	async getSessionUser(userId: string): Promise<SessionUser> {
		const user = await this.userRepository.findById(userId);

		// A signed token for a user that no longer exists is not a session.
		if (!user) {
			throw new UnauthorizedError(
				'session_expired',
				'Tu sesión caducó. Vuelve a entrar para continuar.',
			);
		}

		return this.toSessionUser(user);
	}

	private register(identity: GoogleIdentity) {
		// only invited emails may register
		if (!env.ALLOWED_EMAILS.includes(identity.email)) {
			throw new ForbiddenError(
				'email_not_invited',
				'Esta cuenta no tiene acceso a Walti.',
			);
		}

		return this.userRepository.createWithPersonalSpace(
			identity,
			this.defaultPersonalSpaceName,
		);
	}

	private toSessionUser({ id, email, name, avatarUrl }: User): SessionUser {
		return { id, email, name, avatarUrl };
	}
}
