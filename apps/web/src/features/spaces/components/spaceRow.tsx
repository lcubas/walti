import { Archive, ArchiveRestore, Pencil, Users } from 'lucide-react';
import { RenameSpaceRequest } from '@walti/shared';
import { useState } from 'react';
import {
	useArchiveSpace,
	useRenameSpace,
	useUnarchiveSpace,
} from '@/features/spaces/hooks/useSpaceMutations';
import { SpaceAvatar } from '@/features/spaces/components/spaceAvatar';
import { ArchivedBadge } from '@/shared/components/archivedBadge';
import { NameForm } from '@/shared/components/nameForm';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/shared/components/confirmDialog';
import type { Space } from '@/shared/spaces/spacesApi';
import { rowActionButtonClasses as actionClasses } from '@/shared/styles/rowActionButtonClasses';

type SpaceRowProps = {
	space: Space;
	canArchive: boolean;
	/** Every other space of this user, so renaming cannot land on one. */
	takenNames: string[];
};

export const SpaceRow = ({ space, canArchive, takenNames }: SpaceRowProps) => {
	const [renaming, setRenaming] = useState(false);
	const rename = useRenameSpace();
	const archive = useArchiveSpace();
	const unarchive = useUnarchiveSpace();

	if (renaming) {
		return (
			<li className="rounded-xl border border-border p-3">
				<NameForm
					schema={RenameSpaceRequest}
					placeholder="Hogar"
					duplicateMessage="Ya tienes un espacio con ese nombre."
					label="Nombre del espacio"
					submitLabel="Guardar"
					initialName={space.name}
					takenNames={takenNames}
					pending={rename.isPending}
					onCancel={() => setRenaming(false)}
					onSubmit={(name) =>
						rename.mutate(
							{ spaceId: space.id, name },
							{ onSuccess: () => setRenaming(false) },
						)
					}
				/>
			</li>
		);
	}

	return (
		<li className="flex items-center gap-3 rounded-xl border border-border p-3">
			<SpaceAvatar space={space} />

			<span className="flex min-w-0 flex-1 flex-col">
				<span
					className={cn(
						'truncate text-sm font-medium',
						space.archivedAt && 'text-muted-foreground',
					)}
				>
					{space.name}
				</span>

				<span className="flex items-center gap-2 text-xs text-muted-foreground">
					{space.isDefault ? <span>Personal</span> : null}

					{space.members > 1 ? (
						<span className="flex items-center gap-1">
							<Users className="size-3" aria-hidden="true" />
							{space.members}
						</span>
					) : (
						<span>Privado</span>
					)}
				</span>
			</span>

			{space.archivedAt ? <ArchivedBadge /> : null}

			{space.archivedAt ? (
				<button
					type="button"
					onClick={() => unarchive.mutate(space.id)}
					disabled={unarchive.isPending}
					aria-label={`Recuperar ${space.name}`}
					className={actionClasses}
				>
					<ArchiveRestore className="size-4" aria-hidden="true" />
				</button>
			) : (
				<>
					<button
						type="button"
						onClick={() => setRenaming(true)}
						aria-label={`Renombrar ${space.name}`}
						className={actionClasses}
					>
						<Pencil className="size-4" aria-hidden="true" />
					</button>

					<ConfirmDialog
						title={`¿Archivar ${space.name}?`}
						description="Desaparece del conmutador, pero su histórico se conserva y puedes recuperarlo desde aquí."
						confirmLabel="Archivar"
						onConfirm={() => archive.mutate(space.id)}
						trigger={
							<button
								type="button"
								disabled={!canArchive || archive.isPending}
								aria-label={`Archivar ${space.name}`}
								title={
									canArchive
										? undefined
										: 'No puedes archivar tu único espacio activo'
								}
								className={cn(actionClasses, 'disabled:opacity-40')}
							>
								<Archive className="size-4" aria-hidden="true" />
							</button>
						}
					/>
				</>
			)}
		</li>
	);
};
