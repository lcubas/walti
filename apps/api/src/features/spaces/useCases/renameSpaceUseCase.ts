import type { SpaceAccess } from '../../../shared/http/requestContext';
import type { SpaceRepository } from '../../../shared/repositories/spaceRepository';

export class RenameSpaceUseCase {
	constructor(private readonly spaceRepository: SpaceRepository) {}

	async execute(space: SpaceAccess, name: string): Promise<void> {
		await this.spaceRepository.rename(space.id, name);
	}
}
