import type { HealthRepository } from '../../../shared/repositories/healthRepository';

export type HealthReport = {
	status: 'ok' | 'degraded';
	database: 'up' | 'down';
};

export class HealthService {
	constructor(private readonly repository: HealthRepository) {}

	async check(): Promise<HealthReport> {
		try {
			await this.repository.ping();
			return { status: 'ok', database: 'up' };
		} catch {
			return { status: 'degraded', database: 'down' };
		}
	}
}
