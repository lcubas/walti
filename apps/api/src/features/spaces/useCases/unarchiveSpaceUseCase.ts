import { spaceRoles } from '@walti/shared';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceRepository } from '../../../shared/repositories/spaceRepository';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';

export class UnarchiveSpaceUseCase {
	constructor(private readonly spaceRepository: SpaceRepository) {}

	async execute(spaceId: string, userId: string): Promise<void> {
		const space = await this.spaceRepository.findForUser(spaceId, userId);

		if (!space) {
			throw new NotFoundError(
				'space_not_found',
				'Ese espacio no existe o no es tuyo.',
			);
		}

		if (space.role !== spaceRoles.owner) {
			throw new ForbiddenError(
				'space_not_owned',
				'Solo quien administra el espacio puede cambiarlo.',
			);
		}

		await this.spaceRepository.setArchivedAt(spaceId, null);
	}
}
