import type { CookieOptions } from 'hono/utils/cookie';
import { env } from './env';

export const sessionCookieOptions: CookieOptions = {
	sameSite: 'Lax',
	httpOnly: true,
	secure: env.APP_ENV === 'production',
	maxAge: env.SESSION_MAX_AGE_IN_SECONDS,
};
