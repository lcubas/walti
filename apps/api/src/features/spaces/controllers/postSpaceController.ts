import type { Context } from 'hono';
import type { CreateSpaceRequest } from '@walti/shared';
import { created } from '../../../shared/http/response';
import type { SessionContext } from '../../../shared/http/requestContext';
import type { CreateSpaceUseCase } from '../useCases/createSpaceUseCase';

export class PostSpaceController {
	constructor(private readonly createSpaceUseCase: CreateSpaceUseCase) {}

	async handle(c: Context<SessionContext>, { name }: CreateSpaceRequest) {
		const space = await this.createSpaceUseCase.execute(c.get('userId'), name);

		return created(c, space);
	}
}
