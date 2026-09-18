import { GetSessionController } from './features/auth/controllers/getSessionController';
import { PostGoogleSignInController } from './features/auth/controllers/postGoogleSignInController';
import { PostSignOutController } from './features/auth/controllers/postSignOutController';
import { AuthService } from './features/auth/services/authService';
import { GoogleIdentityService } from './features/auth/services/googleIdentityService';
import { SessionService } from './features/auth/services/sessionService';
import { GetCheckHealthController } from './features/health/controllers/getCheckHealthController';
import { HealthService } from './features/health/services/healthService';
import { GetSpacesController } from './features/spaces/controllers/getSpacesController';
import { PatchSpaceController } from './features/spaces/controllers/patchSpaceController';
import { PostArchiveSpaceController } from './features/spaces/controllers/postArchiveSpaceController';
import { PostSpaceController } from './features/spaces/controllers/postSpaceController';
import { PostUnarchiveSpaceController } from './features/spaces/controllers/postUnarchiveSpaceController';
import { SpaceService } from './features/spaces/services/spaceService';
import { db } from './shared/database/client';
import { DrizzleHealthRepository } from './shared/repositories/drizzle/drizzleHealthRepository';
import { DrizzleSpaceRepository } from './shared/repositories/drizzle/drizzleSpaceRepository';
import { DrizzleUserRepository } from './shared/repositories/drizzle/drizzleUserRepository';

const healthRepository = new DrizzleHealthRepository(db);
const spaceRepository = new DrizzleSpaceRepository(db);
const userRepository = new DrizzleUserRepository(db);

const sessionService = new SessionService();
const googleIdentityService = new GoogleIdentityService();
const authService = new AuthService(
	userRepository,
	sessionService,
	googleIdentityService,
);
const healthService = new HealthService(healthRepository);
const spaceService = new SpaceService(spaceRepository);

const getCheckHealthController = new GetCheckHealthController(healthService);
const postGoogleSignInController = new PostGoogleSignInController(authService);
const getSessionController = new GetSessionController(authService);
const postSignOutController = new PostSignOutController();
const getSpacesController = new GetSpacesController(spaceService);
const postSpaceController = new PostSpaceController(spaceService);
const patchSpaceController = new PatchSpaceController(spaceService);
const postArchiveSpaceController = new PostArchiveSpaceController(spaceService);
const postUnarchiveSpaceController = new PostUnarchiveSpaceController(
	spaceService,
);

export {
	sessionService,
	getCheckHealthController,
	postGoogleSignInController,
	getSessionController,
	postSignOutController,
	getSpacesController,
	postSpaceController,
	patchSpaceController,
	postArchiveSpaceController,
	postUnarchiveSpaceController,
};
