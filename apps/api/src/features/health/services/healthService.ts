import type { HealthReport } from '@walti/shared';
import type { HealthRepository } from '../../../shared/repositories/healthRepository';

export class HealthService {
	constructor(private readonly healthRepository: HealthRepository) {}

	async check(): Promise<HealthReport> {
		try {
			await this.healthRepository.ping();
			return { status: 'ok', database: 'up' };
		} catch {
			return { status: 'degraded', database: 'down' };
		}
	}
}
