import type { SessionUser } from '@walti/shared';
import type { User } from '../../../shared/repositories/userRepository';

export function toSessionUser({
	id,
	email,
	name,
	avatarUrl,
}: User): SessionUser {
	return { id, email, name, avatarUrl };
}
