import { SignJWT, jwtVerify } from 'jose';
import { env } from '../../../config/env';
import { UnauthorizedError } from '../../../shared/errors/unauthorizedError';

const algorithm = 'HS256';
const secret = new TextEncoder().encode(env.SESSION_SECRET);

export class SessionService {
	issue(userId: string): Promise<string> {
		return new SignJWT({})
			.setProtectedHeader({ alg: algorithm })
			.setSubject(userId)
			.setIssuedAt()
			.setExpirationTime(`${env.SESSION_MAX_AGE_IN_SECONDS}s`)
			.sign(secret);
	}

	async readUserId(token: string): Promise<string> {
		try {
			const { payload } = await jwtVerify(token, secret, {
				algorithms: [algorithm],
			});

			if (!payload.sub) {
				throw new Error('missing subject');
			}

			return payload.sub;
		} catch {
			throw new UnauthorizedError(
				'session_expired',
				'Tu sesión caducó. Vuelve a entrar para continuar.',
			);
		}
	}
}
