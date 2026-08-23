import type { Context } from 'hono';
import { respond } from '../../../shared/http/response';
import type { HealthService } from '../services/healthService';

export class GetCheckHealthController {
	constructor(private readonly service: HealthService) {}

	async handle(c: Context) {
		const report = await this.service.check();

		if (report.status === 'ok') {
			return respond(c, report, 200);
		}

		return respond(c, report, 503);
	}
}
