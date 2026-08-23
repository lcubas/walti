import { GetCheckHealthController } from './features/health/controllers/getCheckHealthController';
import { HealthService } from './features/health/services/healthService';
import { db } from './shared/database/client';
import { DrizzleHealthRepository } from './shared/repositories/drizzle/drizzleHealthRepository';

const healthRepository = new DrizzleHealthRepository(db);
const healthService = new HealthService(healthRepository);

export const container = {
	getCheckHealthController: new GetCheckHealthController(healthService),
};

export type Container = typeof container;
