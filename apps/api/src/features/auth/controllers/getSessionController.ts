import type { Context } from 'hono';
import type { RequestContext } from '../../../shared/http/requestContext';
import { ok } from '../../../shared/http/response';
import type { AuthService } from '../services/authService';

export class GetSessionController {
	constructor(private readonly authService: AuthService) {}

	async handle(c: Context<RequestContext>) {
		const user = await this.authService.getSessionUser(c.get('userId'));

		return ok(c, user);
	}
}
