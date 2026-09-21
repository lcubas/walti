import type { SessionUser } from '@walti/shared';
import { UnauthorizedError } from '../../../shared/errors/unauthorizedError';
import type { UserRepository } from '../../../shared/repositories/userRepository';
import { toSessionUser } from '../helpers/toSessionUser';

export class GetSessionUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userId: string): Promise<SessionUser> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new UnauthorizedError(
				'session_expired',
				'Tu sesión caducó. Vuelve a entrar para continuar.',
			);
		}

		return toSessionUser(user);
	}
}
