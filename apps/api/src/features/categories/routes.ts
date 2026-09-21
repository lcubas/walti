import { Hono } from 'hono';
import {
	ArchiveRequest,
	CategoryGroupIdParam,
	CategoryIdParam,
	CreateCategoryGroupRequest,
	CreateCategoryRequest,
	RenameCategoryGroupRequest,
	SpaceIdParam,
	UpdateCategoryRequest,
} from '@walti/shared';
import {
	getCategoriesController,
	patchCategoryArchiveController,
	patchCategoryController,
	patchCategoryGroupController,
	postCategoryController,
	postCategoryGroupController,
} from '../../container';
import { spaceHandler } from '../../shared/http/middlewares/spaceHandler';
import { spaceOwnerHandler } from '../../shared/http/middlewares/spaceOwnerHandler';
import { validatorHandler } from '../../shared/http/middlewares/validatorHandler';
import type { SpaceContext } from '../../shared/http/requestContext';

export const categoryRoutes = new Hono<SpaceContext>();

categoryRoutes.use('/*', validatorHandler.param(SpaceIdParam), spaceHandler);

// By method, so a write route added later is covered without remembering to.
categoryRoutes.on(['POST', 'PATCH', 'DELETE'], '/*', spaceOwnerHandler);

categoryRoutes.get('/', (c) => getCategoriesController.handle(c));

categoryRoutes.post('/', validatorHandler.json(CreateCategoryRequest), (c) =>
	postCategoryController.handle(c, c.req.valid('json')),
);

categoryRoutes.patch(
	'/:categoryId',
	validatorHandler.param(CategoryIdParam),
	validatorHandler.json(UpdateCategoryRequest),
	(c) =>
		patchCategoryController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);

categoryRoutes.patch(
	'/:categoryId/archive',
	validatorHandler.param(CategoryIdParam),
	validatorHandler.json(ArchiveRequest),
	(c) =>
		patchCategoryArchiveController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);

categoryRoutes.post(
	'/groups',
	validatorHandler.json(CreateCategoryGroupRequest),
	(c) => postCategoryGroupController.handle(c, c.req.valid('json')),
);

categoryRoutes.patch(
	'/groups/:groupId',
	validatorHandler.param(CategoryGroupIdParam),
	validatorHandler.json(RenameCategoryGroupRequest),
	(c) =>
		patchCategoryGroupController.handle(
			c,
			c.req.valid('param'),
			c.req.valid('json'),
		),
);
