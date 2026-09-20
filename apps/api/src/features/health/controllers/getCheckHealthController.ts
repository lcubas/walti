import type { Context } from 'hono';
import { respond } from '../../../shared/http/response';
import type { CheckHealthUseCase } from '../useCases/checkHealthUseCase';

export class GetCheckHealthController {
	constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

	async handle(c: Context) {
		const report = await this.checkHealthUseCase.execute();

		if (report.status === 'ok') {
			return respond(c, report, 200);
		}

		return respond(c, report, 503);
	}
}
