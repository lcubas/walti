import { type SpaceRole, spaceRoles } from '@walti/shared';
import { ConflictError } from '../../../shared/errors/conflictError';
import { ForbiddenError } from '../../../shared/errors/forbiddenError';
import { NotFoundError } from '../../../shared/errors/notFoundError';
import type { SpaceAccess } from '../../../shared/http/requestContext';
import type {
	SpaceMembership,
	SpaceRepository,
} from '../../../shared/repositories/spaceRepository';

export class SpaceService {
	constructor(private readonly spaceRepository: SpaceRepository) {}

	async requireAccess(spaceId: string, userId: string): Promise<SpaceAccess> {
		const space = await this.spaceRepository.findForUser(spaceId, userId);

		// Not 403: confirming it exists already tells the asker something.
		if (!space) {
			throw new NotFoundError(
				'space_not_found',
				'Ese espacio no existe o no es tuyo.',
			);
		}

		return { id: space.id, role: space.role };
	}

	verifyOwnership(role: SpaceRole): void {
		if (role !== spaceRoles.owner) {
			throw new ForbiddenError(
				'space_not_owned',
				'Solo quien administra el espacio puede cambiarlo.',
			);
		}
	}

	verifyFreeName(spaces: SpaceMembership[], name: string): void {
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

	verifyCanArchive(space: SpaceMembership, spaces: SpaceMembership[]): void {
		// The app falls back to it when anything else becomes unavailable.
		if (space.isDefault) {
			throw new ConflictError(
				'space_is_default',
				'El espacio personal no se puede archivar.',
			);
		}

		const active = spaces.filter((candidate) => !candidate.archivedAt);

		if (!space.archivedAt && active.length <= 1) {
			throw new ConflictError(
				'last_active_space',
				'Es tu único espacio activo. Crea otro antes de archivarlo.',
			);
		}
	}
}
