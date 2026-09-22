import { GetSessionController } from './features/auth/controllers/getSessionController';
import { PostGoogleSignInController } from './features/auth/controllers/postGoogleSignInController';
import { PostSignOutController } from './features/auth/controllers/postSignOutController';
import { GoogleIdentityService } from './features/auth/services/googleIdentityService';
import { SessionService } from './features/auth/services/sessionService';
import { GetSessionUseCase } from './features/auth/useCases/getSessionUseCase';
import { SignInWithGoogleUseCase } from './features/auth/useCases/signInWithGoogleUseCase';
import { GetCategoriesController } from './features/categories/controllers/getCategoriesController';
import { PatchCategoryArchiveController } from './features/categories/controllers/patchCategoryArchiveController';
import { PatchCategoryController } from './features/categories/controllers/patchCategoryController';
import { PatchCategoryGroupController } from './features/categories/controllers/patchCategoryGroupController';
import { PostCategoryController } from './features/categories/controllers/postCategoryController';
import { PostCategoryGroupController } from './features/categories/controllers/postCategoryGroupController';
import { CategoryService } from './features/categories/services/categoryService';
import { CreateCategoryGroupUseCase } from './features/categories/useCases/createCategoryGroupUseCase';
import { CreateCategoryUseCase } from './features/categories/useCases/createCategoryUseCase';
import { RenameCategoryGroupUseCase } from './features/categories/useCases/renameCategoryGroupUseCase';
import { SetCategoryArchivedUseCase } from './features/categories/useCases/setCategoryArchivedUseCase';
import { UpdateCategoryUseCase } from './features/categories/useCases/updateCategoryUseCase';
import { ListCategoriesUseCase } from './features/categories/useCases/listCategoriesUseCase';
import { PostExpenseController } from './features/expenses/controllers/postExpenseController';
import { ExpenseService } from './features/expenses/services/expenseService';
import { CreateExpenseUseCase } from './features/expenses/useCases/createExpenseUseCase';
import { GetCheckHealthController } from './features/health/controllers/getCheckHealthController';
import { CheckHealthUseCase } from './features/health/useCases/checkHealthUseCase';
import { GetPaymentSourcesController } from './features/paymentSources/controllers/getPaymentSourcesController';
import { PatchPaymentSourceArchiveController } from './features/paymentSources/controllers/patchPaymentSourceArchiveController';
import { PatchPaymentSourceController } from './features/paymentSources/controllers/patchPaymentSourceController';
import { PostPaymentSourceController } from './features/paymentSources/controllers/postPaymentSourceController';
import { PaymentSourceService } from './features/paymentSources/services/paymentSourceService';
import { CreatePaymentSourceUseCase } from './features/paymentSources/useCases/createPaymentSourceUseCase';
import { ListPaymentSourcesUseCase } from './features/paymentSources/useCases/listPaymentSourcesUseCase';
import { RenamePaymentSourceUseCase } from './features/paymentSources/useCases/renamePaymentSourceUseCase';
import { SetPaymentSourceArchivedUseCase } from './features/paymentSources/useCases/setPaymentSourceArchivedUseCase';
import { GetSpacesController } from './features/spaces/controllers/getSpacesController';
import { PatchSpaceArchiveController } from './features/spaces/controllers/patchSpaceArchiveController';
import { PatchSpaceController } from './features/spaces/controllers/patchSpaceController';
import { PostSpaceController } from './features/spaces/controllers/postSpaceController';
import { SpaceService } from './features/spaces/services/spaceService';
import { CreateSpaceUseCase } from './features/spaces/useCases/createSpaceUseCase';
import { ListSpacesUseCase } from './features/spaces/useCases/listSpacesUseCase';
import { RenameSpaceUseCase } from './features/spaces/useCases/renameSpaceUseCase';
import { SetSpaceArchivedUseCase } from './features/spaces/useCases/setSpaceArchivedUseCase';
import { db } from './shared/database/client';
import { DrizzleCategoryRepository } from './shared/repositories/drizzle/drizzleCategoryRepository';
import { DrizzleExpenseRepository } from './shared/repositories/drizzle/drizzleExpenseRepository';
import { DrizzleHealthRepository } from './shared/repositories/drizzle/drizzleHealthRepository';
import { DrizzlePaymentSourceRepository } from './shared/repositories/drizzle/drizzlePaymentSourceRepository';
import { DrizzleSpaceRepository } from './shared/repositories/drizzle/drizzleSpaceRepository';
import { DrizzleUserRepository } from './shared/repositories/drizzle/drizzleUserRepository';
import { CategorySeeder } from './shared/repositories/drizzle/categorySeeder';

