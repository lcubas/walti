import { spaceRoles } from '@walti/shared';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceRepository } from '../../../shared/repositories/spaceRepository';
import type { SpaceService } from '../services/spaceService';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';

export class ArchiveSpaceUseCase {
	constructor(
		private readonly spaceRepository: SpaceRepository,
		private readonly spaceService: SpaceService,
	) {}

	async execute(spaceId: string, userId: string): Promise<void> {
		const spaces = await this.spaceRepository.listForUser(userId);
		const space = spaces.find((candidate) => candidate.id === spaceId);

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

		this.spaceService.verifyCanArchive(space, spaces);

		await this.spaceRepository.setArchivedAt(spaceId, new Date().toISOString());
	}
}
