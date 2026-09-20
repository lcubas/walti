import type { SessionUser } from '@walti/shared';
import { env } from '../../../config/env';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';
import type {
	User,
	UserRepository,
} from '../../../shared/repositories/userRepository';
import type {
	GoogleIdentity,
	GoogleIdentityService,
} from '../services/googleIdentityService';
import type { SessionService } from '../services/sessionService';
import { toSessionUser } from '../helpers/toSessionUser';

export class SignInWithGoogleUseCase {
	private readonly defaultPersonalSpaceName = 'Personal';

	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionService: SessionService,
		private readonly googleIdentityService: GoogleIdentityService,
	) {}

	async execute(
		idToken: string,
	): Promise<{ user: SessionUser; sessionToken: string }> {
		const identity = await this.googleIdentityService.verifyIdToken(idToken);
		const existing = await this.userRepository.findByGoogleSub(
			identity.googleSub,
		);
		const user = existing ?? (await this.registerUser(identity));
		const sessionToken = await this.sessionService.createToken(user.id);

		return { user: toSessionUser(user), sessionToken };
	}

	private registerUser(identity: GoogleIdentity): Promise<User> {
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
}
