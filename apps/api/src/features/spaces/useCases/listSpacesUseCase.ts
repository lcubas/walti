import type { Space } from '@walti/shared';
import type { SpaceRepository } from '../../../shared/repositories/spaceRepository';

export class ListSpacesUseCase {
	constructor(private readonly spaceRepository: SpaceRepository) {}

	execute(userId: string): Promise<Space[]> {
		return this.spaceRepository.listForUser(userId);
	}
}
