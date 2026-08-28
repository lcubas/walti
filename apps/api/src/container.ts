import { GetSessionController } from './features/auth/controllers/getSessionController';
import { PostGoogleSignInController } from './features/auth/controllers/postGoogleSignInController';
import { PostSignOutController } from './features/auth/controllers/postSignOutController';
import { AuthService } from './features/auth/services/authService';
import { GoogleIdentityService } from './features/auth/services/googleIdentityService';
import { SessionService } from './features/auth/services/sessionService';
import { GetCheckHealthController } from './features/health/controllers/getCheckHealthController';
import { HealthService } from './features/health/services/healthService';
import { db } from './shared/database/client';
import { DrizzleHealthRepository } from './shared/repositories/drizzle/drizzleHealthRepository';
import { DrizzleUserRepository } from './shared/repositories/drizzle/drizzleUserRepository';

const healthRepository = new DrizzleHealthRepository(db);
const userRepository = new DrizzleUserRepository(db);
const sessionService = new SessionService();
const authService = new AuthService(
	new GoogleIdentityService(),
	sessionService,
	userRepository,
);
const healthService = new HealthService(healthRepository);

export const container = {
	getCheckHealthController: new GetCheckHealthController(healthService),
	postGoogleSignInController: new PostGoogleSignInController(authService),
	getSessionController: new GetSessionController(authService),
	postSignOutController: new PostSignOutController(),
};

export type Container = typeof container;
