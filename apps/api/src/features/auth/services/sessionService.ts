import { SignJWT, jwtVerify } from 'jose';
import { env } from '../../../config/env';
import { UnauthorizedError } from '../../../shared/errors/unauthorizedError';

export type Session = { userId: string; expiresAt: Date };

export class SessionService {
	private readonly algorithm = 'HS256';
	private readonly secret = new TextEncoder().encode(env.SESSION_SECRET);
	private readonly maxAgeInSeconds = env.SESSION_MAX_AGE_IN_SECONDS;
	private readonly maxAgeInMilliseconds = this.maxAgeInSeconds * 1000;

	createToken(userId: string): Promise<string> {
		return new SignJWT({})
			.setProtectedHeader({ alg: this.algorithm })
			.setSubject(userId)
			.setIssuedAt()
			.setExpirationTime(`${this.maxAgeInSeconds}s`)
			.sign(this.secret);
	}

	/** Checks signature and expiry. Throws when the token is not a live session. */
	async verifyToken(token: string): Promise<Session> {
		try {
			const { payload } = await jwtVerify(token, this.secret, {
				algorithms: [this.algorithm],
			});

			if (!payload.sub || !payload.exp) {
				throw new Error('incomplete session');
			}

			return { userId: payload.sub, expiresAt: new Date(payload.exp * 1000) };
		} catch {
			throw new UnauthorizedError(
				'session_expired',
				'Tu sesión caducó. Vuelve a entrar para continuar.',
			);
		}
	}

	/**
	 * Half the lifetime left is where renewing starts to pay for itself: often
	 * enough that a daily user never meets the login screen, rare enough that a
	 * single visit does not rewrite the cookie on every request.
	 */
	needsRenewal({ expiresAt }: Session): boolean {
		return expiresAt.getTime() - Date.now() < this.maxAgeInMilliseconds / 2;
	}
}
