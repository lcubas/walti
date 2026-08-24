import { PostGoogleSignInController } from './features/auth/controllers/postGoogleSignInController';
import { AuthService } from './features/auth/services/authService';
import { GoogleTokenService } from './features/auth/services/googleTokenService';
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
	new GoogleTokenService(),
	sessionService,
	userRepository,
);
const healthService = new HealthService(healthRepository);

export const container = {
	getCheckHealthController: new GetCheckHealthController(healthService),
	postGoogleSignInController: new PostGoogleSignInController(authService),
};

export type Container = typeof container;
