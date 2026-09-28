import type { Currency, RecurringItem, RecurringKind } from '@walti/shared';
import { Archive, ArchiveRestore, Pause, Pencil, Play, Repeat } from 'lucide-react';
import { useState } from 'react';
import { EditRecurringItemForm } from '@/features/recurring/components/editRecurringItemForm';
import {
	useArchiveRecurringItem,
	usePauseRecurringItem,
	useResumeRecurringItem,
	useUnarchiveRecurringItem,
} from '@/features/recurring/hooks/useRecurringMutations';
import { nextDueDate } from '@/features/recurring/nextDueDate';
import { formatCivilDate, formatMonthShort } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { cn } from '@/lib/utils';
import { ArchivedBadge } from '@/shared/components/archivedBadge';
import { ConfirmDialog } from '@/shared/components/confirmDialog';
import { rowActionButtonClasses as actionClasses } from '@/shared/styles/rowActionButtonClasses';

const kindLabels: Record<RecurringKind, string> = {
	automatic: 'Automático',
	manual: 'Manual',
};

const typeBadgeClasses =
	'inline-flex w-fit shrink-0 items-center rounded-full border border-muted-foreground px-1.5 py-0.5 text-xs text-foreground';

const scheduleText = (item: RecurringItem, showNextDue: boolean): string => {
	if (showNextDue) {
		return `Próximo: ${formatCivilDate(nextDueDate(item, new Date()))}`;
	}

	return item.frequency === 'monthly'
		? `Cada mes, día ${item.anchorDay}`
		: `Cada año, ${item.anchorDay} de ${formatMonthShort(item.anchorMonth ?? 1)}`;
};

type RecurringItemRowProps = {
	spaceId: string;
	currency: Currency;
	item: RecurringItem;
	canEdit: boolean;
};

export const RecurringItemRow = ({
	spaceId,
	currency,
	item,
	canEdit,
}: RecurringItemRowProps) => {
	const [editing, setEditing] = useState(false);
	const pause = usePauseRecurringItem(spaceId);
	const resume = useResumeRecurringItem(spaceId);
	const archive = useArchiveRecurringItem(spaceId);
	const unarchive = useUnarchiveRecurringItem(spaceId);

	if (editing) {
		return (
			<li className="rounded-xl border border-border p-3">
				<EditRecurringItemForm
					spaceId={spaceId}
					currency={currency}
					item={item}
					onCancel={() => setEditing(false)}
					onSaved={() => setEditing(false)}
				/>
			</li>
		);
	}
	
	const showNextDue = !item.pausedAt && !item.archivedAt;

	return (
		<li className="flex flex-col gap-1 rounded-xl border border-border p-3">
			<div className="flex items-center gap-3">
				<Repeat className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />

				<span className="flex min-w-0 flex-1 items-center gap-1.5">
					<span
						className={cn(
							'min-w-0 shrink truncate text-sm font-medium',
							item.archivedAt && 'text-muted-foreground',
						)}
					>
						{item.name}
					</span>

					<span className={typeBadgeClasses}>{kindLabels[item.kind]}</span>
					{item.pausedAt ? <ArchivedBadge label="Pausado" /> : null}
					{item.archivedAt ? <ArchivedBadge /> : null}
				</span>

				<span className="shrink-0 text-sm font-semibold tabular-nums">
					{formatMoney(item.expectedAmountCents, currency)}
				</span>

				{!canEdit ? null : item.archivedAt ? (
					<button
						type="button"
						onClick={() => unarchive.mutate(item.id)}
						disabled={unarchive.isPending}
						aria-label={`Recuperar ${item.name}`}
						className={actionClasses}
					>
						<ArchiveRestore className="size-4" aria-hidden="true" />
					</button>
				) : (
					<>
						<button
							type="button"
							onClick={() =>
								item.pausedAt ? resume.mutate(item.id) : pause.mutate(item.id)
							}
							disabled={pause.isPending || resume.isPending}
							aria-label={item.pausedAt ? `Reanudar ${item.name}` : `Pausar ${item.name}`}
							className={actionClasses}
						>
							{item.pausedAt ? (
								<Play className="size-4" aria-hidden="true" />
							) : (
								<Pause className="size-4" aria-hidden="true" />
							)}
						</button>

						<button
							type="button"
							onClick={() => setEditing(true)}
							aria-label={`Editar ${item.name}`}
							className={actionClasses}
						>
							<Pencil className="size-4" aria-hidden="true" />
						</button>

						<ConfirmDialog
							title={`¿Archivar ${item.name}?`}
							description="Desaparece de la lista de recurrentes activos, pero sus gastos y su histórico se conservan y puedes recuperarlo desde aquí."
							confirmLabel="Archivar"
							onConfirm={() => archive.mutate(item.id)}
							trigger={
								<button
									type="button"
									disabled={archive.isPending}
									aria-label={`Archivar ${item.name}`}
									className={actionClasses}
								>
									<Archive className="size-4" aria-hidden="true" />
								</button>
							}
						/>
					</>
				)}
			</div>

			<span className="truncate pl-8 text-xs text-muted-foreground">
				{scheduleText(item, showNextDue)}
			</span>
		</li>
	);
};