const categorySeeder = new CategorySeeder();

const categoryRepository = new DrizzleCategoryRepository(db);
const expenseRepository = new DrizzleExpenseRepository(db);
const healthRepository = new DrizzleHealthRepository(db);
const paymentSourceRepository = new DrizzlePaymentSourceRepository(db);
const spaceRepository = new DrizzleSpaceRepository(db, categorySeeder);
const userRepository = new DrizzleUserRepository(db, categorySeeder);

const sessionService = new SessionService();
const googleIdentityService = new GoogleIdentityService();
const spaceService = new SpaceService(spaceRepository);
const categoryService = new CategoryService();
const expenseService = new ExpenseService();
const paymentSourceService = new PaymentSourceService();

const signInWithGoogleUseCase = new SignInWithGoogleUseCase(
	userRepository,
	sessionService,
	googleIdentityService,
);
const getSessionUseCase = new GetSessionUseCase(userRepository);
const checkHealthUseCase = new CheckHealthUseCase(healthRepository);
const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
const createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
	categoryRepository,
	categoryService,
);
const renameCategoryGroupUseCase = new RenameCategoryGroupUseCase(
	categoryRepository,
	categoryService,
);
const createCategoryUseCase = new CreateCategoryUseCase(
	categoryRepository,
	categoryService,
);
const updateCategoryUseCase = new UpdateCategoryUseCase(
	categoryRepository,
	categoryService,
);
const setCategoryArchivedUseCase = new SetCategoryArchivedUseCase(
	categoryRepository,
	categoryService,
);
const createExpenseUseCase = new CreateExpenseUseCase(
	expenseRepository,
	categoryRepository,
	paymentSourceRepository,
	expenseService,
	paymentSourceService,
);
const listSpacesUseCase = new ListSpacesUseCase(spaceRepository);
const createSpaceUseCase = new CreateSpaceUseCase(spaceRepository);
const renameSpaceUseCase = new RenameSpaceUseCase(spaceRepository);
const setSpaceArchivedUseCase = new SetSpaceArchivedUseCase(
	spaceRepository,
	spaceService,
);
const listPaymentSourcesUseCase = new ListPaymentSourcesUseCase(
	paymentSourceRepository,
);
const createPaymentSourceUseCase = new CreatePaymentSourceUseCase(
	paymentSourceRepository,
	paymentSourceService,
);
const renamePaymentSourceUseCase = new RenamePaymentSourceUseCase(
	paymentSourceRepository,
	paymentSourceService,
);
const setPaymentSourceArchivedUseCase = new SetPaymentSourceArchivedUseCase(
	paymentSourceRepository,
	paymentSourceService,
);

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
const postCategoryGroupController = new PostCategoryGroupController(
	createCategoryGroupUseCase,
);
const patchCategoryGroupController = new PatchCategoryGroupController(
	renameCategoryGroupUseCase,
);
const postCategoryController = new PostCategoryController(
	createCategoryUseCase,
);
const patchCategoryController = new PatchCategoryController(
	updateCategoryUseCase,
);
const patchCategoryArchiveController = new PatchCategoryArchiveController(
	setCategoryArchivedUseCase,
);
const postExpenseController = new PostExpenseController(createExpenseUseCase);
const getSpacesController = new GetSpacesController(listSpacesUseCase);
const postSpaceController = new PostSpaceController(createSpaceUseCase);
const patchSpaceController = new PatchSpaceController(renameSpaceUseCase);
const patchSpaceArchiveController = new PatchSpaceArchiveController(
	setSpaceArchivedUseCase,
);
const getPaymentSourcesController = new GetPaymentSourcesController(
	listPaymentSourcesUseCase,
);
const postPaymentSourceController = new PostPaymentSourceController(
	createPaymentSourceUseCase,
);
const patchPaymentSourceController = new PatchPaymentSourceController(
	renamePaymentSourceUseCase,
);
const patchPaymentSourceArchiveController =
	new PatchPaymentSourceArchiveController(setPaymentSourceArchivedUseCase);

export {
	sessionService,
	spaceService,
	getCategoriesController,
	postCategoryController,
	patchCategoryController,
	patchCategoryArchiveController,
	postCategoryGroupController,
	patchCategoryGroupController,
	postExpenseController,
	getCheckHealthController,
	postGoogleSignInController,
	getSessionController,
	postSignOutController,
	getSpacesController,
	postSpaceController,
	patchSpaceController,
	patchSpaceArchiveController,
	getPaymentSourcesController,
	postPaymentSourceController,
	patchPaymentSourceController,
	patchPaymentSourceArchiveController,
};
