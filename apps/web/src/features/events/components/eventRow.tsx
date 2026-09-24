import type { Event } from '@walti/shared';
import {
	Archive,
	ArchiveRestore,
	CalendarRange,
	ChevronRight,
	Pencil,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { EditEventForm } from '@/features/events/components/editEventForm';
import { ArchivedBadge } from '@/shared/components/archivedBadge';
import {
	useArchiveEvent,
	useUnarchiveEvent,
} from '@/features/events/hooks/useEventMutations';
import { formatCivilDate } from '@/lib/format/date';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/shared/components/confirmDialog';
import { paths } from '@/shared/routes';
import { rowActionButtonClasses as actionClasses } from '@/shared/styles/rowActionButtonClasses';

type EventRowProps = {
	spaceId: string;
	event: Event;
	canEdit: boolean;
};

export const EventRow = ({ spaceId, event, canEdit }: EventRowProps) => {
	const [editing, setEditing] = useState(false);
	const archive = useArchiveEvent(spaceId);
	const unarchive = useUnarchiveEvent(spaceId);

	if (editing) {
		return (
			<li className="rounded-xl border border-border p-3">
				<EditEventForm
					spaceId={spaceId}
					event={event}
					onCancel={() => setEditing(false)}
					onSaved={() => setEditing(false)}
				/>
			</li>
		);
	}

	return (
		<li className="flex items-center gap-3 rounded-xl border border-border p-3">
			<Link
				to={`${paths.events}/${event.id}`}
				aria-label={`Ver detalle de ${event.name}, ${formatCivilDate(event.startsOn)} – ${formatCivilDate(event.endsOn)}`}
				className="-m-1 flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
			>
				<CalendarRange
					className="size-5 shrink-0 text-muted-foreground"
					aria-hidden="true"
				/>

				<span className="flex min-w-0 flex-1 flex-col">
					<span
						className={cn(
							'truncate text-sm font-medium',
							event.archivedAt && 'text-muted-foreground',
						)}
					>
						{event.name}
					</span>

					<span className="truncate text-xs text-muted-foreground">
						{formatCivilDate(event.startsOn)} – {formatCivilDate(event.endsOn)}
					</span>
				</span>

				<ChevronRight
					className="size-4 shrink-0 text-muted-foreground"
					aria-hidden="true"
				/>
			</Link>

			{event.archivedAt ? <ArchivedBadge /> : null}

			{!canEdit ? null : event.archivedAt ? (
				<button
					type="button"
					onClick={() => unarchive.mutate(event.id)}
					disabled={unarchive.isPending}
					aria-label={`Recuperar ${event.name}`}
					className={actionClasses}
				>
					<ArchiveRestore className="size-4" aria-hidden="true" />
				</button>
			) : (
				<>
					<button
						type="button"
						onClick={() => setEditing(true)}
						aria-label={`Editar ${event.name}`}
						className={actionClasses}
					>
						<Pencil className="size-4" aria-hidden="true" />
					</button>

					<ConfirmDialog
						title={`¿Archivar ${event.name}?`}
						description="Desaparece de la lista de eventos activos, pero sus gastos y su histórico se conservan y puedes recuperarlo desde aquí."
						confirmLabel="Archivar"
						onConfirm={() => archive.mutate(event.id)}
						trigger={
							<button
								type="button"
								disabled={archive.isPending}
								aria-label={`Archivar ${event.name}`}
								className={actionClasses}
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
