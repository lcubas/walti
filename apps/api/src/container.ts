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
const googleIdentityService = new GoogleIdentityService();
const authService = new AuthService(
	userRepository,
	sessionService,
	googleIdentityService,
);
const healthService = new HealthService(healthRepository);

const getCheckHealthController = new GetCheckHealthController(healthService);
const postGoogleSignInController = new PostGoogleSignInController(authService);
const getSessionController = new GetSessionController(authService);
const postSignOutController = new PostSignOutController();

export {
	sessionService,
	getCheckHealthController,
	postGoogleSignInController,
	getSessionController,
	postSignOutController,
};
