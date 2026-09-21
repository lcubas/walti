import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { SpaceRepository } from '../../../shared/repositories/spaceRepository';
import type { SpaceService } from '../services/spaceService';

export class SetSpaceArchivedUseCase {
	constructor(
		private readonly spaceRepository: SpaceRepository,
		private readonly spaceService: SpaceService,
	) {}

	async execute(
		space: SpaceAccess,
		userId: string,
		archived: boolean,
	): Promise<void> {
		if (!archived) {
			await this.spaceRepository.setArchivedAt(space.id, null);
			return;
		}

		const spaces = await this.spaceRepository.listForUser(userId);
		const current = spaces.find((candidate) => candidate.id === space.id);

		if (!current) {
			throw new NotFoundError(
				'space_not_found',
				'Ese espacio no existe o no es tuyo.',
			);
		}

		this.spaceService.verifyCanArchive(current, spaces);

		await this.spaceRepository.setArchivedAt(
			space.id,
			new Date().toISOString(),
		);
	}
}
