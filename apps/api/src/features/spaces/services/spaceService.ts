import { ConflictError } from '../../../shared/errors/conflictError';
import type { SpaceMembership } from '../../../shared/repositories/spaceRepository';

export class SpaceService {
	verifyCanArchive(space: SpaceMembership, spaces: SpaceMembership[]): void {
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
	}
}
