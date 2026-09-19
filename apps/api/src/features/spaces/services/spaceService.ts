import { type Space, spaceRoles } from '@walti/shared';
import { ConflictError } from '../../../shared/errors/conflictError';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type {
	SpaceMembership,
	SpaceRepository,
} from '../../../shared/repositories/spaceRepository';

export class SpaceService {
	constructor(private readonly spaceRepository: SpaceRepository) {}

	listSpaces(userId: string): Promise<Space[]> {
		return this.spaceRepository.listForUser(userId);
	}

	async createSpace(userId: string, name: string): Promise<Space> {
		const spaces = await this.spaceRepository.listForUser(userId);

		this.verifyFreeName(spaces, name);

		return this.spaceRepository.createForOwner(userId, name);
	}

	async renameSpace(
		spaceId: string,
		userId: string,
		name: string,
	): Promise<void> {
		await this.requireOwnedSpace(spaceId, userId);

		await this.spaceRepository.rename(spaceId, name);
	}

	async archiveSpace(spaceId: string, userId: string): Promise<void> {
		const { space, spaces } = await this.requireOwnedSpace(spaceId, userId);

		// The space born with the account is where the app falls back when
		// anything else becomes unavailable, so it has to stay reachable.
		if (space.isDefault) {
			throw new ConflictError(
				'space_is_default',
				'El espacio personal no se puede archivar.',
			);
		}

		// Nobody can be left without somewhere to register an expense.
		const active = spaces.filter((candidate) => !candidate.archivedAt);

		if (!space.archivedAt && active.length <= 1) {
			throw new ConflictError(
				'last_active_space',
				'Es tu único espacio activo. Crea otro antes de archivarlo.',
			);
		}

		await this.spaceRepository.setArchivedAt(spaceId, new Date().toISOString());
	}

	async unarchiveSpace(spaceId: string, userId: string): Promise<void> {
		await this.requireOwnedSpace(spaceId, userId);

		await this.spaceRepository.setArchivedAt(spaceId, null);
	}

	private verifyFreeName(spaces: SpaceMembership[], name: string): void {
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
	}

	private async requireOwnedSpace(
		spaceId: string,
		userId: string,
	): Promise<{ space: SpaceMembership; spaces: SpaceMembership[] }> {
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

		return { space, spaces };
	}
}
