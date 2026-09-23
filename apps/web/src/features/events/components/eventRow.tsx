import type { Currency, Event } from '@walti/shared';
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
import { formatMoney } from '@/lib/format/money';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/shared/components/confirmDialog';
import { paths } from '@/shared/routes';

const actionClasses =
	'inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';

type EventRowProps = {
	spaceId: string;
	event: Event;
	currency: Currency;
	canEdit: boolean;
};

export const EventRow = ({
	spaceId,
	event,
	currency,
	canEdit,
}: EventRowProps) => {
	const [editing, setEditing] = useState(false);
	const archive = useArchiveEvent(spaceId);
	const unarchive = useUnarchiveEvent(spaceId);

	if (editing) {
		return (
			<li className="rounded-xl border border-border p-3">
				<EditEventForm
					spaceId={spaceId}
					currency={currency}
					event={event}
					onCancel={() => setEditing(false)}
					onSaved={() => setEditing(false)}
				/>
			</li>
		);
	}

	return (
		<li className="flex items-center gap-3 rounded-xl border border-border p-3">
			<CalendarRange
				className="size-5 shrink-0 text-muted-foreground"
				aria-hidden="true"
			/>

			<Link
				to={`${paths.events}/${event.id}`}
				className="flex min-w-0 flex-1 flex-col"
			>
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
					{event.budgetCents !== null
						? ` · Presupuesto ${formatMoney(event.budgetCents, currency)}`
						: ''}
				</span>
			</Link>

			<ChevronRight
				className="size-4 shrink-0 text-muted-foreground"
				aria-hidden="true"
			/>

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
