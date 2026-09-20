import { GetSessionController } from './features/auth/controllers/getSessionController';
import { PostGoogleSignInController } from './features/auth/controllers/postGoogleSignInController';
import { PostSignOutController } from './features/auth/controllers/postSignOutController';
import { GoogleIdentityService } from './features/auth/services/googleIdentityService';
import { SessionService } from './features/auth/services/sessionService';
import { GetSessionUseCase } from './features/auth/useCases/getSessionUseCase';
import { SignInWithGoogleUseCase } from './features/auth/useCases/signInWithGoogleUseCase';
import { GetCategoriesController } from './features/categories/controllers/getCategoriesController';
import { ListCategoriesUseCase } from './features/categories/useCases/listCategoriesUseCase';
import { GetCheckHealthController } from './features/health/controllers/getCheckHealthController';
import { CheckHealthUseCase } from './features/health/useCases/checkHealthUseCase';
import { GetSpacesController } from './features/spaces/controllers/getSpacesController';
import { PatchSpaceController } from './features/spaces/controllers/patchSpaceController';
import { PostArchiveSpaceController } from './features/spaces/controllers/postArchiveSpaceController';
import { PostSpaceController } from './features/spaces/controllers/postSpaceController';
import { PostUnarchiveSpaceController } from './features/spaces/controllers/postUnarchiveSpaceController';
import { SpaceService } from './features/spaces/services/spaceService';
import { ArchiveSpaceUseCase } from './features/spaces/useCases/archiveSpaceUseCase';
import { CreateSpaceUseCase } from './features/spaces/useCases/createSpaceUseCase';
import { ListSpacesUseCase } from './features/spaces/useCases/listSpacesUseCase';
import { RenameSpaceUseCase } from './features/spaces/useCases/renameSpaceUseCase';
import { UnarchiveSpaceUseCase } from './features/spaces/useCases/unarchiveSpaceUseCase';
import { db } from './shared/database/client';
import { DrizzleCategoryRepository } from './shared/repositories/drizzle/drizzleCategoryRepository';
import { DrizzleHealthRepository } from './shared/repositories/drizzle/drizzleHealthRepository';
import { DrizzleSpaceRepository } from './shared/repositories/drizzle/drizzleSpaceRepository';
import { DrizzleUserRepository } from './shared/repositories/drizzle/drizzleUserRepository';
import { CategorySeeder } from './shared/repositories/drizzle/categorySeeder';

const categorySeeder = new CategorySeeder();

const categoryRepository = new DrizzleCategoryRepository(db);
const healthRepository = new DrizzleHealthRepository(db);
const spaceRepository = new DrizzleSpaceRepository(db, categorySeeder);
const userRepository = new DrizzleUserRepository(db, categorySeeder);

const sessionService = new SessionService();
const googleIdentityService = new GoogleIdentityService();
const spaceService = new SpaceService();

const signInWithGoogleUseCase = new SignInWithGoogleUseCase(
	userRepository,
	sessionService,
	googleIdentityService,
);
const getSessionUseCase = new GetSessionUseCase(userRepository);
const checkHealthUseCase = new CheckHealthUseCase(healthRepository);
const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
const listSpacesUseCase = new ListSpacesUseCase(spaceRepository);
const createSpaceUseCase = new CreateSpaceUseCase(spaceRepository);
const renameSpaceUseCase = new RenameSpaceUseCase(spaceRepository);
const archiveSpaceUseCase = new ArchiveSpaceUseCase(
	spaceRepository,
	spaceService,
);
const unarchiveSpaceUseCase = new UnarchiveSpaceUseCase(spaceRepository);

const getCheckHealthController = new GetCheckHealthController(
	checkHealthUseCase,
);
const postGoogleSignInController = new PostGoogleSignInController(
	signInWithGoogleUseCase,
);
const getSessionController = new GetSessionController(getSessionUseCase);
const postSignOutController = new PostSignOutController();
const getCategoriesController = new GetCategoriesController(
	listCategoriesUseCase,
);
const getSpacesController = new GetSpacesController(listSpacesUseCase);
const postSpaceController = new PostSpaceController(createSpaceUseCase);
const patchSpaceController = new PatchSpaceController(renameSpaceUseCase);
const postArchiveSpaceController = new PostArchiveSpaceController(
	archiveSpaceUseCase,
);
const postUnarchiveSpaceController = new PostUnarchiveSpaceController(
	unarchiveSpaceUseCase,
);

export {
	sessionService,
	getCategoriesController,
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
