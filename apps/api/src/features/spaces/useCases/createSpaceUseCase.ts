import type { Space } from '@walti/shared';
import type { SpaceRepository } from '../../../shared/repositories/spaceRepository';
import { ConflictError } from '../../../shared/errors/conflictError';

export class CreateSpaceUseCase {
	constructor(private readonly spaceRepository: SpaceRepository) {}

	async execute(userId: string, name: string): Promise<Space> {
		const spaces = await this.spaceRepository.listForUser(userId);

		const wanted = name.trim().toLocaleLowerCase();
		const taken = spaces.some(
			(space) => space.name.trim().toLocaleLowerCase() === wanted,
		);

		if (taken) {
			throw new ConflictError(
				'space_name_taken',
				'Ya tienes un espacio con ese nombre.',
			);
		}

		return this.spaceRepository.createForOwner(userId, name);
	}
}
